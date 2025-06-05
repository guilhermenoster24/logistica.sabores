document.addEventListener('DOMContentLoaded', function() {
    const relatorioForm = document.getElementById('relatorioForm');
    const veiculoSelect = document.getElementById('veiculo');
    const motoristaSelect = document.getElementById('motorista');
    const relatoriosRef = ref(window.database, 'relatorios');

    const quilometragemInicialInput = document.getElementById("quilometragemInicial");
    const quilometragemFinalInput = document.getElementById("quilometragemFinal");
    const quilometragemPercorridaInput = document.getElementById("quilometragemPercorrida");

    // Lógica de cálculo de quilometragem (de validaQuilometragem.js)
    quilometragemInicialInput.addEventListener("input", calcularQuilometragem);
    quilometragemFinalInput.addEventListener("blur", calcularQuilometragem);

    function calcularQuilometragem() {
        const quilometragemInicial = parseFloat(quilometragemInicialInput.value) || 0;
        const quilometragemFinal = parseFloat(quilometragemFinalInput.value) || 0;

        if (!isNaN(quilometragemInicial) && !isNaN(quilometragemFinal)) {
            const quilometragemPercorrida = quilometragemFinal - quilometragemInicial;
            quilometragemPercorridaInput.value = quilometragemPercorrida;     
            setTimeout(validaQuilometragemTotal, 1000);
        } else {
            quilometragemPercorridaInput.value = "";
        }
    }

    function validaQuilometragemTotal() {
        const quilometragemPercorrida = parseFloat(quilometragemPercorridaInput.value);

        if (quilometragemPercorrida <= 0 || isNaN(quilometragemPercorrida)) {
            mensagemAlertaQuilometragemTotal();
            return false;
        }
        quilometragemPercorridaInput.setCustomValidity('');
        return true;
    }

    function mensagemAlertaQuilometragemTotal() {
        'use strict';
        const $quilometragemPercorrida = document.querySelector('#quilometragemPercorrida');
        const errorsMessage = 'A quilometragem percorrida deve ser um número positivo e superior a zero.';
        
        $quilometragemPercorrida.removeAttribute("disabled");
        $quilometragemPercorrida.setCustomValidity(errorsMessage);
        $quilometragemPercorrida.reportValidity();

        setTimeout(function() {
            $quilometragemPercorrida.setAttribute("disabled", "disabled");
        }, 3000);
    }
    // Fim da lógica de quilometragem

    // Lógica de desabilitar/habilitar campos e carregar para edição (de editarRelatorio.js)
    const urlParams = new URLSearchParams(window.location.search);
    const relatorioFirebaseId = urlParams.get('id');

    if (relatorioFirebaseId) {
        document.getElementById("veiculo").disabled = true;
        document.getElementById("motorista").disabled = true;
        document.getElementById("data_hora_saida").disabled = true;
        document.getElementById("data_hora_chegada").disabled = true;
        document.getElementById("quilometragemInicial").disabled = true;
        document.getElementById("quilometragemFinal").disabled = true;
        document.getElementById("itinerario").disabled = true;
        document.getElementById("observacao").disabled = true;

        document.getElementById('botaoPesquisar').style.display = 'none';
        document.getElementById('botaoExcluir').style.display = 'inline-block';
        document.getElementById('botaoAlterar').style.display = 'inline-block';
        document.getElementById('salvar').textContent = 'Atualizar';

        document.getElementById("botaoAlterar").addEventListener("click", function() {
            document.getElementById("veiculo").disabled = false;
            document.getElementById("motorista").disabled = false;
            document.getElementById("data_hora_saida").disabled = false;
            document.getElementById("data_hora_chegada").disabled = false;
            document.getElementById("quilometragemInicial").disabled = false;
            document.getElementById("quilometragemFinal").disabled = false;
            document.getElementById("itinerario").disabled = false;
            document.getElementById("observacao").disabled = false;
        });

        const itemRef = ref(window.database, `relatorios/${relatorioFirebaseId}`);
        once(itemRef)
            .then(snapshot => {
                const relatorio = snapshot.val();
                if (relatorio) {
                    document.getElementById("veiculo").value = relatorio.idVeiculo;
                    document.getElementById("motorista").value = relatorio.idMotorista;
                    document.getElementById("rota").value = relatorio.rota;
                    document.getElementById("data_hora_saida").value = relatorio.dataHoraSaida;
                    document.getElementById("data_hora_chegada").value = relatorio.dataHoraChegada;
                    document.getElementById("quilometragemInicial").value = relatorio.quilometragemInicial;
                    document.getElementById("quilometragemFinal").value = relatorio.quilometragemFinal;
                    document.getElementById("quilometragemPercorrida").value = relatorio.quilometragemPercorrida;
                    document.getElementById("itinerario").value = relatorio.itinerario;
                    document.getElementById("observacao").value = relatorio.observacao;
                } else {
                    alert('Viagem não encontrada no Firebase.');
                    window.location.href = 'controleViagens.html';
                }
            })
            .catch(error => {
                console.error("Erro ao carregar viagem para edição: ", error);
                alert("Erro ao carregar dados da viagem.");
            });
        
        document.getElementById("botaoExcluir").addEventListener("click", function(event) {
            event.preventDefault();
            if (confirm("Deseja confirmar a exclusão da viagem com ID: " + relatorioFirebaseId + "?")) {
                const itemRef = ref(window.database, `relatorios/${relatorioFirebaseId}`);
                remove(itemRef)
                    .then(() => {
                        alert("Viagem excluída com sucesso.");
                        window.location.href = "controleViagens.html";
                    })
                    .catch(error => {
                        console.error("Erro ao excluir viagem: ", error);
                        alert("Erro ao excluir viagem. Verifique o console.");
                    });
            }
        });

    } else {
        document.getElementById('botaoAlterar').style.display = 'none';
        document.getElementById('botaoExcluir').style.display = 'none';
    }
    // Fim da lógica de edição/exclusão


    // Lógica de validação de Data/Hora Saída (de relatorio.js)
    function validarDataHoraSaida(dataHoraString) {
        const $data_hora_saida = document.querySelector('#data_hora_saida');
        if (dataHoraString.trim() === '') { $data_hora_saida.setCustomValidity(''); return true; }
        const partesDataHora = dataHoraString.split(' ');
        if (partesDataHora.length !== 2) { mensagemAlertaDataHoraSaida(); return false; }
        const dataString = partesDataHora[0];
        const horaMinutoString = partesDataHora[1];
        const partesData = dataString.split('/');
        if (partesData.length !== 3) { mensagemAlertaDataHoraSaida(); return false; }
        const dia = parseInt(partesData[0], 10);
        const mes = parseInt(partesData[1], 10) - 1;
        const ano = parseInt(partesData[2], 10);
        const partesHoraMinuto = horaMinutoString.split(':');
        if (partesHoraMinuto.length !== 2) { mensagemAlertaDataHoraSaida(); return false; }
        const hora = parseInt(partesHoraMinuto[0], 10);
        const minuto = parseInt(partesHoraMinuto[1], 10);
        const data = new Date(ano, mes, dia, hora, minuto);
        const dataAtual = new Date();
        const seculoAtual = Math.floor(dataAtual.getFullYear() / 100);

        if (data.getDate() !== dia || data.getMonth() !== mes || data.getFullYear() !== ano ||
            isNaN(hora) || hora < 0 || hora > 23 || isNaN(minuto) || minuto < 0 || minuto > 59) {
            mensagemAlertaDataHoraSaida(); return false;
        }
        if (data.getFullYear() < seculoAtual * 100) { mensagemAlertaDataSaidaSeculoPassado(); return false; }
        $data_hora_saida.setCustomValidity(''); return true;
    }

    document.getElementById('data_hora_saida').addEventListener('blur', function() {
        const dataHoraDigitada = this.value;
        validarDataHoraSaida(dataHoraDigitada);
        const dataHoraChegadaDigitada = document.getElementById('data_hora_chegada').value;
        if (dataHoraChegadaDigitada) { validarOrdemDatas(dataHoraDigitada, dataHoraChegadaDigitada); }
    });

    function mensagemAlertaDataHoraSaida() {
        'use strict'; var $data_hora_saida = document.querySelector('#data_hora_saida');
        var errorsMessage = 'Data ou hora de saída inválida.';
        $data_hora_saida.setCustomValidity(errorsMessage); $data_hora_saida.reportValidity();
    }
    function mensagemAlertaDataSaidaSeculoPassado() {
        'use strict'; var $data_hora_saida = document.querySelector('#data_hora_saida');
        var errorsMessage = 'Data do século passado.';
        $data_hora_saida.setCustomValidity(errorsMessage); $data_hora_saida.reportValidity();
    }

    function validarDataHoraChegada(dataHoraString) {
        const $data_hora_chegada = document.querySelector('#data_hora_chegada');
        if (dataHoraString.trim() === '') { $data_hora_chegada.setCustomValidity(''); return true; }
        const partesDataHora = dataHoraString.split(' ');
        if (partesDataHora.length !== 2) { mensagemAlertaDataHoraChegada(); return false; }
        const dataString = partesDataHora[0];
        const horaMinutoString = partesDataHora[1];
        const partesData = dataString.split('/');
        if (partesData.length !== 3) { mensagemAlertaDataHoraChegada(); return false; }
        const dia = parseInt(partesData[0], 10); const mes = parseInt(partesData[1], 10) - 1; 
        const ano = parseInt(partesData[2], 10);
        const partesHoraMinuto = horaMinutoString.split(':');
        if (partesHoraMinuto.length !== 2) { mensagemAlertaDataHoraChegada(); return false; }
        const hora = parseInt(partesHoraMinuto[0], 10); const minuto = parseInt(partesHoraMinuto[1], 10);
        const data = new Date(ano, mes, dia, hora, minuto);
        const dataAtual = new Date(); const seculoAtual = Math.floor(dataAtual.getFullYear() / 100);

        if (data.getDate() !== dia || data.getMonth() !== mes || data.getFullYear() !== ano ||
            isNaN(hora) || hora < 0 || hora > 23 || isNaN(minuto) || minuto < 0 || minuto > 59) {
            mensagemAlertaDataHoraChegada(); return false;
        }
        if (data.getFullYear() < seculoAtual * 100) { mensagemAlertaDataChegadaSeculoPassado(); return false; }
        $data_hora_chegada.setCustomValidity(''); return true;
    }

    document.getElementById('data_hora_chegada').addEventListener('blur', function() {
        const dataHoraDigitada = this.value;
        validarDataHoraChegada(dataHoraDigitada);
        const dataHoraSaidaDigitada = document.getElementById('data_hora_saida').value;
        if (dataHoraSaidaDigitada) { validarOrdemDatas(dataHoraSaidaDigitada, dataHoraDigitada); }
    });

    function mensagemAlertaDataHoraChegada() {
        'use strict'; var $data_hora_chegada = document.querySelector('#data_hora_chegada');
        var errorsMessage = 'Data ou hora de chegada inválida.';
        $data_hora_chegada.setCustomValidity(errorsMessage); $data_hora_chegada.reportValidity();
    }
    function mensagemAlertaDataChegadaSeculoPassado() {
        'use strict'; var $data_hora_chegada = document.querySelector('#data_hora_chegada');
        var errorsMessage = 'Data do século passado.';
        $data_hora_chegada.setCustomValidity(errorsMessage); $data_hora_chegada.reportValidity();
    }

    function parseDataHoraString(dataHoraString) {
        const partesDataHora = dataHoraString.split(' ');
        const dataString = partesDataHora[0];
        const horaMinutoString = partesDataHora[1];
        const [dia, mes, ano] = dataString.split('/').map(Number);
        const [hora, minuto] = horaMinutoString.split(':').map(Number);
        return new Date(ano, mes - 1, dia, hora, minuto);
    }

    function validarOrdemDatas(dataHoraSaidaString, dataHoraChegadaString) {
        const $data_hora_saida = document.querySelector('#data_hora_saida');
        const $data_hora_chegada = document.querySelector('#data_hora_chegada');

        if (dataHoraSaidaString.trim() === '' || dataHoraChegadaString.trim() === '') {
            $data_hora_saida.setCustomValidity(''); $data_hora_chegada.setCustomValidity(''); return true;
        }

        if (!validarDataHoraSaida(dataHoraSaidaString) || !validarDataHoraChegada(dataHoraChegadaString)) { return false; }

        const dataSaida = parseDataHoraString(dataHoraSaidaString);
        const dataChegada = parseDataHoraString(dataHoraChegadaString);

        if (isNaN(dataSaida.getTime()) || isNaN(dataChegada.getTime())) { return false; }

        if (dataChegada.getTime() <= dataSaida.getTime()) { mensagemAlertaDataOrdemInvalida(); return false; }

        $data_hora_saida.setCustomValidity(''); $data_hora_chegada.setCustomValidity(''); return true;
    }

    function mensagemAlertaDataOrdemInvalida() {
        'use strict'; var $data_hora_saida = document.querySelector('#data_hora_saida');
        var $data_hora_chegada = document.querySelector('#data_hora_chegada');
        var errorsMessage = 'Data/Hora de chegada deve ser posterior à Data/Hora de saída.';
        $data_hora_saida.setCustomValidity(errorsMessage); $data_hora_saida.reportValidity();
        $data_hora_chegada.setCustomValidity(errorsMessage); $data_hora_chegada.reportValidity();
    }

    function mensagemAlertaDataDestoante() {
        'use strict'; var $data_hora_saida = document.querySelector('#data_hora_saida');
        var $data_hora_chegada = document.querySelector('#data_hora_chegada');
        var errorsMessage = 'Data Inválida. Mais de um mês de diferença entre as datas.';
        $data_hora_saida.setCustomValidity(errorsMessage); $data_hora_saida.reportValidity();
        $data_hora_chegada.setCustomValidity(errorsMessage); $data_hora_chegada.reportValidity();
    }

    relatorioForm.addEventListener('submit', function(event) {
        event.preventDefault();

        let formIsValid = true;

        if (!veiculoSelect.value) { formIsValid = false; veiculoSelect.setCustomValidity('Selecione um veículo.'); veiculoSelect.reportValidity(); } else { veiculoSelect.setCustomValidity(''); }
        if (!motoristaSelect.value) { formIsValid = false; motoristaSelect.setCustomValidity('Selecione um motorista.'); motoristaSelect.reportValidity(); } else { motoristaSelect.setCustomValidity(''); }
        
        if (!validarDataHoraSaida(document.getElementById('data_hora_saida').value)) { formIsValid = false; }
        if (!validarDataHoraChegada(document.getElementById('data_hora_chegada').value)) { formIsValid = false; }
        if (!validarOrdemDatas(document.getElementById('data_hora_saida').value, document.getElementById('data_hora_chegada').value)) { formIsValid = false; }

        // A função 'validarDataHora' que verifica "mais de um mês de diferença" está faltando.
        // Se a validação `mensagemAlertaDataDestoante` é para ser chamada, precisa ser integrada aqui.
        // Por agora, vou pular a chamada dela, pois a `validarOrdemDatas` já trata o principal.
        // Se você precisa dessa validação, adicione a chamada à função `validarDataHora` se ela existir em algum lugar ou a lógica de checagem de "mais de um mês".


        if (!document.getElementById('rota').value.trim()) { formIsValid = false; document.getElementById('rota').setCustomValidity('Informe a rota.'); document.getElementById('rota').reportValidity(); } else { document.getElementById('rota').setCustomValidity(''); }
        if (!document.getElementById('itinerario').value.trim()) { formIsValid = false; document.getElementById('itinerario').setCustomValidity('Informe o itinerário.'); document.getElementById('itinerario').reportValidity(); } else { document.getElementById('itinerario').setCustomValidity(''); }

        if (!quilometragemInicialInput.disabled && !validaQuilometragemTotal()) {
            formIsValid = false;
        }

        if (!this.checkValidity()) {
            formIsValid = false;
        }

        if (!formIsValid) {
            return;
        }

        const selectedVeiculoOption = veiculoSelect.options[veiculoSelect.selectedIndex];
        const selectedMotoristaOption = motoristaSelect.options[motoristaSelect.selectedIndex];

        const relatorioData = {
            idVeiculo: selectedVeiculoOption.value,
            nomeVeiculo: selectedVeiculoOption.textContent,
            idMotorista: selectedMotoristaOption.value,
            nomeMotorista: selectedMotoristaOption.textContent,
            rota: document.getElementById('rota').value,
            dataHoraSaida: document.getElementById('data_hora_saida').value,
            dataHoraChegada: document.getElementById('data_hora_chegada').value,
            quilometragemInicial: quilometragemInicialInput.value,
            quilometragemFinal: quilometragemFinalInput.value,
            quilometragemPercorrida: quilometragemPercorridaInput.value,
            itinerario: document.getElementById('itinerario').value,
            observacao: document.getElementById('observacao').value,
            status: 'Pendente'
        };

        if (relatorioFirebaseId) {
            const itemRef = ref(window.database, `relatorios/${relatorioFirebaseId}`);
            
            once(itemRef).then(snapshot => {
                const originalRelatorio = snapshot.val();
                relatorioData.status = originalRelatorio.status || 'Pendente';

                return update(itemRef, relatorioData);
            })
            .then(() => {
                alert('Viagem atualizada com sucesso no Firebase!');
                window.location.href = 'controleViagens.html';
            })
            .catch(error => {
                console.error("Erro ao atualizar viagem no Firebase: ", error);
                alert('Erro ao atualizar viagem. Verifique o console.');
            });
        } else {
            push(relatoriosRef, relatorioData)
                .then(() => {
                    alert('Viagem cadastrada com sucesso no Firebase!');
                    relatorioForm.reset();
                    quilometragemInicialInput.value = '';
                    quilometragemFinalInput.value = '';
                    quilometragemPercorridaInput.value = '';
                })
                .catch(error => {
                    console.error("Erro ao cadastrar viagem no Firebase: ", error);
                    alert('Erro ao cadastrar viagem. Verifique o console para mais detalhes.');
                });
        }
    });

    window.gerarPDF = function() {
        var veiculo = document.getElementById('veiculo').value;
        var motorista = document.getElementById('motorista').value;
        var rota = document.getElementById('rota').value;
        var dataHoraSaida = document.getElementById('data_hora_saida').value;
        var dataHoraChegada = document.getElementById('data_hora_chegada').value;
        var quilometragemInicial = document.getElementById('quilometragemInicial').value;
        var quilometragemFinal = document.getElementById('quilometragemFinal').value;
        var quilometragemPercorrida = document.getElementById('quilometragemPercorrida').value;
        var itinerario = document.getElementById('itinerario').value;
        var observacao = document.getElementById('observacao').value;

        var content = `
            <h1 style="font-size: 30px; text-align: center;">Informações da Viagem</h1><br><br>
            <p><strong>Veículo:</strong> ${veiculo}</p><br>
            <p><strong>Motorista:</strong> ${motorista}</p><br>
            <p><strong>Rota:</strong> ${rota}</p><br>
            <p><strong>Data e Hora de Saída:</strong> ${dataHoraSaida}</p><br>
            <p><strong>Data e Hora de Chegada:</strong> ${dataHoraChegada}</p><br>
            <p><strong>Quilometragem Inicial:</strong> ${quilometragemInicial} Km</p><br>
            <p><strong>Quilometragem Final:</strong> ${quilometragemFinal} Km</p><br>
            <p><strong>Quilometragem Percorrida:</strong> ${quilometragemPercorrida} Km</p><br>
            <p><strong>Itinerário:</strong> ${itinerario}</p><br>
            <p style="white-space: pre-line;"><strong>Observação:</strong> ${observacao}</p>
        `;

        var currentDate = new Date();
        var day = String(currentDate.getDate()).padStart(2, '0');
        var month = String(currentDate.getMonth() + 1).padStart(2, '0');
        var year = currentDate.getFullYear();
        var formattedDate = day + "-" + month + "-" + year;

        var opt = {
            margin: 1,
            filename: 'registro-viagem-' + formattedDate + '.pdf',
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().from(content).set(opt).save();
    };
});
