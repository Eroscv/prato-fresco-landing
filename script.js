(function () {
  "use strict";

  // ===== Máscara e validação de CEP =====
  function maskCep(value) {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length > 5) return digits.slice(0, 5) + "-" + digits.slice(5);
    return digits;
  }

  function isValidCep(value) {
    return /^\d{5}-\d{3}$/.test(value);
  }

  document.querySelectorAll('.cep-form input[type="text"]').forEach(function (input) {
    input.addEventListener("input", function () {
      input.value = maskCep(input.value);
    });
  });

  document.querySelectorAll(".cep-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const input = form.querySelector('input[type="text"]');
      const errorEl = form.parentElement.querySelector(".cep-error");
      if (!isValidCep(input.value)) {
        input.setAttribute("aria-invalid", "true");
        if (errorEl) errorEl.classList.add("visible");
        input.focus();
        return;
      }
      input.removeAttribute("aria-invalid");
      if (errorEl) errorEl.classList.remove("visible");
      alert("CEP " + input.value + " recebido! (fluxo de verificação de cobertura iria aqui)");
    });
  });

  // ===== Carrosséis (pratos e catálogo) =====
  function setupCarousel(trackId, dotsId, prevId, nextId, label) {
    const track = document.getElementById(trackId);
    const dotsWrap = document.getElementById(dotsId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);

    if (!track || !dotsWrap) return;

    const cards = Array.from(track.children);
    cards.forEach(function (_, i) {
      const dot = document.createElement("button");
      dot.className = "carousel__dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", "Ir para o " + label + " " + (i + 1));
      dot.addEventListener("click", function () {
        cards[i].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      });
      dotsWrap.appendChild(dot);
    });

    function updateActiveDot() {
      const dots = Array.from(dotsWrap.children);
      const trackRect = track.getBoundingClientRect();
      let closestIdx = 0;
      let closestDist = Infinity;
      cards.forEach(function (card, i) {
        const rect = card.getBoundingClientRect();
        const dist = Math.abs(rect.left - trackRect.left);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = i;
        }
      });
      dots.forEach(function (d, i) { d.classList.toggle("active", i === closestIdx); });
    }

    track.addEventListener("scroll", function () {
      window.requestAnimationFrame(updateActiveDot);
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        track.scrollBy({ left: -260, behavior: "smooth" });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        track.scrollBy({ left: 260, behavior: "smooth" });
      });
    }
  }

  setupCarousel("carousel-track", "carousel-dots", "carousel-prev", "carousel-next", "prato");
  setupCarousel("catalog-track", "catalog-dots", "catalog-prev", "catalog-next", "item");

  // ===== Botões "Adicionar" do catálogo =====
  document.querySelectorAll(".menu-card__add").forEach(function (btn) {
    btn.addEventListener("click", function () {
      btn.textContent = "✓";
      btn.style.background = "var(--accent)";
      setTimeout(function () {
        btn.textContent = "+";
        btn.style.background = "";
      }, 1200);
    });
  });

  // ===== Barra fixa inferior =====
  const stickyCta = document.getElementById("sticky-cta");
  const hero = document.querySelector(".hero");
  const footer = document.querySelector(".footer");

  if (stickyCta && hero) {
    const heroObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            stickyCta.classList.add("visible");
          } else {
            stickyCta.classList.remove("visible");
          }
        });
      },
      { threshold: 0 }
    );
    heroObserver.observe(hero);
  }

  if (stickyCta && footer) {
    const footerObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            stickyCta.classList.remove("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    footerObserver.observe(footer);
  }

  // ===== Chips levam para o menu (ancora de exemplo) =====
  document.querySelectorAll(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      chip.classList.toggle("active");
    });
  });
})();
