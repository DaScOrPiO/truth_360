document.addEventListener("DOMContentLoaded", function () {
  const contentContainer = document.getElementById("content-container");
  const loadMoreBtn = document.getElementById("load-more");

  let currentPage = 1;
  let initialDisplay = moreData.length;
  let isDataAvailable = true;

  const loadMoreMovies = async () => {
    try {
      if (initialDisplay < totalItems) {
        isDataAvailable = true;
        const remainingItems = totalItems - initialDisplay;
        const moreItems = mainData.slice(
          initialDisplay,
          initialDisplay + Math.min(items_per_page, remainingItems)
        );

        moreItems.forEach((movie) => {
          const card = document.createElement("div");
          card.classList.add("card", "mx-auto", "mb-3");
          card.style.width = "16rem";

          card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" class="card-img-top" alt="...">
            <div class="card-body">
              <p class="card-text">${movie.overview}</p>
            </div>
            <form action="" class="card-details mb-3">
              <button class="details-button">Show details</button>
            </form>
            <form action="" class="card-review">
              <button class="card-review-button">Review</button>
            </form>
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
      });
    } else {
      loadMoreMovies();
    }
  };

  loadMoreBtn.addEventListener("click", handleClick);
});
