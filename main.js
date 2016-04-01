/*
 A Genetic Approch to create an optimal 3x3 Tic Tac Toe Player
 The algorithm consists of simulating an evolutive process of position choices in the board.
 Beginning with 50 randomly generated players, it keeps improving newer players based on best players from previous generations.
 */

var MAX_PLAYERS = 10;
var MAX_FITNESS_PLAYERS = 15000;

var BOARD_SIDE_LEN = 3;
var MAX_OFFSPRING_PARENTS = 2;

var PLAYER_COLOR = ['#c1c1c1', '#fbb917', '#43c6db'];

/*
 Simple array shuffle function as JS doesn't has it by default
 */
function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

/*
 Random integer generator
 */

function rand(limit) {
    return Math.floor(Math.random() * limit);
}

/*
 A player is a collection of responses to certain game situations.
 The associative array play is a collection of responses in way that for an board [] => i, with i being the best position to play with board condiion.
 */

var Player = function() {
    this.play = [];
};

Player.prototype.getPlayLength = function() {
    var size = 0, key;
    
    for (key in this.play) {
        if (this.play.hasOwnProperty(key)) size++;
    }
    
    return size;
};

Player.prototype.getPlay = function(board) {
    var i, j;
    
    var copy_board  = new Board();
    var curr_player = board.getTurn();

    for (i = 0; i < BOARD_SIDE_LEN; i++) {
        for (j = 0; j < BOARD_SIDE_LEN; j++) {
            if (board.get(i, j) !== 0) {
                if (board.get(i, j) == curr_player) {
                    copy_board.set(i, j, 1);
                } else {
                    copy_board.set(i, j, 1);
                }
            }
        }
    }

    var key = copy_board.getBoard();
    
    if (!this.play[key]) {

        var available = [];
        
        for (i = 0; i < BOARD_SIDE_LEN; i++) {
            for (j = 0; j < BOARD_SIDE_LEN; j++) {
                if (board.get(i, j) === 0) {
                    available.push(i * BOARD_SIDE_LEN + j);
                }
            }
        }
        
        var value = available[rand(available.length - 1)];
        
        this.play[key] = value;
    } 
    return this.play[key];
};

///////////////////////////////////////////////////////
//Population prototype

var Population = function() {
    this.players = [];
    
    for (var i = 0; i < MAX_PLAYERS; i++) {
        this.players.push(new Player());
    }

    this.getFitness();
};

Population.prototype.getRandomPlayer = function() {
    return this.players[rand(MAX_PLAYERS - 1)];
};

Population.prototype.crossover = function(playerA, playerB) {
    var curr;
    var new_player = new Player();
    
    for (curr in playerA.plays) {
        new_player.plays[curr] = playerA.plays[curr];
    }

    for (curr in playerB.plays) {
        if (!new_player.plays[curr] || rand(10) % 3 === 0) {
            new_player.plays[curr] = playerB.plays[curr];
        }
    }

    return new_player;
};

Population.prototype.mutate = function(player) {
    var new_player = new Player();

    for (var curr in player.plays) {
        if (rand(20) % 3 === 0) {
            var new_play = new_player.getPlay(new_player.plays[curr]);
            new_player.plays[curr] = new_player;
        } else {
            new_player.plays[curr] = player.plays[curr];
        }
    }
    
    return new_player;
};


/*
 * Return array where [i, fitness] is the fitness of player i. Array is sorted by fitness
 */
Population.prototype.getFitness = function() {
    var fitness = [];
    var training_players = [];
    
    var i, j;

    for (i = 0; i < MAX_FITNESS_PLAYERS; i++) {
        training_players.push(new Player());
    }

    for (i = 0; i < MAX_PLAYERS; i++) {
        var curr = 0;
        
        for (j = 0; j < MAX_FITNESS_PLAYERS; j++) {
            curr += new Game(this.players[i], training_players[j]).simulate();
            curr += new Game(training_players[j], this.players[i]).simulate(); 
        }

        fitness.push([i, curr]);
    }

    fitness.sort(function(a, b) {
        return a[1] - b[1];
    });

    return fitness;
};

/*
 * As crossover process is still ambigious ('how to optimally merge two plays for a tic tac toe game'), it just shuffles player's order of play. It's basically crossover/mutation process in the same time.
 */
Population.prototype.evolve = function() {
    var fitness = this.getFitness();

    console.log(fitness[0][1] + " " + fitness[1][1]);
    
    var new_population = [];

    var i, j, k, l;
    
    //Crossover process
    for (i = 0; i < MAX_OFFSPRING_PARENTS; i++) {
        for (j = 0; j < MAX_OFFSPRING_PARENTS; j++) {
            var new_player = this.crossover(this.players[i], this.players[j]);
            
            if (new_population.length < MAX_PLAYERS) {
                new_population.push(new_player);
            }
        }
    }

    for (i = 0; i < MAX_PLAYERS && new_population.length < MAX_PLAYERS; i++) {
        new_population.push(this.players[i]);
    }
    
    for (i = 0; i < MAX_PLAYERS; i++) {
        if (rand(20) % 7 === 0) {
            new_population[i] = this.mutate(new_population[i]);
        }
    }

    this.players = new_population;
};

/////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////
//Board prototype

var Board = function() {
    this.board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
};

Board.prototype.get = function(i, j) {
    return this.board[i][j];
};

Board.prototype.set = function(i, j, value) {
    this.board[i][j] = value;
};

Board.prototype.getBoard = function() {
    return this.board;
};


Board.prototype.getTurn = function() {
    var used = 0;
    var i, j;

    for (i = 0; i < BOARD_SIDE_LEN; i++) {
        for (j = 0; j < BOARD_SIDE_LEN; j++) {
            if (this.get(i, j) !== 0) {
                used += 1;
            }
        }
    }

    if (used % 2 === 0) {
        return 1;
    } else {
        return 2;
    }
};

/////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////
//Game prototype

var Game = function(playerA, playerB) {
    this.playerA = playerA;
    this.playerB = playerB;
    this.board   = new Board();
};

Game.prototype.getBoard = function() {
    return this.board;
};

/*
 =1 => Game is draw
 0  => Still available to play
 1  => Player 1 win
 2  => Player 2 win
 
 */
Game.prototype.boardStatus = function() {
    var winner = 0;
    var hasDifferent = 0;
    
    var ver_cnt = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    var hor_cnt = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

    var i, j;

    for (i = 0; i < BOARD_SIDE_LEN; i++) {
        for (j = 0; j < BOARD_SIDE_LEN; j++) {
            ver_cnt[j][this.board.get(i, j)] += 1;
            hor_cnt[i][this.board.get(i, j)] += 1;
        }
    }
    
    for (i = 0; i < BOARD_SIDE_LEN; i++) {
        var isV = 0;
        var isH = 0;
        
        for (j = 1; j <= 2; j++) {
            if (ver_cnt[i][j] > 0) {
                isV += 1;
            }
            if (hor_cnt[i][j] > 0) {
                isH += 1;
            }
            if (ver_cnt[i][j] == BOARD_SIDE_LEN || hor_cnt[i][j] == BOARD_SIDE_LEN) {
                winner = j;
            }
        }
        if (isV > 1) {
            hasDifferent += 1;
        }
        if (isH > 1) {
            hasDifferent += 1;
        }
    }

    if (this.board.get(1, 1) !== 0 &&
        ((this.board.get(1, 1) == this.board.get(0, 0) && this.board.get(1, 1) == this.board.get(2, 2)) ||
         (this.board.get(1, 1) == this.board.get(0, 2) && this.board.get(1, 1) == this.board.get(2, 0)))) {

        winner = this.board.get(1, 1);
    }

    //If there's no winner and all rows and cols already has more than one player sign, the game is over
    if (winner === 0 && hasDifferent == 6) {
        winner = -1;
    }

    return winner;
};

Game.prototype.convert = function(x) {
    return [Math.floor(x / 3), x % 3];
};

/*
 Returns which player have to play
 */
Game.prototype.turn = function() {
    return this.board.getTurn();
};

/*
 Simulate a game with playerA and playerB. playerA plays first

 Return:
 1 . PlayerA win
 0 . PlayerB win
 */

Game.prototype.simulate = function() {
    for (var i = 0; i < 9; i++) {
        if (this.boardStatus() == -1) break;

        var pa;
        var turn = this.turn();

        if (turn == 1) {
            pa = this.playerA.getPlay(this.board);
        } else {
            pa = this.playerB.getPlay(this.board);
        }

        var outcome = this.play(pa);

        var status = this.boardStatus();
        
        if (status == turn) {
            if (turn == 1) {
                return 1;
            } else {
                return 0;
            }
        }
    }
    
    return 0;
};

Game.prototype.available = function(position) {
    var board_pos = this.convert(position);

    if (position < 0 || position > 8 || this.board.get(board_pos[0], board_pos[1]) !== 0) {
        return false;
    }

    return true;
};

Game.prototype.play = function(position) {
    if (!this.available(position)) {
        return false;
    }

    var board_pos = this.convert(position);

    this.board.set(board_pos[0], board_pos[1], this.turn());

    return true;
};

/////////////////////////////////////////////////////////////////////////////////

var game = new Game();
var population = new Population();
var player = population.getRandomPlayer();

function clearButtons() {
    for (var i = 0; i < 9; i++) {
        var button = document.getElementById(i.toString());
        var label  = document.getElementById("label-" + i.toString());

        button.checked = false;
        label.style.backgroundColor = PLAYER_COLOR[0];
    }
}

function clearGame() {
    clearButtons();

    game = new Game();
    player = population.getRandomPlayer();
}

function playEvent() {
    var button_num = event.srcElement.id;
    var button     = document.getElementById(button_num.toString());
    var label      = document.getElementById("label-" + button_num.toString());

    var current = game.turn();
    
    label.style.backgroundColor = PLAYER_COLOR[current];
    game.play(button_num);

    var boardStatus = game.boardStatus();

    console.log('Play ' + button_num);

    if (boardStatus > 0) {
        alert('Player ' + current + ' Won');
        document.getElementById('start').click();
    } else if (boardStatus < 0) {
        alert('Game Draw');
        document.getElementById('start').click();
    } else {
        current = game.turn();
        var play_pos = player.getPlay(game.getBoard());

        label = document.getElementById("label-" + play_pos);

        game.play(play_pos);
        
        label.style.backgroundColor = PLAYER_COLOR[current];

        boardStatus = game.boardStatus();
        
        if (boardStatus > 0) {
            alert('Player ' + current + ' Won');
            clearGame();
        } else if (boardStatus < 0) {
            alert('Game Draw');
            document.getElementById('start').click();
        }
    }
}


function loadButtons() {
    for (var i = 0; i < 9; i++) {
        var button = document.getElementById(i.toString());
        button.onclick = playEvent;
    }

    document.getElementById('start').onclick = function() {
        var now = 1 + rand(10) % 2;
        
        clearGame();
        
        if (now == 1) {
            var play_pos = player.getPlay(game.getBoard());
            var label  = document.getElementById("label-" + play_pos);
            label.style.backgroundColor = PLAYER_COLOR[1];
            game.play(play_pos);
        }
    };
}

for (var i = 0; i < 50; i++) {
    population.evolve();
}

loadButtons();
