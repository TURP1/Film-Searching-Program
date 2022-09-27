//config
const API_KEY = `3f7c2de3ba0c25a5eeda6588b31fa074`;
apiKey = `?api_key=${API_KEY}`;
let searchMovieUrl = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=`;
const imageSearch = `https://image.tmdb.org/t/p/w500/`;
const noImgSrc = `https://t4.ftcdn.net/jpg/05/17/53/57/240_F_517535712_q7f9QC9X6TQxWi6xYZZbMmw5cnLMr279.jpg`;
const posterSearch = `https://image.tmdb.org/t/p/w1280/`;
const baseMovieUrl = `https://api.themoviedb.org/3/`;
const startTopRatedList = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
let queryMovieOrTv;

//movie
function movie(data) {
    const mappingData = mapData(data)

    const html = `
        <a class="flex-grow-1 bd-highlight movie-link" href="${data.id}" data-tv-or-movie="${data.media_type}">
            <div
                class="d-flex align-items-center justify-content-center flex-column bd-highlight mb-3 card-descr">
                <img class="img-fluid mb-auto p-2 bd-highlight" src="${mappingData.backdrop_path}" alt=""
                    srcset=""></img>
                <h2 class="title bd-highlight text-center">${mappingData.title}</h2>
                <span class="p-2 bd-highlight">
                    <h5 class="release-data">${mappingData.date}</h5>
                    <h4 class="rating">Rating: ${mappingData.rating}</h4>
                </span>
            </div>
        </a>
    `
    return html
};

function mapData(data) {

    return {
        title: data.original_title || data.name || `Unknown`,
        backdrop_path: getPictureUrl(),
        rating: data.vote_average || `No Rating`,
        date: data.release_date || `Unknown`
    }
    function getPictureUrl() {
        const url = data.backdrop_path;
        if (url) {
            return imageSearch + url;
        }
        else {
            return noImgSrc
        };
    }
}

//MovieList
class MovieList {

    drawToDom(selector) {
        this.clearlist(selector);
        selector.appendChild(this.fragment);
    };

    renderMoviesFrontSide(data) {
        this.data = data;
        this.fragment = document.createDocumentFragment();

        this.data.results.forEach(data => {
            const div = document.createElement(`div`);
            div.classList.add(`movie`, `col-lg-4`, `col-md-6`, `col-sm-12`, `bd-highlight`);
            div.innerHTML = movie(data);
            this.fragment.appendChild(div);
        });
    };

    clearlist(selector) {
        selector.innerHTML = ``;
    }
}

//MovieCard
class MovieCard {

    drawToDom(selector) {
        this.clearlist(selector);
        selector.appendChild(this.fragment);
    };

    renderMoviesCard(data) {
        this.data = data;
        this.fragment = document.createDocumentFragment();

        const div = document.createElement(`div`);
        div.classList.add(`m-0`, `p-0`, `card`);
        div.innerHTML = movieDetails(data);
        this.fragment.appendChild(div);

    };

    clearlist(selector) {
        selector.innerHTML = ``;
    }
}

//movie_service
function getVideoByText(text) {
    if (!text) {
        return
    }
    return fetch(searchMovieUrl + text)
        .then(r => r.json())

}

function getVideoById(id) {

    const url = `${baseMovieUrl}${queryMovieOrTv}/${id}${apiKey}`;
    return fetch(url)
        .then(result => result.json())

}

//Movie Details onclick
function movieDetails(data) {
    const mappingDetailsData = mapDetailsData(data)

    const html = `
    <div class="container-fluid m-0 p-0 d-flex flex-column film-bg " style="background-image: url(${mappingDetailsData.backdrop_path});">
<div class="film-bg-opacity">
    <div class="row g-0 ">
        <div class="col-md-4 picture">
            <img class="img-fluid" src="${mappingDetailsData.poster_path}"
                alt="No image">
        </div>
        <div class="col-md-8 d-flex main-descr-section flex-column">

            <div class="header-descr d-flex">
                <div class="title">
                    <h1>${mappingDetailsData.title}</h1>
                </div>
                <div class="year">
                    <h1>(${mappingDetailsData.year})</h1>
                </div>
            </div>
            <div class="rating d-flex">
                <div class="rating-descr">
                    <h2>Rating</h2>
                </div>
                <div class="rating-icon">
                    <h2>${mappingDetailsData.rating}</h2>
                </div>
            </div>
            <div class="mini-descr d-flex">
                <div class="age">${mappingDetailsData.adult}</div>
                <div class="data-release">${mappingDetailsData.date}</div>
                <div class="original_language">(${mappingDetailsData.original_language})</div>
                <div class="genres">${mappingDetailsData.genres}</div>
                <div class="runtime"> * ${mappingDetailsData.runtime}</div> <!-- in minutes   -->
            </div>
            <div class="tagline">
                <i class="tag">
                    ${mappingDetailsData.tagline}
                </i>
            </div>
            <div class="descr-section">
                <h3>Description</h3>
                <span>
                    ${mappingDetailsData.overview}
                </span>
            </div>
        </div>
    </div>
    <div class="button-back text-center">
        <button type="button" class="btn btn-dark back">
            <h1>Back</h1>
        </button>
    </div>
</div>
<div class="footer flex-shrink-1">
    Search the Movie Service
</div>
</div>

    `
    return html
};

function mapDetailsData(data) {

    return {
        poster_path: getDetailsPosterUrl(),
        title: data.original_title || `Unknown`,
        backdrop_path: getDetailsPictureUrl(),
        rating: getRating() || `No Rating`,
        date: data.release_date || `Unknown`,
        year: getYear() || `Unknown`,
        adult: getAdult() || `12+`,
        original_language: data.original_language || `Unknown`,
        genres: getGenres() || `Unknown`,
        runtime: runTime() || `Unknown`,
        tagline: data.tagline || `No tagline`,
        overview: data.overview || `No overview`
    }

    function getDetailsPictureUrl() {
        const url = data.backdrop_path;
        if (url) {
            return posterSearch + url;
        }
        else {
            return noImgSrc
        };
    };

    function getDetailsPosterUrl() {
        const url = data.poster_path;
        if (url) {
            return posterSearch + url;
        }
        else {
            return noImgSrc
        };
    };

    function getYear() {
        const year = new Date(data.release_date);
        return year.getFullYear();
    };

    function getAdult() {
        const adult = data.adult;
        let age;
        if (!adult) {
            age = `12+`;
        }
        else {
            age = `18+`;
        };
        return age;
    };
    function getRating() {
        const rating = data.vote_average;
        return rating.toFixed(1);
    }

    function getGenres() {
        const genresArray = data.genres;
        let genreList = ` *`;
        genresArray.forEach(genre => {
            genreList += ` ${genre.name}`;
        });
        return genreList;
    };

    function runTime() {
        const runtime = data.runtime;
        const hours = (runtime / 60);
        const rhours = Math.floor(hours);
        const minutes = (hours - rhours) * 60;
        const rminutes = Math.round(minutes);
        return + rhours + "h" + rminutes + "m";
    };
}



//main
const input = document.querySelector(`.search`);
const outputDetails = document.querySelector(`.outputDetails`);
const body = document.querySelector(`body`);
const pageControl = document.querySelector(`.page-control`);
const header = document.querySelector(`.header`);
let backBtn = document.querySelector(`.button-back`);
const displayList = document.querySelector(`.displayList`);
const displayDetails = document.querySelector(`.displayDetails`)
const movieOutput = document.querySelector(`.output`);
const movieList = new MovieList();




input.addEventListener(`input`, e => {
    const searchText = e.target.value;
    if (!searchText) {
        toplistAtStart();
        return;
    }
    getVideoByText(searchText)
        .then(results => {
            movieList.renderMoviesFrontSide(results);
            movieList.drawToDom(movieOutput);
            cardDetails();
        });
});

//toplist at start
toplistAtStart();

function toplistAtStart() {
    fetch(startTopRatedList)
        .then(r => r.json())
        .then(results => {
            console.log(results);
            movieList.renderMoviesFrontSide(results);
            movieList.drawToDom(movieOutput);
            cardDetails();
        });
}



//card after fetch
function cardDetails() {
    let cards = document.querySelectorAll(`.movie`);
    cards.forEach(card => {
        card.addEventListener(`click`, function (e) {
            e.preventDefault();
            let movieLink = (e.target.closest(`.movie-link`));
            let filmOrTv = movieLink.getAttribute("data-tv-or-movie");
            if (filmOrTv === `undefined`) {
                filmOrTv = `movie`
            }
            const filmId = movieLink.getAttribute("href");
            queryMovieOrTv = filmOrTv;
            getVideoById(filmId)
                .then(result => {
                    const movieCard = new MovieCard();
                    movieCard.renderMoviesCard(result);
                    pageStyleOnDetails();
                    movieCard.drawToDom(outputDetails);
                    document.querySelector(`.back`).addEventListener(`click`,
                        () => pageStyleOnList());
                });
        });
    });
}


function pageStyleOnDetails() {
    header.style.backgroundColor = "black";
    header.style.color = "white";
    pageControl.style.display = "none";
    displayList.style.display = "none";
    displayDetails.style.display = "block";
};

function pageStyleOnList() {
    header.style.backgroundColor = "white";
    header.style.color = "black";
    pageControl.style.display = "block";
    displayList.style.display = "block";
    displayDetails.style.display = "none";
};


//Film sorting by selectors
let btnSort = document.querySelectorAll(`.btn-sort`);
btnSort.forEach(button => {
    button.addEventListener(`click`, () => {
        sortingBySelector(button.textContent);
    }
    );
});

function sortingBySelector(selectorForSort) {
    if (selectorForSort == `Show High Rated`) {
        let arrayToSort = { ...movieList.data };
        sortedMassive = sortingRating(arrayToSort);
        movieList.renderMoviesFrontSide(sortedMassive);
        movieList.drawToDom(movieOutput);
        cardDetails()
    };

    if (selectorForSort == `Show New`) {
        let arrayToSort = { ...movieList.data };
        sortedMassive = sortingNew(arrayToSort);
        movieList.renderMoviesFrontSide(sortedMassive);
        movieList.drawToDom(movieOutput);
        cardDetails()
    };

    if (selectorForSort == `Show Old`) {
        let arrayToSort = { ...movieList.data };
        sortedMassive = sortingOld(arrayToSort);
        movieList.renderMoviesFrontSide(sortedMassive);
        movieList.drawToDom(movieOutput);
        cardDetails()
    };

}

function sortingRating(arrayToSort) {
    arrayToSort.results.sort((a, b) => {
        if (a.vote_average === undefined) {
            a.vote_average = null;
        };
        if (b.vote_average === undefined) {
            b.vote_average = null;
        };

        if (a.vote_average < b.vote_average) {
            return 1
        };
        if (a.vote_average > b.vote_average) {
            return -1
        };

    })
    return arrayToSort;
}

function sortingNew(arrayToSort) {

    arrayToSort.results.sort((a, b) => {
        if (a.release_date === undefined) {
            a.release_date = null;
        };
        if (b.release_date === undefined) {
            b.release_date = null;
        };

        if (new Date(a.release_date) > new Date(b.release_date)) {
            return -1;
        };
        if (new Date(a.release_date) < new Date(b.release_date)) {
            return 1;
        };
    })
    return arrayToSort;
};

function sortingOld(arrayToSort) {

    arrayToSort.results.sort((a, b) => {

        if (a.release_date === undefined) {
            a.release_date = NaN;
        };
        if (b.release_date === undefined) {
            b.release_date = NaN;
        };
        if (new Date(a.release_date) < new Date(b.release_date)) {
            return -1;
        };
        if (new Date(a.release_date) > new Date(b.release_date)) {
            return 1;
        };
    })
    return arrayToSort;
};

