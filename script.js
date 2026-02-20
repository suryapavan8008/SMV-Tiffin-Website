// Shared storage key for both public site and admin dashboard.
const MENU_STORAGE_KEY = "smv_menu_items";

// Default menu data with royalty-free image URLs.
const defaultMenuItems = [
  {
    id: "item-1",
    name: "Punugulu",
    description: "Small golden fried balls made from fermented dosa batter.",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Bonda.jpg"
  },
  {
    id: "item-2",
    name: "Muntha Masala",
    description: "Street-style mix of puffed rice, groundnuts, onion, and masala spices.",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Bhel_puri_chaat.jpg"
  },
  {
    id: "item-3",
    name: "Mirchi Bajji",
    description: "Large green chilli dipped in besan batter and deep fried.",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Mirchi-bajji%2C%20India.jpg"
  },
  {
    id: "item-4",
    name: "Bread Omelette",
    description: "Toasted bread with fluffy masala omelette filling.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "item-5",
    name: "Egg Burji",
    description: "Scrambled egg mixed with masala spices and savory sauce.",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Egg_Bhurji-India.jpg"
  },
  {
    id: "item-6",
    name: "Tomato Round Cutting Salad",
    description: "Round tomato slices topped with masala mix, onions, and coriander.",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Tomato%2C%20cucumber%2C%20onion%20salad.jpg"
  },
  {
    id: "item-7",
    name: "Boiled Egg Muntha Masala",
    description: "Muntha masala mixture tossed with chopped boiled egg pieces.",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Masala%20boiled%20eggs%20served%20in%20a%20plate.jpg"
  },
  {
    id: "item-8",
    name: "Milmker",
    description:
      "Soaked soya chunks fried in a pan with spices, mixed with batani (peas) gravy, and served garnished with chopped onions and coriander.",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Soya%20chunks%20with%20peas%20curry.jpg"
  }
];

function normalizeMenuItems(items) {
  const blockedNames = new Set(["pani puri", "pungulu"]);
  const canonicalNames = new Set(defaultMenuItems.map((item) => item.name.toLowerCase()));

  const customItems = items.filter((item) => {
    if (!item || typeof item !== "object" || typeof item.name !== "string") return false;
    const name = item.name.toLowerCase();
    return !blockedNames.has(name) && !canonicalNames.has(name);
  });

  return [...defaultMenuItems, ...customItems];
}

function getMenuItems() {
  const saved = localStorage.getItem(MENU_STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(defaultMenuItems));
    return defaultMenuItems;
  }

  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return defaultMenuItems;

    const normalized = normalizeMenuItems(parsed);
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch (error) {
    console.warn("Invalid menu data in localStorage. Resetting to defaults.", error);
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(defaultMenuItems));
    return defaultMenuItems;
  }
}

function renderMenu() {
  const menuGrid = document.getElementById("menuGrid");
  if (!menuGrid) return;

  const items = getMenuItems();

  menuGrid.innerHTML = items
    .map(
      (item) => `
      <article class="menu-card reveal">
        <img src="${item.image}" alt="${item.name}" loading="lazy" />
        <div class="menu-card-content">
          <h3>${item.name}</h3>
          <p>${item.description || "Freshly made and served hot."}</p>
        </div>
      </article>
    `
    )
    .join("");

  observeReveal();
}

function setupMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    links.classList.toggle("open");
  });

  links.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      links.classList.remove("open");
    }
  });
}

function observeReveal() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function setYear() {
  const yearElement = document.getElementById("year");
  if (yearElement) yearElement.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  renderMenu();
  observeReveal();
  setYear();
});
