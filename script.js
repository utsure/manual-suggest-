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
    const SHUTTER_SPEEDS = [
        2, 1.5, 1, 0.8, 0.5, 0.25, // スローシャッター (秒)
        1/4, 1/8, 1/15, 1/30, 1/60, 1/125, 1/250, 1/500, 1/1000, 1/2000, 1/4000 // 高速シャッター (分数)
    ];
    const SHUTTER_SPEEDS_DISPLAY = [
        "2s", "1.5s", "1s", "1/1.3s", "1/2s", "1/4s",
        "1/4s", "1/8s", "1/15s", "1/30s", "1/60s", "1/125s", "1/250s", "1/500s", "1/1000s", "1/2000s", "1/4000s"
    ];

    function updateSimulation() {
        // --- 1. スライダーの値からF値とシャッタースピードを取得 ---
        const fStop = F_STOPS[fStopSlider.value];
        const shutterSpeed = SHUTTER_SPEEDS[shutterSpeedSlider.value];

        fStopValueSpan.innerText = `f/${fStop}`;
        shutterSpeedValueSpan.innerText = SHUTTER_SPEEDS_DISPLAY[shutterSpeedSlider.value];

        // --- 2. F値に応じて背景のボケ具合をシミュレーション ---
        const blurValue = (22 / fStop) * 1.5;
        videoBg.style.filter = `blur(${blurValue}px)`;
        
        // --- 3. シャッタースピードに応じて動きの表現をシミュレーション ---
        // まず全てのエフェクトをリセット
        videoFg.style.filter = 'none';
        videoFg.playbackRate = 1.0;

        if (shutterSpeed >= 1) { // 1秒以上のスローシャッター
            // 川の流れを絹のように見せるエフェクト
            videoFg.style.filter = 'blur(3px) contrast(150%) brightness(120%)';
        } else if (shutterSpeed <= 1/1000) { // 1/1000秒以上の高速シャッター
            // 水滴が止まって見えるエフェクト
            videoFg.playbackRate = 0.2;
        }

        // --- 4. 露出（明るさ）をシミュレーション ---
        // 基準露出: f/8, 1/125s (EV約14)
        const baseExposure = Math.log2((8*8) / (1/125));
        const currentExposure = Math.log2((fStop*fStop) / shutterSpeed);
        const exposureDiff = currentExposure - baseExposure; // 基準との光量の差(stop単位)

        // 光量が2倍(1stop)になるごとに明るさ(opacity)を調整
        // 露出オーバー（明るすぎ）
        if (exposureDiff > 0) {
            exposureOverlay.style.backgroundColor = '#FFF';
            exposureOverlay.style.opacity = Math.min(exposureDiff / 5, 0.8); // 5stopで最大
        } 
        // 露出アンダー（暗すぎ）
        else {
            exposureOverlay.style.backgroundColor = '#000';
            exposureOverlay.style.opacity = Math.min(Math.abs(exposureDiff) / 5, 0.8);
        }
    }

    fStopSlider.addEventListener('input', updateSimulation);
    shutterSpeedSlider.addEventListener('input', updateSimulation);
    
    // 初期表示
    updateSimulation();
});
