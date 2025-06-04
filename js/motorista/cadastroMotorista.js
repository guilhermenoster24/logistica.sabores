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
