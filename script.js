const startScanButton = document.getElementById('startScan');
const resultElement = document.getElementById('result');
const cameraSelection = document.getElementById('cameraSelection');
let scanner = null;
let isScanning = false;
let selectedCameraId = null;

// Function to list available cameras and populate dropdown
function populateCameraOptions() {
    navigator.mediaDevices.enumerateDevices().then(devices => {
        devices.forEach(device => {
            if (device.kind === 'videoinput') {
                const option = document.createElement('option');
                option.value = device.deviceId;
                option.text = device.label || `Camera ${cameraSelection.length + 1}`;
                cameraSelection.appendChild(option);
            }
        });
    }).catch(err => {
        console.error("Error enumerating devices:", err);
    });
}

// Initialize the QR scanner with the selected camera
function initializeScanner() {
    selectedCameraId = cameraSelection.value;
    
    if (!scanner) {
        scanner = new Html5Qrcode("reader");
    }

    if (!isScanning && selectedCameraId) {
        scanner.start({ deviceId: { exact: selectedCameraId } }, {
            fps: 10, qrbox: 250
        }, onScanSuccess, onScanError)
        .then(() => {
            isScanning = true;
        }).catch(err => {
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

    // Redirect to the scanned URL (or handle result as needed)
    window.location.href = decodedText;
}

// Handle scan error (optional)
function onScanError(errorMessage) {
    console.warn(`QR Code scan error: ${errorMessage}`);
}

// Start scanning QR code when button is clicked
startScanButton.addEventListener('click', () => {
    if (cameraSelection.value) {
        initializeScanner();
    } else {
        alert("Please select a camera to start scanning.");
    }
});

// Populate cameras when page loads
window.addEventListener('load', populateCameraOptions);
