const startScanButton = document.getElementById('startScan');
const resultElement = document.getElementById('result');
const cameraSelection = document.getElementById('cameraSelection');
let scanner = null;
let selectedCameraId = null;

// Function to list available cameras and populate dropdown
function populateCameraOptions() {
    Html5Qrcode.getCameras().then(devices => {
        if (devices && devices.length) {
            devices.forEach(device => {
                const option = document.createElement('option');
                option.value = device.id;
                option.text = device.label || `Camera ${cameraSelection.length + 1}`;
                cameraSelection.appendChild(option);
            });
        } else {
            alert("No cameras found!");
        }
    }).catch(err => {
        console.error("Error enumerating devices:", err);
    });
}

// Initialize the QR scanner with the selected camera
function startScan() {
    if (selectedCameraId) {
        scanner = new Html5Qrcode("reader");

        // Start the scanning with the selected camera
        scanner.start(
            { deviceId: { exact: selectedCameraId } },
            {
                fps: 10,    // Frames per second
                qrbox: { width: 250, height: 250 }  // QR code scanning area
            },
            onScanSuccess, onScanError
        ).then(() => {
            console.log("Camera started successfully");
        }).catch(err => {
            console.error(`Error starting the camera: ${err}`);
        });
    }
}

// Handle scan result
function onScanSuccess(decodedText, decodedResult) {
    // Stop the camera after successful scan
    scanner.stop().then(() => {
        resultElement.innerHTML = `Ticket Holder: <strong>${decodedText}</strong><br>Ticket Verified`;
    }).catch(err => {
        console.error("Failed to stop scanning:", err);
    });
}

// Handle scan error (optional)
function onScanError(errorMessage) {
    console.warn(`QR Code scan error: ${errorMessage}`);
}

// Event to start scanning after camera selection
startScanButton.addEventListener('click', () => {
    selectedCameraId = cameraSelection.value;
    if (selectedCameraId) {
        startScan();
    } else {
        alert("Please select a camera first.");
    }
});

// Populate cameras when page loads
window.addEventListener('load', populateCameraOptions);
