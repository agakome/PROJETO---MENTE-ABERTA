document.addEventListener("DOMContentLoaded", () => {
  // -------------------------
  // Elementos do DOM
  // -------------------------
  const notesModal = document.getElementById("notesModal");
  const openNotesBtn = document.getElementById("openNotesBtn");
  const closeModal = document.getElementById("closeModal");
  const notesContainer = document.getElementById("notesContainer");
  const addNoteBtn = document.getElementById("addNoteBtn");

  const usuario_id = localStorage.getItem("usuario_id") || "1"; // fallback para teste

  // -------------------------
  // Abrir modal
  // -------------------------
  openNotesBtn.addEventListener("click", () => {
    notesModal.style.display = "block";
    loadNotes();
  });

  // -------------------------
  // Fechar modal
  // -------------------------
  closeModal.addEventListener("click", () => {
    notesModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === notesModal) notesModal.style.display = "none";
  });

  // -------------------------
  // Função debounce (evita muitos fetches enquanto digita)
  // -------------------------
  function debounce(func, delay = 500) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // -------------------------
  // Criar nota visual
  // -------------------------
  function createNote(nota) {
    const note = document.createElement("div");
    note.classList.add("note");

    const textarea = document.createElement("textarea");
    textarea.value = nota.conteudo || "";

    // Atualizar nota ao digitar
    const sendUpdate = debounce(() => {
      fetch(`http://192.168.1.14:3000/Notas/${nota.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conteudo: textarea.value }),
      })
      .catch(err => console.error("Erro ao atualizar nota:", err));
    }, 500);

    textarea.addEventListener("input", sendUpdate);

    // -------------------------
    // Ações da nota
    // -------------------------
    const actions = document.createElement("div");
    actions.classList.add("actions");

    // Botão editar (visual, foca no textarea)
    const editBtn = document.createElement("button");
    editBtn.className = "action-btn";
    editBtn.title = "Editar nota";
    editBtn.textContent = "✏️";
    editBtn.addEventListener("click", () => textarea.focus());

    // Botão deletar
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

  // -------------------------
  // Adicionar nova nota
  // -------------------------
  addNoteBtn.addEventListener("click", () => {
    fetch(`http://192.168.1.14:3000/Notas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario_id, conteudo: "" }),
    })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao criar nota");
      return res.json();
    })
    .then(novaNota => {
      createNote(novaNota); // novaNota contém {id, conteudo} retornado pelo backend
    })
    .catch(err => console.error(err));
  });

  // -------------------------
  // Carregar notas do servidor
  // -------------------------
  function loadNotes() {
    notesContainer.innerHTML = ""; // limpa antes de carregar

    fetch(`http://192.168.1.14:3000/Notas/${usuario_id}`, { method: "GET" })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao carregar notas");
        return res.json();
      })
      .then(notas => {
        notas.forEach(nota => createNote(nota));
      })
      .catch(err => console.error(err));
  }
});