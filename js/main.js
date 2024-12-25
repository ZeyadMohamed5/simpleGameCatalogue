import { getGenre, addFilterBtn, getGamesbyGenre } from "./filtering.js";

const apiKey = "5684829455364f0d81e54d6a3bfa8288";
const row = document.getElementById("gamesRow");
const nextPg = document.getElementById("nextPage");
const prevPg = document.getElementById("prevPage");
const popUp = document.getElementById("gameInfoPage");
const filterId = document.getElementById("filterId");
const pages = document.getElementById("pagination");
const cache = {};
let page = 1;
let currentPage = 2;
let currentGenre = null;
const resetFilter = document.getElementById("filterBtn");

const url = (page) =>
  `https://rawg-video-games-database.p.rapidapi.com/games?key=${apiKey}&page=${page}`;
export const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "156e6c766fmsh7b2eeb313bfba78p1875cejsnfdc0b3f10a77",
    "x-rapidapi-host": "rawg-video-games-database.p.rapidapi.com",
  },
};

const home = document
  .getElementById("homePage")
  .addEventListener("click", () => {
    console.log("click");
    page = 1;
    currentPage = 2;
    currentGenre = null;
    pagination(currentPage);
    fetchGames();
  });

async function fetchGames() {
  try {
    if (cache[page]) {
      let games = cache[page];
      console.log("Using cached data for page:", page);

      if (currentGenre !== null) {
        games = getGamesbyGenre(games, currentGenre);
      }
      games.length === 0 ? renderEmptiness() : displayGames(games);
      return;
    }
    console.log("Fetching data for page:", page);

    const response = await fetch(url(page), options);
    const result = await response.json();
    cache[page] = result.results;
    let games = result.results;
    if (currentGenre !== null) {
      games = getGamesbyGenre(games, currentGenre);
    }
    games.length === 0 ? renderEmptiness() : displayGames(games);
  } catch (error) {
    console.error(error);
  }
}

async function displayGames(games) {
  let currentGames = games;
  const genres = await getGenre();
  filterId.innerHTML = addFilterBtn(genres);
  filterId.addEventListener("click", (e) => {
    const genreId = e.target.getAttribute("data-genre");
    if (genreId) {
      resetFilter.classList.remove("d-none");
      currentGenre = Number(genreId);
      currentGames = getGamesbyGenre(games, currentGenre);
      console.log(currentGenre);
      currentGames.length === 0
        ? renderEmptiness()
        : renderingGames(currentGames);
    }
  });
  if (currentGenre !== null) {
    currentGames = getGamesbyGenre(games, currentGenre);
  }
  resetFilter.addEventListener("click", (e) => {
    currentGenre = null;
    resetFilter.classList.add("d-none");

    fetchGames();
  });

  renderingGames(currentGames);
}

function renderingGames(games) {
  let blankBox = "";
  games.forEach((game, index) => {
    blankBox += `
                <div class="col-md-3">
              <div class="card" data-index="${index}">
              <img src="${
                game.background_image
              }" class="card-img-top fixed-image" alt="" />
              <div class="card-body p-2">
              <div class = "d-flex align-items-center justify-content-between">
               <h5 class="card-title  m-0">
                  ${game.name}
                </h5>
                ${checkRate(game.rating)}
                 </div>
              </div>
              <div class="card-footer d-flex align-items-center justify-content-between p-2">
                 <small>${game.released}</small>
                 <div class="platformIcons">${checkPlatform(
                   game.parent_platforms
                 )}</div>
                 </div>
            </div>
          </div>  `;
  });
  row.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    popUp.style.display = "block";
    const index = card.getAttribute("data-index");
    popUpContent(games[index]);
  });
  row.innerHTML = blankBox;
}

popUp.addEventListener("click", (e) => {
  const exit = e.target.closest("#exitBtn");
  if (exit) {
    popUp.style.display = "none";
  }
});

function checkRate(rate) {
  if (rate < 3.5) {
    return (rate = `<span class="badge text-bg-danger ">${rate}</span>`);
  } else {
    return (rate = `<span class="badge text-bg-warning ">${rate}</span>`);
  }
}

function checkPlatform(gamePlatform) {
  let platformIcon = "";
  gamePlatform.forEach((platformObj) => {
    let platformName = platformObj.platform.name;
    switch (platformName) {
      case "PlayStation":
        platformIcon += `<i class="fa-brands fa-playstation"></i>`;
        break;
      case "PC":
        platformIcon += `<i class="fa-solid fa-desktop"></i>`;
        break;
      case "Xbox":
        platformIcon += `<i class="fa-brands fa-xbox"></i>`;
        break;
    }
  });
  return platformIcon;
}

function checkImgs(game) {
  let dynamicImg = "";
  let gamePlayImgs = game.short_screenshots;
  for (let i = 1; i < 5; i++) {
    let gameImg = gamePlayImgs[i].image;
    dynamicImg += `<div class="col">
                  <div class="img-drawer-border">
                    <img src="${gameImg}" class="w-100 fixed-image-small" alt="" />
                  </div>
                </div>`;
  }
  return dynamicImg;
}

function checkTags(game) {
  let tagString = "";
  let gameTag = game.tags;
  gameTag.forEach((tag) => {
    tagString = gameTag.map((tag) => `<span> ${tag.name} </span>`).join(", ");
  });
  return tagString;
}

function checkGenre(game) {
  let genreString = "";
  let gameGenres = game.genres;
  gameGenres.forEach((genre) => {
    genreString = gameGenres
      .map((genre) => `<span>${genre.name}</span>`)
      .join(", ");
  });

  return genreString;
}

function checkStores(game) {
  let storeString = "";
  let gameStore = game.stores;
  gameStore.forEach((store) => {
    let storeName = store.store.name;
    storeString += `<li class="fs-5">${storeName}</li>`;
  });

  return storeString;
}

function popUpContent(selectedGame) {
  let PopBlankBox = "";
  PopBlankBox += `
  <div class="container">
<div class="row mt-5 ">

<a id="exitBtn" class = "d-flex justify-content-end"><i class="fa-solid fa-x"></i></a>
<div class="col-md-7">
<img src="${
    selectedGame.background_image
  }" class="w-100 fixed-image-large" alt="" />
<div class="img-drawer">
  <div class="row gx-2 pt-2">
    ${checkImgs(selectedGame)}
  </div>
</div>
</div>
<div class="col-md-5">
<h2 class="text-center text-white text-opacity-75 pt-4">
    ${selectedGame.name}
    </h2>
<div class="gameTags text-white-50 text-center pt-4">
  ${checkTags(selectedGame)}
</div>
<div
  class="text-start d-flex justify-content-between align-items-center pt-4"
>
  <div class="text-secondary text-uppercase fw-medium fs-4">
    Genre : ${checkGenre(selectedGame)}
  </div>
  <div class="platformIcons">
  ${checkPlatform(selectedGame.parent_platforms)}
  </div>
</div>
<div
  class="text-start pt-3 text-uppercase fw-medium fs-5 d-flex align-items-center gap-2 text-white-50"
>
  Rating ${checkRate(selectedGame.rating)}
</div>
<div class = "pt-2">
  <span class = "text-white-50 text-uppercase">
  Available on :
  </span>
  <ul class="storeList list-unstyled text-start  mb-1">
  ${checkStores(selectedGame)}
  </ul>
</div>
<small>${selectedGame.released}</small>
</div>
</div>
</div>`;
  popUp.addEventListener("click", (e) => {
    if (e.target.matches(".fixed-image-small")) {
      const smallImage = e.target;
      const largeImage = popUp.querySelector(".fixed-image-large");

      if (largeImage) {
        largeImage.src = smallImage.src;
      }
    }
  });
  popUp.innerHTML = PopBlankBox;
}

function renderEmptiness() {
  row.innerHTML = `<div class = "col text-center fs-5 fw-bold main-clr text-uppercase"> 
       No games to show in this page
  </div>`;
}

fetchGames();

function pagination(current) {
  current;
  let paginationCount = "";
  for (let i = 1; i < current; i++) {
    let y = i + 2;
    if (current > i && current < y) {
      paginationCount += `
      <li>
              <a class="page-link" id="prevPage"
                ><i class="fa-solid fa-caret-left"></i>
              </a>
            </li>
      <li><a class="text-decoration-none main-clr" data-page=${i}>${i}</a></li>
      <li><a class="text-decoration-none main-clr ${
        current >= 2 && page > 1 ? "pageActive" : ""
      }" data-page=${current}>${current}</a></li>
      <li><a class="text-decoration-none main-clr" data-page=${y}>${y}</a></li>
       <li>
              <a class="page-link" id="nextPage"
                ><i class="fa-solid fa-caret-right"></i>
              </a>
            </li>
      `;
    }
  }
  pages.innerHTML = paginationCount;
}

pages.addEventListener("click", (e) => {
  let target = e.target;
  console.log(target);
  if (target.closest("#nextPage")) {
    page++;
    currentPage = page;
    pagination(currentPage);
    fetchGames();
  }
  if (target.closest("#prevPage") && page > 1) {
    page--;
    if (page != 1) currentPage = page;
    pagination(currentPage);
    fetchGames();
  }
  let count = e.target.getAttribute("data-page");
  if (count) {
    page = Number(count);
    if (page != 1) currentPage = page;
    pagination(currentPage);
    fetchGames();
  }
});

pagination(currentPage);
