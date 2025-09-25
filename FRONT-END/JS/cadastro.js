// cadastro.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm') || document.querySelector('form');
  if (!form) {
    console.error('Formulário não encontrado. Verifique o ID ou se o HTML foi carregado.');
    return;
  }

  // evita múltiplos handlers, usa apenas submit do form
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('submit captured');
    register();
  });
});

function createMessageElement() {
  let msg = document.getElementById('registerMessage');
  if (!msg) {
    msg = document.createElement('p');
    msg.id = 'registerMessage';
    const form = document.getElementById('registerForm') || document.querySelector('form');
    if (form) form.appendChild(msg);
  }
  return msg;
}

function register() {
  const message = createMessageElement();
  try {
    const emailEl = document.getElementById('email');
    const passwordEl = document.getElementById('senha');
    const confirmEl = document.getElementById('novasenha');

    if (!emailEl || !passwordEl || !confirmEl) {
      message.style.color = 'red';
      message.textContent = 'Erro: campos não encontrados (ids esperados: email, senha, novasenha).';
      console.error('IDs faltando no HTML:', { emailEl, passwordEl, confirmEl });
      return;
    }

    const email = emailEl.value.trim();
    const password = passwordEl.value.trim();
    const confirmPassword = confirmEl.value.trim();

    // validações
    if (!email || !password || !confirmPassword) {
      message.style.color = 'red';
      message.textContent = 'Preencha todos os campos!';
      return;
    }
    if (!validateEmail(email)) {
      message.style.color = 'red';
      message.textContent = 'Email inválido!';
      return;
    }
    if (password.length < 6) {
      message.style.color = 'red';
      message.textContent = 'Senha deve ter no mínimo 6 caracteres!';
      return;
    }
    if (password !== confirmPassword) {
      message.style.color = 'red';
      message.textContent = 'As senhas não coincidem!';
      return;
    }

    message.style.color = 'black';
    message.textContent = 'Processando...';
    console.log('Dados validados. Salvando em localStorage e tentando enviar ao servidor.');

    // salva localmente (chave segura)
    const storageKey = 'user_' + email.toLowerCase();
    localStorage.setItem(storageKey, JSON.stringify({ email, senha: password }));

    // tenta enviar ao servidor (pode falhar por CORS / servidor offline)
    fetch("http://192.168.1.14:3000/Cadastrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, senha: password }),
    })
      .then(response => {
        if (!response.ok) throw new Error('Resposta do servidor: ' + response.status);
        return response.json().catch(()=> null); // aceita caso não retorne JSON
      })
      .then(() => {
        console.log('Servidor respondeu OK');
        message.style.color = 'green';
        message.textContent = 'Cadastro realizado com sucesso! Redirecionando...';
        // limpa
        emailEl.value = '';
        passwordEl.value = '';
        confirmEl.value = '';
        setTimeout(() => window.location.replace('./login.html'), 700);
      })
      .catch(err => {
        console.error('Erro no fetch:', err);
        // não perde o cadastro local — mostra aviso sobre comunicação com o servidor
        message.style.color = 'orange';
        message.textContent = 'Cadastro salvo localmente, mas não foi possível conectar ao servidor: ' + err.message;
      });

  } catch (err) {
    console.error('Erro inesperado:', err);
    message.style.color = 'red';
    message.textContent = 'Erro inesperado: ' + err.message;
  }
}

// validação simples de email
function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}
