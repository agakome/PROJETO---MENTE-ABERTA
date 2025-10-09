// -----------------------------
// LISTA DE VÍDEOS (YouTube)
// -----------------------------
const videos = [
  {
    title: "Introdução ao HTML",
    category: "tutoriais",
    url: "https://www.youtube.com/embed/pQN-pnXPaVg",
    thumb: "https://img.youtube.com/vi/pQN-pnXPaVg/hqdefault.jpg"
  },
  {
    title: "CSS para Iniciantes",
    category: "tutoriais",
    url: "https://www.youtube.com/embed/yfoY53QXEnI",
    thumb: "https://img.youtube.com/vi/yfoY53QXEnI/hqdefault.jpg"
  },
  {
    title: "Top Hits 2025 🎵",
    category: "musica",
    url: "https://www.youtube.com/embed/kJQP7kiw5Fk",
    thumb: "https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg"
  },
  {
    title: "Gameplay - GTA V",
    category: "games",
    url: "https://www.youtube.com/embed/QkkoHAzjnUs",
    thumb: "https://img.youtube.com/vi/QkkoHAzjnUs/hqdefault.jpg"
  },
  {
    title: "Stand-up com Humor",
    category: "entretenimento",
    url: "https://www.youtube.com/embed/LXb3EKWsInQ",
    thumb: "https://img.youtube.com/vi/LXb3EKWsInQ/hqdefault.jpg"
  },
  {
    title: "Aula de Matemática Básica",
    category: "educacao",
    url: "https://www.youtube.com/embed/HeQX2HjkcNo",
    thumb: "https://img.youtube.com/vi/HeQX2HjkcNo/hqdefault.jpg"
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