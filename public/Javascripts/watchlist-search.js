document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("button-addon2");
  const input = document.getElementById("search");
  const searchContainer = document.getElementById("search-section");
  const pageModal = document.querySelector(".page-modal");

  searchButton.addEventListener("click", function () {
    const movie_name = input.value;
    if (!movie_name || movie_name === "") {
      Swal.fire({
        icon: "info",
        title: "Include a movie name!",
        customClass: {
          confirmButton: "sweet-alert-btn",
        },
        showConfirmButton: true,
        confirmButtonText: "OK",
      });
    } else {
      searchWatchlists(movie_name);
    }
  });

  document.addEventListener("keypress", function (e) {
    const movie_name = input.value;
    if (e.key === "Enter" && document.activeElement === input) {
      if (!movie_name || movie_name === "") {
        Swal.fire({
          icon: "info",
          title: "Include a movie name!",
          customClass: {
            confirmButton: "sweet-alert-btn",
          },
          showConfirmButton: true,
          confirmButtonText: "OK",
        });
      } else {
        searchWatchlists(movie_name);
      }
    }
  });

  const searchWatchlists = async (query) => {
    const search = `/search_watchlist?movie_name=${query}`;

    try {
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
      console.log(data);

      if (data && data.length > 0) {
        searchContainer.innerHTML = "";

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

        searchContainer.appendChild(closeButtonContainer);

        data.forEach((movie, i) => {
          const card = document.createElement("div");
          card.classList.add("card", "mx-auto", "my-4", "px-4", "py-2");
          card.style.width = "16rem";

          const imgSrc = `https://image.tmdb.org/t/p/original${
            movie.Poster_path || movie.backdrop_poster
          }`;
          const modalId = `wishlist-search${i}`;

          card.innerHTML = `
          <img src="https://image.tmdb.org/t/p/original${
            movie.Movie_poster
          }" class="card-img-top" alt="...">

          <!-- New code here -->
          <div
            class="modal fade"
            id="watchlist-search-info${i}"
            aria-hidden="true"
            aria-labelledby="watchlist-info-label"
            tabindex="-1"
          >
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="watchlist-info-label">Modal 1</h5>
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
                        el.Movie_id === movie.Movie_id && reviewItems.length > 0
                    )
                      ? "card-space"
                      : ""
                  }">
                    <div>
                      <img
                        src="https://image.tmdb.org/t/p/w342${
                          movie.Movie_poster
                        }"
                        class="card-img-top"
                        alt="..."
                      />
                    </div>
                    <div class="card-body">
                      <h5 class="card-title">${movie.Movie_name}</h5>
                      <p class="card-text">${movie.Movie_description}</p>
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
                    user && Array.isArray(reviewItems) && reviewItems.length > 0
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
                                  <p class="starability-result" data-rating="${review.Ratings}">
                                    Rated: ${review.Ratings} stars
                                  </p>
                                  <p class="card-text">Comment: ${review.Comment}</p>
                                </div>
                              </div>

                              <button
                              class="btn btn-primary"
                              data-bs-target="#edit-watchlist-search-review${i}"
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
            id="edit-watchlist-search-review${i}"
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
                            <h3>${movie.Movie_name} rating</h3>
                            <p class="starability-result" data-rating="${review.Ratings}">
                              Rated: 3 stars
                            </p>
                          </div>

                          <div class="d-none">
                            <input type="text" name="id" value="${review._id}" />
                          </div>

                          <div>
                            <legend>Comment</legend>
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
                      data-bs-target="#watchlist-search-info${i}"
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
            href="#watchlist-search-info${i}"
            role="button"
            id="show-info"
          >
            <span class="material-symbols-outlined mx-2"> info </span>
            Show Info</a
          >
          <!-- End of new code -->
        `;
          searchContainer.appendChild(card);
          searchContainer.classList.remove("d-none");
          pageModal.classList.remove("no-view");
          closeButton.addEventListener("click", (e) => {
            // e.stopPropagation();
            searchContainer.classList.add("d-none");
            pageModal.classList.add("no-view");
            input.value = "";
          });
        });
      } else {
        Swal.fire({
          icon: "info",
          title: "Cannot find movie :(",
          customClass: {
            confirmButton: "sweet-alert-btn",
          },
          showConfirmButton: true,
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
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
      console.error("Error fetching data:", err);
    }
  };

  document.addEventListener("click", (e) => {
    if (!searchContainer.contains(e.target) && pageModal.contains(e.target)) {
      searchContainer.classList.add("d-none");
      pageModal.classList.add("no-view");
      input.value = "";
    }
  });
});
