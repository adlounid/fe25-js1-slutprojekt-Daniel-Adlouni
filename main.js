import { fetchData } from './api.js';
import { renderMovies, renderPeople, showError, clearError, clearResults } from './ui.js';

const searchForm = document.querySelector('#search-form');

// --- Helper för att hantera dataflödet ---
async function handleDataFetch(endpoint, isMovie = true, isSearch = false) {
    clearError();
    
    try {
        const data = await fetchData(endpoint);
        
        if (!data || data.length === 0) {
            clearResults();
            showError(isMovie ? "Inga filmer hittades." : "Inga personer hittades.");
        } else {
            if (isMovie) {
                // Om det är sökning (isSearch = true), visa beskrivning. Annars (Top/Popular), dölj beskrivning.
                renderMovies(isSearch ? data : data.slice(0, 10), isSearch); 
            } else {
                renderPeople(data);
            }
        }
    } catch (error) {
        console.log(error);
        clearResults();
        // nätverksfel eller serverfel
        showError("Ett fel uppstod vid hämtning av data. Kontrollera din anslutning eller försök igen senare.");
    }
}

// --- Event Listeners ---

document.querySelector('#top-rated-btn').addEventListener('click', () => {
    handleDataFetch('/movie/top_rated?page=1', true, false);
});

document.querySelector('#popular-btn').addEventListener('click', () => {
    handleDataFetch('/movie/popular?page=1', true, false);
});

searchForm.addEventListener('submit', (event) => {
    event.preventDefault(); 
    const query = document.querySelector('#search-input').value;
    const type = document.querySelector('#search-type').value;

    if (query) {
        const encodedQuery = encodeURIComponent(query);
        const endpoint = `/search/${type}?query=${encodedQuery}`;
        handleDataFetch(endpoint, type === 'movie', true);
    }
});