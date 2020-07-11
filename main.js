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
        }
    };
})();

let LogicController = (function(){
    let Player = (playerNum, type) => {
        return {playerNum, type};
    };

    let Game = {
        turn: 0,
        Board: ['-','-','-','-','-','-','-','-','-'],
    };
    //turn tracker?
    //check for wins
    //update board based on who is playing.
    return{
        addPlayer: function(pNum, pType){
            Game[`Player${pNum}`] = Player(pNum, pType);
        },
        isFilled: function(idx){
            return (Game.Board[idx] === '-') ? false : true;
        },
        updateBoard: function(idx){
            Game.Board[idx] = Game[`Player${Game.turn}`].type;
            Game.turn = (Game.turn === 0) ? 1 : 0;
            console.log(Game.Board);
        }
    };
})();


let MainControl = (function(UICtrl,LogicCtrl){
    let DOMStrings = UICtrl.getDomStrings();
    //set up event listener for box click 
    let boxes = UICtrl.getBoxes();
    boxes.forEach(element => {
        element.addEventListener('click',() => {
            //check logic if that space already has stuff.
            let boardIdx = element.getAttribute(DOMStrings.boxAlt);
            if(!LogicCtrl.isFilled(boardIdx))
            {
                //update the array at click location.
                LogicCtrl.updateBoard(boardIdx);
                //WHOs turn is it.

                //update UI at data-boxnum=boardIdx
            }
        })
    });
    //
    return{
        init: function(){
            LogicCtrl.addPlayer(0,'X');
            LogicCtrl.addPlayer(1,'O');
        }
    }
})(UIController, LogicController);

MainControl.init();