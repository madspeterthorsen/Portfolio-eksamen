// === podcast recorder & visualizer ===

// Hent knapper og elementer
const recordButton = document.getElementById('record-button');
const stopRecordButton = document.getElementById('stop-record-button');
const audioPlayback = document.getElementById('audio-playback');
const canvas = document.getElementById('audio-visualizer');
const ctx = canvas.getContext('2d');

// Canvas størrelse (runde "visualizer"-feltet)
canvas.width = 400;
canvas.height = 400;

// Globale variabler til optagelse og visualizer
let mediaRecorder;
let audioChunks = [];

let audioContext;
let analyser;
let source;
let dataArray;
let animationId;
let stream;

// Når jeg trykker "Start optagelse"
recordButton.addEventListener('click', async () => {
  try {
    // Få adgang til mikrofon (vis tilladelse i browser)
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // MIME-type fallback (nogle browsere kan noget forskelligt)
    let mimeType = '';
    if (MediaRecorder.isTypeSupported('audio/webm; codecs=opus')) {
      mimeType = 'audio/webm; codecs=opus';
    } else if (MediaRecorder.isTypeSupported('audio/ogg; codecs=opus')) {
      mimeType = 'audio/ogg; codecs=opus';
    } else {
      mimeType = ''; // fallback
      console.warn('Ingen understøttet MIME-type fundet!');
    }

    console.log('Bruger MIME-type:', mimeType);

    // Opret optager med MIME-type
    mediaRecorder = new MediaRecorder(stream, { mimeType });

    // Clear array
    audioChunks = [];

    // Når der kommer lyd → gem i array
    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    // Når optagelse stopper → lav en lydfil og vis i player
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      const audioUrl = URL.createObjectURL(audioBlob);

      audioPlayback.srcObject = null;
      audioPlayback.src = audioUrl;
      audioPlayback.controls = true;
      audioPlayback.load();

      audioChunks = []; // reset
    };

    // Start optagelse
    mediaRecorder.start();

    // Setup visualizer (visualisere frekvenser)
    audioContext = new AudioContext();
    source = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);

    // Start visualizer animation
    animate();

    // Skift knapper
    recordButton.style.display = 'none';
    stopRecordButton.style.display = 'inline-block';

  } catch (err) {
    console.error('Error accessing microphone:', err);
    alert('Kunne ikke få adgang til mikrofonen. Tjek browser tilladelser eller prøv Live Server.');
  }
});

// Når jeg trykker "Stop optagelse"
stopRecordButton.addEventListener('click', () => {
  cancelAnimationFrame(animationId); // stop visualizer
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

  // Stop recorder
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }

  // Stop mikrofon stream
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }

  // Luk audioContext
  if (audioContext) {
    audioContext.close();
  }

  // Skift knapper tilbage
  recordButton.style.display = 'inline-block';
  stopRecordButton.style.display = 'none';
});

// === VISUALIZER ===
// Funktion der kører i loop og tegner visualizer stregerne
function animate() {
  animationId = requestAnimationFrame(animate);

  analyser.getByteFrequencyData(dataArray); // opdater frekvens data

  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas hver frame

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 100;  // hvor tæt streger starter på logo (kan justeres)

  const bars = dataArray.length;
  const angleStep = (Math.PI * 2) / bars; // hvor meget hver streg drejer

  for (let i = 0; i < bars; i++) {
    const value = dataArray[i];
    const barLength = value * 0.6; // hvor langt hver streg er

    const angle = i * angleStep;

    // Beregn startpunkt
    const x1 = centerX + Math.cos(angle) * radius;
    const y1 = centerY + Math.sin(angle) * radius;

    // Beregn slutpunkt (længde afhænger af frekvensstyrke)
    const x2 = centerX + Math.cos(angle) * (radius + barLength);
    const y2 = centerY + Math.sin(angle) * (radius + barLength);

    // Tegn streg
    ctx.strokeStyle = 'rgba(191, 164, 115, 0.9)'; // min guld farve
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}
