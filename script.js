window.addEventListener('load', () => {
    console.log('Page chargée');
    const board = document.querySelector('.memory-board');
    if (!board) {
        console.error('Erreur : .memory-board non trouvé');
        return;
    }
    const difficultySelect = document.querySelector('#difficulty');
    const resetBtn = document.querySelector('.reset');
    if (!difficultySelect || !resetBtn) {
        console.error('Erreur : Éléments de contrôle non trouvés', { difficultySelect, resetBtn });
        return;
    }
    const emojis = ['😎', '🚀', '⚡', '🔥', '🌟', '🦁', '🐉', '🎮', '🛸', '🤖', '🎸', '🏎️', '⚽', '🍕', '🍔', '🌈', '🦄', '🎉', '💥', '🪐'];
    let cards = [];
    let flippedCards = [];
    let lockBoard = false;
    let matchesFound = 0;

    console.log('Board:', board);
    console.log('Difficulty select:', difficultySelect);
    console.log('Reset button:', resetBtn);

    initializeGame();
    difficultySelect.addEventListener('change', () => {
        console.log('Changement de difficulté:', difficultySelect.value);
        initializeGame();
    });
    resetBtn.addEventListener('click', () => {
        console.log('Reset cliqué');
        resetGame();
    });

    function initializeGame() {
        console.log('Initialisation du jeu...');
        const level = difficultySelect.value;
        const cardCount = level === 'easy' ? 12 : level === 'medium' ? 16 : 20;
        const maxPairs = cardCount / 2;
        board.className = `memory-board ${level}`;
        console.log(`Niveau: ${level}, Cartes: ${cardCount}, Paires: ${maxPairs}`);
        createBoard(cardCount, maxPairs);
        initializeCards();
    }

    function createBoard(cardCount, maxPairs) {
        console.log(`Création de ${cardCount} cartes avec ${maxPairs} paires`);
        board.innerHTML = '';
        const emojiPairs = shuffle([...emojis.slice(0, maxPairs), ...emojis.slice(0, maxPairs)]);
        console.log('Emojis mélangés:', emojiPairs);
        for (let i = 0; i < cardCount; i++) {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.symbol = emojiPairs[i];
            card.innerHTML = `
            <div class="card-inner">
              <div class="card-front"></div>
              <div class="card-back" aria-label="Symbole ${emojiPairs[i]}">${emojiPairs[i]}</div>
            </div>
          `;
            board.appendChild(card);
            console.log(`Carte ${i} créée avec symbole: ${emojiPairs[i]}`);
        }
        cards = document.querySelectorAll('.memory-card');
        console.log('Total cartes créées:', cards.length);
        if (cards.length !== cardCount) {
            console.error('Erreur : Nombre de cartes incorrect', { expected: cardCount, actual: cards.length });
        }
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function initializeCards() {
        console.log('Initialisation des cartes...');
        cards.forEach((card, index) => {
            console.log(`Carte ${index}: ${card.dataset.symbol}`);
            card.classList.remove('flipped', 'matched', 'no-match');
            card.removeEventListener('click', flipCard);
            card.addEventListener('click', flipCard);
        });
        matchesFound = 0;
        flippedCards = [];
        lockBoard = false;
    }

    function flipCard() {
        if (lockBoard || this.classList.contains('flipped') || flippedCards.length >= 2) return;
        console.log('Carte cliquée:', this.dataset.symbol);
        this.classList.add('flipped');
        flippedCards.push(this);
        if (flippedCards.length === 2) {
            lockBoard = true;
            checkMatch();
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;
        console.log('Vérification:', card1.dataset.symbol, card2.dataset.symbol);
        if (card1.dataset.symbol === card2.dataset.symbol) {
            matchesFound++;
            card1.classList.add('matched');
            card2.classList.add('matched');
            flippedCards = [];
            lockBoard = false;
            if (matchesFound === cards.length / 2) {
                setTimeout(() => {
                    console.log('Victoire !');
                    const victoryMessage = document.createElement('div');
                    victoryMessage.className = 'victory';
                    victoryMessage.textContent = 'Bravo, toutes les paires trouvées !';
                    board.appendChild(victoryMessage);
                    setTimeout(() => {
                        console.log('Suppression modale');
                        victoryMessage.remove();
                    }, 3000);
                }, 500);
            }
        } else {
            card1.classList.add('no-match');
            card2.classList.add('no-match');
            setTimeout(() => {
                card1.classList.remove('flipped', 'no-match');
                card2.classList.remove('flipped', 'no-match');
                flippedCards = [];
                lockBoard = false;
            }, 1000);
        }
    }

    function resetGame() {
        console.log('Reset du jeu...');
        cards.forEach(card => card.classList.remove('flipped', 'matched', 'no-match'));
        initializeGame();
    }
});
