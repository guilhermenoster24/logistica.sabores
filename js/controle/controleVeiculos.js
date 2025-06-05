document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('tableBody');
    const veiculosRef = ref(window.database, 'veiculos');

    onValue(veiculosRef, (snapshot) => {
        const veiculosData = snapshot.val();
        const veiculosArray = [];

        for (let firebaseId in veiculosData) {
            veiculosArray.push({ id: firebaseId, ...veiculosData[firebaseId] });
        }
        
        loadVeiculos(veiculosArray);
    }, (errorObject) => {
        console.error("A leitura de dados falhou: " + errorObject.name);
        alert("Erro ao carregar veículos do banco de dados.");
    });

    function loadVeiculos(veiculos) {
        tableBody.innerHTML = '';

        if (veiculos.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7">Nenhum veículo cadastrado.</td></tr>';
            return;
        }

        veiculos.forEach(veiculo => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = veiculo.id;
            row.insertCell().textContent = veiculo.placa;
            row.insertCell().textContent = veiculo.marca;
            row.insertCell().textContent = veiculo.modelo;
            row.insertCell().textContent = veiculo.cor;

            const editCell = row.insertCell();
            const editButton = document.createElement('button');
            editButton.innerHTML = '<i class="bi bi-pencil-square"></i>';
            editButton.classList.add('edit-button');
            editButton.title = 'Editar';
            editButton.onclick = () => editVeiculo(veiculo.id); 
            editCell.appendChild(editButton);

            const deleteCell = row.insertCell();
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
            deleteButton.classList.add('delete-button');
            deleteButton.title = 'Excluir';
            deleteButton.onclick = () => deleteVeiculo(veiculo.id, veiculo.placa); 
            deleteCell.appendChild(deleteButton);
        });
    }

    function editVeiculo(firebaseId) {
        window.location.href = `cadastroVeiculo.html?id=${firebaseId}`;
    }

    function deleteVeiculo(firebaseId, placaVeiculo) {
        if (confirm(`Tem certeza que deseja excluir o veículo de placa ${placaVeiculo} (ID: ${firebaseId})?`)) {
            const itemRef = ref(window.database, `veiculos/${firebaseId}`);
            remove(itemRef)
                .then(() => {
                    alert('Veículo excluído com sucesso do Firebase!');
                })
                .catch(error => {
                    console.error("Erro ao excluir veículo do Firebase: ", error);
                    alert('Erro ao excluir veículo. Verifique o console.');
                });
        }
    }
});
