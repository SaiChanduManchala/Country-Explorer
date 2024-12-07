// Global Variables
let page = 1;
let pageSize = 12;
let countries = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

/**
 * Fetch countries with optional filters (search query, region, language).
 * @param {string} searchQuery - Text to filter countries by name.
 * @param {string} region - Region filter.
 * @param {string} language - Language filter.
 */
async function fetchCountries(searchQuery = '', region = '', language = '') {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) throw new Error('Failed to load countries');
        countries = await response.json();

        // Applying filters
        if (searchQuery) {
            countries = countries.filter(country =>
                country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        if (region) {
            countries = countries.filter(country => country.region === region);
            countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
            document.getElementById('filterLanguage').selectedIndex = 0; // Reset language filter
        }
        if (language) {
            countries = countries.filter(country =>
                Object.values(country.languages || {}).includes(language)
            );
            document.getElementById('filterRegion').selectedIndex = 0; // Reset region filter
        }
        renderCountries();
    } catch (error) {
        displayErrorMessage('Could not load country data. Please try again later.');
        console.error(error);
    }
}

function renderCountries() {
    const countryList = document.getElementById('countryList');
    countryList.innerHTML = ''; // It will Clear existing cards

    countries.slice(0, page * pageSize).forEach(country => {
        const card = document.createElement('div');
        card.classList.add('country-card');
        card.innerHTML = `
            <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" width="100">
            <h3>${country.name.common}</h3>
        `;
        card.addEventListener('click', () => viewDetails(country.name.common));
        countryList.appendChild(card);
    });

    const loadMoreButton = document.getElementById('loadMore');
    loadMoreButton.style.display = (page * pageSize < countries.length) ? 'block' : 'none';
    renderFavorites(); // Render favorites
}

// To Show more countries when "Show More" button is clicked
document.getElementById('loadMore').addEventListener('click', () => {
    page++;
    renderCountries();
});

/**
 * Handling search input and display suggestions with a "More" button.
 */
document.getElementById('searchInput').addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    const filteredResults = countries.filter(country =>
        country.name.common.toLowerCase().includes(query)
    );
    displaySearchSuggestions(filteredResults.slice(0, 5), filteredResults.length > 5);
});

// Clearing previous suggestions and reset page on search focus

document.getElementById('searchInput').addEventListener('focus', () => {
    document.getElementById('suggestionBox').innerHTML = '';
    page = 1;
});

/**
 * To Display search suggestions in a dropdown with "More" button for extra results.
 */
function displaySearchSuggestions(suggestions, showMoreButton) {
    const suggestionBox = document.getElementById('suggestionBox');
    suggestionBox.innerHTML = '';

    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.classList.add('suggestion-item');
        item.textContent = suggestion.name.common;

        item.addEventListener('click', () => {
            viewDetails(suggestion.name.common);
            suggestionBox.style.display = 'none';
        });
        suggestionBox.appendChild(item);
    });

    if (showMoreButton) {
        const moreButton = document.createElement('button');
        moreButton.textContent = 'View More';
        moreButton.classList.add('more-button');
        moreButton.addEventListener('click', () => loadMoreSuggestions(suggestions));
        suggestionBox.appendChild(moreButton);
    }
    suggestionBox.style.display = 'block';
}

/**
 * Display all search suggestions when "More" is clicked.
 */
function loadMoreSuggestions(suggestions) {
    displaySearchSuggestions(suggestions);
}

/**
 * TO View details of a specific country.
 */
function viewDetails(countryName) {
    window.location.href = `details.html?country=${encodeURIComponent(countryName)}`;
}

/**
 * Render the favorites list with delete option on hover.
 */
function renderFavorites() {
    const favoriteList = document.getElementById('favoriteList');
    favoriteList.innerHTML = '';

    if (favorites.length === 0) {
        document.getElementById('favorites').classList.add('hidden');
    } else {
        document.getElementById('favorites').classList.remove('hidden');

        favorites.forEach(fav => {
            const listItem = document.createElement('li');
            listItem.textContent = fav;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '❌';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', () => removeFromFavorites(fav));

            listItem.appendChild(deleteButton);
            favoriteList.appendChild(listItem);
        });
    }
}

/**
 * To Add a country to favorites.
 */
function addToFavorites(countryName) {
    if (favorites.length < 5 && !favorites.includes(countryName)) {
        favorites.push(countryName);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        renderFavorites();
    } else if (favorites.length >= 5) {
        alert('You can only have up to 5 favorites!');
    }
}

/**
 * To Remove a country from favorites.
 */
function removeFromFavorites(countryName) {
    favorites = favorites.filter(fav => fav !== countryName);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites();
}

// To Close search suggestions when clicking outside
document.addEventListener('click', (event) => {
    const searchInput = document.getElementById('searchInput');
    const suggestionBox = document.getElementById('suggestionBox');
    if (!searchInput.contains(event.target) && !suggestionBox.contains(event.target)) {
        suggestionBox.innerHTML = '';
    }
});

// To Clear suggestions if input is empty
document.getElementById('searchInput').addEventListener('input', (event) => {
    if (event.target.value === '') {
        document.getElementById('suggestionBox').innerHTML = '';
    }
});

// Filter by region
document.getElementById('filterRegion').addEventListener('change', (event) => {
    page = 1;
    fetchCountries('', event.target.value);
});

// Filter by language
document.getElementById('filterLanguage').addEventListener('change', (event) => {
    page = 1;
    fetchCountries('', '', event.target.value);
});


// Initialize app
fetchCountries();
renderFavorites();

