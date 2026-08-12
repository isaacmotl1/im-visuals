/* ==========================================================
   IM VISUALS — PORTFOLIO REELS
   Seamless infinite-loop photo movement
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const reels = document.querySelectorAll(".portfolio-reel");

  if (!reels.length) {
    return;
  }


  /* ========================================================
     FALLBACK IMAGES

     If one of the numbered portfolio images does not exist,
     use the category featured image instead.
  ======================================================== */

  function setupFallbacks(reel) {

    const images = reel.querySelectorAll("img[data-fallback]");

    images.forEach((image) => {

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


  /* ========================================================
     BUILD ONE CONTINUOUS REEL
  ======================================================== */

  function buildReel(reel) {

    const track = reel.querySelector(".portfolio-reel__track");

    const originalGroup =
      reel.querySelector(
        ".portfolio-reel__group:not(.portfolio-reel__clone)"
      );

    if (!track || !originalGroup) {
      return;
    }


    /* ------------------------------------------------------
       Remove old duplicate groups before rebuilding
    ------------------------------------------------------ */

    track
      .querySelectorAll(".portfolio-reel__clone")
      .forEach((clone) => clone.remove());


    /* ------------------------------------------------------
       Measure the REAL width of one full photo sequence
    ------------------------------------------------------ */

    const groupWidth =
      Math.ceil(originalGroup.getBoundingClientRect().width);

    const visibleWidth =
      Math.ceil(reel.getBoundingClientRect().width);


    if (!groupWidth || !visibleWidth) {
      return;
    }


    /* ------------------------------------------------------
       Tell CSS exactly how far one loop should travel

       This is the important part.

       Instead of guessing at -50%, we move exactly
       the width of one complete photo sequence.
    ------------------------------------------------------ */

    track.style.setProperty(
      "--reel-shift",
      `${groupWidth}px`
    );


    /* ------------------------------------------------------
       Duplicate the photo sequence until there can NEVER
       be empty space on screen.

       Think of this like laying copies of a film strip
       end-to-end in a giant circle.
    ------------------------------------------------------ */

    let totalTrackWidth = groupWidth;


    while (
      totalTrackWidth <
      visibleWidth + groupWidth * 2
    ) {

      const clone =
        originalGroup.cloneNode(true);

      clone.classList.add(
        "portfolio-reel__clone"
      );

      clone.setAttribute(
        "aria-hidden",
        "true"
      );

      track.appendChild(clone);

      totalTrackWidth += groupWidth;

    }


    /* Setup image fallbacks for original + clones */

    setupFallbacks(reel);

  }


  /* ========================================================
     BUILD EVERY CATEGORY
  ======================================================== */

  function buildAllReels() {

    reels.forEach((reel) => {

      buildReel(reel);

    });

  }


  /* ========================================================
     INITIAL BUILD
  ======================================================== */

  requestAnimationFrame(() => {

    buildAllReels();

  });


  /* Recalculate after every image/resource has loaded */

  window.addEventListener(
    "load",
    buildAllReels
  );


  /* ========================================================
     RESIZE SUPPORT

     Re-measures the reels if someone changes browser size,
     rotates a phone, uses an iPad, etc.
  ======================================================== */

  let resizeTimer;

  window.addEventListener("resize", () => {

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {

      buildAllReels();

    }, 180);

  });


  /* ========================================================
     EXTRA RESIZE OBSERVER

     Handles layout changes that don't fire a normal
     browser resize.
  ======================================================== */

  if ("ResizeObserver" in window) {

    const observer =
      new ResizeObserver(() => {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {

          buildAllReels();

        }, 180);

      });


    reels.forEach((reel) => {

      observer.observe(reel);

    });

  }

});