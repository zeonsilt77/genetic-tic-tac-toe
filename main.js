/*
 A Genetic Approch to create an optimal 3x3 Tic Tac Toe Player
 The algorithm consists of simulating an evolutive process of position choices in the board.
 Beginning with 50 randomly generated players, it keeps improving newer players based on best players from previous generations.
 */

var MAX_PLAYERS = 80;
var BOARD_SIDE_LEN = 3;
var MAX_OFFSPRING_PARENTS = 6;

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
  A player is a collection of responses to certain game situations.
  The associative array play is a collection of responses in way that for an board [] => i, with i being the best position to play with board condition.
*/

var Player = function() {
    this.play = {};
};

var Population = function() {
    this.players = [];
    this.initialize_population();
};

Population.prototype.getRandomPlayer = function() {
    return this.players[Math.floor(Math.random() * (MAX_PLAYERS - 1))];
};

Population.prototype.initialize_population = function() {
    this.players = [];

    for (var i = 0; i < MAX_PLAYERS; i++) {
        this.players.push(new Player());
    }

    this.getFitness();
};


/*
 * Return array where [i, fitness] is the fitness of player i. Array is sorted by fitness
 */
Population.prototype.getFitness = function() {
    var fitness = [];

    var i, j;

    for (i = 0; i < MAX_PLAYERS; i++) {
        var curr = 0;
        for (j = 0; j < MAX_PLAYERS; j++) {
            if (i != j) {
                curr += new Game(this.players[i], this.players[j]).simulate(); // Player i plays first
                curr += new Game(this.players[j], this.players[i]).simulate(); // Player j plays first
            }
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
    var fitness = this.getFitness(this.players);

    var new_players = [];

    var i, j, k, l;

    var median = 0;

    for (i = 0; i < MAX_PLAYERS; i++) {
        median += fitness[i][1];
    }

    //Crossover process
    for (i = 0; i < MAX_OFFSPRING_PARENTS; i++) {
        var crossovered_parent = this.players[fitness[i][0]];

        for (j = 0; j < MAX_OFFSPRING_PARENTS; j++) {
            if (Math.floor(Math.random() * 10) % 4 === 0) {
                new_players.push(this.players[Math.floor(Math.random() * (MAX_PLAYERS - 1))]);
            } else {
                crossovered_parent = shuffle(crossovered_parent);

                new_players.push(crossovered_parent.slice());
            }
        }
    }

    for (i = 0; i < MAX_PLAYERS && new_players.length < MAX_PLAYERS; i++) {
        new_players.push(this.players[fitness[i][0]]);
    }

    this.players = new_players;
};

var Game = function(playerA, playerB) {
    this.playerA = playerA;
    this.playerB = playerB;
    this.board   = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
};


Game.prototype.hasWinner = function() {
    var winner = 0;

    var ver_cnt = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    var hor_cnt = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

    var i, j;

    for (i = 0; i < BOARD_SIDE_LEN; i++) {
        for (j = 0; j < BOARD_SIDE_LEN; j++) {
            ver_cnt[j][this.board[i][j]] += 1;
            hor_cnt[i][this.board[i][j]] += 1;
        }
    }

    for (i = 0; i < BOARD_SIDE_LEN; i++) {
        for (j = 1; j <= 2; j++) {
            if (ver_cnt[i][j] == BOARD_SIDE_LEN || hor_cnt[i][j] == BOARD_SIDE_LEN) {
                winner = j;
            }
        }
    }

    if (this.board[1][1] !== 0 &&
        ((this.board[1][1] == this.board[0][0] && this.board[1][1] == this.board[2][2]) ||
         (this.board[1][1] == this.board[0][2] && this.board[1][1] == this.board[2][0]))) {

        winner = this.board[1][1];
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
    var used = 0;
    var i, j;

    for (i = 0; i < BOARD_SIDE_LEN; i++) {
        for (j = 0; j < BOARD_SIDE_LEN; j++) {
            if (this.board[i][j] !== 0) {
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

/*
 Simulate a game with playerA and playerB. playerA plays first

 Return:
 2 . PlayerA win
 0 . PlayerB win
 1 . Draw
 */

Game.prototype.simulate = function() {
    for (var i = 0; i < 9; i++) {
        var pa = this.playerA.getPlay[this.board];

        this.play(pa);
        
        if (this.hasWinner(board)) {
            return 2;
        }
        
        var pb = this.playerB.getPlay[this.board];

        this.play(pb);

        if (this.hasWinner(board)) {
            return 0;
        }
    }

    return 1;
};

Game.prototype.available = function(position) {
    var board_pos = this.convert(position);

    if (position < 0 || position > 8 || this.board[board_pos[0]][board_pos[1]] !== 0) {
        return false;
    }

    return true;
};

Game.prototype.play = function(position) {
    if (!this.available(position)) {
        return false;
    }

    var board_pos = this.convert(position);

    this.board[board_pos[0]][board_pos[1]] = this.turn();

    return true;
};


///////////////////////////////////////////////////////

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
    var button = document.getElementById(button_num.toString());
    var label  = document.getElementById("label-" + button_num.toString());

    
        var current = game.turn();
        
        label.style.backgroundColor = PLAYER_COLOR[current];
        game.play(button_num);

        console.log('Play ' + button_num);

        if (game.hasWinner() !== 0) {
            alert('Player ' + current + ' Won');
            document.getElementById('start').click();
        }

        while (player.length > 0 && !game.available(player[0])) {
            player.shift();
        }

        if (player.length > 0) {
            current = game.turn();

            label = document.getElementById("label-" + player[0].toString());
            
            game.play(player[0]);

            label.style.backgroundColor = PLAYER_COLOR[current];
            player.shift();

            if (game.hasWinner() !== 0) {
                alert('Player ' + current + ' Won');
                clearGame();
            }
        }
    }


function loadButtons() {
    for (var i = 0; i < 9; i++) {
        var button = document.getElementById(i.toString());
        button.onclick = playEvent;
    }

    document.getElementById('start').onclick = function() {
        var now = 1 + Math.floor((Math.random() * 10)) % 2;
        
        clearGame();
        
        if (now == 1) {
            var label  = document.getElementById("label-" + player[0].toString());
            label.style.backgroundColor = PLAYER_COLOR[1];
            game.play(player[0]);
            player.shift();
        }
    };
}

for (var i = 0; i < 10; i++) {
    population.evolve();
}

loadButtons();
