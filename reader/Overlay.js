class Overlay {
	constructor() {
		this.scoreBlueElement = document.getElementById('score-blue');
		this.scoreYellowElement = document.getElementById('score-yellow');
		
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

		this.stopwatchBlueElement = document.getElementById('timer-blue');
		this.stopwatchBlueNode = document.createTextNode('60');
		this.stopwatchBlueElement.appendChild(this.stopwatchBlueNode);

		this.stopwatchYellowElement = document.getElementById('timer-yellow');
		this.stopwatchYellowNode = document.createTextNode('60');
		this.stopwatchYellowElement.appendChild(this.stopwatchYellowNode);

		this.stopWatchBlueDisplay = this.stopwatchBlueElement.style.display;
		this.stopWatchYellowDisplay = this.stopwatchYellowElement.style.display;

		this.stopwatchDuration = 60000;
		this.stopwatchBlueEnabled = false;
		this.stopwatchYellowEnabled = false;
		this.stopwatchBlueRemain = this.stopwatchDuration;
		this.stopwatchYellowRemain = this.stopwatchDuration;

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

		if (this.stopwatchBlueEnabled) {
			if (this.stopwatchBlueRemain > 0) {
				this.stopwatchBlueRemain -= dt;
				let val = Math.floor(this.stopwatchBlueRemain / 1000);
				if (val < 10) val = '0' + val;
				this.stopwatchBlueNode.nodeValue = val;
			} else {
				this.stopwatchBlueNode.nodeValue = '00';
				this.stopwatchBlueEnabled = false;
			}
		}

		if (this.stopwatchYellowEnabled) {
			if (this.stopwatchYellowRemain > 0) {
				this.stopwatchYellowRemain -= dt;
				let val = Math.floor(this.stopwatchYellowRemain / 1000);
				if (val < 10) val = '0' + val;
				this.stopwatchYellowNode.nodeValue = val;
			} else {
				this.stopwatchYellowNode.nodeValue = '00';
				this.stopwatchYellowEnabled = false;
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

	hideScore() {
		this.scoreBlueElement.style.display = 'none';
		this.scoreYellowElement.style.display = 'none';
	}

	showScore() {
		this.scoreBlueElement.style.display = 'block';
		this.scoreYellowElement.style.display = 'block';
	}

	getScore(faction) {
		if (faction === 'factionOne') {
			return this.scoreFactionOneNode.nodeValue;
		} else {
			return this.scoreFactionTwoNode.nodeValue;
		}
	}

	setScore(faction, value) {
		if (faction === 'factionOne') {
			this.scoreFactionOneNode.nodeValue = value;
		} else {
			this.scoreFactionTwoNode.nodeValue = value;
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

	endAlert() {
		this.alertElapsed = this.alertDuration;
	}

	beginStopWatch(faction) {
		if (faction === 'factionOne') {
			this.stopwatchBlueRemain = this.stopwatchDuration;
			this.stopwatchBlueEnabled = true;
		} else {
			this.stopwatchYellowRemain = this.stopwatchDuration;
			this.stopwatchYellowEnabled = true;
		}
	}

	pauseStopWatch(faction) {
		if (faction === 'factionOne') {
			this.stopwatchBlueEnabled = false;
		} else {
			this.stopwatchYellowEnabled = false;
		}
	}

	resetStopWatch(faction) {
		if (faction === 'factionOne') {
			this.stopwatchBlueRemain = this.stopwatchDuration;
			this.stopwatchBlueNode.nodeValue = Math.floor(this.stopwatchBlueRemain / 1000);
		} else {
			this.stopwatchYellowRemain = this.stopwatchDuration;
			this.stopwatchYellowNode.nodeValue = Math.floor(this.stopwatchYellowRemain / 1000);
		}
	}

	hasStopWatchEnded(faction) {
		if (faction === 'factionOne') {
			if (this.stopwatchBlueRemain <= 0) {
				return true;
			}
		} else {
			if (this.stopwatchYellowRemain <= 0) {
				return true;
			}
		}
		return false;
	}

	hideStopWatch() {
		this.stopwatchBlueElement.style.display = 'none';
		this.stopwatchYellowElement.style.display = 'none';
	}

	showStopWatch() {
		this.stopwatchBlueElement.style.display = this.stopWatchBlueDisplay;
		this.stopwatchYellowElement.style.display = this.stopWatchYellowDisplay;
	}
}
