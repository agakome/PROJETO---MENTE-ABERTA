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

// ------ AQUI ESTÁ A IMPLEMENTAÇÃO DO LÁPIS E LIXEIRA ------

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

  // Botão lápis (editar = focar no textarea)
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

  // Botão lixeira (apagar a nota)
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

// Salvar notas no localStorage (somente os textos)
function saveNotes() {
  const notes = Array.from(document.querySelectorAll(".note textarea")).map(
    note => note.value
  );
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Carregar notas ao abrir modal
function loadNotes() {
  notesContainer.innerHTML = "";
  const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
  savedNotes.forEach(text => createNote(text));
}