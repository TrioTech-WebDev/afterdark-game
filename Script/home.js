// Ensure DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');

  toggleButton.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
});