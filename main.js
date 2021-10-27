//basing the start, end and obstacles on the user clicks
let clickCounts = 0;
let grid = createGridTable(10,10,function(el,row,col,i){
    clickCounts = ++clickCounts;
    if(clickCounts == 1){
        el.className='start';
        el.innerHTML = 'Start'
    }
    else if (clickCounts == 2){
        el.className='end';
        el.innerHTML = 'End'
    }
    else {
        el.className='obstacle';
        el.innerHTML = 'Wall'
    }
});
//attach the grid to the wrapper div
document.getElementById("wrapper").appendChild(grid);
     
function createGridTable( rows, cols, callback ){
    let i=0;
    let gridTable = document.createElement('table');
    gridTable.className = 'grid';
    gridTable.id = 'tGrid';
    for (let r=0;r<rows;++r){
        let tr = gridTable.appendChild(document.createElement('tr'));
        for (let c=0;c<cols;++c){
            let cell = tr.appendChild(document.createElement('td'));
            cell.addEventListener('click',(function(el,r,c,i){
                return function(){
                    callback(el,r,c,i);
                }
            })(cell,r,c,i),false);
        }
    }
    return gridTable;
}

function clearGrid(){
    let table = document.getElementById("tGrid");
 	//iterate cells and reset class and value
    for (let i = 0, row; row = table.rows[i]; i++) {
        for (let j = 0, col; col = row.cells[j]; j++) {
            col.className = '';
            col.innerHTML = '';
        }
    }    
    //reset counter
    clickCounts = 0;
}
function findShortestPath(){
    let table = document.getElementById("tGrid");
    let startNode;
    let endNode;
    let obstacles = [];
 	//iterate rows
    for (let i = 0, row; row = table.rows[i]; i++) {
 	    //iterate columns
        for (let j = 0, col; col = row.cells[j]; j++) {
            if(row.cells[j].className == 'start') {
                startNode = [i, j];
            }
            else if (row.cells[j].className == 'end') {
                endNode = [i, j];
            }
            else if (row.cells[j].className == 'obstacle') {
                //store obstacles in an array to set walkable to false later in the grid
                obstacles.push([i, j]);
            }
        }
    }
    //create an array from the table to pass as matrix to the pathfinding grid function
    let gridMatrix = Array.prototype.map.call(document.querySelectorAll('#tGrid tr'), function(tr){
        return Array.prototype.map.call(tr.querySelectorAll('td'), function(td){
            return parseInt(td.innerHTML);
        });
    });
    //leveraging the pathfinding algorithms to navigate the grid
    let pgrid = new PF.Grid(gridMatrix);
    //disallowing diagonal movement to mimic example in exercise
    let finder = new PF.BiDijkstraFinder({
       // diagonalMovement: PF.DiagonalMovement.Never
    });
    let xObstacle;
    let yObstacle;
    for (let i = 0; i < obstacles.length; i++){
        obstacleArray = obstacles[i];
        xObstacle = obstacleArray[0];
        yObstacle = obstacleArray[1];
        //set walkable to false for obstacles
        pgrid.setWalkableAt(xObstacle, yObstacle, false);
    }
    //find and store the shortest path between start and end points dynamically
    let path = finder.findPath(startNode[0], startNode[1], endNode[0], endNode[1], pgrid);

    if(path.length > 0) {
        let pathArray;
        let xIndex;
        let yIndex;
        for (let i = 1; i < path.length-1; i++) {
            pathArray = path[i];
            xIndex = pathArray[0];
            yIndex = pathArray[1];
            //loop the shortest path and apply visual styling to those cells
            table.rows[xIndex].cells[yIndex].className = 'path';
        }
    }
    else {
        alert("There is no path between the start point and end point.");
    }
}