document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('homeCarousel');
  if (!root) return;

  const track = root.querySelector('.carousel-container');
  const slides = Array.from(root.querySelectorAll('.carousel-slide'));
  const prevBtn = root.querySelector('.carousel-btn.prev');
  const nextBtn = root.querySelector('.carousel-btn.next');
  const dotsWrap = root.querySelector('.carousel-dots');

  if (slides.length === 0) return;

  // Cria dots
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i, true));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.querySelectorAll('span'));

  let index = 0;
  let timer = null;
  const INTERVAL = 3000;

  function updateUI() {
    track.style.transform = `translateX(${-index * 100}%)`;
    dots.forEach(d => d.classList.remove('active'));
    dots[index].classList.add('active');
  }

  function goTo(i, reset) {
    index = (i + slides.length) % slides.length;
    updateUI();
    if (reset) resetAutoplay();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(next, INTERVAL);
  }
  function stopAutoplay() {
    if (timer) clearInterval(timer);
    timer = null;
  }
  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  nextBtn.addEventListener('click', () => goTo(index + 1, true));
  prevBtn.addEventListener('click', () => goTo(index - 1, true));

  // Pausa no hover
  root.addEventListener('mouseenter', stopAutoplay);
  root.addEventListener('mouseleave', startAutoplay);

  // Inicializa
  updateUI();
  startAutoplay();
});