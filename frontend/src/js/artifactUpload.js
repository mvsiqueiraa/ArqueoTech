let selectedFiles = [];
let currentLocation = null;

// Gerenciar seleção de fotos
document.getElementById('photoUpload').addEventListener('change', function(e) {
    selectedFiles = Array.from(e.target.files).slice(0, 5); // Limite de 5 fotos
    displayPreview();
});

// Exibir pré-visualização
function displayPreview() {
    const previewContainer = document.getElementById('imagePreview');
    previewContainer.innerHTML = '';
    
    selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-img';
            previewContainer.appendChild(img);
        }
        reader.readAsDataURL(file);
    });
}

// Obter localização
function getLocation() {
    if (!navigator.geolocation) {
        alert('Geolocalização não suportada pelo navegador');
        return;
    }

    document.getElementById('locationStatus').textContent = 'Obtendo localização...';
    
    navigator.geolocation.getCurrentPosition(
        position => {
            currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            document.getElementById('locationStatus').textContent = 
                `📍 Localização obtida: ${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`;
        },
        error => {
            document.getElementById('locationStatus').textContent = 
                '❌ Erro ao obter localização';
            console.error(error);
        }
    );
}

// Enviar dados
async function submitArtifact() {
    if (!validateForm()) return;

    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('photos', file));
    formData.append('description', document.getElementById('description').value);
    formData.append('longitude', currentLocation.lng);
    formData.append('latitude', currentLocation.lat);
    formData.append('isPublic', document.getElementById('isPublic').checked);

    try {
        const response = await fetch('/api/artifacts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        if (response.ok) {
            alert('Artefato registrado com sucesso!');
            window.location.href = 'gallery.html'; // Página futura
        } else {
            throw new Error(await response.text());
        }
    } catch (error) {
        alert(`Erro: ${error.message}`);
    }
}

// Validação
function validateForm() {
    if (selectedFiles.length === 0) {
        alert('Selecione pelo menos uma foto');
        return false;
    }
    
    if (!currentLocation) {
        alert('Obtenha a localização primeiro');
        return false;
    }
    
    return true;
}
