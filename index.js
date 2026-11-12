console.log('You have connected...')

//Déclaration des variables
let generateBtn;
let allPokemonContainer;
let currentLanguage = 'en';
let lastDisplayedPokemon = null;

const translations = {
    en: {
        pageTitle: 'Find a Pokémon.',
        introCopy: 'Search by name or Pokédex number, or explore the original Kanto roster.',
        searchSection: 'Find a Pokémon',
        searchLabel: 'Search Pokémon',
        searchPlaceholder: 'Try Pikachu or 25',
        searchButton: 'Search',
        searchHint: 'Search by Pokémon name or Pokédex number',
        pokemonDetails: 'Pokémon details',
        kantoPokemon: 'Kanto Pokémon',
        sectionCopy: 'Meet the first 150 Pokémon and their types.',
        exploreButton: 'Explore Pokémon',
        clearButton: 'Clear list',
        madeBy: 'Made by',
        redesigned: 'Redesigned on 2026',
        enterPokemon: 'Enter a Pokémon name or number to search.',
        notFound: 'Pokémon not found.',
        emptyState: 'Your Pokédex is ready.\\A Choose “Explore Pokémon” to fill it with Kanto discoveries.',
        switchLanguage: 'Switch page language to {language}',
        french: 'French',
        english: 'English',
        viewDetails: 'View details for {name}, number {number}',
        imageAlt: 'Artwork of {name}',
        numberLabel: 'Pokémon #{number}',
        weight: 'Weight',
        height: 'Height',
        stats: {}
    },
    fr: {
        pageTitle: 'Trouvez un Pokémon.',
        introCopy: 'Recherchez par nom ou numéro du Pokédex, ou explorez les Pokémon de Kanto.',
        searchSection: 'Rechercher un Pokémon',
        searchLabel: 'Rechercher un Pokémon',
        searchPlaceholder: 'Ex. Pikachu ou 25',
        searchButton: 'Rechercher',
        searchHint: 'Recherchez par nom ou numéro du Pokédex',
        pokemonDetails: 'Fiche Pokémon',
        kantoPokemon: 'Pokémon de Kanto',
        sectionCopy: 'Découvrez les 150 premiers Pokémon et leurs types.',
        exploreButton: 'Explorer les Pokémon',
        clearButton: 'Effacer la liste',
        madeBy: 'Créé par',
        redesigned: 'Redessiné en 2026',
        enterPokemon: 'Saisissez un nom ou un numéro de Pokémon.',
        notFound: 'Pokémon introuvable.',
        emptyState: 'Votre Pokédex vous attend.\\A Choisissez « Explorer les Pokémon » pour découvrir Kanto.',
        switchLanguage: 'Passer la langue de la page en {language}',
        french: 'français',
        english: 'anglais',
        viewDetails: 'Voir la fiche de {name}, numéro {number}',
        imageAlt: 'Illustration de {name}',
        numberLabel: 'Pokémon n° {number}',
        weight: 'Poids',
        height: 'Taille',
        types: {
            normal: 'normal',
            fire: 'feu',
            water: 'eau',
            electric: 'électrik',
            grass: 'plante',
            ice: 'glace',
            fighting: 'combat',
            poison: 'poison',
            ground: 'sol',
            flying: 'vol',
            psychic: 'psy',
            bug: 'insecte',
            rock: 'roche',
            ghost: 'spectre',
            dragon: 'dragon',
            dark: 'ténèbres',
            steel: 'acier',
            fairy: 'fée'
        },
        stats: {
            hp: 'PV',
            attack: 'Attaque',
            defense: 'Défense',
            'special-attack': 'Attaque spéciale',
            'special-defense': 'Défense spéciale',
            speed: 'Vitesse'
        }
    }
};

function translate(key) {
    return translations[currentLanguage][key];
}

function formatPokemonNumber(number) {
    return translate('numberLabel').replace('{number}', number);
}

function translateType(type) {
    const typeTranslations = translations[currentLanguage].types;
    return (typeTranslations && typeTranslations[type]) || type;
}

function setSearchFeedback(messageKey) {
    const feedback = document.getElementById('search-feedback');
    feedback.dataset.messageKey = messageKey;
    feedback.textContent = messageKey ? translate(messageKey) : '';
}

function applyLanguage(language) {
    currentLanguage = language;
    document.documentElement.lang = language;
    document.title = language === 'fr' ? 'Pokédex | Explorateur Pokémon' : 'Pokédex | Pokémon Explorer';

    document.querySelectorAll('[data-i18n]').forEach(element => {
        element.textContent = translate(element.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        element.placeholder = translate(element.dataset.i18nPlaceholder);
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
        element.setAttribute('aria-label', translate(element.dataset.i18nAriaLabel));
    });
    const feedback = document.getElementById('search-feedback');
    if (feedback.dataset.messageKey) {
        feedback.textContent = translate(feedback.dataset.messageKey);
    }

    const nextLanguage = language === 'en' ? 'fr' : 'en';
    const languageButton = document.getElementById('language-toggle');
    languageButton.textContent = nextLanguage.toUpperCase();
    languageButton.setAttribute(
        'aria-label',
        translate('switchLanguage').replace('{language}', translate(nextLanguage === 'fr' ? 'french' : 'english'))
    );
    document.getElementById('poke-container').style.setProperty(
        '--empty-state-copy',
        `"${translate('emptyState')}"`
    );

    document.querySelectorAll('#poke-container .card').forEach(card => {
        const number = Number(card.dataset.pokemonId);
        const name = card.querySelector('h2').textContent;
        card.querySelector('p').textContent = formatPokemonNumber(number);
        card.setAttribute('aria-label', translate('viewDetails').replace('{name}', name).replace('{number}', number));
        card.querySelectorAll('li[data-type]').forEach(typeTag => {
            typeTag.textContent = translateType(typeTag.dataset.type);
        });
    });

    if (lastDisplayedPokemon) {
        renderSinglePokemon(lastDisplayedPokemon);
    }
}

document.addEventListener("DOMContentLoaded", ()=>{
    generateBtn=document.querySelector('#generate-pokemon');
    generateBtn.addEventListener('click', renderEverything)
    let deleteBtn=document.querySelector('#delete-btn');
    deleteBtn.addEventListener('click', deleteEverything);
    allPokemonContainer=document.querySelector('#poke-container');
    document.getElementById('language-toggle').addEventListener('click', ()=>{
        applyLanguage(currentLanguage === 'en' ? 'fr' : 'en');
    });
    applyLanguage(currentLanguage);
});

document.getElementById('search-form').addEventListener('submit', function(event){
    event.preventDefault();
    const searchTerm=document.getElementById('search-input').value.trim().toLowerCase();
    if (!searchTerm) {
        setSearchFeedback('enterPokemon');
        return;
    }
    executeSearch(searchTerm);
});


//Requête l'API pokémon pour afficher le pokémon correspondant à la recherche
function executeSearch(searchTerm){
    lastDisplayedPokemon = null;
    document.getElementById('search-pokemon-container').innerHTML= '';
    document.getElementById('search-result').classList.add('hidden');
    setSearchFeedback('');
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
        setSearchFeedback('notFound');
    });
}

//Informer que l'entrée dans la recherche est une erreur/n'est pas un pokémon
function renderNotFound() {
    const searchPokemonContainer = document.getElementById('search-pokemon-container');
    searchPokemonContainer.textContent = translate('notFound');
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
    })
    .catch(error=>{
        console.error('Error fetching ability data:', error);
    });
}

//Prendre les données d'un pokémon et les affiche sous forme de carte avec son nom, son numéro et son/ses types. 
function renderPokemon(pokeData){
    let allPokemonContainer=document.getElementById('poke-container');
    let pokeContainer=document.createElement("div")
    pokeContainer.classList.add('card');
    pokeContainer.dataset.pokemonId = pokeData.id;
    pokeContainer.dataset.type = pokeData.types[0].type.name;
    pokeContainer.setAttribute('role', 'button');
    pokeContainer.setAttribute(
        'aria-label',
        translate('viewDetails').replace('{name}', pokeData.name).replace('{number}', pokeData.id)
    );
    pokeContainer.setAttribute('aria-controls', 'search-result');
    pokeContainer.tabIndex = 0;
    const showDetails = () => showPokemonDetails(pokeData);
    pokeContainer.addEventListener('click', showDetails);
    pokeContainer.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            showDetails();
        }
    });
    createPokeImage(pokeData.id, pokeData, pokeContainer);
    let pokeName=document.createElement('h2')
    pokeName.innerText=pokeData.name
    let pokeNumber=document.createElement('p')
    pokeNumber.innerText=formatPokemonNumber(pokeData.id)
    let pokeTypes=document.createElement('ul')
    createTypes(pokeData.types, pokeTypes)
    pokeContainer.append(pokeName, pokeNumber, pokeTypes);
    const nextPokemon = Array.from(allPokemonContainer.children).find(card =>
        Number(card.dataset.pokemonId) > pokeData.id
    );
    allPokemonContainer.insertBefore(pokeContainer, nextPokemon || null);
}

function showPokemonDetails(pokeData) {
    renderSinglePokemon(pokeData);
    document.getElementById('search-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

//Créer une liste d'éléments '<li>' pour afficher les types d'un pokémon.
function createTypes(types, ul){
    types.forEach(function(type){
        let typeLi=document.createElement('li');
        typeLi.dataset.type = type.type.name;
        typeLi.innerText=translateType(type.type.name);
        ul.append(typeLi)
    })
}

//Créer une image pour afficher le sprite avant d'un poékmon.
function createPokeImage(pokeID, pokeData, containerDiv){
    let pokeImgContainer=document.createElement('div')
    pokeImgContainer.classList.add('image')
    let pokeImage=document.createElement('img')
    pokeImage.src=`${pokeData.sprites.front_default}`
    pokeImage.alt=translate('imageAlt').replace('{name}', pokeData.name)
    pokeImgContainer.append(pokeImage);
    containerDiv.append(pokeImgContainer);
}

//Effacer le contenu du conteneur de tous les pokémons ainsi que le contenu du conteneur de recherche ; sans supprimer les boutons et la barre de recherche.
function deleteEverything(event){
    lastDisplayedPokemon = null;
    while (allPokemonContainer.firstChild){
        allPokemonContainer.removeChild(allPokemonContainer.firstChild);
    }
    const searchPokemonContainer = document.getElementById('search-pokemon-container');
    searchPokemonContainer.innerHTML = '';
    const searchResult = document.getElementById('search-result');
    searchResult.classList.add('hidden');
    if (!document.getElementById('generate-pokemon')) {
        generateBtn=document.createElement('button');
        generateBtn.innerText=translate('exploreButton');
        generateBtn.id='generate-pokemon';
        generateBtn.classList.add('ui', 'secondary', 'button');
        generateBtn.addEventListener('click', renderEverything);
        allPokemonContainer.append(generateBtn);
    }
}

//Afficher un seul pokémon en réponse d'une recherche avec ses informations.
function renderSinglePokemon(pokeData) {
    lastDisplayedPokemon = pokeData;
    const searchPokemonContainer = document.getElementById('search-pokemon-container');
    searchPokemonContainer.innerHTML = '';
    let pokeContainer = document.createElement("div");
    pokeContainer.classList.add('card');
    pokeContainer.dataset.type = pokeData.types[0].type.name;
    let pokeName = document.createElement('h2');
    pokeName.innerText = pokeData.name;
    let pokeNumber = document.createElement('p');
    pokeNumber.innerText = formatPokemonNumber(pokeData.id);
    let pokeTypes = document.createElement('ul');
    createTypes(pokeData.types, pokeTypes);
    let abilitiesList = document.createElement('ul');
    abilitiesList.classList.add('abilities');
    fetchPokemonAbilities(pokeData.abilities, abilitiesList);
    let statsContainer = document.createElement('div');
    statsContainer.classList.add('pokemon-stats');
    renderPokemonStats(pokeData.stats, statsContainer);
    let pokeWeight = document.createElement('p');
    pokeWeight.innerText = `${translate('weight')}: ${pokeData.weight}`;
    let pokeHeight = document.createElement('p');
    pokeHeight.innerText = `${translate('height')}: ${pokeData.height}`;
    createPokeImage(pokeData.id, pokeData, pokeContainer);
    pokeContainer.append(pokeName, pokeNumber, pokeTypes, abilitiesList, statsContainer, pokeWeight, pokeHeight);
    searchPokemonContainer.appendChild(pokeContainer);
    const searchResult = document.getElementById('search-result');
    searchResult.classList.remove('hidden');
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
function renderPokemonStats(stats, statsContainer) {
    stats.forEach(stat=>{
        let statItem=document.createElement('p');
        const statNames = translations[currentLanguage].stats;
        const statName = (statNames && statNames[stat.stat.name]) || stat.stat.name;
        statItem.innerText=`${statName}: ${stat.base_stat}`;
        statsContainer.appendChild(statItem);
    });
}