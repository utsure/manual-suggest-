document.addEventListener('DOMContentLoaded', () => {
    const fStopSlider = document.getElementById('f-stop-slider');
    const shutterSpeedSlider = document.getElementById('shutter-speed-slider');
    
    const fStopValueSpan = document.getElementById('f-stop-value');
    const shutterSpeedValueSpan = document.getElementById('shutter-speed-value');
    
    const videoBg = document.getElementById('video-bg');
    const videoFg = document.getElementById('video-fg');
    const exposureOverlay = document.getElementById('exposure-overlay');

    const F_STOPS = [1.4, 1.8, 2.0, 2.8, 4.0, 5.6, 8.0, 11, 16, 18, 22];
    const SHUTTER_SPEEDS = [ 2, 1.5, 1, 0.5, 0.25, 1/8, 1/15, 1/30, 1/60, 1/125, 1/250, 1/500, 1/1000, 1/2000, 1/4000 ];
    const SHUTTER_SPEEDS_DISPLAY = [ "2s", "1.5s", "1s", "1/2s", "1/4s", "1/8s", "1/15s", "1/30s", "1/60s", "1/125s", "1/250s", "1/500s", "1/1000s", "1/2000s", "1/4000s" ];

    function updateSimulation() {
        if (!fStopSlider || !shutterSpeedSlider) return;

        const fStop = F_STOPS[fStopSlider.value];
        const shutterSpeed = SHUTTER_SPEEDS[shutterSpeedSlider.value];

        fStopValueSpan.innerText = `f/${fStop}`;
        shutterSpeedValueSpan.innerText = SHUTTER_SPEEDS_DISPLAY[shutterSpeedSlider.value];

        const blurValue = (22 / fStop) * 1.5;
        videoBg.style.filter = `blur(${blurValue}px)`;
        
        videoFg.style.filter = 'none';
        videoFg.playbackRate = 1.0;

        if (shutterSpeed >= 1) {
            videoFg.style.filter = 'blur(3px) contrast(150%) brightness(120%)';
        } else if (shutterSpeed <= 1/1000) {
            videoFg.playbackRate = 0.2;
        }

        const baseExposure = Math.log2((8*8) / (1/125));
        const currentExposure = Math.log2((fStop*fStop) / shutterSpeed);
        const exposureDiff = currentExposure - baseExposure;

        if (exposureDiff > 0) {
            exposureOverlay.style.backgroundColor = '#FFF';
            exposureOverlay.style.opacity = Math.min(exposureDiff / 5, 0.8);
        } else {
            exposureOverlay.style.backgroundColor = '#000';
            exposureOverlay.style.opacity = Math.min(Math.abs(exposureDiff) / 5, 0.8);
        }
    }

    fStopSlider.addEventListener('input', updateSimulation);
    shutterSpeedSlider.addEventListener('input', updateSimulation);
    
    updateSimulation();
});
