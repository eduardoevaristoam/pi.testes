
document.addEventListener('DOMContentLoaded', () => {

    // Interface do usuário
    const userIcon = document.getElementById('userIcon');
    const dropdownContent = document.getElementById('dropdownContent');
    const logoutButton = document.getElementById('logoutButton');

    // Função para mostrar dropdown
    function toggleDropdown() {
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    }

    // Fechar dropdown ao clicar fora
    function closeDropdownOnClickOutside(event) {
        if (!userIcon.contains(event.target) && !dropdownContent.contains(event.target)) {
            dropdownContent.style.display = 'none';
        }
    }

    if (userIcon && dropdownContent && logoutButton) {
        userIcon.addEventListener('click', toggleDropdown);
        document.addEventListener('click', closeDropdownOnClickOutside);

        logoutButton.addEventListener('click', () => {
            showCustomAlert('Usuário deslogado!');
        });
    }

    // Modal de dispositivos
    const addDeviceBtn = document.getElementById('addDeviceBtn');
    const deviceModal = document.getElementById('deviceModal');
    const closeDeviceModal = document.querySelector('.close-device-modal');
    const saveDeviceBtn = document.getElementById('saveDeviceBtn');
    const cancelDeviceBtn = document.getElementById('cancelDeviceBtn');
    const deviceNameInput = document.getElementById('deviceNameInput');
    const deviceContainer = document.getElementById('deviceContainer');

    // Função para fechar modal de dispositivo
    function closeDeviceModalAction() {
        deviceModal.style.display = 'none';
        document.getElementById('deviceForm').reset();
    }

    // Função para verificar se o nome do dispositivo já existe
    // c é o array, name é o nome que busca verificar existencia
    function NameExists(c,name){
        return Array.from(c.getElementsByClassName('col')).some(col => col.textContent.trim() === name);
    }

    // Função para anexar eventos a linha de dispositivos
    function attachDeviceRowEvents(row) {
        const optionsBtn = row.querySelector('.options-btn');
        const optionsMenu = row.querySelector('.options-menu');
        const editDeviceBtn = row.querySelector('.edit-device-btn');
        const deleteDeviceBtn = row.querySelector('.delete-device-btn');

        // Abrir/Fechar menu de opções
        optionsBtn.addEventListener('click', () => {
            optionsMenu.style.display = optionsMenu.style.display === 'block' ? 'none' : 'block';
        });

        // Funções relacionadas à edição de dispositivos
        editDeviceBtn.addEventListener('click', () => openEditDeviceModal(row));

        // Deletar dispositivo
        deleteDeviceBtn.addEventListener('click', () => row.remove());

        // Fechar menu de opções ao clicar fora
        document.addEventListener('click', (event) => {
            if (!optionsBtn.contains(event.target) && !optionsMenu.contains(event.target)) {
                optionsMenu.style.display = 'none';
            }
        });
    }

    // Função para abrir modal de edição de dispositivo
    function openEditDeviceModal(row) {
        const editDeviceModal = document.getElementById('editDeviceModal');
        const editDeviceNameInput = document.getElementById('editDeviceNameInput');
        const updateDeviceBtn = document.getElementById('updateDeviceBtn');
        const closeEditModal = document.querySelector('.close-edit-modal');
        const cancelUpdateDeviceBtn = document.querySelector('#cancelUpdateDeviceBtn');

        // Preencher o campo de entrada com o nome atual do dispositivo
        editDeviceNameInput.value = row.querySelector('.col').textContent.trim();

        // Abrir o modal
        editDeviceModal.style.display = 'flex';

        // Fechar o modal
        closeEditModal.addEventListener('click', () => closeModal(editDeviceModal));
        cancelUpdateDeviceBtn.addEventListener('click', () => closeModal(editDeviceModal));

        // Atualizar o nome do dispositivo
        updateDeviceBtn.addEventListener('click', () => {
            const newName = editDeviceNameInput.value.trim();
            if (newName && !NameExists(deviceContainer,newName)) {

                row.querySelector('.col').textContent = newName;
                closeModal(editDeviceModal);
            } else {
                showCustomAlert('Este nome já está sendo utilizado!');
            }
        });
    }
    // Função para abrir/fechar modal de criação de dispositivo
    if (addDeviceBtn && deviceModal && closeDeviceModal && saveDeviceBtn && cancelDeviceBtn && deviceNameInput) {
        addDeviceBtn.addEventListener('click', () => deviceModal.style.display = 'flex');
        closeDeviceModal.addEventListener('click', closeDeviceModalAction);
        cancelDeviceBtn.addEventListener('click', closeDeviceModalAction);

        // Salvar novo dispositivo
        saveDeviceBtn.addEventListener('click', () => {
            const deviceName = deviceNameInput.value.trim();
            if (!deviceName) {
                showCustomAlert('Informe um nome antes de continuar!');
                return;
            }
            if (NameExists(deviceContainer, deviceName)) {
                showCustomAlert('Este nome já está sendo utilizado!');
                return;
            }

            const row = document.createElement('div');
            row.className = 'row';
            row.innerHTML = `
                <div class="col">${deviceName}</div>
                <div class="col">
                    <button class="options-btn">...</button>
                    <div class="options-menu">
                        <button class="clear-service-btn">Desatribuir Serviço</button>
                        <button class="edit-device-btn">Editar</button>
                        <button class="delete-device-btn">Excluir</button>
                    </div>
                </div>
            `;
            deviceContainer.appendChild(row);
            attachDeviceRowEvents(row);
            closeDeviceModalAction();
        });
    }


    // Modal de criação de playlist
    const addPlaylistBtn = document.getElementById('addPlaylistBtn');
    const playlistModal = document.getElementById('playlistModal');
    const closeModalBtn = document.querySelector('.close');
    const savePlaylistBtn = document.getElementById('savePlaylistBtn');
    const cancelPlaylistBtn = document.getElementById('cancelPlaylistBtn');
    const mediaContainer = document.getElementById('mediaContainer');
    const addMediaBtn = document.getElementById('addMediaBtn');

    // Função para fechar modal de playlist
    function closeModal(modal) {
        modal.style.display = 'none';
    }

    // Função para adicionar eventos à playlist
    function attachMediaEvents(mediaItem) {
        const deleteBtn = mediaItem.querySelector('.delete-media-btn');
        deleteBtn.addEventListener('click', () => mediaItem.remove());
    }

    if (addPlaylistBtn && playlistModal && closeModalBtn && savePlaylistBtn && cancelPlaylistBtn && mediaContainer && addMediaBtn) {
        addPlaylistBtn.addEventListener('click', () => playlistModal.style.display = 'flex');
        closeModalBtn.addEventListener('click', () => closeModal(playlistModal));
        cancelPlaylistBtn.addEventListener('click', () => closeModal(playlistModal));

        // Adicionar nova mídia
        addMediaBtn.addEventListener('click', () => {
            const mediaType = prompt('Informe o tipo de mídia (texto, audio, video):');
            if (mediaType) {
                const mediaItem = document.createElement('div');
                mediaItem.className = 'media-item';
                mediaItem.innerHTML = `
                    <span>${mediaType}</span>
                    <span class="delete-media-btn">🗑️</span>
                `;
                mediaContainer.appendChild(mediaItem);
                attachMediaEvents(mediaItem);
            }
        });
    }

    function attachPlaylistRowEvents(row) {
        const optionsBtn = row.querySelector('.options-btn');
        const optionsMenu = row.querySelector('.options-menu');
        const editPlaylistBtn = row.querySelector('.edit-playlist-btn');
        const deletePlaylistBtn = row.querySelector('.delete-playlist-btn');
    
        // Abrir/Fechar menu de opções
        optionsBtn.addEventListener('click', () => {
            optionsMenu.style.display = optionsMenu.style.display === 'block' ? 'none' : 'block';
        });
    
        // Funções relacionadas à edição de playlists
        editPlaylistBtn.addEventListener('click', () => openEditPlaylistModal(row));
    
        // Deletar playlist
        deletePlaylistBtn.addEventListener('click', () => row.remove());
    
        // Fechar menu de opções ao clicar fora
        document.addEventListener('click', (event) => {
            if (!optionsBtn.contains(event.target) && !optionsMenu.contains(event.target)) {
                optionsMenu.style.display = 'none';
            }
        });
    }

    // Salvar nova playlist
    savePlaylistBtn.addEventListener('click', () => {
        const playlistName = document.getElementById('playlistName').value.trim();
        const mediaDuration = document.getElementById('mediaDuration').value.trim();

        if (playlistName && mediaDuration) {
            const playlistRow = document.createElement('div');
            playlistRow.className = 'row';
            playlistRow.innerHTML = `
                <div class="col">${playlistName}</div>
                <div class="col">${mediaDuration} segundos</div>
                <div class="col">
                    <button class="options-btn">...</button>
                    <div class="options-menu">
                        <button class="attach-service-btn">Atribuir Serviço</button>
                        <button class="edit-playlist-btn">Editar</button>
                        <button class="delete-playlist-btn">Excluir</button>
                    </div>
                </div>
            `;
            document.getElementById('playlistContainer').appendChild(playlistRow);
            attachPlaylistRowEvents(playlistRow);  // Anexar os eventos à nova linha de playlist
            closeModal(playlistModal);
        } else {
            showCustomAlert('Preencha todos os campos antes de continuar!');
        }
    });


    // Função para abrir modal de edição de playlist
    function openEditPlaylistModal(row) {
        const editPlaylistModal = document.getElementById('editplaylistModal');
        const editPlaylistNameInput = document.getElementById('editPlaylistNameInput');
        const updatePlaylistBtn = document.getElementById('updatePlaylistBtn');
        const closeEditModal = document.querySelector('.close-edit-modal');
        const cancelUpdatePlaylistBtn = document.querySelector('#cancelUpdatePlaylistBtn');

        // Preencher o campo de entrada com o nome atual do dispositivo
        editPlaylistNameInput.value = row.querySelector('.col').textContent.trim();

        // Abrir o modal
        editPlaylistModal.style.display = 'flex';

        // Fechar o modal
        closeEditModal.addEventListener('click', () => closeModal(editPlaylistModal));
        cancelUpdatePlaylistBtn.addEventListener('click', () => closeModal(editPlaylistModal));

        // Atualizar o nome da playlist e seus dados
        updatePlaylistBtn.addEventListener('click', () => {
            const newName = editPlaylistNameInput.value.trim();
            if (newName && !NameExists(playlistContainer,newName)) {

                row.querySelector('.col').textContent = newName;
                closeModal(editPlaylistModal);
            } else {
                showCustomAlert('Este nome já está sendo utilizado!');
            }
        });
    }

    //funcao geral para exibir os alertas
    function showCustomAlert(message) {
        const modal = document.getElementById('customAlertModal');
        const alertMessage = document.getElementById('alertMessage');
        const closeAlert = document.querySelector('.close-alert');
        const alertOkBtn = document.getElementById('alertOkBtn');
    
        alertMessage.textContent = message;
        modal.style.display = 'block';
    
        function closeModal() {
            modal.style.display = 'none';
        }
    
        closeAlert.addEventListener('click', closeModal);
        alertOkBtn.addEventListener('click', closeModal);
    
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }
});

