// Game container
const container = document.querySelector('.container');

// Initialising variables
const cols = 18;
const rows = 18;
const cellCount = cols * rows;
const invalidCells = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
    26, 27, 35, 36, 38, 39, 40, 41, 42, 44, 45, 47, 48, 49, 50, 51, 53, 54, 56, 57, 58,
    59, 60, 62, 63, 65, 66, 67, 68, 69, 71, 72, 89, 90, 92, 93, 94, 95, 96, 97, 98, 99,
    100, 101, 102, 103, 104, 105, 107, 108, 114, 119, 125, 126, 127, 128, 129, 130, 132,
    134, 135, 137, 139, 140, 141, 142, 143, 152, 153, 162, 163, 164, 165, 166, 168, 173,
    175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 186, 187, 188, 189, 190, 191, 193,
    194, 195, 196, 197, 198, 206, 207, 215, 216, 218, 219, 220, 222, 224, 225, 227, 229,
    230, 231, 233, 234, 236, 237, 238, 240, 245, 247, 248, 249, 251, 252, 258, 259, 260,
    261, 262, 263, 269, 270, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283,
    284, 285, 287, 288, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317,
    318, 319, 320, 321, 322, 323]

const homeCells = [115, 116, 117, 118, 133, 136, 150, 151, 154, 155, 169, 170, 171, 172];
const powerUpCells = [19, 34, 289, 304];
let validCells = [];
let cells = [];
const startingCell = 205;
let interval;
let score = 0;
let currentPacmanCell = startingCell;
const pacmanSpeed = 200;
const blinkySpeed = 300;
const blinkyStart = 149;
const blinkyScatterCell = 16;
let hadFood = true;
let hadPowerUp = false;


// Ghost class for storing variables and chase, frightened and scatter movement methods
class Ghost {
    constructor(name, speed, startingCell, chase, cssClass, scatterCell) {
        this.name = name;
        this.speed = speed;
        this.startingCell = startingCell;
        this.chase = chase;
        this.cssClass = cssClass;
        this.scatterCell = scatterCell;
        this.currentCell = startingCell;

    }

    frightened() {

    }

    scatter(scatterCell) {

    }
}

// Chase object for storing individual movement mechanics during chase mode 
const Chase = {
    blinky: blinkyChase,
    inky: () => { },
    pinky: () => { },
    clyde: () => { }
};

// Blinky object
const blinky = new Ghost('blinky', blinkySpeed, blinkyStart, Chase.blinky, 'blinky', blinkyScatterCell)



// Create grid
for (i = 0; i < cellCount; i++) {

    // Create and append all cells
    const cell = document.createElement('div');
    cell.style.height = `${100 / rows}%`;
    cell.style.width = `${100 / cols}%`;
    cell.dataset.index = i;
    cell.dataset.col = i % cols === 0 ? 1 : i % cols;
    cell.innerText = i;

    container.append(cell);


    if (!invalidCells.includes(i)) {
        // Ignore home cells and invalid cells, add food
        if (!homeCells.includes(i)) {
            validCells.push(i);
            if (!powerUpCells.includes(i) && i !== blinkyStart) {
                cell.classList.add("food");
            }
        }
    } // Style invalid cells 
    else {
        cell.style.backgroundColor = "grey";
        cell.style.border = "1px solid black";
    }

    // Add power ups to designated cells
    if (powerUpCells.includes(i)) {
        cell.classList.add('power-up');
    }
    // Place pacman to start
    if (i === startingCell) {
        cell.classList.remove('food');
        cell.classList.add('pacman-left');
    };

    if (i === blinkyStart) {
        cell.classList.add('blinky');;
    }
    // Create array of all cells
    cells.push(cell);
}

//console.log(cells)

// Moves pacman in current direction
function pacmanMove(direction) {
    // Finds correct image class 
    const relevantClass = findDirectionClass(direction);
    // Moves pacman at {pacmanSpeed} speed
    interval = setInterval(() => {
        console.log(`Current Cell: ${currentPacmanCell} + Blinky Cell: ${blinky.currentCell} + Heuristic: ${calcHeuristicVal(blinky)}`);

        // Finds the next cell to move to
        let nextCell = findNextCell(direction, currentPacmanCell);
        //console.log(nextCell)
        // Ensures next cell is valid to enter
        if (isValidCell(nextCell)) {
            // Deletes pacman from cell when leaving
            if (cells[currentPacmanCell].classList.contains(relevantClass)) {
                cells[currentPacmanCell].classList.remove(relevantClass);
            }
            if (cells[nextCell].classList.contains('power-up')) {
                cells[nextCell].classList.remove('power-up');
                score += 500;
                // frighten()
            } else if (cells[nextCell].classList.contains('food')) {
                cells[nextCell].classList.remove('food');
                score = + 100;
            };

            cells[nextCell].classList.add(relevantClass);
            currentPacmanCell = nextCell;

        }

        // if (levelComplete()){

        // }

    }, pacmanSpeed);
};


// Helper to check cell validity
function isValidCell(cell) {
    if (validCells.includes(cell)) return true;
}


// Calculates next cell based on current direction
function findNextCell(direction, currentCell) {
    let nextCell;
    //console.log("current cell: " + currentCell)

    // Left
    if (direction === 3) {
        if (currentCell === 144) {
            nextCell = 161;
        } else {
            nextCell = currentCell - 1;
        }
    }
    // Down
    else if (direction === 2) {
        nextCell = currentCell + 18;
    }
    // Right 
    else if (direction === 1) {
        if (currentCell === 161) {
            nextCell = 144;
        } else {
            nextCell = currentCell + 1;
        }
    }
    // Up
    else if (direction === 0) {
        nextCell = currentCell - 18;
    }
    // Error
    else {
        console.log(nextCell)
        console.log("Error in cell calculation");

    }
    //console.log("NEXT: " + nextCell)
    return nextCell;
}


// Helper function for updating image
function findDirectionClass(direction) {
    if (direction === 0) {
        return "pacman-up";
    } else if (direction === 1) {
        return "pacman-right";
    } else if (direction === 2) {
        return "pacman-down";
    } else if (direction === 3) {
        return "pacman-left";
    } else {
        console.log("Error in directon");
    }
}

function frighten() {

}

function levelComplete() {
    // check if all food is eaten (no food or power-up classes remain in any cell)
}
// Callback function for keydown handler
function handleKeyDown(e) {

    // Get direction
    let direction;
    if (e.key === "ArrowUp") {
        direction = 0;
    } else if (e.key === "ArrowRight") {
        direction = 1;
    } else if (e.key === "ArrowDown") {
        direction = 2
    } else if (e.key === "ArrowLeft") {
        direction = 3
    } else {
        return
    }

    // Find next Cell
    const nextCell = findNextCell(direction, currentPacmanCell)
    if (!isValidCell(nextCell)) {
        return
    }

    // Remove pacman from previous cell and add new direction class 
    // Necessary, as the pacmanMove function won't find the class after the direction has been changed
    cells[currentPacmanCell].removeAttribute('class')
    cells[currentPacmanCell].classList.add(findDirectionClass(direction))

    // Clear the previous interval and begin a new one in new direction
    clearInterval(interval)
    pacmanMove(direction);
}


// Keydown event listener
document.addEventListener('keydown', handleKeyDown);


pacmanMove(3);
blinky.chase(1);



// callback function for blinky.chase
function blinkyChase(direction) {
    let prevCell = blinky.currentCell;
    // keep track of whether there was food or powerups in previous cell, to replace them
    // Move - starting direction right (1)
    let interval = setInterval(() => {
        console.log(calcHeuristicVal(blinky));
        prevCell = blinky.currentCell;
        let nextCell = findNextCell(direction, blinky.currentCell);

        if (isValidCell(nextCell)) {
            // replace food and power ups after blinky passed through
            if (hadFood) {
                cells[prevCell].classList.add('food');
                hadFood = false;
            }

            if (hadPowerUp) {
                cells[prevCell].classList.add('power-up');
                hadPowerUp = false;
            }

            cells[blinky.currentCell].classList.remove(blinky.cssClass);

            if (cells[nextCell].classList.contains('food')) {
                cells[nextCell].classList.remove('food');
                hadFood = true;
            } else if (cells[nextCell].classList.contains('power-up')) {
                cells[nextCell].classList.remove('power-up');
                hadPowerUp = true;
                prevCell = blinky.currentCell;
            }

            cells[nextCell].classList.add(blinky.cssClass);
            blinky.currentCell = nextCell;

        } else {
            handleCorners(direction, blinky, interval);

        }
    }, blinky.speed);

};

// Turns ghosts on corners with no choice
function handleCorners(direction, ghost, interval) {
    let randNum = Math.floor(Math.random() * 4);
    // if direction is up or down, try left, else right
    if (direction === 0 || direction === 2) {

        while (randNum === 0 || randNum === 2) {
            randNum = Math.floor(Math.random() * 4);
        }
        direction = randNum;
        let nextCell = findNextCell(direction, ghost.currentCell);
        if (!isValidCell(nextCell)) {
            if (direction === 3) {
                direction = 1;
            } else {
                direction = 3;
            }
        };
    }
    // if direction is left or right, try down, else up
    else {
        while (randNum === 1 || randNum === 3) {
            randNum = Math.floor(Math.random() * 4);
        }
        direction = randNum;
        let nextCell = findNextCell(direction, ghost.currentCell)
        if (!isValidCell(nextCell)) {
            if (direction === 2) {
                direction = 0;
            } else {
                direction = 2;
            }
        };
    }
    // clear interval and start chase again

    clearInterval(interval);
    ghost.chase(direction);
}

// Calc ghost target cell
function calcTargetCell(ghost) {
    let targetCell;
    if (ghost === blinky) {
        targetCell = currentPacmanCell;
    }
}

function astar() {

}

// Calc Euclidian distance between ghost and pacman
function calcHeuristicVal(ghost) {

    let position = cells[currentPacmanCell].dataset.col - cells[ghost.currentCell].dataset.col;
    console.log(position)
    let vert;
    // If pacman is to the left of the ghost we need to ceil the vert distance, otherwise floor
    if (position >= 0) {
        vert = Math.floor((currentPacmanCell - ghost.currentCell) / rows);
    } else {

        vert = Math.ceil((currentPacmanCell - ghost.currentCell) / rows);
    }
    console.log("VERT: " + vert)
    // Calc the cell in pacman's row and ghost's column
    let cellInRow = ghost.currentCell + (rows * vert);
    console.log("CEll in row: " + cellInRow);
    let horiz = currentPacmanCell - cellInRow;
    console.log("HORIZ: " + horiz)

    let h2 = vert ** 2 + horiz ** 2;
    return Math.sqrt(h2);
}


