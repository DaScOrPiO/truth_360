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

        moreItems.forEach((movie, i) => {
          const card = document.createElement("div");
          card.classList.add("card", "mx-auto", "my-4", "px-4", "py-2");
          card.style.width = "16rem";

          card.innerHTML = `
          <img src="${
            movie.Movie_poster &&
            movie.Movie_poster !== null &&
            movie.Movie_poster !== ""
              ? "https://image.tmdb.org/t/p/original" + movie.Movie_poster
              : "/images/no-img.jpg"
          }" class="card-img-top" alt="Movie-poster">
  
              <!-- New code here -->
              <div
                class="modal fade"
                id="watchlist-info${initialDisplay + i}"
                aria-hidden="true"
                aria-labelledby="watchlist-info-label"
                tabindex="-1"
              >
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title fw-bolder" id="watchlist-info-label">${movie.Movie_name} Info</h5>
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
                            el.Movie_id === movie.Movie_id &&
                            reviewItems.length > 0
                        )
                          ? "card-space"
                          : ""
                      }">
                        <div>
                        <img src="${
                          movie.Movie_poster &&
                          movie.Movie_poster !== null &&
                          movie.Movie_poster !== ""
                            ? "https://image.tmdb.org/t/p/original" +
                              movie.Movie_poster
                            : "/images/no-img.jpg"
                        }" 
                            class="card-img-top"
                            alt="Movie-poster"
                          />
                        </div>
                        <div class="card-body">
                          <h5 class="card-title fw-bolder fs-2">${
                            movie.Movie_name
                          }</h5>
                          <p class="card-text">${movie.Movie_description}</p>
                          <small class="text-muted">
                          <a
                            class="button-trailer"
                            href="https://www.youtube.com/results?search_query=${movie.Movie_name}+trailer"
                            target="_blank"
                            >Watch trailer</a
                          >
                        </small>
                        </div>
                      </div>
                      ${
                        Array.isArray(reviewItems) && reviewItems.length > 0
                          ? `
                            <div class="review-container ${
                              reviewItems.some(
                                (el) =>
                                  el.Movie_id === movie.Movie_id &&
                                  reviewItems.length > 0
                              )
                                ? "review-space"
                                : ""
                            } mb-3" id="reviews-container">
                            ${reviewItems
                              .filter(
                                (review) =>
                                  review.Author &&
                                  review.Movie_id === movie.Movie_id
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
                                  review.Movie_id === movie.Movie_id
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
  
                                <form action="/delete_review?_method=DELETE" method="post">
                                <div class="no-view">
                                  <input
                                    type="text"
                                    name="ratings"
                                    value="${review.Ratings}"
                                  />
                                  <input
                                    type="text"
                                    name="review_id"
                                    value="${review._id}"
                                  />
                                  <input
                                    type="text"
                                    name="movie_id"
                                    value="${movie.id}"
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
                    <form action="/edit_review?_method=PUT"
                          method="post"
                          enctype="multipart/form-data">
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
                              review.Movie_id === movie.Movie_id &&
                              review.Author._id &&
                              review.Author._id.toString() === user._id
                          )
                          .map(
                            (review) => `
                              <div class="mb-3">
                                <!-- still working here -->
                                <h3>Your rating</h3>
                                <p class="starability-result" data-rating="${review.Ratings}">
                                  Rated: 3 stars
                                </p>
                              </div>

                              <div class="d-none">
                                <input type="text" name="id" value="${review._id}" />
                              </div>
  
                              <div>
                                <legend>Your comment</legend>
                                <textarea
                                  type="text"
                                  name="comment"
                                  id="${movie.Movie_name}-review"
                                >${review.Comment}</textarea>
                                <label for="${movie.Movie_name}-review"></label>
                              </div>
                            `
                          )}
                        <!-- Hide this modal and show the first with the button below. -->
                      </div>
                      <div class="modal-footer">
                        <button
                          type="button"
                          class="btn btn-primary"
                          data-bs-target="#watchlist-info${initialDisplay + i}"
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
                href="#watchlist-info${initialDisplay + i}"
                role="button"
                id="show-info"
              >
                <span class="material-symbols-outlined mx-2"> info </span>
                Show Info</a
              >
              <!-- End of new code -->
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
      } else {
        isDataAvailable = false;
        loadMoreBtn.classList.add("disabled-pointer");
        Swal.fire({
          icon: "info",
          title: "No more data to load.",
          customClass: {
            confirmButton: "sweet-alert-btn",
          },
          showConfirmButton: true,
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Problem fetching data :(",
        customClass: {
          confirmButton: "sweet-alert-btn",
        },
        showConfirmButton: true,
        confirmButtonText: "OK",
      });
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
      loadMoreMovies();
    }
  };

  loadMoreBtn.addEventListener("click", handleClick);
});
