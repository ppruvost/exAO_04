// webcam.js — caméra + boucle sécurisée


let video = null;
let stream = null;
let videoReadyForAnalysis = false;


async function startCamera() {
video = document.getElementById("video");


try {
stream = await navigator.mediaDevices.getUserMedia({
video: { facingMode: { ideal: "environment" } },
audio: false
});
video.srcObject = stream;


video.addEventListener("loadedmetadata", () => {
if (video.videoWidth > 50 && video.videoHeight > 50) {
videoReadyForAnalysis = true;
}
});


video.addEventListener("resize", () => {
if (video.videoWidth > 50 && video.videoHeight > 50) {
videoReadyForAnalysis = true;
}
});


} catch (e) {
console.error("Erreur accès caméra:", e);
}
}


// Boucle d'analyse continue
function startWebcamAnalysis() {
function loop() {
if (videoReadyForAnalysis) {
try {
autoCalibAngle();
} catch (e) {
console.error("Erreur autoCalibAngle:", e);
}
}
requestAnimationFrame(loop);
}
loop();
}


// Gestion boutons
window.addEventListener("load", () => {
document.getElementById("btnStartCam").onclick = async () => {
await startCamera();
startWebcamAnalysis();
};
});
