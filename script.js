document.addEventListener('DOMContentLoaded', () => {
    const suggestButton = document.getElementById('suggest-button');
    const resultsDiv = document.getElementById('results');
    
    // 結果表示用の要素
    const fStopResult = document.getElementById('f-stop-result');
    const shutterSpeedResult = document.getElementById('shutter-speed-result');
    const isoResult = document.getElementById('iso-result');
    const explanationP = document.getElementById('explanation');

    // シミュレーション用の要素
    const backgroundLayer = document.getElementById('background-layer');
    const subjectImg = document.querySelector('#subject-layer img');

    // ラジオボタンの変更を監視するためのセレクタ
    const radioButtons = document.querySelectorAll('input[type="radio"][name="lighting"], input[type="radio"][name="motion"], input[type="radio"][name="subjects"], input[type="radio"][name="background"]');

    // 設定とシミュレーションを更新するメイン関数
    function updateSimulationAndSuggestions() {
        // 1. ユーザーの選択を取得
        const lighting = document.querySelector('input[name="lighting"]:checked').value;
        const motion = document.querySelector('input[name="motion"]:checked').value;
        const subjects = document.querySelector('input[name="subjects"]:checked').value;
        const background = document.querySelector('input[name="background"]:checked').value;
        
        // 2. ルールエンジンに基づいて設定を決定
        let fStop, shutterSpeed, iso;
        let fStopReason, shutterReason, isoReason;

        // --- F値の決定 ---
        if (background === 'blurry' || subjects === 'one') {
            fStop = 2.8; // 背景をぼかす
            fStopReason = "背景をぼかすため、F値を低くしました (f/2.8)。";
        } else {
            fStop = 8.0; // 背景もくっきり
            fStopReason = "人物と背景の両方にピントを合わせるため、F値を高くしました (f/8)。";
        }

        // --- シャッタースピードの決定 ---
        if (motion === 'moving') {
            shutterSpeed = 500; // 動きを止める
            shutterReason = "被写体の動きを止めるため、シャッタースピードを速くしました (1/500s)。";
        } else {
            shutterSpeed = 125; // 手ブレ防止
            shutterReason = "手ブレを防ぐ安全なシャッタースピードを選びました (1/125s)。";
        }

        // --- ISO感度の決定 ---
        const lightingEv = {
            sunny: 15, // 晴れた屋外
            cloudy: 12, // 曇り・日陰
            bright_indoor: 8, // 明るい室内
            dim_indoor: 4 // 暗い室内・夜
        };
        const targetEv = lightingEv[lighting];

        // ISO 100を基準とした露出計算式: EV = log2(F^2 / T)
        const currentEvAtIso100 = Math.log2((fStop * fStop) / (1 / shutterSpeed));
        let requiredIso = 100 * Math.pow(2, targetEv - currentEvAtIso100);

        // ISOを標準的な値に丸める
        const standardIsos = [100, 200, 400, 800, 1600, 3200, 6400, 12800];
        iso = standardIsos.find(std => std >= requiredIso) || 12800;

        if (iso <= 200) {
            isoReason = "十分な光があるため、最高画質のISO感度に設定しました。";
        } else if (iso > 200 && iso <= 1600) {
            isoReason = "明るさを確保するためにISO感度を調整しました。";
        } else {
            isoReason = "暗い環境のためISO感度を高くしました。少し画質が荒れる可能性があります。";
        }
        
        // 3. 結果をHTML要素に表示
        fStopResult.innerText = `f/${fStop}`;
        shutterSpeedResult.innerText = `1/${shutterSpeed}s`;
        isoResult.innerText = iso;
        explanationP.innerHTML = `• ${fStopReason}<br>• ${shutterReason}<br>• ${isoReason}`;

        resultsDiv.classList.remove('hidden'); // 結果表示エリアを表示

        // 4. シミュレーションを更新
        // F値に応じて背景のボケ具合を更新
        // F値が小さいほどボケが強くなる (blurの値が大きくなる)
        const blurValue = (16 / fStop) * 2; // 調整して視覚的な効果を高める
        backgroundLayer.style.filter = `blur(${blurValue}px)`;
        
        // シャッタースピードに応じて動きのブレを更新
        subjectImg.style.animation = 'none'; // まずはアニメーションをリセット

        if (motion === 'moving') {
            // シャッタースピードが遅いほどブレが強くなる
            if (shutterSpeed >= 250) { // 速いシャッタースピード
                subjectImg.style.animation = 'motionBlurLight 0.5s ease-out infinite alternate';
            } else if (shutterSpeed >= 60) { // 中くらいのシャッタースピード
                subjectImg.style.animation = 'motionBlurMedium 0.8s ease-in-out infinite alternate';
            } else { // 遅いシャッタースピード
                subjectImg.style.animation = 'motionBlurHeavy 1.2s ease-in-out infinite alternate';
            }
        }
    }

    // 「提案」ボタンがクリックされたら更新関数を呼び出す
    if (suggestButton) {
        suggestButton.addEventListener('click', updateSimulationAndSuggestions);
    }

    // ページ読み込み時とラジオボタン変更時に初期表示とシミュレーションを更新
    // (これで「提案」ボタンを押す前にイメージが見えるようになる)
    radioButtons.forEach(radio => {
        radio.addEventListener('change', updateSimulationAndSuggestions);
    });

    // 初回ロード時に一度実行
    updateSimulationAndSuggestions();
});
