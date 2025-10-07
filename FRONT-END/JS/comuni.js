document.addEventListener("DOMContentLoaded", () => {
  // -------------------------
  // ELEMENTOS DO CHAT
  // -------------------------
  const chatContainer = document.getElementById('chatContainer');
  const messageInput = document.getElementById('messageInput');
  const sendButton = document.getElementById('sendButton');
  const usuario_id = localStorage.getItem("usuario_id") || "1";

  let lastMessages = [];

  // Função para criar mensagem no chat
  function appendMessage(text, userName = "Você") {
    const msg = document.createElement('div');
    msg.className = `message`;

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.setAttribute('aria-hidden', 'true');

    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;

    const info = document.createElement('div');
    info.className = 'message-info';
    info.textContent = userName;

    msg.appendChild(avatar);
    msg.appendChild(bubble);
    msg.appendChild(info);
    chatContainer.appendChild(msg);

    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // Função para enviar mensagem
  async function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    messageInput.value = '';
    messageInput.focus();

    try {
      await fetch("http://localhost:3000/Comunidade/Mensagem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id, mensagem: text }),
      });
      // Não adiciona localmente para evitar duplicação
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
    }
  }

  sendButton.addEventListener('click', sendMessage);
  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  });

  // -------------------------
  // BUSCAR MENSAGENS
  // -------------------------
  async function loadMessages() {
    try {
      const res = await fetch("http://localhost:3000/Comunidade/Mensagem");
      const mensagens = await res.json();

      mensagens.forEach(msg => {
        const exists = lastMessages.find(m => m.id === msg.id);
        if (!exists) {
          const name = msg.usuario_id == usuario_id ? "Você" : `Usuário ${msg.usuario_id}`;
          appendMessage(msg.mensagem, name);
          lastMessages.push(msg);
        }
      });
    } catch (err) {
      console.error("Erro ao buscar mensagens:", err);
    }
  }

  setInterval(loadMessages, 2000);
  loadMessages();

  // -------------------------
  // BLOCO DE NOTAS
  // -------------------------
  const notesModal = document.getElementById("notesModal");
  const openNotesBtn = document.getElementById("openNotesBtn");
  const closeModal = document.getElementById("closeModal");
  const notesContainer = document.getElementById("notesContainer");
  const addNoteBtn = document.getElementById("addNoteBtn");

  openNotesBtn.addEventListener("click", () => {
    notesModal.style.display = "block";
    loadNotes();
  });

  closeModal.addEventListener("click", () => notesModal.style.display = "none");
  window.addEventListener("click", (event) => {
    if (event.target === notesModal) notesModal.style.display = "none";
  });

  function debounce(func, delay = 500) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  }

  function createNote(nota) {
    const note = document.createElement("div");
    note.classList.add("note");

    const textarea = document.createElement("textarea");
    textarea.value = nota.conteudo || "";

    const sendUpdate = debounce(() => {
      fetch(`http://localhost:3000/Notas/${nota.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conteudo: textarea.value }),
      }).catch(err => console.error("Erro ao atualizar nota:", err));
    }, 500);

    textarea.addEventListener("input", sendUpdate);

    const actions = document.createElement("div");
    actions.classList.add("actions");

    const editBtn = document.createElement("button");
    editBtn.className = "action-btn edit";
    editBtn.title = "Editar nota";
    editBtn.textContent = "✏️";
    editBtn.addEventListener("click", () => textarea.focus());

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "action-btn delete";
    deleteBtn.title = "Excluir nota";
    deleteBtn.textContent = "🗑️";
    deleteBtn.addEventListener("click", () => {
      fetch(`http://localhost:3000/Notas/${nota.id}`, { method: "DELETE" })
        .then(res => {
          if (!res.ok) throw new Error("Erro ao excluir nota");
          note.remove();
        }).catch(err => console.error(err));
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    note.appendChild(textarea);
    note.appendChild(actions);
    notesContainer.appendChild(note);
  }

  addNoteBtn.addEventListener("click", () => {
    fetch(`http://localhost:3000/Notas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario_id, conteudo: "" }),
    })
    .then(res => res.json())
    .then(novaNota => createNote(novaNota))
    .catch(err => console.error(err));
  });

  function loadNotes() {
    notesContainer.innerHTML = "";
    fetch(`http://localhost:3000/Notas/${usuario_id}`, { method: "GET" })
      .then(res => res.json())
      .then(notas => notas.forEach(nota => createNote(nota)))
      .catch(err => console.error(err));
  }
});
