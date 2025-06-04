document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = usernameInput.value;
        const password = passwordInput.value;

        // Credenciais do Administrador (usuário padrão 'admin', senha padrão 'admin123')
        const adminUser = 'admin';
        const adminPass = 'admin123'; 

        // Tentar login como Administrador
        if (username === adminUser && password === adminPass) {
            localStorage.setItem('loggedInUserType', 'admin');
            // alert('Login de Administrador bem-sucedido!'); // Mensagem de sucesso removida
            window.location.href = 'cadastroMotorista.html'; // Redireciona para uma página de administrador
            return;
        }

        // Tentar login como Motorista (usando o CPF como "usuário" e o RG como "senha")
        // Lembre-se que RG e CPF podem ter máscaras no formulário, então remova-as para comparação.
        const motoristas = JSON.parse(localStorage.getItem('motoristas')) || [];
        const motoristaLogado = motoristas.find(motorista =>
            motorista.cpf.replace(/\D/g, '') === username.replace(/\D/g, '') &&
            motorista.rg.replace(/\D/g, '') === password.replace(/\D/g, '')
        );

        if (motoristaLogado) {
            localStorage.setItem('loggedInUserType', 'motorista');
            localStorage.setItem('loggedInMotoristaId', motoristaLogado.id);
            // alert(`Login de Motorista bem-sucedido! Bem-vindo, ${motoristaLogado.nome}.`); // Mensagem de sucesso removida
            window.location.href = 'minhasViagens.html'; // Redireciona para a nova página do motorista
        } else {
            alert('Usuário ou senha inválidos.');
        }
    });

    // No modo escuro, o ícone de luz é inicializado
    const themeToggle = document.getElementById('themeToggle');
    const modeIcon = document.getElementById('mode_icon');

    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    if (isDarkMode) {
        document.body.classList.add('dark');
        modeIcon.classList.add('fa-sun');
        modeIcon.classList.remove('fa-moon');
    } else {
        modeIcon.classList.add('fa-moon');
        modeIcon.classList.remove('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        if (document.body.classList.contains('dark')) {
            modeIcon.classList.add('fa-sun');
            modeIcon.classList.remove('fa-moon');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            modeIcon.classList.add('fa-moon');
            modeIcon.classList.remove('fa-sun');
            localStorage.setItem('darkMode', 'disabled');
        }
    });
});
