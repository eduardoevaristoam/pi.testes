document.addEventListener('DOMContentLoaded', () => {
    // Interface superior direito, user interface
    const userIcon = document.getElementById('userIcon');
    const dropdownContent = document.getElementById('dropdownContent');
    const logoutButton = document.getElementById('logoutButton');

    if (userIcon && dropdownContent && logoutButton) {
        userIcon.addEventListener('click', () => {
            dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', (event) => {
            if (!userIcon.contains(event.target) && !dropdownContent.contains(event.target)) {
                dropdownContent.style.display = 'none';
            }
        });

        logoutButton.addEventListener('click', () => {
            alert('Usuário deslogado!');
        });
    }

    // Botão de cadastro de dispositivo
    const addDeviceBtn = document.getElementById('addDeviceBtn');
    const deviceContainer = document.getElementById('deviceContainer');
    const deviceModal = document.getElementById('deviceModal');
    const closeDeviceModal = document.querySelector('.close-device-modal');
    const saveDeviceBtn = document.getElementById('saveDeviceBtn');
    const cancelDeviceBtn = document.getElementById('cancelDeviceBtn');
    const deviceNameInput = document.getElementById('deviceNameInput');

    if (addDeviceBtn && deviceContainer && deviceModal && closeDeviceModal && saveDeviceBtn && cancelDeviceBtn && deviceNameInput) {
        // Abrir modal de criação de dispositivo
        addDeviceBtn.addEventListener('click', () => {
            deviceModal.style.display = 'flex';
        });

        // Fechar modal
        closeDeviceModal.addEventListener('click', () => {
            closeDeviceModalAction();
        });

        // Cancelar criação do dispositivo
        cancelDeviceBtn.addEventListener('click', () => {
            closeDeviceModalAction();
        });

        function closeDeviceModalAction() {
            deviceModal.style.display = 'none';
            document.getElementById('deviceForm').reset();
        }

        // Salvar dispositivo
        saveDeviceBtn.addEventListener('click', () => {
            const deviceName = deviceNameInput.value;

            if (deviceName) {
                const row = document.createElement('div');
                row.className = 'row';
                row.innerHTML = `
                    <div class="col">${deviceName}</div>
                    <div class="col">
                        <button class="options-btn">...</button>
                        <div class="options-menu">
                            <button class="edit-device-btn">Editar</button>
                            <button class="delete-device-btn">Excluir</button>
                        </div>
                    </div>
                `;
                deviceContainer.appendChild(row);

                attachDeviceRowEvents(row);
                closeDeviceModalAction();
            }
        });

        // Anexar eventos aos botões de dispositivos
        function attachDeviceRowEvents(row) {
            const optionsBtn = row.querySelector('.options-btn');
            const optionsMenu = row.querySelector('.options-menu');
            const editDeviceBtn = row.querySelector('.edit-device-btn');
            const deleteDeviceBtn = row.querySelector('.delete-device-btn');

            optionsBtn.addEventListener('click', () => {
                optionsMenu.style.display = optionsMenu.style.display === 'block' ? 'none' : 'block';
            });

            editDeviceBtn.addEventListener('click', () => {
                const newName = prompt('Digite o novo nome do dispositivo:');
                if (newName) {
                    row.querySelector('.col').textContent = newName;
                }
                optionsMenu.style.display = 'none';
            });

            deleteDeviceBtn.addEventListener('click', () => {
                row.remove();
            });

            document.addEventListener('click', (event) => {
                if (!optionsBtn.contains(event.target) && !optionsMenu.contains(event.target)) {
                    optionsMenu.style.display = 'none';
                }
            });
        }
    }

    // Funções relacionadas ao modal de criação de playlist
    const addPlaylistBtn = document.getElementById('addPlaylistBtn');
    const playlistModal = document.getElementById('playlistModal');
    const closeModal = document.querySelector('.close');
    const savePlaylistBtn = document.getElementById('savePlaylistBtn');
    const cancelPlaylistBtn = document.getElementById('cancelPlaylistBtn');
    const mediaContainer = document.getElementById('mediaContainer');
    const addMediaBtn = document.getElementById('addMediaBtn');

    if (addPlaylistBtn && playlistModal && closeModal && savePlaylistBtn && cancelPlaylistBtn && mediaContainer && addMediaBtn) {
        // Abrir modal de criação de playlist
        addPlaylistBtn.addEventListener('click', () => {
            playlistModal.style.display = 'flex';
        });

        // Fechar modal
        closeModal.addEventListener('click', () => {
            closeModalAction();
        });

        // Cancelar criação da playlist
        cancelPlaylistBtn.addEventListener('click', () => {
            closeModalAction();
        });

        function closeModalAction() {
            playlistModal.style.display = 'none';
            document.getElementById('playlistForm').reset();
            mediaContainer.innerHTML = ''; // Limpar mídias adicionadas
        }

        // Adicionar mídia
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

        // Anexar eventos às mídias
        function attachMediaEvents(mediaItem) {
            const deleteBtn = mediaItem.querySelector('.delete-media-btn');
            deleteBtn.addEventListener('click', () => {
                mediaItem.remove();
            });
        }

        // Salvar playlist
        savePlaylistBtn.addEventListener('click', () => {
            const playlistName = document.getElementById('playlistName').value;
            const mediaDuration = document.getElementById('mediaDuration').value;

            if (playlistName && mediaDuration) {
                const playlistRow = document.createElement('div');
                playlistRow.className = 'row';
                playlistRow.innerHTML = `
                    <div class="col">${playlistName}</div>
                    <div class="col">${mediaDuration} segundos</div>
                    <div class="col">
                        <button class="edit-btn">Editar</button>
                    </div>
                `;
                document.getElementById('playlistContainer').appendChild(playlistRow);

                closeModalAction();
            }
        });

        // Fechar o modal ao clicar fora do conteúdo
        window.addEventListener('click', (event) => {
            if (event.target === playlistModal) {
                closeModalAction();
            }
        });
    }
});
