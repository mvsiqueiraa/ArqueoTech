// frontend/src/js/auth.js
document.addEventListener('DOMContentLoaded', () => {
    // Código de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await api.login(email, password);
                if (response.token) {
                    localStorage.setItem('token', response.token);
                    // Adiciona fallback para 'Usuário' caso response.name seja undefined
                    localStorage.setItem('username', response.name || 'Usuário'); 
                    window.location.href = 'index.html';
                } else {
                    displayMessage(response.message || 'Erro ao fazer login', 'error');
                }
            } catch (error) {
                console.error('Erro:', error);
                displayMessage('Erro ao fazer login', 'error');
            }
        });
    }

    // Código de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const institution = document.getElementById('institution').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

// Validação básica
if (password !== confirmPassword) {
    displayMessage('As senhas não coincidem', 'warning');
    return;
}

// Adiciona validação de complexidade da senha
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
if (!passwordRegex.test(password)) {
    displayMessage('A senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula e número', 'warning');
    return;
}

            try {
                const response = await api.register(name, email, password, institution);
                if (response.message === 'Usuário criado com sucesso') {
                    displayMessage('Cadastro realizado com sucesso!', 'success');
                    window.location.href = 'login.html';
                } else {
                    displayMessage(response.message || 'Erro ao cadastrar', 'error');
                }
            } catch (error) {
                console.error('Erro:', error);
                displayMessage('Erro ao cadastrar', 'error');
            }
        });
    }

    // Função para atualizar a barra de navegação com base no status de login
    function updateUserSection() {
        const userSection = document.getElementById('userSection');
        const addArtifactLinkLi = document.getElementById('addArtifactLink').closest('li'); // Pega o <li> pai do link "Novo Artefato"
        
        if (userSection) { // Garante que userSection exista na página
            if (localStorage.getItem('token')) {
                const username = localStorage.getItem('username') || 'Usuário'; // Fallback para username
                userSection.innerHTML = `
                    <span class="username">Bem-vindo, ${username}</span>
                    <a href="#" onclick="logout()" class="login-btn">Logout</a>
                `;
                // Mostra o <li> pai do link "Novo Artefato" se ele existir
                if (addArtifactLinkLi) {
                    addArtifactLinkLi.style.display = 'block';
                }
            } else {
                userSection.innerHTML = `
                    <a href="login.html" class="login-btn">Login</a>
                `;
            }
        }
    }

    // Chama esta função no DOMContentLoaded para todas as páginas que usam a navbar
    updateUserSection(); // Chamada inicial quando o DOM é carregado

    // Função para exibir mensagens customizadas (substitui alert)
    function displayMessage(message, type = 'info') {
        const messageBox = document.createElement('div');
        messageBox.classList.add('message-box', type);
        messageBox.textContent = message;
        document.body.appendChild(messageBox);

        // Remove a mensagem após alguns segundos
        setTimeout(() => {
            messageBox.remove();
        }, 3000); // 3 segundos
    }
});

// Função global de logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username'); // Também remove o nome de usuário
    window.location.href = 'login.html';
}
