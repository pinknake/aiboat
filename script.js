function speakText() {
  const text = document.getElementById("text").value;

  if (text.trim() === "") {
    alert("Kuch text likho pehle!");
    return;
  }

  const speech = new SpeechSynthesisUtterance();
  speech.text = text;
  speech.lang = "hi-IN";   // Hindi voice
  speech.rate = 1;        // speed
  speech.pitch = 1;       // tone

  window.speechSynthesis.speak(speech);
}
