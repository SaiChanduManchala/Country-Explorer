import test from 'ava';
import { fetchCountries, renderCountries, addToFavorites, removeFromFavorites, displayErrorMessage } from './app.js'; // import functions from app.js

// Mocking global methods and variables
global.fetch = require('node-fetch');

test.beforeEach(() => {
  localStorage.setItem('favorites', JSON.stringify([])); // Clear favorites before each test
});

test('fetchCountries fetches data and renders countries', async t => {
  // Mock fetch response
  global.fetch = () =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { name: { common: 'Australia' }, flags: { svg: 'flag-url' } },
        { name: { common: 'Canada' }, flags: { svg: 'flag-url' } },
      ]),
    });

  await fetchCountries();
  
  t.is(localStorage.getItem('favorites'), '[]'); // Expect an empty favorites list after fetching countries
});

test('fetchCountries filters countries by name correctly', async t => {
  const searchQuery = 'Canada';
  
  global.fetch = () =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { name: { common: 'Australia' }, flags: { svg: 'flag-url' } },
        { name: { common: 'Canada' }, flags: { svg: 'flag-url' } },
      ]),
    });

  await fetchCountries(searchQuery);
  
  // Assert that only the filtered country appears
  t.is(countries.length, 1);
  t.is(countries[0].name.common, 'Canada');
});

// Test add to favorites
test('addToFavorites adds country to favorites', async t => {
  const countryName = 'Canada';
  addToFavorites(countryName);
  
  const favorites = JSON.parse(localStorage.getItem('favorites'));
  
  t.true(favorites.includes(countryName)); // Expect the country to be added to favorites
});

// Test add to favorites when limit is reached (5)
test('addToFavorites shows alert when favorites limit is reached', async t => {
  // Set up a favorites list with 5 countries
  localStorage.setItem('favorites', JSON.stringify(['Canada', 'Australia', 'India', 'Germany', 'France']));

  // Add a new country
  const countryName = 'Mexico';
  addToFavorites(countryName);
  
  const favorites = JSON.parse(localStorage.getItem('favorites'));
  
  // Ensuring the country is not added
  t.false(favorites.includes(countryName));
  t.is(favorites.length, 5); // There should still be only 5 countries in favorites
});

// Test remove from favorites
test('removeFromFavorites removes country from favorites', async t => {
  localStorage.setItem('favorites', JSON.stringify(['Canada', 'Australia']));
  
  const countryName = 'Canada';
  removeFromFavorites(countryName);
  
  const favorites = JSON.parse(localStorage.getItem('favorites'));
  
  t.false(favorites.includes(countryName)); // Ensure the country is removed from favorites
  t.is(favorites.length, 1); // One country should remain in favorites
});

// Test if error message is displayed on failed fetch
test('displayErrorMessage shows error message when fetch fails', t => {
  // Mock the error scenario
  global.fetch = () => Promise.reject(new Error('Failed to load countries'));
  
  const errorContainer = { innerText: '', style: { display: '' } };
  document.body.appendChild(errorContainer); 
  
  displayErrorMessage('Could not load country data. Please try again later.');
  
  t.is(errorContainer.innerText, 'Could not load country data. Please try again later.');
  t.is(errorContainer.style.display, 'block');
});

// Test render countries logic (mock the DOM rendering)
test('renderCountries renders correct number of country cards', async t => {
  countries = [
    { name: { common: 'Canada' }, flags: { svg: 'flag-url' } },
    { name: { common: 'Australia' }, flags: { svg: 'flag-url' } },
  ];

  document.body.innerHTML = '<div id="countryList"></div>';

  renderCountries();

  const countryCards = document.getElementById('countryList').children;
  t.is(countryCards.length, 2); // Expect 2 country cards to be rendered
});

// Test filtering by region
test('fetchCountries filters countries by region correctly', async t => {
  const region = 'Europe';
  
  global.fetch = () =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { name: { common: 'Germany' }, region: 'Europe', flags: { svg: 'flag-url' } },
        { name: { common: 'Australia' }, region: 'Oceania', flags: { svg: 'flag-url' } },
      ]),
    });

  await fetchCountries('', region);
  
  // Only Germany should appear
  t.is(countries.length, 1);
  t.is(countries[0].name.common, 'Germany');
});

// filtering by language
test('fetchCountries filters countries by language correctly', async t => {
  const language = 'English';
  
  global.fetch = () =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        { name: { common: 'Canada' }, languages: { eng: 'English' }, flags: { svg: 'flag-url' } },
        { name: { common: 'France' }, languages: { fra: 'French' }, flags: { svg: 'flag-url' } },
      ]),
    });

  await fetchCountries('', '', language);
  
  t.is(countries.length, 1);
  t.is(countries[0].name.common, 'Canada');
});
