/**
 * Hämtar och visar handlingen för given film.
 * @param {string} imdbID - IMDb ID för filmen vars detaljer ska hämtas.
 * @param {HTMLElement} button - Knappen som utlöste funktionen.
 */
async function fetchMovieDetails(imdbID, button) {
    const plotDiv = document.getElementById(`plot-${imdbID}`);
    if (plotDiv.textContent === "") {
        try {
            const response = await fetch(`https://www.omdbapi.com/?apikey=3378e53f&i=${imdbID}`);
            if (!response.ok) {
                throw new Error(`Nätverkssvaret var inte okej: ${response.statusText}`);
            }
            const data = await response.json();
            plotDiv.textContent = data.Plot;
            button.textContent = "Dölj handling";
        } catch (error) {
            console.error("Det uppstod ett fel:", error);
        }
    } else {
        plotDiv.textContent = "";
        button.textContent = "Visa handling";
    }
}



/**
 * Skapar och visar en lista av filmer på webbsidan.
 * @param {Array} movies - En array av filmer som ska visas.
 */
function displayMovies(movies) {
    const moviesDiv = document.getElementById("movies");
    moviesDiv.innerHTML = ""; // Rensa tidigare innehåll

    movies.forEach(movie => {
        // Skapa och lägg till element för varje film
        const movieElem = document.createElement("div");
        movieElem.className = "movie-container";

        const movieImageDiv = document.createElement("div");
        movieImageDiv.className = "movie-image";
        movieImageDiv.innerHTML = `<img src="${movie.Poster}" alt="${movie.Title}" />`;

        const movieInfoDiv = document.createElement("div");
        movieInfoDiv.className = "movie-info";

        // Skapa och lägg till titel, år och knappar för varje film
        const titleElem = document.createElement("h1");
        titleElem.textContent = movie.Title;

        const yearElem = document.createElement("p");
        const yearHeader = document.createElement("h3");
        yearHeader.textContent = "Utgivningsår:";
        yearElem.appendChild(yearHeader);
        yearElem.appendChild(document.createTextNode(` ${movie.Year}`));

        const button = document.createElement('button');
        button.onclick = function () { fetchMovieDetails(movie.imdbID, this); };
        button.className = "knapp-lank";
        button.textContent = 'Visa handling';

        const detailsLink = document.createElement("a");
        detailsLink.href = `details.html?imdbID=${movie.imdbID}`;
        detailsLink.className = "knapp-lank";
        detailsLink.textContent = "Detaljer";

        const plotDiv = document.createElement("p");
        plotDiv.id = `plot-${movie.imdbID}`;
        plotDiv.className = "movie-plot";

        // Sammanfoga elementen och lägg till dem i DOM:en
        movieInfoDiv.appendChild(titleElem);
        movieInfoDiv.appendChild(yearElem);
        movieInfoDiv.appendChild(button);
        movieInfoDiv.appendChild(detailsLink);
        movieInfoDiv.appendChild(plotDiv);

        movieElem.appendChild(movieImageDiv);
        movieElem.appendChild(movieInfoDiv);
        moviesDiv.appendChild(movieElem);
    });
}
/**
 * Hämtar söktermen från URL-parametrarna och returnerar den.
 * @returns {string|null} Söktermen eller null om den inte finns.
 */
function getSearchTermFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('search');
}

/**
 * Hämtar detaljer för en specifik film från både OMDb och CMDb, kombinerar data och visar den.
 * @param {string} imdbID - IMDb-identifikatorn för filmen vars detaljer ska hämtas.
 */
async function fetchMovieDetailsDisplay(imdbID) {
    const detailApiUrl = `https://www.omdbapi.com/?apikey=3378e53f&i=${imdbID}`;
    const cmdbsUrl = `https://grupp6.dsvkurs.miun.se/api/movies/${imdbID}`;

    try {
        // Hämta data från CMDb
        const cmdbsMovie = await fetch(cmdbsUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer 3378e53f`
            }
        }).then(response => response.json())
          .catch(error => {
              console.error("Det uppstod ett fel:", error);
          });

        // Hämta data från OMDb
        const omdbResponse = await fetch(detailApiUrl);
        const omdbData = await omdbResponse.json();

        // Kombinera data från CMDb och OMDb
        omdbData.CMDbScore = cmdbsMovie ? cmdbsMovie.cmdbScore : null;
        omdbData.voteCount = cmdbsMovie ? cmdbsMovie.count : null;
        omdbData.reviews = cmdbsMovie ? cmdbsMovie.reviews : [];
        omdbData.categorizedScores = cmdbsMovie ? cmdbsMovie.categorizedScores : [];

        // Visa detaljerad information om filmen
        displayMovieDetails(omdbData);
    } catch (error) {
        console.error("Det uppstod ett fel:", error);
    }
}

/**
 * Skapar och visar detaljerad information om en specifik film på webbsidan.
 * @param {Object} movie - Objekt innehållande information om filmen som ska visas.
 */
function displayMovieDetails(movie) {
    const movieDetailsDiv = document.getElementById('movie-details');
    const reviewsDiv = document.getElementById('reviews');
    const scoreDiv = document.getElementById('score');

    // Skapa HTML-innehåll för filmens detaljer
    const movieDetailsHTML = `
        <h1>${movie.Title}</h1>
        <p><strong>År:</strong> ${movie.Year}</p>
        <p><strong>Speltid:</strong> ${movie.Runtime}</p>
        <p><strong>Regissör:</strong> ${movie.Director}</p>
        <p><strong>Skådespelare:</strong> ${movie.Actors}</p>
        <p><strong>Sammanfattning:</strong> ${movie.Plot}</p>
        <img src="${movie.Poster}" alt="${movie.Title} Poster"/>
    `;

    // Skapa och lägg till recensioner om de finns
    let reviewsHTML = movie.reviews && movie.reviews.length > 0
        ? `<h2>Recensioner:</h2><ul>${movie.reviews.map(review => `
            <li class="review-item">
                ${review.reviewer ? `<strong>Recensent:</strong> ${review.reviewer}<br>` : ''}
                <strong>Betyg:</strong> ${review.score}<br>
                ${review.review ? `<strong>Recension:</strong> ${review.review}<br>` : ''}
                <strong>Datum:</strong> ${review.date}
            </li>`).join('')}</ul>`
        : `<h2>Det finns inga recensioner för denna film.</h2>`;

    // Skapa och lägg till betyg om det finns
    let scoreHTML = movie.CMDbScore && movie.voteCount
        ? `
        <h2>CMDb Betyg: ${movie.CMDbScore}</h2>
        <p>Baserat på ${movie.voteCount} röster</p>
        <h3>Fördelning av rösterna:</h3>
        <ul>${movie.categorizedScores.map(score => `
            <li>
                Betyg: ${score.score}
                Antal: ${score.count}
            </li>`).join('')}</ul>`
        : `<h2>Det finns inga betyg för denna film.</h2>`;

    // Sätt ihop och visa all information på sidan
    movieDetailsDiv.innerHTML = movieDetailsHTML;
    reviewsDiv.innerHTML = reviewsHTML;
    scoreDiv.innerHTML = scoreHTML;
}


/**
 * Hämtar och visar CMDb-betyg för en specifik film.
 * @param {string} imdbID - IMDb-identifikatorn för filmen vars CMDb-betyg ska hämtas.
 * @returns {Promise<Object>} Ett objekt med CMDb-betyg och antal röster eller null-värden vid fel.
 */
async function fetchCMDbScoreForMovie(imdbID) {
    try {
        const response = await fetch('https://grupp6.dsvkurs.miun.se/api/toplists?sort=DESC', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer Hejsan123`
            }
        });
        const data = await response.json();
        const movie = data.movies.find(m => m.imdbID === imdbID);
        return movie ? {
            cmdbScore: movie.cmdbScore,
            count: movie.count
        } : {
            cmdbScore: null,
            count: null
        };
    } catch (error) {
        console.error("Det uppstod ett fel när CMDb-betyg och antal röster hämtades:", error);
        return {
            cmdbScore: null,
            count: null
        };
    }
}

/**
 * Initierar eventlyssnare när dokumentet har laddats.
 */
document.addEventListener('DOMContentLoaded', function () {
    // Lägg till eventlyssnare för att hantera recensionsinlämning
    document.getElementById("submitReview").addEventListener('click', submitReview);

    // Hantera klick på betygsknappar
    const ratingButtons = document.querySelectorAll('.rank-btn');
    ratingButtons.forEach(button => {
        button.addEventListener('click', function () {
            ratingButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

/**
 * Skickar en recension till servern.
 */
function submitReview() {
    const imdbID = getImdbIDFromUrl();
    const reviewer = document.getElementById("reviewerName").value;
    const score = document.querySelector('.rank-btn.active') ? document.querySelector('.rank-btn.active').value : null;
    const review = document.getElementById("reviewText").value;
    const date = new Date().toISOString().split('T')[0];
    const submitBtn = document.getElementById("submitReview");

    // Kontrollera att alla fält är ifyllda innan inlämning
    if (score && reviewer && review) {
        postReview(imdbID, reviewer, score, review, date);
    } else {
        alert('Vänligen fyll i alla fält och välj ett betyg.');
        submitBtn.disabled = false; // Gör knappen klickbar igen om något av fälten är tomma
    }
}

/**
 * Skickar en recension till servern via POST-anrop.
 * @param {string} imdbID - IMDb-identifikatorn för filmen som recensionen gäller.
 * @param {string} reviewer - Namnet på recensenten.
 * @param {number} score - Betyget som recensenten har gett.
 * @param {string} review - Recensionstexten.
 * @param {string} date - Datumet då recensionen skrevs.
 */
async function postReview(imdbID, reviewer, score, review, date) {
    const apiUrl = "https://grupp6.dsvkurs.miun.se/api/movies/review";
    const submitBtn = document.getElementById("submitReview");

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                imdbID: imdbID,
                reviewer: reviewer,
                score: parseInt(score),
                review: review,
                date: date
            })
        });

        const data = await response.json();
        console.log("API Response:", data);

        // Hantera svaret från servern
        if (data.imdbID) {
            alert("Din recension har sparats!");
            submitBtn.disabled = true; // Gör knappen oklickbar när recensionen skickas framgångsrikt
        } else {
            alert("Ett fel inträffade. Kontrollera din inmatning.");
            submitBtn.disabled = false; // Om svaret från API:et inte är vad vi förväntar oss, gör knappen klickbar igen
        }
    } catch (error) {
        console.error("Det uppstod ett fel:", error);
        alert("Ett fel inträffade. Försök igen senare.");
        submitBtn.disabled = false; // Om ett nätverksfel eller något annat fel inträffar, gör knappen klickbar igen
    }
}




// När dokumentet har laddats klart, kör följande funktioner.
document.addEventListener("DOMContentLoaded", function () {
    // API-nyckel för autentisering mot API:t.
    const apiKey = "Hejsan123";
    // Referens till elementet där filmerna ska listas.
    const movieList = document.getElementById("movie-list");

    // Funktion för att hämta detaljer om en film från OMDb API med hjälp av IMDb ID.
    async function fetchMovieDetailsWithImdbID(imdbID) {
        return fetch(`https://www.omdbapi.com/?apikey=3378e53f&i=${imdbID}`)
            .then(response => response.json())
            .catch(error => console.error("Det uppstod ett fel:", error));
    }

    // Funktion för att hämta och visa topplistan av filmer.
    async function fetchTopList() {
        try {
            // Hämtar topplistan från CMDb API.
            const response = await fetch('https://grupp6.dsvkurs.miun.se/api/toplists?sort=DESC', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });
            const data = await response.json();

            // Tar de tio bästa filmerna och sorterar dem efter CMDb-poäng.
            const movies = data.movies.slice(0, 10).sort((a, b) => b.cmdbScore - a.cmdbScore);

            // Skapar och lägger till film-element i DOM för varje film i topplistan.
            for (let movie of movies) {
                const omdbDetails = await fetchMovieDetailsWithImdbID(movie.imdbID);
                const movieItem = document.createElement('div');
                movieItem.className = 'flex-item vertical';
                movieItem.innerHTML = `
                    <h2>${omdbDetails.Title}</h2>
                    <img src="${omdbDetails.Poster}" alt="${omdbDetails.Title}" />
                    <p><strong>Utgivningsår:</strong> ${omdbDetails.Year}</p>
                    <p><strong>Speltid:</strong> ${omdbDetails.Runtime}</p>
                    <p><strong>Sammanfattning:</strong> ${omdbDetails.Plot}</p>
                    <p><strong>CMDB Score:</strong> ${movie.cmdbScore}</p>
                    <p><strong>Review Count:</strong> ${movie.count}</p>
                    <a href="details.html?imdbID=${movie.imdbID}" class="knapp-lank" id="details-link">Detaljer</a>
                `;
                movieList.appendChild(movieItem);
            }
        } catch (error) {
            console.error('Något gick fel:', error);
        }
    }

    // Kör funktionen för att hämta och visa topplistan.
    fetchTopList();
});

let selectedScore = null;

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.rank-btn-alone').forEach(button => {
        button.addEventListener('click', () => {
            selectedScore = button.value;
        });
    });

    document.getElementById('submitReviewAlone').addEventListener('click', () => {
        const imdbID = getImdbIDFromUrl();
        if (imdbID && selectedScore) {
            rateMovie(imdbID, selectedScore);
        } else {
            alert('Ett fel inträffa, testa igen"');
        }
    });
});

document.querySelectorAll('.rank-btn-alone').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.rank-btn-alone').forEach(b => b.classList.remove('active'));

        button.classList.add('active');

        selectedScore = button.value;
    });
});


function getImdbIDFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('imdbID');
}

async function rateMovie(imdbID, score) {
    const apiUrl = "https://grupp6.dsvkurs.miun.se/api/movies/rate/" + imdbID + "/" + score;
    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'text/plain',
            }
        });
        const data = await response.json();
        console.log("API Response:", data);
        if (data.imdbID) {
            alert("Ditt betyg har sparats!");
            document.getElementById('submitReviewAlone').disabled = true;
        } else {
            alert("Ett fel inträffa, testa igen");
        }
    } catch (error) {
        console.error("Det uppstod ett fel:", error);
        alert("Ett fel inträffa, testa igen");
    }
}


window.addEventListener('DOMContentLoaded', () => {
    const imdbID = getImdbIDFromUrl();
    if (imdbID) {
        fetchMovieDetailsDisplay(imdbID);
    }
});


var searchTerm = getSearchTermFromUrl();
if (searchTerm) {
    fetchMovies(searchTerm);
}
