// frontend/src/js/auth.js
document.addEventListener('DOMContentLoaded', () => {
    // Código de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const email = emailInput ? emailInput.value : '';
            const password = passwordInput ? passwordInput.value : '';

            if (!email || !password) {
                displayMessage('Por favor, preencha e-mail e senha.', 'warning');
                return;
            }

            try {
                const response = await api.login(email, password);
                if (response.token) {
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('username', response.name || 'Usuário'); 
                    window.location.href = 'index.html';
                } else {
                    displayMessage(response.message || 'Erro ao fazer login. Verifique suas credenciais.', 'error');
                }
            } catch (error) {
                console.error('Erro no login:', error);
                displayMessage('Erro de conexão ao tentar fazer login. Tente novamente.', 'error');
            }
        });
    }

    // Código de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('fullName');
            const emailInput = document.getElementById('email');
            const institutionInput = document.getElementById('institution');
            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirmPassword');

            const name = nameInput ? nameInput.value : '';
            const email = emailInput ? emailInput.value : '';
            const institution = institutionInput ? institutionInput.value : '';
            const password = passwordInput ? passwordInput.value : '';
            const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';

            if (!name || !email || !institution || !password || !confirmPassword) {
                displayMessage('Por favor, preencha todos os campos.', 'warning');
                return;
            }

            if (password !== confirmPassword) {
                displayMessage('As senhas não coincidem.', 'warning');
                return;
            }

            const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(password)) {
                displayMessage('A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula e um número.', 'warning');
                return;
            }

            try {
                const response = await api.register(name, email, password, institution);
                if (response.message === 'Usuário criado com sucesso') {
                    displayMessage('Cadastro realizado com sucesso! Você será redirecionado para o login.', 'success');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000); // Redireciona após 2 segundos
                } else {
                    displayMessage(response.message || 'Erro ao cadastrar. Verifique os dados ou tente novamente.', 'error');
                }
            } catch (error) {
                console.error('Erro no registro:', error);
                // Este erro provavelmente é de conexão com o backend
                displayMessage('Erro de conexão ao tentar cadastrar. Verifique se o servidor está rodando e tente novamente.', 'error');
            }
        });
    }

    // Função para atualizar a barra de navegação com base no status de login
    function updateUserSection() {
        const userSection = document.getElementById('userSection');
        const addArtifactLink = document.getElementById('addArtifactLink'); // Pega o elemento do link
        let addArtifactLinkLi = null; // Variável para o <li> pai

        if (addArtifactLink) { // Verifica se o PRÓPRIO LINK existe
            addArtifactLinkLi = addArtifactLink.closest('li'); // Só então tenta pegar o <li> pai
        }

        if (userSection) { // Garante que a seção do usuário exista na página
            if (localStorage.getItem('token')) {
                const username = localStorage.getItem('username') || 'Usuário';
                userSection.innerHTML = `
                    <span class="username">Bem-vindo, ${username}</span>
                    <a href="#" onclick="logout()" class="login-btn">Logout</a>
                `;
                if (addArtifactLinkLi) { // Verifica se o <li> pai foi encontrado
                    addArtifactLinkLi.style.display = 'list-item'; // ou 'block' ou '' para voltar ao default do CSS
                }
            } else {
                userSection.innerHTML = `
                    <a href="login.html" class="login-btn">Login</a>
                `;
                if (addArtifactLinkLi) { // Verifica se o <li> pai foi encontrado
                    addArtifactLinkLi.style.display = 'none';
                }
            }
        }
    }

    // Chama a função para atualizar a navbar quando o DOM estiver carregado
    updateUserSection();

    // Função para exibir mensagens customizadas
    function displayMessage(message, type = 'info') {
        // Remove qualquer mensagem existente para evitar sobreposição
        const existingMessageBox = document.querySelector('.message-box');
        if (existingMessageBox) {
            existingMessageBox.remove();
        }

        const messageBox = document.createElement('div');
        messageBox.className = `message-box ${type}`; // Adiciona classe base e tipo
        messageBox.textContent = message;
        document.body.appendChild(messageBox);

        setTimeout(() => {
            messageBox.remove();
        }, 3500); // Aumentei um pouco o tempo para melhor leitura
    }
});

// Função global de logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = 'login.html'; // Redireciona para login após logout
}