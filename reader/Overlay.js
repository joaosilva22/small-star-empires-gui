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

		this.bannerElement = document.getElementById('banner');
		this.winnerTextElement = document.getElementById('winner');
		this.winnerTextNode = document.createTextNode('');
		this.winnerTextElement.appendChild(this.winnerTextNode);

		this.timerTextElement = document.getElementById('timer-text');
		this.timerTextNode = document.createTextNode('');
		this.timerTextElement.appendChild(this.timerTextNode);

		this.elapsed = 0;
		this.timerEnabled = false;

		this.alertElement = document.getElementById('alert');
		this.alertTextElement = document.getElementById('alert-text');
		this.alertTextNode = document.createTextNode('');
		this.alertTextElement.appendChild(this.alertTextNode);

		this.alertDuration = 0;
		this.alertElapsed = 10000;
		this.alertEnabled = false;
		this.alertElement.style.display = 'none';

		this.updateTip('');
		this.updateWinner('');
	}

	update(dt) {
		if (this.timerEnabled) {
			this.elapsed += dt;
			let minutes = Math.floor((this.elapsed / 1000) / 60);
			let seconds = Math.floor((this.elapsed / 1000) % 60);
			if (minutes < 10) minutes = '0' + minutes;
			if (seconds < 10) seconds = '0' + seconds;
			this.timerTextNode.nodeValue = `${minutes}:${seconds}`;
		}

		if (this.alertEnabled) {
			if (this.alertElapsed < this.alertDuration) {
				this.alertElapsed += dt;
			} else {
				this.alertEnabled = false;
				this.alertElement.style.display = 'none';
			}
		}
	}

	beginTimer() {
		this.timerEnabled = true;
		this.elapsed = 0;
	}

	endTimer() {
		this.timerEnabled = false;
		let minutes = Math.floor((this.elapsed / 1000) / 60);
		let seconds = Math.floor((this.elapsed / 1000) % 60);
		console.log(`Game finished in ${minutes}min${seconds}s`);
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

	getScore(faction) {
		if (faction === 'factionOne') {
			return this.scoreFactionOneNode.nodeValue;
		} else {
			return this.scoreFactionTwoNode.nodeValue;
		}
	}

	updateTip(value) {
		if (value === '') {
			this.tipElement.style.display = 'none';
		} else {
			this.tipElement.style.display = 'block';
		}
		this.tipTextNode.nodeValue = value;
	}

	updateWinner(value) {
		if (value === '') {
			this.bannerElement.style.display = 'none';
		} else {
			this.bannerElement.style.display = 'block';
		}
		this.winnerTextNode.nodeValue = value;
	}

	alert(text, duration) {
		this.alertDuration = duration;
		this.alertElapsed = 0;
		this.alertEnabled = true;
		this.alertElement.style.display = 'inline-block';
		this.alertTextNode.nodeValue = text;
	}

}
