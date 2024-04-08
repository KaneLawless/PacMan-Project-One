// Game container and start button
const container = document.querySelector('.container');
const body = document.querySelector("body")
let startButton = document.querySelector(".start-button")


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

let startingHtml;
let scoreBox;
let restartButton;
const startingCell = 205;
let currentPacmanCell = startingCell;
const pacmanSpeed = 200;
let pacmanDirection;

let pacmanInterval;
let score = 0;


const blinkySpeed = 300;
const blinkyStart = 110;
const blinkyScatterCell = 19;

const pinkySpeed = 300;
const pinkyStart = 172;
const pinkyScatterCell = 34;

const clydeSpeed = 300
const clydeStart = 118;
const clydeScatterCell = 289;

const inkySpeed = 300;
const inkyStart = 115;
const inkyScatterCell = 304;


let startingFood = 0;
let foodEaten = 0;
let prevNode;
let gameState;



class Node {
    constructor(index, connectedNodes) {
        this.connectedNodes = connectedNodes;
        this.index = index;
    }

}

const nodes = {} // array containing the Node objects

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


// Ghost class for storing variables and chase, frightened and scatter movement methods
class Ghost {
    constructor(name, speed, startingCell, chase, cssClass, scatterCell, startDirection) {
        this.name = name;
        this.speed = speed;
        this.startingCell = startingCell;
        this.chase = chase;
        this.cssClass = cssClass;
        this.scatterCell = scatterCell;
        this.currentCell = startingCell;
        this.startDirection = startDirection
        this.direction = startDirection;

    }
    interval;

}

// Chase object for storing individual movement mechanics during chase mode 
const Chase = {
    blinky: chase,
    inky: chase,
    pinky: chase,
    clyde: chase,
};

// Ghost objects
const blinky = new Ghost('blinky', blinkySpeed, blinkyStart, Chase.blinky, 'blinky', blinkyScatterCell, 1);

const pinky = new Ghost('pinky', pinkySpeed, pinkyStart, Chase.pinky, 'pinky', pinkyScatterCell, 1);

const inky = new Ghost('inky', inkySpeed, inkyStart, Chase.inky, 'inky', inkyScatterCell, 1);

const clyde = new Ghost('clyde', clydeSpeed, clydeStart, Chase.clyde, 'clyde', clydeScatterCell, 1);

let ghosts = [blinky, pinky, clyde, inky]

function setUp() {
    container.style.backgroundColor = "white";
    // Create grid
    for (i = 0; i < cellCount; i++) {

        // Create and append all cells
        const cell = document.createElement('div');
        cell.style.height = `${100 / rows}%`;
        cell.style.width = `${100 / cols}%`;


        cell.dataset.index = i;
        cell.dataset.col = i % cols;
        cell.dataset.row = Math.floor(i / cols);

        cell.innerText = i;

        container.append(cell);


        if (!invalidCells.includes(i)) {
            // Ignore home cells and invalid cells, add food
            if (!homeCells.includes(i)) {
                validCells.push(i);

                if (!powerUpCells.includes(i)) {
                    cell.classList.add("food");
                    startingFood++;
                }
            }
        } // Style invalid cells 
        else {
            cell.style.backgroundColor = "#0133ff";
            cell.style.border = "1px solid black";
        }

        //Add power ups to designated cells
        if (powerUpCells.includes(i)) {
            cell.classList.add('power-up');
        }
        // Place pacman to start
        if (i === startingCell) {
            cell.classList.remove('food');
            startingFood--
            cell.classList.add('pacman-left');
        };

        ghosts.forEach((ghost) => {
            if (i === ghost.startingCell) {
                cell.classList.add(ghost.cssClass);;
            }
        })

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

    console.log(nodes);

    document.addEventListener('keydown', handleKeyDown);
    startButton.addEventListener("click", handleStart)


    ghosts.forEach((ghost) => {
        console.log(ghost)

    })
}
// Moves pacman in current direction
function pacmanMove(direction) {
    // Finds correct image class 
    const relevantClass = findDirectionClass(direction);
    // Moves pacman at {pacmanSpeed} speed
    pacmanInterval = setInterval(() => {

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
                score += 250;
                updateScore();

                frighten()
            } else if (cells[nextCell].classList.contains('food')) {
                cells[nextCell].classList.remove('food');
                foodEaten++;
                score += 100;
                updateScore()
                if (foodEaten === startingFood) {
                    alert(`LEVEL COMPLETE! Score: ${score}`);
                }
            };

            cells[nextCell].classList.add(relevantClass);
            currentPacmanCell = nextCell;

        }

        if (gameState !== 1)
            ghosts.forEach(ghost => {
                if (cells[ghost.currentCell].classList.contains(relevantClass)) {
                    clearInterval(pacmanInterval)
                    ghosts.forEach(ghost => {
                        clearInterval(ghost.interval)
                    })
                    gameOver();
                }
            })

        if (gameState === 1) {
            ghosts.forEach(ghost => {
                if (cells[ghost.currentCell].classList.contains(relevantClass)) {
                    clearInterval(ghost.interval);
                    cells[ghost.currentCell].classList.remove('frightened');
                    ghost.currentCell = ghost.startingCell;
                    ghost.direction = ghost.startDirection;
                    cells[ghost.startingCell].classList.add(ghost.cssClass);
                    score += 500;
                    updateScore()
                }
            })
        }




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
        console.log()
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
    pacmanDirection = direction;
    clearInterval(pacmanInterval)
    pacmanMove(direction);
}


// Keydown event listener
let keydownListener = document.addEventListener('keydown', handleKeyDown);
startButton.addEventListener("click", handleStart)




// callback function for blinky.chase
function chase(ghost, direction) {

    gameState = 0;
    let prevCell = ghost.currentCell;
    let hadFood;
    let hadPowerUp;

    // Move - starting direction right (1)
    ghost.interval = setInterval(() => {
        ghost.direction = direction;
        prevCell = ghost.currentCell;
        let nextCell;

        // Prevent ghosts from turning around on corners
        if (corners.includes(prevCell)) {
            const [d, n] = handleCorners(direction, ghost);
            nextCell = n;
            direction = d;
        } else if (nodeCells.includes(prevCell)) {
            const index = prevCell;
            const target = calcTargetCell(ghost);
            const bestNode = astar(`n${index}`, target)
            const [c, d] = nextCellComplex(direction, index, bestNode);

            nextCell = c;
            direction = d;
        } else {

            nextCell = findNextCell(direction, ghost.currentCell);


        }


        if (isValidCell(nextCell)) {

            // replace food and power ups after blinky passed through
            if (hadFood) {
                if (validCells.includes(prevCell)) {
                    cells[prevCell].classList.add('food');
                }
                hadFood = false;
            }

            if (hadPowerUp) {
                cells[prevCell].classList.add('power-up');
                hadPowerUp = false;
            }

            cells[ghost.currentCell].classList.remove(ghost.cssClass);

            if (cells[nextCell].classList.contains('food')) {
                cells[nextCell].classList.remove('food');
                hadFood = true;
            } else if (cells[nextCell].classList.contains('power-up')) {
                cells[nextCell].classList.remove('power-up');
                hadPowerUp = true;
                prevCell = ghost.currentCell; // for reversing?
            }

            cells[nextCell].classList.add(ghost.cssClass);
            ghost.currentCell = nextCell;
            ghost.direction = direction
            if (ghost.currentCell === currentPacmanCell) {
                // game over
                ghosts.forEach(ghost => {
                    clearInterval(ghost.interval)
                })
                clearInterval(pacmanInterval);
                gameOver()


            }
        } else {
            // console.log("FAILED VALIDITY")
            // console.log("direction:" + ghost.direction)
            // console.log("current cell: " + ghost.currentCell)
            // console.log("next cell: " + nextCell)
            // console.log("ghost:" + ghost.name)
        }

    }, ghost.speed);

};



function frighten() {
    gameState = 1;

    ghosts.forEach((ghost) => {
        if (ghost.interval) {
            if (ghost.direction === 0) {
                ghost.direction = 2;
            } else if (ghost.direction === 1) {
                ghost.direction = 3;
            } else if (ghost.direction === 2) {
                ghost.direction = 0;
            } else {
                ghost.direction = 1
            }

            let hadFood;
            let hadPowerUp;
            let prevCell;
            clearInterval(ghost.interval);
            ghost.interval = setInterval(() => {

                prevCell = ghost.currentCell;
                let nextCell = findNextCell(ghost.direction, ghost.currentCell);
                if (nodeCells.includes(nextCell)) {
                    let rand = Math.floor(Math.random() * 4);
                    while (!(isValidCell(findNextCell(rand, nextCell)))) {
                        rand = Math.floor(Math.random() * 4);
                    }
                    ghost.direction = rand;
                }

                if (isValidCell(nextCell)) {

                    if (hadFood) {
                        if (validCells.includes(prevCell)) {
                            cells[prevCell].classList.add('food');
                        }
                        hadFood = false;
                    }

                    if (hadPowerUp) {
                        cells[prevCell].classList.add('power-up');
                        hadPowerUp = false;
                    }

                    cells[ghost.currentCell].classList.remove('frightened');
                    cells[ghost.currentCell].classList.remove(ghost.cssClass);

                    if (cells[nextCell].classList.contains('food')) {
                        cells[nextCell].classList.remove('food');
                        hadFood = true;
                    } else if (cells[nextCell].classList.contains('power-up')) {
                        cells[nextCell].classList.remove('power-up');
                        hadPowerUp = true;

                    }


                    cells[nextCell].classList.add('frightened');
                    //prevCell = ghost.currentCell;
                    ghost.currentCell = nextCell;

                    nextCell = findNextCell(ghost.direction, ghost.currentCell)
                    if (cells[currentPacmanCell].classList.contains(ghost.cssClass)) {
                        clearInterval(ghost.interval);
                        cells[ghost.currentCell].classList.remove('frightened');
                        ghost.currentCell = ghost.startingCell;
                        ghost.direction = ghost.startDirection;
                        cells[ghost.startingCell].classList.add(ghost.cssClass);
                        score += 1000
                        setTimeout(() => chase(ghost, ghost.startDirection), 1000)

                    }
                } else {
                    console.log("direction before fail: " + ghost.direction)
                    console.log("CELL BEFORE FAIL: " + ghost.currentCell)
                    console.log("FAILED VALIDITY " + nextCell)
                }



            }, ghost.speed);

            timeout = setTimeout(() => {
                cells[ghost.currentCell].classList.remove("frightened");
                clearInterval(ghost.interval);
                chase(ghost, ghost.direction)
            }, 6000
            )
        }
    })

}

// Turns ghosts on corners with no choice
function handleCorners(direction, ghost) {
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
    return [direction, nextCell]
}

// Calc ghost target cell
function calcTargetCell(ghost) {
    let targetCell;
    if (ghost === blinky) {
        targetCell = currentPacmanCell;
    }

    // 3 cells ahead of pacman -> tries to cut him off
    if (ghost === pinky) {
        if (pacmanDirection === 0) {
            targetCell = currentPacmanCell - (3 * rows)
        } else if (pacmanDirection === 1) {
            targetCell = currentPacmanCell + 3;
        } else if (pacmanDirection === 2) {
            targetCell = (3 * rows) + currentPacmanCell
        } else {

            targetCell = currentPacmanCell - 3;
        }
        let nearRight = [currentPacmanCell + 1, currentPacmanCell + 2, currentPacmanCell + 3];
        let nearLeft = [currentPacmanCell - 1, currentPacmanCell - 2, currentPacmanCell - 3];
        let nearUp = [currentPacmanCell - rows, currentPacmanCell - (rows * 2), currentPacmanCell - (rows * 3)];
        let nearDown = [currentPacmanCell + rows, currentPacmanCell + (rows * 2), currentPacmanCell + (rows * 3)];
        let nearCells = nearRight.concat(nearLeft, nearUp, nearDown);
        if (nearCells.includes(targetCell)) {
            targetCell = currentPacmanCell;
        }



    }
    if (ghost === clyde) {
        const pacGn = getGn(nodes[`n${ghost.currentCell}`].connectedNodes, `n${ghost.currentCell}`);
        if (pacGn < 8) {
            targetCell = currentPacmanCell;
        } else {
            targetCell = clyde.scatterCell;
        }
    }

    if (ghost === inky) {
        // alternate betwen random cell and pacman cell
        const rand = Math.floor(Math.random() * 2);
        if (rand === 0) {
            targetCell = currentPacmanCell;
        } else {
            targetCell = Math.floor(Math.Random() * cells.length);
        }
    }

    return targetCell;
}


function nextCellComplex(direction, index, bestNode) {
    let nextCell;

    if (bestNode[0] === "n") {
        bestNode = bestNode.substring(1)
    }

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

    return [nextCell, direction]
}



// function pathfinder(node, target) {
//     const gnVals = {};
//     let nextNode;
//     console.log("Start node: " + node)
//     console.log("Target:" + target)
//     const connNodes = nodes[node].connectedNodes;

//     console.log("connecting Nodes: ")
//     console.log(connNodes)
//     let iteration = 1;
//     // Iterate through connecting nodes
//     for (i = 0; i < Object.keys(connNodes).length; i++) {
//         console.log("iteration:" + iteration)
//         const nodeName = Object.keys(connNodes)[i];
//         const nodeIndex = nodes[nodeName].index;
//         let data = {};
//         let gN = connNodes[nodeName];
//         let neighbours = nodes[nodeName].connectedNodes;
//         console.log(`neighbours of ${nodeName}:`)
//         console.log(neighbours);
//         delete neighbours[node];
//         iteration++
//         fnVals = {};
//         for (j = 0; j < Object.keys(neighbours).length; j++) {
//             let neighbourName = Object.keys(neighbours)[j];
//             if (neighbourName === node) {
//                 continue;
//             }

//             let index = nodes[neighbourName].index;
//             neighbours[neighbourName] += gN;
//             let hN = calcHeuristicVal(index, target)
//             let fN = neighbours[neighbourName] + hN;
//             console.log(`f(n) for ${neighbourName}: ${fN}`);
//             fnVals[neighbourName] = fN;
//             console.log("FNVALS:")
//             console.log(fnVals)
//             let bestNode;
//         }

//         if (Object.keys(fnVals).length === 1) {
//             bestNode = Object.keys(fnVals)[0]
//         } else {
//             let entries = Object.entries(fnVals);
//             console.log("entries: " + entries[0])
//             bestNode = entries.reduce((a, b) => a[1] > b[1] ? b[0] : a[0]);
//         }

//         console.log("!!!!!!!!!! BEST NODE: " + bestNode)
//         while (bestNode !== `n${target}`) {
//             console.log("BESTNODE: " + bestNode, "TARGET: " + `n${target}`)
//             pathfinder(bestNode, target)
//         }
//     }


// }


//setUp()
// chase(blinky, 1)
// chase(pinky, 1)
// pacmanMove(3)




function astar(node, target) {
    let fnVals = {}; // obj of f(n) values for each node to target 
    let gnVals = {};
    let hnVals = {};
    const cNodes = new Object(nodes[node].connectedNodes); // object of nodes:distances
    // console.log("CURRENT NODE BEING EVALUATED: " + node)
    let cNodesArray = Object.keys(cNodes)
    if (cNodesArray.includes(prevNode)) {
        let idx = cNodesArray.indexOf(prevNode)
        cNodesArray.splice(idx, 1)
    }

    // console.log(`Possible Nodes: `);
    // console.log(cNodes)

    prevNode = String(node);


    for (i = 0; i < cNodesArray.length; i++) {
        const connNode = cNodesArray[i] // node name
        const index = nodes[connNode].index; // 'i'th node in connected nodes list, get index
        const hN = calcHeuristicVal(index, target);   // h(n) of node to target
        const gN = cNodes[connNode]; //distance
        const fN = hN + gN;
        gnVals[index] = gN;
        hnVals[index] = hN;
        fnVals[index] = fN;
    }
    // console.log("gnVals:")
    // console.log(gnVals)
    // console.log("hnVals:")
    // console.log(hnVals)
    // console.log("fnVals:")
    // console.log(fnVals)

    //assess pacman node
    if (target === currentPacmanCell) {
        let gnPacman = getGn(cNodes, node)
        fnVals[`n${currentPacmanCell}`] = gnPacman;
    }

    let entries = Object.entries(fnVals);
    let lowest = entries.reduce((a, b) => a[1] >= b[1] ? b : a);
    // console.log(node + " BEST NODE: " + lowest[0])
    return lowest[0]; // Node to go towards
}



function getGn(cNodes, ghostNode) {
    const [node, distance] = getClosestNode();
    const ghostNodeIndex = nodes[ghostNode].index;
    let accumDist = distance;
    let bestNode = node;
    while (!Object.keys(cNodes).includes(ghostNode)) {
        // cells[currentPacmanCell].style.backgroundColor = "red";
        // cells[node].style.backgroundColor = "red";
        cNodes = nodes[`n${bestNode}`].connectedNodes
        bestNode = astar(`n${bestNode}`, ghostNodeIndex)
        // cells[bestNode].style.backgroundColor = "red";
        accumDist += cNodes[`n${bestNode}`];
    }
    return accumDist;
}



function getClosestNode() {
    const adjacentCells = [currentPacmanCell - rows, currentPacmanCell + 1, currentPacmanCell + rows, currentPacmanCell - 1]
    const validDirections = adjacentCells.map(cell => isValidCell(cell) ? true : false); // up, down, right, left
    let distances = {}
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

function leaveHome(ghost) {
    if (ghost === pinky) {
        setTimeout(() => {
            cells[pinky.currentCell].classList.remove(pinky.cssClass);
            cells[154].classList.add(pinky.cssClass);
            pinky.currentCell = 154;
            setTimeout(() => {
                cells[pinky.currentCell].classList.remove(pinky.cssClass);
                cells[155].classList.add(pinky.cssClass);
                pinky.currentCell = 155;
            }, pinky.speed)
        }, pinky.speed)
        setTimeout(() => {
            chase(pinky, pinky.startDirection);
        }, pinky.speed * 2);
    } else if (ghost === clyde) {
        setTimeout(() => {
            cells[clyde.currentCell].classList.remove(clyde.cssClass);
            cells[136].classList.add(clyde.cssClass);
            clyde.currentCell = 136;
            setTimeout(() => {
                cells[clyde.currentCell].classList.remove(clyde.cssClass);
                cells[154].classList.add(clyde.cssClass);
                clyde.currentCell = 154;
                setTimeout(() => {
                    cells[clyde.currentCell].classList.remove(clyde.cssClass);
                    cells[155].classList.add(clyde.cssClass);
                    clyde.currentCell = 155;
                }, clyde.speed);
            }, clyde.speed);
        }, clyde.speed);
        setTimeout(() => {
            chase(clyde, clyde.startDirection);
        }, clyde.speed * 3)
    }
}
function handleStart(e) {
    startingHtml = container.innerHTML;
    container.innerHTML = "";
    setUp()
    scoreBox = document.createElement('p')
    scoreBox.innerText = `Score: ${score}`;
    scoreBox.style.color = "white";
    scoreBox.style.fontSize = "1.5rem";
    scoreBox.style.fontFamily = "Arcade-R";
    scoreBox.style.textShadow = "-1px -1px lightgrey";
    scoreBox.style.margin = "0";
    container.style.flexDirection = "row";
    body.insertBefore(scoreBox, container)
    // setTimeout(() => pacmanMove(3), 1000)
    setTimeout(() => chase(blinky, blinky.startDirection), 1000);
    setTimeout(() => {
        leaveHome(pinky)
    }, 1000);
    setTimeout(() => {

        leaveHome(clyde);
    }, 3000);


}

function updateScore() {
    scoreBox.innerText = `Score: ${score}`
}

function gameOver() {
    console.log("GAMEOVER")
    document.removeEventListener("keydown", handleKeyDown)
    container.innerHTML = ""
    body.removeChild(scoreBox);
    container.style.backgroundColor = "black";
    const pGameOver = document.createElement('p');
    pGameOver.innerText = "GAME OVER"
    pGameOver.style.color = "yellow";
    pGameOver.style.fontSize = "1.5rem";
    pGameOver.style.fontFamily = "Arcade-R";
    pGameOver.style.textShadow = "-1px -1px yellow";
    pGameOver.style.height = "100px";
    pGameOver.style.margin = "3rem auto";
    container.append(pGameOver);
    const p = document.createElement('p');
    p.innerText = `Final Score: ${score}`;
    p.style.color = "white";
    p.style.fontSize = "1.5rem";
    p.style.fontFamily = "Arcade-R";
    p.style.textShadow = "-1px -1px lightgrey";
    p.style.margin = "2rem auto";
    p.style.height = "100px"
    container.append(p)
    container.style.flexDirection = "column"
    restartButton = document.createElement('button');
    restartButton.classList.add('restart-button');
    restartButton.innerText = "PLAY AGAIN"
    container.append(restartButton);
    restartButton.addEventListener("click", restart)

}


function restart() {
    container.innerHTML = startingHtml;
    startButton = document.querySelector(".start-button")
    startButton.addEventListener("click", handleStart)
    container.style.flexDirection = "column";
    cells = [];
    currentPacmanCell = startingCell;
    ghosts.forEach(ghost => {
        ghost.direction = ghost.startDirection;
        ghost.currentCell = ghost.startingCell;
    });
    startingFood = 0;
    foodEaten = 0;
    score = 0;
    validCells = [],
        prevNode = undefined;
}
