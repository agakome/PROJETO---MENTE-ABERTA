// Alternar entre abas
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

loginTab.addEventListener("click", () => {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
});

registerTab.addEventListener("click", () => {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
});

// Função de cadastro
function register() {
    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const message = document.getElementById("registerMessage");

    if (!name || !email || !password) {
        message.textContent = "Preencha todos os campos!";
        return;
    }
    if (!validateEmail(email)) {
        message.textContent = "Email inválido!";
        return;
    }
    if (password.length < 6) {
        message.textContent = "Senha deve ter no mínimo 6 caracteres!";
        return;
    }

    // Simulando cadastro no localStorage
    localStorage.setItem(email, JSON.stringify({ name, password }));
    message.style.color = "green";
    message.textContent = "Cadastro realizado com sucesso!";
    document.getElementById("registerName").value = "";
    document.getElementById("registerEmail").value = "";
    document.getElementById("registerPassword").value = "";
}

// Função de login
function login() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const message = document.getElementById("loginMessage");

    if (!email || !password) {
        message.textContent = "Preencha todos os campos!";
        return;
    }

    const user = JSON.parse(localStorage.getItem(email));
    if (!user) {
        message.textContent = "Usuário não encontrado!";
        return;
    }
    if (user.password !== password) {
        message.textContent = "Senha incorreta!";
        return;
    }

    message.style.color = "green";
    message.textContent = `Bem-vindo, ${user.name}!`;
}

// Validação simples de email
function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}
