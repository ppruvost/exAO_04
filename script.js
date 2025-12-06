// script.js — option B : X, Y, Angle en temps réel
//-------------------------------------------
// Auto‑calibration (appelé en continu par webcam.js)
//-------------------------------------------
function autoCalibAngle() {
const p = detectMireInstantanee();
if (!p) return;


infoAngle.textContent = `Angle : ${p.angle.toFixed(1)}°`;
pushDetectionToBuffers(p);
}


//-------------------------------------------
// Détection robuste : Hough + ellipse protégés
//-------------------------------------------
function detectMireInstantanee() {
try {
if (!video || video.videoWidth <= 0) return null;


// → ICI tu mets ton extraction frame
const frame = grabFrameFromVideo(video); // ta fonction existante
if (!frame) return null;


// → Hough
const circle = detectCircleWithHough(frame);
if (!circle) return null;


// → Points ellipse
const pts = extractEllipsePoints(frame, circle);
if (!pts || pts.length < 10) return null;


// → Fit ellipse
const el = fitEllipse(pts);
if (!el || !el.center) return null;


// → Final
const p = computeFinalParamsFromEllipse(el);
return p;
}
catch (e) {
console.error("Erreur detectMireInstantanee:", e);
return null;
}
}


//-------------------------------------------
// Export CSV
//-------------------------------------------
btnCSV.onclick = () => {
let csv = "time_s;x_px;y_px;angle_deg\n";
for (let i = 0; i < tBuffer.length; i++) {
csv += `${tBuffer[i]};${xBuffer[i]};${yBuffer[i]};${angleBuffer[i]}\n`;
}
const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "mire_optionB.csv";
a.click();
URL.revokeObjectURL(url);
};
