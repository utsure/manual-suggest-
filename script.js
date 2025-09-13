document.addEventListener('DOMContentLoaded', () => {
    const fStopSlider = document.getElementById('f-stop-slider');
    const shutterSpeedSlider = document.getElementById('shutter-speed-slider');
    const fStopValueSpan = document.getElementById('f-stop-value');
    const shutterSpeedValueSpan = document.getElementById('shutter-speed-value');
    const videoElement = document.getElementById('subject-video');
    
    function updateSimulation() {
        if (!fStopSlider || !shutterSpeedSlider) return; // エラー防止

        const fStop = parseFloat(fStopSlider.value);
        const shutterSpeed = parseInt(shutterSpeedSlider.value);

        fStopValueSpan.innerText = `f/${fStop.toFixed(1)}`;
        shutterSpeedValueSpan.innerText = `1/${shutterSpeed}s`;
        
        const blurValue = 22 / fStop;
        videoElement.style.filter = `blur(${blurValue}px)`;
        videoElement.playbackRate = (shutterSpeed < 60) ? 1.5 : 1.0;
    }

    if (fStopSlider && shutterSpeedSlider) {
        fStopSlider.addEventListener('input', updateSimulation);
        shutterSpeedSlider.addEventListener('input', updateSimulation);
        updateSimulation(); // 初期表示
    }
});
