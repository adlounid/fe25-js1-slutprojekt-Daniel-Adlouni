const API_KEY = "528a134078196349d76bbbebd9b7aa6e"; 
const BASE_URL = "https://api.themoviedb.org/3";

export async function fetchData(endpoint) {
    const url = `${BASE_URL}${endpoint}&api_key=${API_KEY}&language=en-US&include_adult=false`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Kunde inte hämta data. Status: " + response.status);
    }

    const data = await response.json();
    return data.results;
}