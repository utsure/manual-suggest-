document.addEventListener('DOMContentLoaded', () => {
    // 要素を取得
    const fStopSlider = document.getElementById('f-stop-slider');
    const shutterSpeedSlider = document.getElementById('shutter-speed-slider');
    
    const fStopValueSpan = document.getElementById('f-stop-value');
    const shutterSpeedValueSpan = document.getElementById('shutter-speed-value');
    
    const backgroundLayer = document.getElementById('background-layer');
    const subjectImg = document.querySelector('#subject-layer img');
    
    const isoResultSpan = document.getElementById('iso-result');

    // シミュレーションとISO計算を更新するメイン関数
    function updateSimulation() {
        // --- 1. スライダーから現在の値を取得 ---
        const fStop = parseFloat(fStopSlider.value);
        const shutterSpeed = parseInt(shutterSpeedSlider.value);

        // --- 2. 値を画面に表示 ---
        fStopValueSpan.innerText = `f/${fStop.toFixed(1)}`;
        shutterSpeedValueSpan.innerText = `1/${shutterSpeed}s`;

        // --- 3. F値に応じて背景のボケ具合をシミュレーション ---
        // F値が小さいほどボケが強くなる (blurの値が大きくなる)
        const blurValue = 16 / fStop; // 単純な反比例で計算
        backgroundLayer.style.filter = `blur(${blurValue}px)`;
        
        // --- 4. シャッタースピードに応じて動きのブレをシミュレーション ---
        // シャッタースピードが遅いほどブレが強くなる (animation-durationが長くなる)
        if (shutterSpeed < 60) {
            // アニメーションを適用してブレを表現
            const motionBlurDuration = 60 / shutterSpeed * 0.2;
            subjectImg.style.animation = `motionBlur ${motionBlurDuration}s ease-in-out infinite alternate`;
        } else {
            // アニメーションを解除して動きを止める
            subjectImg.style.animation = 'none';
        }
        // CSSにアニメーションを動的に追加
        const styleSheet = document.styleSheets[0];
        const keyframes = `@keyframes motionBlur { 0% { transform: translateX(-${60/shutterSpeed}px); } 100% { transform: translateX(${60/shutterSpeed}px); } }`;
        // 既存のルールがあれば削除してから追加
        if (styleSheet.cssRules.length > 100) { // 仮のルール数
             try{ styleSheet.deleteRule(styleSheet.cssRules.length-1); } catch(e){}
        }
        try{ styleSheet.insertRule(keyframes, styleSheet.cssRules.length); } catch(e){}

        // --- 5. ISO感度を自動予測 ---
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
