document.addEventListener("DOMContentLoaded", function () {
  const contentContainer = document.getElementById("content-container");
  const loadMoreBtn = document.getElementById("load-more");

  let currentPage = 1;
  let initialDisplay = trendingSeries.length;
  let isDataAvailable = true;

  const loadMoreMovies = async () => {
    try {
      if (initialDisplay < totalItems) {
        isDataAvailable = true;
        const remainingItems = totalItems - initialDisplay;
        const moreItems = data2.slice(
          initialDisplay,
          initialDisplay + Math.min(items_per_page, remainingItems)
        );

        moreItems.forEach((movie, i) => {
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
             
              <div class="card-review">
        <button
          class="card-review-button d-flex justify-content-center align-items-center"
          data-bs-toggle="modal"
          data-bs-target="#series-review-modal${initialDisplay + i}"
          data-bs-whatever="@getbootstrap"
          id="review-button${i}"
        >
          <span class="material-symbols-outlined"> star </span>
          Review
        </button>

        <!-- modal for review -->
        <div
          class="modal fade"
          id="series-review-modal${initialDisplay + i}"
          tabindex="-1"
          aria-labelledby="series-review"
          aria-hidden="true"
        >
          <form
            action="/add_review"
            method="post"
            class="modal-dialog"
            enctype="multipart/form-data"
          >
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="series-review">
                  Write a review for ${movie.name}
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <form>
                  <div class="mb-3">
                    <label for="movie_id">Movie id</label>
                    <input
                      class="form-control"
                      type="text"
                      name="Movie_id"
                      value="${movie.id}"
                      readonly
                      id="movie_id"
                    />
                  </div>

                  <div class="mb-3">
                    <fieldset class="starability-grow">
                      <legend>rating:</legend>
                      <input
                        type="radio"
                        id="series-no-rate${initialDisplay + i}"
                        class="input-no-rate"
                        name="rating"
                        value="1"
                        aria-label="No rating."
                        max="5"
                      />

                      <input
                        type="radio"
                        id="series-rate1${initialDisplay + i}"
                        name="rating"
                        value="1"
                        checked
                      />
                      <label for="series-rate1${initialDisplay + i}">1 star.</label>

                      <input
                        type="radio"
                        id="series-rate2${initialDisplay + i}"
                        name="rating"
                        value="2"
                      />
                      <label for="series-rate2${initialDisplay + i}">2 stars.</label>

                      <input
                        type="radio"
                        id="series-rate3${initialDisplay + i}"
                        name="rating"
                        value="3"
                      />
                      <label for="series-rate3${initialDisplay + i}">3 stars.</label>

                      <input
                        type="radio"
                        id="series-rate4${initialDisplay + i}"
                        name="rating"
                        value="4"
                      />
                      <label for="series-rate4${initialDisplay + i}">4 stars.</label>

                      <input
                        type="radio"
                        id="series-rate5${initialDisplay + i}"
                        name="rating"
                        value="5"
                      />
                      <label for="series-rate5${initialDisplay + i}">5 stars.</label>

                      <span class="starability-focus-ring"></span>
                    </fieldset>
                  </div>

                  <div class="mb-3">
                    <label for="message-text" class="col-form-label"
                      >Comment:</label
                    >
                    <textarea
                      class="form-control"
                      id="message-text"
                      name="comment"
                      placeholder="Enter comment"
                    ></textarea>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-danger"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button class="btn btn-success">Drop Review</button>
              </div>
            </div>
          </form>
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
      });
    } else {
      loadMoreMovies();
    }
  };

  loadMoreBtn.addEventListener("click", handleClick);
});
