document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const uploadButton = document.getElementById('uploadButton');
    const teacherImage = document.getElementById('teacherImage');

    // Carregar imagem do localStorage, se existir
    const savedImage = localStorage.getItem('teacherImage');
    if (savedImage) {
        teacherImage.src = savedImage;
    }

    if (uploadButton && fileInput && teacherImage) {
        uploadButton.addEventListener('click', function() {
            const file = fileInput.files[0];
            if (file) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    teacherImage.src = e.target.result; // Substitui a imagem
                    localStorage.setItem('teacherImage', e.target.result); // Armazena no localStorage
                };

                reader.readAsDataURL(file); // Lê o arquivo como URL
            } else {
                alert('Por favor, selecione uma imagem.');
            }
        });
    } else {
        console.error('Um ou mais elementos não foram encontrados.');
    }
});
