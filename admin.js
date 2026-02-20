const MENU_STORAGE_KEY = "smv_menu_items";
const ADMIN_SESSION_KEY = "smv_admin_logged_in";
const ADMIN_PASSWORD = "smv@123"; // Change this for better security.

const loginSection = document.getElementById("loginSection");
const adminSection = document.getElementById("adminSection");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginError = document.getElementById("loginError");
const formError = document.getElementById("formError");
const menuList = document.getElementById("menuList");

const itemName = document.getElementById("itemName");
const itemDescription = document.getElementById("itemDescription");
const itemImage = document.getElementById("itemImage");
const addItemBtn = document.getElementById("addItemBtn");

function getMenuItems() {
  const saved = localStorage.getItem(MENU_STORAGE_KEY);
  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Invalid localStorage data.", error);
    return [];
  }
}

function setMenuItems(items) {
  localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(items));
}

function toggleDashboard(isLoggedIn) {
  loginSection.classList.toggle("hidden", isLoggedIn);
  adminSection.classList.toggle("hidden", !isLoggedIn);
}

function renderMenuList() {
  const items = getMenuItems();

  if (!items.length) {
    menuList.innerHTML = "<p class='hint'>No menu items found. Add your first item.</p>";
    return;
  }

  menuList.innerHTML = items
    .map(
      (item) => `
      <article class="menu-item">
        <img src="${item.image}" alt="${item.name}" loading="lazy" />
        <div>
          <h3>${item.name}</h3>
          <p>${item.description || "No description"}</p>
        </div>
        <button class="delete-btn" data-id="${item.id}">Delete</button>
      </article>
    `
    )
    .join("");
}

function login() {
  const passwordField = document.getElementById("password");
  if (passwordField.value.trim() === ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_SESSION_KEY, "true");
    loginError.textContent = "";
    toggleDashboard(true);
    renderMenuList();
    passwordField.value = "";
    return;
  }

  loginError.textContent = "Incorrect password. Please try again.";
}

function logout() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
  toggleDashboard(false);
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

function addMenuItem() {
  formError.textContent = "";

  const name = itemName.value.trim();
  const description = itemDescription.value.trim();
  const image = itemImage.value.trim();

  if (!name || !image) {
    formError.textContent = "Item name and image URL are required.";
    return;
  }

  if (!isValidUrl(image)) {
    formError.textContent = "Please enter a valid image URL.";
    return;
  }

  const items = getMenuItems();
  const newItem = {
    id: `item-${Date.now()}`,
    name,
    description,
    image
  };

  items.push(newItem);
  setMenuItems(items);
  renderMenuList();

  itemName.value = "";
  itemDescription.value = "";
  itemImage.value = "";
}

function deleteMenuItem(itemId) {
  const items = getMenuItems().filter((item) => item.id !== itemId);
  setMenuItems(items);
  renderMenuList();
}

// Event bindings
loginBtn.addEventListener("click", login);
logoutBtn.addEventListener("click", logout);
addItemBtn.addEventListener("click", addMenuItem);

document.getElementById("password").addEventListener("keydown", (event) => {
  if (event.key === "Enter") login();
});

menuList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    deleteMenuItem(event.target.dataset.id);
  }
});

// Restore login session (for convenience on local machine).
const loggedIn = localStorage.getItem(ADMIN_SESSION_KEY) === "true";
toggleDashboard(loggedIn);
if (loggedIn) renderMenuList();
