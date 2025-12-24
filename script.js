
const API_KEY = "528a134078196349d76bbbebd9b7aa6e"; 
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

// --- Hämta element från HTML ---
const container = document.querySelector('#results-container');
const errorMsg = document.querySelector('#error-message');
const searchForm = document.querySelector('#search-form');

// --- Hämta data (Async/Await) ---
async function fetchData(endpoint) {
    try {
        errorMsg.innerText = ''; 
        
        const url = `${BASE_URL}${endpoint}&api_key=${API_KEY}&language=en-US&include_adult=false`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Kunde inte hämta data. Status: " + response.status);
        }

        const data = await response.json();
        return data.results;

    } catch (error) {
        console.log(error);
        errorMsg.innerText = "Kunde inte hämta data.";
        return [];
    }
}

// --- Visa Filmer ---
function renderMovies(movies, showDesc = true) {
    container.innerHTML = ''; 

    if (!movies || movies.length === 0) {
        errorMsg.innerText = "Inga filmer hittades.";
        return;
    }

    movies.forEach(movie => {
        const card = document.createElement('div');
        card.classList.add('card');

        const imgPath = movie.poster_path ? IMAGE_URL + movie.poster_path : 'https://via.placeholder.com/200x300?text=No+Image';


        let descHTML = '';
        if (showDesc) {
            const txt = movie.overview ? movie.overview.substring(0, 100) + '...' : 'Ingen beskrivning.';
            descHTML = `<p class="desc">${txt}</p>`;
        }

        card.innerHTML = `
            <img src="${imgPath}" alt="${movie.title}">
            <div class="card-info">
                <h3>${movie.title}</h3>
                <p class="date">Datum: ${movie.release_date || 'Okänt'}</p>
                ${descHTML} </div>
        `;
        container.appendChild(card);
    });

    animateCards(); 
}

// --- Visa Personer ---
function renderPeople(people) {
    container.innerHTML = ''; 

    if (!people || people.length === 0) {
        errorMsg.innerText = "Inga personer hittades.";
        return;
    }

    people.forEach(person => {
        const card = document.createElement('div');
        card.classList.add('card');

        const imgPath = person.profile_path ? IMAGE_URL + person.profile_path : 'https://via.placeholder.com/200x300?text=No+Image';

        let knownForHTML = '';
        if (person.known_for) {
            person.known_for.slice(0, 3).forEach(work => {
                const title = work.title || work.name; 
                const type = work.media_type === 'tv' ? 'TV' : 'Film';
                knownForHTML += `<li>${type}: ${title}</li>`;
            });
        }

        card.innerHTML = `
            <img src="${imgPath}" alt="${person.name}">
            <div class="card-info">
                <h3>${person.name}</h3>
                <p>Avdelning: ${person.known_for_department}</p>
                <ul>${knownForHTML}</ul>
            </div>
        `;
        container.appendChild(card);
    });

    animateCards(); 
}

// --- Animation ---
function animateCards() {
    if (typeof anime !== 'undefined') {
        anime({
            targets: '.card',
            opacity: [0, 1],
            translateY: [20, 0],
            delay: anime.stagger(100),
            easing: 'easeOutQuad'
        });
    } else {
        document.querySelectorAll('.card').forEach(c => c.style.opacity = 1);
    }
}

// --- Event Listeners ---

document.querySelector('#top-rated-btn').addEventListener('click', async () => {
    const movies = await fetchData('/movie/top_rated?page=1');
    if (movies) {      
        renderMovies(movies.slice(0, 10), false); 
    }
});

// Knapp: Popular
document.querySelector('#popular-btn').addEventListener('click', async () => {
    const movies = await fetchData('/movie/popular?page=1');
    if (movies) {
        renderMovies(movies.slice(0, 10), false); 
    }
});

// Sökformulär
searchForm.addEventListener('submit', async (event) => {
    event.preventDefault(); 
    const query = document.querySelector('#search-input').value;
    const type = document.querySelector('#search-type').value;

    if (query) {
        const encodedQuery = encodeURIComponent(query);
        const data = await fetchData(`/search/${type}?query=${encodedQuery}`);

        if (type === 'movie') {
            renderMovies(data, true); 
        } else {
            renderPeople(data);
        }
    }
});
