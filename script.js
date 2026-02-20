// Shared storage key for both public site and admin dashboard.
const MENU_STORAGE_KEY = "smv_menu_items";

// Default menu data with royalty-free image URLs.
const defaultMenuItems = [
  {
    id: "item-1",
    name: "Punugulu",
    description: "Small golden fried balls made from fermented dosa batter.",
    image: "https://www.cartly.ca/cdn/shop/articles/20210914065814-punugulu.jpg?v=1639031504"
  },
  {
    id: "item-2",
    name: "Muntha Masala",
    description: "Street-style mix of puffed rice, groundnuts, onion, and masala spices.",
    image: "https://www.indianrecipeinfo.com/wp-content/uploads/2022/07/Muntha-Masala-Recipe-500x500.jpg"
  },
  {
    id: "item-3",
    name: "Mirchi Bajji",
    description: "Large green chilli dipped in besan batter and deep fried.",
    image: "https://i.ytimg.com/vi/LmPoDRt10p8/maxresdefault.jpg"
  },
  {
    id: "item-4",
    name: "Bread Omelette",
    description: "Toasted bread with fluffy masala omelette filling.",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjmPU190weYegGU-VymxkIUDrPgYvgGfFNRZL3e4xhteL9YnG6hWxgyI5hEjOyP0SiYYUPHlubrQbCg_sxDjue7PpvD70yZaprf4nLZKIbsNKNikRs6MWqR-ciGYHuUp0hqnUppvDdR3r8/s1600/bread+omelette2.jpg"
  },
  {
    id: "item-5",
    name: "Egg Burji",
    description: "Scrambled egg mixed with masala spices and savory sauce.",
    image: "https://www.ruchifoodline.com/recipes//cdn/recipes/Egg-Bhurji-1-3.jpg"
  },
  {
    id: "item-6",
    name: "Egg Salad",
    description: "Round egg slices topped with masala mix, onions, and coriander.",
    image: "https://www.tastingtable.com/img/gallery/x-tips-to-make-cutting-hard-boiled-eggs-much-easier/l-intro-1698691913.jpg"
  },
  {
    id: "item-7",
    name: "Bajji Masala",
    description: "Muntha masala mixture tossed with spicy mirchi bajji.",
    image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/670bb1bd9b002f1e48b0b01ca6c5292c"
  },
  {
    id: "item-8",
    name: "Milmaker",
    description:
      "Soaked soya chunks fried in a pan with spices, mixed with batani (peas) gravy, and served garnished with chopped onions and coriander.",
    image: "https://i.ytimg.com/vi/_1_KqJZXU8c/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCQszis_dirLX2KMscRBWa-sAK2Nw"
  }
];

function normalizeMenuItems(items) {
  const canonicalNames = new Set(defaultMenuItems.map((item) => item.name.toLowerCase()));

  const customItems = items.filter((item) => {
    if (!item || typeof item !== "object" || typeof item.name !== "string") return false;
    if (typeof item.id === "string" && /^item-\d+$/.test(item.id)) return false;
    const name = item.name.toLowerCase();
    return !canonicalNames.has(name);
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
