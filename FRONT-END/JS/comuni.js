 // Seletores
    const chatContainer = document.getElementById('chatContainer');
    const messageInput  = document.getElementById('messageInput');
    const sendButton    = document.getElementById('sendButton');

    // Função para criar e adicionar uma mensagem ao chat
    function appendMessage(side, text) {
      const msg = document.createElement('div');
      msg.className = `message ${side}`;

      const avatar = document.createElement('div');
      avatar.className = 'avatar';
      avatar.setAttribute('aria-hidden', 'true');

      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.textContent = text; // textContent evita HTML injetado

      msg.appendChild(avatar);
      msg.appendChild(bubble);
      chatContainer.appendChild(msg);

      // Auto-scroll para a última mensagem
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Envia a mensagem do input como "right"
    function sendMessage() {
      const text = messageInput.value.trim();
      if (!text) return;             // impede envio vazio
      appendMessage('right', text);
      messageInput.value = '';
      messageInput.focus();
    }

    // Clique no botão
    sendButton.addEventListener('click', sendMessage);

    // Pressionar Enter no input
    messageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // evita quebra de linha
        sendMessage();
      }
    });