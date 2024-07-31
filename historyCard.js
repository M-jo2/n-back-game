class Card {
    constructor(x, y, width, height, figures, color, rotation, position) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.figures = figures;
        this.color = color;
        this.rotation = rotation;
        this.position = position;

        this.element = this.createElement();
    }

    createElement() {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.position = "absolute"
        cardElement.style.left = `${this.x}px`;
        cardElement.style.top = `${this.y}px`;
        cardElement.style.width = `${this.width}px`;
        cardElement.style.height = `${this.height}px`;

        const iconData = [
            { attribute: this.figures, label: 'Figures' },
            { attribute: this.color, label: 'Color' },
            { attribute: this.rotation, label: 'Rotation' },
            { attribute: this.position, label: 'Position' },
        ];

        iconData.forEach(data => {
            const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            icon.classList.add('icon', data.attribute ? 'green' : 'red');
            icon.setAttribute('viewBox', '0 0 100 100');

            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', '10');
            rect.setAttribute('y', '10');
            rect.setAttribute('width', '80');
            rect.setAttribute('height', '80');

            icon.appendChild(rect);
            cardElement.appendChild(icon);
        });

        return cardElement;
    }

    getElement() {
        return this.element;
    }

    removeElement() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

// Exemple d'utilisation
const card = new Card(100, 100, 150, 200, true, false, true, false);
console.log(card.getElement());

// Suppression de la carte après 5 secondes
setTimeout(() => {
    card.removeElement();
}, 5000);