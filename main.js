/**
 * !UI CONTROLLER
 */
let UIController = (function(){
    let DOMStrings = {
        box: "[data-boxNum]",
        boxAlt: "data-boxnum"
    }
    let boxes = document.querySelectorAll(DOMStrings.box);
    return {
        getBoxes: function(){
            return boxes;
        },
        getDomStrings: function(){
            return DOMStrings;
        },
        updateVisual: function(Board) {
            boxes.forEach(element =>{
                let boardIdx = element.getAttribute(DOMStrings.boxAlt);
                if(Board[boardIdx] === 'X'){
                    element.innerHTML = "<p>X</p>";
                }
                else if(Board[boardIdx] === 'O'){
                    element.innerHTML = "<p>O</p>";
                }
                else{
                    element.innerHTML = "";
                }
            });
            
        },
        finalResult: function(playerID){
            //SHOW a pop up that says 
            //player with !playerID WON

            //playerID = 0, 1  a player won
            //playerID = -1, !DRAW
            //playerID = null NOTHING
        }
    };
})();


/**
 * !LOGIC CONTROLLER
 */
let LogicController = (function(){
    let Player = (playerNum, type) => {
        return {playerNum, type};
    };

    let Game = {
        turn: 0,
        moveCount: 0,
        gameOver: false,
        Board: [null,null,null,null,null,null,null,null,null],//'-','-','-','-','-','-','-','-','-'],
    };
    return{
        addPlayer: function(pNum, pType){
            Game[`Player${pNum}`] = Player(pNum, pType);
        },

        getBoard: function(){
            return Game.Board;
        },

        updateBoard: function(idx){
            Game.Board[idx] = Game[`Player${Game.turn}`].type;
            Game.turn = (Game.turn === 0) ? 1 : 0;
            Game.moveCount++;
            console.log(Game.moveCount);
        },

        isFilled: function(idx){
            return (Game.Board[idx] === null) ? false : true;
        },
        
        isWin: function(){
            //set game to win. if it is not a win it will be set to false on '-' check
            Game.gameOver = true;
            //check for winning pattern and return the winning 
            for(let i = 0; i < 3; i++)
            {
                if(Game.Board[i] === Game.Board[i+3]  && Game.Board[i] === Game.Board[i+6] && Game.Board[i] !== null)
                {
                    return Game.Board[i];
                }
                else if(Game.Board[0+(3*i)] === Game.Board[1+(3*i)] && Game.Board[0+(3*i)] === Game.Board[2+(3*i)] && Game.Board[0+(3*i)] !== null)
                {
                    return Game.Board[0+(3*i)];
                }
            }
            
            if(Game.Board[0] === Game.Board[4] && Game.Board[0] === Game.Board[8] && Game.Board[4] !== null)
            {
                return Game.Board[4];
            }
            else if(Game.Board[2] === Game.Board[4] && Game.Board[2] === Game.Board[6] && Game.Board[4] !== null)
            {
                return Game.Board[4];
            }
            else if(Game.moveCount === 9){
                return "Draw";
            }
            else{
                Game.gameOver = false;
                return "-";
            }
        },

        isGG: function() {
            return Game.gameOver;
        },
        
        winningPlayer: function(Outcome){
            if(Game.Player0.type === Outcome)
            {
                return 0;
            }
            else if(Game.Player1.type === Outcome){
                return 1;
            }
            else if(Outcome === "Draw"){
                return -1;
            }
            else{
                return null;
            }
        }
    };
})();


/**
 * !MAIN HUB
 */
let MainControl = (function(UICtrl,LogicCtrl){
    let DOMStrings = UICtrl.getDomStrings();
    //set up event listener for box click 
    let boxes = UICtrl.getBoxes();

    //player vs player
    boxes.forEach(element => {
        element.addEventListener('click',() => {
            //check logic if that space already has stuff.
            let boardIdx = element.getAttribute(DOMStrings.boxAlt);
            if(!LogicCtrl.isFilled(boardIdx) && !LogicCtrl.isGG())
            {
                //update the array at click location.
                LogicCtrl.updateBoard(boardIdx);
                //update UI at data-boxnum=boardIdx
                UICtrl.updateVisual(LogicCtrl.getBoard());
                //Check for winner or draw
                UICtrl.finalResult(LogicCtrl.winningPlayer(LogicCtrl.isWin()));
            }
        })
    });
    //Evaluate Outcome
    function evalOutcome(outCome) {
        //if x win popup xWin  with UI
        //y win pop up yWin
        //'Draw' Then draw
        //'-' do nothing 
    }
    return{
        init: function(){
            LogicCtrl.addPlayer(0,'X');
            LogicCtrl.addPlayer(1,'O');
        }
    }
})(UIController, LogicController);

MainControl.init();