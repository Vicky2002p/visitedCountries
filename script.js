document.addEventListener("DOMContentLoaded", () => {
  function loadSVG(containerId, svgPath) {
    return fetch(svgPath)
      .then((response) => response.text())
      .then((svgContent) => {
        const container = document.getElementById(containerId);
        container.innerHTML = svgContent;

        // Apply hover effects to paths within the SVG
        const svg = container.querySelector("svg");
        if (svg) {
          applyHoverEffect(container);
          addPinsBasedOnCountries(svg);
        }
        return container;
      })
      .catch((error) => console.error("Error loading SVG:", error));
  }

  function applyHoverEffect(container) {
    const svg = container.querySelector("svg");
    if (svg) {
      const paths = svg.querySelectorAll("path, rect, circle, polygon");

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
          path.style.stroke = "#999";
          path.style.strokeWidth = "1px";
          path.style.filter = "none";
          document.getElementById("country-name").style.display = "none";
        });
      });
    }
  }

  function addPinsBasedOnCountries(svg) {
    const pins = [
      "Canada",
      "United States",
      "France",
      "Switzerland",
      "Thailand",
      "India",
      "South Africa",
      "United Arab Emirates",
    ];

    pins.forEach((countryName) => {
      const countryElement = svg.querySelector(`[title="${countryName}"]`);
      if (countryElement) {
        const bbox = countryElement.getBBox();
        const cx = bbox.x + bbox.width / 2;
        const cy = bbox.y + bbox.height / 1.8;

        const pinElement = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        pinElement.setAttribute("class", "pin");
        pinElement.setAttribute("cx", cx);
        pinElement.setAttribute("cy", cy);
        pinElement.setAttribute("r", 5); // Radius of the pin
        pinElement.setAttribute("title", countryName);

        svg.appendChild(pinElement);
      }
    });
  }

  function toggleExpand(container) {
    const isExpanded = container.classList.contains("expanded");

    document.querySelectorAll(".map-layer").forEach((layer) => {
      layer.classList.remove("expanded");
      layer.style.filter = "brightness(100%)";
    });

    if (!isExpanded) {
      container.classList.add("expanded");
      container.style.filter = "brightness(100%)";
    }
  }

  function handleMapClick(event, mapId, svgPath, additionalLogic = () => {}) {
    const container = document.getElementById(mapId);
    if (!container) return;

    container.style.display = "flex";
    loadSVG(mapId, svgPath).then((container) => {
      toggleExpand(container);
      document.getElementById("world").classList.add("hidden");
      additionalLogic(container);

      document.addEventListener("click", function handleOutsideClick(e) {
        if (
          !container.contains(e.target) &&
          e.target.getAttribute("title") !== "Alaska"
        ) {
          container.style.display = "none";
          document.getElementById("world").classList.remove("hidden");
          container.classList.remove("expanded");
          document.removeEventListener("click", handleOutsideClick);
        }
      });
    });
  }

  // Load SVGs into respective containers
  loadSVG("world", "maps/world.svg").then((container) => {
    applyHoverEffect(container);
    container.addEventListener("click", (event) => {
      const target = event.target;
      const countryName = target.getAttribute("title");

      if (countryName === "South Africa") {
        handleMapClick(event, "southafrica-container", "maps/south-africa.svg");
      }

      if (countryName === "Canada") {
        handleMapClick(event, "canada-container", "maps/canada.svg");
      }

      if (countryName === "France") {
        handleMapClick(event, "france-container", "maps/france.svg");
      }

      if (countryName === "India") {
        handleMapClick(event, "india-container", "maps/india.svg");
      }

      if (countryName === "Russia") {
        handleMapClick(event, "russia-container", "maps/russia.svg");
      }

      if (countryName === "Switzerland") {
        handleMapClick(event, "switzerland-container", "maps/switzerland.svg");
      }

      if (countryName === "Thailand") {
        handleMapClick(event, "thailand-container", "maps/thailand.svg");
      }

      if (countryName === "United Arab Emirates") {
        handleMapClick(
          event,
          "united-arab-emirates-container",
          "maps/united-arab-emirates.svg"
        );
      }

      if (countryName === "United States") {
        const usaContainer = document.getElementById("usa-container");
        usaContainer.style.display = "flex";

        loadSVG("usa-container", "maps/usaFull.svg").then((container) => {
          toggleExpand(container);

          document.getElementById("world").classList.add("hidden");

          const handleOutsideClick = (e) => {
            if (
              !usaContainer.contains(e.target) &&
              e.target.getAttribute("title") !== "United States"
            ) {
              usaContainer.style.display = "none";
              document.getElementById("world").classList.remove("hidden");
              usaContainer.classList.remove("expanded");
              document.removeEventListener("click", handleOutsideClick);
            }
          };
          document.addEventListener("click", handleOutsideClick);

          const alaskaHandler = (event) => {
            const stateName = event.target.getAttribute("title");
            console.log("Alaska map clicked");
            console.log("SVG loaded for Alaska");

            if (stateName === "Alaska") {
              event.stopPropagation();
              handleMapClick(event, "alaska-container", "maps/alaska.svg");
            }
          };
          container.addEventListener("click", alaskaHandler);

          const originalHandleOutsideClick = handleOutsideClick;
          handleOutsideClick = (e) => {
            originalHandleOutsideClick(e);
            if (
              !container.contains(e.target) &&
              e.target.getAttribute("title") !== "Alaska"
            ) {
              container.removeEventListener("click", alaskaHandler);
            }
          };
        });
      }
    });
  });
});
