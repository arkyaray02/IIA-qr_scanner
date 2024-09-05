let videoStream = null;
const videoElement = document.getElementById('video');
const resultElement = document.getElementById('result');
const startScanButton = document.getElementById('startScan');

// Start camera function
function startCamera() {
    if (videoStream) {
        stopCamera(); // Stop existing stream if already active
    }

    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            videoStream = stream;
            videoElement.srcObject = stream;
            videoElement.play();
        })
        .catch((err) => {
            console.error("Error accessing camera: ", err);
        });
}

// Stop camera function
function stopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
}

// QR code scanning setup
const html5QrCode = new Html5Qrcode("video");

// Handle scan result
function onScanSuccess(decodedText, decodedResult) {
    // Stop the camera after successful scan
    stopCamera();

    // Show the result
    resultElement.innerHTML = `Ticket Holder: <strong>Admin Test</strong><br>Ticket Verified`;
    
    // Redirect to the scanned URL
    window.location.href = decodedText;
}

// Handle scan error (optional)
function onScanError(errorMessage) {
    console.warn(`QR Code scan error: ${errorMessage}`);
}

// Start scanning QR code
startScanButton.addEventListener('click', () => {
    startCamera();
    html5QrCode.start({ facingMode: "environment" }, { fps: 10, qrbox: 250 }, onScanSuccess, onScanError);
});
