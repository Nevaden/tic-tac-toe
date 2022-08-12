// const currentTurn = document.getElementById("current_turn"); //Get current Turn.

const vsCPU = document.getElementById("vs-cpu");
const vsPlayer = document.getElementById("vs-player");
const landingPage = document.getElementById("landing-page");
const gameBoard = document.getElementById("game-board");
const gameBoardTurn = document.getElementById("game-board__turn");
const playArea = document.getElementById("playArea");
const game_board_grid_items = document.querySelectorAll('.game-board-grid-item');
const x_scoreObj = document.getElementById("xWinText");
const o_scoreObj = document.getElementById("oWinText");
const tiesObj =  document.getElementById("tieText");
const x_class = "X";
const o_class = "O";
let playerSelectedSymbol = "X";
let currentTurn = "X"; 
let isVsPlayer = false;


let xWins = 0;
let oWins = 0;
let ties = 0;
let playerXMoves = [];
let playerOMoves = [];
let avaiableMoves = [1,2,3,4,5,6,7,8,9];

let winningCombos = [
	[1,2,3],
	[4,5,6],
	[7,8,9],
	[1,4,7],
	[2,5,8],
	[3,6,9],
	[1,5,9],
	[3,5,7]
	];

let pathTurnX = "M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z"
let pathTurnO = "M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z"

const pickSymbols = document.querySelectorAll('#pick-symbol div');

vsCPU.addEventListener('click', setGameMode);
vsPlayer.addEventListener('click', setGameMode);

// if (document.getElementById("current_turn").ATTRIBUTE_NODE("d") == pathTurnX) {
//     document.getElementById("current_turn").setAttribute("d",pathTurnO );
// } else {
//     document.getElementById("current_turn").setAttribute("d",pathTurnX );
// }


pickSymbols.forEach(mark => {
	mark.addEventListener('click', getUserChoice);
});


function getUserChoice() {
	playerSelectedSymbol = Object.assign({},this.id);

	this.classList.add('selected');
	if (this.nextElementSibling) {
		this.nextElementSibling.classList.remove('selected');
		} else {this.previousElementSibling.classList.remove('selected');
	}
}


function setGameMode() {
	let btnClickedId = this.id;
	if (btnClickedId === 'vs-player'){
		isVsPlayer = true;
	} 
	landingPage.classList.add("displayNone");
	gameBoard.classList.add("displayGrid");
	gameBoard.classList.remove("displayNone");

	startGame();
}

function startGame() {
	setBoardHoverSymbol();
	initialScoreBoard();
	setTurn();

	if (!isVsPlayer) {
		playVsCpu();
	} else { 
		playVsPlayer(); 
	}
}

//playArea.addEventListener("click", )


function setBoardHoverSymbol() {
	if (currentTurn == "O") {
		playArea.classList.remove(x_class);
		playArea.classList.add(o_class);
	} else {
		playArea.classList.remove(o_class);
		playArea.classList.add(x_class);
	}
}

function initialScoreBoard() {
	if (document.getElementById("X").classList.contains("selected")) {
		x_scoreObj.childNodes[0].nodeValue = "X (P1)"
		o_scoreObj.childNodes[0].nodeValue = "O (P2)"
	} else {
		x_scoreObj.childNodes[0].nodeValue = "X (P2)"
		o_scoreObj.childNodes[0].nodeValue = "O (P1)"	
	}

	x_scoreObj.children[0].textContent = xWins
	o_scoreObj.children[0].textContent = oWins
	tiesObj.children[0].textContent = ties
}

function setTurn() {

	if (currentTurn == "X") {
		gameBoardTurn.classList.remove("selectO")
		gameBoardTurn.classList.add("selectX")
	} else {
		gameBoardTurn.classList.remove("selectX")
		gameBoardTurn.classList.add("selectO")
	}
}

function playVsPlayer() {
	getPlayerChoice();	
}

function getPlayerChoice() {
	game_board_grid_items.forEach(item => {
		if (!item.classList.contains('x') && !item.classList.contains('o')) {
			item.addEventListener('click', playHandler, { once: true });
		}
	});
}

function playHandler(event){
	let currentGridItem = event.target;
	//currentGridItem.classList.add("select" + currentTurn)
	if (currentGridItem.tagName == "svg") {
		currentGridItem = currentGridItem.parentElement;
	}

	currentGridItem.classList.add("select"+currentTurn);
	
    for( var i = 0; i < avaiableMoves.length; i++){ 
        if ( avaiableMoves[i] === Number(currentGridItem.id)) { 
            avaiableMoves.splice(i, 1); 
        }
    }

	if (currentTurn == "X") {
		playerXMoves.push(Number(currentGridItem.id))
	} else {
		playerOMoves.push(Number(currentGridItem.id))
	}
	endCondtions();
}

function endCondtions() {

	let winningNumbers = winCheck(currentTurn);
	if (!winningNumbers == "") {
		gameEnd(winningNumbers)
	} else if (drawCheck()) {
		gameEnd()
	}

	switchTurn();
}

function switchTurn() {
	if (currentTurn == "X") {
		currentTurn = "O" 
	} else {
		currentTurn = "X"
	}

	setTurn();
	setBoardHoverSymbol();
}

function winCheck(turn) {
	let turnArray;
	if (turn == "X") {
		turnArray = playerXMoves;
	} else {
		turnArray = playerOMoves
	}
	for (let i = 0; i < winningCombos.length; i++) {

		if (turnArray.includes(winningCombos[i][0]) && turnArray.includes(winningCombos[i][1]) && turnArray.includes(winningCombos[i][2])) {
			let winningNumbers = winningCombos[i];
			console.log("chiekn dinner")
			return winningNumbers;
		}
	}	
	return "";
}

function drawCheck() {
	if (avaiableMoves.length == 0) {
		console.log("display modal");
		return true;
	}
}

function gameEnd(winningNumbers="") {
	if (!winningNumbers == ""){
		
		console.log(winningNumbers)
		for (let i = 0;i < winningNumbers.length ;i++) {
			document.getElementById(winningNumbers[i]).classList.add("highlighted")
		}
		if (currentTurn == "O") {
			let currentNumber = o_scoreObj.children[0].textContent
			o_scoreObj.children[0].textContent = Number(++currentNumber)
		} else {
			let currentNumber = x_scoreObj.children[0].textContent
			x_scoreObj.children[0].textContent = Number(++currentNumber)
		}
		
	//display win modal with turn data(turn)
	} else {
		//display draw modal
		let currentNumber = tiesObj.children[0].textContent
		tiesObj.children[0].textContent = Number(++currentNumber)
	}

}