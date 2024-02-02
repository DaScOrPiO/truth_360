document.addEventListener("DOMContentLoaded", function () {
  const contentContainer = document.getElementById("content-container");
  const loadMoreBtn = document.getElementById("load-more");

  let currentPage = 1;
  let initialDisplay = moreData.length;
  let isDataAvailable = true;

  const loadMoreLocation = async () => {
    try {
      if (initialDisplay < totalItems) {
        isDataAvailable = true;
        const remainingItems = totalItems - initialDisplay;
        const moreItems = mainData.slice(
          initialDisplay,
          initialDisplay + Math.min(items_per_page, remainingItems)
        );

        moreItems.forEach((location, i) => {
          const card = document.createElement("div");
          card.classList.add("card", "mb-3");

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
          contentContainer.appendChild(card);
        });

        initialDisplay += moreItems.length;

        if (initialDisplay >= totalItems) {
          // No more data to load
          loadMoreBtn.classList.add("disabled-pointer");
          isDataAvailable = false;
        }

        currentPage++;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClick = () => {
    if (!isDataAvailable) {
      Swal.fire({
        icon: "info",
        title: "No more data to load.",
        customClass: {
          confirmButton: "sweet-alert-btn",
        },
        showConfirmButton: true,
        confirmButtonText: "OK",
      });
    } else {
      loadMoreLocation();
    }
  };

  loadMoreBtn.addEventListener("click", handleClick);
});
