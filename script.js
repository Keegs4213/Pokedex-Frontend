// store pokemon data here
let pokemonAPIData = [];
let displayData = [];

// call the function below to fetch 20 pokemon
sequencialPokemonAPICall(100);
// now lets get the pokemon data from api
async function sequencialPokemonAPICall(numberOfPokemonToFetch) {
  // first create array that counts from 1 to number of pokemon to fetch

  let numberOfPokemonToFetchArray = [];
  for (let i = 1; i <= numberOfPokemonToFetch; i++) {
    numberOfPokemonToFetchArray.push(i);
  }
  // then fetch each character inside a for loop which waits for the previous one to complete and pushes the character information into the pokemonAPIData array for our cards
  let numberFetched = 0;
  for (let i in numberOfPokemonToFetchArray) {
    await fetch(`https://pokeapi.co/api/v2/pokemon/${parseInt(i) + 1}`)
      .then((pokeData) => pokeData.json())
      .then((pokeDataObject) => {
        // capitalize the first letter of the pokemon name
        const capitalizedPokemonName =
          pokeDataObject.name.charAt(0).toUpperCase() +
          pokeDataObject.name.slice(1);
        pokeDataObject.name = capitalizedPokemonName;
        pokemonAPIData.push(pokeDataObject);
      })
      .catch((error) => console.log("error", error));
    numberFetched++;
    numberFetched === numberOfPokemonToFetch ? showCards(pokemonAPIData) : null;
  }
}
// this will create the cards with an image + name
let showCards = (pokemons) => {
  //console.log(data);
  //remove existing cards first
  let parentDiv = document.getElementById("parentDiv");
  parentDiv.replaceChildren();
  pokemons.forEach((pokemon) => {
    const template = document
      .getElementById("card-template")
      .content.firstElementChild.cloneNode(true);
    template.querySelector(".card-img-top").src =
      pokemon.sprites.other["official-artwork"].front_default;
    template.querySelector(".card-title").innerHTML = pokemon.name;
    template.querySelector(
      ".list-group-item-one"
    ).textContent = `ID: ${pokemon.id}`;
    template.querySelector(
      ".list-group-item-two"
    ).textContent = `Type(s): ${pokemon.types
      .map((t) => t.type.name)
      .join(", ")}`;
    template.querySelector(
      ".list-group-item-three"
    ).textContent = `Moves: ${pokemon.moves
      .slice(0, 4)
      .map((m) => m.move.name)
      .join(", ")}`;
    template.querySelector(
      ".card-text"
    ).innerHTML = `<strong>Height:</strong> ${
      pokemon.height / 10
    } m <br /><strong>Weight:</strong> ${pokemon.weight / 10} kg`;
    template.addEventListener("click", () => {
      showPokemonData(pokemon.id);
    });
    parentDiv.appendChild(template);
  });
};

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("search").addEventListener("input", () => {
    const query = document.getElementById("search").value;
    changeSearch(query);
  });
  document.getElementById("category").addEventListener("click", filterByType);
});

// Search bar

const changeSearch = (query) => {
  displayData = pokemonAPIData.filter((obj) => {
    return obj.name.toLowerCase().includes(query.toLowerCase());
  });
  showCards(displayData);
};

//Type selector
function filterByType() {
  const selectedType = document.getElementById("category").value;
  if (selectedType === "all") {
    displayData = pokemonAPIData;
  } else {
    displayData = pokemonAPIData.filter((pokemon) =>
      pokemon.types.map((type) => type.type.name).includes(selectedType)
    );
  }
  showCards(displayData);
}

//Modals

// Define the showPokemonData function
function showPokemonData(pokemonId) {
  // Find the pokemon data for the clicked card
  const data = pokemonAPIData.find((pokemon) => pokemon.id == pokemonId);
  console.log(pokemonAPIData);
  // Populate the modal with the retrieved data
  const modal = document.getElementById("pokemonModal");
  modal.querySelector(".card-img-top").src = data.sprites.other["official-artwork"].front_default;
  modal.querySelector(".card-title").textContent = data.name;
  modal.querySelector(".card-text .height").textContent = (data.height/ 10)+ "m";
  modal.querySelector(".card-text .weight").textContent = (data.weight/ 10)+ "kg";

  const id = data.id;
  modal.querySelector(".list-group-item-one .id").textContent = id;

  const types = data.types.map((type) => type.type.name);
  modal.querySelector(".list-group-item-two .types").textContent =
    types.join(", ");

  const moves = data.moves.map((move) => move.move.name).slice(0, 30);
  modal.querySelector(".list-group-item-three .moves").textContent =
    moves.join(", ");

  const bsModal = new bootstrap.Modal(modal, {})
  bsModal.show()


  // Show the modal
  //$("#pokemonModal").modal("show");
}
