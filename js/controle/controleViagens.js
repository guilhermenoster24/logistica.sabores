document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('tableBody');
    const relatoriosRef = ref(window.database, 'relatorios');

    onValue(relatoriosRef, (snapshot) => {
        const relatoriosData = snapshot.val();
        const relatoriosArray = [];

        for (let firebaseId in relatoriosData) {
            relatoriosArray.push({ id: firebaseId, ...relatoriosData[firebaseId] });
        }
        
        loadRelatorios(relatoriosArray);
    }, (errorObject) => {
        console.error("A leitura de dados falhou: " + errorObject.name);
        alert("Erro ao carregar relatórios do banco de dados.");
    });

    function loadRelatorios(relatorios) {
        tableBody.innerHTML = '';

        if (relatorios.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="12">Nenhuma viagem cadastrada.</td></tr>';
            return;
        }

        relatorios.forEach(relatorio => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = relatorio.id;
            row.insertCell().textContent = relatorio.nomeVeiculo;
            row.insertCell().textContent = relatorio.nomeMotorista;
            row.insertCell().textContent = relatorio.rota;
            row.insertCell().textContent = relatorio.dataHoraSaida;
            row.insertCell().textContent = relatorio.dataHoraChegada;
            row.insertCell().textContent = relatorio.quilometragemInicial || '-';
            row.insertCell().textContent = relatorio.quilometragemFinal || '-';
            row.insertCell().textContent = relatorio.quilometragemPercorrida || '-';
            row.insertCell().textContent = relatorio.status;

            const editCell = row.insertCell();
            const editButton = document.createElement('button');
            editButton.innerHTML = '<i class="bi bi-pencil-square"></i>';
            editButton.classList.add('edit-button');
            editButton.title = 'Editar';
            editButton.onclick = () => editRelatorio(relatorio.id); 
            editCell.appendChild(editButton);

            const deleteCell = row.insertCell();
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
            deleteButton.classList.add('delete-button');
            deleteButton.title = 'Excluir';
            deleteButton.onclick = () => deleteRelatorio(relatorio.id); 
            deleteCell.appendChild(deleteButton);
        });
    }

    function editRelatorio(firebaseId) {
        window.location.href = `relatorio.html?id=${firebaseId}`;
    }

    function deleteRelatorio(firebaseId) {
        if (confirm(`Tem certeza que deseja excluir o relatório ID ${firebaseId}?`)) {
            const itemRef = ref(window.database, `relatorios/${firebaseId}`);
            remove(itemRef)
                .then(() => {
                    alert('Relatório excluído com sucesso do Firebase!');
                })
                .catch(error => {
                    console.error("Erro ao excluir relatório do Firebase: ", error);
                    alert('Erro ao excluir relatório. Verifique o console.');
                });
        }
    }
});
