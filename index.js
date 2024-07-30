const pictureSet = [
    [[0, 2], [1, 2], [2, 2], [2, 1], [2, 0]],
    [[1, 2], [1, 0], [2, 0], [1, 1], [2, 1]],
    [[0, 0], [0, 1], [0, 2], [1, 1], [2, 1]],
    [[0, 0], [0, 1], [1, 0], [1, 1], [2, 2]]
];

const colorsSet = ["darkred", "cyan", "blue", "orange", "green", "limegreen"];
const rotationSet = [0, 90, 180, 270]
const positionSet = [[0,0],[0,1],[1,0],[0,0]]
const history =[]

const buttonNames = ["Picture", "Rotation", "Color", "Position", "No Match"];

function createButtons(buttonNames, containerClass) {
    const container = document.getElementsByClassName(containerClass)[0];

    buttonNames.forEach(name => {
        const button = document.createElement("button");
        button.textContent = name;
        button.onclick = loadPicture;
        container.appendChild(button);
    });
}

function addPicture(element) {
    const filledCoordinates = pictureSet[Math.floor(Math.random() * pictureSet.length)];
    history[history.length-1].picture = filledCoordinates;
    const matrix = document.createElement('div');
    matrix.classList.add('matrix');

    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            if (filledCoordinates.some(coord => coord[0] === x && coord[1] === y)) {
                cell.classList.add('filled');
            }

            matrix.appendChild(cell);
        }
    }
    element.appendChild(matrix);
}

function addColor(element) {
    const filledCells = Array.from(element.getElementsByClassName('filled'));
    const randomColor = colorsSet[Math.floor(Math.random() * colorsSet.length)];
    history[history.length-1].color = randomColor;
    filledCells.forEach(cell => {
        cell.style.backgroundColor = randomColor;
    });
}

function addRotation(element) {
    const randomRotation = rotationSet[Math.floor(Math.random() * rotationSet.length)];
    history[history.length-1].rotation = randomRotation;
    element.style.transform = `rotate(${randomRotation}deg)`;
}

function addPosition(element, figureZone) {
    const randomPosition = positionSet[Math.floor(Math.random() * positionSet.length)];
    history[history.length-1].position = randomPosition

    element.style.position = "absolute";
    element.style.transform += " scale(0.5, 0.5)";
    element.style.top = (randomPosition[0]*150)+"px";
    element.style.left = (randomPosition[1]*150)+"px";

    const gridZone = document.createElement('div');
    gridZone.className = 'grid-zone';
    gridZone.appendChild(element);

    figureZone.appendChild(gridZone);
}

function loadPicture() {
    const element = document.createElement('div');
    element.className = "picture";

    const figureZone = document.getElementsByClassName("figures-zone")[0];
    if (!figureZone) return;

    figureZone.innerHTML = ''
    history.push({
        picture:null,
        color:null,
        rotation:null,
        position:null
    })

    addPicture(element);
    addColor(element);
    addRotation(element);
    addPosition(element, figureZone);
}

createButtons(buttonNames, "button-zone");
