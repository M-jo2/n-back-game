const pictureSet = [
    [[0, 2], [1, 2], [2, 2], [2, 1], [2, 0]],
    [[1, 2], [1, 0], [2, 0], [1, 1], [2, 1]],
    [[0, 0], [0, 1], [0, 2], [1, 1], [2, 1]],
    [[0, 0], [0, 1], [1, 0], [1, 1], [2, 2]]
];



const colorsSet = ["#26495c", "#c4a35c", "#3dc67d", "#e5e5dc"];
const rotationSet = [0, 90, 180, -90]
const positionSet = [
    [0, 0], [0, 1], [0, 2],
    [1, 0], [1, 1], [1, 2],
    [2, 0], [2, 1], [2, 2]
];

const history = []
var level = 1;
var goodRound = 0;
const buttonNames = ["Picture", "Color", "Rotation", "Position"];
const buttons = []
var autoLeveling = false;
const incLevel = (value) => {
    level = level + value
    document.getElementById('levelDisplay').innerText = level;
}
function createButtons(buttonNames) {
    const container = document.getElementsByClassName("button-zone")[0];


    buttonNames.forEach(name => {
        const button = document.createElement("button");
        button.id = name
        button.className = "button-action"
        fetch("./icons/" + name + ".svg")
            .then(response => response.text())
            .then(svgContent => {
                button.innerHTML = svgContent;
            })
        button.onclick = function () {
            if (this.className === "selected") {
                this.className = "";
            } else {
                this.className = "selected";
            }
        };
        container.appendChild(button);
        buttons.push(button)
    });

    const containerSkip = document.getElementsByClassName("skip-zone")[0];
    const button = document.createElement("button");
    button.id = "skip-button"
    button.textContent = "NEXT"

    button.onclick = function () {
        loadPicture()
    };

    containerSkip.appendChild(button);
}

function addPicture(element) {
    const filledCoordinates = pictureSet[Math.floor(Math.random() * pictureSet.length)];
    history[history.length - 1].picture = filledCoordinates;
    const matrix = document.createElement('div');
    matrix.classList.add('matrix');

    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            if (filledCoordinates.some(coord => coord[0] === x && coord[1] === y)) {
                cell.classList.add('filled');
                const randomDelay = Math.random() * (500 - 100) + 100; // Délai entre 100ms et 300ms
                cell.classList.add('pop-animation');
                cell.style.animationDuration = `${randomDelay}ms`;
            }

            matrix.appendChild(cell);
        }
    }
    element.appendChild(matrix);
}

function addColor(element) {
    const filledCells = Array.from(element.getElementsByClassName('filled'));
    const randomColor = colorsSet[Math.floor(Math.random() * colorsSet.length)];
    history[history.length - 1].color = randomColor;
    filledCells.forEach(cell => {
        cell.style.backgroundColor = randomColor;
    });
}

function addRotation(element) {
    const randomRotation = rotationSet[Math.floor(Math.random() * rotationSet.length)];
    history[history.length - 1].rotation = randomRotation;
    element.firstElementChild.classList.add("rotation-animation")
    element.firstElementChild.style.setProperty('--rotate-angle', `${randomRotation}deg`);
}

function addPosition(element) {
    const randomPosition = positionSet[Math.floor(Math.random() * positionSet.length)];
    history[history.length - 1].position = randomPosition

    const figureZone = document.getElementsByClassName("figures-zone")[0]
    const gridDesign = document.getElementById("grid-image-template").cloneNode(true)
    gridDesign.removeAttribute('id')
    figureZone.appendChild(gridDesign)

    element.style.position = "absolute";
    element.style.transform += " scale(0.6, 0.6)";
    element.style.top = (randomPosition[0] * 100) - 25 + "px";
    element.style.left = (randomPosition[1] * 100) - 25 + "px";
}

const refreshHistoryVisual = () => {
    const historyZone = document.getElementsByClassName("history-zone");
}

const result = () => {
    const historyZone = document.getElementsByClassName("history-zone")[0]
    historyZone.innerHTML = ''
    const levelElement = document.createElement("span")
    levelElement.innerHTML = "level : " + level + "  "
    levelElement.style.color = "white"
    levelElement.style.fontSize = "3em"
    historyZone.append(levelElement)
    if (history.length > level) {

        const lastFigure = history.length - 1;
        const matchingResult = [history[lastFigure].picture === history[lastFigure - level].picture]
        matchingResult.push(history[lastFigure].color === history[lastFigure - level].color)
        matchingResult.push(history[lastFigure].rotation === history[lastFigure - level].rotation)
        matchingResult.push(history[lastFigure].position === history[lastFigure - level].position)


        isRoundMatchingFully = true
        buttonSelected = false
        matchingResult.forEach((result, index) => {
            isMatchingButton = result === (buttons[index].className === "selected")
            color = isMatchingButton ? "green" : "red"

            if (buttonNames.includes(buttons[index].id)) {
                isRoundMatchingFully = isRoundMatchingFully && isMatchingButton 
            }
            buttonSelected = buttonSelected || buttons[index].className === "selected"
            buttons[index].style.borderColor = color
            buttons[index].style.transition = "border-color 0s";
            setTimeout(() => {
                buttons[index].style.transition = "border-color 1s ease-out";
                buttons[index].style.borderColor = "rgb(136, 136, 136)";
            }, 500);
        })

        if(isRoundMatchingFully){
            if(buttonSelected)
                goodRound = goodRound + 1;
        }else{
            goodRound = 0
        }
        

    }
    buttons.forEach((button) => {
        button.className = ""
    })
}


function loadPicture() {
    if (history.length === 0) {
        autoLeveling = document.getElementById("auto-level-increase").checked
        buttons.forEach((element, index) => {
            if (element.className === "selected" && element.id !== "Picture") {
                const index = buttonNames.indexOf(element.id);
                if (index !== -1) {
                    buttonNames.splice(index, 1);
                    element.remove()
                }
            }
        })
    }
    result()
    if (goodRound == 10 && autoLeveling) {
        goodRound = 0
        level++
    }
    const element = document.createElement('div');
    element.className = "picture";
    element.position = "absolute"
    const figureZone = document.getElementsByClassName("figures-zone")[0];

    if (!figureZone) return;

    figureZone.innerHTML = ''
    history.push({
        picture: null,
        color: null,
        rotation: null,
        position: null
    })

    addPicture(element);
    if (buttonNames.includes("Color")) addColor(element);
    if (buttonNames.includes("Rotation")) addRotation(element);

    if (buttonNames.includes("Position")) {
        const gridZone = document.createElement('div');
        gridZone.className = 'grid-zone';
        addPosition(element, gridZone);
        gridZone.appendChild(element);
        figureZone.appendChild(gridZone);
    } else {
        figureZone.appendChild(element)
    }

    //setTimeout(loadPicture,2000)
}



createButtons(buttonNames);
