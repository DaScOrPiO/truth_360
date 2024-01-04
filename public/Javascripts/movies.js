document.addEventListener("DOMContentLoaded", function () {
  const contentContainer = document.getElementById("content-container");
  const loadMoreBtn = document.getElementById("load-more");

  console.log(key);
  let page = 2;
  const loadMoreContent = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${key}`
      );
      //   const res = await fetch(`/api/showMovies?page=${page}`);
      const data = await res.json();
      console.log(data, "is data");
      const result = data.results
    //   const movies = data.data2
    //   console.log(movies, "is movies");
      result.forEach((movie) => {
        const card = document.createElement("div");
        card.classList.add("card", "mx-2", "mb-3");
        card.style.width = "18rem";

        card.innerHTML = `
          <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" class="card-img-top" alt="...">
          <div class="card-body">
            <p class="card-text">${movie.overview}</p>
          </div>
        `;

        contentContainer.appendChild(card);
      });
      page++;
    } catch (error) {
      console.error("Error fetching more data:", error);
    }
  };

  loadMoreBtn.addEventListener("click", loadMoreContent);

  function isBottom() {
    return window.innerHeight + window.scrollY >= document.body.offsetHeight;
  }

  function handleScroll() {
    if (isBottom()) {
      loadMoreContent();
    }
  }

  // Attach the scroll event listener
  window.addEventListener("scroll", handleScroll);
});
