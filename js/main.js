/* ==========================================================================
   BLV WASH — Scripts principaux
   ========================================================================== */
(function () {
  "use strict";

  /* ----- Header : fond au scroll ----- */
  const header = document.getElementById("header");
  const onScrollHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  };
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

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

  /* ----- Animations d'apparition ----- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ----- Compteurs animés ----- */
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll("[data-count]").forEach((el) => countObserver.observe(el));

  /* ----- Onglets tarifs ----- */
  const tabAuto = document.getElementById("tab-auto");
  const tabExt = document.getElementById("tab-ext");
  const panelAuto = document.getElementById("panel-auto");
  const panelExt = document.getElementById("panel-ext");

  const switchTab = (activeTab, activePanel, otherTab, otherPanel) => {
    activeTab.classList.add("is-active");
    otherTab.classList.remove("is-active");
    activeTab.setAttribute("aria-selected", "true");
    otherTab.setAttribute("aria-selected", "false");
    activePanel.classList.remove("is-hidden");
    activePanel.hidden = false;
    otherPanel.classList.add("is-hidden");
    otherPanel.hidden = true;
    activePanel.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  };

  tabAuto.addEventListener("click", () => switchTab(tabAuto, panelAuto, tabExt, panelExt));
  tabExt.addEventListener("click", () => switchTab(tabExt, panelExt, tabAuto, panelAuto));

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
      "Nouvelle demande de devis — BLV WASH",
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
      "?subject=" + encodeURIComponent("Demande de devis — " + data.get("service")) +
      "&body=" + encodeURIComponent(lignes.join("\n"));

    window.location.href = mailto;

    status.textContent = "Votre messagerie va s'ouvrir avec votre demande pré-remplie. À très vite !";
    status.className = "form__status is-ok";
    form.reset();
  });

  /* ----- Bouton retour en haut ----- */
  const backtop = document.getElementById("backtop");
  const onScrollTop = () => {
    backtop.classList.toggle("is-visible", window.scrollY > 600);
  };
  window.addEventListener("scroll", onScrollTop, { passive: true });
  onScrollTop();

  /* ----- Année du footer ----- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
