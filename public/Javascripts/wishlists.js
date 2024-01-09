document.addEventListener("DOMContentLoaded", function () {
  const contentContainer = document.getElementById("content-container");
  const loadMoreBtn = document.getElementById("load-more");

  let currentPage = 1;
  let initialDisplay = initialLoadData.length;
  let isDataAvailable = true;
  console.log(data);

  const loadMoreMovies = async () => {
    try {
      if (initialDisplay < totalItems) {
        isDataAvailable = true;
        const remainingItems = totalItems - initialDisplay;
        const moreItems = data.slice(
          initialDisplay,
          initialDisplay + Math.min(items_per_page, remainingItems)
        );

        moreItems.forEach((movie, i) => {
          const card = document.createElement("div");
          card.classList.add("card", "mx-auto", "mb-3");
          card.style.width = "16rem";

          card.innerHTML = `
              <img src="https://image.tmdb.org/t/p/original${movie.Poster_path}" class="card-img-top" alt="...">
              
              <form action="" class="card-details mb-3">
        <button class="details-button d-flex justify-content-center">
          <span class="material-symbols-outlined mx-2">info</span>
          Show details
        </button>
      </form>

      <form action="" class="card-review mb-3">
        <button class="card-review-button d-flex justify-content-center">
          <span class="material-symbols-outlined mx-2">star</span>
          Review
        </button>
      </form>

      <form
        action="/remove_fromwishlist"
        method="post"
        class="card-review"
        enctype="multipart/form-data"
      >
        <input
          type="text"
          class="d-none"
          name="Movie_id"
          id=""
          value="${movie.Movie_id}"
        />
        <input
          type="text"
          class="d-none"
          name="MovieName"
          id=""
          value="${movie.MovieName}"
        />
        <input
          type="text"
          class="d-none"
          name="Poster_path"
          id=""
          value="${movie.Poster_path}"
        />
        <button class="card-review-button d-flex justify-content-center">
          <span class="material-symbols-outlined mx-2">delete</span>
          Remove Item
        </button>
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
