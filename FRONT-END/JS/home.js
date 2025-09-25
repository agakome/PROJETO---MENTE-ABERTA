// -------------------------
// Chat (seu código original)
// -------------------------
const chatContainer = document.getElementById('chatContainer');
const messageInput  = document.getElementById('messageInput');
const sendButton    = document.getElementById('sendButton');

function appendMessage(side, text) {
  const msg = document.createElement('div');
  msg.className = `message ${side}`;

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

function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;
  appendMessage('right', text);
  messageInput.value = '';
  messageInput.focus();
}

sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});

// -------------------------
// Bloco de Notas (Modal)
// -------------------------
const notesModal = document.getElementById("notesModal");
const openNotesBtn = document.getElementById("openNotesBtn");
const closeModal = document.getElementById("closeModal");
const notesContainer = document.getElementById("notesContainer");
const addNoteBtn = document.getElementById("addNoteBtn");

// Abrir modal
openNotesBtn.addEventListener("click", () => {
  notesModal.style.display = "block";
  loadNotes();
});

// Fechar modal
closeModal.addEventListener("click", () => {
  notesModal.style.display = "none";
});

// Fechar clicando fora
window.addEventListener("click", (event) => {
  if (event.target === notesModal) {
    notesModal.style.display = "none";
  }
});

// Cria uma nota com textarea + botões (lápis e lixeira)
function createNote(text = "") {
  const note = document.createElement("div");
  note.classList.add("note");

  // Texto da nota
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.addEventListener("input", saveNotes);

  // Barra de ações
  const actions = document.createElement("div");
  actions.classList.add("actions");

  // Botão lápis
  const editBtn = document.createElement("button");
  editBtn.className = "action-btn";
  editBtn.title = "Editar";
  editBtn.textContent = "✏️";
  editBtn.addEventListener("click", () => {
    textarea.focus();
    // move o cursor para o fim
    const v = textarea.value;
    textarea.value = "";
    textarea.value = v;
  });

  // Botão lixeira
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "action-btn";
  deleteBtn.title = "Excluir";
  deleteBtn.textContent = "🗑️";
  deleteBtn.addEventListener("click", () => {
    note.remove();
    saveNotes();
  });

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  note.appendChild(textarea);
  note.appendChild(actions);

  notesContainer.appendChild(note);
}

// Adicionar nova nota
addNoteBtn.addEventListener("click", () => {
  createNote("");
  saveNotes();
});

// Salvar notas no localStorage
function saveNotes() {
  const notes = Array.from(document.querySelectorAll(".note textarea")).map(
    note => note.value
  );
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Carregar notas
function loadNotes() {
  notesContainer.innerHTML = "";
  const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
  savedNotes.forEach(text => createNote(text));
}

// -------------------------
// Emojis de Humor
// -------------------------
const emojis = document.querySelectorAll(".emoji");
const moodMessage = document.getElementById("moodMessage");

const mensagens = {
  feliz: "Que bom que você está feliz! Continue espalhando essa energia positiva 🌟",
  triste: "Tudo bem não estar bem às vezes. Respire fundo, você não está sozinho 💙",
  ansioso: "Tente se acalmar, um passo de cada vez. Você é mais forte do que pensa 🌿",
  raiva: "É normal sentir raiva. Experimente relaxar e liberar essa energia 💭",
  amor: "Que lindo! O amor transforma os dias ✨"
};

emojis.forEach(emoji => {
  emoji.addEventListener("click", () => {
    // Remove o destaque de todos
    emojis.forEach(e => e.classList.remove("active"));
    // Ativa o clicado
    emoji.classList.add("active");
    // Mostra mensagem
    const mood = emoji.getAttribute("data-mood");
    moodMessage.textContent = mensagens[mood] || "";
  });
});
