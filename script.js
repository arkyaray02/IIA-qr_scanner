const startScanButton = document.getElementById('startScan');
const resultElement = document.getElementById('result');
const cameraSelection = document.getElementById('cameraSelection');
let scanner = null;
let selectedCameraId = null;

// Function to list available cameras and populate dropdown
function populateCameraOptions() {
    Html5Qrcode.getCameras().then(devices => {
        if (devices && devices.length) {
            cameraSelection.innerHTML = ''; // Clear the dropdown

            devices.forEach(device => {
                const option = document.createElement('option');
                option.value = device.id;
                option.text = device.label || `Camera ${cameraSelection.length + 1}`;
                cameraSelection.appendChild(option);
            });

            // Automatically select the first camera
            selectedCameraId = devices[0].id;
        } else {
            alert("No cameras found!");
            console.warn("No cameras detected.");
        }
    }).catch(err => {
        console.error("Error enumerating devices:", err);
        alert("Error detecting cameras. Please ensure you have given camera access.");
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
            alert("Error starting the camera. Please check camera permissions or try another device.");
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
