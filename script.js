window.addEventListener('load', () => {
    class Card {
        static id = 0;
        constructor(image, element) {
            this.id = Card.id++;
            this.image = image;
            this.found = false;
            this.isFlipped = false;
            this.element = element;
        }
        affiche() {
            console.log(`La carte a pour id ${this.id} et pour image ${this.image}`);
        }
        flip() {
            if (this.found) return; // Ne pas retourner une carte déjà trouvée
            this.isFlipped = !this.isFlipped;
            this.element.classList.toggle('flipped', this.isFlipped);
            this.element.textContent = this.isFlipped ? this.image : '';
        }
        show() {
            this.element.textContent = this.image;
        }
        hide() {
            this.element.textContent = '';
        }
    }

    let emojis = ['😃', '😄', '😁', '😅', '🤣', '😂', '🙂', '🙃', '🫠', '😉', '😊', '😇', '🥰', '😍'];
    let emojipairs = [...emojis, ...emojis];
    emojipairs = emojipairs.sort(() => Math.random() - 0.5);

    let cartesElements = document.querySelectorAll('.card');
    const content = document.querySelector('.main');
    cartesElements = shuffle(Array.from(cartesElements));
    content.append(...cartesElements);
    let cards = [];
    let flippedCards = [];
    let lockBoard = false;

    cartesElements.forEach((element, i) => {
        const emojiIndex = element.dataset.card;
        const image = emojipairs[emojiIndex];
        const card = new Card(image, element);
        cards.push(card);
        card.hide(); // Masquer l'emoji au départ
        element.addEventListener("click", () => handleClick(card));
    });

    function handleClick(card) {
        if (lockBoard || card.isFlipped || card.found) return;
        card.flip();
        card.affiche();
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            lockBoard = true;
            if (flippedCards[0].image === flippedCards[1].image) {
                flippedCards[0].found = true;
                flippedCards[1].found = true;
                flippedCards = [];
                lockBoard = false;
                if (cards.every(c => c.found)) {
                    setTimeout(() => alert('Bravo, toutes les paires sont trouvées !'), 500);
                }
            } else {
                setTimeout(() => {
                    flippedCards[0].flip();
                    flippedCards[1].flip();
                    flippedCards = [];
                    lockBoard = false;
                }, 1000);
            }
        }
    }
    function shuffle(array){
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array
    }
});