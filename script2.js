const apiKey = '2b2aa1ab8eeb3f5a2e5e841549c8f078'; // Replace this with your TMDb API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

const moviesGrid = document.getElementById('movies-grid');
const moviesSectionTitle = document.getElementById('movies-section-title');

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

const popup = document.getElementById('popup');
const popupPoster = document.getElementById('popup-poster');
const popupTitle = document.getElementById('popup-title');
const popupDate = document.getElementById('popup-date');
const popupRating = document.getElementById('popup-rating');
const popupOverview = document.getElementById('popup-overview');
const ratingStarsContainer = document.getElementById('rating-stars');

let currentRating = 0;

window.addEventListener('DOMContentLoaded', () => {
  loadLatestMovies();
  initRatingStars();
});

async function loadLatestMovies() {
  try {
    const res = await fetch(`${BASE_URL}/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`);
    const data = await res.json();
    const movies = data.results.slice(0, 20);
    moviesSectionTitle.textContent = 'Latest Movies';
    displayMovies(movies);
  } catch (err) {
    console.error('Error loading movies:', err);
  }
}

function displayMovies(movies) {
  moviesGrid.innerHTML = '';
  movies.forEach(movie => {
    const card = createMovieCard(movie);
    moviesGrid.appendChild(card);
  });
}

function createMovieCard(movie) {
  const card = document.createElement('div');
  card.className = 'latest-movie-card';
  card.innerHTML = `
    <img src="${movie.poster_path ? IMG_BASE + movie.poster_path : ''}" alt="${movie.title}" />
    <div class="movie-title" title="${movie.title}">${movie.title}</div>
    <div class="movie-year">${movie.release_date ? movie.release_date.split('-')[0] : ''}</div>
  `;
  card.addEventListener('click', () => showMovieDetails(movie.id));
  return card;
}

async function showMovieDetails(id) {
  try {
    const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${apiKey}&language=en-US`);
    const movie = await res.json();

    popupPoster.src = movie.poster_path ? IMG_BASE + movie.poster_path : '';
    popupTitle.textContent = movie.title;
    popupDate.textContent = movie.release_date || 'Unknown';
    popupRating.textContent = movie.vote_average.toFixed(1);
    popupOverview.textContent = movie.overview || 'No overview available.';

    resetRatingStars();

    popup.style.display = 'flex';
  } catch (err) {
    console.error('Error fetching movie details:', err);
  }
}

function closePopup() {
  popup.style.display = 'none';
}

popup.addEventListener('click', e => {
  if (e.target === popup) {
    closePopup();
  }
});

searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    searchMovies(query);
  }
});

searchInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
});

async function searchMovies(query) {
  try {
    const res = await fetch(`${BASE_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en-US&page=1`);
    const data = await res.json();
    if (data.results.length === 0) {
      alert('No movies found for that search.');
      return;
    }
    moviesSectionTitle.textContent = `Search Results for "${query}"`;
    displayMovies(data.results);
  } catch (err) {
    console.error('Error searching movies:', err);
  }
}

// Rating stars logic
function initRatingStars() {
  ratingStarsContainer.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.textContent = '★';
    star.style.cursor = 'pointer';
    star.dataset.value = i;

    star.addEventListener('click', () => {
      currentRating = i;
      updateRatingStars(i);
      alert(`You rated this movie ${i} star${i > 1 ? 's' : ''}!`);
    });

    star.addEventListener('mouseover', () => {
      updateRatingStars(i);
    });

    star.addEventListener('mouseout', () => {
      updateRatingStars(currentRating);
    });

    ratingStarsContainer.appendChild(star);
  }
}

function updateRatingStars(rating) {
  [...ratingStarsContainer.children].forEach((star, index) => {
    star.style.color = index < rating ? 'gold' : '#aaa';
  });
}

function resetRatingStars() {
  currentRating = 0;
  updateRatingStars(0);
}
