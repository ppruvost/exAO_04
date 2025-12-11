const soundBar = document.getElementById("soundBar");
const valueDisplay = document.getElementById("value");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const alarmSound = document.getElementById("alarmSound");
const emojiDisplay = document.getElementById("emoji");

let audioContext;
let analyser;
let microphone;
let isRunning = false;

// Historique des valeurs sonores (dernières 30s)
let soundHistory = [];
const HISTORY_DURATION = 30;
const FPS_APPROX = 60;
const MAX_HISTORY = HISTORY_DURATION * FPS_APPROX;

startButton.addEventListener("click", async () => {
    if (isRunning) return;

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    try {
        microphone = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContext.createMediaStreamSource(microphone);
        source.connect(analyser);
        isRunning = true;
        updateSoundLevel();
    } catch (err) {
        console.error("Erreur microphone :", err);
        alert("Impossible d'accéder au microphone.");
    }
});

stopButton.addEventListener("click", () => {
    if (!isRunning) return;

    microphone.getTracks().forEach(track => track.stop());
    audioContext.close();
    isRunning = false;

    soundHistory = [];
    soundBar.style.width = "0%";
    valueDisplay.textContent =
