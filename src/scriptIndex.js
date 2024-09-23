// Verificação do e-mail
const emailInput = document.getElementById('email');
emailInput.addEventListener('input', function () {
    if (!emailInput.value.includes('@')) {
        emailInput.setCustomValidity('Por favor, insira um e-mail válido.');
    } else {
        emailInput.setCustomValidity('');
    }
});

// Verificação da senha
const passwordInput = document.getElementById('password');
passwordInput.addEventListener('input', function () {
    if (passwordInput.value.length < 8) {
        passwordInput.setCustomValidity('A senha deve ter pelo menos 8 caracteres.');
    } else {
        passwordInput.setCustomValidity('');
    }
});


//--------------------------------------------------------------------------------------------
/*const togglePassword = document.getElementById('togglePassword');
passwordInput.addEventListener('input', function () {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.classList.remove('SemOlho');
        togglePassword.classList.add('ComOlho');
    } else {
        passwordInput.type = "password";
        togglePassword.classList.remove('ComOlho');
        togglePassword.classList.add('SemOlho');
    }
});*/

const senha = document.getElementById('password');
const olho = document.querySelector('.olho');

olho.addEventListener('click', () => {
  if (senha.type === 'password') {
    senha.type = 'text';
    olho.style.content = "\f06e"; // Ícone de olho aberto
  } else {
    senha.type = 'password';
    olho.style.content = "\f070"; // Ícone de olho fechado
  }
});
//--------------------------------------------------------------------------------------------












// Alternar modo noturno
const modeToggle = document.getElementById('modeToggle');
const modeIcon = document.getElementById('modeIcon');

function setMode(mode) {
    if (mode === 'dark') {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        modeIcon.src = '/src/img/iconLua.png';
    } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        modeIcon.src = '/src/img/iconLua.png';
    }
}

modeToggle.addEventListener('click', function () {
    const currentMode = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newMode = currentMode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    localStorage.setItem('mode', newMode);
});

// Lembrar modo preferido
const savedMode = localStorage.getItem('mode') || 'light';
setMode(savedMode);