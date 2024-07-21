document.addEventListener("DOMContentLoaded", () => {
  function loadSVG(containerId, svgPath) {
    return fetch(svgPath)
      .then((response) => response.text())
      .then((svgContent) => {
        const container = document.getElementById(containerId);
        container.innerHTML = svgContent;

        // Apply hover effects to paths within the SVG
        applyHoverEffect(container);
        return container;
      })
      .catch((error) => console.error("Error loading SVG:", error));
  }

  function applyHoverEffect(container) {
    const svg = container.querySelector("svg");
    if (svg) {
      const paths = svg.querySelectorAll("path, rect, circle, polygon"); // Include other elements if needed

      paths.forEach((path) => {
        path.addEventListener("mouseenter", (event) => {
          path.style.stroke = "yellow";
          path.style.strokeWidth = "2px";
          path.style.filter = "drop-shadow(0 0 10px yellow)";
          const countryName = event.target.getAttribute("title");
          if (countryName) {
            const nameBox = document.getElementById("country-name");
            nameBox.textContent = countryName;
            nameBox.style.display = "block";
            nameBox.style.top = `${event.clientY + 10}px`;
            nameBox.style.left = `${event.clientX + 10}px`;
          }
        });

        path.addEventListener("mouseleave", () => {
          path.style.stroke = "#000"; // Reset to default stroke color
          path.style.strokeWidth = "1px"; // Reset to default stroke width
          path.style.filter = "none"; // Remove drop shadow
          document.getElementById("country-name").style.display = "none";
        });
      });
    }
  }

  function toggleExpand(container) {
    const isExpanded = container.classList.contains("expanded");

    // Collapse all maps
    document.querySelectorAll(".map-layer").forEach((layer) => {
      layer.classList.remove("expanded");
      layer.style.filter = "brightness(100%)"; // Dimmed state
    });

    // Expand the clicked map if not already expanded
    if (!isExpanded) {
      container.classList.add("expanded");
      container.style.filter = "brightness(100%)"; // Normal brightness for focused map
    }
  }

  // Load SVGs into respective containers
  loadSVG("world", "maps/world.svg").then((container) => {
    applyHoverEffect(container);
    container.addEventListener("click", (event) => {
      const target = event.target;
      if (target.getAttribute("title") === "India") {
        const indiaContainer = document.getElementById("india-container");
        indiaContainer.style.display = "flex";
        loadSVG("india-container", "maps/india.svg").then((indiaContainer) => {
          toggleExpand(indiaContainer);

          // Hide the world map
          document.getElementById("world").classList.add("hidden");

          // Add an event listener to handle clicks outside the India map
          document.addEventListener("click", function handleOutsideClick(e) {
            if (
              !indiaContainer.contains(e.target) &&
              e.target.getAttribute("title") !== "India"
            ) {
              // Hide the India map and show the world map
              indiaContainer.style.display = "none";
              document.getElementById("world").classList.remove("hidden");
              indiaContainer.classList.remove("expanded");
              document.removeEventListener("click", handleOutsideClick);
            }
          });
        });
      }
    });
  });
});
