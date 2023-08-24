let characters = [];

let showNumber = 5;

const root = document.getElementById('root');

const searchButton = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const loadMoreButton = document.querySelector('.load-more');


function searchById(id) {

    // Creating Our XMLHttpRequest object 
    const xhr = new XMLHttpRequest();

    // Making our connection  
    const url = `https://rickandmortyapi.com/api/character/${id}`;
    xhr.open('GET', url, true);

    // function execute after request is successful 
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const char = JSON.parse(this.response);
            characters.unshift(char);
            localStorage.setItem('chars123', JSON.stringify(characters));
            drawCharacters();
        }
        if (this.readyState === 4 && this.status === 404) {
            alert('Character not found');
        }
    }
    // Sending our request 
    xhr.send();
}

function drawCharacters() {
    const charactersWrap = document.getElementById('characters-wrap');

    charactersWrap.innerHTML = '';

    for (let index = 0; index < characters.length && index < showNumber; index++) {
        let char = characters[index];
        charactersWrap.innerHTML += `<div>
            <p>id: ${char.id}</p>
            <p>name: ${char.name}</p>
            <img src="${char.image}">
            <button onclick="removeChar(${char.id})">Remove</button>
        </div>`;
    }

    if (characters.length > showNumber) {
        loadMoreButton.classList.remove('hide');
    }
}

function removeChar(id) {
    characters = characters.filter(char => char.id !== id);
    localStorage.setItem('chars123', JSON.stringify(characters));
    drawCharacters();
}

loadMoreButton.classList.add('hide');

searchButton.onclick = function () {
    const id = searchInput.value;

    if (!id) {
        alert('no id present');
        return;
    }
    for (let i = 0; i < characters.length; i++) {
        if (characters[i].id + '' === id) {
            alert('Character is already in the list');
            return;
        }
    }
    searchById(id);
}

loadMoreButton.onclick = function() {
    showNumber += 5;
    if (showNumber > characters.length) {
        loadMoreButton.classList.add('hide');
    }

    drawCharacters();
    const scrollingElement = document.scrollingElement || document.body;
    scrollingElement.scrollTop = scrollingElement.scrollHeight;
}

const charsString = localStorage.getItem('chars123');

if (charsString) {
    characters = JSON.parse(charsString);
    drawCharacters();
}