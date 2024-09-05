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
    
    // Ensure scanner instance is initialized only once
    if (!scanner) {
        scanner = new Html5Qrcode("reader");
    }

    // Stop scanning if it's already running
    if (isScanning) {
        scanner.stop().then(() => {
            isScanning = false;
            startScan();
        }).catch(err => {
            console.error("Failed to stop the scanner:", err);
        });
    } else {
        startScan();
    }
}

function startScan() {
    // Start the scanning with the selected camera
    if (selectedCameraId) {
        scanner.start(
            { deviceId: { exact: selectedCameraId } },
            {
                fps: 10,    // Frames per second
                qrbox: { width: 250, height: 250 }  // QR code scanning area
            },
            onScanSuccess, onScanError
        ).then(() => {
            isScanning = true;  // Scanning started
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

    // You can handle the decodedText result as you need (like redirecting to the scanned URL)
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
