document.addEventListener("DOMContentLoaded", () => {
  // -------------------------
  // Elementos do chat
  // -------------------------
  const chatContainer = document.getElementById('chatContainer');
  const messageInput = document.getElementById('messageInput');
  const sendButton = document.getElementById('sendButton');

  // Função para criar mensagem
  function appendMessage(side, text) {
    const msg = document.createElement('div');
    msg.className = message `${side}`;

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.setAttribute('aria-hidden', 'true');

    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;

    msg.appendChild(avatar);
    msg.appendChild(bubble);
    chatContainer.appendChild(msg);

    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // Função para enviar mensagem
  function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    appendMessage('right', text); // Adiciona no chat
    messageInput.value = '';
    messageInput.focus();

    // Aqui você pode adicionar fetch para enviar a mensagem para o backend se quiser
    // fetch(`http://192.168.1.14:3000/mensagens`, {...})
  }

  sendButton.addEventListener('click', sendMessage);
  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  });

  // -------------------------
  // Elementos das notas
  // -------------------------
  const notesModal = document.getElementById("notesModal");
  const openNotesBtn = document.getElementById("openNotesBtn");
  const closeModal = document.getElementById("closeModal");
  const notesContainer = document.getElementById("notesContainer");
  const addNoteBtn = document.getElementById("addNoteBtn");

  const usuario_id = localStorage.getItem("usuario_id") || "1";

  // Abrir modal
  openNotesBtn.addEventListener("click", () => {
    notesModal.style.display = "block";
    loadNotes();
  });

  // Fechar modal
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
      fetch(`http://192.168.1.14:3000/Notas/${nota.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conteudo: textarea.value }),
      })
      .catch(err => console.error("Erro ao atualizar nota:", err));
    }, 500);

    textarea.addEventListener("input", sendUpdate);

    const actions = document.createElement("div");
    actions.classList.add("actions");

    const editBtn = document.createElement("button");
    editBtn.className = "action-btn";
    editBtn.title = "Editar nota";
    editBtn.textContent = "✏️";
    editBtn.addEventListener("click", () => textarea.focus());

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "action-btn";
    deleteBtn.title = "Excluir nota";
    deleteBtn.textContent = "🗑️";
    deleteBtn.addEventListener("click", () => {
      fetch(`http://192.168.1.14:3000/Notas/${nota.id}`, { method: "DELETE" })
        .then(res => {
          if (!res.ok) throw new Error("Erro ao excluir nota");
          note.remove();
        })
        .catch(err => console.error(err));
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    note.appendChild(textarea);
    note.appendChild(actions);
    notesContainer.appendChild(note);
  }

  addNoteBtn.addEventListener("click", () => {
    fetch(`http://192.168.1.14:3000/Notas`, {
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
    fetch(`http://192.168.1.14:3000/Notas/${usuario_id}`, { method: "GET" })
      .then(res => res.json())
      .then(notas => notas.forEach(nota => createNote(nota)))
      .catch(err => console.error(err));
  }
});