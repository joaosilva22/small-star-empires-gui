class Overlay {
	constructor() {
		this.scoreFactionOneElement = document.getElementById('score-one');
		this.scoreFactionTwoElement = document.getElementById('score-two');

		this.scoreFactionOneNode = document.createTextNode('');
		this.scoreFactionTwoNode = document.createTextNode('');

		this.scoreFactionOneElement.appendChild(this.scoreFactionOneNode);
		this.scoreFactionTwoElement.appendChild(this.scoreFactionTwoNode);

		this.scoreFactionOneNode.nodeValue = 0;
		this.scoreFactionTwoNode.nodeValue = 0;

		this.tipElement = document.getElementById('tip');
		this.tipTextElement = document.getElementById('tip-text');
		this.tipTextNode = document.createTextNode('');
		this.tipTextElement.appendChild(this.tipTextNode);

		this.updateTip('');
	}

	updateScore(board) {
		let connection = new Connection();
		let self = this;
		connection.calculateTotalPointsRequest('factionOne', board, function(data) {
			self.scoreFactionOneNode.nodeValue = data.target.response;
		});
		connection.calculateTotalPointsRequest('factionTwo', board, function(data) {
			self.scoreFactionTwoNode.nodeValue = data.target.response;
		});
	}

	updateTip(value) {
		if (value === '') {
			this.tipElement.style.display = 'none';
		} else {
			this.tipElement.style.display = 'block';
		}
		this.tipTextNode.nodeValue = value;
	}
}
