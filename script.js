document.addEventListener('DOMContentLoaded', () => {
    const suggestButton = document.getElementById('suggest-button');
    const resultsDiv = document.getElementById('results');
    
    const fStopResult = document.getElementById('f-stop-result');
    const shutterSpeedResult = document.getElementById('shutter-speed-result');
    const isoResult = document.getElementById('iso-result');
    const explanationP = document.getElementById('explanation');

    suggestButton.addEventListener('click', () => {
        // 1. ユーザーの選択を取得
        const lighting = document.querySelector('input[name="lighting"]:checked').value;
        const motion = document.querySelector('input[name="motion"]:checked').value;
        const subjects = document.querySelector('input[name="subjects"]:checked').value;
        const background = document.querySelector('input[name="background"]:checked').value;
        
        // 2. ルールエンジンに基づいて設定を決定
        let fStop, shutterSpeed, iso, explanation;
        let fStopReason, shutterReason, isoReason;

        // F値を決定
        if (background === 'blurry' || subjects === 'one') {
            fStop = 2.8;
            fStopReason = "背景をぼかすため、F値を低くしました。";
        } else {
            fStop = 8;
            fStopReason = "全員にピントを合わせるため、F値を高くしました。";
        }

        // シャッタースピードを決定
        if (motion === 'moving') {
            shutterSpeed = 500;
            shutterReason = "被写体の動きを止めるため、シャッタースピードを速くしました。";
        } else {
            shutterSpeed = 125;
            shutterReason = "手ブレを防ぐ安全なシャッタースピードを選びました。";
        }

        // 明るさに応じてISOを計算
        const lightingEv = {
            sunny: 15,
            cloudy: 12,
            bright_indoor: 8,
            dim_indoor: 4
        };
        const targetEv = lightingEv[lighting];

        // 露出計算式: EV = log2(F^2 / T)  (ISO 100の時)
        // 必要なISO = 100 * 2^(ターゲットEV - 現在のEV)
        const currentEv = Math.log2((fStop * fStop) / (1 / shutterSpeed));
        let requiredIso = 100 * Math.pow(2, targetEv - currentEv);

        // ISOを標準的な値に丸める
        const standardIsos = [100, 200, 400, 800, 1600, 3200, 6400];
        iso = standardIsos.find(std => std >= requiredIso) || 6400;

        if (iso <= 200) {
            isoReason = "十分な光があるため、最高画質のISO100に設定しました。";
        } else if (iso > 200 && iso <= 800) {
            isoReason = "明るさを確保するためにISO感度を少し上げました。";
        } else {
            isoReason = "暗い環境のためISO感度を高くしました。少しノイズが出る可能性があります。";
        }
        
        // 3. 結果を表示
        fStopResult.innerText = `f/${fStop}`;
        shutterSpeedResult.innerText = `1/${shutterSpeed}s`;
        isoResult.innerText = iso;
        explanationP.innerHTML = `• ${fStopReason}<br>• ${shutterReason}<br>• ${isoReason}`;

        resultsDiv.classList.remove('hidden');
    });
});
