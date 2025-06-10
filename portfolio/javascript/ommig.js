const currentKm = 60;
const totalKm = 300;
const progressPercent = (currentKm / totalKm) * 100;

// Load Lottie
const animation = lottie.loadAnimation({
    container: document.getElementById('lottieRunner'),
    renderer: 'canvas',
    loop: true,
    autoplay: false, // VIGTIGT! Stop autoplay
    path: 'animations/runner2.json'
});

// Funktion til at starte løbet
function startRun() {
    console.log("Start MP's løb!");

    // Start animation
    animation.play();

    // Animate progress bar fyldning
    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.transition = `width 2s ease`;
    progressBar.style.width = `${progressPercent}%`;

    // Beregn runner position
    const progressTrack = document.querySelector('.progress-track');
    const runner = document.getElementById('lottieRunner');

    const trackWidth = progressTrack.offsetWidth;
    const runnerWidth = runner.offsetWidth;
    

    const runnerX = (progressPercent / 100) * trackWidth - runnerWidth / 2;

    runner.style.transition = `transform 2s ease`;
    runner.style.transform = `translate(${runnerX}px, -50%) scale(3)`;
}

// Når DOM er klar
document.addEventListener('DOMContentLoaded', () => {
    // Når man klikker på knappen → startRun()
    document.getElementById('startButton').addEventListener('click', startRun);
});
