document.addEventListener("DOMContentLoaded", function () {
  const contentContainer = document.getElementById("content-container");
  const loadMoreBtn = document.getElementById("load-more");

  let currentPage = 1;
  let initialDisplay = initialLoadData.length;
  let isDataAvailable = true;
  console.log(totalItems);

  const loadMoreMovies = async () => {
    try {
      if (initialDisplay < totalItems) {
        console.log("it ran");
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

      <div class="card-review" role="button">
      <button
        class="card-review-button d-flex justify-content-center align-items-center"
        data-bs-toggle="modal"
        data-bs-target="#wishlist-review-modal${initialDisplay + i}"
        data-bs-whatever="@getbootstrap"
        id="review-button${initialDisplay + i}"
      >
        <span class="material-symbols-outlined"> star </span>
        Review
      </button>

      <!-- modal for review -->
      <div
        class="modal fade"
        id="wishlist-review-modal${initialDisplay + i}"
        tabindex="-1"
        aria-labelledby="movie-review"
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
              <h5 class="modal-title" id="movie-review">
                Write a review for ${movie.MovieName}
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
                    value="${movie.Movie_id}"
                    readonly
                    id="movie_id"
                  />
                </div>

                <div class="mb-3">
                  <label for="movie_description">Movie Description</label>
                  <input
                    class="form-control text-truncate"
                    type="text"
                    name="Movie_description"
                    value="${movie.Movie_description}"
                    readonly
                    id="movie_description"
                  />
                </div>

                <div class="mb-3 no-view">
                  <label for="movie_poster">Movie Poster</label>
                  <input
                    class="form-control"
                    type="text"
                    name="Movie_poster"
                    value="${movie.Poster_path}"
                    readonly
                    id="movie_poster"
                  />
                </div>

                <div class="mb-3 no-view">
                  <label for="movie_name">Movie name</label>
                  <input
                    class="form-control"
                    type="text"
                    name="Movie_name"
                    value="${movie.MovieName}"
                    readonly
                    id="movie_name"
                  />
                </div>

                <div class="mb-3">
                  <fieldset class="starability-grow">
                    <legend>rating:</legend>
                    <input
                      type="radio"
                      id="trending-no-rate${initialDisplay + i}"
                      class="input-no-rate"
                      name="rating"
                      value="1"
                      aria-label="No rating."
                      max="5"
                    />

                    <input
                      type="radio"
                      id="trending-rate1${initialDisplay + i}"
                      name="rating"
                      value="1"
                      checked
                    />
                    <label for="trending-rate1${initialDisplay + i}">1 star.</label>

                    <input
                      type="radio"
                      id="trending-rate2${initialDisplay + i}"
                      name="rating"
                      value="2"
                    />
                    <label for="trending-rate2${initialDisplay + i}>">2 stars.</label>

                    <input
                      type="radio"
                      id="trending-rate3${initialDisplay + i}"
                      name="rating"
                      value="3"
                    />
                    <label for="trending-rate3${initialDisplay + i}">3 stars.</label>

                    <input
                      type="radio"
                      id="trending-rate4${initialDisplay + i}"
                      name="rating"
                      value="4"
                    />
                    <label for="trending-rate4${initialDisplay + i}">4 stars.</label>

                    <input
                      type="radio"
                      id="trending-rate5${initialDisplay + i}"
                      name="rating"
                      value="5"
                    />
                    <label for="trending-rate5${initialDisplay + i}">5 stars.</label>

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
          console.log("This code ran");
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
