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
const decisionCells = [73, 79, 82, 88, 149, 156, 203, 210, 253, 268];
const corners = [19, 25, 28, 34, 109, 113, 120, 124, 199, 205, 208, 214, 241, 244, 257, 264, 289, 304];
const nodeCells = corners.concat(decisionCells);
let validCells = [];
let cells = [];
const startingCell = 159;
let interval;
let score = 0;
let currentPacmanCell = startingCell;
const pacmanSpeed = 200;
const blinkySpeed = 300;
const blinkyStart = 156;
const blinkyScatterCell = 16;
let hadFood = true;
let hadPowerUp = false;


class Node {
    constructor(index, connectedNodes) {
        this.connectedNodes = connectedNodes;
        this.index = index;
    }

}

const nodes = {} // array containing the Node objects
const nodes2 = {}

nodes.n19 = new Node(19, { n25: 0, n73: 0 });
nodes.n25 = new Node(25, { n19: 0, n79: 0 });
nodes.n28 = new Node(28, { n34: 0, n82: 0 });
nodes.n34 = new Node(34, { n28: 0, n88: 0 });
nodes.n73 = new Node(73, { n19: 0, n79: 0, n109: 0 });
nodes.n79 = new Node(79, { n25: 0, n73: 0, n82: 0 });
nodes.n82 = new Node(82, { n28: 0, n79: 0, n88: 0 });
nodes.n88 = new Node(88, { n34: 0, n82: 0, n124: 0 });
nodes.n109 = new Node(109, { n73: 0, n113: 0 });
nodes.n113 = new Node(113, { n109: 0, n149: 0 });
nodes.n120 = new Node(120, { n124: 0, n156: 0 });
nodes.n124 = new Node(124, { n88: 0, n120: 0 });
nodes.n149 = new Node(149, { n113: 0, n156: 0, n203: 0 });
nodes.n156 = new Node(156, { n120: 0, n149: 0, n210: 0 });
nodes.n199 = new Node(199, { n203: 0, n253: 0 });
nodes.n203 = new Node(203, { n149: 0, n199: 0, n205: 0, n257: 0 });
nodes.n205 = new Node(205, { n203: 0, n241: 0 });
nodes.n208 = new Node(208, { n210: 0, n244: 0 });
nodes.n210 = new Node(210, { n156: 0, n208: 0, n214: 0, n264: 0 });
nodes.n214 = new Node(214, { n210: 0, n268: 0 });
nodes.n241 = new Node(241, { n205: 0, n244: 0 });
nodes.n244 = new Node(244, { n208: 0, n241: 0 });
nodes.n253 = new Node(253, { n199: 0, n257: 0, n289: 0 });
nodes.n257 = new Node(257, { n203: 0, n253: 0 });
nodes.n264 = new Node(264, { n210: 0, n268: 0 });
nodes.n268 = new Node(268, { n214: 0, n264: 0, n304: 0 });
nodes.n289 = new Node(289, { n253: 0, n304: 0 });
nodes.n304 = new Node(304, { n268: 0, n289: 0 });



// // Nodes g(n) distance is stored in connected notes object as a key:value pair of node name: distance
nodes2.n73 = new Node(73, { n79: 6, n149: 8 });
nodes2.n79 = new Node(79, { n73: 6, n82: 3 });
nodes2.n82 = new Node(82, { n79: 3, n88: 6 });
nodes2.n88 = new Node(88, { n82: 6, n156: 8 });
nodes2.n149 = new Node(149, { n73: 8, n156: 11, n203: 3 });
nodes2.n156 = new Node(156, { n88: 8, n149: 11, n210: 3 });
nodes2.n203 = new Node(203, { n149: 3, n210: 7, n253: 7 });
nodes2.n210 = new Node(210, { n156: 3, n203: 7, n268: 7 });
nodes2.n253 = new Node(253, { n203: 7, n268: 19 });
nodes2.n268 = new Node(268, { n210: 7, n253: 19 });




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
    direction;
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


function setUp() {
    // Create grid
    for (i = 0; i < cellCount; i++) {

        // Create and append all cells
        const cell = document.createElement('div');
        cell.style.height = `${100 / rows}%`;
        cell.style.width = `${100 / cols}%`;
        // if (decisionCells.includes(i)) {
        //     cell.innerText = i;
        // }

        cell.dataset.index = i;
        cell.dataset.col = i % cols;
        cell.dataset.row = Math.floor(i / cols);

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


    // calc direction between nodes.
    for (i = 0; i < Object.keys(nodes).length; i++) {
        const nodeId = Object.keys(nodes)[i]
        const index = nodes[nodeId].index;

        const connects = nodes[nodeId].connectedNodes;
        for (j = 0; j < Object.keys(connects).length; j++) {
            const cellId = Object.keys(connects)[j]
            const cell = nodes[cellId].index;

            let distance;
            if (cells[index].dataset.row === cells[cell].dataset.row) {
                if (index === 149 && cell === 156 || index === 156 && cell === 149) {
                    distance = 11;
                } else {
                    distance = Math.abs(index - cell);
                }
            } else {
                distance = Math.abs((index - cell) / cols);
            }

            nodes[nodeId].connectedNodes[cellId] = distance;
        }
    }

    console.log(nodes)

}

// Moves pacman in current direction
function pacmanMove(direction) {
    // Finds correct image class 
    const relevantClass = findDirectionClass(direction);
    // Moves pacman at {pacmanSpeed} speed
    interval = setInterval(() => {

        // Finds the next cell to move to
        let nextCell = findNextCell(direction, currentPacmanCell);
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
        console.log("Error in cell calculation");

    }
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



// callback function for blinky.chase
function blinkyChase(direction) {
    let prevCell = blinky.currentCell;

    // Move - starting direction right (1)
    let interval = setInterval(() => {

        blinky.direction = direction;
        prevCell = blinky.currentCell;
        let nextCell;

        // Prevent ghosts from turning around on corners
        if (corners.includes(prevCell)) {
            const [d, n] = handleCorners(direction, blinky, interval);
            nextCell = n;
            direction = d;
        } else if (nodeCells.includes(prevCell)) {
            const index = prevCell;
            const target = calcTargetCell(blinky);
            const bestNode = astar(`n${index}`, target)
            const [c, d] = nextCellComplex(direction, index, bestNode);

            nextCell = c;
            direction = d;
        } else {
            nextCell = findNextCell(direction, blinky.currentCell);

        }


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
            console.log("FAILED VALIDITY")
        }

    }, blinky.speed);

};

// Turns ghosts on corners with no choice
function handleCorners(direction, ghost, interval) {
    let nextCell;

    if (direction === 1 || direction === 3) {
        direction = 0
        nextCell = findNextCell(direction, ghost.currentCell)
        if (!isValidCell(nextCell)) {
            direction = 2;
            nextCell = findNextCell(direction, ghost.currentCell);
        }


    } else {
        direction = 1;
        nextCell = findNextCell(direction, ghost.currentCell);
        if (!isValidCell(nextCell)) {
            direction = 3;
            nextCell = findNextCell(direction, ghost.currentCell);
        }

    }
    // clear interval and start chase again

    //clearInterval(interval);
    //ghost.chase(direction);
    return [direction, nextCell]
}

// Calc ghost target cell
function calcTargetCell(ghost) {
    let targetCell;
    if (ghost === blinky) {
        targetCell = currentPacmanCell;
    }

    return targetCell;
}


function nextCellComplex(direction, index, bestNode) {
    let nextCell;
    if (cells[index].dataset.col === cells[bestNode].dataset.col) {
        if (Number(cells[index].dataset.row) > Number(cells[bestNode].dataset.row)) {

            direction = 0;
        } else {
            direction = 2;
        };
    }
    // same row
    if (cells[index].dataset.row === cells[bestNode].dataset.row) {
        if (Number(cells[index].dataset.col) < Number(cells[bestNode].dataset.col)) {
            if (index === 149) {
                direction = 3;
            } else {
                direction = 1;
            }
        } else {
            if (index === 156) {
                direction = 1;
            } else {
                direction = 3
            }
        }
    }



    nextCell = findNextCell(direction, index)
    console.log("DIRECTION " + direction)
    console.log("CURRENT CELL: " + blinky.currentCell)
    console.log("NEXTCELL: " + nextCell)
    return [nextCell, direction]
}



function pathfinder(node, target) {
    const gnVals = {};
    let nextNode;
    console.log("Start node: " + node)
    console.log("Target:" + target)
    const connNodes = nodes[node].connectedNodes;

    console.log("connecting Nodes: ")
    console.log(connNodes)
    let iteration = 1;
    // Iterate through connecting nodes
    for (i = 0; i < Object.keys(connNodes).length; i++) {
        console.log("iteration:" + iteration)
        const nodeName = Object.keys(connNodes)[i];
        const nodeIndex = nodes[nodeName].index;
        let data = {};
        let gN = connNodes[nodeName];
        let neighbours = nodes[nodeName].connectedNodes;
        console.log(`neighbours of ${nodeName}:`)
        console.log(neighbours);
        delete neighbours[node];
        iteration++
        fnVals = {};
        for (j = 0; j < Object.keys(neighbours).length; j++) {
            let neighbourName = Object.keys(neighbours)[j];
            if (neighbourName === node) {
                continue;
            }

            let index = nodes[neighbourName].index;
            neighbours[neighbourName] += gN;
            let hN = calcHeuristicVal(index, target)
            let fN = neighbours[neighbourName] + hN;
            console.log(`f(n) for ${neighbourName}: ${fN}`);
            fnVals[neighbourName] = fN;
            console.log("FNVALS:")
            console.log(fnVals)
            let bestNode;
        }

        if (Object.keys(fnVals).length === 1) {
            bestNode = Object.keys(fnVals)[0]
        } else {
            let entries = Object.entries(fnVals);
            console.log("entries: " + entries[0])
            bestNode = entries.reduce((a, b) => a[1] > b[1] ? b[0] : a[0]);
        }

        console.log("!!!!!!!!!! BEST NODE: " + bestNode)
        while (bestNode !== `n${target}`) {
            console.log("BESTNODE: " + bestNode, "TARGET: " + `n${target}`)
            pathfinder(bestNode, target)
        }
    }


}


setUp()
// blinkyChase(3)
//pacmanMove(3)





console.log(getGn());







function astar(node, target) {
    let fnVals = {}; // obj of f(n) values for each node to target 
    let gnVals = {};
    let hnVals = {};
    const cNodes = nodes[node].connectedNodes; // object of nodes:distances
    console.log(`Possible Nodes: `);
    console.log(cNodes)
    for (i = 0; i < Object.keys(cNodes).length; i++) {
        const connNode = Object.keys(cNodes)[i] // node name
        const index = nodes[connNode].index; // 'i'th node in connected nodes list, get index
        const hN = calcHeuristicVal(index, target);   // h(n) of node to target
        const gN = cNodes[connNode]; //distance
        const fN = hN + gN;
        gnVals[index] = gN;
        hnVals[index] = hN;
        fnVals[index] = fN;
    }
    console.log("TARGET: " + target)
    console.log("gnVals:")
    console.log(gnVals)
    console.log("hnVals:")
    console.log(hnVals)
    console.log("fnVals:")
    console.log(fnVals)

    // assess pacman node
    let gnPacman = getGn()

    let entries = Object.entries(fnVals);
    let lowest = entries.reduce((a, b) => a[1] >= b[1] ? b : a);
    console.log("BEST NODE: " + lowest[0])
    return lowest[0]; // Node to go towards
}

function getGn() {
    console.log(currentPacmanCell)
    const adjacentCells = [currentPacmanCell - rows, currentPacmanCell + 1, currentPacmanCell + rows, currentPacmanCell - 1]
    const validDirections = adjacentCells.map(cell => isValidCell(cell) ? true : false); // up, down, right, left
    let distances = {}
    console.log(validDirections)
    if (validDirections[0]) {

        let cell = currentPacmanCell - rows;
        while (!nodeCells.includes(cell)) {
            cell -= rows;
        }

        const distanceToNode = (currentPacmanCell - cell) / rows;
        distances[cell] = distanceToNode;
    }
    if (validDirections[1]) {
        let cell = currentPacmanCell + 1;
        while (!nodeCells.includes(cell)) {
            if (cell === 161) {
                i = 144;
            }
            cell += 1;
        }

        const distanceToNode = cell - currentPacmanCell;
        distances[cell] = distanceToNode;
    }
    if (validDirections[2]) {

        let cell = currentPacmanCell + rows;
        while (!nodeCells.includes(cell)) {
            console.log(cell)

            cell += rows;
        }

        const distanceToNode = (cell - currentPacmanCell) / rows;
        distances[cell] = distanceToNode;
    }
    if (validDirections[3]) {
        let cell = currentPacmanCell - 1;
        while (!nodeCells.includes(cell)) {
            if (cell === 144) {
                i = 161;
            }
            cell -= 1;

        }

        const distanceToNode = (currentPacmanCell - cell);
        distances[cell] = distanceToNode;
    }
    let entries = Object.entries(distances);
    let closestNodeAndDistance = entries.reduce((a, b) => a[1] > b[1] ? b : a)

    return closestNodeAndDistance

}

// Calc Euclidian distance between ghost and pacman
function calcHeuristicVal(node, target) {
    let position = cells[target].dataset.col - cells[node].dataset.col;
    let vert;
    // If target is to the left of the node we need to ceil the vert distance, otherwise floor
    if (position >= 0) {
        vert = Math.floor((target - node) / rows);
    } else {

        vert = Math.ceil((target - node) / rows);
    }

    // Calc the cell in pacman's row and ghost's column
    let cellInRow = node + (rows * vert);

    let horiz = target - cellInRow;


    let h2 = vert ** 2 + horiz ** 2;
    return Math.sqrt(h2);
}




