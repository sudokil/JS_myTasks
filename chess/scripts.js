/* vars */
const FIGURESYMBOL = {
    king: {
        white: '&#9812;',
        black: '&#9818;'
    },
    queen: {
        white: '&#9813;',
        black: '&#9819;'
    },
    rook: {
        white: '&#9814;',
        black: '&#9820;'
    },
    bishop: {
        white: '&#9815;',
        black: '&#9821;'
    },
    knight: {
        white: '&#9816;',
        black: '&#9822;'
    },
    pawn: {
        white: '&#9817;',
        black: '&#9823;'
    }
};
const CHECKER = {
    king(a, b) {
        return (Math.abs(a.x - b.x) <= 1) && (Math.abs(a.y - b.y) <= 1);
    },
    queen(a, b) { // TODO сделать проверку правильности хода
        return true;
    },
    rook(a, b) { // TODO сделать проверку правильности хода
        return true;
    },
    bishop(a, b) { // TODO сделать проверку правильности хода
        return true;
    },
    knight(a, b) {
        return ((Math.abs(a.x - b.x) == 1) && (Math.abs(a.y - b.y) == 2)) || ((Math.abs(a.x - b.x) == 2) && (Math.abs(a.y - b.y) == 1));
    },
    pawn(a, b) { // TODO сделать проверку правильности хода
        return true;
    }
};
let figureset = [];
let startPosition = [
    'king white e1',
    'king black e8',
    'queen white d1',
    'queen black d8',
    'rook white a1',
    'rook white h1',
    'rook black a8',
    'rook black h8',
    'bishop white c1',
    'bishop white f1',
    'bishop black c8',
    'bishop black f8',
    'knight white b1',
    'knight white g1',
    'knight black b8',
    'knight black g8',
    'pawn white a2',
    'pawn white b2',
    'pawn white c2',
    'pawn white d2',
    'pawn white e2',
    'pawn white f2',
    'pawn white g2',
    'pawn white h2',
    'pawn black a7',
    'pawn black b7',
    'pawn black c7',
    'pawn black d7',
    'pawn black e7',
    'pawn black f7',
    'pawn black g7',
    'pawn black h7'
];

/* functions */
function getCellSelector(cellName, line=true) {
    const letters = '  abcdefgh';
    let x = letters.indexOf(cellName.toLowerCase()[0]);
    let y = 10 - cellName[1];
    if (line) {
        return `.tr:nth-child(${y}) .td:nth-child(${x})`;
    } else {
        return {x, y};
    }
}

function getPosition(cell) {
    const letters = ' abcdefgh';
    let tr = cell.parentNode;
    let letter = letters[Array.from(tr.children).indexOf(cell)];
    let digit = 9 - Array.from(tr.parentNode.children).indexOf(tr);
    return letter + digit;
}

function checkMove(pos1, pos2, fig, beat=false) {
    let a = getCellSelector(pos1, false);
    let b = getCellSelector(pos2, false);
    let action = CHECKER[fig.name];
    if (fig.name == 'pawn') {
        // TODO расписать варианты для цветов, начального положения (двойной ход) и боя пешек (в том числе бой на проходе)
    } else if (fig.name == 'king') {
        // TODO расписать варианты для длинной и короткой рокировок.
    }
    return action(a, b);
}

function ChessFigure(name, color, position) {
    this.name = name;
    this.color = color;
    this.position = position.toLowerCase();
    this.nomoves = false;
    this.render = function(){
        document.querySelector(getCellSelector(this.position)).innerHTML = FIGURESYMBOL[this.name][this.color];
    };
    this.clear = function(){
        document.querySelector(getCellSelector(this.position)).innerHTML = '';
    };
    if (this.name == 'king') {
        if (((this.color == 'white') && (this.position == 'e1')) || ((this.color == 'black') && (this.position == 'e8'))) this.nomoves = true;
    } else if (this.name == 'rook') {
        if (((this.color == 'white') && (this.position in ['a1', 'h1'])) || ((this.color == 'black') && (this.position in ['a8', 'h8']))) this.nomoves = true;
    } else if (this.name == 'pawn') {
        if (((this.color == 'white') && (this.position in ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'])) || ((this.color == 'black') && (this.position in ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7']))) this.nomoves = true;
    }
}

function makeFigure(name, color, position) {
    let fig = new ChessFigure(name, color, position);
    fig.render();
    figureset.push(fig);
}

function startUp(pos) {
    for (i of pos) {
        let j = i.split(' ');
        makeFigure(j[0], j[1], j[2]);
    }
}

function move(beat=false) {
    let start = document.querySelector('.start');
    let finish = document.querySelector('.finish');
    start.classList.remove('start');
    finish.classList.remove('finish');
    let pos1 = getPosition(start);
    let pos2 = getPosition(finish);
    let fig, beatfig;
    for (f of figureset) {
        if (f.position == pos1) {
            fig = f;
        } else if (beat) {
            if (f.position == pos2) {
                beatfig = f;
            }
        }
    }
    if (beat) {
        if (beatfig.color != fig.color) {
            if (checkMove(pos1, pos2, fig, true)) {
                figureset.splice(figureset.indexOf(beatfig), 1);
                fig.clear();
                fig.position = pos2;
                fig.render();
                fig.nomoves = false;
            }
        }
    } else {
        if (checkMove(pos1, pos2, fig)) {
            fig.clear();
            fig.position = pos2;
            fig.render();
            fig.nomoves = false;
        }
    }

}

/* main */
document.addEventListener('DOMContentLoaded', function() {
    startUp(startPosition);
    
    document.querySelectorAll('.td').forEach(item => item.addEventListener('click', function(){
        if (document.querySelector('.start')) {
            if (document.querySelector('.finish')) {
                document.querySelector('.start').classList.remove('start');
                document.querySelector('.finish').classList.remove('finish');
                if (this.innerHTML) this.classList.add('start');
            } else {
                if (this.classList.contains('start')) {
                    this.classList.remove('start');
                } else {
                    this.classList.add('finish');
                    if (!this.innerHTML) {
                        move();
                    } else {
                        move(true);
                    }
                }
            }
        } else {
            if (this.innerHTML) this.classList.add('start');
        }
    }));
    
});
