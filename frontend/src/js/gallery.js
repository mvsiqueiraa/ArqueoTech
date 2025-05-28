// frontend/src/js/gallery.js
document.addEventListener('DOMContentLoaded', async () => {
    const gallery = document.getElementById('gallery');
    const loadingMessage = gallery.querySelector('.loading-message');

    try {
        // Busca artefatos públicos do backend
        // Certifique-se que a rota no backend (backend/routes/artifacts.js)
        // está retornando também o nome do usuário que fez o upload, se possível.
        // Ex: .populate('user', 'name') no find do Mongoose.
        const response = await fetch('/api/artifacts/public'); // Usando api.js seria melhor, mas o atual é direto
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erro ao buscar artefatos: ${response.status}`);
        }

        const artifacts = await response.json();

        if (loadingMessage) {
            loadingMessage.remove(); // Remove a mensagem de "carregando"
        }

        if (!artifacts.length) {
            gallery.innerHTML = '<p class="empty-message">Nenhum artefato público cadastrado ainda. Seja o primeiro a <a href="AddArtifact.html" style="color: var(--accent-color);">adicionar um</a>!</p>';
            return;
        }

        gallery.innerHTML = ''; // Limpa a galeria para adicionar os novos cards
        artifacts.forEach(artifact => {
            const card = document.createElement('div');
            card.className = 'artifact-card';

            // Container da imagem
            const imgContainer = document.createElement('div');
            imgContainer.className = 'artifact-img-container';

            const img = document.createElement('img');
            // Usa a primeira foto; provê uma imagem placeholder se não houver fotos
            img.src = artifact.photos && artifact.photos.length > 0 ? artifact.photos[0].url : '../../public/assets/images/VASO DE GARGALO - SITE.jpg'; // Crie uma imagem placeholder.png
            img.alt = artifact.photos && artifact.photos.length > 0 && artifact.photos[0].description ? artifact.photos[0].description : 'Artefato arqueológico';
            img.className = 'artifact-img';
            imgContainer.appendChild(img);
            card.appendChild(imgContainer);

            // Descrição
            const desc = document.createElement('div');
            desc.className = 'artifact-desc';
            desc.textContent = artifact.description || (artifact.photos && artifact.photos.length > 0 && artifact.photos[0].description) || '(Sem descrição detalhada)';
            card.appendChild(desc);
            
            // Usuário que enviou (se disponível)
            // Para isso, o backend precisa popular o campo 'user' com o nome.
            // Ex: No backend, em `backend/routes/artifacts.js`:
            // const artifacts = await Artifact.find({ public: true }).populate('user', 'name').sort({ createdAt: -1 });
            if (artifact.user && artifact.user.name) {
                const userDiv = document.createElement('div');
                userDiv.className = 'artifact-user';
                userDiv.innerHTML = `Enviado por: <strong>${artifact.user.name}</strong>`;
                card.appendChild(userDiv);
            }

            // Data de criação
            const meta = document.createElement('div');
            meta.className = 'artifact-meta';
            meta.textContent = `Registrado em: ${new Date(artifact.createdAt).toLocaleDateString('pt-BR')}`;
            card.appendChild(meta);

            // Localização (se disponível e se desejar exibir)
            if (artifact.location && artifact.location.coordinates) {
                const loc = document.createElement('div');
                loc.className = 'artifact-location';
                // Poderia ser um link para um mapa: `https://www.google.com/maps?q=${artifact.location.coordinates[1]},${artifact.location.coordinates[0]}`
                loc.textContent = `Localização: Lat: ${artifact.location.coordinates[1].toFixed(4)}, Lon: ${artifact.location.coordinates[0].toFixed(4)}`;
                card.appendChild(loc);
            }

            // Link para detalhes (se houver uma página de detalhes do artefato)
            // const detailLink = document.createElement('a');
            // detailLink.href = `artifactDetail.html?id=${artifact._id}`; // Exemplo
            // detailLink.textContent = 'Ver detalhes';
            // detailLink.className = 'btn btn-secondary-outline'; // Exemplo de classe de botão
            // card.appendChild(detailLink);

            gallery.appendChild(card);
        });
    } catch (err) {
        console.error('Erro ao carregar galeria:', err);
        if (loadingMessage) {
            loadingMessage.remove();
        }
        gallery.innerHTML = `<p class="error-message">Não foi possível carregar os artefatos. Tente novamente mais tarde. (Erro: ${err.message})</p>`;
    }
});