document.addEventListener('DOMContentLoaded', function() {
    const loggedInMotoristaId = localStorage.getItem('loggedInMotoristaId');
    const tableBody = document.getElementById('tableBodyViagensMotorista');
    const relatoriosRef = ref(window.database, 'relatorios');

    if (!loggedInMotoristaId) {
        alert('Nenhum motorista logado. Redirecionando para a página de login.');
        window.location.href = 'index.html';
        return;
    }

    onValue(relatoriosRef, (snapshot) => {
        const relatoriosData = snapshot.val();
        const relatoriosArray = [];

        for (let firebaseId in relatoriosData) {
            relatoriosArray.push({ id: firebaseId, ...relatoriosData[firebaseId] });
        }
        
        loadMotoristaViagens(relatoriosArray, loggedInMotoristaId);
    }, (errorObject) => {
        console.error("A leitura de dados falhou: " + errorObject.name);
        alert("Erro ao carregar suas viagens do banco de dados.");
    });

    function loadMotoristaViagens(relatorios, motoristaId) {
        tableBody.innerHTML = '';

        const minhasViagens = relatorios.filter(viagem =>
            viagem.idMotorista == motoristaId
        );

        if (minhasViagens.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7">Nenhuma viagem designada para você no momento.</td></tr>';
            return;
        }

        minhasViagens.forEach(viagem => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = viagem.id;
            row.insertCell().textContent = viagem.nomeVeiculo;
            row.insertCell().textContent = viagem.rota;
            row.insertCell().textContent = viagem.dataHoraSaida;
            row.insertCell().textContent = viagem.dataHoraChegada;
            row.insertCell().textContent = viagem.status;

            const acoesCell = row.insertCell();

            if (viagem.status === 'Pendente') {
                const iniciarButton = document.createElement('button');
                iniciarButton.textContent = 'Iniciar Viagem';
                iniciarButton.classList.add('action-button', 'start-button');
                iniciarButton.onclick = () => showIniciarViagemModal(viagem);
                acoesCell.appendChild(iniciarButton);
            } else if (viagem.status === 'Em Rota') {
                const concluirButton = document.createElement('button');
                concluirButton.textContent = 'Concluir Viagem';
                concluirButton.classList.add('action-button', 'finish-button');
                concluirButton.onclick = () => showConcluirViagemModal(viagem);
                acoesCell.appendChild(concluirButton);
            } else if (viagem.status === 'Concluída') {
                acoesCell.textContent = 'Viagem Concluída';
            }
        });
    }

    function showIniciarViagemModal(viagem) {
        const kmInicial = prompt(`Informe a quilometragem atual do veículo (${viagem.nomeVeiculo}) para iniciar a viagem para ${viagem.rota}:`);

        if (kmInicial !== null && !isNaN(kmInicial) && kmInicial.trim() !== '') {
            const kmInicialNum = parseFloat(kmInicial);
            if (kmInicialNum < 0) {
                alert('A quilometragem inicial não pode ser negativa.');
                return;
            }
            updateViagemStatus(viagem.id, 'Em Rota', {
                quilometragemInicial: kmInicialNum,
                dataHoraSaidaReal: new Date().toLocaleString('pt-BR')
            });
        } else if (kmInicial !== null) {
            alert('Quilometragem inválida. Por favor, insira um número.');
        }
    }

    function showConcluirViagemModal(viagem) {
        const kmFinal = prompt(`Informe a quilometragem final do veículo (${viagem.nomeVeiculo}) para concluir a viagem para ${viagem.rota}:`);

        if (kmFinal !== null && !isNaN(kmFinal) && kmFinal.trim() !== '') {
            const kmFinalNum = parseFloat(kmFinal);
            if (kmFinalNum < viagem.quilometragemInicial) {
                alert('A quilometragem final não pode ser menor que a quilometragem inicial.');
                return;
            }
            updateViagemStatus(viagem.id, 'Concluída', {
                quilometragemFinal: kmFinalNum,
                quilometragemPercorrida: kmFinalNum - viagem.quilometragemInicial,
                dataHoraChegadaReal: new Date().toLocaleString('pt-BR')
            });
        } else if (kmFinal !== null) {
            alert('Quilometragem inválida. Por favor, insira um número.');
        }
    }

    function updateViagemStatus(viagemId, newStatus, updates = {}) {
        const itemRef = ref(window.database, `relatorios/${viagemId}`);
        update(itemRef, { status: newStatus, ...updates })
            .then(() => {
                alert(`Status da viagem ID ${viagemId} atualizado para "${newStatus}"!`);
            })
            .catch(error => {
                console.error("Erro ao atualizar status da viagem no Firebase: ", error);
                alert('Erro ao atualizar status da viagem. Verifique o console.');
            });
    }

    // Ações de sidebar (reutilizadas do sistema existente)
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
