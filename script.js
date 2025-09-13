document.addEventListener('DOMContentLoaded', () => {
    // 要素を取得
    const fStopSlider = document.getElementById('f-stop-slider');
    const shutterSpeedSlider = document.getElementById('shutter-speed-slider');
    
    const fStopValueSpan = document.getElementById('f-stop-value');
    const shutterSpeedValueSpan = document.getElementById('shutter-speed-value');
    
    const videoElement = document.getElementById('subject-video');
    
    const isoResultSpan = document.getElementById('iso-result');

    function updateSimulation() {
        // --- 1. スライダーから現在の値を取得 ---
        const fStop = parseFloat(fStopSlider.value);
        const shutterSpeed = parseInt(shutterSpeedSlider.value);

        // --- 2. 値を画面に表示 ---
        fStopValueSpan.innerText = `f/${fStop.toFixed(1)}`;
        shutterSpeedValueSpan.innerText = `1/${shutterSpeed}s`;

        // --- 3. F値とシャッタースピードに応じて映像の見た目をシミュレーション ---
        // F値が小さいほどボケが強くなる
        const backgroundBlur = 22 / fStop; // F値に反比例してボケを計算
        
        // シャッタースピードが遅いほどモーションブラー（動きのブレ）が強くなる
        // 1/30sあたりからブレが顕著になるため、その付近で効果を強める
        const motionBlur = (shutterSpeed < 30) ? (30 - shutterSpeed) * 0.5 : 0;
        
        // CSSのfilterプロパティを組み合わせて適用
        videoElement.style.filter = `blur(${backgroundBlur}px)`;
        
        // シャッタースピードは再生速度で「ブレ感」を擬似的に表現
        // シャッタースピードが遅い -> 時間が長く流れる -> 再生速度を上げる
        if (shutterSpeed < 15) {
            videoElement.playbackRate = 2.0; // とても滑らか（スローシャッター）
        } else if (shutterSpeed < 60) {
            videoElement.playbackRate = 1.5; // 少し滑らか
        } else {
            videoElement.playbackRate = 1.0; // 通常速度
        }

        // --- 4. ISO感度を自動予測 ---
        const targetEv = 12; // 曇り/日陰の明るさ(EV値)を固定で想定
        const currentEv = Math.log2((fStop * fStop) / (1 / shutterSpeed));
        let requiredIso = 100 * Math.pow(2, targetEv - currentEv);

        const standardIsos = [100, 200, 400, 800, 1600, 3200, 6400];
        const iso = standardIsos.find(std => std >= requiredIso) || 6400;
        isoResultSpan.innerText = iso;
    }

    // スライダーが動かされたときに関数を呼び出す
    fStopSlider.addEventListener('input', updateSimulation);
    shutterSpeedSlider.addEventListener('input', updateSimulation);

    // 初期表示
    updateSimulation();
});
