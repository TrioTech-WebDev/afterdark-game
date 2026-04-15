document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu toggle
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuClose = document.getElementById('menuClose');

  hamburger.addEventListener('click', () => {
    mobileMenu.style.display = 'block';
  });

  menuClose.addEventListener('click', () => {
    mobileMenu.style.display = 'none';
  });

  // Close mobile menu on link click
  const menuLinks = document.querySelectorAll('.menu-link');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.style.display = 'none';
    });
  });
});