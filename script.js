document.addEventListener('DOMContentLoaded', () => {
    const fStopSlider = document.getElementById('f-stop-slider');
    const shutterSpeedSlider = document.getElementById('shutter-speed-slider');
    
    const fStopValueSpan = document.getElementById('f-stop-value');
    const shutterSpeedValueSpan = document.getElementById('shutter-speed-value');
    
    const videoBg = document.getElementById('video-bg');
    const videoFg = document.getElementById('video-fg');
    const exposureOverlay = document.getElementById('exposure-overlay');

    const F_STOPS = [1.4, 1.8, 2.0, 2.8, 4.0, 5.6, 8.0, 11, 16, 18, 22];
    const SHUTTER_SPEEDS = [ 2, 1, 0.5, 1/4, 1/8, 1/15, 1/30, 1/60, 1/125, 1/250, 1/500, 1/1000, 1/2000, 1/4000, 1/8000 ];
    const SHUTTER_SPEEDS_DISPLAY = [ "2s", "1s", "1/2s", "1/4s", "1/8s", "1/15s", "1/30s", "1/60s", "1/125s", "1/250s", "1/500s", "1/1000s", "1/2000s", "1/4000s", "1/8000s" ];

    function updateSimulation() {
        if (!fStopSlider || !shutterSpeedSlider) return;

        const fStop = F_STOPS[fStopSlider.value];
        const shutterSpeed = SHUTTER_SPEEDS[shutterSpeedSlider.value];

        fStopValueSpan.innerText = `f/${fStop}`;
        shutterSpeedValueSpan.innerText = SHUTTER_SPEEDS_DISPLAY[shutterSpeedSlider.value];

        // F値に応じて背景のボケ具合をシミュレーション
        const blurValue = (22 / fStop) * 1.5;
        videoBg.style.filter = `blur(${blurValue}px)`;
        
        // シャッタースピードに応じて動きの表現をシミュレーション
        videoFg.style.filter = 'none';
        videoFg.playbackRate = 1.0;
        if (shutterSpeed >= 0.5) {
            videoFg.style.filter = 'blur(4px) contrast(150%) brightness(120%)';
        } else if (shutterSpeed <= 1/2000) {
            videoFg.playbackRate = 0.2;
        }

        // ★★★ 露出（明るさ）のシミュレーションを強化 ★★★
        // 基準露出: f/8, 1/125s を「ちょうど良い明るさ(0)」とする
        const baseExposure = Math.log2((8*8) / (1/125));
        const currentExposure = Math.log2((fStop*fStop) / shutterSpeed);
        const exposureDiff = currentExposure - baseExposure; // 基準との光量の差(stop単位)

        // 露出オーバー（明るすぎ）
        if (exposureDiff > 0.5) { // 少しのオーバーは許容
            exposureOverlay.style.backgroundColor = '#FFFFFF';
            // 明るくなるほど透明度を下げる（白くする）
            exposureOverlay.style.opacity = Math.min(exposureDiff / 6, 0.7); // 6stopオーバーで最大
        } 
        // 露出アンダー（暗すぎ）
        else if (exposureDiff < -0.5) { // 少しのアンダーは許容
            exposureOverlay.style.backgroundColor = '#000000';
            // 暗くなるほど透明度を下げる（黒くする）
            exposureOverlay.style.opacity = Math.min(Math.abs(exposureDiff) / 6, 0.85); // 6stopアンダーで最大
        }
        // ちょうど良い明るさ
        else {
            exposureOverlay.style.opacity = 0;
        }
    }

    fStopSlider.addEventListener('input', updateSimulation);
    shutterSpeedSlider.addEventListener('input', updateSimulation);
    
    // 初期表示
    updateSimulation();
});
