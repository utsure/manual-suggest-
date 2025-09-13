document.addEventListener('DOMContentLoaded', () => {
    // ラジオボタンの要素を全て取得
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    
    // シミュレーション用の要素
    const backgroundLayer = document.getElementById('background-layer');
    const subjectImg = document.querySelector('#subject-layer img');
    
    // 結果表示用の要素
    const fStopResult = document.getElementById('f-stop-result');
    const shutterSpeedResult = document.getElementById('shutter-speed-result');
    const isoResult = document.getElementById('iso-result');
    const explanationP = document.getElementById('explanation');

    // 設定とシミュレーションを更新するメイン関数
    function updateAll() {
        // 1. ユーザーの選択を取得
        const lighting = document.querySelector('input[name="lighting"]:checked').value;
        const motion = document.querySelector('input[name="motion"]:checked').value;
        // subjectsはF値に影響するため、backgroundと一緒に評価
        const subjects = document.querySelector('input[name="subjects"]:checked').value;
        const background = document.querySelector('input[name="background"]:checked').value;
        
        // 2. ルールエンジンに基づいて設定を決定
        let fStop, shutterSpeed, iso;
        let fStopReason, shutterReason, isoReason;

        // --- F値の決定 ---
        const isPortrait = (background === 'blurry' || subjects === 'one');
        fStop = isPortrait ? 2.8 : 8.0;
        fStopReason = isPortrait ? "背景をぼかすため、F値を低くしました (f/2.8)。" : "全体にピントを合わせるため、F値を高くしました (f/8)。";

        // --- シャッタースピードの決定 ---
        const isMoving = (motion === 'moving');
        shutterSpeed = isMoving ? 500 : 125;
        shutterReason = isMoving ? "被写体の動きを止めるため、シャッタースピードを速くしました (1/500s)。" : "手ブレを防ぐ安全なシャッタースピードを選びました (1/125s)。";

        // --- ISO感度の決定 ---
        const lightingEv = { sunny: 15, cloudy: 12, bright_indoor: 8, dim_indoor: 4 };
        const targetEv = lightingEv[lighting];
        const currentEvAtIso100 = Math.log2((fStop * fStop) / (1 / shutterSpeed));
        let requiredIso = 100 * Math.pow(2, targetEv - currentEvAtIso100);
        const standardIsos = [100, 200, 400, 800, 1600, 3200, 6400, 12800];
        iso = standardIsos.find(std => std >= requiredIso) || 12800;
        isoReason = (iso <= 200) ? "十分な光があるため、最高画質のISO感度に設定しました。" : 
                    (iso <= 1600) ? "明るさを確保するためにISO感度を調整しました。" : 
                    "暗い環境のためISO感度を高くしました。画質が荒れる可能性があります。";
        
        // 3. 結果をHTML要素に表示
        fStopResult.innerText = `f/${fStop}`;
        shutterSpeedResult.innerText = `1/${shutterSpeed}s`;
        isoResult.innerText = iso;
        explanationP.innerHTML = `• ${fStopReason}<br>• ${shutterReason}<br>• ${isoReason}`;

        // 4. シミュレーションを更新
        const blurValue = (16 / fStop) * 1.5;
        backgroundLayer.style.filter = `blur(${blurValue}px)`;
        
        subjectImg.style.animation = 'none';
        if (isMoving && shutterSpeed < 250) {
            const blurDuration = 125 / shutterSpeed * 0.5;
            subjectImg.style.animation = `motionBlur ${blurDuration}s ease-in-out infinite alternate`;
        }
    }

    // いずれかのラジオボタンが変更されたら、全ての情報を更新
    radioButtons.forEach(radio => {
        radio.addEventListener('change', updateAll);
    });

    // 初回ロード時に一度実行して、初期状態を表示
    updateAll();
});
