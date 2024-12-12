const sayWord = (word: string) => {
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

			utterance.rate = 1
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

export { sayWord }
