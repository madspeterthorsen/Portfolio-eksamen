const recordButton = document.getElementById('record-button');
const stopRecordButton = document.getElementById('stop-record-button');
const audioPlayback = document.getElementById('audio-playback');
const canvas = document.getElementById('audio-visualizer');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

let mediaRecorder;
let audioChunks = [];

let audioContext;
let analyser;
let source;
let dataArray;
let animationId;
let stream;

// START optagelse
recordButton.addEventListener('click', async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // MIME-type fallback check
    let mimeType = '';
    if (MediaRecorder.isTypeSupported('audio/webm; codecs=opus')) {
      mimeType = 'audio/webm; codecs=opus';
    } else if (MediaRecorder.isTypeSupported('audio/ogg; codecs=opus')) {
      mimeType = 'audio/ogg; codecs=opus';
    } else {
      mimeType = ''; // fallback → MediaRecorder vil bruge default
      console.warn('Ingen understøttet MIME-type fundet!');
    }

    console.log('Bruger MIME-type:', mimeType);

    // Opret MediaRecorder
    mediaRecorder = new MediaRecorder(stream, { mimeType });

    audioChunks = [];

    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      const audioUrl = URL.createObjectURL(audioBlob);

      // Sæt audio player
      audioPlayback.srcObject = null;
      audioPlayback.src = audioUrl;
      audioPlayback.controls = true;
      audioPlayback.load();

      audioChunks = [];
    };

    mediaRecorder.start();

    // Setup visualizer
    audioContext = new AudioContext();
    source = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);

    animate();

    // Skift knapper
    recordButton.style.display = 'none';
    stopRecordButton.style.display = 'inline-block';

  } catch (err) {
    console.error('Error accessing microphone:', err);
    alert('Kunne ikke få adgang til mikrofonen. Tjek browser tilladelser eller prøv Live Server.');
  }
});

// STOP optagelse
stopRecordButton.addEventListener('click', () => {
  cancelAnimationFrame(animationId);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }

  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }

  if (audioContext) {
    audioContext.close();
  }

  recordButton.style.display = 'inline-block';
  stopRecordButton.style.display = 'none';
});

// VISUALIZER animation
function animate() {
  animationId = requestAnimationFrame(animate);

  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 130;   

  const bars = dataArray.length;
  const angleStep = (Math.PI * 2) / bars;

  for (let i = 0; i < bars; i++) {
    const value = dataArray[i];
    const barLength = value * 0.6;

    const angle = i * angleStep;

    const x1 = centerX + Math.cos(angle) * radius;
    const y1 = centerY + Math.sin(angle) * radius;
    const x2 = centerX + Math.cos(angle) * (radius + barLength);
    const y2 = centerY + Math.sin(angle) * (radius + barLength);

    ctx.strokeStyle = 'rgba(191, 164, 115, 0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}
