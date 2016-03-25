/*
  A Genetic Approch to create an optimal 3x3 Tic Tac Toe Player
  The algorithm consists of simulating an evolutive process of position choices in the board.
  Beginning with 50 randomly generated players, it keeps improving newer players based on best players from previous generations.
*/

var MAX_PLAYERS = 60;
var BOARD_SIDE_LEN = 3;
var MAX_OFFSPRING_PARENTS = 6;

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


var Population = function() {
    this.players = [];
    this.initialize_population();
};

Population.prototype.getRandomPlayer = function() {
    return this.players[Math.floor(Math.random() * (MAX_PLAYERS - 1))];
};

/*
 * Initialize MAX_PLAYERS initial players.
 */
Population.prototype.initialize_population = function() {
    this.players = [];

    var i;
    var base_player = [];

    for (i = 0; i < BOARD_SIDE_LEN * BOARD_SIDE_LEN; i++) {
        base_player.push(i);
    }

    for (i = 0; i < MAX_PLAYERS; i++) {
        var curr = shuffle(base_player.slice());
        this.players.push(curr);
    }
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
                curr += new Game(this.players[i], this.players[j]).outcome(); // Player i plays first
                curr += new Game(this.players[j], this.players[i]).outcome(); // Player j plays first
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
    var board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

    var pos_A = 0;
    var pos_B = 0;

    var i;

    for (i = 0; i < 9; i++) {
        while (pos_A < BOARD_SIDE_LEN * BOARD_SIDE_LEN) {
            var pa = this.convert(this.playerA[pos_A++]);

            if (board[pa[0]][pa[1]] === 0) {
                board[pa[0]][pa[1]] = 1;
                break;
            }
        }
        if (this.hasWinner(board)) {
            return 2;
        }

        while (pos_B < BOARD_SIDE_LEN * BOARD_SIDE_LEN) {
            var pb = this.convert(this.playerB[pos_B++]);

            if (board[pb[0]][pb[1]] === 0) {
                board[pb[0]][pb[1]] = 2;
                break;
            }
        }

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

        button.checked = false;
    }
}

function isClear() {
    for (var i = 0; i < 9; i++) {
        var button = document.getElementById(i.toString());

        if (button.checked) {
            return false;
        }
    }

    return true;
}

function loadButtons() {
    var say = function() {
        var button_num = event.srcElement.id;
        var button = document.getElementById(button_num.toString());

        var current = game.turn();

        button.checked = true;
        game.play(button_num);

        console.log('Play ' + button_num);

        button.style.color = "#00FFFF";

        if (game.hasWinner() !== 0) {
            alert('Player ' + current + ' Won');

            game = new Game();

            document.getElementById('start').click();
        }

        while (player.length > 0 && !game.available(player[0])) {
            player.shift();
        }

        if (player.length > 0) {
            current = game.turn();

            game.play(player[0]);
            document.getElementById(player[0].toString()).checked = true;
            player.shift();

            if (game.hasWinner() !== 0) {
                alert('Player ' + current + ' Won');
            }
        }
    };

    for (var i = 0; i < 9; i++) {
        var button = document.getElementById(i.toString());
        button.onclick = say;
    }

    document.getElementById('reset').onclick = function() {
        clearButtons();
    };

    document.getElementById('start').onclick = function() {
        var now = 2;

        clearButtons();

        if (Math.floor((Math.random() * 10)) % 2 === 0) {
            now = 1;
        }

        player = population.getRandomPlayer();

        if (now == 1) {
            document.getElementById(player[0].toString()).click();
            game.play(player[0]);
            player.shift();
        }
    };
}

loadButtons();
