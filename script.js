/* ==========================================================
   IM VISUALS — CLEANED SITE SCRIPT
   Photography-first build

   Handles:
   - mobile navigation + sticky header
   - reveal animations
   - footer year + back-to-top
   - static portfolio lightbox
   - seamless portfolio/home reels
   - gallery photo orientation classes
   - optional Google Apps Script contact form submission

   Removed:
   - old dynamic portfolio renderer
   - old Web Design demo rotator
   - old Web Design page code
   - unused scroll portfolio experience
========================================================== */

"use strict";


/* ==========================================================
   NAVIGATION
========================================================== */

function initializeNavigation() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");

  if (!header || !toggle || !nav) {
    return;
  }

  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 25);
  };

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");

    toggle.setAttribute(
      "aria-expanded",
      isOpen ? "true" : "false"
    );

    toggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
    });
  });
}


/* ==========================================================
   REVEAL ANIMATIONS
========================================================== */

function initializeRevealAnimations() {
  const elements = document.querySelectorAll(".reveal");

  if (!elements.length) {
    return;
  }

  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    elements.forEach((element) => {
      element.classList.add("is-visible");
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12
    }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
}


/* ==========================================================
   FOOTER YEAR + BACK TO TOP
========================================================== */

function initializeFooter() {
  const year = document.querySelector("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  document.querySelectorAll('a[href="#top"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  });
}


/* ==========================================================
   IMAGE FALLBACKS
========================================================== */

function initializeImageFallbacks(root = document) {
  root
    .querySelectorAll("img[data-fallback]")
    .forEach((image) => {
      if (image.dataset.fallbackReady === "true") {
        return;
      }

      image.dataset.fallbackReady = "true";

      image.addEventListener("error", () => {
        if (image.dataset.fallbackUsed === "true") {
          return;
        }

        const fallback = image.dataset.fallback;

        if (!fallback) {
          return;
        }

        image.dataset.fallbackUsed = "true";
        image.src = fallback;
      });
    });
}


/* ==========================================================
   PORTFOLIO / HOME REELS
========================================================== */

function initializePortfolioReels() {
  const reels = document.querySelectorAll(".portfolio-reel");

  if (!reels.length) {
    return;
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

    const originalGroup = groups[0];

    /* Remove clones from previous builds. */
    groups.slice(1).forEach((group) => {
      group.remove();
    });

    /* Remove temporary fill items from previous builds. */
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
      Make the first sequence wider than the viewport so there
      is always imagery entering the frame.
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
      Clone the expanded group once:
      [ GROUP A ][ GROUP A ]
      The CSS animation can now loop seamlessly.
    */
    const clone = originalGroup.cloneNode(true);

    clone.classList.add("portfolio-reel__clone");
    clone.setAttribute("aria-hidden", "true");

    track.appendChild(clone);

    initializeImageFallbacks(reel);

    /* Restart the CSS animation after rebuilding. */
    track.style.animation = "none";
    void track.offsetWidth;
    track.style.animation = "";
  }

  function buildAllReels() {
    reels.forEach((reel) => {
      buildReel(reel);
    });
  }

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


/* ==========================================================
   STATIC PORTFOLIO LIGHTBOX
========================================================== */

function initializeLightbox() {
  const dialog = document.querySelector("#lightbox");
  const image = document.querySelector("#lightbox-image");
  const caption = document.querySelector("#lightbox-caption");

  if (!dialog || !image || !caption) {
    return;
  }

  const closeButton = dialog.querySelector(".lightbox__close");

  const previousButton = dialog.querySelector(
    ".lightbox__arrow--previous"
  );

  const nextButton = dialog.querySelector(
    ".lightbox__arrow--next"
  );

  let activeItems = [];
  let activeIndex = 0;

  function updateLightbox() {
    const item = activeItems[activeIndex];

    if (!item) {
      return;
    }

    image.src = item.src;
    image.alt = item.alt;
    caption.textContent = item.title;
  }

  function openFromCard(card) {
    const cards = Array.from(
      document.querySelectorAll("[data-gallery-src]")
    );

    activeItems = cards.map((item) => ({
      src: item.dataset.gallerySrc,

      title:
        item.dataset.galleryTitle ||
        "Portfolio Image",

      alt:
        item.dataset.galleryAlt ||
        item.dataset.galleryTitle ||
        "Portfolio image"
    }));

    activeIndex = cards.indexOf(card);

    if (activeIndex < 0) {
      activeIndex = 0;
    }

    updateLightbox();
    dialog.showModal();
  }

  function move(direction) {
    if (!activeItems.length) {
      return;
    }

    activeIndex =
      (activeIndex + direction + activeItems.length) %
      activeItems.length;

    updateLightbox();
  }

  function close() {
    if (dialog.open) {
      dialog.close();
    }
  }

  document.addEventListener("click", (event) => {
    const card = event.target.closest("[data-gallery-src]");

    if (card) {
      openFromCard(card);
    }
  });

  closeButton?.addEventListener("click", close);

  previousButton?.addEventListener("click", () => {
    move(-1);
  });

  nextButton?.addEventListener("click", () => {
    move(1);
  });

  document.addEventListener("keydown", (event) => {
    if (!dialog.open) {
      return;
    }

    if (event.key === "ArrowLeft") {
      move(-1);
    }

    if (event.key === "ArrowRight") {
      move(1);
    }

    if (event.key === "Escape") {
      close();
    }
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      close();
    }
  });
}


/* ==========================================================
   PORTFOLIO PHOTO ORIENTATION
========================================================== */

function initializePortfolioPhotoOrientations() {
  const photos = document.querySelectorAll(
    ".masonry-gallery .gallery-photo img"
  );

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

    if (ratio < 0.9) {
      figure.classList.add("is-portrait");
    } else if (ratio > 1.1) {
      figure.classList.add("is-landscape");
    } else {
      figure.classList.add("is-square");
    }
  }

  photos.forEach((image) => {
    if (image.complete) {
      classifyPhoto(image);
      return;
    }

    image.addEventListener(
      "load",
      () => classifyPhoto(image),
      {
        once: true
      }
    );
  });
}


/* ==========================================================
   CONTACT FORM

   Put your Google Apps Script URL here in contact.html:

   <form
     class="contact-page-form reveal"
     id="project-contact-form"
     data-endpoint="YOUR_GOOGLE_APPS_SCRIPT_EXEC_URL"
   >

   Until an endpoint is added, this prevents the site
   from sending a normal POST and causing a 405 error.
========================================================== */

function initializeContactForm() {
  const form = document.querySelector(".contact-page-form");

  if (!form) {
    return;
  }

  let status = form.querySelector("[data-contact-status]");

  if (!status) {
    status = document.createElement("p");

    status.className =
      "contact-page-form__status";

    status.dataset.contactStatus = "";

    status.setAttribute(
      "aria-live",
      "polite"
    );

    form.appendChild(status);
  }

  const submitButton = form.querySelector(
    'button[type="submit"]'
  );

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const endpoint = (
      form.dataset.endpoint || ""
    ).trim();

    status.classList.remove(
      "is-success",
      "is-error"
    );

    /*
      No endpoint is configured yet.

      Prevent the old static POST so GitHub Pages does not
      show a 405 error.
    */
    if (
      !endpoint ||
      endpoint.includes("PASTE_") ||
      !/^https?:\/\//i.test(endpoint)
    ) {
      status.textContent =
        "The contact form is not connected yet. Add the Google Apps Script web-app URL to the form's data-endpoint.";

      status.classList.add("is-error");

      return;
    }

    const originalButtonHTML =
      submitButton?.innerHTML || "";

    if (submitButton) {
      submitButton.disabled = true;

      submitButton.innerHTML =
        'Sending… <span aria-hidden="true">↗</span>';
    }

    status.textContent =
      "Sending your inquiry…";

    try {
      await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        mode: "no-cors"
      });

      form.reset();

      status.textContent =
        "Thanks — your inquiry was sent.";

      status.classList.add("is-success");
    } catch (error) {
      console.error(
        "IM Visuals contact form error:",
        error
      );

      status.textContent =
        "Something went wrong while sending. Please try again.";

      status.classList.add("is-error");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;

        submitButton.innerHTML =
          originalButtonHTML;
      }
    }
  });
}


/* ==========================================================
   SITE STARTUP
========================================================== */

function initializeSite() {
  initializeNavigation();
  initializeRevealAnimations();
  initializeFooter();
  initializeImageFallbacks();
  initializePortfolioReels();
  initializeLightbox();
  initializePortfolioPhotoOrientations();
  initializeContactForm();
}


if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeSite,
    {
      once: true
    }
  );
} else {
  initializeSite();
}