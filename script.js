// Shared storage key for both public site and admin dashboard.
const MENU_STORAGE_KEY = "smv_menu_items";

// Default menu data with royalty-free image URLs.
const defaultMenuItems = [
  {
    id: "item-1",
    name: "Pungulu",
    description: "Golden fried bite-size snack served with chutney.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "item-2",
    name: "Muntha Masala",
    description: "Street-style spicy mix with onion, masala, and crunch.",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "item-3",
    name: "Mirchi Bajji",
    description: "Crispy chili fritters with bold Andhra taste.",
    image: "https://images.unsplash.com/photo-1542367592-8849eb950fd8?auto=format&fit=crop&w=900&q=80"
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
    description: "Soft scrambled egg with onion, tomato, and spices.",
    image: "https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "item-6",
    name: "Tomato Round Cutting Salad",
    description: "Fresh tomato slices with lemon, salt, and masala.",
    image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "item-7",
    name: "Boiled Egg Muntha Masala",
    description: "Boiled egg tossed with tangy muntha masala mix.",
    image: "https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "item-8",
    name: "Pani Puri",
    description: "Crispy puris filled with spicy pani and tangy masala stuffing.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80"
  }
];

function getMenuItems() {
  const saved = localStorage.getItem(MENU_STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(defaultMenuItems));
    return defaultMenuItems;
  }

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length ? parsed : defaultMenuItems;
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
