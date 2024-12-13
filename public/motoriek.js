const sayWord = (word) => {
	if ('speechSynthesis' in window) {
		// Wait for voices to be available
		let voices = []

		const getVoices = () => {
			voices = speechSynthesis.getVoices()
			if (voices.length === 0) return;	// If no voices are loaded yet, keep waiting

			speechSynthesis.cancel()
			const utterance = new SpeechSynthesisUtterance(word)

			// Find a Dutch voice (if available)
			let dutchVoice = voices.find(voice => voice.lang.startsWith("nl"))

			if (dutchVoice) {
				utterance.voice = dutchVoice
			} else {
				console.log("Dutch voice not found, using default.")
			}

			utterance.rate = parseInt(document.getElementById('length').value) < 2 && document.getElementById('twohands').checked ? 1.5 : 1.2
			speechSynthesis.speak(utterance)
		}

		// If voices are already loaded, use them; otherwise, wait for the voices to load
		if (speechSynthesis.getVoices().length !== 0) {
			getVoices()
		} else {
			speechSynthesis.onvoiceschanged = getVoices
		}
	} else {
		console.log("Speech synthesis is not supported.")
	}
}

const moves = [
	'wu sau', 'tahn sau', 'fook sau', 'tsing cheung', 'gum sau', 'kong sau',
	'hang sau', 'pak sau', 'fak sau', 'woei sau', 'cham sau', 'jat sau',
	'biu sau', 'faht chong kuen', 'dun sau', 'kwan sau', 'wang cheung', 'dai cheung', 'bong sau', 'sau kuen'
]
let selected_moves = []
let previous_move_a, previous_move_b
let m = 0
let s = 0
let stopped = true
let paused = false
let interval

function init() {
	let cols = 5
	let text = '<table class="movelist-table">'
	for (i=0; i < moves.length; i++) {
		if (i%cols === 0) { text += '<tr>' }
		text += `<td><label class="movelist-item"><input type="checkbox" class="move-checkbox" id="cb${i}" value="${i}" onchange="reload()">&nbsp;${moves[i]}</label></td>`
		if (i%cols === cols-1) { text += '</tr>' }
	}
	text += '</table>';
	document.getElementById('movelist').innerHTML = text
	toggleSelectedMoves()
	reload()
}

function toggleSelectedMoves() {
	let anyChecked = false
	for (i=0; i < moves.length; i++) {
		let checkbox = document.getElementById(`cb${i}`)
		if (checkbox.checked) {
			anyChecked = true
			break;
		}
	}

	document.getElementById('toggle-all-button').innerHTML = anyChecked ? 'Alles aan' : 'Alles uit'

	for (i=0; i < moves.length; i++) {
		let checkbox = document.getElementById(`cb${i}`)
		checkbox.checked = anyChecked ? false : true
	}

	reload()
}

function reload() {
	selected_moves = []
	for (i=0; i < moves.length; i++)
	{
		let checkbox = document.getElementById(`cb${i}`)
		if (checkbox.checked)
		{
			let move = moves[checkbox.value]
			selected_moves.push(move)
		}
	}
}

function getNewTechnique() {
	let a = -1
	let b = -1
	let spokenWord = ''

	let twoHands = document.getElementById('twohands').checked

	if (twoHands) {
		do {
			a = Math.floor((Math.random() * selected_moves.length))
		} while (a === previous_move_a) 
		do {
			b = Math.floor((Math.random() * selected_moves.length))
		} while (b === previous_move_b)
		document.getElementById('move').innerHTML = selected_moves[a] + ' + ' + selected_moves[b]
		spokenWord = `${selected_moves[a]} en ${selected_moves[b]}`
		previous_move_a = a
		previous_move_b = b
	}
	else {
		do {
			a = Math.floor((Math.random() * selected_moves.length))
		} while (a === previous_move_a) 
		document.getElementById('move').innerHTML = spokenWord = selected_moves[a]
		previous_move_a = a
	}

	sayWord(spokenWord)
}

function playPause() {
	if (selected_moves.length < 2) {
		document.getElementById('move').innerHTML = 'Selecteer tenminste twee technieken'
		return;
	}

	let seconds = parseInt(document.getElementById('length').value)
	if (seconds < 1) {
		document.getElementById('move').innerHTML = 'Selecteer minstens 1 seconde'
		return;
	}

	if (!stopped || paused) {
		paused = !paused
		speechSynthesis.cancel()
		update()
		return;
	}

	stopped = false
	paused = false

	seconds--	// There is a timer bug. This fix is stupid but easier
	update()
	getNewTechnique()

	m = Math.floor(seconds / 60)
	s = parseInt(seconds % 60)

	clearInterval(interval)
	interval = window.setInterval('count()', 1000)
	document.getElementById('timer').innerHTML = 'Next!'
}

function stop() {
	if (stopped) { return; }
	stopped = true
	paused = false
	clearInterval(interval)
	m = 0
	s = 0
	document.getElementById('move').innerHTML = '&nbsp;'
	speechSynthesis.cancel()
	update()
}

function update() {
	// Display the output
	str = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');

	document.getElementById('timer').innerHTML = str

	let timer_color
	if (!paused && !stopped) timer_color = '#00FF00'
	else if (paused) timer_color = '#FFFF00'
	else if (stopped) timer_color = '#EFEFEF'
	document.getElementById('timer').style.background = timer_color

	let playing = !stopped && !paused

	if (playing) {
		document.getElementById('btnPlay').innerHTML ='<i class="fas fa-pause"></i> Pause'
	}
	else if (paused || stopped) {
		document.getElementById('btnPlay').innerHTML = '<i class="fas fa-play"></i> Play'
	}
}

function count() {
	if (paused || stopped) { return; }

	update()

	// Calculate the stop watch
	if (s > 0) {
		s = s - 1
	} else {
		if (m > 0) {
			s = 59
			m = m - 1
			if (m === -1) {
				m = 59
			}
		} else {
			stop()
			playPause()
		}
	}
}

function saveSettings() {
    let settingsJSON = JSON.stringify(bool)
    console.log(settingsJSON())
}

document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        event.preventDefault();
        playPause()
    }
});

document.addEventListener("DOMContentLoaded", function() {
    init()
});
