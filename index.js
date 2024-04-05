console.log('You have connected...')

//Déclaration des variables
let generateBtn;
let allPokemonContainer;

document.addEventListener("DOMContentLoaded", ()=>{
    generateBtn=document.querySelector('#generate-pokemon');
    generateBtn.addEventListener('click', renderEverything)
    let deleteBtn=document.querySelector('#delete-btn');
    deleteBtn.addEventListener('click', deleteEverything);
    allPokemonContainer=document.querySelector('#poke-container');
});

document.getElementById('search-form').addEventListener('submit', function(event){
    event.preventDefault();
    const searchTerm=document.getElementById('search-input').value.toLowerCase();
    executeSearch(searchTerm);
});


//Requête l'API pokémon pour afficher le pokémon correspondant à la recherche
function executeSearch(searchTerm){
    document.getElementById('search-pokemon-container').innerHTML= '';
    document.getElementById('search-feedback').innerText = '';
    fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`)
    .then(response=>{
        if (!response.ok){
            throw new Error('Pokemon not found');
        }
        return response.json();
    })
    .then(pokeData=>{
        renderSinglePokemon(pokeData);
    })
    .catch(error=>{
        console.error(error);
        // Afficher le message d'erreur
        document.getElementById('search-feedback').innerText = 'Pokémon not found.';
    });
}

//Informer que l'entrée dans la recherche est une erreur/n'est pas un pokémon
function renderNotFound() {
    const searchPokemonContainer = document.getElementById('search-pokemon-container');
    searchPokemonContainer.innerHTML = '<p>Pokémon not found.</p>';
    const searchResult = document.getElementById('search-result');
    searchResult.classList.remove('hidden');
}

//Efface le contenu du conteneur de tous les pokémons
function renderEverything(){
    allPokemonContainer.innerText="";
    fetchKantoPokemon();
}

//Renvoyer le bouton de suppression
function getDeleteBtn(){
    return document.querySelector('#delete-btn')
}

//Effectuer une requête pour obtenir la liste des pokémons
function fetchKantoPokemon() {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=150')
    .then(response => response.json())
    .then(function(allpokemon){
        allpokemon.results.forEach(function(pokemon) {
            fetchPokemonData(pokemon);
        })
    })
}

//Prendre l'URL d'un pokémon, effectue une requête pour obtenir les données de ce pokémon
function fetchPokemonData(pokemon) {
    let url=pokemon.url
    fetch(url)
    .then(response => response.json())
    .then(function(pokeData){
        renderPokemon(pokeData);
        fetchPokemonStats(pokeData.id);
    })
    .catch(error=>{
        console.error('Error fetching ability data:', error);
    });
}

//Prendre les données d'un pokémon et les affiche sous forme de carte avec son nom, son numéro et son/ses types. 
function renderPokemon(pokeData){
    let allPokemonContainer=document.getElementById('poke-container');
    let pokeContainer=document.createElement("div")
    pokeContainer.classList.add('ui', 'card');
    createPokeImage(pokeData.id, pokeData, pokeContainer);
    let pokeName=document.createElement('h2')
    pokeName.innerText=pokeData.name
    let pokeNumber=document.createElement('p')
    pokeNumber.innerText=`#${pokeData.id}`
    let pokeTypes=document.createElement('ul')
    createTypes(pokeData.types, pokeTypes)
    pokeContainer.append(pokeName, pokeNumber, pokeTypes);
    allPokemonContainer.appendChild(pokeContainer);
}

//Créer une liste d'éléments '<li>' pour afficher les types d'un pokémon.
function createTypes(types, ul){
    types.forEach(function(type){
        let typeLi=document.createElement('li');
        typeLi.innerText=type['type']['name'];
        ul.append(typeLi)
    })
}

//Créer une image pour afficher le sprite avant d'un poékmon.
function createPokeImage(pokeID, pokeData, containerDiv){
    let pokeImgContainer=document.createElement('div')
    pokeImgContainer.classList.add('image')
    let pokeImage=document.createElement('img')
    pokeImage.src=`${pokeData.sprites.front_default}`
    pokeImgContainer.append(pokeImage);
    containerDiv.append(pokeImgContainer);
}

//Effacer le contenu du conteneur de tous les pokémons ainsi que le contenu du conteneur de recherche ; sans supprimer les boutons et la barre de recherche.
function deleteEverything(event){
    while (allPokemonContainer.firstChild){
        allPokemonContainer.removeChild(allPokemonContainer.firstChild);
    }
    const searchPokemonContainer = document.getElementById('search-pokemon-container');
    searchPokemonContainer.innerHTML = '';
    const searchResult = document.getElementById('search-result');
    searchResult.classList.add('hidden');
    if (!document.getElementById('generate-pokemon')) {
        generateBtn=document.createElement('button');
        generateBtn.innerText="Generate Pokemon";
        generateBtn.id='generate-pokemon';
        generateBtn.classList.add('ui', 'secondary', 'button');
        generateBtn.addEventListener('click', renderEverything);
        allPokemonContainer.append(generateBtn);
    }
}

//Afficher un seul pokémon en réponse d'une recherche avec ses informations.
function renderSinglePokemon(pokeData) {
    const searchPokemonContainer = document.getElementById('search-pokemon-container');
    searchPokemonContainer.innerHTML = '';
    let pokeContainer = document.createElement("div");
    pokeContainer.classList.add('ui', 'card');
    let pokeName = document.createElement('h2');
    pokeName.innerText = pokeData.name;
    let pokeNumber = document.createElement('p');
    pokeNumber.innerText = `#${pokeData.id}`;
    let pokeTypes = document.createElement('ul');
    createTypes(pokeData.types, pokeTypes);
    pokeTypes.innerText = `Caractéristiques :`;
    let abilitiesList = document.createElement('ul');
    abilitiesList.classList.add('abilities');
    fetchPokemonAbilities(pokeData.abilities, abilitiesList);
    let statsContainer = document.createElement('div');
    statsContainer.classList.add('pokemon-stats');
    fetchPokemonStats(pokeData.id, statsContainer);
    let pokeWeight = document.createElement('p');
    pokeWeight.innerText = `Weight: ${pokeData.weight}`;
    let pokeHeight = document.createElement('p');
    pokeHeight.innerText = `Height: ${pokeData.height}`;
    createPokeImage(pokeData.id, pokeData, pokeContainer);
    pokeContainer.append(pokeName, pokeNumber, pokeTypes, abilitiesList, statsContainer, pokeWeight, pokeHeight);
    searchPokemonContainer.appendChild(pokeContainer);
    const searchResult = document.getElementById('search-result');
    searchResult.classList.remove('hidden');
}

//Afficher les statistiques des pokémons
function fetchPokemonStats(pokemonId, pokeContainer) {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    fetch(url)
    .then(response=>response.json())
    .then(function(pokeData){
        renderPokemonStats(pokeData, pokeContainer);
    })
    .catch(error=>{
        console.error('Error fetching Pokemon stats', error);
    })
}

//Afficher les habilités du pokémon recherché et sa progress bar.
function fetchPokemonAbilities(abilities, abilitiesList){
    abilities.forEach(ability=>{
        let abilityItem=document.createElement('li');
        abilityItem.innerText=ability.ability.name;
        abilitiesList.appendChild(abilityItem);
    });
}

//Afficher les statistiques du pokémon.
function renderPokemonStats(pokeData, pokeContainer) {
    let statsContainer=document.createElement('div');
    statsContainer.classList.add('pokemon-stats');
    pokeData.stats.forEach(stat=>{
        let statItem=document.createElement('p');
        statItem.innerText=`${stat.stat.name}: ${stat.base_stat}`;
        statsContainer.appendChild(statItem);
    });
    pokeContainer.appendChild(statsContainer);
}