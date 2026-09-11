/* ==========================================================================
   BLV WASH — Script commun aux trois pages.
   Tout est optionnel : chaque bloc sort si son élément n'existe pas sur la
   page courante (l'accueil n'a ni nav, ni formulaire, ni carrousel).
   ========================================================================== */
(function () {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $  = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  /* ----------------------------------------------------------------------
     Défilement : en-tête, barre de progression, parallaxe du hero
     ---------------------------------------------------------------------- */
  const header      = $("#header");
  const progressBar = $("#progress-bar");
  const heroImg     = $("#hero-img");
  const backtop     = $("#backtop");

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;

      // L'accueil garde son fond en permanence : on ne le lui retire pas.
      if (header && !header.classList.contains("is-splash-fixed")) {
        header.classList.toggle("is-scrolled", y > 10);
      }
      if (backtop) backtop.classList.toggle("is-visible", y > 700);

      if (progressBar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
      }

      if (heroImg && !reducedMotion) {
        heroImg.style.transform = "translateY(" + y * 0.22 + "px)";
      }

      ticking = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------------------------------------
     Défilement fluide à la molette
     On interpole window.scrollY plutôt que de transformer un conteneur :
     un transform sur un parent casserait tous les position:fixed de la page
     (en-tête, bouton retour en haut).
     ---------------------------------------------------------------------- */
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
    window.addEventListener("scroll", () => { if (!gliding) target = window.scrollY; }, { passive: true });
    window.addEventListener("resize", () => { target = window.scrollY; });
  }

  /* ----------------------------------------------------------------------
     Menu mobile
     ---------------------------------------------------------------------- */
  const burger = $("#burger");
  const nav    = $("#nav");

  if (burger && nav) {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    });
    $$("a", nav).forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ----------------------------------------------------------------------
     Lien actif selon la section visible
     Les liens vers une autre page (auto.html…) n'ont pas d'ancre : on les
     écarte avant d'interroger le DOM.
     ---------------------------------------------------------------------- */
  if (nav) {
    const anchors = $$(".nav__link", nav).filter((l) =>
      (l.getAttribute("href") || "").startsWith("#")
    );
    const sections = anchors
      .map((l) => $(l.getAttribute("href")))
      .filter(Boolean);

    if (sections.length) {
      const spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            anchors.forEach((l) =>
              l.classList.toggle("is-active", l.getAttribute("href") === "#" + entry.target.id)
            );
          });
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      sections.forEach((s) => spy.observe(s));
    }
  }

  /* ----------------------------------------------------------------------
     Titres : chaque titre monte depuis derrière un cache
     Fait en JS pour garder le HTML lisible.
     ---------------------------------------------------------------------- */
  $$(".section__head h2, .hero h1, .cta h2, .statement p").forEach((el) => {
    const inner = document.createElement("span");
    inner.innerHTML = el.innerHTML;
    el.replaceChildren(inner);
    // Le fondu du .reveal se ferait couper net par le cache : le coulissement suffit.
    el.classList.remove("reveal", "reveal-left", "reveal-right");
    el.classList.add("mask");
    inner.style.transitionDelay = "0.08s";
  });

  /* ----------------------------------------------------------------------
     Apparitions au scroll
     ---------------------------------------------------------------------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  $$(".reveal, .reveal-left, .reveal-right, .mask").forEach((el) => revealObserver.observe(el));

  /* ----------------------------------------------------------------------
     Pistes horizontales (protocole, réalisations)
     Glisser à la souris ou au doigt, avec inertie et barre de position.
     ---------------------------------------------------------------------- */
  $$("[data-drag]").forEach((root) => {
    const viewport = $(".drag__viewport", root);
    const track    = $(".drag__track", root);
    const bar      = $(".drag__bar span", root);
    if (!viewport || !track) return;

    let offset = 0, vel = 0, dragging = false;
    let startX = 0, lastX = 0, raf = null;

    const maxOffset = () => Math.max(track.scrollWidth - viewport.clientWidth, 0);

    const paint = () => {
      track.style.transform = "translateX(" + -offset + "px)";
      if (bar) {
        const max = maxOffset();
        const progress = max > 0 ? offset / max : 0;
        // La pastille occupe 30% de la barre et parcourt les 70% restants.
        bar.style.transform = "translateX(" + progress * 233 + "%)";
      }
    };

    const clamp = () => { offset = Math.min(Math.max(offset, 0), maxOffset()); };

    const coast = () => {
      if (dragging) { raf = null; return; }
      vel *= 0.93;
      offset -= vel;
      clamp();
      paint();
      raf = Math.abs(vel) > 0.3 ? requestAnimationFrame(coast) : null;
    };

    const down = (x) => {
      dragging = true;
      startX = lastX = x;
      vel = 0;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      viewport.classList.add("is-dragging");
    };
    const move = (x) => {
      if (!dragging) return;
      const dx = x - lastX;
      lastX = x;
      vel = dx;
      offset -= dx;
      clamp();
      paint();
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      viewport.classList.remove("is-dragging");
      if (!reducedMotion && !raf) raf = requestAnimationFrame(coast);
    };

    // Sans preventDefault, le navigateur lance son glisser-déposer natif
    // d'image et avale les mousemove qui suivent.
    viewport.addEventListener("dragstart", (e) => e.preventDefault());
    viewport.addEventListener("mousedown", (e) => { e.preventDefault(); down(e.clientX); });
    window.addEventListener("mousemove", (e) => move(e.clientX));
    window.addEventListener("mouseup", up);

    viewport.addEventListener("touchstart", (e) => down(e.touches[0].clientX), { passive: true });
    viewport.addEventListener("touchmove",  (e) => move(e.touches[0].clientX), { passive: true });
    viewport.addEventListener("touchend", up);

    // Un clic sur une carte après un vrai glissé ne doit pas suivre le lien.
    $$("a", track).forEach((a) => {
      a.addEventListener("click", (e) => {
        if (Math.abs(startX - lastX) > 6) e.preventDefault();
      });
    });

    window.addEventListener("resize", () => { clamp(); paint(); });
    paint();
  });

  /* ----------------------------------------------------------------------
     Formulaire de contact
     ---------------------------------------------------------------------- */
  const form   = $("#contact-form");
  const status = $("#form-status");

  if (form && status) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        status.textContent = "Merci de compléter les champs obligatoires (*).";
        status.className = "form__status is-err";
        return;
      }

      const data   = new FormData(form);
      const branch = form.dataset.branch || "BLV WASH";
      const lignes = [
        "Nouvelle demande — " + branch,
        "",
        "Nom : " + data.get("name"),
        "Téléphone : " + data.get("phone"),
        "Email : " + (data.get("email") || "non renseigné"),
        "Prestation : " + data.get("service"),
        "",
        "Message :",
        data.get("message"),
      ];

      // Ouvre le client mail avec la demande pré-remplie. Pour un envoi sans
      // client mail, branchez ici Formspree, Web3Forms ou votre backend.
      window.location.href =
        "mailto:contact@blvwash.fr" +
        "?subject=" + encodeURIComponent(branch + " — " + data.get("service")) +
        "&body="    + encodeURIComponent(lignes.join("\n"));

      status.textContent = "Votre messagerie va s'ouvrir avec votre demande pré-remplie. À très vite !";
      status.className = "form__status is-ok";
      form.reset();
    });
  }
})();
