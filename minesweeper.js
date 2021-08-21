/*STOPWATCH */

const stopwatchDisplay = document.querySelector('.stopwatch');
let startTime;
let updatedTime;
let difference;
let tInterval;
let savedTime;
let paused = 0;
let running = 0;

class Stopwatch {
    start () {
        if(!running){
          startTime = new Date().getTime();
          tInterval = setInterval(this.getShowTime, 1000);
      
          paused = 0;
          running = 1;
        }
      }
      pause () {
        if (!difference){
          // if timer never started, don't allow pause button to do anything
        } else if (!paused) {
          clearInterval(tInterval);
          savedTime = difference;
          paused = 1;
          running = 0;
        } 
      }
      
      reset (){
        clearInterval(tInterval);
        savedTime = 0;
        difference = 0;
        paused = 0;
        running = 0;
        stopwatchDisplay.innerHTML = '00:00:00';
      }
      
      getShowTime () {
        updatedTime = new Date().getTime();
        if (savedTime){
          difference = (updatedTime - startTime) + savedTime;
        } else {
          difference =  updatedTime - startTime;
        }
        // var days = Math.floor(difference / (1000 * 60 * 60 * 24));
        let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((difference % (1000 * 60)) / 1000);
          hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        stopwatchDisplay.innerHTML = hours + ':' + minutes + ':' + seconds;
      }
      
}


/*MINESWEEPER GAME */

const grid = document.getElementById('grid');
const reset = document.getElementById('reset');
const sadFace = document.getElementsByClassName('fa-frown');
const smileFace = document.getElementsByClassName('fa-smile');
let win = document.getElementById('win');

class Minesweeper {
    constructor(level, mines, rows, columns, boardId) {
        this.level = level;
        this.mines = mines;
        this.rows = rows;
        this.columns = columns;
        this.boardId = boardId;

        this.showNearbyMines = this.showNearbyMines.bind(this);
        this.play = this.play.bind(this);

    }
    revealMines () {
            let table = document.getElementById('table');
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.columns; j++) {
                    let cell = table.rows[i].cells[j]
                    if(cell.getAttribute('mine') == 'true') {
                    cell.setAttribute('id', 'cellsWithMine');
                    cell.innerHTML = 'X';
                    }
                }
            }
    }
    play (cell) {
        /*game over*/
        let table = document.getElementById('table');
        let noPlayCells = table.querySelectorAll("td[play='false']");
        let cells = table.querySelectorAll("td[cell='true']");
        let playedCells = 0;

        if (cell.getAttribute('mine') == 'true') {
            Stopwatch.prototype.pause();
            this.revealMines();
            sadFace[0].style.display = 'block';
            smileFace[0].style.display = 'none';
            noPlayCells.forEach(element => {
                 if (element.getAttribute('mine') == 'false') {
                     $(element).off();
                 }
            }) 
        }  
        /*win*/
        cells.forEach(element => {
            if(element.getAttribute('play') == 'true' && element.getAttribute('mine') == 'false') {
                playedCells = playedCells + 1;
            }
        })
        if (playedCells == this.rows * this.columns - this.mines) {
            win.style.display = "block";
            Stopwatch.prototype.pause();
        }      
    }

    showNearbyMines (cell) { 
        let table = document.getElementById('table');    

        if (cell.getAttribute('mine') == 'false') {
            let row = cell.parentNode.rowIndex;
            let col = cell.cellIndex;
            let mine = 0;
            let cellsAround = [];
                for (let i = Math.max(row - 1, 0); i <= Math.min(row + 1, this.rows - 1); i++) {
                    for (let j = Math.max(col - 1, 0); j <= Math.min(col + 1, this.columns - 1); j++) {
                        cellsAround.push(table.rows[i].cells[j]);
                        if (table.rows[i].cells[j].getAttribute('mine') == 'true') {
                        mine++
                        }
                    }
                } 
                if (mine > 0) {
                    cell.innerHTML = mine;
                    } else {
                        cellsAround.forEach(cell => {
                        if (cell.getAttribute('play') == 'false') {
                            cell.setAttribute('clicked', 'true');
                            cell.classList.add('clicked');
                            cell.setAttribute('play', 'true');
                            this.play(cell);
                            this.showNearbyMines(cell);
                            }                       
                        });
                    }
        }
    } 

    addMines () {
        let table = document.getElementById('table');
        let assignedMines = 0;
        let rowsAndCols = [0];
        
        while (assignedMines < this.mines) {
            let row = Math.floor(Math.random() * this.rows);
            let col = Math.floor(Math.random() * this.columns);
            let sumOfCells = row + col;
            if (!rowsAndCols.includes(sumOfCells)) {
                rowsAndCols.push(sumOfCells);
                let cells = table.rows[row].cells[col];
                cells.setAttribute('mine', 'true');
                cells.setAttribute('id', 'cellWithMine');
                assignedMines++
            } 
        }
    }

    mineCounter (cell) {
        let minesCount = document.getElementById('minesToDiscover');
        let mines = minesCount.innerHTML;

        if(cell.getAttribute('rightClick') == 'true' && cell.getAttribute('clicked') == 'false') {
            minesCount.innerHTML = mines - 1;
        } else if (cell.getAttribute('rightClick') == 'true' && cell.getAttribute('clicked') == 'true') {
            minesCount.innerHTML = parseInt(mines) + 1;
            }   
    } 

    clickHandlers (cell) {
        let clicked = 1;
        let clicked2 = 1;
        const mineCounterFunc = this.mineCounter;
        const playFunc = this.play;
        const showNearbyMinesFunc = this.showNearbyMines;
        
        
        if(cell.getAttribute('play') == 'false') {
            $(cell).on('mousedown', function(event) {
                Stopwatch.prototype.start();
                switch (event.which){
                    case 1:
                    cell.classList.add('clicked');
                    cell.setAttribute('clicked', 'true');
                    cell.classList.remove("guess");
                    if (clicked2 == 1) {
                        mineCounterFunc(this);
                    }
                    clicked2 = parseInt(clicked2) + 1;
                    clicked = parseInt(clicked) + 1;
                    cell.setAttribute('play', 'true');
                    playFunc(this);
                    showNearbyMinesFunc(this);
                    clicked = 1;
                    break;
                    case 3:
                    cell.classList.add('guess');
                    cell.setAttribute('rightClick', 'true');
                    cell.setAttribute('clicked', 'false');
                    if (clicked == 1 ) {
                        mineCounterFunc(this);
                    };
                    clicked = parseInt(clicked) + 1;
                    clicked2 = 1;
                    $(document). bind("contextmenu", function(e) { return false; });
                    }
                } 
            );            
        }
    }  

    createGrid () {
        sadFace[0].style.display = 'none';
        let board = document.getElementById('board');
        board.setAttribute('class', this.boardId);
        let table = document.createElement('table');
        table.setAttribute('id', 'table');
        let grid = document.getElementById('grid')
        grid.appendChild(table);
        let minesCount = document.getElementById('minesToDiscover');
        minesCount.innerHTML = this.mines;
        
        for (let i = 0; i < this.rows; i++) {
            let row = document.createElement('tr')
            table.appendChild(row)
            for (let j = 0; j < this.columns; j++) {
                let cell = document.createElement('td');
                row.appendChild(cell);
                cell.classList.add('cell');
                cell.setAttribute('mine', 'false');
                cell.setAttribute('cell', 'true');
                cell.setAttribute('play', 'false');
                this.clickHandlers(cell);
            }
        }
        this.addMines();
    }
    
    reset () {
        let table = document.getElementById('table');
        Stopwatch.prototype.reset(); 
        table.remove();
        this.createGrid();
        sadFace[0].style.display = 'none';
        smileFace[0].style.display = 'block';
        let minesCount = document.getElementById('minesToDiscover');
        minesCount.innerHTML = this.mines;
        win.style.display = 'none'; 
    }
}

/*LEVELS*/

const beginnerLevel = new Minesweeper('beginner', 10, 8, 8, 'boardb');
const intermediateLevel = new Minesweeper('intermediate', 25, 15, 15, 'boardi');

const beginnerButton = document.getElementById('beginnerLevel');
const intermediateButton = document.getElementById('intermediateLevel');


if (beginnerButton.checked) {
    
    beginnerLevel.createGrid();

    reset.onclick = () => {
        beginnerLevel.reset();
    }
   
};

beginnerButton.onclick = () => {
    let table = document.getElementById('table');

    if (table) {
        table.remove();
    };

    beginnerLevel.createGrid();

    reset.onclick = () => {
        beginnerLevel.reset();
    }
}

intermediateButton.onclick = () => {
    let table = document.getElementById('table');

    if (table) {
        table.remove();
    };

    intermediateLevel.createGrid();

    reset.onclick = () => {
        intermediateLevel.reset();
    }
}
