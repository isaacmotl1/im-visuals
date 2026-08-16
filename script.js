/* --------------------------------------------------
   Image data
   These are intentionally easy-to-replace placeholder URLs. The comments
   name the local files to add later in each category folder.
-------------------------------------------------- */
const imageSources = [
  "photo-1500534623283-312aade485b7", "photo-1464822759023-fed622ff2c3b", "photo-1511497584788-876760111969", "photo-1500530855697-b586d89ba3ee",
  "photo-1501854140801-50d01698950b", "photo-1443632864897-14973fa006cf", "photo-1470770841072-f978cf4d019e", "photo-1454496522488-7a8e488e8606",
  "photo-1517836357463-d25dfeac3438", "photo-1517838277536-f5f99be5019c", "photo-1517963879433-6ad2b056d712", "photo-1517838277536-f5f99be5019c",
  "photo-1518611012118-696072aa579a", "photo-1538805060514-97d9cc17730c", "photo-1517260739337-6799d239ce83", "photo-1483721310020-03333e577078",
  "photo-1506629905607-d405b7a30db6", "photo-1542291026-7eec264c27ff", "photo-1486218119243-13883505764c", "photo-1517836357463-d25dfeac3438",
  "photo-1472396961693-142e6e269027", "photo-1552728089-57bdde30beb3", "photo-1444464666168-49d633b86797", "photo-1474511320723-07a8dd4e6c00",
  "photo-1504006833117-8886a355efbf", "photo-1517841905240-472988babdf9", "photo-1534528741775-53994a69daeb", "photo-1531123897727-8f129e1688ce",
  "photo-1519085360753-af0119f7cbe7", "photo-1500648767791-00dcc994a43e", "photo-1539571696357-5a69c17a67c6", "photo-1524504388940-b1c1722653e1",
  "photo-1436491865332-7a61a109cc05", "photo-1474302770737-173ee21bab63", "photo-1529074963764-98f0d7c160b8", "photo-1436491865332-7a61a109cc05",
  "photo-1474302770737-173ee21bab63", "photo-1517479149777-5f3b1511d5ad", "photo-1529074963764-98f0d7c160b8", "photo-1436491865332-7a61a109cc05",
  "photo-1534088568595-a066f410bcda", "photo-1542296332-2e4473faf563", "photo-1583395838144-8f98f9a6c1f4", "photo-1593941707882-a5bac6861d75"
];

const categories = [
  { id: "landscape", label: "Landscape", start: 0, count: 8, titles: ["After the Rain", "High Country", "Weather Line", "Still Water", "The Long Way", "North Face", "At First Light", "Quiet Terrain"] },
  { id: "sports", label: "Sports", start: 8, count: 12, titles: ["The Work", "Before the Bell", "Third Quarter", "On the Line", "Endurance", "No. 16", "Lanes", "Last Light", "Interval", "Game Day", "The Climb", "Between Rounds"] },
  { id: "wildlife", label: "Wildlife", start: 20, count: 8, titles: ["Field Notes I", "Stillness", "Open Country", "Watchful", "Wild Hours", "Along the Ridge", "Passing Through", "Instinct"] },
  { id: "portraits", label: "Portraits", start: 24, count: 8, titles: ["Maria", "Ari", "Sofia", "June", "Milan", "Dara", "Lewis", "Celia"] },
  { id: "aviation", label: "Aviation", start: 32, count: 8, titles: ["Blue Hour", "On Final", "Takeoff", "Flight Line", "Altitude", "Runway 04", "Clear Skies", "Wing Study"] }
];

function imageUrl(source, width = 900) { return `https://images.unsplash.com/${source}?auto=format&fit=crop&w=${width}&q=85`; }
function fileName(category, number) { return `images/${category}/${category.slice(0, -1)}-${String(number).padStart(2, "0")}.jpg`; }

// Creates the full 44-image archive: Landscape 8, Sports 12, Wildlife 8, Portraits 8, Aviation 8.
const portfolioItems = categories.flatMap((category) => Array.from({ length: category.count }, (_, index) => ({
  id: `${category.id}-${index + 1}`,
  category: category.id,
  categoryLabel: category.label,
  title: category.titles[index],
  // Replace this placeholder with the following local image:
  localFile: fileName(category.id, index + 1),
  src: imageUrl(imageSources[category.start + index]),
  alt: `${category.label} photograph placeholder: ${category.titles[index]}`
})));

/* --------------------------------------------------
   Reusable card builders
-------------------------------------------------- */
function createImageCard(item, className = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `image-card ${className}`;
  button.dataset.imageId = item.id;
  button.setAttribute("aria-label", `Open ${item.title} in image viewer`);
  button.innerHTML = `<img src="${item.src}" alt="${item.alt}" loading="lazy"><span class="image-card__label">${item.title}</span>`;
  return button;
}

function renderFeaturedWork() {
  const featured = [
    { id: "landscape-1", src: "images/featured/photo1.jpg" },
    { id: "sports-3", src: "images/featured/photo2.jpg" },
    { id: "wildlife-2", src: "images/featured/photo3.jpg" },
    { id: "portraits-3", src: "images/featured/photo4.jpg" },
    { id: "landscape-6", src: "images/featured/photo5.jpg" }
  ];

  const grid = document.querySelector("#featured-grid");

  featured.forEach(({ id, src }) => {
    const item = portfolioItems.find((item) => item.id === id);
    item.src = src;
    grid.append(createImageCard(item));
  });
}

function renderCategories() {
  const grid = document.querySelector("#category-grid");
  categories.forEach((category) => {
    const item = portfolioItems.find((image) => image.category === category.id);
    const link = document.createElement("a");
    link.className = "category-card";
    link.href = "#portfolio";
    link.dataset.categoryLink = category.id;
    link.innerHTML = `<img src="${item.src}" alt="${category.label} category placeholder" loading="lazy"><span>${category.label}</span>`;
    grid.append(link);
  });
}

function renderPrints() {
  const printIds = ["landscape-2", "wildlife-3", "aviation-4", "sports-8"];
  const printInfo = [
    ["A Matter of Weather", "Dolomites, Italy · 2024", "12 × 18, 20 × 30, 30 × 45 in"],
    ["Open Country", "Wyoming, USA · 2023", "12 × 18, 20 × 30, 30 × 45 in"],
    ["Altitude", "Nevada, USA · 2022", "12 × 18, 20 × 30, 30 × 45 in"],
    ["Last Light", "Utah, USA · 2024", "12 × 18, 20 × 30, 30 × 45 in"]
  ];
  const grid = document.querySelector("#print-grid");
  printIds.map((id) => portfolioItems.find((item) => item.id === id)).forEach((item, index) => {
    const [title, description, sizes] = printInfo[index];
    const card = document.createElement("article");
    card.className = "print-card reveal";
    card.innerHTML = `<div class="print-card__image"><img src="${item.src}" alt="${item.alt}" loading="lazy"></div><div class="print-card__body"><h3>${title}</h3><p>${description}</p><p class="sizes">${sizes}</p><a class="text-link" href="#contact">Inquire <span aria-hidden="true">↗</span></a></div>`;
    grid.append(card);
  });
}

function renderPortfolio(filter = "all") {
  const grid = document.querySelector("#portfolio-grid");
  grid.innerHTML = "";
  portfolioItems.filter((item) => filter === "all" || item.category === filter).forEach((item) => {
    const article = document.createElement("article");
    article.className = "portfolio-item";
    article.innerHTML = `<div class="portfolio-item__image"></div><p class="portfolio-item__meta"><span>${item.title}</span><span>${item.categoryLabel}</span></p>`;
    article.querySelector(".portfolio-item__image").append(createImageCard(item));
    grid.append(article);
  });
}

/* --------------------------------------------------
   Portfolio filters and category links
-------------------------------------------------- */
let activeCategory = "landscape";

function setPortfolioFilter(category) {
  activeCategory = category;
  renderPortfolio(category);
}
function initializeFilters() {
  document.querySelectorAll("[data-category-link]").forEach((link) => {
    link.addEventListener("click", () => {
      setPortfolioFilter(link.dataset.categoryLink);
    });
  });
}

/* --------------------------------------------------
   Accessible image lightbox
-------------------------------------------------- */

let activeImages = portfolioItems;
let activeIndex = 0;

const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");

function showLightboxImage() {
  const item = activeImages[activeIndex];

  if (!item || !lightbox || !lightboxImage || !lightboxCaption) return;

  lightboxImage.src = item.src;
  lightboxImage.alt = item.alt;
  lightboxCaption.textContent = item.title;
}

function openLightbox(id, trigger = null) {
  const visibleCategory = activeCategory;

  const clickedGroup = trigger
    ? trigger.closest("#featured-grid, #portfolio-grid")
    : null;

  if (clickedGroup) {
    const cards = Array.from(clickedGroup.querySelectorAll("[data-image-id]"));

    activeImages = cards
      .map((card) => {
        return portfolioItems.find((item) => item.id === card.dataset.imageId);
      })
      .filter(Boolean);
  } else {
    activeImages = portfolioItems.filter((item) => {
      return visibleCategory === "all" || item.category === visibleCategory;
    });
  }

  activeIndex = activeImages.findIndex((item) => item.id === id);

  if (activeIndex < 0) {
    activeIndex = 0;
  }

  showLightboxImage();
  lightbox.showModal();
}

function openStaticGallery(card) {
  const cards = Array.from(document.querySelectorAll("[data-gallery-src]"));

  activeImages = cards.map((item) => {
    return {
      src: item.dataset.gallerySrc,
      title: item.dataset.galleryTitle || "Untitled Image",
      alt: item.dataset.galleryAlt || item.dataset.galleryTitle || "Portfolio image"
    };
  });

  activeIndex = cards.indexOf(card);

  if (activeIndex < 0) {
    activeIndex = 0;
  }

  showLightboxImage();
  lightbox.showModal();
}

function closeLightbox() {
  if (lightbox) {
    lightbox.close();
  }
}

function moveLightbox(direction) {
  if (!activeImages.length) return;

  activeIndex = (activeIndex + direction + activeImages.length) % activeImages.length;
  showLightboxImage();
}

function initializeLightbox() {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;

  document.addEventListener("click", (event) => {
    const staticCard = event.target.closest("[data-gallery-src]");

    if (staticCard) {
      openStaticGallery(staticCard);
      return;
    }

    const dynamicCard = event.target.closest("[data-image-id]");

    if (dynamicCard) {
  openLightbox(dynamicCard.dataset.imageId, dynamicCard);
}
  });

  const closeButton = document.querySelector(".lightbox__close");
  const previousButton = document.querySelector(".lightbox__arrow--previous");
  const nextButton = document.querySelector(".lightbox__arrow--next");

  if (closeButton) {
    closeButton.addEventListener("click", closeLightbox);
  }

  if (previousButton) {
    previousButton.addEventListener("click", () => moveLightbox(-1));
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => moveLightbox(1));
  }

  document.addEventListener("keydown", (event) => {
    if (!lightbox.open) return;

    if (event.key === "ArrowLeft") moveLightbox(-1);
    if (event.key === "ArrowRight") moveLightbox(1);
    if (event.key === "Escape") closeLightbox();
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

/* --------------------------------------------------
   Mobile navigation, scroll header, and animations
-------------------------------------------------- */
function initializeNavigation() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 25);
  updateHeader(); window.addEventListener("scroll", updateHeader, { passive: true });
  toggle.addEventListener("click", () => { const open = nav.classList.toggle("is-open"); toggle.setAttribute("aria-expanded", open); toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation"); });
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); }));
}

function initializeRevealAnimations() {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: .12 });
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

function initializeBackToTop() {
  const backToTopLinks = document.querySelectorAll('a[href="#top"]');

  backToTopLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  });
}

function initializeSite() {
  if (document.querySelector("#featured-grid")) {
    renderFeaturedWork();
  }

  if (document.querySelector("#category-grid")) {
    renderCategories();
  }

  if (document.querySelector("#print-grid")) {
    renderPrints();
  }

  if (document.querySelector("#portfolio-grid")) {
    renderPortfolio();
    initializeFilters();
  }

  if (document.querySelector("#lightbox")) {
    initializeLightbox();
  }

  initializeNavigation();
  initializeRevealAnimations();
  initializeBackToTop();

  const year = document.querySelector("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }
}

initializeSite();


/* ==================================================
   Portfolio directory cinematic reels
   True seamless loop with no dead space
================================================== */
function initializePortfolioReels() {
  const reels = document.querySelectorAll(".portfolio-reel");

  if (!reels.length) {
    return;
  }

  function setupFallbacks(reel) {
    reel.querySelectorAll("img[data-fallback]").forEach((image) => {
      if (image.dataset.fallbackReady === "true") {
        return;
      }

      image.dataset.fallbackReady = "true";

      image.addEventListener("error", () => {
        if (image.dataset.fallbackUsed === "true") {
          return;
        }

        image.dataset.fallbackUsed = "true";
        image.src = image.dataset.fallback;
      });
    });
  }

  function buildReel(reel) {
    const track = reel.querySelector(".portfolio-reel__track");

    if (!track) {
      return;
    }

    const groups = Array.from(
      track.querySelectorAll(".portfolio-reel__group")
    );

    if (!groups.length) {
      return;
    }

    /*
      Keep the first group as the master and remove any clones
      created by an earlier build.
    */
    const originalGroup = groups[0];

    groups.slice(1).forEach((group) => {
      group.remove();
    });

    /*
      Remove fill items from previous resize/build operations.
    */
    originalGroup
      .querySelectorAll(".portfolio-reel__fill")
      .forEach((item) => item.remove());

    const originalItems = Array.from(
      originalGroup.querySelectorAll(
        ".portfolio-reel__item:not(.portfolio-reel__fill)"
      )
    );

    if (!originalItems.length) {
      return;
    }

    /*
      Make one photo sequence substantially wider than the
      visible row. This guarantees there is always imagery
      entering from both sides of the viewport.
    */
    const requiredWidth = Math.max(
      reel.clientWidth * 1.75,
      window.innerWidth * 1.35
    );

    let safety = 0;

    while (
      originalGroup.scrollWidth < requiredWidth &&
      safety < 20
    ) {
      originalItems.forEach((item) => {
        const copy = item.cloneNode(true);

        copy.classList.add("portfolio-reel__fill");
        copy.setAttribute("aria-hidden", "true");

        originalGroup.appendChild(copy);
      });

      safety += 1;
    }

    /*
      Clone the ENTIRE expanded strip once.

      Track becomes:
      [ GROUP A ][ GROUP A ]

      Because the two halves are identical, translating the
      track by exactly 50% produces an invisible reset.
    */
    const secondGroup = originalGroup.cloneNode(true);

    secondGroup.classList.add("portfolio-reel__clone");
    secondGroup.setAttribute("aria-hidden", "true");

    track.appendChild(secondGroup);

    setupFallbacks(reel);

    /*
      Restart animation after rebuilding so resized layouts
      start from a clean position.
    */
    track.style.animation = "none";
    void track.offsetWidth;
    track.style.animation = "";
  }

  function buildAllReels() {
    reels.forEach((reel) => {
      buildReel(reel);
    });
  }

  /*
    Build after layout has had time to calculate image strip
    dimensions.
  */
  requestAnimationFrame(() => {
    requestAnimationFrame(buildAllReels);
  });

  window.addEventListener("load", buildAllReels);

  let resizeTimer;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      buildAllReels();
    }, 200);
  });
}

initializePortfolioReels();



/* ==================================================
   Cinematic homepage portfolio experience
================================================== */
function initializePortfolioExperience() {
  const experience = document.querySelector(".portfolio-experience");

  if (!experience) {
    return;
  }

  const steps = [...experience.querySelectorAll("[data-portfolio-step]")];
  const media = [...experience.querySelectorAll("[data-portfolio-media]")];
  const copies = [...experience.querySelectorAll("[data-portfolio-copy]")];
  const buttons = [...experience.querySelectorAll("[data-portfolio-jump]")];
  const current = experience.querySelector("#portfolio-current");
  let activeIndex = -1;
  let ticking = false;

  function setActive(index) {
    if (index === activeIndex || index < 0 || index >= steps.length) {
      return;
    }

    activeIndex = index;

    media.forEach((item, itemIndex) => {
      item.classList.toggle("is-active", itemIndex === index);
    });

    copies.forEach((item, itemIndex) => {
      item.classList.toggle("is-active", itemIndex === index);
    });

    buttons.forEach((button, buttonIndex) => {
      const selected = buttonIndex === index;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-current", selected ? "true" : "false");
    });

    if (current) {
      current.textContent = String(index + 1).padStart(2, "0");
    }
  }

  function updateFromScroll() {
    const focusLine = window.innerHeight * 0.55;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    steps.forEach((step, index) => {
      const rect = step.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const distance = Math.abs(center - focusLine);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActive(closestIndex);
    ticking = false;
  }

  function requestUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(updateFromScroll);
      ticking = true;
    }
  }

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const step = steps[index];
      const rect = step.getBoundingClientRect();
      const target = window.scrollY + rect.top - (window.innerHeight - rect.height) / 2;

      window.scrollTo({
        top: target,
        behavior: "smooth"
      });
    });
  });

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);

  setActive(0);
  requestUpdate();
}

initializePortfolioExperience();
/* ==========================================================
   Detect portfolio photo orientation automatically
========================================================== */

function initializePortfolioPhotoOrientations() {

  const photos =
    document.querySelectorAll(".masonry-gallery .gallery-photo img");

  if (!photos.length) {
    return;
  }


  function classifyPhoto(image) {

    const figure = image.closest(".gallery-photo");

    if (!figure) {
      return;
    }


    figure.classList.remove(
      "is-portrait",
      "is-landscape",
      "is-square"
    );


    const width = image.naturalWidth;
    const height = image.naturalHeight;


    if (!width || !height) {
      return;
    }


    const ratio = width / height;


    /* Tall image */
    if (ratio < 0.9) {

      figure.classList.add("is-portrait");

    }

    /* Wide image */
    else if (ratio > 1.1) {

      figure.classList.add("is-landscape");

    }

    /* Nearly square */
    else {

      figure.classList.add("is-square");

    }

  }


  photos.forEach((image) => {

    if (image.complete) {

      classifyPhoto(image);

    } else {

      image.addEventListener(
        "load",
        () => classifyPhoto(image),
        { once: true }
      );

    }

  });

}


initializePortfolioPhotoOrientations();