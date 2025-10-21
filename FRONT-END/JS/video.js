// -----------------------------
// LISTA DE VÍDEOS (YouTube)
// -----------------------------
const videos = [
  {
    title: "Respiração Consciente e Relaxamento",
    category: "Respiração",
    url: "https://www.youtube.com/embed/ZWYheuFOq_g",
    thumb: "https://img.youtube.com/vi/ZWYheuFOq_g/hqdefault.jpg"
  },
  {
    title: "Técnica de Respiração para Ansiedade",
    category: "Respiração",
    url: "https://www.youtube.com/embed/0ZMi5MCJFs0",
    thumb: "https://img.youtube.com/vi/0ZMi5MCJFs0/hqdefault.jpg"
  },
  {
    title: "Respiração 4-7-8 para Relaxar",
    category: "Respiração",
    url: "https://www.youtube.com/embed/5VYPRXAi6SE",
    thumb: "https://img.youtube.com/vi/5VYPRXAi6SE/hqdefault.jpg"
  },
  {
    title: "Reflexão: O Poder do Agora",
    category: "Reflexão",
    url: "https://www.youtube.com/embed/45u2eqABBRk",
    thumb: "https://img.youtube.com/vi/45u2eqABBRk/hqdefault.jpg"
  },
  {
    title: "Mensagem de Reflexão Curta 🌿",
    category: "Reflexão",
    url: "https://www.youtube.com/embed/mPepsJkhIPs",
    thumb: "https://img.youtube.com/vi/mPepsJkhIPs/hqdefault.jpg"
  },
  {
    title: "Reflexão Guiada para o Dia",
    category: "Reflexão",
    url: "https://www.youtube.com/embed/x-UGt6cXtrU",
    thumb: "https://img.youtube.com/vi/x-UGt6cXtrU/hqdefault.jpg"
  },
  {
    title: "Aula Completa de Yoga - Relaxamento Total",
    category: "Yoga",
    url: "https://www.youtube.com/embed/9GMLb1jkLhk",
    thumb: "https://img.youtube.com/vi/9GMLb1jkLhk/hqdefault.jpg"
  },
  {
    title: "Yoga Matinal para Iniciantes",
    category: "Yoga",
    url: "https://www.youtube.com/embed/_15hbvSetZA",
    thumb: "https://img.youtube.com/vi/_15hbvSetZA/hqdefault.jpg"
  },
  {
    title: "Alongamento e Yoga Restaurativa",
    category: "Yoga",
    url: "https://www.youtube.com/embed/2gPEiwizeg8",
    thumb: "https://img.youtube.com/vi/2gPEiwizeg8/hqdefault.jpg"
  },
  {
    title: "Música Relaxante para Meditação",
    category: "Musicas",
    url: "https://www.youtube.com/embed/C2goOWyQ4pg",
    thumb: "https://img.youtube.com/vi/C2goOWyQ4pg/hqdefault.jpg"
  },
  {
    title: "Som Ambiente para Yoga e Foco",
    category: "Musicas",
    url: "https://www.youtube.com/embed/XTBtwgHq9fw",
    thumb: "https://img.youtube.com/vi/XTBtwgHq9fw/hqdefault.jpg"
  },
  {
    title: "Trilha Sonora de Meditação e Paz",
    category: "Musicas",
    url: "https://www.youtube.com/embed/D0KMxRMfwxE",
    thumb: "https://img.youtube.com/vi/D0KMxRMfwxE/hqdefault.jpg"
  }
];
// -----------------------------
// ELEMENTOS DO DOM
// -----------------------------
const videoGrid = document.getElementById("videoGrid");
const categoryButtons = document.querySelectorAll(".category-btn");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

// Modal
const videoModal = document.getElementById("videoModal");
const videoFrame = document.getElementById("videoFrame");
const closeModal = document.getElementById("closeModal");
const prevVideo = document.getElementById("prevVideo");
const nextVideo = document.getElementById("nextVideo");

let currentVideos = [...videos];
let currentIndex = 0;

// -----------------------------
// FUNÇÕES PRINCIPAIS
// -----------------------------

document.getElementById("Trocar").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

function renderVideos(list) {
  videoGrid.innerHTML = "";

  if (list.length === 0) {
    videoGrid.innerHTML = "<p style='text-align:center;'>Nenhum vídeo encontrado.</p>";
    return;
  }

  list.forEach((video, index) => {
    const card = document.createElement("div");
    card.classList.add("video-card");
    card.innerHTML = `
      <img src="${video.thumb}" alt="${video.title}">
      <div class="video-info"><h3>${video.title}</h3></div>
    `;
    card.addEventListener("click", () => openModal(index));
    videoGrid.appendChild(card);
  });
}

function openModal(index) {
  currentIndex = index;
  videoFrame.src = currentVideos[currentIndex].url + "?autoplay=1";
  videoModal.style.display = "flex";
}

function closeModalFunc() {
  videoModal.style.display = "none";
  videoFrame.src = "";
}

function showNextVideo() {
  currentIndex = (currentIndex + 1) % currentVideos.length;
  openModal(currentIndex);
}

function showPrevVideo() {
  currentIndex = (currentIndex - 1 + currentVideos.length) % currentVideos.length;
  openModal(currentIndex);
}

// -----------------------------
// FILTRO POR CATEGORIA
// -----------------------------
categoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const category = btn.dataset.category;
    if (category === "all") {
      currentVideos = [...videos];
    } else {
      currentVideos = videos.filter((v) => v.category === category);
    }
    renderVideos(currentVideos);
  });
});

// -----------------------------
// PESQUISA
// -----------------------------
function handleSearch() {
  const query = searchInput.value.toLowerCase();
  const filtered = videos.filter((v) =>
    v.title.toLowerCase().includes(query)
  );
  currentVideos = filtered;
  renderVideos(filtered);
}

searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") handleSearch();
});

// -----------------------------
// CONTROLES DO MODAL
// -----------------------------
closeModal.addEventListener("click", closeModalFunc);
nextVideo.addEventListener("click", showNextVideo);
prevVideo.addEventListener("click", showPrevVideo);

// Fechar clicando fora
window.addEventListener("click", (e) => {
  if (e.target === videoModal) closeModalFunc();
});

// -----------------------------
// INICIALIZAÇÃO
// -----------------------------
renderVideos(videos);