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

// REMOVIDO: O event listener de submit será consolidado no final do arquivo.


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
    // Apenas compare as datas, sem as horas, para evitar problemas de fuso horário/minutos
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

// REMOVIDO: O event listener de submit será consolidado no final do arquivo.

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

// REMOVIDO: O event listener de submit será consolidado no final do arquivo.

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
    const $numero_registro = document.querySelector('#numero_registro'); // Adicionado
    if (registro.trim() === '') {
        $numero_registro.setCustomValidity(''); // Limpa a mensagem se estiver vazio
        return true;
    }
    
    const regexRegistro = /^[0-9]{11}$/;
    
    if (!regexRegistro.test(registro)) {
        mensagemAlertaRegistro();
        return false;
    }
    
    $numero_registro.setCustomValidity(''); // Limpa a mensagem se for válido
    return true;
}

document.getElementById('numero_registro').addEventListener('blur', function() {
    const registroDigitado = this.value;
    validarNumeroRegistro(registroDigitado);
});

// REMOVIDO: O event listener de submit será consolidado no final do arquivo.

function mensagemAlertaRegistro() {
    'use strict';
    
    var $numero_registro = document.querySelector('#numero_registro');

    var errorsMessage = 'Número de Registro inválido.';
    $numero_registro.setCustomValidity(errorsMessage);
    $numero_registro.reportValidity();
}

////////////////// VALIDAR EMAIL //////////////////

function validarEmail(email) {
    const $email = document.querySelector('#email'); // Adicionado
    if (email.trim() === '') {
        $email.setCustomValidity(''); // Limpa a mensagem se estiver vazio
        return true;
    }

    // const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexEmail = /^[^\s@]+@(?:[^\s@]+\.)+(?:com|edu|br)$/;

    if (!regexEmail.test(email)) {
        mensagemAlertaEmail();
        return false;
    }
    
    $email.setCustomValidity(''); // Limpa a mensagem se for válido
    return true;
}

document.getElementById('email').addEventListener('input', function() {
    this.setCustomValidity('');
});

document.getElementById('email').addEventListener('blur', function() {
    const emailDigitado = this.value;
    validarEmail(emailDigitado);
});

// REMOVIDO: O event listener de submit será consolidado no final do arquivo.

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
    this.setCustomValidity(''); // Limpa a validação ao digitar
});

function validarNome(nome) {
    const $nome = document.querySelector('#nome'); // Adicionado
    const regexNome = /^[a-zA-ZÀ-ÿ\s']+$/;

    if (nome.trim() === '') { // Adicionado: se o campo estiver vazio, não é inválido no blur, mas o 'required' do HTML cuida no submit
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

// REMOVIDO: O event listener de submit será consolidado no final do arquivo.

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
    
    // Você pode adicionar mais regras aqui, por exemplo:
    // if (senha.length < 6) {
    //     $senhaMotorista.setCustomValidity('A senha deve ter no mínimo 6 caracteres.');
    //     $senhaMotorista.reportValidity();
    //     return false;
    // }
    // if (!/[A-Z]/.test(senha)) {
    //     $senhaMotorista.setCustomValidity('A senha deve conter ao menos uma letra maiúscula.');
    //     $senhaMotorista.reportValidity();
    //     return false;
    // }

    $senhaMotorista.setCustomValidity('');
    return true;
}

document.getElementById('senhaMotorista').addEventListener('blur', function() {
    validarSenhaMotorista(this.value);
});

document.getElementById('senhaMotorista').addEventListener('input', function() {
    this.setCustomValidity(''); // Limpa a mensagem de erro ao digitar
});


// CONSOLIDAÇÃO DA VALIDAÇÃO NO SUBMIT DO FORMULÁRIO (PARA TODOS OS CAMPOS)
document.querySelector('form').addEventListener('submit', function(event) {
    let formIsValid = true;

    // Campos de Informações Pessoais
    if (!validarNome(document.getElementById('nome').value)) {
        formIsValid = false;
    }
    if (!validarEmail(document.getElementById('email').value)) {
        formIsValid = false;
    }
    if (!validarDataNascimento(document.getElementById('data_nascimento').value)) {
        formIsValid = false;
    }
    // CPF e RG são validados por 'validarCPF.js' e 'validarRG.js' (assumindo que existam ou serão criados)
    // Se eles não existirem como funções separadas, precisaríamos adicionar a lógica de validação aqui.
    // Ou, se eles já estão com listeners de blur e setCustomValidity, o HTML5 validation já vai pegar.
    
    // Validação da Senha do Motorista
    if (!validarSenhaMotorista(document.getElementById('senhaMotorista').value)) {
        formIsValid = false;
    }

    // Campos da CNH
    if (!validarNumeroRegistro(document.getElementById('numero_registro').value)) {
        formIsValid = false;
    }
    if (!validarDataValidade(document.getElementById('data_validade').value)) {
        formIsValid = false;
    }
    if (!validarDataEmissao(document.getElementById('data_emissao').value)) {
        formIsValid = false;
    }
    
    // Verifica a validade do formulário HTML5 (para campos 'required' e 'type=email' etc.)
    if (!this.checkValidity()) {
        formIsValid = false;
    }

    if (!formIsValid) {
        event.preventDefault(); // Impede o envio do formulário se houver erros
        // Rola para o primeiro campo com erro, se necessário (opcional)
        // document.querySelector(':invalid').focus(); 
    }
});
