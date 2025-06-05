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
            window.location.href = 'cadastroMotorista.html';
            return;
        }

        // Tentar login como Motorista (buscando no Firebase)
        const motoristasRef = ref(window.database, 'motoristas');
        // Consulta o Firebase para encontrar um motorista com o CPF fornecido
        query(motoristasRef, orderByChild('cpf'), equalTo(username.replace(/\D/g, ''))).once('value')
            .then(snapshot => {
                let motoristaLogado = null;
                snapshot.forEach((childSnapshot) => {
                    const motoristaData = childSnapshot.val();
                    // Verifica se a senha corresponde (sempre use comparações seguras em produção!)
                    if (motoristaData.senha === password) {
                        motoristaLogado = { id: childSnapshot.key, ...motoristaData };
                    }
                });

                if (motoristaLogado) {
                    localStorage.setItem('loggedInUserType', 'motorista');
                    localStorage.setItem('loggedInMotoristaId', motoristaLogado.id); // Salva o Firebase ID
                    window.location.href = 'minhasViagens.html';
                } else {
                    alert('Usuário ou senha inválidos.');
                }
            })
            .catch(error => {
                console.error("Erro ao tentar login de motorista: ", error);
                alert('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.');
            });
    });

    // Código do tema escuro (já estava no seu arquivo login.js)
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
