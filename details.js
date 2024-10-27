// Global variables
let countryDetails = {};
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
const params = new URLSearchParams(window.location.search);
const countryName = params.get('country');

// Fetch country details based on the country name
async function fetchCountryDetails() {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        const countryData = await response.json();
        countryDetails = countryData[0];

        renderCountryDetails();
    } catch (error) {
        displayErrorMessage('Failed to load country details. Please try again later.');
        console.error(error);
    }
}

// Render country details on the details page
function renderCountryDetails() {
    document.getElementById('countryName').textContent = countryDetails.name.common;
    document.getElementById('countryDetails').innerHTML = `
        <img src="${countryDetails.flags.svg}" alt="Flag of ${countryDetails.name.common}" width="100">
        <p><strong>Capital:</strong> ${countryDetails.capital ? countryDetails.capital[0] : 'N/A'}</p>
        <p><strong>Region:</strong> ${countryDetails.region}</p>
        <p><strong>Population:</strong> ${countryDetails.population}</p>
        <p><strong>Area:</strong> ${countryDetails.area} km²</p>
        <p><strong>Languages:</strong> ${Object.values(countryDetails.languages || {}).join(', ')}</p>
        
    `;

    // To Check if this country is already in favorites
    if (favorites.includes(countryDetails.name.common)) {
        document.getElementById('favoriteButton').classList.add('red');
        document.getElementById('favoriteButton').textContent = "❤ Remove from Favorites";
    } else {
        document.getElementById('favoriteButton').textContent = "❤ Add to Favorites";
    }
}

// Add or remove from favorites
document.getElementById('favoriteButton').addEventListener('click', () => {
    if (favorites.includes(countryDetails.name.common)) {
        removeFromFavorites(countryDetails.name.common);
        document.getElementById('favoriteButton').classList.remove('red');
        document.getElementById('favoriteButton').textContent = "❤ Add to Favorites";
    } else {
        if (confirm(`Do you want to add ${countryDetails.name.common} to your favorites?`)) {
            addToFavorites(countryDetails.name.common);
            document.getElementById('favoriteButton').classList.add('red');
            document.getElementById('favoriteButton').textContent = "❤ Remove from Favorites";
        }
    }
});

// Back button functionality
document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Add to favorites function
function addToFavorites(countryName) {
    if (favorites.length < 5 && !favorites.includes(countryName)) {
        favorites.push(countryName);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    } else if (favorites.length >= 5) {
        alert('You can only have up to 5 favorites!');
    }
}

// Remove from favorites function
function removeFromFavorites(countryName) {
    favorites = favorites.filter(fav => fav !== countryName);
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Initialize the details page
fetchCountryDetails();
