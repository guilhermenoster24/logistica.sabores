document.addEventListener('DOMContentLoaded', function() {
    // Script original: Elementos e listeners para Login e Modo Escuro
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    if (loginForm) { // Adicionado para evitar erros se o formulário não existir nesta página
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
                window.location.href = 'cadastroMotorista.html'; // Redireciona para uma página de administrador
                return;
            }

            // Tentar login como Motorista (usando o CPF como "usuário" e a NOVA SENHA como "senha")
            const motoristas = JSON.parse(localStorage.getItem('motoristas')) || [];
            const motoristaLogado = motoristas.find(motorista =>
                motorista.cpf.replace(/\D/g, '') === username.replace(/\D/g, '') && // Compara CPF sem formatação
                motorista.senha === password // Compara a senha definida no cadastro do motorista
            );

            if (motoristaLogado) {
                localStorage.setItem('loggedInUserType', 'motorista');
                localStorage.setItem('loggedInMotoristaId', motoristaLogado.id);
                window.location.href = 'minhasViagens.html'; // Redireciona para a nova página do motorista
            } else {
                // Apenas mostra o alerta se não for login de admin bem-sucedido
                if (!(username === adminUser && password === adminPass)) {
                     alert('Usuário ou senha inválidos.');
                }
            }
        });
    }

    const themeToggle = document.getElementById('themeToggle');
    const modeIcon = document.getElementById('mode_icon');

    if (themeToggle && modeIcon) { // Adicionado para evitar erros se os elementos não existirem
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
    }

    // Novo código de validação integrado abaixo:

    ////////////////// VALIDAR DATA DE NASCIMENTO //////////////////
    function validarDataNascimento(dataString) {
        const $data_nascimento = document.querySelector('#data_nascimento');
        if (!$data_nascimento) return true; // Sai se o elemento não existir

        if (dataString.trim() === '') {
            $data_nascimento.setCustomValidity('');
            return true;
        }

        const partesData = dataString.split('/');
        if (partesData.length !== 3) {
            mensagemAlertaDataNascimento();
            return false;
        }

        const dia = parseInt(partesData[0], 10);
        const mes = parseInt(partesData[1], 10) - 1;
        const ano = parseInt(partesData[2], 10);
        const data = new Date(ano, mes, dia);

        if (isNaN(data.getTime()) || data.getDate() !== dia || data.getMonth() !== mes || data.getFullYear() !== ano) {
            mensagemAlertaDataNascimento();
            return false;
        }

        const dataAtual = new Date();
        dataAtual.setHours(0, 0, 0, 0);
        if (data > dataAtual) {
            mensagemAlertaDataNascimentoFutura();
            return false;
        }

        const idadeMinima = 18;
        const idadeMaxima = 100; // Definindo uma idade máxima razoável
        let idade = dataAtual.getFullYear() - data.getFullYear();
        const m = dataAtual.getMonth() - data.getMonth();
        if (m < 0 || (m === 0 && dataAtual.getDate() < data.getDate())) {
            idade--;
        }

        if (idade < idadeMinima) {
            mensagemAlertaMenorIdade();
            return false;
        }

        if (idade > idadeMaxima) {
            mensagemAlertaAcimaDaIdade();
            return false;
        }

        $data_nascimento.setCustomValidity('');
        return true;
    }

    const elDataNascimento = document.getElementById('data_nascimento');
    if (elDataNascimento) {
        elDataNascimento.addEventListener('blur', function() {
            const dataDigitada = this.value;
            validarDataNascimento(dataDigitada);
        });
    }

    function mensagemAlertaDataNascimento() {
        'use strict';
        var $data_nascimento = document.querySelector('#data_nascimento');
        if (!$data_nascimento) return;
        var errorsMessage = 'Data Inválida.';
        $data_nascimento.setCustomValidity(errorsMessage);
        $data_nascimento.reportValidity();
    }

    function mensagemAlertaDataNascimentoFutura() {
        'use strict';
        var $data_nascimento = document.querySelector('#data_nascimento');
        if (!$data_nascimento) return;
        var errorsMessage = 'Data de nascimento não pode ser futura.';
        $data_nascimento.setCustomValidity(errorsMessage);
        $data_nascimento.reportValidity();
    }

    function mensagemAlertaMenorIdade() {
        'use strict';
        var $data_nascimento = document.querySelector('#data_nascimento');
        if (!$data_nascimento) return;
        var errorsMessage = 'Motorista deve ter no mínimo 18 anos.';
        $data_nascimento.setCustomValidity(errorsMessage);
        $data_nascimento.reportValidity();
    }

    function mensagemAlertaAcimaDaIdade() {
        'use strict';
        var $data_nascimento = document.querySelector('#data_nascimento');
        if (!$data_nascimento) return;
        var errorsMessage = 'Idade máxima para cadastro excedida (100 anos).';
        $data_nascimento.setCustomValidity(errorsMessage);
        $data_nascimento.reportValidity();
    }

    ////////////////// VALIDAR DATA DE VALIDADE CNH //////////////////
    function validarDataValidade(dataString) {
        const $data_validade = document.querySelector('#data_validade');
        if (!$data_validade) return true;

        if (dataString.trim() === '') {
            $data_validade.setCustomValidity('');
            return true;
        }

        const partesData = dataString.split('/');
        if (partesData.length !== 3) {
            mensagemAlertaDataValidade();
            return false;
        }

        const dia = parseInt(partesData[0], 10);
        const mes = parseInt(partesData[1], 10) - 1;
        const ano = parseInt(partesData[2], 10);
        const data = new Date(ano, mes, dia);

        if (isNaN(data.getTime()) || data.getDate() !== dia || data.getMonth() !== mes || data.getFullYear() !== ano) {
            mensagemAlertaDataValidade();
            return false;
        }

        const dataAtual = new Date();
        dataAtual.setHours(0, 0, 0, 0);
        data.setHours(0, 0, 0, 0);

        if (data < dataAtual) {
            $data_validade.setCustomValidity('A validade da CNH está vencida.');
            $data_validade.reportValidity();
            return false;
        }

        $data_validade.setCustomValidity('');
        return true;
    }

    const elDataValidade = document.getElementById('data_validade');
    if (elDataValidade) {
        elDataValidade.addEventListener('blur', function() {
            const dataDigitada = this.value;
            validarDataValidade(dataDigitada);
        });
    }

    function mensagemAlertaDataValidade() {
        'use strict';
        var $data_validade = document.querySelector('#data_validade');
        if (!$data_validade) return;
        var errorsMessage = 'Data de validade inválida.';
        $data_validade.setCustomValidity(errorsMessage);
        $data_validade.reportValidity();
    }

    ////////////////// VALIDAR DATA DE EMISSÃO CNH //////////////////
    function validarDataEmissao(dataString) {
        const $data_emissao = document.querySelector('#data_emissao');
        if (!$data_emissao) return true;

        if (dataString.trim() === '') {
            $data_emissao.setCustomValidity('');
            return true;
        }

        const partesData = dataString.split('/');
        if (partesData.length !== 3) {
            mensagemAlertaDataEmissao();
            return false;
        }

        const dia = parseInt(partesData[0], 10);
        const mes = parseInt(partesData[1], 10) - 1;
        const ano = parseInt(partesData[2], 10);
        const data = new Date(ano, mes, dia);

        if (isNaN(data.getTime()) || data.getDate() !== dia || data.getMonth() !== mes || data.getFullYear() !== ano) {
            mensagemAlertaDataEmissao();
            return false;
        }

        const dataAtual = new Date();
        dataAtual.setHours(0, 0, 0, 0);
        if (data > dataAtual) {
            mensagemAlertaDataEmissaoFutura();
            return false;
        }

        $data_emissao.setCustomValidity('');
        return true;
    }

    const elDataEmissao = document.getElementById('data_emissao');
    if (elDataEmissao) {
        elDataEmissao.addEventListener('blur', function() {
            const dataDigitada = this.value;
            validarDataEmissao(dataDigitada);
        });
    }

    function mensagemAlertaDataEmissao() {
        'use strict';
        var $data_emissao = document.querySelector('#data_emissao');
        if (!$data_emissao) return;
        var errorsMessage = 'Data de emissão inválida.';
        $data_emissao.setCustomValidity(errorsMessage);
        $data_emissao.reportValidity();
    }

    function mensagemAlertaDataEmissaoFutura() {
        'use strict';
        var $data_emissao = document.querySelector('#data_emissao');
        if (!$data_emissao) return;
        var errorsMessage = 'Data de emissão não pode ser futura.';
        $data_emissao.setCustomValidity(errorsMessage);
        $data_emissao.reportValidity();
    }

    ////////////////// VALIDAR NÚMERO DE REGISTRO CNH //////////////////
    const elNumeroRegistro = document.getElementById('numero_registro');
    if (elNumeroRegistro) {
        elNumeroRegistro.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
            if (this.value.length > 11) {
                this.value = this.value.slice(0, 11);
            }
            this.setCustomValidity('');
        });

        elNumeroRegistro.addEventListener('blur', function() {
            const registroDigitado = this.value;
            validarNumeroRegistro(registroDigitado);
        });
    }
    
    function validarNumeroRegistro(registro) {
        const $numero_registro = document.querySelector('#numero_registro');
        if (!$numero_registro) return true;

        if (registro.trim() === '') {
            // Permite campo vazio, mas se quiser obrigatório, mude aqui
             $numero_registro.setCustomValidity('');
            return true;
        }

        const regexRegistro = /^[0-9]{11}$/;
        if (!regexRegistro.test(registro)) {
            mensagemAlertaRegistro();
            return false;
        }

        $numero_registro.setCustomValidity('');
        return true;
    }

    function mensagemAlertaRegistro() {
        'use strict';
        var $numero_registro = document.querySelector('#numero_registro');
        if (!$numero_registro) return;
        var errorsMessage = 'Número de Registro CNH inválido. Deve conter 11 dígitos.';
        $numero_registro.setCustomValidity(errorsMessage);
        $numero_registro.reportValidity();
    }

    ////////////////// VALIDAR EMAIL //////////////////
    const elEmail = document.getElementById('email');
    if (elEmail) {
        elEmail.addEventListener('input', function() {
            this.setCustomValidity(''); // Limpa a validação customizada ao digitar
        });
        elEmail.addEventListener('blur', function() {
            const emailDigitado = this.value;
            validarEmail(emailDigitado);
        });
    }

    function validarEmail(email) {
        const $email = document.querySelector('#email');
        if (!$email) return true;

        if (email.trim() === '') {
            // Permite campo vazio, mas se quiser obrigatório, mude aqui
            $email.setCustomValidity('');
            return true;
        }
        // Regex um pouco mais flexível para domínios, mas mantendo a estrutura básica
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        // A regex original /^[^\s@]+@(?:[^\s@]+\.)+(?:com|edu|br)$/ era muito restritiva nos TLDs.
        
        if (!regexEmail.test(email)) {
            mensagemAlertaEmail();
            return false;
        }

        $email.setCustomValidity('');
        return true;
    }

    function mensagemAlertaEmail() {
        'use strict';
        var $email = document.querySelector('#email');
        if (!$email) return;
        var errorsMessage = 'Email inválido. Formato esperado: usuario@dominio.com';
        $email.setCustomValidity(errorsMessage);
        $email.reportValidity();
    }

    ////////////////// VALIDAR NOME //////////////////
    const elNome = document.getElementById('nome');
    if (elNome) {
        elNome.addEventListener('input', function() {
            // Permite letras, espaços, acentos e apóstrofo. Remove outros caracteres.
            this.value = this.value.replace(/[^a-zA-ZÀ-ÿ\s']/g, '');
            this.setCustomValidity('');
        });
        elNome.addEventListener('blur', function() {
            const nomeDigitado = this.value;
            validarNome(nomeDigitado);
        });
    }

    function validarNome(nomeValue) {
        const $nomeField = document.querySelector('#nome');
        if (!$nomeField) return true;

        // Regex para validar nome: permite letras (incluindo acentuadas), espaços e apóstrofos.
        // Exige pelo menos um caractere que não seja só espaço.
        const regexNome = /^[a-zA-ZÀ-ÿ\s']*[a-zA-ZÀ-ÿ'][a-zA-ZÀ-ÿ\s']*$/;


        if (nomeValue.trim() === '') {
             // Permite campo vazio, mas se quiser obrigatório, mude aqui
            $nomeField.setCustomValidity('');
            return true;
        }

        if (!regexNome.test(nomeValue)) {
            mensagemAlertaNome();
            return false;
        }
        $nomeField.setCustomValidity('');
        return true;
    }

    // Função de mensagem para nome (adicionada)
    function mensagemAlertaNome() {
        'use strict';
        var $nomeField = document.querySelector('#nome');
        if (!$nomeField) return;
        var errorsMessage = 'Nome inválido. Use apenas letras, espaços e apóstrofos.';
        $nomeField.setCustomValidity(errorsMessage);
        $nomeField.reportValidity();
    }

});
