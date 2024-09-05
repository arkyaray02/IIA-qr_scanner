const startScanButton = document.getElementById('startScan');
const resultElement = document.getElementById('result');
let scanner = null;
let isScanning = false;

// QR code scanning setup
function initializeScanner() {
    if (!scanner) {
        scanner = new Html5Qrcode("reader");
    }

    if (!isScanning) {
        scanner.start({ facingMode: "environment" }, {
            fps: 10, qrbox: 250
        }, onScanSuccess, onScanError)
        .catch(err => {
            console.error(`Error starting the camera: ${err}`);
        });
    }
}

// Handle scan result
function onScanSuccess(decodedText, decodedResult) {
    // Stop the camera after successful scan
    scanner.stop().then(() => {
        isScanning = false;
    }).catch(err => {
        console.error("Failed to stop scanning:", err);
    });

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
    initializeScanner();
    isScanning = true;
});
