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

  /* ----- Titres : chaque titre monte depuis derrière un cache ----- */
  // Fait en JS pour garder le HTML lisible : on enveloppe le contenu du titre
  // dans un <span> que le cache (overflow:hidden) laisse coulisser.
  document.querySelectorAll(".section__head h2, .hero h1, .cta h2").forEach((h) => {
    const inner = document.createElement("span");
    inner.innerHTML = h.innerHTML;
    h.replaceChildren(inner);
    // Le fondu-flou du .reveal se ferait couper net par le cache : le
    // coulissement suffit, on retire l'apparition générique du titre.
    h.classList.remove("reveal", "reveal-left", "reveal-right");
    h.classList.add("mask");
    // Le titre suit son bloc parent d'un souffle.
    inner.style.transitionDelay = "0.08s";
  });

  /* ----- Apparitions au scroll ----- */
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
    .querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale, .mask")
    .forEach((el) => revealObserver.observe(el));



  /* ----- Défilement fluide à la molette -----
     On interpole window.scrollY plutôt que de transformer un conteneur :
     un transform sur un parent casserait tous les position:fixed de la page
     (header, bouton retour, overlay de la galerie). */
  if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
    let target = window.scrollY;
    let gliding = false;

    const limit = () =>
      Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);

    const glide = () => {
      const diff = target - window.scrollY;
      if (Math.abs(diff) < 0.4) {
        window.scrollTo(0, target);
        gliding = false;
        return;
      }
      window.scrollTo(0, window.scrollY + diff * 0.12);
      requestAnimationFrame(glide);
    };

    window.addEventListener("wheel", (e) => {
      // On laisse passer le zoom navigateur et le scroll interne d'un champ.
      if (e.ctrlKey || e.defaultPrevented) return;
      e.preventDefault();
      target = Math.min(Math.max(target + e.deltaY, 0), limit());
      if (!gliding) { gliding = true; requestAnimationFrame(glide); }
    }, { passive: false });

    // Clavier, barre de défilement, ancres : on se recale sur la position réelle.
    window.addEventListener("scroll", () => {
      if (!gliding) target = window.scrollY;
    }, { passive: true });
    window.addEventListener("resize", () => { target = window.scrollY; });
  }

  /* ----- Galerie — carousel 3D cylindrique ----- */
  (function () {
    const viewport = document.getElementById("carousel-viewport");
    const cylinder = document.getElementById("carousel-cylinder");
    const overlay  = document.getElementById("carousel-overlay");
    const closeBtn = document.getElementById("carousel-close");
    const zoomImg  = document.getElementById("carousel-zoom-img");
    if (!viewport || !cylinder) return;

    const faces = Array.from(cylinder.querySelectorAll(".carousel-3d__face"));
    const faceCount = faces.length;

    const setup = () => {
      const w = window.innerWidth;
      const faceW = w <= 640 ? 210 : w <= 1024 ? 270 : 340;
      // Rayon pour que les faces se touchent presque : demi-largeur / tan(π/n).
      const rad = Math.round((faceW * 1.12 / 2) / Math.tan(Math.PI / faceCount));
      cylinder.style.width = faceW + "px";
      faces.forEach((face, i) => {
        face.style.width = faceW + "px";
        // left:50% place le bord gauche au centre — on recentre la face dessus.
        face.style.marginLeft = -faceW / 2 + "px";
        face.style.transform =
          "rotateY(" + (i * 360 / faceCount) + "deg) translateZ(" + rad + "px)";
      });
    };
    setup();
    window.addEventListener("resize", setup);

    const AUTO = 0.11;   // rotation de fond, en degrés par frame
    let rot = 0, vel = AUTO, dragging = false;
    let pxStart = 0, pxLast = 0, active = true;

    const applyRot = () => {
      cylinder.style.transform = "rotateY(" + rot.toFixed(2) + "deg)";
    };
    applyRot();

    // Boucle unique : l'élan du drag retombe progressivement sur la rotation de fond.
    const tick = () => {
      if (active && !dragging) {
        vel += (AUTO - vel) * 0.045;
        rot += vel;
        applyRot();
      }
      requestAnimationFrame(tick);
    };
    if (!reducedMotion) requestAnimationFrame(tick);

    const pDown = (x) => { if (!active) return; dragging = true; pxStart = pxLast = x; vel = 0; };
    const pMove = (x) => {
      if (!dragging || !active) return;
      const dx = x - pxLast;
      vel = dx * 0.16;
      rot += vel;
      applyRot();
      pxLast = x;
    };
    const pUp = () => { dragging = false; };

    // Coupe le drag natif d'image, qui sinon capture mousemove/mouseup.
    viewport.addEventListener("dragstart", (e) => e.preventDefault());
    viewport.addEventListener("mousedown",  (e) => { e.preventDefault(); pDown(e.clientX); });
    window.addEventListener ("mousemove",   (e) => pMove(e.clientX));
    window.addEventListener ("mouseup",     pUp);
    viewport.addEventListener("touchstart", (e) => pDown(e.touches[0].clientX), { passive: true });
    viewport.addEventListener("touchmove",  (e) => pMove(e.touches[0].clientX), { passive: true });
    viewport.addEventListener("touchend",   pUp);

    faces.forEach((face) => {
      face.addEventListener("click", () => {
        if (Math.abs(pxStart - pxLast) > 6) return;
        const img = face.querySelector("img");
        if (!img) return;
        zoomImg.src = img.src;
        zoomImg.alt = img.alt || "";
        overlay.classList.add("is-open");
        active = false;
      });
    });

    const closeOverlay = () => { overlay.classList.remove("is-open"); active = true; };
    overlay.addEventListener("click", closeOverlay);
    closeBtn.addEventListener("click", (e) => { e.stopPropagation(); closeOverlay(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeOverlay(); });
  })();

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
