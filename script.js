document.addEventListener('DOMContentLoaded', () => {
    // 要素を取得
    const fStopSlider = document.getElementById('f-stop-slider');
    const shutterSpeedSlider = document.getElementById('shutter-speed-slider');
    
    const fStopValueSpan = document.getElementById('f-stop-value');
    const shutterSpeedValueSpan = document.getElementById('shutter-speed-value');
    
    const backgroundLayer = document.getElementById('background-layer');
    const subjectShape = document.querySelector('.subject-shape');
    
    const isoResultSpan = document.getElementById('iso-result');

    function updateSimulation() {
        const fStop = parseFloat(fStopSlider.value);
        const shutterSpeed = parseInt(shutterSpeedSlider.value);

        fStopValueSpan.innerText = `f/${fStop.toFixed(1)}`;
        shutterSpeedValueSpan.innerText = `1/${shutterSpeed}s`;

        const blurValue = 16 / fStop;
        backgroundLayer.style.filter = `blur(${blurValue}px)`;
        
        if (shutterSpeed < 60) {
            const motionBlurDuration = 60 / shutterSpeed * 0.1;
            subjectShape.style.animation = `motionBlur ${motionBlurDuration}s ease-in-out infinite alternate`;
        } else {
            subjectShape.style.animation = 'none';
        }

        const targetEv = 12; // 曇り/日陰の明るさ(EV値)を固定で想定
        const currentEv = Math.log2((fStop * fStop) / (1 / shutterSpeed));
        let requiredIso = 100 * Math.pow(2, targetEv - currentEv);

        const standardIsos = [100, 200, 400, 800, 1600, 3200, 6400];
        const iso = standardIsos.find(std => std >= requiredIso) || 6400;
        isoResultSpan.innerText = iso;
    }

    fStopSlider.addEventListener('input', updateSimulation);
    shutterSpeedSlider.addEventListener('input', updateSimulation);

    updateSimulation();
});
