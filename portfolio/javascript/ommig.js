// Her sætter jeg hvor langt jeg er løbet indtil videre
const currentKm = 76;
const totalKm = 300;
const progressPercent = (currentKm / totalKm) * 100;

// Her loader jeg min Lottie animation af MP figuren der løber
const animation = lottie.loadAnimation({
    container: document.getElementById('lottieRunner'),
    renderer: 'svg', // svg gør det skarpt og pænt
    loop: true,
    autoplay: false, // vil ikke starte med det samme
    path: 'animations/runner2.json'
});

// Jeg laver en flag så jeg ved hvornår Lottie er klar
let isLottieReady = false;

// Når Lottie er loadet ind i DOM'en (så jeg kan måle ting)
animation.addEventListener('DOMLoaded', () => {
    console.log("Lottie er nu loadet ind - klar til at bruge.");
    isLottieReady = true;
});

// Når man klikker på min 'Start mit løb' knap, så kører denne funktion
function startRun() {
    console.log("Start mit løb er trykket på");

    // Hvis Lottie ikke er klar endnu → så skal vi ikke gøre noget endnu
    if (!isLottieReady) {
        console.warn("Lottie er ikke klar endnu - vent lige.");
        return;
    }

    // Starter selve løbe-animationen
    animation.play();

    // Her animerer jeg progress bar fyldningen
    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.transition = `width 2s ease`; // smooth animation
    progressBar.style.width = `${progressPercent}%`;

    // Så skal jeg regne ud hvor langt figuren skal flyttes hen
    const progressTrack = document.querySelector('.progress-track');
    const runner = document.getElementById('lottieRunner');

    const trackWidth = progressTrack.offsetWidth;
    const runnerWidth = runner.offsetWidth;

    // Denne offset bruger jeg for at få figuren til at starte lidt længere til venstre
    // Så det ser naturligt ud (ellers står han for langt fremme)
    const runnerOffset = -4; // kan justeres op/ned

    // Her regner jeg ud hvor han skal stå (baseret på hvor langt jeg er nået)
    const runnerX = (progressPercent / 100) * trackWidth - runnerWidth / 2 + runnerOffset;

    // Nu flytter jeg min MP hen hvor han skal stå
    runner.style.transition = `transform 2s ease`;
    runner.style.transform = `translate(${runnerX}px, -50%) scale(3)`; // skalerer ham også op så man kan se ham tydeligt
}

// Når hele DOM'en er klar (dvs. siden er loaded), så sætter jeg en lytter på knappen
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startButton').addEventListener('click', startRun);
});
