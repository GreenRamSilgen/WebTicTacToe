/**
 * !UI CONTROLLER
 */
let UIController = (function () {
    let DOMStrings = {
        box: "[data-boxNum]",
        boxAlt: "data-boxnum",
        bgModal: ".bg-modal",
        actualModal: ".modal__content"
    }
    let boxes = document.querySelectorAll(DOMStrings.box);
    let popUpDisplay = document.querySelector(DOMStrings.bgModal);
    let modalContent = document.querySelector(DOMStrings.actualModal);
    let popped = false;

    return {
        getBoxes: function () {
            return boxes;
        },
        getDomStrings: function () {
            return DOMStrings;
        },
        updateVisual: function (Board) {
            boxes.forEach(element => {
                let boardIdx = element.getAttribute(DOMStrings.boxAlt);
                if (Board[boardIdx] === 'X') {
                    element.innerHTML = "<div class='x'></div>";
                } else if (Board[boardIdx] === 'O') {
                    element.innerHTML = "<div class='o'></div>";
                } else {
                    element.innerHTML = "";
                }
            });

        },
        popUp: function () {
            if (popped == true) {
                popUpDisplay.style.display = 'none';
                popped = false;
            } else {
                popUpDisplay.style.display = 'flex';
                popped = true;
            }
        },
        popEnd: function (playerID) {
            //SHOW a pop up that says 
            //player with !playerID WON
            if (playerID === null) return;
            if (document.querySelector(".result") !== null) {
                modalContent.removeChild(document.querySelector(".result"));
            }
            let winMsg = document.createElement("div");
            if (playerID === -1) {
                winMsg.textContent = "DRAW!";
            } else {
                winMsg.textContent = `Player ${playerID} WINS!`;
            }
            winMsg.className = "result";
            modalContent.appendChild(winMsg);
            this.popUp();
            //playerID = 0, 1  a player won
            //playerID = -1, !DRAW
            //playerID = null NOTHING
        }
    };
})();


/**
 * !LOGIC CONTROLLER
 */
let LogicController = (function () {
    let Player = (playerNum, type) => {
        return {
            playerNum,
            type
        };
    };

    let Game = {
        turn: 0,
        moveCount: 0,
        gameOver: false,
        Board: [null, null, null, null, null, null, null, null, null], //'-','-','-','-','-','-','-','-','-'],
    };
    return {
        addPlayer: function (pNum, pType) {
            Game[`Player${pNum}`] = Player(pNum, pType);
        },

        getBoard: function () {
            return Game.Board;
        },

        updateBoard: function (idx) {
            Game.Board[idx] = Game[`Player${Game.turn}`].type;
            Game.turn = (Game.turn === 0) ? 1 : 0;
            Game.moveCount++;
            console.log(Game.moveCount);
        },

        isFilled: function (idx) {
            return (Game.Board[idx] === null) ? false : true;
        },

        isWin: function () {
            //set game to win. if it is not a win it will be set to false on '-' check
            Game.gameOver = true;
            //check for winning pattern and return the winning 
            for (let i = 0; i < 3; i++) {
                if (Game.Board[i] === Game.Board[i + 3] && Game.Board[i] === Game.Board[i + 6] && Game.Board[i] !== null) {
                    return Game.Board[i];
                } else if (Game.Board[0 + (3 * i)] === Game.Board[1 + (3 * i)] && Game.Board[0 + (3 * i)] === Game.Board[2 + (3 * i)] && Game.Board[0 + (3 * i)] !== null) {
                    return Game.Board[0 + (3 * i)];
                }
            }

            if (Game.Board[0] === Game.Board[4] && Game.Board[0] === Game.Board[8] && Game.Board[4] !== null) {
                return Game.Board[4];
            } else if (Game.Board[2] === Game.Board[4] && Game.Board[2] === Game.Board[6] && Game.Board[4] !== null) {
                return Game.Board[4];
            } else if (Game.moveCount === 9) {
                return "Draw";
            } else {
                Game.gameOver = false;
                return "-";
            }
        },

        isGG: function () {
            return Game.gameOver;
        },

        winningPlayer: function (Outcome) {
            if (Game.Player0.type === Outcome) {
                return 0;
            } else if (Game.Player1.type === Outcome) {
                return 1;
            } else if (Outcome === "Draw") {
                return -1;
            } else {
                return null;
            }
        },

        resetALL: function () {
            Game.turn = 0;
            Game.moveCount = 0;
            Game.gameOver = false;
            Game.Board = [null, null, null, null, null, null, null, null, null];
        }
    };
})();


/**
 * !MAIN HUB
 */
let MainControl = (function (UICtrl, LogicCtrl) {
    let DOMStrings = UICtrl.getDomStrings();
    //set up event listener for box click 
    let boxes = UICtrl.getBoxes();

    //player vs player
    boxes.forEach(element => {
        element.addEventListener('click', () => {
            //check logic if that space already has stuff.
            let boardIdx = element.getAttribute(DOMStrings.boxAlt);
            if (!LogicCtrl.isFilled(boardIdx) && !LogicCtrl.isGG()) {
                //update the array at click location.
                LogicCtrl.updateBoard(boardIdx);
                //update UI at data-boxnum=boardIdx
                UICtrl.updateVisual(LogicCtrl.getBoard());
                //Check for winner or draw
                let result = LogicCtrl.winningPlayer(LogicCtrl.isWin());
                UICtrl.popEnd(result);
            }
        })
    });

    //POP UP Events ON WIN OR DRAW
    let pop = document.querySelector(".close");
    pop.addEventListener("click", UICtrl.popUp);


    //!RESET LISENER
    document.querySelector(".reset").addEventListener('click', () => {
        //reset logic then call update for ui to clean visual board
        LogicCtrl.resetALL();
        UICtrl.updateVisual(LogicCtrl.getBoard());
    });
    return {
        init: function () {
            LogicCtrl.addPlayer(0, 'X');
            LogicCtrl.addPlayer(1, 'O');
        }
    }
})(UIController, LogicController);

MainControl.init();