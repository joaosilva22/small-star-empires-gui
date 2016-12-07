
/*function postGameRequest(requestString, onSuccess, onError) {
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
}*/

function getPrologRequest(requestString, onSuccess, onError, port)
{
    var requestPort = port || 8081;
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

    request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
    request.onerror = onError || function(){console.log("Error waiting for response");};

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}

function makeRequest(requestString)
{
    // Make Request
    getPrologRequest(requestString, handleReply);
}

function moveShipRequest(faction, board, x1, z1, x2, z2){
    let requestString = `moveShipL(${faction},${board},${x1},${z1},${x2},${z2})`;
    getPrologRequest(requestString,handleReply);
}

function placeStructureRequest(faction, board, x1, z1, x2, z2){
    let requestString = `placeStructureL(${faction},${board},${x2},${z2})`;
    getPrologRequest(requestString,handleReply);
}

function getBoardRequest(){
    getPrologRequest("getBoard",handleReply);
}

//Handle the Reply
function handleReply(data){
    document.querySelector("#query_result").innerHTML=data.target.response;
}