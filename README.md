Description

This was our first project, an individual project where we chose a game to build. We built on the fundamentals we had learnt in the first few weeks of the course. For my project I chose to build PacMan.


Deployment link


https://kanelawless.github.io/PacMan-Project-One/

Getting Started/Code Installation

Instructions

Explain how the reader accesses your code. Include a step by step approach.

Insert your Getting Started/Code Installation here:





Timeframe & Working Team (Solo/Pair/Group)

This was an individual project with 1 week to complete


Technologies Used

HTML
CSS
JavaScript




Brief

Pac Man is a classic arcade game from the 80s. The player aims to eat all the food in a maze whilst being hunted by ghosts.
If the player eats special flashing food the ghosts start to flash and can now be captured by the player, sending them back to their holding pen, from where they can once again start to hunt the player.
The aim is to achieve the highest score possible before being killed by the ghosts.
Requirements
The player should be able to clear at least one board
The player's score should be displayed at the end of the game
Suggested enhancements
Responsive design
Each board gets more difficult
Persistent leaderboard using localStorage




Planning

Instructions

The planning process began with creating a rudimentary wireframe of the HTML including some CSS identifiers. The idea was to create a grid using JS, adding and removing CSS classes from the grid cells for the specific actors in the game to create movement. The game also features valid and invalid cells in which characters may and may not move through respectively. There are also home cells which some of the ghosts begin in, and must move through to leave the home area, but remain invalid after they leave. Additionally there are food and power-up pellets in the cells which are ‘eaten’ by PacMan, increasing the score and activating ‘frightened’ mode.



After wireframing, I did some research into the original PacMan game, specifically with regard to ghost movement, so I could begin planning how to 


Build/Code Process

Grid Creation:
Using JS I created an 18x18 grid by iterating through the number of cells, creating <div> elements for each and appending them to the grid container. Arrays were used to keep track of invalid, home, corner, decision  and power-up cells. An array containing all the cell elements was also populated. Cell index, row and column were calculated and stored within the dataset attributes of the elements. Adding food, power-ups, and cell styling was also completed during these loops, as well as placing PacMan and the ghosts in their starting cells.

Nodes for the pathfinder were decided, a Node class was created to keep track of these nodes, containing indexing and neighbour nodes data and stored in the nodes object
class Node {
    constructor(index, connectedNodes) {
        this.connectedNodes = connectedNodes;
        this.index = index;
    }
}
 example:
nodes.n19 = new Node(19, { n25: 0, n73: 0 });
const nodes = {}

During set up, the distances between the Nodes were calculated and stored in the Node.connectedNodes property. The nodes were chosen carefully to make this distance calculable as they are all connected either by row or column and without obstacles. Edge cases were handled where the player and ghosts are capable of moving one side of the screen and returning on the opposite side. 


// calc distance between nodes.
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

Pacman Movement
Pacman’s movement is managed using an interval and the movement is constant. The next cell is calculated based on the current direction and cell index and checking cell validity using the valid/invalid cell arrays mentioned above. The player can change the direction using the arrow keys. If the next cell calculated is valid, the appropriate css classes are removed from the previous cell and added to the next cell to create the visual movement effect. If it is not a valid cell, Pacman will continue moving forward if possible, or will stay at the wall/corner until the correct key is pressed. To create the visual effect of the pacman image facing different directions, a helper function was also created to choose the correct class to add to the cell element, based on the current direction.
Collision
Collision is also handled in the main pacman movement function by checking if a cell contains both a pacman class and one of the ghosts, food or power-ups classes and each situation is handled accordingly. 

Ghost Movement
Ghosts have two different movement states; Chase and Frightened. In Chase, the four ghosts calculate their target cells using different methods.
Similarly to Pacman, they move continuously and straight forward, only making decisions on decision cells (nodes). 
In Chase, they will turn automatically on corner cells with no option to turn backwards, by means of the handleCorners function. Based on the current direction, the next cell will be calculated by first choosing one direction, and if the next cell is invalid, they will choose the cell in the opposite direction.
// Turns ghosts on corners with no choice
function handleCorners(direction, ghost) {
    let nextCell;
    // Tries one direction, if invalid, picks the other
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

When the ghosts reach a decision cell, they will use the pathfinder function to decide which node to turn towards. Firstly the target cell is calculated for the ghost in question using the bespoke target cell calculation. Then the pathfinder function will calculate and return which is the best node to aim towards next, based on the target node.


This is achieved by looking at the connected nodes of the current position of the ghost, calculating the euclidian distance from each node to the target cell and calculating the f(n) value of each cell by adding the euclidian and straight line distance. This was originally based on the a* search algorithm, however essentially finishing calculation after the first stage, therefore the accuracy in calculating the shortest path decreases when the target cell is nearby and obstacles are in between. 
After calculating the optimal node to travel towards, the pathfinder also calculates the distance to Pacman by utilising the getGn function, in order to consider Pacman’s current cell as a potential node. The closer of the best node and Pacman’s current cell is chosen as the optimal node.
function pathfinder(node, target) {


    let fnVals = {};
    let gnVals = {};
    let hnVals = {};


    const cNodes = new Object(nodes[node].connectedNodes); // object of nodes:distances


    let cNodesArray = Object.keys(cNodes)
    // ignore previous node when considering connected nodes to avoid turning backwards
    if (cNodesArray.includes(prevNode)) {
        let idx = cNodesArray.indexOf(prevNode)
        cNodesArray.splice(idx, 1)
    }
    // keep track of previous node
    prevNode = String(node);


    // Iterate through conncted nodes and calculate f(n) val
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


    // Get cell distance from pacman to ghost
    if (target === currentPacmanCell) {
        let gnPacman = getGn(cNodes, node)
        fnVals[`n${currentPacmanCell}`] = gnPacman;
    }


    // Find lowest f(n) val and choose that node
    let entries = Object.entries(fnVals);
    let lowest = entries.reduce((a, b) => a[1] >= b[1] ? b : a);


    return lowest[0]; // Node to go towards
}

The getGn function works by first finding the closest node to Pacman, then recursively calling the pathfinder function to work backwards from this node to the next best node, until it reaches the ghost’s current node, while tallying the straight line distance and returning this distance.

Frightened 
The ghosts enter ‘frightened’ mode when a power-up is collected by Pacman. Frightened mode lasts for 6 seconds by way of a timeout. The Frighten function handles this, by reversing the current direction of the ghosts and changing the characters blue. In frightened mode the ghosts no longer chase, instead taking turns pseudo randomly. This is achieved by generating a pseudo random number between 0 and 3 (direction) and validating the next cell in that direction. This is repeated until the next cell is valid. Collision is also handled differently. In Chase mode, collision between Pacman and Ghosts ends the game. Inversely, collision is encouraged in frightened mode, sending the ghosts back to their home square until the end of the current frightened iteration. 

Leaving Home
The final part of the project build worth mentioning is how the ghosts leave the home squares. Three of the ghosts begin the game in the home squares, which are invalid. A consequence of this is that the functionality for choosing the next square does not work while the ghosts are within the home section. To work around this, nested timeouts were designed for each ghost, to move them off their home square into the valid grid cells, both when leaving home for the first time and after they have been ‘eaten’ during frightened mode. They enter chase mode after leaving home.



Scoring, Winning and Losing
The player’s score is displayed above the game throughout, tallying with every food and power up collected, as well as when ghosts are eaten during frightened mode. If the player loses; by colliding with a ghost in chase mode, they may choose to play again on the end screen. This resets the score. If a player completes the level; by collecting all the food on the grid, they win the level. When restarting the game after winning, the score persists. The game increases in difficulty by increasing the speed of the ghosts after each level is completed. There is also a persistent high score which is updated in the DOM’s local storage if beaten, and always displayed at the end of the game, whether the player has won or lost.

Challenges

The main challenge of this project was the intelligent ghost movement and consumed a large portion of the time spent. The objective initially was to implement a shortest-path search algorithm such as A* Search, however this was not achieved. I began first researching algorithms and gaining an understanding. This was relatively straightforward to understand in principle, however converting this technically into JavaScript code was much more challenging than I thought. I began by deciding how many nodes to consider, as well as how these nodes were to be represented, in the end deciding to create a Node class. This enabled storing the index of the nodes and its neighbours and distances. One issue that made this a challenge was my understanding of JavaScript’s storage of objects not being strong enough. It was necessary to store multiple layers of distance data calculated within a loop across an unknown number of iterations. A persistent problem I had was that instead of adding data to a global object, the object was being re-written, due to the way in which JavaScript storage pointers work. In the limited time I had I wasn’t able to find a solution for this, leading me to implement a simpler version of the pathfinder. Some work-arounds however made the overall chasing performance better, such as turning ghosts automatically on corners. 
The other main challenge of the pathfinder was to get the ghosts to consider pacman when chasing. The pathfinder works using predetermined nodes, however Pacman is not a predetermined node, can be any distance from any node at any time, and is constantly moving. The impact of this was that when Pacman was between two nodes, although his distance to the ghost might be closer than from the ghost to any other node, the ghost would choose the closest node. This was solved as mentioned above, with the getGn function and its helper functions, by finding the closest node to pacman and calculating the distance backward to the ghost using the pathfinder, and considering this distance in the pathfinder after calculating the best nearest node.



Wins

The biggest win of the project for me was getting the ghosts to consider Pacman as a node in the pathfinder. In my opinion the project would have been a complete failure if this wasn’t achieved. This was a simple step by step process in which I figured out what steps were needed to achieve this; finding the nearest node, calculating this distance, then iterating using the pathfinder and tallying the distances until the ghost’s node was reached. I also have minimal experience using recursion before this, so doing this calculation within the pathfinder was an achievement for me. The pathfinder is being implemented regularly by 3 different ghosts, while Pacman is constantly moving also, so it was a challenge to my working memory to calculate the levels of iteration that were happening on every decision cell and it was a great achievement.
I was a little disappointed that I wasn’t able to implement the A* Search algorithm effectively in the time I had, but the ghosts do move intelligently and chase Pacman according to their different target cell calculations, so I have to see this as an achievement too, even if it is not efficient,  as I would have liked it to be.

Key Learnings/Takeaways

I feel very confident in my JavaScript as a result of undertaking this project. Most of the techniques used to create the game; from creating the grid, to ‘moving’ the ghosts and pacman, and use of intervals and timeouts, were all very new to me before beginning this project. It gave me a greater understanding of how I might attempt to build other games in the future, or in general how character movement in a grid-based game can be exhibited. I greatly improved my understanding of classes and objects also. Using them throughout this project made it much easier to keep track of important data while storing them in useful places. Since the ghost movement functions used iteration and were reusable for each ghost, the use of classes made this possible. In general also I think the use of modular programming was very useful in the project, something I was comfortable with already but am more confident with now. 
With regard to project management and planning, this was the first time I properly planned a project using a wireframe and pseudocode and I feel more confident in doing so now. I think the main takeaway for improvement that I learned from this project is to manage my time more efficiently. I spent far too much time trying to implement the search algorithm perfectly. I had not taken into consideration that I may not figure out the algorithm, nor how much time I would spend attempting it. This resulted in much of the functionality of the game being rushed, resulting in some bugs in which I didn’t have time to find solutions for before the deadline. My initial thought process was to tackle the crux of the project first, however I should have set it aside periodically to achieve the MVP first and foremost, something I will remember on the next project!




Bugs

There are multiple bugs present in the game at the time of writing, including:
Multiple sound bugs in which intervals which have not been cleared upon resetting the game play sound occasionally when undesired. 
The sound activated when a power-up is collected starts and immediately stops, only on the second power-up collected.
GameOver function is called a second time occasionally, causing the game to crash at the end game screen before the user has a chance to restart. The game crashes because it tries to destroy the ScoreBox element, which has already been destroyed when GameOver was first called. 
If a power up is collected when a ghost is on a corner cell, occasionally an instance of the ghost will get stuck in that corner until the frighten timeout occurs
Collision is not efficient in frighten mode, occasionally passing through each other without accounting for the collision. This is caused by a timing issue, a possible solution is to create an external interval which check for collision at more regular intervals.
If a power-up is collected during an active frightened mode period, it should reset the time back to 6 seconds, however this does not work as expected, and is the cause of some of the above mentioned bugs. 




Future Improvements

Implementation of an efficient shortest path search algorithm
One trade off was made where if a ghost is still in the home squares when a power up activates, but leaves while frightened mode is still active, it will not be frightened/blue/edible. This is an easy fix but would mean a lot of refactoring. Time-pressure was the reason for this trade off but is not resemblant of the true functionality in the original Pacman game. 
Fixing of all the bugs
Mute Button and Pause feature
Multiple lives for the player before ending the game, currently just one life.
In the original pacman game, if a ghost is eaten in frightened mode, they scurry back to the home cells as just a pair of eyes. I would like to implement this too




