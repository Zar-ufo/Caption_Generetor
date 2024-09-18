function triggerFileInput() {
    document.getElementById('image-input').click();
}

function loadImage() {
    const input = document.getElementById('image-input');
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgElement = document.createElement('img');
            imgElement.src = e.target.result;
            imgElement.classList.add('image-preview');

            const previewSection = document.querySelector('.image-preview-section');
            previewSection.innerHTML = '';  // Clear any previous images
            previewSection.appendChild(imgElement);

            // Enable the Generate Caption button after an image is loaded
            document.querySelector('.generate-btn').disabled = false;
        };
        reader.readAsDataURL(file);
    }
}

function generateCaption() {
    const input = document.getElementById('image-input');
    const file = input.files[0];

    if (file) {
        // Display the "Loading caption..." message
        document.getElementById('caption-text').textContent = "Loading caption...";

        // Call function to upload the image and generate a caption
        uploadImage(file);
    }
}

function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById('caption-text').textContent = data.error;
        } else {
            const caption = data.caption;
            document.getElementById('caption-text').textContent = caption;

            // Call text-to-speech function
            speakText(caption);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('caption-text').textContent = "Error generating caption.";
    });
}

document.getElementById('image-input').addEventListener('change', loadImage);

// Text-to-speech function
function speakText(text) {
    if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'en-US';  // You can set the language
        speech.pitch = 1;       // Set the pitch (optional)
        speech.rate = 1;        // Set the speed rate (optional)
        window.speechSynthesis.speak(speech);
    } else {
        console.log('Text-to-speech not supported in this browser.');
    }
}
