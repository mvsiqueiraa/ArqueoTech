document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const sliderDotsContainer = document.querySelector('.slider-dots');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const sliderContainer = document.querySelector('.slider-container');
    const slidesContainer = document.querySelector('.slides'); // Adicionado para controlar o transform

    if (!slides.length || !sliderDotsContainer || !slidesContainer) {
        // Se não houver slides, container de pontos ou container de slides, não inicializa o slider
        return;
    }
    
    let currentSlide = 0;
    let slideInterval;
    const autoPlayDelay = 5000; // 5 segundos

    // Função para criar os pontos do slider
    function createDots() {
        sliderDotsContainer.innerHTML = ''; // Limpa os pontos existentes
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.setAttribute('data-slide-index', index);
            dot.addEventListener('click', () => {
                stopAutoPlay(); // Para o auto-play ao clicar no ponto
                showSlide(index);
                startAutoPlay(); // Reinicia o auto-play
            });
            sliderDotsContainer.appendChild(dot);
        });
    }

    // Função para mostrar o slide e atualizar os pontos
    function showSlide(n) {
        currentSlide = (n + slides.length) % slides.length;
        
        // Aplica a transformação para mover o contêiner de slides
        slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Atualiza a classe 'active' para os pontos
        document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
        const activeDot = sliderDotsContainer.querySelector(`.dot[data-slide-index="${currentSlide}"]`);
        if (activeDot) {
            activeDot.classList.add('active');
        }
    }
    
    // Inicia o auto-play
    function startAutoPlay() {
        clearInterval(slideInterval); // Limpa qualquer intervalo anterior
        slideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, autoPlayDelay);
    }

    // Para o auto-play
    function stopAutoPlay() {
        clearInterval(slideInterval);
    }

    // Inicialização
    createDots(); // Cria os pontos na inicialização
    showSlide(0); // Mostra o primeiro slide
    startAutoPlay(); // Inicia o auto-play

    // Event listeners para os botões de navegação
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            stopAutoPlay(); // Para o auto-play ao clicar
            showSlide(currentSlide - 1);
            startAutoPlay(); // Reinicia o auto-play
        });
        nextButton.addEventListener('click', () => {
            stopAutoPlay(); // Para o auto-play ao clicar
            showSlide(currentSlide + 1);
            startAutoPlay(); // Reinicia o auto-play
        });
    }

    // Pausar auto-play no hover do slider
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseover', stopAutoPlay);
        sliderContainer.addEventListener('mouseout', startAutoPlay);
    }
});
