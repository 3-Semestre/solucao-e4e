document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const teacherImage = document.getElementById('teacherImage');

    // Carregar imagem do localStorage, se existir
    const savedImage = localStorage.getItem('teacherImage');
    if (savedImage) {
        teacherImage.src = savedImage; // Define a imagem se já existir no localStorage
        teacherImage.style.display = 'block'; // Exibe a imagem
    }

    // Evento para selecionar a imagem
    fileInput.addEventListener('change', function() {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();

            // Verificar se o arquivo é uma imagem
            if (!file.type.startsWith('image/')) {
                return; // Retorna sem fazer nada se não for uma imagem
            }

            reader.onload = function(e) {
                teacherImage.src = e.target.result; // Substitui a imagem
                teacherImage.style.display = 'block'; // Exibe a imagem

                // Salva a imagem no localStorage
                localStorage.setItem('teacherImage', e.target.result);
            };

            reader.readAsDataURL(file); // Lê o arquivo como URL
        }
    });
});
