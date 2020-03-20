// Main Javascript to handle functionality

//Testing Constants
const numRows = 15;
const numColumns = 15;
let currentOrientation = 0 // Horizontal, 1 is Vertical

////////////////////Basic Functionality


///// Utility Functions

function getCurrentBlock(){
	return document.querySelector('.current-block');
}
function getBlockNum(block){
	return parseInt(block.id.slice(4));
}

function getRowNum(block){
	let blockNum = parseInt(getBlockNum(block));
	return Math.floor((blockNum-1)/numRows)+1;
}

function getColNum(block){
	let blockNum = parseInt(getBlockNum(block));
	return ((blockNum-1) % numColumns) + 1;
}


function getNextBlock(block, orientation){
	switch(orientation){
		case 0: // Horizaontal (Across)
			var nextBlockNum = getBlockNum(block) + 1;
			if (nextBlockNum > numRows*numColumns) {
				nextBlockNum = 1;
			}
			var nextBlock = document.querySelector('#item'+nextBlockNum);
			return nextBlock;
		case 1: //Vertical (Down)
			var nextBlockNum = getBlockNum(block) + 15;
			if (nextBlockNum > (numColumns*numRows)) {
				nextBlockNum = nextBlockNum % (numColumns*numRows);
			}
			var nextBlock = document.querySelector('#item'+nextBlockNum);
			return nextBlock;
		break;
	};
}

//TODO: Change Variable Names
function getPreviousBlock(block, orientation){
	switch(orientation){
		case 0: // Horizaontal (Across)
			var nextBlockNum = getBlockNum(block) - 1;
			if (nextBlockNum < 1) {
				nextBlockNum = (numRows * numColumns);
			}
			var nextBlock = document.querySelector('#item'+nextBlockNum);
			return nextBlock;
		case 1: //Vertical (Down)
			var nextBlockNum = getBlockNum(block) - 15;
			if (nextBlockNum < 1){
				nextBlockNum = (numRows*numColumns) + nextBlockNum;
			} 
			var nextBlock = document.querySelector('#item'+nextBlockNum);
			return nextBlock;
		break;
	};
}

function isBrick(block){
	return block.classList.contains('grid-brick');
}

//TODO: Clean this function up. Clean up next block as well to return False at edges maybe
function highlightCurrentSelection(block){
	//Reset
	document.querySelectorAll('.current-orientation').forEach(function(x){
		x.classList.remove('current-orientation');
	});
	var blockNum = getBlockNum(block);

	//Go up until end or brick then go down
	var next = getNextBlock(block, currentOrientation);

	while(!isBrick(next) && getBlockNum(next) > blockNum){
		//Additional Break Conditions
		if (currentOrientation == 0){
			if (getRowNum(block) !== getRowNum(next)){
				break;
			}
		}
		else {
			if (getColNum(block) !== getColNum(next)) {
				break;
			} 
		}
		next.classList.add('current-orientation');
		next = getNextBlock(next,currentOrientation);
	}

	// Do the same for the Previous 
	var prev = getPreviousBlock(block, currentOrientation);

	while(!isBrick(prev) && getBlockNum(prev) < blockNum){
		//Additional Break Conditions
		if (currentOrientation == 0){
			if (getRowNum(block) !== getRowNum(prev)){
				break;
			}
		}
		else {
			if (getColNum(block) !== getColNum(prev)) {
				break;
			} 
		}
		prev.classList.add('current-orientation');
		prev = getPreviousBlock(prev,currentOrientation);
	}
}



function updateCurrentBlock(block){
	currBlock = getCurrentBlock();
	if (currBlock) currBlock.classList.remove('current-block');
	block.classList.add('current-block');
	highlightCurrentSelection(block);
}


function changeOrientation(){
	switch(currentOrientation){
		case 0:
			currentOrientation = 1;
			break;
		case 1:
			currentOrientation = 0;
			break;
	};
	highlightCurrentSelection(getCurrentBlock(),);
}

///// Keyboard
function leftKeyPressed(){
	currBlock = getCurrentBlock();
	if(!currBlock) return;

	if (currentOrientation !== 0){
		changeOrientation();
		return;
	}

	let next = getPreviousBlock(currBlock, currentOrientation);
	updateCurrentBlock(next);
}

function downKeyPressed(){
	currBlock = getCurrentBlock();
	if(!currBlock) return;

	if (currentOrientation !== 1){
		changeOrientation();
		return;
	}

	let next = getNextBlock(currBlock, currentOrientation);
	updateCurrentBlock(next);
}

function rightKeyPressed(){
	currBlock = getCurrentBlock();
	if(!currBlock) return;

	if (currentOrientation !== 0){
		changeOrientation();
		return;
	}

	let next = getNextBlock(currBlock, currentOrientation);
	updateCurrentBlock(next);
}

function upKeyPressed(){
	currBlock = getCurrentBlock();
	if(!currBlock) return;

	if (currentOrientation !== 1){
		changeOrientation();
		return;
	}

	let next = getPreviousBlock(currBlock, currentOrientation);
	updateCurrentBlock(next);
}


//////// Numbering

function blockNeedsNumber(block) {
	///Given a block check the boxes:
	//Above - Edg
	var blockNum = getBlockNum(block);
	var prev = getPreviousBlock(block, 1);
	if (isBrick(prev) || getBlockNum(prev) > blockNum){
		return true;
	}
	//To the Left
	var prev = getPreviousBlock(block, 0);
	if (isBrick(prev) || getRowNum(prev) !== getRowNum(block) ){
		return true;
	}
	return false;
}

// Main Numbering Function, call everytime brick is created/deleted?
function applyNumbering(){
	// Go through every grid item. 
	// Add a Number everywhere that needs it
	let counter = 1;
	let blocks = document.querySelectorAll('.xword-block');
	Array.from(blocks).forEach(function(block){
		//Clear Numbering
		block.querySelector('.numbering').innerHTML = '';
		if(blockNeedsNumber(block) && !isBrick(block)){
			block.querySelector('.numbering').innerHTML = parseInt(counter);
			counter++; 
		}
	});
}



//////// Grid Construction Functions

function createGridBrick(block, mirror){
	block.classList.add('grid-brick')
	changeBlockEntry(block,'');
	//Mirroring Functionality
	if (mirror){
		var blockNum = getBlockNum(block);
		//X axis
		var newRow = numRows - getRowNum(block) + 1;
		var newCol = (numColumns + 1) - getColNum(block);
		var newNum = ((newRow - 1) * 15) + newCol;
		console.log(newRow, newCol);
		var nextBlock = document.querySelector('#item'+newNum);
		nextBlock.classList.add('grid-brick');
	}
	applyNumbering();
}

function removeGridBrick(block, mirror){
	block.classList.remove('grid-brick')
	//Mirroring Functionality
	if (mirror){
		var blockNum = getBlockNum(block);
		//X axis
		var newRow = numRows - getRowNum(block) + 1;
		var newCol = (numColumns + 1) - getColNum(block);
		var newNum = ((newRow - 1) * 15) + newCol;
		var nextBlock = document.querySelector('#item'+newNum);
		nextBlock.classList.remove('grid-brick');
	}
	applyNumbering();
}


function changeBlockEntry(block, val){
	block.querySelector('p.entry').innerHTML = val;
}




function backspacePressed(){
	var curr = getCurrentBlock();
	let mirror = true;
	removeGridBrick(curr,mirror);
	changeBlockEntry(curr,'');

}



//////// Event Listeners

let gridBlocks = document.querySelectorAll('.xword-block');

Array.from(gridBlocks).forEach(function(block){
	block.addEventListener('click', function(e){
		updateCurrentBlock(this);
	})
});


document.addEventListener('keydown',function(e){
	switch(e.keyCode){
		case 37:
			leftKeyPressed();
			break;
		case 38:
			upKeyPressed();
			break;
		case 39:
			rightKeyPressed();
			break;
		case 40:
			downKeyPressed();
			break;
		case 8:
			backspacePressed();
			updateCurrentBlock(getPreviousBlock(getCurrentBlock(),currentOrientation));
			break;
		break;
	}
});

document.addEventListener('keypress',function(e){
	let char = String.fromCharCode(e.charCode).toUpperCase();

	//Period Handler (Brick Creation)
	if(char === '.'){
		let mirror = true;
		createGridBrick(getCurrentBlock(),mirror);
		updateCurrentBlock(getNextBlock(getCurrentBlock(),currentOrientation));
	}

	else {
		// 
		if (getCurrentBlock().classList.contains('grid-brick')){
			updateCurrentBlock(getNextBlock(getCurrentBlock(),currentOrientation));
			return;
		}

		changeBlockEntry(getCurrentBlock(),char);
		updateCurrentBlock(getNextBlock(getCurrentBlock(),currentOrientation));
	}

});










