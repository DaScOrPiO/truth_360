document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("button-addon2");
  const input = document.getElementById("search");
  const searchContainer = document.getElementById("search-section");
  const pageModal = document.querySelector(".page-modal");
  const include_adult = document.getElementById("includeAdult");
  const language = document.getElementById("lang");
  const primary_release_year = document.getElementById("release_year");
  const region = document.getElementById("location");

  searchButton.addEventListener("click", function () {
    const series_name = input.value;
    if (!series_name || series_name === "") {
      Swal.fire({
        icon: "info",
        title: "Include a tv-show name",
        customClass: {
          confirmButton: "sweet-alert-btn",
        },
        showConfirmButton: true,
        confirmButtonText: "OK",
      });
    } else {
      searchSeries(series_name);
    }
  });

  document.addEventListener("keypress", function (e) {
    const series_name = input.value;
    if (e.key === "Enter" && document.activeElement === input) {
      if (!series_name || series_name === "") {
        Swal.fire({
          icon: "info",
          title: "Include a tv-show name!",
          customClass: {
            confirmButton: "sweet-alert-btn",
          },
          showConfirmButton: true,
          confirmButtonText: "OK",
        });
      } else {
        searchSeries(series_name);
      }
    }
  });

  const searchSeries = async (query) => {
    const include_adultQuery = include_adult.checked;
    const languageQuery = language.value === "" ? null : language.value;
    const primary_release_yearQuery =
      primary_release_year.value === "" ? null : primary_release_year.value;
    const regionQuery = region.value === "" ? null : region.value;

    const additionalQuery = `&include_adult=${include_adultQuery}&language=${languageQuery}&primary_release_year=${primary_release_yearQuery}&region=${regionQuery}`;
    const search = `https://api.themoviedb.org/3/search/tv?api_key=${key}&query=${query} + ${additionalQuery}`;

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
      const movies = data.results;

      if (movies && movies.length > 0) {
        pageModal.classList.remove("d-none");

        // Clear previous search results
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
        closeButton.innerHTML = `<span class="material-symbols-outlined"> close </span>`;

        searchContainer.appendChild(closeButtonContainer);

        movies.forEach((movie, i) => {
          const card = document.createElement("div");
          card.classList.add("card", "mx-auto", "my-4", "px-4", "py-2");
          card.style.width = "16rem";

          card.innerHTML = `
          <img src="${
            movie.poster_path &&
            movie.poster_path !== null &&
            movie.poster_path !== ""
              ? "https://image.tmdb.org/t/p/original" + movie.poster_path ||
                movie.backdrop_path
              : "/images/no-img.jpg"
          }" class="card-img-top" alt="Movie-poster" style="height: 90%;">
    
                <!-- New code here -->
                <div
                  class="modal fade"
                  id="movie-search${i}"
                  aria-hidden="true"
                  aria-labelledby="movie-search-label"
                  tabindex="-1"
                >
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title fw-bolder" id="movie-search-label">${movie.name} Info</h5>
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
                              el.Movie_id === movie.id && reviewItems.length > 0
                          )
                            ? "card-space"
                            : ""
                        }">
                          <div>
                          <img src="${
                            movie.poster_path &&
                            movie.poster_path !== null &&
                            movie.poster_path !== ""
                              ? "https://image.tmdb.org/t/p/original" +
                                  movie.poster_path || movie.backdrop_path
                              : "/images/no-img.jpg"
                          }"
                              class="card-img-top"
                              alt="poster"
                            />
                          </div>
                          <div class="card-body">
                            <h5 class="card-title fw-bolder fs-2">${
                              movie.name
                            }</h5>
                            <p class="card-text">${movie.overview}</p>
                            <p class="d-flex align-items-center">
                        <i class="gold material-symbols-outlined"> stars </i>
                        <span class="gold mx-2">
                          ${Math.round((movie.vote_average / 2) * 10) / 10} /5
                        </span>
                        on TMDB
                      </p>
                      <small class="text-muted">
                        <a
                          class="button-trailer"
                          href="https://www.youtube.com/results?search_query=${
                            movie.name
                          }+trailer"
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
                                    el.Movie_id === movie.id &&
                                    reviewItems.length > 0
                                )
                                  ? "review-space"
                                  : ""
                              } mb-3" id="reviews-container">
                              ${reviewItems
                                .filter(
                                  (review) =>
                                    review.Author &&
                                    review.Movie_id === movie.id
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
                                        <p class="starability-result" data-rating="${review.Ratings}">
                                          Rated: ${review.Ratings} stars
                                        </p>
                                        <p class="card-text">Comment: ${review.Comment}</p>
                                      </div>
                                    </div>
    
                                    <button
                                    class="btn btn-primary"
                                    data-bs-target="#edit-movie-search-review${i}"
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
                  id="edit-movie-search-review${i}"
                  aria-hidden="true"
                  aria-labelledby="edit-search-review-label"
                  tabindex="-1"
                >
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                      <form action="/edit_review?_method=PUT"
                            method="post"
                            enctype="multipart/form-data">
                        <div class="modal-header">
                          <h5 class="modal-title" id="edit-search-review-label">
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
                                  <h3>${movie.name} rating</h3>
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
                                    id="${movie.name}-review"
                                  >${review.Comment}</textarea>
                                  <label for="${movie.name}-review"></label>
                                </div>
                              `
                            )}
                          <!-- Hide this modal and show the first with the button below. -->
                        </div>
                        <div class="modal-footer">
                          <button
                            type="button"
                            class="btn btn-primary"
                            data-bs-target="#movie-search${i}"
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
                  href="#movie-search${i}"
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
                    data-bs-target="#search-review-modal${i}"
                    data-bs-whatever="@getbootstrap"
                    id="search-review-button${i}"
                  >
                    <span class="material-symbols-outlined"> star </span>
                    Review
                  </button>
    
                  <!-- modal for review -->
                  <div
                    class="modal fade"
                    id="search-review-modal${i}"
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
                            <label for="movie_description">Movie Description</label>
                            <input
                              class="form-control text-truncate"
                              type="text"
                              name="Movie_description"
                              value="${movie.overview}"
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
                              value="${movie.poster_path}"
                              readonly
                              id="movie_poster"
                            />
                          </div>

                          <div class="mb-3 no-view">
                            <label for="tmdb_ratings">Tmdb rating</label>
                            <input
                              class="form-control"
                              type="text"
                              name="Tmdb_rating"
                              value="${
                                Math.round((movie.vote_average / 2) * 10) / 10
                              }"
                              readonly
                              id="tmdb_ratings"
                            />
                        </div>
    
                          <div class="mb-3 no-view">
                          <label for="movie_name">Movie name</label>
                          <input
                            class="form-control"
                            type="text"
                            name="Movie_name"
                            value="${movie.name}"
                            readonly
                            id="movie_name"
                          />
                        </div>
        
    
                            <div class="mb-3">
                              <fieldset class="starability-grow">
                                <legend>rating:</legend>
                                <input
                                  type="radio"
                                  id="search-review-no-rate${i}"
                                  class="input-no-rate"
                                  name="rating"
                                  value="1"
                                  aria-label="No rating."
                                  max="5"
                                />
    
                                <input
                                  type="radio"
                                  id="movies-search-review-rate1${i}"
                                  name="rating"
                                  value="1"
                                  checked
                                />
                                <label for="movies-search-rate1${i}">1 star.</label>
    
                                <input
                                  type="radio"
                                  id="movies-search-rate2${i}"
                                  name="rating"
                                  value="2"
                                />
                                <label for="movies-search-rate2${i}">2 stars.</label>
    
                                <input
                                  type="radio"
                                  id="movies-search-rate3${i}"
                                  name="rating"
                                  value="3"
                                />
                                <label for="movies-search-rate3${i}">3 stars.</label>
    
                                <input
                                  type="radio"
                                  id="movies-search-rate4${i}"
                                  name="rating"
                                  value="4"
                                />
                                <label for="movies-search-rate4${i}">4 stars.</label>
    
                                <input
                                  type="radio"
                                  id="movies-search-rate5${i}"
                                  name="rating"
                                  value="5"
                                />
                                <label for="movies-search-rate5${i}">5 stars.</label>
    
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
                      value="${movie.name}"
                    />
                    <input
                    class="form-control d-none"
                    type="text"
                    name="Movie_description"
                    value="${movie.overview}"
                    readonly
                    id="movie_description"
                  />
                    <input
                      type="text"
                      class="d-none"
                      name="Poster_path"
                      id=""
                      value="${movie.poster_path}"
                    />
                    <input
                      type="text"
                      class="d-none"
                      name="Tmdb_rating"
                      id=""
                      value="${Math.round((movie.vote_average / 2) * 10) / 10}"
                    />
                    <button class="fw-bolder d-flex justify-content-center card-wishlist-btn">
                      <span class="material-symbols-outlined"> add </span>
                      Wishlist
                    </button>
                  </form>
                </div>
              `;

          // Append the card to the search container
          searchContainer.appendChild(card);
          closeButton.addEventListener("click", (e) => {
            // e.stopPropagation();
            searchContainer.classList.add("d-none");
            pageModal.classList.add("no-view");
            input.value = "";
          });
        });
        searchContainer.classList.remove("d-none");
        pageModal.classList.remove("no-view");
      } else {
        Swal.fire({
          icon: "info",
          title: "Cannot find tv-show :(",
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

  document.addEventListener("click", (e) => {
    if (!searchContainer.contains(e.target) && pageModal.contains(e.target)) {
      searchContainer.classList.add("d-none");
      pageModal.classList.add("no-view");
      input.value = "";
    }
  });
});
