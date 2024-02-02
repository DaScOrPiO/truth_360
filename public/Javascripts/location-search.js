document.addEventListener("DOMContentLoaded", function () {
  const searchContainer = document.querySelector(".search-container");
  const searchIcon = document.querySelector(".search-icon");
  const searchInput = document.querySelector(".search-input");
  const searchButton = document.querySelector("#button-addon2");
  const inputContainer = document.querySelector(".input-container");
  const searchSection = document.getElementById("search-section");

  searchContainer.addEventListener("click", () => {
    inputContainer.classList.remove("no-view");
    searchIcon.classList.add("no-view");
    searchInput.value = "";
  });

  document.addEventListener("click", (e) => {
    if (!searchContainer.contains(e.target)) {
      if (
        !inputContainer.classList.contains("no-view") &&
        searchIcon.classList.contains("no-view")
      ) {
        inputContainer.classList.add("no-view");
        searchIcon.classList.remove("no-view");
      }
    }

    if (!searchSection.contains(e.target)) {
      if (!searchSection.classList.contains("d-none")) {
        searchSection.classList.add("d-none");
      }
    }
  });

  document.addEventListener("keypress", (e) => {
    const location_name = searchInput.value;
    if (e.key === "Enter" && document.activeElement === searchInput) {
      if (!location_name || location_name === "") {
        Swal.fire({
          icon: "info",
          title: "Include a location name!",
          customClass: {
            confirmButton: "sweet-alert-btn",
          },
          showConfirmButton: true,
          confirmButtonText: "OK",
        });
      } else {
        searchLocation(location_name);
      }
    }
  });

  console.log(searchButton);
  searchButton.addEventListener("click", () => {
    const location_name = searchInput.value;
    console.log("working");

    if (location_name === "" || !location_name) {
      Swal.fire({
        icon: "info",
        title: "Include a location name.",
        customClass: {
          confirmButton: "sweet-alert-btn",
        },
        showConfirmButton: true,
        confirmButtonText: "OK",
      });
    } else {
      searchLocation(location_name);
    }
  });

  const searchLocation = async (query) => {
    const search = `/locations/search_locations?location_name=${query}`;

    const response = await fetch(search);
    if (!response.ok) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Network problem :(",
        customClass: {
          confirmButton: "sweet-alert-btn",
        },
        showConfirmButton: true,
        confirmButtonText: "OK",
      });
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (data && data.length > 0) {
      searchSection.innerHTML = "";

      const closeButtonContainer = document.createElement("div");
      closeButtonContainer.classList.add(
        "w-100",
        "d-flex",
        "justify-content-end"
      );

      const closeButton = document.createElement("button");
      closeButton.classList.add("close-btn", "btn-danger");
      closeButtonContainer.appendChild(closeButton);
      closeButton.innerHTML =
        '<span class="material-symbols-outlined"> close </span>';

      searchSection.appendChild(closeButtonContainer);

      data.forEach((location, i) => {
        const card = document.createElement("div");
        card.classList.add("card", "my-3");

        const modalId = `wishlist-search${i}`;

        card.innerHTML = `
          <div class="row">
            <div class="col-md-4 event-container">
              <img class="img-fluid" alt="" src="${location.images[0].url}" />
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${location.title}</h5>
                <p class="card-text">${location.description}</p>
                <p class="card-text">
                  <small class="text-muted">${location.location}</small>
                </p>
                <a class="button" href="locations/${location._id}/show">View ${location.title}</a>
              </div>
            </div>
          </div>
        `;

        searchSection.appendChild(card);
        searchSection.classList.remove("d-none");
      });
      closeButton.addEventListener("click", () => {
        searchSection.classList.add("d-none");
      });
    }
  };
});
