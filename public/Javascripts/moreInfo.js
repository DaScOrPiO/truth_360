document.addEventListener("DOMContentLoaded", function () {
  const contentContainer = document.getElementById("content-container");
  const reviewContainer = document.getElementById("reviews-container");
  const moreButtons = document.querySelectorAll('[id^="view-more"]');
  const reviewsPerPage = 5;
  let currentIndex = 0;
  let movieReviews;

  const shouldButtonDisplay = (movieIndex) => {
    console.log("shouldDisplayRan");

    // Check if movieIndex is within the bounds of moreData array
    // if (movieIndex < moreData.length) {
    // Get the current movie at the movieIndex
    const currentMovie = moreData[movieIndex];

    // Filter reviews for the current movie
    movieReviews = reviewItems.filter(
      (item) => item.Movie_id === currentMovie?.id
    );

    // Check if there are more than 5 reviews for the current movie
    const displayStyle = movieReviews.length > reviewsPerPage ? "block" : "none";

    // delegation to set display style for all "View More" buttons using event delegation
    contentContainer
      .querySelectorAll('[id^="view-more"]')
      .forEach((el) => (el.style.display = displayStyle));
    // } else {
    //   // Hide all buttons if movieIndex is out of bounds
    //   contentContainer
    //   .querySelectorAll('[id^="view-more"]')
    //   .forEach((el) => (el.style.display = "none"));
    // }
  };

  // Add event listener to the common ancestor ("contentContainer") for "Show Info" and "View More" buttons
  contentContainer.addEventListener("click", (event) => {
    const target = event.target;

    if (target.id && target.id.startsWith("show-info")) {
      // Extract the movie index from the button's id
      const movieIndex = parseInt(target.id.replace("show-info", ""), 10);
      shouldButtonDisplay(movieIndex);
    }

    if (target.id && target.id.startsWith("view-more")) {
      handleViewMore();
    }
  });

  function displayReviews(startIndex, endIndex) {
    reviewContainer.innerHTML = ""; // Clear existing reviews

    for (let i = startIndex; i < endIndex; i++) {
      if (moreData[i]) {
        // Filter reviews for the current movie
        movieReviews = reviewItems.filter(
          (item) => item.Movie_id === moreData[i].id
        );

        if (movieReviews.length > 0) {
          // Append the review HTML to the container
          movieReviews.forEach((review) => {
            reviewContainer.innerHTML += `
                      <div class="card mb-3 mx-3">
                        <div class="card-body">
                          <h1 class="fs-5">Author: ${review.Author.username}</h1>
                          <p class="starability-result" data-rating="${review.Ratings}">
                            Rated: ${review.Ratings} stars
                          </p>
                          <p class="card-text">Review: ${review.Comment}</p>
                        </div>
                      </div>
                    `;
          });
        }
      }
    }

    shouldButtonDisplay(currentIndex);
  }

  function handleViewMore() {
    const nextIndex = currentIndex + reviewsPerPage;
    displayReviews(currentIndex, nextIndex);
    currentIndex = nextIndex;

    if (currentIndex >= movieReviews.length || movieReviews.length === 0) {
      console.log(currentIndex >= movieReviews.length);
      Swal.fire({
        icon: "info",
        title: "No more data to load.",
      });
    }
  }

  shouldButtonDisplay(currentIndex);
});
