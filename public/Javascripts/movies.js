document.addEventListener("DOMContentLoaded", function () {
  const contentContainer = document.getElementById("content-container");
  const loadMoreBtn = document.getElementById("load-more");

  let currentPage = 1;
  let initialDisplay = moreData.length;
  let isDataAvailable = true;
  console.log(moreData.map((el) => el.id));
  console.log(user);
  console.log(reviewItems.map((el) => el));

  const loadMoreMovies = async () => {
    try {
      if (initialDisplay < totalItems) {
        isDataAvailable = true;
        const remainingItems = totalItems - initialDisplay;
        const moreItems = mainData.slice(
          initialDisplay,
          initialDisplay + Math.min(items_per_page, remainingItems)
        );

        moreItems.forEach((movie, i) => {
          const card = document.createElement("div");
          card.classList.add("card", "mx-auto", "mb-3");
          card.style.width = "16rem";

          card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/original${
              movie.poster_path
            }" class="card-img-top" alt="...">

            <!-- New code here -->
            <div
              class="modal fade"
              id="movie-info${initialDisplay + i}"
              aria-hidden="true"
              aria-labelledby="movie-info-label"
              tabindex="-1"
            >
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="movie-info-label">Modal 1</h5>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body modal-flex">
                    <div class="card mb-3 ${
                      reviewItems.some(
                        (el) =>
                          el.Movie_id === movie.id &&
                          reviewItems.length > 0
                      )
                        ? "card-space"
                        : ""
                    }">
                      <div>
                        <img
                          src="https://image.tmdb.org/t/p/w342${
                            movie.poster_path
                          }"
                          class="card-img-top"
                          alt="..."
                        />
                      </div>
                      <div class="card-body">
                        <h5 class="card-title">${movie.original_title}</h5>
                        <p class="card-text">${movie.overview}</p>
                      </div>
                    </div>
                    ${
                      Array.isArray(reviewItems) && reviewItems.length > 0
                        ? `
                          <div class="review-container ${
                            reviewItems.some(
                              (el) =>
                                el.Movie_id === movie.id &&
                                reviewItems.length > 0
                            )
                              ? "review-space"
                              : ""
                          } mb-3" id="reviews-container">
                          ${reviewItems
                            .filter(
                              (review) =>
                                review.Author && review.Movie_id === movie.id
                            )
                            .map(
                              (review) => `
                              <div class="card mb-3 mx-3">
                                <div class="card-body">
                                  <h1 class="fs-5">Author: ${review.Author.username}</h1>
                                  <p class="starability-result" data-rating="${review.Ratings}">
                                    Rated: ${review.Ratings} stars
                                  </p>
                                  <p class="card-text">Comment: ${review.Comment}</p>
                                </div>
                              </div>
                            `
                            )
                            .join("")}
                          <button class="btn btn-primary mx-3" id="view-more">
                            View More
                          </button>
                        </div>`
                        : ""
                    }
                  </div>    
                  <div class="modal-footer" id="modal-footer">
                    ${
                      user &&
                      Array.isArray(reviewItems) &&
                      reviewItems.length > 0
                        ? reviewItems
                            .filter(
                              (review) =>
                                review.Author &&
                                review.Author._id &&
                                review.Author._id.toString() === user._id &&
                                review.Movie_id === movie.id
                            )
                            .map(
                              (review) => `
                                <div class="card mb-3 w-100">
                                  <div class="card-body">
                                    <h1 class="fs-5">Your Review</h1>
                                    <p class="starability-result" data-rating="${
                                      review.Ratings
                                    }">
                                      Rated: ${review.Ratings} stars
                                    </p>
                                    <p class="card-text">Comment: ${
                                      review.Comment
                                    }</p>
                                  </div>
                                </div>

                                <button
                                class="btn btn-primary"
                                data-bs-target="#edit-movie-review${
                                  initialDisplay + i
                                }"
                                data-bs-toggle="modal"
                                data-bs-dismiss="modal"
                              >
                                Edit your comment
                              </button>

                              <form action="">
                              <div class="no-view">
                                <input
                                  type="text"
                                  name="ratings"
                                  value="${review.Ratings}"
                                />
                                <input
                                  type="text"
                                  name="comment"
                                  value="${review.Comment}"
                                />
                              </div>
                              <button class="btn btn-danger">Delete your review</button>
                            </form>
                              `
                            )
                            .join("")
                        : ""
                    }
                  </div>      
                  </div>
                </div>
              </div>
            </div>
            <div
              class="modal fade"
              id="edit-movie-review${initialDisplay + i}"
              aria-hidden="true"
              aria-labelledby="edit-movie-review-label"
              tabindex="-1"
            >
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <form action="#">
                    <div class="modal-header">
                      <h5 class="modal-title" id="edit-movie-review-label">
                        Change review comment
                      </h5>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      ${reviewItems
                        .filter(
                          (review) =>
                            review.Movie_id === movie.id &&
                            review.Author._id &&
                            review.Author._id.toString() === user._id
                        )
                        .map(
                          (review) => `
                            <div class="mb-3">
                              <!-- still working here -->
                              <h3>${movie.original_title} rating</h3>
                              <p class="starability-result" data-rating="${review.Ratings}">
                                Rated: 3 stars
                              </p>
                            </div>

                            <div>
                              <legend>Comment</legend>
                              <textarea
                                type="text"
                                name="comment"
                                id="${movie.original_title}-review"
                              >${review.Comment}</textarea>
                              <label for="${movie.original_title}-review"></label>
                            </div>
                          `
                        )}
                      <!-- Hide this modal and show the first with the button below. -->
                    </div>
                    <div class="modal-footer">
                      <button
                        type="button"
                        class="btn btn-primary"
                        data-bs-target="#movie-info${initialDisplay + i}"
                        data-bs-toggle="modal"
                        data-bs-dismiss="modal"
                      >
                        Back to details
                      </button>
                      <button class="btn btn-success">Update comment</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <a
              class="card-details d-flex justify-content-center align-items-center"
              data-bs-toggle="modal"
              href="#movie-info${initialDisplay + i}"
              role="button"
              id="show-info"
            >
              <span class="material-symbols-outlined mx-2"> info </span>
              Show Info</a
            >
            <!-- End of new code -->
            
            <!-- review feature -->
            <div class="card-review">
              <button
                class="card-review-button d-flex justify-content-center align-items-center"
                data-bs-toggle="modal"
                data-bs-target="#movie-review-modal${initialDisplay + i}"
                data-bs-whatever="@getbootstrap"
                id="review-button${i}"
              >
                <span class="material-symbols-outlined"> star </span>
                Review
              </button>

              <!-- modal for review -->
              <div
                class="modal fade"
                id="movie-review-modal${initialDisplay + i}"
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
                        Write a review for ${movie.original_title}
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
                            <label for="trending-rate1${
                              initialDisplay + i
                            }">1 star.</label>

                            <input
                              type="radio"
                              id="trending-rate2${initialDisplay + i}"
                              name="rating"
                              value="2"
                            />
                            <label for="trending-rate2${
                              initialDisplay + i
                            }">2 stars.</label>

                            <input
                              type="radio"
                              id="trending-rate3${initialDisplay + i}"
                              name="rating"
                              value="3"
                            />
                            <label for="trending-rate3${
                              initialDisplay + i
                            }">3 stars.</label>

                            <input
                              type="radio"
                              id="trending-rate4${initialDisplay + i}"
                              name="rating"
                              value="4"
                            />
                            <label for="trending-rate4${
                              initialDisplay + i
                            }">4 stars.</label>

                            <input
                              type="radio"
                              id="trending-rate5${initialDisplay + i}"
                              name="rating"
                              value="5"
                            />
                            <label for="trending-rate5${
                              initialDisplay + i
                            }">5 stars.</label>

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
            <!-- End of review feature -->

            <div class="card-wishlist" role="button">
              <form
                action="/addtowishlist"
                method="post"
                enctype="multipart/form-data"
              >
                <input
                  type="text"
                  class="d-none"
                  name="Movie_id"
                  id=""
                  value="${movie.id}"
                />
                <input
                  type="text"
                  class="d-none"
                  name="MovieName"
                  id=""
                  value="${movie.original_title}"
                />
                <input
                  type="text"
                  class="d-none"
                  name="Poster_path"
                  id=""
                  value="${movie.poster_path}"
                />
                <button class="fw-bolder d-flex justify-content-center card-wishlist-btn">
                  <span class="material-symbols-outlined"> add </span>
                  Wishlist
                </button>
              </form>
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
