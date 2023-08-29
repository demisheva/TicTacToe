window.addEventListener('DOMContentLoaded', () => {

    const field = document.querySelector('.container');
    function drowBoard() {
        for (let i = 0; i < 9; i++) {
            let tile = document.createElement('div');
            tile.className = 'tile';
            tile.setAttribute('data-square-number', `${i}`)
            field.appendChild(tile);
        }
    }

    drowBoard();

    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('#reset');
    const announcer = document.querySelector('.announcer');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive = true;

    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE';

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    let activeTile = 0;


    function handleResultValidation() {
        let roundWon = false;

        for (let i = 0; i <= 7; i++) {
            const winCondition = winningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
            isGameActive = false;
            return;
        }

        if (!board.includes('')) {
            announce(TIE);
        }
    }

    const announce = (type) => {
        switch (type) {
            case PLAYERO_WON:
                announcer.innerHTML = 'Player <span class="playerO">O</span> Won';
                break;
            case PLAYERX_WON:
                announcer.innerHTML = 'Player <span class="playerX">X</span> Won';
                break;
            case TIE:
                announcer.innerText = 'Tie';
                break;
            default:
            // do nothing
        }
        announcer.classList.remove('hide');
    };

    const isValidAction = (tile) => {
        if (tile.innerText === 'X' || tile.innerText === 'O') {
            return false;
        }

        return true;
    };

    const updateBoard = (index) => {
        board[index] = currentPlayer;
    }

    const changePlayer = () => {
        playerDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    }

    const userAction = (tile, index) => {
        console.log('tile',tile)
        console.log('index', index);
        console.log('currentPlayer', currentPlayer)
        if (isValidAction(tile) && isGameActive) {
            console.log('yes')
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateBoard(index);
            handleResultValidation();
            changePlayer();
        }
    }

    const resetBoard = () => {
        console.log('reset');
        board = ['', '', '', '', '', '', '', '', ''];
        activeTile = 0;
        isGameActive = true;
        announcer.classList.add('hide');

        if (currentPlayer === 'O') {
            changePlayer();
        }

        tiles.forEach(tile => {
            tile.innerText = '';
            tile.classList.remove('playerX');
            tile.classList.remove('playerO');
            tiles[activeTile].classList.remove('active');
        });
    }

    field.addEventListener('click', (event) =>
        userAction(event.target, event.target.getAttribute('data-square-number')));

    resetButton.addEventListener('click', resetBoard);
    resetButton.addEventListener('keydown', () => {
        resetButton.blur();
    });
    
    document.addEventListener('keydown', (event) => {
        console.log('event.key', event.key)

        if (document.activeElement === document.body &&
            ['Up', 'ArrowUp', 'Down', 'ArrowDown', 'Left', 'ArrowLeft', 'Right', 'ArrowRight'].includes(event.key)) {
            tiles[activeTile].classList.add('active')
        }

        switch (event.key) {
            case 'Up':
            case 'ArrowUp':
                tiles[activeTile].classList.remove('active');
                activeTile = activeTile - 3;
                break;
            case 'Down':
            case 'ArrowDown':
                tiles[activeTile].classList.remove('active');
                activeTile = activeTile + 3;
                break;
            case 'Left':
            case 'ArrowLeft':
                tiles[activeTile].classList.remove('active');
                activeTile = activeTile % 3 === 0 ? activeTile + 2 : activeTile - 1;
                break;
            case 'Right':
            case 'ArrowRight':
                tiles[activeTile].classList.remove('active');
                activeTile = (activeTile + 1) % 3 === 0 ? activeTile - 2 : activeTile + 1;
                break;
            default:

        }
        activeTile = (activeTile + 9) % 9;
        tiles[activeTile].classList.add('active');

        if (event.key === 'Enter') {
            userAction(tiles[activeTile], activeTile);
            tiles[activeTile].classList.remove('active');
        }

    });


    let images = document.querySelectorAll('.icons .avatar-icon');
    console.log(images);

    for (let i = 0; i < images.length; i++) {
        let element = images[i];
        element.setAttribute('id', `${element.className}${i}`); 
        element.setAttribute('draggable', 'true');
        element.addEventListener('dragstart', dragStart);
    }

    function dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
        console.log(e.dataTransfer.getData('text/plain'));
    }

    const avatars = document.querySelectorAll('.avatar-container');
    avatars.forEach(element => {
        element.addEventListener('dragenter', dragEnter)
        element.addEventListener('dragover', dragOver);
        element.addEventListener('dragleave', dragLeave);
        element.addEventListener('drop', drop);
    });

    function dragEnter(e) {
        e.preventDefault();
        e.target.classList.add('drag-over');
    }

    function dragOver(e) {
        e.preventDefault();
        e.target.classList.add('drag-over');
    }

    function dragLeave(e) {
        e.target.classList.remove('drag-over');
    }

    function drop(e) {
        const id = e.dataTransfer.getData('text/plain');
        const draggable = document.getElementById(id);

        e.target.appendChild(draggable);
        draggable.classList.remove('hide');

        e.target.removeEventListener('dragenter', dragEnter)
        e.target.removeEventListener('dragover', dragOver);
        e.target.removeEventListener('dragleave', dragLeave);
        e.target.removeEventListener('drop', drop);

        
        draggable.removeAttribute('draggable');
        draggable.removeEventListener('dragstart', dragStart);
    }
});
