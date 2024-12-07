describe('Country Explorer App', function () {

    let mockFetchCountries;
    let mockLocalStorage;

    beforeEach(function () {
        mockLocalStorage = {
            getItem: function (key) {
                return key === 'favorites' ? JSON.stringify([]) : null;
            },
            setItem: function () {}
        };
        Object.defineProperty(window, 'localStorage', {
            value: mockLocalStorage
        });

        mockFetchCountries = jasmine.createSpy('fetchCountries');
        window.fetch = mockFetchCountries;

        localStorage.setItem('favorites', JSON.stringify([]));
    });

    it('should fetch countries successfully and render them', async function () {
        // Mock successful fetch
        const countriesMock = [{ name: { common: 'India' }, flags: { svg: 'india.svg' }, region: 'Asia' }];
        mockFetchCountries.and.returnValue(Promise.resolve({ ok: true, json: function() { return Promise.resolve(countriesMock); } }));

        // Calling fetchCountries and check rendering
        await fetchCountries();
        expect(countries.length).toBe(1);
        expect(countries[0].name.common).toBe('India');
        expect(mockFetchCountries).toHaveBeenCalledTimes(1);
    });

    it('should apply region filter correctly', async function () {
        const countriesMock = [
            { name: { common: 'India' }, flags: { svg: 'india.svg' }, region: 'Asia' },
            { name: { common: 'Germany' }, flags: { svg: 'germany.svg' }, region: 'Europe' }
        ];
        mockFetchCountries.and.returnValue(Promise.resolve({ ok: true, json: function() { return Promise.resolve(countriesMock); } }));

        await fetchCountries('', 'Asia');
        expect(countries.length).toBe(1);
        expect(countries[0].region).toBe('Asia');
    });

    it('should handle search query and filter countries by name', async function () {
        const countriesMock = [
            { name: { common: 'India' }, flags: { svg: 'india.svg' }, region: 'Asia' },
            { name: { common: 'Indonesia' }, flags: { svg: 'indonesia.svg' }, region: 'Asia' }
        ];
        mockFetchCountries.and.returnValue(Promise.resolve({ ok: true, json: function() { return Promise.resolve(countriesMock); } }));

        await fetchCountries('Ind');
        expect(countries.length).toBe(2);
        expect(countries[0].name.common).toBe('India');
    });

    it('should handle language filter', async function () {
        const countriesMock = [
            { name: { common: 'India' }, flags: { svg: 'india.svg' }, languages: { hindi: 'Hindi', english: 'English' } },
            { name: { common: 'Germany' }, flags: { svg: 'germany.svg' }, languages: { german: 'German' } }
        ];
        mockFetchCountries.and.returnValue(Promise.resolve({ ok: true, json: function() { return Promise.resolve(countriesMock); } }));

        await fetchCountries('', '', 'English');
        expect(countries.length).toBe(1);
        expect(countries[0].name.common).toBe('India');
    });

    it('should render countries correctly on page load', function () {
        countries = [
            { name: { common: 'India' }, flags: { svg: 'india.svg' } },
            { name: { common: 'USA' }, flags: { svg: 'usa.svg' } }
        ];

        renderCountries();
        const countryList = document.getElementById('countryList');
        expect(countryList.children.length).toBe(2);
    });

    it('should add a country to favorites', function () {
        addToFavorites('India');
        expect(favorites.length).toBe(1);
        expect(favorites).toContain('India');
        expect(localStorage.setItem).toHaveBeenCalledWith('favorites', JSON.stringify(['India']));
    });

    it('should not add more than 5 favorites', function () {
        favorites = ['India', 'USA', 'Germany', 'Canada', 'Japan'];
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        addToFavorites('China');
        expect(favorites.length).toBe(5);
        expect(favorites).not.toContain('China');
        expect(window.alert).toHaveBeenCalledWith('You can only have up to 5 favorites!');
    });

    it('should remove a country from favorites', function () {
        favorites = ['India', 'USA'];
        localStorage.setItem('favorites', JSON.stringify(favorites));

        removeFromFavorites('India');
        expect(favorites.length).toBe(1);
        expect(favorites).not.toContain('India');
        expect(localStorage.setItem).toHaveBeenCalledWith('favorites', JSON.stringify(['USA']));
    });

    it('should render favorites correctly', function () {
        favorites = ['India', 'USA'];
        localStorage.setItem('favorites', JSON.stringify(favorites));

        renderFavorites();
        const favoriteList = document.getElementById('favoriteList');
        expect(favoriteList.children.length).toBe(2);
    });

    it('should clear search suggestions when input is empty', function () {
        const searchInput = document.getElementById('searchInput');
        const suggestionBox = document.getElementById('suggestionBox');

        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        expect(suggestionBox.innerHTML).toBe('');
    });

    it('should display error message when fetch fails', async function () {
        mockFetchCountries.and.returnValue(Promise.resolve({ ok: false }));

        await fetchCountries();
        const errorMessage = document.getElementById('errorContainer');
        expect(errorMessage.style.display).toBe('block');
    });

    it('should handle "View More" functionality in search suggestions', function () {
        const suggestionsMock = [
            { name: { common: 'India' } },
            { name: { common: 'Indonesia' } }
        ];
        const showMoreButton = true;
        displaySearchSuggestions(suggestionsMock, showMoreButton);

        const suggestionBox = document.getElementById('suggestionBox');
        expect(suggestionBox.querySelectorAll('.more-button').length).toBe(1);
    });

    it('should navigate to country details page when clicking on a country', function () {
        const countryName = 'India';
        const spy = spyOn(window, 'location', 'set');
        viewDetails(countryName);
        expect(spy).toHaveBeenCalledWith(`details.html?country=${encodeURIComponent(countryName)}`);
    });

});
