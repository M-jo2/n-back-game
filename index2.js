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

const audios = [new Audio("sounds/soud_1.wav"),
    new Audio("sounds/soud_2.wav"),
    new Audio("sounds/soud_3.wav"),
    new Audio("sounds/soud_4.wav"),
    new Audio("sounds/soud_5.wav"),
    new Audio("sounds/soud_6.wav"),
    new Audio("sounds/soud_7.wav"),
    new Audio("sounds/soud_8.wav"),
    new Audio("sounds/soud_9.wav")];

let parameters = []
let history = []
var level = 1;
var goodRound = 0;
const buttonNames = ["0", "1", "2", "3"];
const buttons = []
var autoLeveling = false;

const saveMenuParameter = (event) => {
    if(event.target.type === "checkbox") localStorage.setItem(event.target.id, event.target.checked)
    else localStorage.setItem(event.target.id, event.target.value)
    loadMenuParameters()
}

const loadMenuParameters = () => {
    let params = document.getElementsByClassName("parameter")
    parameters = []
    for(let element of params){
        let value;
        let parameterValue = null

        if(element.type === "checkbox"){
            value = localStorage.getItem(element.id)
            
            if (value != null) {
                element.checked = value == "true"
                parameterValue = value == "true"
            }
        }
        else{
            value = localStorage.getItem(element.id)
            if (value != null) {
                element.value =  value
                parameterValue = value
            }
        }
        parameters.push({
                id : element.id,
                value : parameterValue == null ? 
                        (element.type === "checkbox" ? element.checked : element.value) : parameterValue});
        
    }
}

const menuVisible = (isVisible) => {
    document.getElementById("menu").style.display = isVisible ? "block" : "none";
}

const getAllOptionsSelected = () =>{
    return parameters.filter((value,index)=>{
        return value.id.includes("option-") && value.value == true
    })
}
const getAllOptionsNotSelected = () =>{
    return parameters.filter((value,index)=>{
        return value.id.includes("option-") && value.value == false
    })
}

const isOptionSelected = (idOption) =>{
    return parameters.filter((value,index)=>{
        return value.id.includes(idOption) && value.value == true
    }).length == 1
}
const getParameterValue= (idParam) =>{
    let param = parameters.filter((parameter,index)=>{
        return parameter.id == idParam
    }).at(0)
    if(param.type === "checkbox") return param.checked
    return param.value
}

function addButtons(buttonNames) {
    const container = document.getElementsByClassName("button-zone")[0];
    const numberButton = getAllOptionsSelected().length + 1
    
    for(let i=0 ; i<numberButton ; i++){
        const button = document.createElement("button");
        button.id = "button-"+i
        button.className = "button-action"
        button.innerHTML = i;
        button.onclick = function () {
            if (this.className === "selected") {
                this.className = "";
            } else {
                for(buttonToDeselect of document.getElementsByClassName("selected")){
                    buttonToDeselect.className = ""
                }
                this.className = "selected";
            }
        };
        container.appendChild(button);
        buttons.push(button)
    }
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
                cell.style.backgroundColor = "white";
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


function addSound(element) {
    const audio = audios[Math.floor(Math.random() * audios.length)];
    history[history.length - 1].sound = audio

      audio.play();
    
}

const refreshHistoryVisual = () => {
    const historyZone = document.getElementsByClassName("history-zone");
}

const result = () => {
    //afficher le niveau ici
    const historyZone = document.getElementsByClassName("history-zone")[0]
    historyZone.innerHTML = ''
    const levelElement = document.createElement("span")
    levelElement.innerHTML = "level : " + level
    levelElement.style.color = "white"
    levelElement.style.fontSize = "3em"
    historyZone.append(levelElement)

    // Valider un résultat ici
    if (history.length > level) {

        const lastFigure = history.length - 1;

        let countMatch = 0;
        countMatch += history[lastFigure].picture === history[lastFigure - level].picture ? 1 : 0
        countMatch += history[lastFigure].color === history[lastFigure - level].color ? 1 : 0
        countMatch += history[lastFigure].rotation === history[lastFigure - level].rotation? 1 : 0
        countMatch += history[lastFigure].position === history[lastFigure - level].position? 1 : 0
        countMatch += history[lastFigure].sound === history[lastFigure - level].sound? 1 : 0
        countMatch -= getAllOptionsNotSelected().length

        isRoundMatchingFully = true
        buttonSelected = false
        let correctAnswer = countMatch;
        let selectedButtons = buttons.filter(button => button.className === "selected")

        let answer = -1
        if(selectedButtons != null && selectedButtons.length > 0)
            answer = buttons.filter(button => button.className === "selected").at(0).innerHTML

        if(getParameterValue("feedback-activate"))
        {
            color = correctAnswer == answer ? "green" : "red"
            let button = document.getElementById("button-"+correctAnswer)
            if(button != null){
                button.style.borderColor = color
                button.style.transition = "border-color 0s";
                setTimeout(() => {
                    button.style.transition = "border-color 1s ease-out";
                    button.style.borderColor = "rgb(136, 136, 136)";
                }, 500);
            }
        }

        //compter ici le score avec le round
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


let inNbackPractice = false
const launchPractice=()=>{
    inNbackPractice = true;
    menuVisible(false)
    history = []
    loadPicture()

    let fullTime = 60000 * Number.parseInt(getParameterValue("end-time"))
    console.log(fullTime)
    //end of practice
    setTimeout(()=>{
        inNbackPractice=false
        menuVisible(true)
        document.getElementsByClassName("figures-zone")[0].innerHTML = ""
        document.getElementsByClassName("history-zone")[0].innerHTML = ""
        document.getElementsByClassName("button-zone")[0].innerHTML = ""
        
    },fullTime)
}


function loadPicture() {
    if(inNbackPractice){
        if (history.length === 0) {
            level = getParameterValue("nback-level")
            addButtons(buttonNames)
        }
        
        result()
        const figureZone = document.getElementsByClassName("figures-zone")[0];
        if (!figureZone) return;
    
        figureZone.innerHTML = ''
        history.push({
            picture: null,
            color: null,
            rotation: null,
            position: null
        })
    
        const element = document.createElement('div');
        element.className = "picture";
        element.position = "absolute"
        addPicture(element);
        if (isOptionSelected("option-sound")) addSound(element);
        if (isOptionSelected("option-color")) addColor(element);
        if (isOptionSelected("option-rotation")) addRotation(element);
        if (isOptionSelected("option-position")) {
            const gridZone = document.createElement('div');
            gridZone.className = 'grid-zone';
            addPosition(element, gridZone);
            gridZone.appendChild(element);
            figureZone.appendChild(gridZone);
        } 
        
        else {
            figureZone.appendChild(element)
        }
        
        setTimeout(loadPicture,getParameterValue("refresh-time-refresh"))
    }
}



//createButtons(buttonNames);
loadMenuParameters()
