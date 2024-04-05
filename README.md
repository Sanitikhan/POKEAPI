# La pokéAPI - BOYER Anaëlle
 ## 1. Création d'une Page Web Simple
*Question : Comment structurer une page HTML pour afficher une liste de Pokémon et un formulaire de recherche ?*

Tout d'abord, afin de structurer une page HTML pour afficher une liste de Pokémon, il faut introduire une ```<div>``` dans le html qu'on joint à notre page **.js**.

**HTML**
``` html
  <div id="container">
    <div id="poke-container" class="ui cards container">
      <button id="generate-pokemon" class="ui secondary button">Generate Pokemon</button>
    </div>
  </div>
```
Il ne faut pas oublier de joindre le document **index.js** au document HTML, dans le ```<body>``` avec la commande :
```html
<script src="index.js"></script>
```

**JAVASCRIPT**
 ``` js

function fetchKantoPokemon() {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=150')
    .then(response => response.json())
    .then(function(allpokemon){
        allpokemon.results.forEach(function(pokemon) {
            fetchPokemonData(pokemon);
        })
    })
}
 ```

 Il faut faire un fetch de l'adresse https://pokeapi.co/api/v2/pokemon?limit=150 afin de récupérer les données de l'API et les manier dans notre code. Ici, le ```pokemon?limit=150``` sert à poser une limite sur la récupération des données des pokémons. On utilisera alors les données des 150 premiers pokémons. Il est possible d'augmenter ou de réduire cette limite
 (il est tout de même possible de faire une recherche d'un pokémon au dessus de cette limite).


## 2. Affichage de Plusieurs Pokémon Issus d'une Liste
*Question : Comment récupérer et afficher une liste initiale de Pokémon avec l'API PokeAPI ?*

Pour récupérer et afficher une liste initiale de pokémon avec l'**API PokeAPI**, j'ai initié une ```<div>``` dans mon fichier HTML. Celle-ci servira à afficher les pokémons dans un ```container``` composé de ```cards```. Dans mon code, il faut appuyer sur le bouton ```generate-pokemon``` pour faire afficher la liste des 150 pokémons.

**HTML**
``` html
  <div id="container">
    <div id="poke-container" class="ui cards container">
      <button id="generate-pokemon" class="ui secondary button">Generate Pokemon</button>
    </div>
  </div>
```
On ajoute un bouton dans la ```<div>``` afin de ```submit``` la recherche lorsqu'on appuie sur le bouton, permettant de faire fonctionner la génération des 150 pokémons.

**JAVASCRIPT**
``` js
document.addEventListener("DOMContentLoaded", ()=>{
    generateBtn=document.querySelector('#generate-pokemon');
    generateBtn.addEventListener('click', renderEverything)
    let deleteBtn=document.querySelector('#delete-btn');
    deleteBtn.addEventListener('click', deleteEverything);
    allPokemonContainer=document.querySelector('#poke-container');
});

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

function createTypes(types, ul){
    types.forEach(function(type){
        let typeLi=document.createElement('li');
        typeLi.innerText=type['type']['name'];
        ul.append(typeLi)
    })
}

function createPokeImage(pokeID, pokeData, containerDiv){
    let pokeImgContainer=document.createElement('div')
    pokeImgContainer.classList.add('image')
    let pokeImage=document.createElement('img')
    pokeImage.src=`${pokeData.sprites.front_default}`
    pokeImgContainer.append(pokeImage);
    containerDiv.append(pokeImgContainer);
}
```

La fonction ```fetchPokemonData``` permet de récupérer les données de chaque pokémon.

La fonction ```renderPokemon``` permet de reprendre ces données afin de les afficher dans mon *container*.

La fonction ```createTypes``` permet de stocker les données des types des pokémons pour les utiliser.

La fonction ```createPokeImage``` permet de récupérer les images de chaque pokémon afin de les afficher dans chaque *card* qui lui correspond.

 
## 3. Présentation de l'API PokeAPI
*Question : Comment explorer l'API PokeAPI pour trouver les informations nécessaires ?*

Pour trouver des informations dans l'**API PokeAPI**, j'ai initié une nouvelle ```<div>``` avec une barre de recherche qui permet trouver un pokémon (par son numéro ou son nom) et de l'afficher avec des informations. Ces informations sont plus complètes que celles affichées dans le *container*.

**HTML**
``` html
<form id="search-form">
    <input type="text" id="search-input" placeholder="Search for a Pokemon...">
    <button type="submit" id="search-button">Search</button>
</form>

<div id="search-result" class="hidden">
  <p class="p">Search result</p>
  <div id="search-pokemon-container" class="ui cards"></div>
</div>
```

La première ```<div>``` permet d'afficher la barre de recherche (```<form>```) et le bouton **Search** qui permettra de faire exécuter la recherche.

La seconde ```<div>``` permet de créer une zone qui fera afficher le résultat de cette recherche lorsque celle-ci sera valide.

**JAVASCRIPT**
``` js
document.getElementById('search-form').addEventListener('submit', function(event){
    event.preventDefault();
    const searchTerm=document.getElementById('search-input').value.toLowerCase();
    executeSearch(searchTerm);
});

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

function fetchPokemonAbilities(abilities, abilitiesList){
    abilities.forEach(ability=>{
        let abilityItem=document.createElement('li');
        abilityItem.innerText=ability.ability.name;
        abilitiesList.appendChild(abilityItem);
    });
}

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
```
Le ```getElementById``` permet d'aller chercher ```search-form``` dans le document HTML afin d'y mettre des données qui pourront être affichées.

La fonction ```executeSearch``` permet d'effectuer une recherche dans l'**API PokéAPI** afin de trouver un pokémon.

La fonction ```RenderSinglePokemon``` permet de faire afficher le pokémon recherché et de donner toutes ses informations en détails.

La fonction ```fetchPokemonStats``` permet de recupérer les données des statistiques par pokémon.

La fonction ```fetchPokemonAbilities``` permet de récupérer les données des capacités par pokémon.

La fonction ```renderPokemonStats``` permet de faire afficher les statistiques du pokémon recherché.

## 4. Recherche de Pokémon Grâce à un Formulaire
*Question : Comment implémenter une fonctionnalité de recherche pour trouver des Pokémon par leur numéro ?*

Pour la fonctionnalité de recherche pour trouver des Pokémon par leur numéro, il n'y a pas de code à rajouter par rapport au précédent. Le ```${searchTerm}``` prend en compte la recherche par le numéro du pokémon.
 
## 5. Gestion d'Erreur
*Question : Comment gérer les erreurs, comme une recherche qui ne retourne aucun résultat ?*

Pour les erreurs, il faut utiliser un ```.catch``` dans un fetch pour afficher une erreur dans la console lors de la récupération de données dans l'API avec ```console.error(error);```.

Ici, j'ai rajouté une entrée de texte qui me marquera directement sur ma page lorsque la recherche de pokémon est mauvaise (dernière ligne).

``` js
    .catch(error=>{
        console.error(error);
        // Afficher le message d'erreur
        document.getElementById('search-feedback').innerText = 'Pokémon not found.';
    });
```
 
## 6. Manipulation d'Objet et de Tableau en JS
*Question : Comment manipuler les objets et tableaux retournés par l'API pour afficher les informations des Pokémon ?*

La manipulation d'objets et tableaux par l'API peut se faire avec un ```forEach()```. Dans mon exemple ci-dessous, pour chaque capacité, une liste des différents types de capacités sera associée à un pokémon.

``` js
function fetchPokemonAbilities(abilities, abilitiesList){
    abilities.forEach(ability=>{
        let abilityItem=document.createElement('li');
        abilityItem.innerText=ability.ability.name;
        abilitiesList.appendChild(abilityItem);
    });
}
```
 
## 7. Utilisation de Fetch et Résolution de Promesses
*Question : Comment utiliser fetch pour faire des requêtes asynchrones et traiter les données retournées ?*

``` js
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
```

La promesse se traite et lorsque celle-ci est traitée, on utilise ```.then``` pour lui faire exécuter une action. Ici, lorsqu'on récupère les données des pokémons, on les stocke dans une fonction ```pokeData```.

## 8. Usage du Format JSON
*Question : Comment travailler avec le format JSON pour extraire les données retournées par l'API ?*

Avec l'exemple précédant de la fonction ```fetchPokemonStats```, on récupère les données de l'API qui sont en format JSON et on les convertit en objet JAVASCRIPT afin de les utiliser dans le code. A chaque fetch de l'API, il faut ```.then(response=>response.json())``` afin de le convertir, sinon, les données seront difficilement utilisable en JAVASCRIPT.
