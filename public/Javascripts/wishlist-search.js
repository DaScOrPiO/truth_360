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
      searchWishlists(movie_name);
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
        searchWishlists(movie_name);
      }
    }
  });

  const searchWishlists = async (query) => {
    const search = `/search_wishlist?movie_name=${query}`;

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

          const modalId = `wishlist-search${i}`;

          card.innerHTML = ` <img src="${
            movie.Poster_path &&
            movie.Poster_path !== null &&
            movie.Poster_path !== ""
              ? "https://image.tmdb.org/t/p/original" + movie.Poster_path
              : "/images/no-img.jpg"
          }" class="card-img-top" alt="...">
    
          <div class="modal fade" id="${modalId}" aria-hidden="true" aria-labelledby="wishlist-info-label" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="wishlist-info-label">Modal 1</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body modal-flex">
                  <div class="card mb-3 ${
                    reviewItems.some(
                      (el) =>
                        el.Movie_id === movie.Movie_id && reviewItems.length > 0
                    )
                      ? "review-space"
                      : ""
                  }">
                    <div>
                    <img src="${
                      movie.Poster_path &&
                      movie.Poster_path !== null &&
                      movie.Poster_path !== ""
                        ? "https://image.tmdb.org/t/p/original" +
                          movie.Poster_path
                        : "/images/no-img.jpg"
                    }" class="card-img-top" alt="...">
                    </div>
                    <div class="card-body">
                      <h5 class="card-title fw-bolder fs-2">${
                        movie.MovieName
                      }</h5>
                      <p class="card-text">${movie.Movie_description}</p>
                      <small class="text-muted">
                      <a
                        class="button-trailer"
                        href="https://www.youtube.com/results?search_query=${movie.MovieName}+trailer"
                        target="_blank"
                        >Watch trailer</a
                      >
                    </small>
                    </div>
                  </div>
    
                  <!-- working here -->
                  ${
                    Array.isArray(reviewItems) && reviewItems.length > 0
                      ? `<div class="review-container mb-3 ${
                          reviewItems.some(
                            (el) =>
                              el.Movie_id === movie.Movie_id &&
                              reviews.length > 0
                          )
                            ? "review-space"
                            : ""
                        }" id="reviews-container">
                        ${reviewItems
                          .map((review) => {
                            if (
                              review.Author &&
                              review.Movie_id === movie.Movie_id
                            ) {
                              return `<div class="card mb-3 mx-3">
                                <div class="card-body">
                                  <h1 class="fs-5">Author: ${review.Author.username}</h1>
                                  <p class="starability-result" data-rating="${review.Ratings}">
                                    Rated: ${review.Ratings} stars
                                  </p>
                                  <p class="card-text">Comment: ${review.Comment}</p>
                                </div>
                              </div>`;
                            }
                          })
                          .join("")}
                        <button class="btn btn-primary mx-3" id="view-more">
                          View More
                        </button>
                      </div>`
                      : ""
                  }
                </div>
              </div>
            </div>
          </div>
          <a class="card-details d-flex justify-content-center align-items-center" data-bs-toggle="modal" href="#${modalId}" role="button" id="show-info">
            <span class="material-symbols-outlined mx-2"> info </span>
            Show Info</a>
    
          <div class="card-review" role="button">
            <button class="card-review-button d-flex justify-content-center align-items-center" data-bs-toggle="modal" data-bs-target="#wishlist-search-review-modal${i}" data-bs-whatever="@getbootstrap" id="review-button${i}">
              <span class="material-symbols-outlined"> star </span>
              Review
            </button>
    
            <!-- modal for review -->
            <div class="modal fade" id="wishlist-search-review-modal${i}" tabindex="-1" aria-labelledby="movie-review" aria-hidden="true">
              <form action="/add_review" method="post" class="modal-dialog" enctype="multipart/form-data">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="movie-review">
                      Write a review for ${movie.MovieName}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form>
                      <div class="mb-3">
                        <label for="movie_id">Movie id</label>
                        <input class="form-control" type="text" name="Movie_id" value="${
                          movie.Movie_id
                        }" readonly id="movie_id" />
                      </div>
    
                      <div class="mb-3">
                        <label for="movie_description">Movie Description</label>
                        <input class="form-control text-truncate" type="text" name="Movie_description" value="${
                          movie.Movie_description
                        }" readonly id="movie_description" />
                      </div>
    
                      <div class="mb-3 no-view">
                        <label for="movie_poster">Movie Poster</label>
                        <input class="form-control" type="text" name="Movie_poster" value="${
                          movie.Poster_path
                        }" readonly id="movie_poster" />
                      </div>
    
                      <div class="mb-3 no-view">
                        <label for="movie_name">Movie name</label>
                        <input class="form-control" type="text" name="Movie_name" value="${
                          movie.MovieName
                        }" readonly id="movie_name" />
                      </div>
    
                      <div class="mb-3">
                        <fieldset class="starability-grow">
                          <legend>rating:</legend>
                          <input type="radio" id="search-no-rate${i}" class="input-no-rate" name="rating" value="1" aria-label="No rating." max="5" />
    
                          <input type="radio" id="search-rate1${i}" name="rating" value="1" checked />
                          <label for="search-rate1${i}">1 star.</label>
    
                          <input type="radio" id="search-rate2${i}" name="rating" value="2" />
                          <label for="search-rate2${i}">2 stars.</label>
    
                          <input type="radio" id="search-rate3${i}" name="rating" value="3" />
                          <label for="search-rate3${i}">3 stars.</label>
    
                          <input type="radio" id="search-rate4${i}" name="rating" value="4" />
                          <label for="search-rate4${i}">4 stars.</label>
    
                          <input type="radio" id="search-rate5${i}" name="rating" value="5" />
                          <label for="search-rate5${i}">5 stars.</label>
    
                          <span class="starability-focus-ring"></span>
                        </fieldset>
                      </div>
    
                      <div class="mb-3">
                        <label for="message-text" class="col-form-label">Comment:</label>
                        <textarea class="form-control" id="message-text" name="comment" placeholder="Enter comment"></textarea>
                      </div>
                    </form>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                    <button class="btn btn-success">Drop Review</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
    
          <form action="/remove_fromwishlist" method="post" class="card-review" enctype="multipart/form-data">
            <input type="text" class="d-none" name="Movie_id" id="" value="${
              movie.Movie_id
            }" />
            <input type="text" class="d-none" name="MovieName" id="" value="${
              movie.MovieName
            }" />
            <input type="text" class="d-none" name="Poster_path" id="" value="${
              movie.Poster_path
            }" />
            <button class="card-wishlist-btn d-flex justify-content-center">
              <span class="material-symbols-outlined mx-2">delete</span>
              Remove Item
            </button>
          </form>`;
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
