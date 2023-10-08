const CELL_SIZE = 20
const BOARD_SIZE = 20

const Cell = {
    width: CELL_SIZE,
    height: CELL_SIZE,
    tags: ['cell'],
    custom: {
        neighbors: 0,
        alive: false,
        checkNieghbors: current => {
            current.neighbors = 0

            if(current.scene.board[current.boardPos.x]) {
                // if(current.scene.board[current.boardPos.x][current.boardPos.y]) current.neighbors++
                if(current.scene.board[current.boardPos.x][current.boardPos.y - 1]) current.neighbors++
                if(current.scene.board[current.boardPos.x][current.boardPos.y + 1]) current.neighbors++
            }
            if(current.scene.board[current.boardPos.x - 1]) {
                if(current.scene.board[current.boardPos.x - 1][current.boardPos.y]) current.neighbors++
                if(current.scene.board[current.boardPos.x - 1][current.boardPos.y - 1]) current.neighbors++
                if(current.scene.board[current.boardPos.x - 1][current.boardPos.y + 1]) current.neighbors++
            }
            if(current.scene.board[current.boardPos.x + 1]) {
                if(current.scene.board[current.boardPos.x + 1][current.boardPos.y]) current.neighbors++
                if(current.scene.board[current.boardPos.x + 1][current.boardPos.y - 1]) current.neighbors++
                if(current.scene.board[current.boardPos.x + 1][current.boardPos.y + 1]) current.neighbors++
            }
        },
        updateLife: current => {
            if(current.alive){
                if(current.neighbors < 2 || current.neighbors > 3) {
                    current.alive = false
                    current.scene.board[current.boardPos.x][current.boardPos.y] = 0
                }
            }else{
                if(current.neighbors == 3) {
                    current.alive = true
                    current.scene.board[current.boardPos.x][current.boardPos.y] = 1
                }
            }

            current.color = current.alive ? '#000' : '#fff'
        },
    },
    load: current => {
        current.color = current.alive ? '#000' : '#fff'

        current.boardPos = {x: current.x / CELL_SIZE, y: current.y / CELL_SIZE}
    },
    mouseDown: ({event, current}) => {
        if(isInside(current.scene.game.getMouse, current)){
            if(event.button === 0) {
                current.alive = true
                current.scene.board[current.boardPos.x][current.boardPos.y] = 1
                current.color = current.alive ? '#000' : '#fff'
            }else {
                current.alive = false
                current.scene.board[current.boardPos.x][current.boardPos.y] = 0
                current.color = current.alive ? '#000' : '#fff'
            }
        }
    }
}

const game = new Game({
    fps: 5,
    width: CELL_SIZE * BOARD_SIZE,
    height: CELL_SIZE * BOARD_SIZE,
    scenes: {
        main: {
            custom: {
                board: [],
                boardPause: false
            },
            load: current => {
                //creating BOARD_SIZE * BOARD_SIZE board
                for (let row = 0; row < BOARD_SIZE; row++) {
                    const row = new Array(BOARD_SIZE)
                    for (let col = 0; col < row.length; col++) {
                        row[col] = 0;
                    }
                    current.board.push(row)
                }

                //creating cells
                for (let row_index = 0; row_index < current.board.length; row_index++){
                    for (let col_index = 0; col_index < current.board[row_index].length; col_index++){
                        const createdCell = current.instantGameObject({
                            ...Cell,
                            x: row_index * CELL_SIZE,
                            y: col_index * CELL_SIZE,
                        })

                        //50% chance of alive
                        const aliveChance = randomItemFromArray([true, false])
                        if(aliveChance) {
                            createdCell.alive = true
                            //updating board
                            current.board[row_index][col_index] = 1
                        }
                    }
                }
            },
            update: current => {
                const cells = current.getGameObjectByTag('cell')

                cells.forEach(cell => cell.checkNieghbors(cell))
                if(!current.boardPause) cells.forEach(cell => cell.updateLife(cell))
            },
            keyDown: ({event, current}) => {
                if(event.key == 'r') {
                    const cells = current.getGameObjectByTag('cell')

                    cells.forEach(cell => {
                        const aliveChance = randomItemFromArray([true, false])
                        if(aliveChance) {
                            cell.alive = true
                            current.board[cell.boardPos.x][cell.boardPos.y] = 1
                        }else{
                            cell.alive = false
                            current.board[cell.boardPos.x][cell.boardPos.y] = 0
                        }
                    })

                    cells.forEach(cell => cell.checkNieghbors(cell))
                    cells.forEach(cell => cell.updateLife(cell))
                }else if(event.key == 'p') current.boardPause = !current.boardPause
            }
        }
    },
})