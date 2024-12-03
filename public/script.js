document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('imageForm');
  const manipulatedImage = document.getElementById('manipulatedImage');
  const outputContainer = document.getElementById('output-container');
  const originalImage = document.getElementById('originalImage');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const file = formData.get('file');
    if (!file) return;

    try {
      const response = await fetch('http://localhost:3000/images/process', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.imageBase64) {
        manipulatedImage.src = result.imageBase64;

        const reader = new FileReader();
        reader.onloadend = function () {
          originalImage.src = reader.result;
        };
        reader.readAsDataURL(file);

        outputContainer.style.display = 'flex';
      } else {
        alert('File upload failed');
      }
    } catch (error) {
      console.error('Error during upload:', error);
    }
  });
});
