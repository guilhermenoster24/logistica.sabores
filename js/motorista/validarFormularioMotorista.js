////////////////// VALIDAR DATA DE NASCIMENTO //////////////////

function validarDataNascimento(dataString) {
    const $data_nascimento = document.querySelector('#data_nascimento');

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
    
    if (data.getDate() !== dia || data.getMonth() !== mes || data.getFullYear() !== ano) {
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
    const idadeMaxima = 100;
    const diferencaAnos = dataAtual.getFullYear() - data.getFullYear();
    const mesAtual = dataAtual.getMonth();
    const mesNascimento = data.getMonth();
    const diaAtual = dataAtual.getDate();
    const diaNascimento = data.getDate();

    if (
        diferencaAnos < idadeMinima || 
        (diferencaAnos === idadeMinima && mesNascimento > mesAtual) ||
        (diferencaAnos === idadeMinima && mesNascimento === mesAtual && diaNascimento > diaAtual)
    ) {
        mensagemAlertaMenorIdade(); 
        return false;
    }

    if (
        diferencaAnos > idadeMaxima ||
        (diferencaAnos === idadeMaxima && mesNascimento < mesAtual) ||
        (diferencaAnos === idadeMaxima && mesNascimento === mesAtual && diaNascimento < diaAtual)
    ) {
        mensagemAlertaAcimaDaIdade();
        return false;
    }

    $data_nascimento.setCustomValidity('');
    return true;
}

document.getElementById('data_nascimento').addEventListener('blur', function() {
    const dataDigitada = this.value;
    validarDataNascimento(dataDigitada);
});

function mensagemAlertaDataNascimento() {
    'use strict';
    
    var $data_nascimento = document.querySelector('#data_nascimento');

    var errorsMessage = 'Data Inválida.';
    $data_nascimento.setCustomValidity(errorsMessage);
    $data_nascimento.reportValidity();
}

function mensagemAlertaDataNascimentoFutura() {
    'use strict';

    var $data_nascimento = document.querySelector('#data_nascimento');

    var errorsMessage = 'Data Futura.';
    $data_nascimento.setCustomValidity(errorsMessage);
    $data_nascimento.reportValidity();
}

function mensagemAlertaMenorIdade() {
    'use strict';

    var $data_nascimento = document.querySelector('#data_nascimento');

    var errorsMessage = 'Data Inválida! Pessoa não tem idade para dirigir.';
    $data_nascimento.setCustomValidity(errorsMessage);
    $data_nascimento.reportValidity();
}

function mensagemAlertaAcimaDaIdade() {
    'use strict';

    var $data_nascimento = document.querySelector('#data_nascimento');

    var errorsMessage = 'Data Inválida!';
    $data_nascimento.setCustomValidity(errorsMessage);
    $data_nascimento.reportValidity();
}

////////////////// VALIDAR DATA DE VALIDADE //////////////////

function validarDataValidade(dataString) {
    const $data_validade = document.querySelector('#data_validade');

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
    
    if (data.getDate() !== dia || data.getMonth() !== mes || data.getFullYear() !== ano) {
        mensagemAlertaDataValidade();
        return false;
    }

    const dataAtual = new Date();
    dataAtual.setHours(0,0,0,0);
    data.setHours(0,0,0,0); 

    if (data < dataAtual) {
        $data_validade.setCustomValidity('A validade da CNH está vencida.');
        $data_validade.reportValidity();
        return false;
    }

    $data_validade.setCustomValidity('');
    return true;
}

document.getElementById('data_validade').addEventListener('blur', function() {
    const dataDigitada = this.value;
    validarDataValidade(dataDigitada);
});

function mensagemAlertaDataValidade() {
    'use strict';
    
    var $data_validade = document.querySelector('#data_validade');

    var errorsMessage = 'Data Inválida.';
    $data_validade.setCustomValidity(errorsMessage);
    $data_validade.reportValidity();
}


////////////////// VALIDAR DATA DE EMISSÃO //////////////////

function validarDataEmissao(dataString) {
    const $data_emissao = document.querySelector('#data_emissao');

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

    if (data.getDate() !== dia || data.getMonth() !== mes || data.getFullYear() !== ano) {
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

document.getElementById('data_emissao').addEventListener('blur', function() {
    const dataDigitada = this.value;
    validarDataEmissao(dataDigitada);
});

function mensagemAlertaDataEmissao() {
    'use strict';
    
    var $data_emissao = document.querySelector('#data_emissao');

    var errorsMessage = 'Data Inválida.';
    $data_emissao.setCustomValidity(errorsMessage);
    $data_emissao.reportValidity();
}

function mensagemAlertaDataEmissaoFutura() {
    'use strict';

    var $data_emissao = document.querySelector('#data_emissao');

    var errorsMessage = 'Data Futura.';
    $data_emissao.setCustomValidity(errorsMessage);
    $data_emissao.reportValidity();
}


////////////////// VALIDAR NÚMERO DE REGISTRO //////////////////

document.getElementById('numero_registro').addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '');

    if (this.value.length > 11) {
        this.value = this.value.slice(0, 11);
    }

    this.setCustomValidity('');
});

function validarNumeroRegistro(registro) {
    const $numero_registro = document.querySelector('#numero_registro');
    if (registro.trim() === '') {
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

document.getElementById('numero_registro').addEventListener('blur', function() {
    const registroDigitado = this.value;
    validarNumeroRegistro(registroDigitado);
});

function mensagemAlertaRegistro() {
    'use strict';
    
    var $numero_registro = document.querySelector('#numero_registro');

    var errorsMessage = 'Número de Registro inválido.';
    $numero_registro.setCustomValidity(errorsMessage);
    $numero_registro.reportValidity();
}

////////////////// VALIDAR EMAIL //////////////////

function validarEmail(email) {
    const $email = document.querySelector('#email');
    if (email.trim() === '') {
        $email.setCustomValidity('');
        return true;
    }

    const regexEmail = /^[^\s@]+@(?:[^\s@]+\.)+(?:com|edu|br)$/;

    if (!regexEmail.test(email)) {
        mensagemAlertaEmail();
        return false;
    }
    
    $email.setCustomValidity('');
    return true;
}

document.getElementById('email').addEventListener('input', function() {
    this.setCustomValidity('');
});

document.getElementById('email').addEventListener('blur', function() {
    const emailDigitado = this.value;
    validarEmail(emailDigitada);
});

function mensagemAlertaEmail() {
    'use strict';
    
    var $email = document.querySelector('#email');

    var errorsMessage = 'Email inválido.';
    $email.setCustomValidity(errorsMessage);
    $email.reportValidity();
}


////////////////// VALIDAR NOME //////////////////

document.getElementById('nome').addEventListener('input', function() {
    this.value = this.value.replace(/[0-9!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/g, '');
    this.setCustomValidity('');
});

function validarNome(nome) {
    const $nome = document.querySelector('#nome');
    const regexNome = /^[a-zA-ZÀ-ÿ\s']+$/;

    if (nome.trim() === '') {
        $nome.setCustomValidity('');
        return true;
    }

    if (!regexNome.test(nome)) {
        mensagemAlertaNome();
        return false;
    }
    $nome.setCustomValidity('');
    return true;
}

document.getElementById('nome').addEventListener('blur', function() {
    const nomeDigitado = this.value;
    validarNome(nomeDigitado);
});

function mensagemAlertaNome() {
    'use strict';
    
    var $nome = document.querySelector('#nome');

    var errorsMessage = 'Nome inválido.';
    $nome.setCustomValidity(errorsMessage);
    $nome.reportValidity();
}

////////////////// VALIDAR SENHA DO MOTORISTA (NOVO CAMPO) //////////////////

function validarSenhaMotorista(senha) {
    const $senhaMotorista = document.querySelector('#senhaMotorista');

    if (senha.trim() === '') {
        $senhaMotorista.setCustomValidity('A senha não pode estar vazia.');
        $senhaMotorista.reportValidity();
        return false;
    }
    
    $senhaMotorista.setCustomValidity('');
    return true;
}

document.getElementById('senhaMotorista').addEventListener('blur', function() {
    validarSenhaMotorista(this.value);
});

document.getElementById('senhaMotorista').addEventListener('input', function() {
    this.setCustomValidity('');
});


// CONSOLIDAÇÃO DA VALIDAÇÃO E SALVAMENTO NO SUBMIT DO FORMULÁRIO
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    let formIsValid = true;

    // 1. Validar campos individualmente
    if (!validarNome(document.getElementById('nome').value)) {
        formIsValid = false;
    }
    if (!validarEmail(document.getElementById('email').value)) {
        formIsValid = false;
    }
    if (!validarDataNascimento(document.getElementById('data_nascimento').value)) {
        formIsValid = false;
    }
    // Assumindo que validarCPF() já está sendo chamada e define setCustomValidity no blur/input
    // if (!validarCPF(document.getElementById('cpf').value)) { formIsValid = false; }
    // if (!validarRG(document.getElementById('rg').value)) { formIsValid = false; }
    
    if (!validarSenhaMotorista(document.getElementById('senhaMotorista').value)) {
        formIsValid = false;
    }

    if (!validarNumeroRegistro(document.getElementById('numero_registro').value)) {
        formIsValid = false;
    }
    if (!validarDataValidade(document.getElementById('data_validade').value)) {
        formIsValid = false;
    }
    if (!validarDataEmissao(document.getElementById('data_emissao').value)) {
        formIsValid = false;
    }
    
    // 2. Verifica a validade do formulário HTML5 (para campos 'required' e 'type=email' etc.)
    if (!this.checkValidity()) {
        formIsValid = false;
    }

    // Se o formulário não é válido, para por aqui
    if (!formIsValid) {
        // Rola para o primeiro campo com erro, se necessário (opcional)
        // document.querySelector(':invalid').focus(); 
        return; // Sai da função, impedindo o salvamento
    }

    // Se o formulário é válido, procede com o salvamento no Firebase
    const newMotorista = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        dataNascimento: document.getElementById('data_nascimento').value,
        telefone: document.getElementById('phone').value,
        rg: document.getElementById('rg').value,
        cpf: document.getElementById('cpf').value,
        senha: document.getElementById('senhaMotorista').value,
        numeroRegistro: document.getElementById('numero_registro').value,
        categoria: document.getElementById('categoria').value,
        dataValidade: document.getElementById('data_validade').value,
        dataEmissao: document.getElementById('data_emissao').value
    };

    // Acessar a referência do Firebase globalmente
    const motoristasRef = ref(window.database, 'motoristas'); 
    
    // Validação de Duplicidade (CPF/RG) Assíncrona no Firebase antes de salvar
    query(motoristasRef, orderByChild('cpf'), equalTo(newMotorista.cpf)).once('value')
        .then(snapshot => {
            if (snapshot.exists()) {
                alert('Erro: Já existe um motorista cadastrado com este CPF.');
                return Promise.reject('CPF duplicado');
            }
            return query(motoristasRef, orderByChild('rg'), equalTo(newMotorista.rg)).once('value');
        })
        .then(snapshot => {
            if (snapshot.exists()) {
                alert('Erro: Já existe um motorista cadastrado com este RG.');
                return Promise.reject('RG duplicado');
            }
            // Se não houver duplicidade, salva no Firebase
            return push(motoristasRef, newMotorista);
        })
        .then(() => {
            alert('Motorista cadastrado com sucesso no Firebase!');
            document.getElementById('motoristaForm').reset(); // Limpa o formulário
        })
        .catch(error => {
            // Apenas exibe o alerta se o erro não for de duplicidade (que já tem alerta específico)
            if (error !== 'CPF duplicado' && error !== 'RG duplicado') {
                console.error("Erro ao cadastrar motorista no Firebase: ", error);
                alert('Erro ao cadastrar motorista. Verifique o console para mais detalhes.');
            }
        });
});
