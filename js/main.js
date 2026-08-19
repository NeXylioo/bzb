/* ==========================================================================
   BLV WASH — Scripts principaux (édition premium)
   ========================================================================== */
(function () {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----- Header : fond au scroll ----- */
  const header = document.getElementById("header");

  /* ----- Barre de progression de lecture ----- */
  const progressBar = document.getElementById("progress-bar");

  /* ----- Parallaxe photo du hero ----- */
  const heroImg = document.getElementById("hero-img");

  /* ----- Galerie horizontale pilotée par la molette ----- */
  const hscroll = document.getElementById("galerie-hscroll");
  const hscrollTrack = document.getElementById("galerie-track");

  /* ----- Filigrane qui glisse sur le côté ----- */
  const watermark = document.querySelector("[data-parallax-x]");

  /* ----- Bouton retour en haut ----- */
  const backtop = document.getElementById("backtop");

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;

      header.classList.toggle("is-scrolled", y > 10);
      backtop.classList.toggle("is-visible", y > 600);

      const max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";

      if (!reducedMotion) {
        if (heroImg) heroImg.style.transform = "translateY(" + y * 0.25 + "px)";
        if (hscroll && hscrollTrack && window.innerWidth > 768) {
          const total = hscroll.offsetHeight - window.innerHeight;
          const progress = Math.min(Math.max((y - hscroll.offsetTop) / total, 0), 1);
          const shift = Math.max(hscrollTrack.scrollWidth - window.innerWidth, 0);
          hscrollTrack.style.transform = "translateX(" + -progress * shift + "px)";
        }
        if (watermark) {
          watermark.style.transform = "translateX(" + (140 - y * 0.18) + "px)";
        }
      }

      ticking = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ----- Menu mobile ----- */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");

  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      burger.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  /* ----- Lien actif selon la section visible ----- */
  const navLinks = Array.from(nav.querySelectorAll(".nav__link"));
  const sections = navLinks
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((l) =>
          l.classList.toggle("is-active", l.getAttribute("href") === "#" + entry.target.id)
        );
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  /* ----- Animations d'apparition (fondu, glissé, rotation latérale) ----- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document
    .querySelectorAll(".reveal, .reveal-left, .reveal-right")
    .forEach((el) => revealObserver.observe(el));

  /* ----- Curseurs avant / après ----- */
  document.querySelectorAll("[data-ba]").forEach((figure) => {
    const frame = figure.querySelector(".ba__frame");
    const range = figure.querySelector(".ba__range");
    range.addEventListener("input", () => {
      frame.style.setProperty("--pos", range.value + "%");
    });
  });

  /* ----- Formulaire de contact ----- */
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      status.textContent = "Merci de compléter les champs obligatoires (*).";
      status.className = "form__status is-err";
      return;
    }

    const data = new FormData(form);
    const lignes = [
      "Nouvelle demande de contact — BLV WASH",
      "",
      "Nom : " + data.get("name"),
      "Téléphone : " + data.get("phone"),
      "Email : " + (data.get("email") || "non renseigné"),
      "Prestation : " + data.get("service"),
      "",
      "Message :",
      data.get("message"),
    ];

    // Ouvre le client mail avec la demande pré-remplie.
    // Pour un envoi sans client mail, branchez ici un service comme
    // Formspree, Web3Forms ou votre propre backend.
    const mailto =
      "mailto:contact@blvwash.fr" +
      "?subject=" + encodeURIComponent("Demande de prix — " + data.get("service")) +
      "&body=" + encodeURIComponent(lignes.join("\n"));

    window.location.href = mailto;

    status.textContent = "Votre messagerie va s'ouvrir avec votre demande pré-remplie. À très vite !";
    status.className = "form__status is-ok";
    form.reset();
  });
})();
