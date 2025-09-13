document.addEventListener('DOMContentLoaded', () => {
    // 要素を取得
    const fStopSlider = document.getElementById('f-stop-slider');
    const shutterSpeedSlider = document.getElementById('shutter-speed-slider');
    const fStopValueSpan = document.getElementById('f-stop-value');
    const shutterSpeedValueSpan = document.getElementById('shutter-speed-value');
    const videoElement = document.getElementById('subject-video');
    const debugLog = document.getElementById('debug-log');

    // ★★★ デバッグ機能：画面にログを表示する関数 ★★★
    function log(message, isError = false) {
        const p = document.createElement('p');
        p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        if (isError) {
            p.className = 'log-error';
        }
        debugLog.appendChild(p);
        debugLog.scrollTop = debugLog.scrollHeight; // 自動でスクロール
    }

    log("スクリプトが読み込まれました。");

    // シミュレーション更新関数
    function updateSimulation() {
        const fStop = parseFloat(fStopSlider.value);
        const shutterSpeed = parseInt(shutterSpeedSlider.value);
        fStopValueSpan.innerText = `f/${fStop.toFixed(1)}`;
        shutterSpeedValueSpan.innerText = `1/${shutterSpeed}s`;
        const blurValue = 22 / fStop;
        videoElement.style.filter = `blur(${blurValue}px)`;
        videoElement.playbackRate = (shutterSpeed < 60) ? 1.5 : 1.0;
    }

    // スライダーのイベントリスナー
    if (fStopSlider && shutterSpeedSlider) {
        fStopSlider.addEventListener('input', updateSimulation);
        shutterSpeedSlider.addEventListener('input', updateSimulation);
        log("スライダーの準備が完了しました。");
    } else {
        log("エラー: スライダーが見つかりません。", true);
    }
    
    // ★★★ デバッグ機能：ビデオの状態を監視 ★★★
    if (videoElement) {
        videoElement.addEventListener('canplay', () => {
            log("動画ファイルの再生準備ができました。");
        });
        videoElement.addEventListener('error', () => {
            log("エラー: 動画ファイルの読み込みに失敗しました！", true);
            log("`river_stream_video.mp4`が正しくアップロードされているか確認してください。", true);
        });
        videoElement.addEventListener('stalled', () => {
            log("警告: 動画のダウンロードが停止しました。");
        });
        log("動画の監視を開始しました。");
    } else {
        log("エラー: 動画要素が見つかりません。", true);
    }

    // 初期表示
    updateSimulation();
});
