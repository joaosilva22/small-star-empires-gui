
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
	
	makeRequest()
	{
		// Get Parameter Values
		var requestString = document.querySelector("#query_field").value;
		// Make Request
		getPrologRequest(requestString, handleReply);
	}
	
	handleReply(data){
		document.querySelector("#query_result").innerHTML=data.target.response;
		board = parseStringArray(data.target.response);

		for (let i = 0; i < board[0].length; i++) {
			console.log(board[0][i]);
		}
	}

	parseStringArray(string) {
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
}
