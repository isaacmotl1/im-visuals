# Mason Raye Photography Portfolio

A handcrafted, framework-free photography portfolio built with HTML, CSS, and vanilla JavaScript.

## Run locally

Open `index.html` directly in a browser, or serve this folder with any small static server.

## Replacing images

The complete 44-slot image plan is documented in `images/README.md`. Each item in `script.js` has a `localFile` value indicating the matching replacement file. Change that item's `src` to its local path when your images are ready.

## Netlify Forms

The contact form includes `data-netlify="true"`, its required hidden `form-name`, and a honeypot field. When this exact folder is deployed to Netlify, Netlify detects the form at deploy time and submits entries in the site's Netlify dashboard. No JavaScript or external form service is required. For a polished live site, configure a form-success page or Netlify notification in the Netlify dashboard.
