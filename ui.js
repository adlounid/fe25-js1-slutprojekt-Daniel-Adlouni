const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const container = document.querySelector('#results-container');
const errorMsg = document.querySelector('#error-message');

export function showError(message) {
    errorMsg.innerText = message;
}

export function clearError() {
    errorMsg.innerText = '';
}

export function clearResults() {
    container.innerHTML = '';
}

export function renderMovies(movies, showDesc = true) {
    container.innerHTML = ''; 

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

export function renderPeople(people) {
    container.innerHTML = ''; 

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