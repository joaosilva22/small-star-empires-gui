
function postGameRequest(requestString, onSuccess, onError) {
    var request = new XMLHttpRequest();
    request.open('POST', '../../game', true);
    request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
    request.onerror = onError || function(){console.log("Error waiting for response");};

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send('requestString=' + encodeURIComponent(requestString));
}

function echo(arg) {
    const requestString = "[echo,2]";
    postGameRequest(requestString);
}

function handleReply(data) {
    response=JSON.parse(data.target.response);
    document.querySelector("#reply").innerHTML=response.message;
    document.querySelector("#board").value=response.newBoard;
    document.querySelector("#player").value=response.newPlayer;
}
