document.addEventListener('DOMContentLoaded', () => {
    const fStopSlider = document.getElementById('f-stop-slider');
    const shutterSpeedSlider = document.getElementById('shutter-speed-slider');
    
    const fStopValueSpan = document.getElementById('f-stop-value');
    const shutterSpeedValueSpan = document.getElementById('shutter-speed-value');
    
    const videoBg = document.getElementById('video-bg');
    const videoFg = document.getElementById('video-fg');
    const exposureOverlay = document.getElementById('exposure-overlay');

    // 標準的なF値とシャッタースピードのリスト
    const F_STOPS = [1.4, 1.8, 2.0, 2.8, 4.0, 5.6, 8.0, 11, 16, 18, 22];
    const SHUTTER_SPEEDS = [ 2, 1, 0.5, 1/4, 1/8, 1/15, 1/30, 1/60, 1/125, 1/250, 1/500, 1/1000, 1/2000, 1/4000, 1/8000 ];
    const SHUTTER_SPEEDS_DISPLAY = [ "2s", "1s", "1/2s", "1/4s", "1/8s", "1/15s", "1/30s", "1/60s", "1/125s", "1/250s", "1/500s", "1/1000s", "1/2000s", "1/4000s", "1/8000s" ];

    function updateSimulation() {
        if (!fStopSlider || !shutterSpeedSlider) return;

        const fStop = F_STOPS[fStopSlider.value];
        const shutterSpeed = SHUTTER_SPEEDS[shutterSpeedSlider.value];

        fStopValueSpan.innerText = `f/${fStop}`;
        shutterSpeedValueSpan.innerText = SHUTTER_SPEEDS_DISPLAY[shutterSpeedSlider.value];

        // --- 1. F値に応じて背景のボケ具合をシミュレーション ---
        const blurValue = (22 / fStop) * 1.5;
        videoBg.style.filter = `blur(${blurValue}px)`;
        
        // --- 2. シャッタースピードに応じて動きの表現をシミュレーション ---
        videoFg.style.filter = 'none';
        videoFg.playbackRate = 1.0;

        if (shutterSpeed >= 0.5) { // 0.5秒以上のスローシャッター
            // 川の流れを絹のように見せるエフェクト (ブラー + 彩度低下 + コントラスト・明るさUP)
            const slowShutterBlur = shutterSpeed * 4; // 2秒で8pxのブラー
            videoFg.style.filter = `blur(${slowShutterBlur}px) saturate(50%) contrast(150%) brightness(120%)`;
        } else if (shutterSpeed <= 1/2000) { // 1/2000秒以上の高速シャッター
            // 水滴が止まって見えるエフェクト (再生速度を極端に遅くする)
            videoFg.playbackRate = 0.1;
        }

        // --- 3. 露出（明るさ）をシミュレーション ---
        // 基準露出: f/8, 1/125s (EV約14)
        const baseExposure = Math.log2((8*8) / (1/125));
        const currentExposure = Math.log2((fStop*fStop) / shutterSpeed);
        const exposureDiff = currentExposure - baseExposure; // 基準との光量の差(stop単位)

        // 露出オーバー（明るすぎ）
        if (exposureDiff > 0) {
            exposureOverlay.style.backgroundColor = '#FFF';
            // 光量が2倍(1stop)ごとに明るさを指数関数的に増やす
            exposureOverlay.style.opacity = Math.min(0.15 * Math.pow(2, exposureDiff) - 0.15, 0.9);
        } 
        // 露出アンダー（暗すぎ）
        else {
            exposureOverlay.style.backgroundColor = '#000';
            exposureOverlay.style.opacity = Math.min(Math.abs(exposureDiff) / 5, 0.85);
        }
    }

    fStopSlider.addEventListener('input', updateSimulation);
    shutterSpeedSlider.addEventListener('input', updateSimulation);
    
    // 初期表示
    updateSimulation();
});
