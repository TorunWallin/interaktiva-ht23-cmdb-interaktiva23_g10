// Lägg till en händelselyssnare som körs när hela DOM:en är inläst
document.addEventListener("DOMContentLoaded", () => {
  // Hämta sökfältet, sökknappen och elementet för att visa sökresultaten
  const searchBox = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchbutton");
  const searchList = document.getElementById('search-list');
 
  // Funktioner för att använda sökfältet
  // Sök med sökknappen
  searchBtn.addEventListener("click", () => {
      performASearch();
  });

  // Sök med Enter-tangenten
  document.addEventListener("keyup", event => {
      if(event.key === "Enter" && document.activeElement === searchBox) {
          event.preventDefault(); // Förhindra standardbeteendet för Enter-tangenten
          performASearch(); // Utför sökningen
      }
  });

  // Funktion för att utföra en sökning
  function performASearch() {
      const searchTerm = searchBox.value; // Hämta söktermen från sökfältet
      if(searchTerm) {
          // Om det finns en sökterm, omdirigera användaren till söksidan med söktermen som en URL-parameter
          window.location.href = `search.html?search=${encodeURIComponent(searchTerm)}`;
      }
  }

  // Funktioner för att hämta filmer från API
     // Definiera API-nyckeln direkt istället för att hämta den
let key = '3378e53f';

// Funktion för att utföra en sökning
function performASearch(searchTerm) {
  if (searchTerm) {
      window.location.href = `search.html?search=${encodeURIComponent(searchTerm)}`;
  }
}

// Funktion för att hämta toplistor med API-nyckeln
async function fetchToplists(currentPage) {
  const url = `https://grupp6.dsvkurs.miun.se/api/toplists?sort=DESC&limit=10&page=${currentPage}&countLimit=2&apikey=${key}`;

  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data; // Returnera datan för vidare bearbetning
  } catch (error) {
      console.error('Fel vid hämtning av toplistor:', error);
  }
}

// Funktion för att ladda filmer från OMDB API med söktermen
async function loadMovies(searchTerm) {
  const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=${key}`;
  try {
      const res = await fetch(URL);
      const data = await res.json();
      if (data.Response == "True") {
          displayMovieList(data.Search);
      }
  } catch (error) {
      console.error('Fel vid hämtning av filmer:', error);
  }
}

// Funktion för att visa filmer i söklistan
function displayMovieList(movies) {
  const searchList = document.getElementById('search-list');
  searchList.innerHTML = ""; // Rensa tidigare sökresultat

  movies.forEach(movie => {
      let movieListItem = document.createElement('div');
      movieListItem.dataset.imdbId = movie.imdbID; // Sätt imdbID som data-attribut
      movieListItem.classList.add('search-list-item');
      movieListItem.innerHTML = `
          <div class="search-item-thumbnail">
              <img src="${movie.Poster}">
          </div>
          <div class="search-item-info">
              <h3>${movie.Title}</h3>
              <p>${movie.Year}</p>
          </div>
      `;
      searchList.appendChild(movieListItem);

      // Lägg till klickhändelse för att gå till detaljsidan
      movieListItem.addEventListener('click', () => {
          window.location.href = `details.html?imdbID=${movie.imdbID}`;
      });
  });
}

// Huvudfunktion som körs när DOM-innehållet har laddats
document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.getElementById("search-input");
  const searchForm = document.getElementById("search-form");

  // Lägg till händelselyssnare för formulärets inlämning
  searchForm.addEventListener("submit", event => {
      event.preventDefault();
      performASearch(searchBox.value);
  });

  // Funktion för autofyllning av sökfältet
  function findMovies() {
      let searchTerm = searchBox.value.trim();
      if (searchTerm.length > 0) {
          loadMovies(searchTerm);
      }
  }

  // Lägg till händelselyssnare för sökfältet
  searchBox.addEventListener("click", findMovies);
  document.addEventListener("keyup", event => {
      if (event.target === searchBox) {
          findMovies();
      }
  });
});

      //Funktion för att visa filmer i sök
      function displayMovieList(movies) {
          searchList.innerHTML = " ";
          for (let idx = 0; idx < movies.length; idx++) {
              let movieListItem = document.createElement('div');
              
              if (movies[idx].imdbID) {
                  movieListItem.dataset.imdbId = movies[idx].imdbID;
              }
              
              movieListItem.classList.add('search-list-item');
             
              movieListItem.innerHTML = `
                  <div class="search-item-thumbnail">
                      <img src="${movies[idx].Poster}">
                  </div>
                  <div class="search-item-info">
                      <h3>${movies[idx].Title}</h3>
                      <p>${movies[idx].Year}</p>
                  </div>
              `;
              searchList.appendChild(movieListItem);
              
              
              movieListItem.addEventListener('click', async () => {
                  const imdbID = movies[idx].imdbID 
                  window.location.href = `details.html?imdbID=${imdbID}`;
              });
          }
      }
  });

  document.addEventListener("DOMContentLoaded", async() => {
      let key;
      let currentPage = 1;
      let totalNumberOfPages = 10;
      
      const movieList = document.getElementById("movieList");
      
      //#region Get movies from api
      //#region Hämta filmer från API
// Funktion för att hämta API-nyckeln från CMDB
async function fetchApiKeyCmdb() {
  try {
      // Ersätt URL med din faktiska API-nyckel URL
      const response = await fetch("https://grupp6.dsvkurs.miun.se/api/keys/grupp30_ombd/9142d8ed-2ab1-4e41-8c47-d63382ee39d8");
      const data = await response.json();
      
      // Spara API-nyckeln i en variabel
      key = data.apiKey;
  } catch (error) {
      console.error("Fel vid hämtning av data:", error);
  }
}

// Anropa funktionen för att hämta API-nyckeln och logga den
fetchApiKeyCmdb().then(function() { console.log(key); });

// Funktion för att hämta filmer från CMDB-API
async function fetchDataFromCMDb(currentPage) {
  try {
      // Använd din API-nyckel i förfrågan
      const response = await fetch(`https://grupp6.dsvkurs.miun.se/api/toplists?sort=DESC&limit=10&page=${currentPage}&countLimit=2&apikey=3378e53f`);
      const CMDbdata = await response.json();

      // Returnera data från CMDB
      return CMDbdata;
  } catch (error) {
      console.error("Fel vid hämtning av data:", error);
  }
}

// Använd funktionen för att hämta data från CMDB
let CMDbdata = await fetchDataFromCMDb(currentPage);

// Funktion för att hämta all information om en film från OMDB-API
async function fetchMovieInfoFromOMDB(CMDbdata) {
  try {
      // Kontrollera om API-nyckeln är hämtad, annars hämta den
      if (!key) {
          await fetchApiKeyCmdb();
      }
      
      let omdbData = [];

      // Loopa igenom varje film och hämta information från OMDB
      for (const movie of CMDbdata.movies) {
          const id = movie.imdbID;
          console.log("ID: " + id);
          
          // Använd API-nyckeln i förfrågan
          const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=3378e53f`);
          const data = await response.json();

          // Om data finns, lägg till i arrayen
          if (data && data.Response === "True") {
              omdbData.push(data);
          } else {
              console.log(`Ingen OMDB-data hittades för IMDb ID ${id}`);
          }
      }

      // Returnera data från OMDB
      return omdbData;
  } catch (error) {
      console.error("Fel vid hämtning av OMDB-data:", error);
      return null;
  }
}

// Använd funktionen för att hämta filmdata från OMDB
let data = await fetchMovieInfoFromOMDB(CMDbdata);
showData(data, CMDbdata); // Se till att funktionen showData är definierad i din kod
//#endregion

//*Visa data i användargränssnittet

// Funktion för att visa data i användargränssnittet
async function showData(data, CMDbdata) {
  let movieNumber = 1;
  try {
      // Rensa tidigare innehåll
      movieList.innerHTML = " ";

      // Loopa igenom varje film och skapa en container för den
      for (const movie of data) {
          const movieContainer = createMovieContainer(movie, movieNumber, CMDbdata);
          movieList.appendChild(movieContainer);
          movieNumber++;
      }
  } catch (error) {
      console.error("Fel vid hämtning av data:", error);
  }
}

// Funktion för att skapa en container för en film
function createMovieContainer(movie, movieNumber, CMDbdata) {
  const movieContainer = document.createElement("div");
  movieContainer.classList.add("movieCon", `page-${currentPage}`);

  // Skapa och lägg till filmdiven i containern
  const movieDivEl = createMovieDiv(movie, movieNumber);
  movieContainer.appendChild(movieDivEl);

  return movieContainer;
}

// Funktion för att skapa en div för en film
function createMovieDiv(movie, movieNumber) {
  const movieDivEl = document.createElement("div");
  movieDivEl.classList.add("movie", `movie-${movieNumber}`);

  // Om en filmaffisch finns, skapa och lägg till den
  if (movie.Poster) {
      const posterImgEl = createPosterImage(movie);
      movieDivEl.appendChild(posterImgEl);
  }

  // Skapa och lägg till div för filminformation
  const movieInfoDivEl = createMovieInformationDiv(movie, movieNumber, CMDbdata);
  movieDivEl.appendChild(movieInfoDivEl);

  return movieDivEl;
}


        //Function to create poster
        function createPosterImage(movie) {
          const posterImgEl = document.createElement("img");
          posterImgEl.src = movie.Poster;
          posterImgEl.alt = movie.Title;
        
          posterImgEl.addEventListener("click", () => {
            const movieId = movie.imdbID;
            window.location.href = `details.html?imdbID=${movieId}`;
          });
        
          return posterImgEl;
        }
        
        //Function to create a contaioner for movie information
        function createMovieInformationDiv(movie, movieNumber, CMDbdata) {
          const movieInfoDivEl = document.createElement("div");
          movieInfoDivEl.classList.add("movieInformation");
        
          if (movie.Title) {
            const titleEl = createTitleElement(movie, movieNumber);
            movieInfoDivEl.appendChild(titleEl);
          }
        
          const cmdbscoreEl = createCMDBScoreLabel(movieNumber, CMDbdata);
          movieInfoDivEl.appendChild(cmdbscoreEl);
        
          const plotBox = createPlotBox(movie);
        
          movieInfoDivEl.appendChild(plotBox);
        
          const ratingElements = createRatingElements(movie);
        
          movieInfoDivEl.appendChild(ratingElements.rateOnToplistLabel);
          movieInfoDivEl.appendChild(ratingElements.rateOnToplist);
          
          return movieInfoDivEl;
        }
        
        //Film titel
        function createTitleElement(movie, movieNumber) {
          const titleEl = document.createElement("h2");
          titleEl.textContent = `${(movieNumber + (currentPage - 1) * 10)}. ${movie.Title}`;
          titleEl.classList.add("title");
        
          titleEl.addEventListener("click", () => {
            const movieId = movie.imdbID;
            window.location.href = `details.html?imdbID=${movieId}`;
          });
        
          return titleEl;
        }
       
      //CMDB score
        function createCMDBScoreLabel(movieNumber, CMDbdata) {
          console.log(CMDbdata);
          const cmdbscore = CMDbdata.movies[movieNumber-1].cmdbScore;
          const cmdbscoreEl = document.createElement("label");
          cmdbscoreEl.textContent = `CMDB Score: ${cmdbscore} / 4`;
          cmdbscoreEl.classList.add("cmdbscore");
        
          return cmdbscoreEl;
        }
      
        //Handling box
        function createPlotBox(movie) {
          const plotBox = document.createElement("div");
          const txtDescription = document.createElement("label");
          txtDescription.textContent = `Beskrivning:`;
          txtDescription.classList.add("txtDescription");
        
          const plotShort = createPlotShortParagraph(movie);
          const plotButton = createPlotButton(movie, plotShort);
        
          plotBox.appendChild(txtDescription);
          plotBox.appendChild(plotShort);
          plotBox.appendChild(plotButton);
        
          return plotBox;
        }
        
        //Kort handling
        function createPlotShortParagraph(movie) {
          const plotShort = document.createElement("p");
          plotShort.textContent = `${movie.Plot}`;
          plotShort.classList.add("movie-plot");
          plotShort.style.display = "block";
        
          return plotShort;
        }
        
        //Handling knapp
        function createPlotButton(movie, plotShort) {
          const plotButton = document.createElement("button");
          plotButton.textContent = "Visa mer";
          plotButton.classList.add("plotbutton");
          let isExpanded = false;
        
          plotButton.addEventListener("click", async () => {
            if (!isExpanded) {
              const plotLongResponse = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${key}&plot=full`);
              const plotLongData = await plotLongResponse.json();
        
              if (plotLongData.Plot) {
                plotShort.textContent = `${movie.Plot} ${plotLongData.Plot}`;
                isExpanded = true;
                plotButton.textContent = "Visa Mindre";
              }
            } else {
              plotShort.textContent = `${movie.Plot}`;
              isExpanded = false;
              plotButton.textContent = "Visa mer";
            }
          });
        
          return plotButton;
        }
      
     
      //Betygsätt 
        function createRatingElements(movie) {
          const rateOnToplistLabel = document.createElement("label");
          rateOnToplistLabel.classList.add("rateOnToplistLabel");
          rateOnToplistLabel.textContent = "Betygsätt: ";
          const ratingResponseMessage = document.createElement("p");
          ratingResponseMessage.classList.add("rateOnToplistp");
          ratingResponseMessage.textContent = "";
      
       
        
          const rateOnToplist = document.createElement("div");
          rateOnToplist.classList.add("rateOnToplist");
           
      
          for (let i = 1; i <= 4; i++) {
            const { rateOnToplistContainer, rateOnToplistInput, ratingIcon } = createRatingItem(i);
            rateOnToplist.appendChild(rateOnToplistContainer);
          }
        
          const rateButtonToplist = document.createElement("button");
          rateButtonToplist.classList.add("rateButtonToplist");
          rateButtonToplist.textContent = "Betygsätt";
        
          rateOnToplist.appendChild(rateButtonToplist);
         rateOnToplist. appendChild(ratingResponseMessage);
         
          rateButtonToplist.addEventListener("click", async () => {
            if (movie.imdbID) {
              event.preventDefault();
            
              const rating = document.querySelector('input[name="rating"]:checked');
              const selectedRating = rating ? rating.value : null;
      
              if (!selectedRating) {
                ratingResponseMessage.textContent = " Du måste välja ett betyg.";
                return;
              }
        
              fetch(`https://grupp6.dsvkurs.miun.se/api/movies/rate/${movie.imdbID}/${selectedRating}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                }
              })
                .then(response => response.json())
                .then(data => {
                  ratingResponseMessage.textContent = "Betyget har satts!";
                })
                .catch(error => {
                  ratingResponseMessage.textContent = "Det uppstod ett fel: " + error.message;
                });
            }  
            rateButtonToplist.disabled = true;
          });
        
          return { rateOnToplistLabel, rateOnToplist };
        }
      
      //Function to create rating item
        function createRatingItem(value) {
          const rateOnToplistContainer = document.createElement("div");
          rateOnToplistContainer.classList.add("rateOnToplistContainer");
        
          const rateOnToplistInput = document.createElement("input");
          rateOnToplistInput.classList.add("inputToplist");
          rateOnToplistInput.type = "radio";
          rateOnToplistInput.name = "rating";
          rateOnToplistInput.value = value;
          rateOnToplistInput.id = `rating${value}`;
        
          const ratingIcon = document.createElement("i");
          ratingIcon.classList.add('fa-regular', `fa-face-${getRatingIcon(value)}`);
        
          rateOnToplistContainer.appendChild(rateOnToplistInput);
          rateOnToplistContainer.appendChild(ratingIcon);
          
        
          return { rateOnToplistContainer, rateOnToplistInput, ratingIcon };
        }
        
      //Function to get rating icon
          //https://www.w3schools.com/js/js_switch.asp
        function getRatingIcon(value) {
          switch (value) {
            case 1:
              return "angry";
            case 2:
              return "frown";
            case 3:
              return "smile";
            case 4:
              return "grin-stars";
            default:
              return "angry";
          }
        }
        
      //#region Paging on toplist 
        const PreviousPageButton = document.getElementById("previousPage");
        const NextPageButton = document.getElementById("nextPage");
        const pageCounter = document.getElementById("pageCounter");
        pageCounter.textContent = `Sida ${currentPage} av ${totalNumberOfPages}`;
      
        PreviousPageButton.disabled = true; 
        
        //Eventlisteners for paging
        PreviousPageButton.addEventListener("click", () =>{
          if (currentPage > 1) {
            currentPage--;
            updatePage();
            updateButtons();
          }
      
        });
      
        NextPageButton.addEventListener("click", () =>{
          if (currentPage < totalNumberOfPages) {
            currentPage++;
            updatePage();
            updateButtons();
          }
      
        });
        
        //Functions for update buttons
        function updateButtons() {
          if (currentPage === 1) {
            PreviousPageButton.disabled = true; 
          } else {
            PreviousPageButton.disabled = false; 
          }
        
          if (currentPage === totalNumberOfPages) {
            NextPageButton.disabled = true; 
          } else {
            NextPageButton.disabled = false; 
          }
        }
      
      //Function to update toplist by current page
        async function updatePage() {
         
          CMDbdata = await fetchDataFromCMDb(currentPage);
          data = await fetchMovieInfoFromOMDB(CMDbdata);
          showData(data, CMDbdata);
          pageCounter.textContent = `Sida ${currentPage} av ${totalNumberOfPages}`;
      }
        
        }); 
  
        document.addEventListener("DOMContentLoaded", async () => {
          let currentPage = 1;
          let totalNumberOfPages = 10;
          
          const movieList = document.getElementById("movieList");
          
          document.addEventListener("DOMContentLoaded", async () => {
              let currentPage = 1;
              let totalNumberOfPages = 10;
              
              const movieList = document.getElementById("movieList");
              
              let key = '3378e53f';
              
              // Funktion för att hämta filmer från CMDB API
              async function fetchDataFromCMDb(currentPage) {
                try {
                  const response = await fetch(`https://grupp6.dsvkurs.miun.se/api/toplists?sort=DESC&limit=10&page=${currentPage}&countLimit=2`);
                  const CMDbdata = await response.json();
              
                  return CMDbdata;
                } catch (error) {
                  console.error("Fel vid hämtning av data:", error);
                }
              }
              
              let CMDbdata = await fetchDataFromCMDb(currentPage);
              
              // Funktion för att hämta all information om en film från OMDB API
              async function fetchMovieInfoFromOMDB(CMDbdata) {
                try {
                  let omdbData = [];
              
                  for (const movie of CMDbdata.movies) {
                    const id = movie.imdbID;
                    console.log("ID: " + id);
                    
                    const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${key}`);
                    const data = await response.json();
              
                    if (data && data.Response === "True") {
                      omdbData.push(data);
                    } else {
                      console.log(`Ingen OMDB data hittades för IMDb ID ${id}`);
                    }
                  }
              
                  return omdbData;
                } catch (error) {
                  console.error("Fel vid hämtning av OMDB data:", error);
                  return null;
                }
              }
              
              let data = await fetchMovieInfoFromOMDB(CMDbdata);
              // Antag att funktionen showData är definierad någonstans i din kod
              showData(data, CMDbdata);
              
          });

          async function fetchMovieInfoFromOMDB(CMDbdata) {
              try {
                  if (!key) {
                      await fetchApiKeyCmdb();
                  }
                  
                  let omdbData = [];
          
                  for (const movie of CMDbdata.movies) {
                      const id = movie.imdbID;
                      console.log("ID: " + id);
                     
                      const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${key}`);
                      const data = await response.json();
          
                      if (data && data.Response === "True") {
                          omdbData.push(data);
                      } else {
                          console.log(`No OMDB data found for IMDb ID ${id}`);
                      }
                  }
          
                  return omdbData;
              } 
              catch (error) {
                  console.error("Error fetching OMDB data:", error);
                  return null;
              }
          }
          
          let data = await fetchMovieInfoFromOMDB(CMDbdata);
          showData(data, CMDbdata);
          
         
          
          //Visa data i UI
          async function showData(data, CMDbdata) {
            let movieNumber = 1;
            try {
                movieList.innerHTML = " ";
               
          
                for (const movie of data) {
                  const movieContainer = createMovieContainer(movie, movieNumber, CMDbdata);
                  movieList.appendChild(movieContainer);
            
                  movieNumber++;
          
                 
                }
              } catch (error) {
                console.error("Error fetching data:", error);
              }
            }
            
            //Film container
            function createMovieContainer(movie, movieNumber, CMDbdata) {
              const movieContainer = document.createElement("div");
              movieContainer.classList.add("movieCon", `page-${currentPage}`);
            
              const movieDivEl = createMovieDiv(movie, movieNumber);
              movieContainer.appendChild(movieDivEl);
            
              return movieContainer;
            }
            
            //Film DIV
            function createMovieDiv(movie, movieNumber) {
              const movieDivEl = document.createElement("div");
              movieDivEl.classList.add("movie", `movie-${movieNumber}`);
            
              if (movie.Poster) {
                const posterImgEl = createPosterImage(movie);
                movieDivEl.appendChild(posterImgEl);
              }
            
              const movieInfoDivEl = createMovieInformationDiv(movie, movieNumber, CMDbdata);
              movieDivEl.appendChild(movieInfoDivEl);
            
              return movieDivEl;
            }
            
            //Affish 
            function createPosterImage(movie) {
              const posterImgEl = document.createElement("img");
              posterImgEl.src = movie.Poster;
              posterImgEl.alt = movie.Title;
            
              posterImgEl.addEventListener("click", () => {
                const movieId = movie.imdbID;
                window.location.href = `details.html?imdbID=${movieId}`;
              });
            
              return posterImgEl;
            }
            
            //Film information
            function createMovieInformationDiv(movie, movieNumber, CMDbdata) {
              const movieInfoDivEl = document.createElement("div");
              movieInfoDivEl.classList.add("movieInformation");
            
              if (movie.Title) {
                const titleEl = createTitleElement(movie, movieNumber);
                movieInfoDivEl.appendChild(titleEl);
              }
            
              const cmdbscoreEl = createCMDBScoreLabel(movieNumber, CMDbdata);
              movieInfoDivEl.appendChild(cmdbscoreEl);
            
              const plotBox = createPlotBox(movie);
            
              movieInfoDivEl.appendChild(plotBox);
            
              const ratingElements = createRatingElements(movie);
            
              movieInfoDivEl.appendChild(ratingElements.rateOnToplistLabel);
              movieInfoDivEl.appendChild(ratingElements.rateOnToplist);
              
              return movieInfoDivEl;
            }
            
            //Film titel
            function createTitleElement(movie, movieNumber) {
              const titleEl = document.createElement("h2");
              titleEl.textContent = `${(movieNumber + (currentPage - 1) * 10)}. ${movie.Title}`;
              titleEl.classList.add("title");
            
              titleEl.addEventListener("click", () => {
                const movieId = movie.imdbID;
                window.location.href = `details.html?imdbID=${movieId}`;
              });
            
              return titleEl;
            }
           
          //Skapa CMBD score
            function createCMDBScoreLabel(movieNumber, CMDbdata) {
              console.log(CMDbdata);
              const cmdbscore = CMDbdata.movies[movieNumber-1].cmdbScore;
              const cmdbscoreEl = document.createElement("label");
              cmdbscoreEl.textContent = `CMDB Score: ${cmdbscore} / 4`;
              cmdbscoreEl.classList.add("cmdbscore");
            
              return cmdbscoreEl;
            }
          
            //Handling box
            function createPlotBox(movie) {
              const plotBox = document.createElement("div");
              const txtDescription = document.createElement("label");
              txtDescription.textContent = `Beskrivning:`;
              txtDescription.classList.add("txtDescription");
            
              const plotShort = createPlotShortParagraph(movie);
              const plotButton = createPlotButton(movie, plotShort);
            
              plotBox.appendChild(txtDescription);
              plotBox.appendChild(plotShort);
              plotBox.appendChild(plotButton);
            
              return plotBox;
            }
            
            //Kort handling
            function createPlotShortParagraph(movie) {
              const plotShort = document.createElement("p");
              plotShort.textContent = `${movie.Plot}`;
              plotShort.classList.add("movie-plot");
              plotShort.style.display = "block";
            
              return plotShort;
            }
            
            //Handling knapp
            function createPlotButton(movie, plotShort) {
              const plotButton = document.createElement("button");
              plotButton.textContent = "Visa mer";
              plotButton.classList.add("plotbutton");
              let isExpanded = false;
            
              plotButton.addEventListener("click", async () => {
                if (!isExpanded) {
                  const plotLongResponse = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${key}&plot=full`);
                  const plotLongData = await plotLongResponse.json();
            
                  if (plotLongData.Plot) {
                    plotShort.textContent = `${movie.Plot} ${plotLongData.Plot}`;
                    isExpanded = true;
                    plotButton.textContent = "Visa Mindre";
                  }
                } else {
                  plotShort.textContent = `${movie.Plot}`;
                  isExpanded = false;
                  plotButton.textContent = "Visa mer";
                }
              });
            
              return plotButton;
            }
          
          //#region Rate on toplist  
          //Function to create rating elements
            function createRatingElements(movie) {
              const rateOnToplistLabel = document.createElement("label");
              rateOnToplistLabel.classList.add("rateOnToplistLabel");
              rateOnToplistLabel.textContent = "Betygsätt filmen: ";
              const ratingResponseMessage = document.createElement("p");
              ratingResponseMessage.classList.add("rateOnToplistp");
              ratingResponseMessage.textContent = "";
          
           
            
              const rateOnToplist = document.createElement("div");
              rateOnToplist.classList.add("rateOnToplist");
               
          
              for (let i = 1; i <= 4; i++) {
                const { rateOnToplistContainer, rateOnToplistInput, ratingIcon } = createRatingItem(i);
                rateOnToplist.appendChild(rateOnToplistContainer);
              }
            
              const rateButtonToplist = document.createElement("button");
              rateButtonToplist.classList.add("rateButtonToplist");
              rateButtonToplist.textContent = "BetygsÃ¤tt";
            
              rateOnToplist.appendChild(rateButtonToplist);
             rateOnToplist. appendChild(ratingResponseMessage);
             
              rateButtonToplist.addEventListener("click", async () => {
                if (movie.imdbID) {
                  event.preventDefault();
                
                  const rating = document.querySelector('input[name="rating"]:checked');
                  const selectedRating = rating ? rating.value : null;
          
                  if (!selectedRating) {
                    ratingResponseMessage.textContent = "VÃ¤nligen vÃ¤lj ett betyg innan du sÃ¤tter rating.";
                    return;
                  }
            
                  fetch(`https://grupp6.dsvkurs.miun.se/api/movies/rate/${movie.imdbID}/${selectedRating}`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    }
                  })
                    .then(response => response.json())
                    .then(data => {
                      ratingResponseMessage.textContent = "Betyget har satts framgÃ¥ngsrikt!";
                    })
                    .catch(error => {
                      ratingResponseMessage.textContent = "Det uppstod ett fel vid sÃ¤ttning av betyg: " + error.message;
                    });
                }  
                rateButtonToplist.disabled = true;
              });
            
              return { rateOnToplistLabel, rateOnToplist };
            }
          
            function createRatingItem(value) {
              const rateOnToplistContainer = document.createElement("div");
              rateOnToplistContainer.classList.add("rateOnToplistContainer");
            
              const rateOnToplistInput = document.createElement("input");
              rateOnToplistInput.classList.add("inputToplist");
              rateOnToplistInput.type = "radio";
              rateOnToplistInput.name = "rating";
              rateOnToplistInput.value = value;
              rateOnToplistInput.id = `rating${value}`;
            
              const ratingIcon = document.createElement("i");
              ratingIcon.classList.add('fa-regular', `fa-face-${getRatingIcon(value)}`);
            
              rateOnToplistContainer.appendChild(rateOnToplistInput);
              rateOnToplistContainer.appendChild(ratingIcon);
              
            
              return { rateOnToplistContainer, rateOnToplistInput, ratingIcon };
            }
            
      
            function getRatingIcon(value) {
              switch (value) {
                case 1:
                  return "angry";
                case 2:
                  return "frown";
                case 3:
                  return "smile";
                case 4:
                  return "grin-stars";
                default:
                  return "angry";
              }
            }
            
            const PreviousPageButton = document.getElementById("previousPage");
            const NextPageButton = document.getElementById("nextPage");
            const pageCounter = document.getElementById("pageCounter");
            pageCounter.textContent = `Sida ${currentPage} av ${totalNumberOfPages}`;
          
            PreviousPageButton.disabled = true; 
            
            PreviousPageButton.addEventListener("click", () =>{
              if (currentPage > 1) {
                currentPage--;
                updatePage();
                updateButtons();
              }
          
            });
          
            NextPageButton.addEventListener("click", () =>{
              if (currentPage < totalNumberOfPages) {
                currentPage++;
                updatePage();
                updateButtons();
              }
          
            });
            
            function updateButtons() {
              if (currentPage === 1) {
                PreviousPageButton.disabled = true; 
              } else {
                PreviousPageButton.disabled = false; 
              }
            
              if (currentPage === totalNumberOfPages) {
                NextPageButton.disabled = true; 
              } else {
                NextPageButton.disabled = false; 
              }
            }
          
            async function updatePage() {
             
              CMDbdata = await fetchDataFromCMDb(currentPage);
              data = await fetchMovieInfoFromOMDB(CMDbdata);
              showData(data, CMDbdata);
              pageCounter.textContent = `Sida ${currentPage} av ${totalNumberOfPages}`;
          }
            
            }); 
      
      
      document.addEventListener("DOMContentLoaded", async() =>{
      
          const s_Results = document.getElementById("search_result");
          const urlParam = new URLSearchParams(window.location.search);
          const searchTerm = urlParam.get("search");
      
        let key;
      
        async function fetchApiKeyCmdb(){
          try{
              const response = await fetch("https://grupp6.dsvkurs.miun.se/api/keys/grupp30_ombd/9142d8ed-2ab1-4e41-8c47-d63382ee39d8");
              const data = await response.json();
              
               key = data.apiKey;
             
          } 
          catch (error) {
              console.error("Error fetching data:", error);
          }
        }
      
        fetchApiKeyCmdb().then(function(){console.log(key);});
      
        async function fetchSearchResult(searchTerm){
        try{
          if (!key) {
              await fetchApiKeyCmdb();
          }
          const apiUrl = `http://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&apikey=${key}`;	
      
          const response = await fetch (apiUrl);
          const searchResult = await response.json();
      
          for (const movie of searchResult.Search) {
            movie.Genre = await fetchMovieGenre(movie.imdbID);
          }
      
          return searchResult;
        }
        catch (error) {
          console.error("Error fetching data:", error);
        }
        }
      
        let searchResult = await fetchSearchResult(searchTerm);
        showResults(searchResult);
      
        async function fetchMovieGenre(imdbID) {
          const apiUrl = `https://www.omdbapi.com/?i=${imdbID}&apikey=${key}`;
        
          try {
            const response = await fetch(apiUrl);
            if (response.ok) {
              const data = await response.json();
              return data.Genre; 
            } else {
              return "OkÃ¤nd genre";
            }
          } catch (error) {
            console.error("Error fetching movie genre:", error);
            return "okänd genre";
          }
        }
      
      function createMovieContainer(movie) {
        const movieContainer = document.createElement("div");
        movieContainer.classList.add("movieSearchResult");
      
        const searchPoster = createSearchPoster(movie);
        const infoDiv = createInfoDiv(movie);
      
        movieContainer.appendChild(searchPoster);
        movieContainer.appendChild(infoDiv);
      
        movieContainer.addEventListener("click", () => {
          const movieId = movie.imdbID;
          window.location.href = `details.html?imdbID=${movieId}`;
        });
      
        return movieContainer;
      }
      
      function createSearchPoster(movie) {
        const searchPoster = document.createElement("div");
        searchPoster.classList.add("searchPoster");
        const poster = document.createElement("img");
        poster.src = movie.Poster;
        poster.alt = movie.Title;
        searchPoster.appendChild(poster);
        return searchPoster;
      }
      
      function createInfoDiv(movie) {
        const infoDiv = document.createElement("div");
        infoDiv.classList.add("info");
        const titleEl = document.createElement("h2");
        titleEl.textContent = movie.Title;
        infoDiv.appendChild(titleEl);
      
        if (movie.imdbID) {
          createAndAppendInfoElements(infoDiv, movie.imdbID);
        }
      
        return infoDiv;
      }
      
      function createAndAppendInfoElements(infoDiv, imdbID) {
        fetchMovieInfo(imdbID)
          .then((year) => {
            infoDiv.appendChild(year);
          })
          .catch((error) => {
            console.error("Error fetching movie info:", error);
          });
      
        fetchCmdbscore(imdbID)
          .then((cmdbscoreElSearch) => {
            infoDiv.appendChild(cmdbscoreElSearch);
          })
          .catch((error) => {
            console.error("Error fetching CMDB Score:", error);
          });
      }
      
      async function fetchMovieInfo(imdbID) {
        const apiUrl = `https://www.omdbapi.com/?i=${imdbID}&apikey=${key}&plot=full`;
      
        try {
          const response = await fetch(apiUrl);
          if (response.ok) {
            const data = await response.json();
            if (data) {
              const year = document.createElement("p");
              year.textContent = `${data.Year} || ${data.Runtime} || ${data.Genre} || Imdb rating: ${data.imdbRating}`;
              return year;
            } 
            else {
              throw new Error("Data is empty");
            }
          
          } else {
            throw new Error("Response is not ok");
          }
        } catch (error) {
          throw error;
        }
      }
      
      async function fetchCmdbscore(imdbID) {
        try {
          const response = await fetch(`https://grupp6.dsvkurs.miun.se/api/movies/${imdbID}`);
          if (response.ok) {
            const data = await response.json();
            if (data) {
              const cmdbscoreElSearch = document.createElement("label");
              cmdbscoreElSearch.textContent = `CMDB Score: ${data.cmdbScore}`;
              cmdbscoreElSearch.classList.add("cmdbscore");
              return cmdbscoreElSearch;
            } else {
              throw new Error("Data is empty");
            }
          } else {
            const cmdbscoreElSearch = document.createElement("label");
            cmdbscoreElSearch.textContent = "CMDB Score finns ej";
            cmdbscoreElSearch.classList.add("cmdbscore");
            return cmdbscoreElSearch;
          }
        } catch (error) {
          throw error;
        }
      }
      
      async function showResults(searchResult) {
        if (searchResult.Response === "True") {
          searchResult.Search.forEach(async (movie) => {
            const movieContainer = createMovieContainer(movie);
            s_Results.appendChild(movieContainer);
          });
        } else {
          s_Results.textContent = "No results found";
        }
      }
      
      function filterResults(selectedFilter) {
        const movieElements = document.querySelectorAll('.movieSearchResult');
        const filteredMovies = Array.from(movieElements);
      
        if (selectedFilter === 'Year') {
          filteredMovies.sort((a, b) => {
            const yearA = parseInt(a.querySelector('p').textContent.split('||')[0].trim());
            const yearB = parseInt(b.querySelector('p').textContent.split('||')[0].trim());
            return yearB - yearA;
          });
        }
        if (selectedFilter === 'Runtime') {
          filteredMovies.sort((a, b) => {
            const runtimeA = parseInt(a.querySelector('p').textContent.split('||')[1].trim());
            const runtimeB = parseInt(b.querySelector('p').textContent.split('||')[1].trim());
      
            return runtimeB - runtimeA;
          });
        }
        s_Results.innerHTML = '';
        filteredMovies.forEach(movie => {
          s_Results.appendChild(movie);
        });
      }
      
      const FilterSelect = document.getElementById('sort');
      FilterSelect.addEventListener('change', () => {
        const selectedFilter = FilterSelect.value;
        if (selectedFilter === 'Best') {
      
          s_Results.innerHTML = '';
          showResults(searchResult)
          
        } else {
          
          filterResults(selectedFilter);
        }
      });
      
      function filterResultsByGenre(searchResult, selectedGenre) {
        if (selectedGenre === "all") {
          return searchResult.Search;
        } else {
          return searchResult.Search.filter(movie => {
            // Filtrera filmer som har den valda genren
            return movie.Genre.includes(selectedGenre);
          });
        }
        
      }
      
      function updateView(filteredResults) {
        s_Results.innerHTML = '';
        filteredResults.forEach(movie => {
          const movieContainer = createMovieContainer(movie);
          s_Results.appendChild(movieContainer);
          FilterSelect.value = "Best";
        });
      }
      
      const categorySelect = document.getElementById("category");
      categorySelect.addEventListener("change", () => {
        const selectedGenre = categorySelect.value;
        const filteredResults = filterResultsByGenre(searchResult, selectedGenre);
        updateView(filteredResults);
      });
      });