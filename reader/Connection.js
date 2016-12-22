
class Connection {
	getPrologRequest(requestString, onSuccess, Board, onError, port) {
		var requestPort = port || 8081
		var request = new XMLHttpRequest();
		request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, false);

		request.onload = function(data){
			Board.setBoard(parseStringArray(data.target.response));
			console.log(Board.board);
			console.log("Request successful. Reply: " + data.target.response);
		};
		request.onerror = onError || function(){console.log("Error waiting for response");};

		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		request.send();
		console.log("END");
		console.log(Board.board);
	}
	
	makeRequest()
	{
		// Get Parameter Values
		var requestString = document.querySelector("#query_field").value;
		// Make Request
		getPrologRequest(requestString, handleReply);
	}
	
	moveShipRequest(faction, board, x1, z1, x2, z2){
	    let requestString = `moveShipL(${faction},${board},${x1},${z1},${x2},${z2})`;
	    this.getPrologRequest(requestString, this.handleReply, board);
	}

	placeStructureRequest(faction, board, x1, z1, x2, z2){
	    let requestString = `placeStructureL(${faction},${board},${x2},${z2})`;
	    this.getPrologRequest(requestString, this.handleReply, board);
	}

	getBoardRequest(Board){
	    this.getPrologRequest('getBoard', this.handleReply, Board);
	}

	handleReply(data){
		console.log("ANTES de setvalue");
		console.log(Board.board);
		Board.board = parseStringArray(data.target.response);
		console.log("depois");
		console.log(Board.board);
		/*document.querySelector("#query_result").innerHTML=Board.board.toString();
		for(let j = 0 ; j < Board.board[0].length ; j++){
			for (let i = 0 ; i < Board.board[j][0].length ; i++) {
				console.log(Board.board[j][i]);
			}
		}*/
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