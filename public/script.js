let editingPostId = null;
const singlePost = document.getElementById("singlePost");
const singleTitle = document.getElementById("singleTitle");
const singleCategory = document.getElementById("singleCategory");
const singleContent = document.getElementById("singleContent");
const backBtn = document.getElementById("backBtn");
const postsContainer = document.getElementById("postsContainer");
const editor = document.getElementById("editor");
const openEditorBtn = document.getElementById("openEditor");
const savePostBtn = document.getElementById("savePost");
const toggleModeBtn = document.getElementById("toggleMode");

const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const contentInput = document.getElementById("content");

// ========================
// Fetch & Render Posts
// ========================
async function fetchPosts() {
  const res = await fetch("/posts");
  const posts = await res.json();
  renderPosts(posts);
}

function renderPosts(posts) {
  postsContainer.innerHTML = "";

  posts.forEach(post => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <h3>${post.title}</h3>
      <p class="category">${post.category}</p>
      <p>${post.content.substring(0, 100)}...</p>
      <div class="card-buttons">
        <button onclick="editPost('${post._id}', '${post.title}', '${post.category}', \`${post.content}\`)">Edit</button>
        <button onclick="deletePost('${post._id}')">Delete</button>
      </div>
    `;

    // Click entire card (except delete button)
    card.addEventListener("click", (e) => {
      if (e.target.tagName !== "BUTTON") {
        console.log("CLICK WORKING");
        openPost(post);
      }
    });

    postsContainer.appendChild(card); // ✅ INSIDE forEach
  });
}
// ========================
// Create Post
// ========================
savePostBtn.addEventListener("click", async () => {
  const title = titleInput.value;
  const category = categoryInput.value;
  const content = contentInput.value;

  if (!title || !content) {
    alert("Title and Content required!");
    return;
  }

  if (editingPostId) {
    // UPDATE MODE
    await fetch(`/posts/${editingPostId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category, content })
    });

    editingPostId = null;
    savePostBtn.textContent = "Publish";
  } else {
    // CREATE MODE
    await fetch("/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category, content })
    });
  }

  titleInput.value = "";
  categoryInput.value = "";
  contentInput.value = "";

  editor.classList.add("hidden");
  fetchPosts();
});

// ========================
// Delete Post
// ========================
async function deletePost(id) {
  await fetch(`/posts/${id}`, {
    method: "DELETE"
  });

  fetchPosts();
}

function editPost(id, title, category, content) {
  editingPostId = id;

  titleInput.value = title;
  categoryInput.value = category;
  contentInput.value = content;

  editor.classList.remove("hidden");
  savePostBtn.textContent = "Update Post";
}

// ========================
// Toggle Editor
// ========================
openEditorBtn.addEventListener("click", () => {
  editor.classList.toggle("hidden");
});

// ========================
// Open Single Post View
// ========================
function openPost(post) {
  postsContainer.classList.add("hidden");
  singlePost.classList.remove("hidden");

  singleTitle.textContent = post.title;
  singleCategory.textContent = post.category;
  singleContent.textContent = post.content;
}

backBtn.addEventListener("click", () => {
  singlePost.classList.add("hidden");
  postsContainer.classList.remove("hidden");
});

// ========================
// Dark Mode Toggle
// ========================
toggleModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Load posts on page load
fetchPosts();