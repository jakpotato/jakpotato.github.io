import { FIRST_NAMES, LAST_NAMES, AVATARS } from "./data/names.js";
import { PERSONALITIES } from "./data/personalities.js";
import { SUBJECTS, TEMPLATES, COMMENT_TEMPLATES, TRENDS } from "./data/content.js";

const STORAGE = {
  user: "clowder_user_v2",
  people: "clowder_people_v2",
  customPosts: "clowder_custom_posts_v2"
};

const state = {
  posts: [],
  visibleCount: 0,
  filter: "all",
  search: "",
  loading: false,
  reportPostId: null
};

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function id(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = String(value ?? "");
  return div.innerHTML;
}

function currentUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE.user));
  } catch {
    return null;
  }
}

function makePerson() {
  const personality = random(PERSONALITIES);
  return {
    id: id("person"),
    name: `${random(FIRST_NAMES)} ${random(LAST_NAMES)}`,
    avatar: random(AVATARS),
    personality: personality.id
  };
}

function getPeople() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE.people)) || [];
  } catch {
    return [];
  }
}

function savePeople(people) {
  localStorage.setItem(STORAGE.people, JSON.stringify(people));
}

function ensurePeople() {
  const people = getPeople();
  while (people.length < 30) people.push(makePerson());
  savePeople(people);
  return people;
}

function getPersonById(personId) {
  if (personId === "local_user") {
    return currentUser() || { id: "local_user", name: "You", avatar: "🙂" };
  }

  const people = ensurePeople();
  return people.find(p => p.id === personId) || people[0];
}

function getRandomFakePerson() {
  return random(ensurePeople());
}

function replaceTemplate(template, subject = random(SUBJECTS)) {
  // Replace every known placeholder before anything is displayed.
  return template
    .replaceAll("{subject}", subject)
    .replaceAll("{name}", getPersonById("local_user").name);
}

function makeText(personalityId) {
  const personality = PERSONALITIES.find(p => p.id === personalityId) || random(PERSONALITIES);

  if (Math.random() < 0.65) {
    const starter = random(personality.starters);
    const subject = random(personality.subjects);
    return `${starter} ${subject}.`;
  }

  const type = random(Object.keys(TEMPLATES));
  return replaceTemplate(random(TEMPLATES[type]));
}

function makeComments() {
  const count = Math.floor(Math.random() * 4);
  return Array.from({ length: count }, () => ({
    id: id("comment"),
    personId: getRandomFakePerson().id,
    text: replaceTemplate(random(COMMENT_TEMPLATES))
  }));
}

function makePost() {
  const person = getRandomFakePerson();
  const categories = ["thought", "opinion", "rant", "question", "love", "vague"];
  const category = random(categories);

  let text;
  if (Math.random() < 0.65) {
    text = makeText(person.personality);
  } else {
    const templateType = category === "vague" ? "vague" : category;
    text = replaceTemplate(random(TEMPLATES[templateType]));
  }

  return {
    id: id("post"),
    personId: person.id,
    text,
    "Post",
    createdAt: Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 72),
    reactions: {
      like: Math.floor(Math.random() * 70),
      laugh: Math.floor(Math.random() * 25),
      heart: Math.floor(Math.random() * 20),
      cat: Math.floor(Math.random() * 18)
    },
    comments: makeComments(),
    reacted: {}
  };
}

function loadCustomPosts() {
  try {
    const posts = JSON.parse(localStorage.getItem(STORAGE.customPosts)) || [];
    return posts.map(post => ({
      ...post,
      personId: "local_user",
      reactions: { like: 0, laugh: 0, heart: 0, cat: 0, ...(post.reactions || {}) },
      comments: Array.isArray(post.comments) ? post.comments : [],
      reacted: post.reacted || {}
    }));
  } catch {
    return [];
  }
}

function saveCustomPosts() {
  const custom = state.posts.filter(post => post.personId === "local_user");
  localStorage.setItem(STORAGE.customPosts, JSON.stringify(custom.slice(0, 100)));
}

function generatePosts(count) {
  for (let i = 0; i < count; i++) state.posts.push(makePost());
}

function formatTime(timestamp) {
  const diff = Math.max(0, Date.now() - timestamp);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "just now";
  if (diff < hour) return `${Math.floor(diff / minute)}m`;
  if (diff < day) return `${Math.floor(diff / hour)}h`;
  if (diff < 7 * day) return `${Math.floor(diff / day)}d`;
  return new Date(timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function totalReactions(post) {
  return Object.values(post.reactions).reduce((sum, value) => sum + Number(value || 0), 0);
}

function visiblePosts() {
  let posts = state.posts;

  if (state.filter === "popular") {
    posts = posts.filter(p => totalReactions(p) >= 35);
  } else if (state.filter === "questions") {
    posts = posts.filter(p => p.category === "question");
  } else if (state.filter === "rants") {
    posts = posts.filter(p => p.category === "rant");
  }

  if (state.search.trim()) {
    const q = state.search.toLowerCase();
    posts = posts.filter(p => {
      const person = getPersonById(p.personId);
      return p.text.toLowerCase().includes(q) || person.name.toLowerCase().includes(q);
    });
  }

  return posts;
}

function renderFeed(reset = false) {
  const feed = $("#feed");

  if (reset) {
    feed.innerHTML = "";
    state.visibleCount = 0;
  }

  const posts = visiblePosts();
  const next = posts.slice(state.visibleCount, state.visibleCount + 5);

  next.forEach(post => feed.appendChild(renderPost(post)));
  state.visibleCount += next.length;

  $("#emptyState").classList.toggle("hidden", posts.length !== 0);

  return next.length;
}

function renderPost(post) {
  const fragment = $("#postTemplate").content.cloneNode(true);
  const article = fragment.querySelector(".post");
  const person = getPersonById(post.personId);

  article.dataset.id = post.id;

  fragment.querySelector(".post-avatar").textContent = person.avatar;
  fragment.querySelector(".post-name").textContent = person.name;
  fragment.querySelector(".handle").textContent =
    `@${person.name.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
  fragment.querySelector(".timestamp").textContent = formatTime(post.createdAt);
  fragment.querySelector(".post-category").textContent = post.category;
  fragment.querySelector(".post-text").textContent = post.text;

  const counts = fragment.querySelectorAll(".reaction-button span");
  counts[0].textContent = post.reactions.like;
  counts[1].textContent = post.reactions.laugh;
  counts[2].textContent = post.reactions.heart;
  counts[3].textContent = post.reactions.cat;

  fragment.querySelector(".comment-count").textContent = post.comments.length;

  const commentsList = fragment.querySelector(".comments-list");

  post.comments.forEach(comment => {
    const commenter = getPersonById(comment.personId);
    const row = document.createElement("div");
    row.className = "comment";
    row.innerHTML = `
      <span class="avatar">${escapeHtml(commenter.avatar)}</span>
      <div class="comment-bubble">
        <strong>${escapeHtml(commenter.name)}</strong>
        ${escapeHtml(comment.text)}
      </div>
    `;
    commentsList.appendChild(row);
  });

  const preview = fragment.querySelector(".comment-preview");
  if (post.comments.length) {
    const last = post.comments[post.comments.length - 1];
    const commenter = getPersonById(last.personId);
    preview.textContent = `${commenter.name}: ${last.text}`;
    preview.classList.remove("hidden");
  }

  // Keep the current user's reaction highlighted after a re-render.
  const reactionButtons = fragment.querySelectorAll(".reaction-button");
  reactionButtons.forEach(button => {
    if (post.reacted?.[button.dataset.reaction]) {
      button.classList.add("selected");
    }
  });

  return fragment;
}

function updateUserUI() {
  const user = currentUser();
  if (!user) return;

  $("#headerName").textContent = user.name;
  $("#headerAvatar").textContent = user.avatar;
  $("#composerAvatar").textContent = user.avatar;
  $("#modalName").textContent = user.name;
  $("#modalAvatar").textContent = user.avatar;
}

function startApp() {
  $("#loginScreen").classList.add("hidden");
  $("#nameScreen").classList.add("hidden");
  $("#app").classList.remove("hidden");

  updateUserUI();
  ensurePeople();

  state.posts = loadCustomPosts();
  generatePosts(20);
  renderFeed(true);
  renderTrends();
}

function renderTrends() {
  $("#trends").innerHTML = TRENDS.slice(0, 5).map((trend, i) => `
    <div class="trend">
      <strong>#${i + 1}</strong> ${escapeHtml(trend)}
      <br><small>${Math.floor(Math.random() * 80 + 10)}K posts</small>
    </div>
  `).join("");
}

function openComposer(category = "thought") {
  $("#composeModal").classList.remove("hidden");
  $("#postCategory").value = category;
  $("#postText").focus();
}

function closeComposer() {
  $("#composeModal").classList.add("hidden");
  $("#postText").value = "";
  $("#characterCount").textContent = "0 / 500";
}

function openProfile() {
  const user = currentUser();
  if (!user) return;

  $("#profileName").value = user.name;
  renderAvatarPicker(user.avatar);
  $("#profileModal").classList.remove("hidden");
}

function closeProfile() {
  $("#profileModal").classList.add("hidden");
}

function renderAvatarPicker(selected) {
  $("#avatarPicker").innerHTML = AVATARS.map(avatar => `
    <button type="button" class="avatar-choice ${avatar === selected ? "selected" : ""}" data-avatar="${escapeHtml(avatar)}">
      ${escapeHtml(avatar)}
    </button>
  `).join("");
}

function openReport(postId) {
  state.reportPostId = postId;
  $("#reportConfirmation").classList.add("hidden");
  $("#reportReasons").classList.remove("hidden");
  $("#reportModal").classList.remove("hidden");
}

function closeReport() {
  state.reportPostId = null;
  $("#reportModal").classList.add("hidden");
}

function showMorePosts() {
  if (state.loading || state.search || state.filter !== "all") return;

  state.loading = true;
  $("#loadingIndicator").classList.remove("hidden");

  // A tiny delay makes the loading state visible without holding up the feed.
  setTimeout(() => {
    generatePosts(5);
    renderFeed();
    state.loading = false;
    $("#loadingIndicator").classList.add("hidden");
  }, 80);
}

// Login: explicitly prevent the browser's default form navigation.
$("#loginForm").addEventListener("submit", event => {
  event.preventDefault();
  event.stopPropagation();

  const email = $("#email").value.trim();
  const password = $("#password").value;

  if (!email || !password) return;

  $("#loginScreen").classList.add("hidden");
  $("#nameScreen").classList.remove("hidden");
  $("#displayName").focus();
});

$("#nameForm").addEventListener("submit", event => {
  event.preventDefault();
  event.stopPropagation();

  const name = $("#displayName").value.trim();
  if (!name) return;

  localStorage.setItem(STORAGE.user, JSON.stringify({
    id: "local_user",
    name,
    avatar: random(AVATARS)
  }));

  startApp();
});

$("#logoutButton").addEventListener("click", () => {
  localStorage.removeItem(STORAGE.user);
  location.reload();
});

$("#profileButton").addEventListener("click", openProfile);
$("#closeProfile").addEventListener("click", closeProfile);

$("#avatarPicker").addEventListener("click", event => {
  const choice = event.target.closest(".avatar-choice");
  if (!choice) return;

  $$(".avatar-choice").forEach(button => button.classList.remove("selected"));
  choice.classList.add("selected");
});

$("#saveProfile").addEventListener("click", () => {
  const user = currentUser();
  if (!user) return;

  const name = $("#profileName").value.trim();
  const selected = $(".avatar-choice.selected");

  if (!name || !selected) return;

  user.name = name;
  user.avatar = selected.dataset.avatar;
  localStorage.setItem(STORAGE.user, JSON.stringify(user));

  updateUserUI();
  closeProfile();
  renderFeed(true);
  saveCustomPosts();
});

$("#composerButton").addEventListener("click", () => openComposer());

$$("[data-compose]").forEach(button => {
  button.addEventListener("click", () => openComposer(button.dataset.compose));
});

$("#closeCompose").addEventListener("click", closeComposer);

$("#postText").addEventListener("input", () => {
  $("#characterCount").textContent = `${$("#postText").value.length} / 500`;
});

$("#publishButton").addEventListener("click", () => {
  const text = $("#postText").value.trim();
  if (!text) return;

  const post = {
    id: id("post"),
    personId: "local_user",
    text,
    category: $("#postCategory").value,
    createdAt: Date.now(),
    reactions: { like: 0, laugh: 0, heart: 0, cat: 0 },
    comments: [],
    reacted: {}
  };

  state.posts.unshift(post);
  saveCustomPosts();
  closeComposer();
  renderFeed(true);
  window.scrollTo({ top: 0, behavior: "smooth" });
});

$("#feed").addEventListener("click", event => {
  const article = event.target.closest(".post");
  if (!article) return;

  const post = state.posts.find(p => p.id === article.dataset.id);
  if (!post) return;

  const reactionButton = event.target.closest(".reaction-button");
  if (reactionButton) {
    const type = reactionButton.dataset.reaction;

    if (!post.reacted[type]) {
      post.reactions[type]++;
      post.reacted[type] = true;

      if (post.personId === "local_user") saveCustomPosts();
      renderFeed(true);
    }
    return;
  }

  if (event.target.closest(".comment-button")) {
    article.querySelector(".comments").classList.toggle("hidden");
    return;
  }

  if (event.target.closest(".more-button")) {
    openReport(post.id);
  }
});

$("#feed").addEventListener("submit", event => {
  if (!event.target.classList.contains("comment-form")) return;

  event.preventDefault();

  const article = event.target.closest(".post");
  const post = state.posts.find(p => p.id === article.dataset.id);
  const input = event.target.querySelector("input");
  const text = input.value.trim();

  if (!post || !text) return;

  post.comments.push({
    id: id("comment"),
    personId: "local_user",
    text
  });

  if (post.personId === "local_user") saveCustomPosts();

  input.value = "";
  renderFeed(true);
});

$("#reportReasons").addEventListener("click", event => {
  const button = event.target.closest("[data-reason]");
  if (!button) return;

  $("#reportReasons").classList.add("hidden");
  $("#reportConfirmation").textContent =
    `Report submitted as "${button.dataset.reason}". Thanks. The post will remain exactly where it is.`;
  $("#reportConfirmation").classList.remove("hidden");
});

$("#closeReport").addEventListener("click", closeReport);

$$(".nav-item").forEach(button => {
  button.addEventListener("click", () => {
    $$(".nav-item").forEach(b => b.classList.remove("active"));
    button.classList.add("active");

    state.filter = button.dataset.filter;
    renderFeed(true);
  });
});

$("#searchInput").addEventListener("input", event => {
  state.search = event.target.value;
  renderFeed(true);
});

$("#homeButton").addEventListener("click", () => {
  state.filter = "all";
  state.search = "";
  $("#searchInput").value = "";

  $$(".nav-item").forEach(button => {
    button.classList.toggle("active", button.dataset.filter === "all");
  });

  renderFeed(true);
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// More reliable infinite scrolling: observe a sentinel near the bottom
// rather than relying on document height/scroll events.
const sentinel = document.createElement("div");
sentinel.id = "feedSentinel";
sentinel.style.height = "1px";
$("#feed").after(sentinel);

const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) showMorePosts();
}, {
  root: null,
  rootMargin: "0px 0px 700px 0px",
  threshold: 0
});

observer.observe(sentinel);

window.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeComposer();
    closeProfile();
    closeReport();
  }
});

if (currentUser()) {
  startApp();
} else {
  $("#loginScreen").classList.remove("hidden");
}
