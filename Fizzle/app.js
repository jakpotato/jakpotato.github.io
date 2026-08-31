/* ============================================================
   FIZZLE — app logic
   Everything here lives in memory only: refreshing the page
   wipes the session, your posts, and any comments you added,
   by design (no localStorage/sessionStorage is used).
   ============================================================ */

(function () {
  "use strict";

  /* ---------------- state ---------------- */
  let currentUser = null;      // { firstName, lastName, emoji }
  let postIdSeq = 1;
  let minutesAgoCursor = 1;    // grows as older batches load
  let loading = false;

  /* ---------------- small helpers ---------------- */
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function fillTemplate(template) {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      switch (key) {
        case "topic": return pick(TOPICS);
        case "animal": return pick(ANIMALS);
        case "food": return pick(FOODS);
        case "place": return pick(PLACES);
        case "activity": return pick(ACTIVITIES);
        case "object": return pick(OBJECTS);
        case "time": return pick(TIMES);
        case "number": return pick(NUMBERS);
        case "name": return pick(FIRST_NAMES);
        default: return match;
      }
    });
  }

  function formatMinutesAgo(mins) {
    if (mins < 1) return "just now";
    if (mins < 60) return mins + "m";
    const hours = Math.floor(mins / 60);
    if (hours < 24) return hours + "h";
    const days = Math.floor(hours / 24);
    return days + "d";
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---------------- generators ---------------- */
  function generateRandomUser() {
    return {
      firstName: pick(FIRST_NAMES),
      lastName: pick(LAST_NAMES),
      emoji: pick(AVATAR_EMOJIS)
    };
  }

  function generateComment() {
    const user = generateRandomUser();
    return {
      user,
      text: fillTemplate(pick(COMMENT_TEMPLATES))
    };
  }

  function generatePost() {
    const user = generateRandomUser();
    const commentCount = randomInt(0, 3);
    const comments = [];
    for (let i = 0; i < commentCount; i++) comments.push(generateComment());

    minutesAgoCursor += randomInt(4, 50);

    return {
      id: postIdSeq++,
      user,
      isYou: false,
      text: fillTemplate(pick(POST_TEMPLATES)),
      minutesAgo: minutesAgoCursor,
      reactions: {
        up: randomInt(0, 40),
        down: randomInt(0, 6),
        fire: randomInt(0, 25)
      },
      userReaction: null,
      comments,
      commentsOpen: false
    };
  }

  /* ---------------- rendering ---------------- */
  const feedEl = document.getElementById("feed");

  function fullName(u) {
    return u.firstName + " " + u.lastName;
  }

  function renderReactionButton(post, kind, emoji) {
    const btn = document.createElement("button");
    btn.className = "reaction-btn";
    btn.dataset.kind = kind;
    if (post.userReaction === kind) btn.classList.add("active");
    btn.innerHTML =
      '<span class="remoji">' + emoji + '</span><span class="rcount">' + post.reactions[kind] + "</span>";
    btn.addEventListener("click", () => {
      if (post.userReaction === kind) {
        post.reactions[kind]--;
        post.userReaction = null;
      } else {
        if (post.userReaction) post.reactions[post.userReaction]--;
        post.reactions[kind]++;
        post.userReaction = kind;
      }
      rerenderPost(post);
    });
    return btn;
  }

  function renderComment(c) {
    const wrap = document.createElement("div");
    wrap.className = "comment";
    wrap.innerHTML =
      '<span class="comment-avatar">' + c.user.emoji + '</span>' +
      '<div class="comment-body"><span class="comment-name">' + escapeHtml(fullName(c.user)) +
      '</span>' + escapeHtml(c.text) + "</div>";
    return wrap;
  }

  function buildPostNode(post) {
    const card = document.createElement("article");
    card.className = "post";
    card.dataset.id = post.id;

    // head
    const head = document.createElement("div");
    head.className = "post-head";
    const you = post.isYou ? '<span class="post-you-badge">YOU</span>' : "";
    head.innerHTML =
      '<span class="post-avatar">' + post.user.emoji + '</span>' +
      '<div class="post-headtext">' +
        '<span class="post-name">' + escapeHtml(fullName(post.user)) + you + '</span>' +
        '<span class="post-time">' + formatMinutesAgo(post.minutesAgo) + '</span>' +
      '</div>';
    card.appendChild(head);

    // text
    const textEl = document.createElement("p");
    textEl.className = "post-text";
    textEl.textContent = post.text;
    card.appendChild(textEl);

    // actions
    const actions = document.createElement("div");
    actions.className = "post-actions";
    actions.appendChild(renderReactionButton(post, "up", "👍"));
    actions.appendChild(renderReactionButton(post, "down", "👎"));
    actions.appendChild(renderReactionButton(post, "fire", "🔥"));

    const commentToggle = document.createElement("button");
    commentToggle.type = "button";
    commentToggle.className = "comment-toggle";
    commentToggle.textContent = post.comments.length + (post.comments.length === 1 ? " comment" : " comments");
    commentToggle.addEventListener("click", () => {
      post.commentsOpen = !post.commentsOpen;
      rerenderPost(post);
    });
    actions.appendChild(commentToggle);
    card.appendChild(actions);

    // comments section
    if (post.commentsOpen) {
      const section = document.createElement("div");
      section.className = "comments";

      if (post.comments.length === 0) {
        const empty = document.createElement("p");
        empty.className = "comment-empty";
        empty.textContent = "No comments yet.";
        section.appendChild(empty);
      } else {
        post.comments.forEach((c) => section.appendChild(renderComment(c)));
      }

      if (currentUser) {
        const form = document.createElement("form");
        form.className = "add-comment-form";
        form.innerHTML =
          '<input type="text" placeholder="Add a comment..." maxlength="140">' +
          '<button type="submit">Send</button>';
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const input = form.querySelector("input");
          const val = input.value.trim();
          if (!val) return;
          post.comments.push({ user: { ...currentUser }, text: val });
          post.commentsOpen = true;
          rerenderPost(post);
        });
        section.appendChild(form);
      } else {
        const locked = document.createElement("p");
        locked.className = "add-comment-locked";
        locked.textContent = "Log in to leave a comment.";
        section.appendChild(locked);
      }

      card.appendChild(section);
    }

    return card;
  }

  function rerenderPost(post) {
    const existing = feedEl.querySelector('[data-id="' + post.id + '"]');
    if (!existing) return;
    const fresh = buildPostNode(post);
    existing.replaceWith(fresh);
  }

  function appendPost(post, prepend) {
    const node = buildPostNode(post);
    if (prepend) {
      feedEl.insertBefore(node, feedEl.firstChild);
    } else {
      feedEl.appendChild(node);
    }
  }

  /* ---------------- feed loading / infinite scroll ---------------- */
  function loadMorePosts(count) {
    if (loading) return;
    loading = true;
    for (let i = 0; i < count; i++) {
      appendPost(generatePost(), false);
    }
    loading = false;
  }

  const sentinel = document.getElementById("sentinel");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) loadMorePosts(5);
      });
    },
    { rootMargin: "300px" }
  );
  observer.observe(sentinel);

  /* ---------------- compose ---------------- */
  const composeBox = document.getElementById("composeBox");
  const loginPrompt = document.getElementById("loginPrompt");
  const composeForm = document.getElementById("composeForm");
  const composeInput = document.getElementById("composeInput");
  const composeEmoji = document.getElementById("composeEmoji");

  composeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = composeInput.value.trim();
    if (!text || !currentUser) return;
    const post = {
      id: postIdSeq++,
      user: { ...currentUser },
      isYou: true,
      text,
      minutesAgo: 0,
      reactions: { up: 0, down: 0, fire: 0 },
      userReaction: null,
      comments: [],
      commentsOpen: false
    };
    appendPost(post, true);
    composeInput.value = "";
  });

  document.getElementById("loginPromptBtn").addEventListener("click", () => {
    showAuthScreen();
  });

  /* auto-grow the textarea a little */
  composeInput.addEventListener("input", () => {
    composeInput.style.height = "auto";
    composeInput.style.height = Math.min(composeInput.scrollHeight, 140) + "px";
  });

  /* ---------------- auth screen ---------------- */
  const authScreen = document.getElementById("authScreen");
  const feedScreen = document.getElementById("feedScreen");
  const authForm = document.getElementById("authForm");
  const authTabs = document.querySelectorAll(".auth-tab");
  const authSubmit = document.getElementById("authSubmit");
  const avatarGrid = document.getElementById("avatarGrid");
  const selectedAvatarInput = document.getElementById("selectedAvatar");

  let authMode = "login";

  function buildAvatarGrid() {
    avatarGrid.innerHTML = "";
    // show a random sample of 24 so it's not the same wall every time
    const shuffled = [...AVATAR_EMOJIS].sort(() => Math.random() - 0.5).slice(0, 24);
    shuffled.forEach((emoji) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "avatar-option";
      btn.textContent = emoji;
      btn.addEventListener("click", () => {
        avatarGrid.querySelectorAll(".avatar-option").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedAvatarInput.value = emoji;
      });
      avatarGrid.appendChild(btn);
    });
    // pre-select the first one so submitting with no interaction still works
    const first = avatarGrid.querySelector(".avatar-option");
    if (first) {
      first.classList.add("selected");
      selectedAvatarInput.value = first.textContent;
    }
  }

  authTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      authTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      authMode = tab.dataset.mode;
      authSubmit.textContent = authMode === "login" ? "Log in" : "Sign up";
    });
  });

  authForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const firstName = document.getElementById("firstName").value.trim() || pick(FIRST_NAMES);
    const lastName = document.getElementById("lastName").value.trim() || pick(LAST_NAMES);
    const emoji = selectedAvatarInput.value || pick(AVATAR_EMOJIS);

    currentUser = { firstName, lastName, emoji };
    showFeedScreen();
    authForm.reset();
  });

  /* ---------------- logout ---------------- */
  document.getElementById("logoutBtn").addEventListener("click", () => {
    currentUser = null;
    showAuthScreen();
  });

  /* ---------------- screen switching ---------------- */
  function showAuthScreen() {
    feedScreen.hidden = true;
    authScreen.hidden = false;
    buildAvatarGrid();
  }

  function showFeedScreen() {
    authScreen.hidden = true;
    feedScreen.hidden = false;

    document.getElementById("userChipEmoji").textContent = currentUser.emoji;
    document.getElementById("userChipName").textContent = currentUser.firstName;
    composeEmoji.textContent = currentUser.emoji;

    composeBox.hidden = false;
    loginPrompt.hidden = true;
  }

  /* ---------------- boot ---------------- */
  function applyBrand() {
    document.title = APP_NAME;
    document.getElementById("authBrandMark").textContent = APP_MARK;
    document.getElementById("authBrandName").textContent = APP_NAME;
    document.getElementById("authTagline").textContent = APP_TAGLINE;
    document.getElementById("feedBrandMark").textContent = APP_MARK;
    document.getElementById("feedBrandName").textContent = APP_NAME;
  }

  applyBrand();
  buildAvatarGrid();
  loadMorePosts(5);
})();
