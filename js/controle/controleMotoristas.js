document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('tableBody');
    const motoristasRef = ref(window.database, 'motoristas');

    onValue(motoristasRef, (snapshot) => {
        const motoristasData = snapshot.val();
        const motoristasArray = [];

        for (let firebaseId in motoristasData) {
            motoristasArray.push({ id: firebaseId, ...motoristasData[firebaseId] });
        }
        
        loadMotoristas(motoristasArray);
    }, (errorObject) => {
        console.error("A leitura de dados falhou: " + errorObject.name);
        alert("Erro ao carregar motoristas do banco de dados.");
    });

    function loadMotoristas(motoristas) {
        tableBody.innerHTML = '';

        if (motoristas.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7">Nenhum motorista cadastrado.</td></tr>';
            return;
        }

        motoristas.forEach(motorista => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = motorista.id;
            row.insertCell().textContent = motorista.nome;
            row.insertCell().textContent = motorista.email;
            row.insertCell().textContent = motorista.rg;
            row.insertCell().textContent = motorista.cpf;

            const editCell = row.insertCell();
            const editButton = document.createElement('button');
            editButton.innerHTML = '<i class="bi bi-pencil-square"></i>';
            editButton.classList.add('edit-button');
            editButton.title = 'Editar';
            editButton.onclick = () => editMotorista(motorista.id); 
            editCell.appendChild(editButton);

            const deleteCell = row.insertCell();
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
            deleteButton.classList.add('delete-button');
            deleteButton.title = 'Excluir';
            deleteButton.onclick = () => deleteMotorista(motorista.id, motorista.nome); 
            deleteCell.appendChild(deleteButton);
        });
    }

    function editMotorista(firebaseId) {
        window.location.href = `cadastroMotorista.html?id=${firebaseId}`;
    }

    function deleteMotorista(firebaseId, nomeMotorista) {
        if (confirm(`Tem certeza que deseja excluir o motorista ${nomeMotorista} (ID: ${firebaseId})?`)) {
            const itemRef = ref(window.database, `motoristas/${firebaseId}`);
            remove(itemRef)
                .then(() => {
                    alert('Motorista excluído com sucesso do Firebase!');
                })
                .catch(error => {
                    console.error("Erro ao excluir motorista do Firebase: ", error);
                    alert('Erro ao excluir motorista. Verifique o console.');
                });
        }
    }
});
