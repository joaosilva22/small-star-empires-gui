
class Connection {
	getPrologRequest(requestString, onSuccess, onError, port) {
		var requestPort = port || 8081
		var request = new XMLHttpRequest();
		request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

		request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
		request.onerror = onError || function(){console.log("Error waiting for response");};

		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		request.send();
	} 

	getBoardRequest(onSuccess) {
		this.getPrologRequest('getBoard', onSuccess);
	}

	moveShipRequest(board, faction, x1, z1, x2, z2, onSuccess) {
		let boardString = parseArrayString(board.board);
	    let requestString = `moveShipL(${faction},${boardString},${x1},${z1},${x2},${z2})`;
	    this.getPrologRequest(requestString, onSuccess);
	}

	placeStructureRequest(faction, board, structure, position, onSuccess) {
		let boardString = parseArrayString(board.board);
		let {x, z} = position;
		let requestString = `placeStructureL(${faction},${boardString},${structure},${x},${z})`;
		if (structure === 'trade station') {
			requestString = `placeStructureL(${faction},${boardString},tradestation,${x},${z})`;
		}
		console.log(requestString);
	    this.getPrologRequest(requestString, onSuccess);
	}

	shipPossibleMovementsRequest(faction, board, position, onSuccess){
		let boardString = parseArrayString(board.board);
		let {x, z} = position;
	    let requestString = `shipPossibleMovements(${faction},${boardString},${x},${z})`;
	    this.getPrologRequest(requestString, onSuccess);
	}

	playerPossibleBoardsRequest(faction, board, onSuccess){
		let boardString = parseArrayString(board.board);
	    let requestString = `playerPossibleBoards(${faction},${boardString})`;
	    this.getPrologRequest(requestString, onSuccess); 
	}

	playerBestBoardRequest(faction, board, onSuccess){
		let boardString = parseArrayString(board.board);
	    let requestString = `playerBestBoard(${faction},${boardString})`;
	    this.getPrologRequest(requestString, onSuccess);
	}

	isGameOverRequest(board, onSuccess) {
		let boardString = parseArrayString(board.board);
		let requestString = `isTheGameOver(${boardString})`;
		this.getPrologRequest(requestString, onSuccess);
	}

	getRandomBoardRequest(faction, board, onSuccess) {
		let boardString = parseArrayString(board.board);
		let requestString = `getRandomBoardPlease(${faction},${boardString})`;
		this.getPrologRequest(requestString, onSuccess);
	}

	calculateTotalPointsRequest(faction, board, onSuccess) {
		let boardString = parseArrayString(board.board);
		let requestString = `calculateTotalPoints(${faction},${boardString})`;
		this.getPrologRequest(requestString, onSuccess);
	}

}

function parseStringArray(string) {
	let array = [];
	let element = '';
	for (let i = 1; i < string.length; i++) {
		let char = string.charAt(i);

		if (char === '[') {
			let len = getStringArrayLen(string.substr(i));
			array.push(parseStringArray(string.substr(i, len+1)));
			i += len;
		}
		
		if (char !== '\'' && char !== '[' && char !== ']' && char !== ',') {
			element += char;
		} else if (char === ',' || char === ']') {
			if (string.charAt(i-1) !== ']') array.push(element);
			element = '';
		}
	}
	return array;
}

function getStringArrayLen(string) {
	let length = 0;
	let num = 0;
	for (let i = 0; i < string.length; i++) {
		if (string.charAt(i) === '[') num ++;
		
		if (string.charAt(i) === ']') {
			num --;
			if (num === 0) return length;
		}
		length += 1;
	}
	return -1;
}

function parseArrayString(array){
	let string = "[";
	for(let i=0; i<array.length; i++){
		if(i!=0) string += ",";
		string += "[";
		for(let j=0; j<array[i].length;j++){
			if(j!=0) string += ",";
			string += "[";
			for(let k=0; k<array[i][j].length;k++){
				if(k!=0) string += ",";
				string += "'";
				string += array[i][j][k];
				string += "'";
			}
			string += "]";
		}
		string += "]";
	}
	string += "]";

	return string;
}
