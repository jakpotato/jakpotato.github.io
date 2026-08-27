import { FIRST_NAMES, LAST_NAMES, AVATARS } from "./data/names.js";
import { PERSONALITIES } from "./data/personalities.js";
import { SUBJECTS, TEMPLATES, COMMENT_TEMPLATES, TRENDS } from "./data/content.js";

const STORAGE = {
  user: "clowder_user_v1",
  people: "clowder_people_v1",
  customPosts: "clowder_custom_posts_v1"
};

const state = {
  posts: [],
  visibleCount: 0,
  filter: "all",
  search: "",
  loading: false
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function id(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
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

function getPerson() {
  const people = getPeople();
  if (people.length < 20) {
    for (let i = people.length; i < 20; i++) people.push(makePerson());
    savePeople(people);
  }
  return random(people);
}

function getPersonById(personId) {
  return getPeople().find(p => p.id === personId) || getPerson();
}

function makeText(personalityId) {
  const personality = PERSONALITIES.find(p => p.id === personalityId) || random(PERSONALITIES);

  if (Math.random() < 0.65) {
    const starter = random(personality.starters);
    const subject = random(personality.subjects);
    return `${starter} ${subject}.`;
  }

  const type = random(Object.keys(TEMPLATES));
  return random(TEMPLATES[type]).replaceAll("{subject}", random(SUBJECTS));
}

function makeComments() {
  const count = Math.floor(Math.random() * 4);
  return Array.from({ length: count }, () => ({
    id: id("comment"),
    personId: getPerson().id,
    text: random(COMMENT_TEMPLATES)
  }));
}

function makePost() {
  const person = getPerson();
  const personality = PERSONALITIES.find(p => p.id === person.personality);
  const categories = ["thought", "opinion", "rant", "question", "love", "vague"];
  const category = random(categories);

  return {
    id: id("post"),
    personId: person.id,
    text: Math.random() < 0.65 ? makeText(personality.id) : random(TEMPLATES[category === "vague" ? "vague" : category]),
    category,
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
    return JSON.parse(localStorage.getItem(STORAGE.customPosts)) || [];
  } catch {
    return [];
  }
}

function saveCustomPost(post) {
  const posts = loadCustomPosts();
  posts.unshift(post);
  localStorage.setItem(STORAGE.customPosts, JSON.stringify(posts.slice(0, 100)));
}

function generatePosts(count) {
  for (let i = 0; i < count; i++) state.posts.push(makePost());
}

function formatTime(timestamp) {
  const diff = Date.now() - timestamp;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "just now";
  if (diff < hour) return `${Math.floor(diff / minute)}m`;
  if (diff < day) return `${Math.floor(diff / hour)}h`;
  if (diff < 7 * day) return `${Math.floor(diff / day)}d`;
  return new Date(timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" });
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

function totalReactions(post) {
  return Object.values(post.reactions).reduce((a, b) => a + b, 0);
}

function renderFeed(reset = false) {
  const feed = $("#feed");
  if (reset) {
    feed.innerHTML = "";
    state.visibleCount = 0;
  }

  const posts = visiblePosts();
  const next = posts.slice(state.visibleCount, state.visibleCount + 10);

  next.forEach(post => feed.appendChild(renderPost(post)));
  state.visibleCount += next.length;

  $("#emptyState").classList.toggle("hidden", posts.length !== 0);
}

function renderPost(post) {
  const fragment = $("#postTemplate").content.cloneNode(true);
  const article = fragment.querySelector(".post");
  const person = getPersonById(post.personId);

  article.dataset.id = post.id;
  fragment.querySelector(".post-avatar").textContent = person.avatar;
  fragment.querySelector(".post-name").textContent = person.name;
  fragment.querySelector(".handle").textContent = `@${person.name.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
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

  return fragment;
}

function updateUserUI() {
  const user = JSON.parse(localStorage.getItem(STORAGE.user));
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
  state.posts = loadCustomPosts();
  generatePosts(35);
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

$("#loginForm").addEventListener("submit", e => {
  e.preventDefault();
  $("#loginScreen").classList.add("hidden");
  $("#nameScreen").classList.remove("hidden");
  $("#displayName").focus();
});

$("#nameForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("#displayName").value.trim();
  if (!name) return;

  const user = {
    id: "local_user",
    name,
    avatar: random(AVATARS)
  };

  localStorage.setItem(STORAGE.user, JSON.stringify(user));
  startApp();
});

$("#logoutButton").addEventListener("click", () => {
  localStorage.removeItem(STORAGE.user);
  location.reload();
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

  const user = JSON.parse(localStorage.getItem(STORAGE.user));
  const post = {
    id: id("post"),
    personId: user.id,
    text,
    category: $("#postCategory").value,
    createdAt: Date.now(),
    reactions: { like: 0, laugh: 0, heart: 0, cat: 0 },
    comments: [],
    reacted: {}
  };

  saveCustomPost(post);
  state.posts.unshift(post);
  closeComposer();
  renderFeed(true);
});

$("#feed").addEventListener("click", e => {
  const article = e.target.closest(".post");
  if (!article) return;

  const post = state.posts.find(p => p.id === article.dataset.id);
  if (!post) return;

  const reactionButton = e.target.closest(".reaction-button");
  if (reactionButton) {
    const type = reactionButton.dataset.reaction;
    if (!post.reacted[type]) {
      post.reactions[type]++;
      post.reacted[type] = true;
      reactionButton.classList.add("selected");
      renderFeed(true);
    }
    return;
  }

  if (e.target.closest(".comment-button")) {
    article.querySelector(".comments").classList.toggle("hidden");
    return;
  }

  if (e.target.closest(".more-button")) {
    alert("There is nothing to report. This is Clowder.");
  }
});

$("#feed").addEventListener("submit", e => {
  if (!e.target.classList.contains("comment-form")) return;
  e.preventDefault();

  const article = e.target.closest(".post");
  const post = state.posts.find(p => p.id === article.dataset.id);
  const input = e.target.querySelector("input");
  const text = input.value.trim();
  if (!text) return;

  const user = JSON.parse(localStorage.getItem(STORAGE.user));
  post.comments.push({
    id: id("comment"),
    personId: user.id,
    text
  });

  input.value = "";
  renderFeed(true);
});

$$(".nav-item").forEach(button => {
  button.addEventListener("click", () => {
    $$(".nav-item").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    state.filter = button.dataset.filter;
    renderFeed(true);
  });
});

$("#searchInput").addEventListener("input", e => {
  state.search = e.target.value;
  renderFeed(true);
});

$("#homeButton").addEventListener("click", () => {
  state.filter = "all";
  state.search = "";
  $("#searchInput").value = "";
  $$(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.filter === "all"));
  renderFeed(true);
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  if (state.loading || state.search || state.filter !== "all") return;
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 700) {
    state.loading = true;
    $("#loadingIndicator").classList.remove("hidden");

    setTimeout(() => {
      generatePosts(15);
      renderFeed();
      state.loading = false;
      $("#loadingIndicator").classList.add("hidden");
    }, 250);
  }
});

window.addEventListener("keydown", e => {
  if (e.key === "Escape") closeComposer();
});

const existingUser = localStorage.getItem(STORAGE.user);
if (existingUser) {
  startApp();
} else {
  $("#loginScreen").classList.remove("hidden");
}
