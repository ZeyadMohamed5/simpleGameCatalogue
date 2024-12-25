export { getGenre, addFilterBtn, getGamesbyGenre };
import { options } from "./main.js";
async function getGenre() {
  try {
    const response = await fetch(
      "https://rawg-video-games-database.p.rapidapi.com/genres?key=5684829455364f0d81e54d6a3bfa8288",
      options
    );
    const result = await response.json();
    return result.results;
  } catch (error) {
    console.log(error);
    return null;
  }
}

function addFilterBtn(genresObj) {
  let genreNames = "";
  genresObj.forEach((genre) => {
    genreNames += `<li><a class="dropdown-item" data-genre = ${genre.id} href="#">${genre.name}</a></li>`;
  });
  return genreNames;
}

function getGamesbyGenre(games, genreId) {
  return games.filter((game) =>
    game.genres.some((genre) => genre.id === genreId)
  );
}
