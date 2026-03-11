window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.topnavbar') // Select the nav element
  if (window.scrollY > 0) { // Check if scrolled more than 0 pixels
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});