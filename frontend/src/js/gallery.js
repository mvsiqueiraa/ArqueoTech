// gallery.js

document.addEventListener('DOMContentLoaded', async () => {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '<p>Carregando artefatos...</p>';

    try {
        // Busca artefatos públicos do backend
        const response = await fetch('/api/artifacts/public');
        if (!response.ok) throw new Error('Erro ao buscar artefatos');

        const artifacts = await response.json();
        if (!artifacts.length) {
            gallery.innerHTML = '<p>Nenhum artefato público cadastrado ainda.</p>';
            return;
        }

        gallery.innerHTML = '';
        artifacts.forEach(artifact => {
            const card = document.createElement('div');
            card.className = 'artifact-card';

            // Foto principal
            const img = document.createElement('img');
            img.src = artifact.photos[0]?.url || '../assets/images/no-image.png';
            img.alt = 'Artefato';
            img.className = 'artifact-img';
            card.appendChild(img);

            // Descrição
            const desc = document.createElement('div');
            desc.className = 'artifact-desc';
            desc.textContent = artifact.photos[0]?.description || artifact.description || '(Sem descrição)';
            card.appendChild(desc);

            // Data e usuário (opcional)
            const meta = document.createElement('div');
            meta.className = 'artifact-meta';
            meta.textContent = `Enviado em: ${new Date(artifact.createdAt).toLocaleDateString()}`;
            card.appendChild(meta);

            // Localização
            if (artifact.location && artifact.location.coordinates) {
                const loc = document.createElement('div');
                loc.className = 'artifact-location';
                loc.textContent = `Localização: ${artifact.location.coordinates[1].toFixed(4)}, ${artifact.location.coordinates[0].toFixed(4)}`;
                card.appendChild(loc);
            }

            // Botão para ver detalhes (opcional)
            // const btn = document.createElement('a');
            // btn.href = `artifactDetail.html?id=${artifact._id}`;
            // btn.textContent = 'Ver detalhes';
            // btn.className = 'detail-btn';
            // card.appendChild(btn);

            gallery.appendChild(card);
        });
    } catch (err) {
        gallery.innerHTML = `<p>Erro: ${err.message}</p>`;
    }
});
