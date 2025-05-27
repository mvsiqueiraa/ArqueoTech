const MODEL_PATH = "../../public/models/my_model/";

// Sistema de estado global
const state = {
    model: null,
    webcam: null,
    maxPredictions: 0,
    isWebcamActive: false,
    webcamInterval: null
};

// Adicionar aqui a função de verificação de autenticação
function checkAuth() {
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

async function init() {
    try {
        const modelURL = MODEL_PATH + "model.json";
        const metadataURL = MODEL_PATH + "metadata.json";

        // Carrega o modelo
        state.model = await tmImage.load(modelURL, metadataURL);
        state.maxPredictions = state.model.getTotalClasses();

        // Configuração da webcam
        const flip = true;
        state.webcam = new tmImage.Webcam(400, 400, flip);
        
        try {
            await state.webcam.setup();
            await state.webcam.play();
            state.webcamInterval = window.requestAnimationFrame(loop);
            document.getElementById("webcam-container").appendChild(state.webcam.canvas);
            updateResultsUI();
        } catch (webcamError) {
            console.error("Erro na webcam:", webcamError);
            throw new Error("Não foi possível acessar a webcam. Verifique as permissões do navegador.");
        }
    } catch (error) {
        console.error("Erro na inicialização:", error);
        throw error;
    }
}

function updateResultsUI() {
    const resultsContainer = document.getElementById("dynamic-results");
    if (!resultsContainer) return;

    resultsContainer.innerHTML = '';
    
    const numClasses = state.maxPredictions || 2; // Fallback seguro
    
    for (let i = 0; i < numClasses; i++) {
        resultsContainer.innerHTML += `
            <div class="result-item" data-class-id="${i}">
                <div class="result-label">${state.model?.getClassLabels()[i] || 'Classe ' + (i+1)}</div>
                <div class="progress-bar">
                    <div class="progress" style="width: 0%"></div>
                    <span class="percentage">0%</span>
                </div>
            </div>`;
    }
}

async function loop() {
    if (state.isWebcamActive && state.webcam) {
        state.webcam.update();
        await predict();
        state.webcamInterval = window.requestAnimationFrame(loop);
    }
}

async function predict() {
    const predictions = await state.model.predict(state.webcam.canvas);
    updatePredictionResults(predictions);

        // Salvar análise
        try {
            const imageUrl = state.webcam.canvas.toDataURL();
            await api.saveAnalysis(imageUrl, predictions);
        } catch (error) {
            console.error('Erro ao salvar análise:', error);
        }
}

async function toggleCamera() {
    if (!checkAuth()) return; // Verifica autenticação
    
    const button = document.getElementById('toggleButton');
    const imagePreview = document.getElementById('imagePreview');
    const resultsContainer = document.getElementById("dynamic-results");
    
    if (!state.isWebcamActive) {
        try {
            imagePreview.innerHTML = '';
            resultsContainer.innerHTML = '';
            await init();
            button.textContent = 'Desligar Câmera';
            state.isWebcamActive = true;
        } catch (error) {
            console.error("Erro ao iniciar câmera:", error);
            alert("Erro ao iniciar a câmera. Verifique as permissões.");
        }
    } else {
        stopCamera();
    }
}

function stopCamera() {
    if (state.webcam) {
        state.webcam.stop();
        const container = document.getElementById('webcam-container');
        container.innerHTML = '';
        
        if (state.webcamInterval) {
            cancelAnimationFrame(state.webcamInterval);
        }
        
        document.getElementById('toggleButton').textContent = 'Iniciar Câmera';
        state.isWebcamActive = false;
        state.webcam = null;
        state.webcamInterval = null;
    }
}
async function handleImageUpload(event) {
    if (!checkAuth()) return; // Verifica autenticação
    
    if (state.isWebcamActive) {
        stopCamera();
    }

    const file = event.target.files[0];
    if (!file) return;

    try {
        // Recarrega o modelo para cada nova imagem
        const modelURL = MODEL_PATH + "model.json";
        const metadataURL = MODEL_PATH + "metadata.json";        
        state.model = await tmImage.load(modelURL, metadataURL);
        state.maxPredictions = state.model.getTotalClasses();

        // Cria os elementos de resultado primeiro
        createResultElements();

        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.style.maxWidth = '400px';
        img.style.borderRadius = '10px';
        
        const imagePreview = document.getElementById('imagePreview');
        imagePreview.innerHTML = '';
        imagePreview.appendChild(img);

        // Espera a imagem carregar antes de fazer a predição
        await new Promise(resolve => {
            img.onload = resolve;
        });

        const predictions = await state.model.predict(img);
        updatePredictionResults(predictions);
    } catch (error) {
        console.error("Erro ao processar imagem:", error);
        alert("Erro ao processar a imagem. Tente novamente.");
    }
}
function resetState() {
    state.model = null;
    state.webcam = null;
    state.maxPredictions = 0;
    state.isWebcamActive = false;
    
    if (state.webcamInterval) {
        cancelAnimationFrame(state.webcamInterval);
        state.webcamInterval = null;
    }
    
    document.getElementById('webcam-container').innerHTML = '';
    document.getElementById('imagePreview').innerHTML = '';
}
function createResultElements() {
    const resultsContainer = document.getElementById("dynamic-results");
    if (!resultsContainer) return;

    resultsContainer.innerHTML = '';
    
    for (let i = 0; i < state.maxPredictions; i++) {
        resultsContainer.innerHTML += `
            <div class="result-item">
                <div class="result-label">${state.model.getClassLabels()[i]}</div>
                <div class="progress-bar">
                    <div class="progress" style="width: 0%"></div>
                    <span class="percentage">0%</span>
                </div>
            </div>`;
    }
}
function updatePredictionResults(predictions) {
    const resultsContainer = document.getElementById("dynamic-results");
    if (!resultsContainer) return;

    predictions.forEach((pred, idx) => {
        const resultItem = resultsContainer.querySelector(`.result-item:nth-child(${idx + 1})`);
        if (!resultItem) return;

        const percentage = (pred.probability * 100).toFixed(0);
        const progressBar = resultItem.querySelector('.progress');
        const percentageSpan = resultItem.querySelector('.percentage');

        if (progressBar && percentageSpan) {
            progressBar.style.width = `${percentage}%`;
            percentageSpan.textContent = `${percentage}%`;
        }
    });
}
// Inicialização


document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('imageInput');
    if (imageInput) {
        imageInput.addEventListener('change', handleImageUpload);
    }
});
