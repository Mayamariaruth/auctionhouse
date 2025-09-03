const toggleBtn = document.getElementById("mobile-menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const menuIcon = document.getElementById("menu-icon");

toggleBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("d-none");
  menuIcon.classList.toggle("fa-bars");
  menuIcon.classList.toggle("fa-xmark");
});
