// script.js

const loadPanzoom = () => {
  const script = document.createElement("script");
  script.src = "https://unpkg.com/@panzoom/panzoom@9.4.0/dist/panzoom.min.js";
  script.onload = () => console.log("Panzoom geladen");
  document.head.appendChild(script);
};
loadPanzoom();

document.addEventListener("DOMContentLoaded", function () {
  const preview = document.getElementById("preview");
  let previewHovered = false;
  let accordionHovered = false;
  let activeContent = null;
  let zoomLevel = 1.0;

  preview.addEventListener("mouseenter", () => previewHovered = true);
  preview.addEventListener("mouseleave", () => {
    previewHovered = false;
    maybeRemoveAccordion();
  });

  // Zoom-Steuerung
  const zoomControls = document.createElement("div");
  zoomControls.style.position = "absolute";
  zoomControls.style.top = "10px";
  zoomControls.style.right = "10px";
  zoomControls.style.zIndex = "99";
  zoomControls.style.background = "rgba(255,255,255,0.9)";
  zoomControls.style.border = "1px solid #ccc";
  zoomControls.style.borderRadius = "5px";
  zoomControls.style.padding = "5px";
  zoomControls.style.boxShadow = "0 0 6px rgba(0,0,0,0.2)";
  zoomControls.innerHTML = `
    <button id="zoom-in" style="margin-right:5px;">＋</button>
    <button id="zoom-out">－</button>
  `;
  preview.appendChild(zoomControls);

  document.getElementById("zoom-in").addEventListener("click", () => {
    zoomLevel += 0.1;
    applyZoom();
  });

  document.getElementById("zoom-out").addEventListener("click", () => {
    zoomLevel = Math.max(0.1, zoomLevel - 0.1);
    applyZoom();
  });

  function applyZoom() {
    const el = preview.querySelector("img, embed, .profile-text");
    if (el) {
      el.style.transform = `scale(${zoomLevel})`;
      el.style.transformOrigin = "center";
    }
  }

  function maybeRemoveAccordion() {
    if (!accordionHovered && !previewHovered && activeContent) {
      activeContent.remove();
      activeContent = null;
      resetPreview();
    }
  }

  function resetPreview() {
    preview.innerHTML = `<img src='/static/images/karsten-profile.jpg' alt='Profilbild'>`;
    preview.appendChild(zoomControls);
  }

  // Rechte Navigationsleiste (Accordion)
  document.querySelectorAll(".accordion-item").forEach(item => {
    const category = item.dataset.category;

    item.addEventListener("mouseenter", async () => {
      if (activeContent) activeContent.remove();

      const content = document.createElement("div");
      content.className = "accordion-content";
      item.insertAdjacentElement("afterend", content);
      activeContent = content;

      const response = await fetch(`/certificates/${category}`);
      const files = await response.json();

      files.forEach(file => {
        const entry = document.createElement("div");
        entry.className = "accordion-entry";
        entry.textContent = file;

        entry.addEventListener("mouseenter", () => {
          const ext = file.split('.').pop().toLowerCase();
          const basePath = `/static/certificates/${category}/${file}`;
          const timestamp = new Date().getTime();
          const path = `${basePath}?t=${timestamp}`;

          preview.innerHTML = "";
          preview.appendChild(zoomControls);
          preview.style.overflow = "auto";
          zoomLevel = 1.0;

          if (ext === "pdf") {
            const embed = document.createElement("embed");
            embed.src = path + "#toolbar=0&navpanes=0";
            embed.type = "application/pdf";
            embed.style.width = "1000px";
            embed.style.height = "1400px";
            embed.style.border = "1px solid #ccc";
            embed.style.transform = `scale(${zoomLevel})`;
            embed.style.transformOrigin = "center";
            preview.appendChild(embed);
            if (window.Panzoom) Panzoom(embed);
          } else {
            const img = document.createElement("img");
            img.src = path;
            img.alt = file;
            img.style.width = "auto";
            img.style.height = "auto";
            img.style.maxWidth = "100%";
            img.style.maxHeight = "100%";
            img.style.objectFit = "contain";
            img.style.display = "block";
            img.style.border = "1px solid #ccc";
            img.style.transform = `scale(${zoomLevel})`;
            img.style.transformOrigin = "center";
            img.style.margin = "auto";
            preview.appendChild(img);
            if (window.Panzoom) Panzoom(img);
          }
        });

        content.appendChild(entry);
      });

      content.addEventListener("mouseenter", () => accordionHovered = true);
      content.addEventListener("mouseleave", () => {
        accordionHovered = false;
        setTimeout(maybeRemoveAccordion, 150);
      });
    });
  });

  // Linke Navigation – Profiltexte laden via /partials/
  document.querySelectorAll(".side-nav button").forEach(btn => {
    const contentId = btn.getAttribute("data-content");

    btn.addEventListener("mouseenter", async () => {
  try {
    const res = await fetch(`/partials/profile-${contentId}.html`);
    const html = await res.text();

    const container = document.createElement("div");
    container.innerHTML = html;
    container.style.display = "block";
    container.style.width = "100%";
    container.style.maxWidth = "100%";

    preview.innerHTML = "";
    preview.appendChild(container);
    preview.appendChild(zoomControls);

    zoomLevel = 1.0;

    // Scrollen für linke Vorschautexte deaktivieren
    preview.style.overflow = "hidden";

  } catch (err) {
    console.error("Fehler beim Laden des Partials:", err);
    resetPreview();
  }
});

    btn.addEventListener("mouseleave", () => {
      // Vorschau bleibt stehen
    });
  });
});