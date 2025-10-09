// ../JS/login.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (!form) {
    console.error('Formulário não encontrado na página.');
    return;
  }

  const emailInput = form.querySelector('input[type="email"]');
  const passwordInput = form.querySelector('input[type="password"]');

  if (!emailInput || !passwordInput) {
    console.error('Inputs tipo email/password não encontrados. Verifique o HTML.');
    return;
  }

  // cria elemento de mensagem se não existir
  let messageEl = document.getElementById('loginMessage');
  if (!messageEl) {
    messageEl = document.createElement('p');
    messageEl.id = 'loginMessage';
    messageEl.setAttribute('aria-live', 'polite');
    // insere depois do botão (se existir) ou no fim do form
    const btn = form.querySelector('button, input[type="submit"]');
    if (btn && btn.parentNode) btn.parentNode.insertBefore(messageEl, btn.nextSibling);
    else form.appendChild(messageEl);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleLogin(emailInput.value.trim(), passwordInput.value.trim(), messageEl);
  });
});

function handleLogin(email, password, messageEl) {
  if (!email || !password) {
    showMessage(messageEl, 'Preencha todos os campos!', 'red');
    return;
  }
  if (!validateEmail(email)) {
    showMessage(messageEl, 'Email inválido!', 'red');
    return;
  }

  const found = findUserByEmail(email);
  if (!found) {
    showMessage(messageEl, 'Usuário não encontrado!', 'red');
    return;
  }

  const user = found.obj;
  const storedPassword = user.senha || user.password || user.pass;

  if (!storedPassword) {
    console.warn('Objeto de usuário não tem campo de senha:', found);
    showMessage(messageEl, 'Erro nos dados do usuário (senha não encontrada).', 'red');
    return;
  }

  if (storedPassword !== password) {
    showMessage(messageEl, 'Senha incorreta!', 'red');
    return;
  }

  // login bem-sucedido
  showMessage(messageEl, 'Login realizado com sucesso! Redirecionando...', 'green');

  try {
    localStorage.setItem('currentUser', JSON.stringify({ email: user.email || email, key: found.key }));
  } catch (err) {
    console.warn('Não foi possível salvar currentUser no localStorage:', err);
  }

  setTimeout(() => window.location.replace('./home.html'), 700);
}

function showMessage(el, text, color) {
  el.style.color = color || 'black';
  el.textContent = text;
}

function findUserByEmail(email) {
  const emailLower = email.toLowerCase();

  // tenta chaves óbvias
  const tryKeys = ['user_' + emailLower, email];
  for (const key of tryKeys) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    try {
      const obj = JSON.parse(raw);
      if (obj && typeof obj === 'object') {
        // se o objeto tem email, checa igualdade
        if (obj.email && obj.email.toLowerCase() === emailLower) return { key, obj };
        // se veio do cadastro antigo que salvou só { email, senha }, também pega
        return { key, obj };
      }
    } catch (err) {
      // raw não é JSON — ignora
    }
  }

  // varre todo localStorage procurando objeto com campo email igual
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const raw = localStorage.getItem(key);
    try {
      const obj = JSON.parse(raw);
      if (obj && typeof obj === 'object' && obj.email && obj.email.toLowerCase() === emailLower) {
        return { key, obj };
      }
    } catch (err) {
      // ignora entradas não JSON
    }
  }

  return null;
}

function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}
