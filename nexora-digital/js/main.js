"use strict";

// Navbar: fondo contextual y menú accesible en pantallas pequeñas.
const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-navigation]");

const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 18);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const closeMenu = () => {
  navigation?.classList.remove("is-open");
  menuButton?.classList.remove("is-open");
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "Abrir menú");
};

menuButton?.addEventListener("click", () => {
  const open = navigation?.classList.toggle("is-open");
  menuButton.classList.toggle("is-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
});

navigation?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

// Las animaciones solo se reproducen cuando el navegador las puede mostrar sin afectar al usuario.
const revealElements = document.querySelectorAll(".reveal");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        instance.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => observer.observe(element));
}

// Validación de interfaz. Para recibir formularios en producción, conecta este form a un endpoint o proveedor.
const form = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const requiredFields = [...form.querySelectorAll("[required]")];
  const invalidField = requiredFields.find((field) => !field.value.trim() || !field.checkValidity());

  requiredFields.forEach((field) => field.setAttribute("aria-invalid", String(field === invalidField)));

  if (invalidField) {
    formStatus.textContent = "Completa los campos obligatorios para solicitar tu consulta.";
    formStatus.classList.add("is-error");
    invalidField.focus();
    return;
  }

  formStatus.textContent = "Gracias. Tu consulta está lista para ser enviada a Nexora Digital.";
  formStatus.classList.remove("is-error");
  form.reset();
});
