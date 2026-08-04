/* ==========================================================================
   Velora Formazione Core Interaction Engine
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  /* Initialize Bilingual State Management safely for both local and server hosting */
  let currentLanguage = "it";
  try {
    currentLanguage = localStorage.getItem("velora_lang") || "it";
  } catch (err) {
    console.warn("localStorage restricted; using default language.");
  }

  /* Apply initial translation state */
  applyTranslations(currentLanguage);

  /* Ensure clean standalone 'VELORA' branding exclusively in the top navigation bar across all pages */
  document.querySelectorAll(".navbar .brand-logo").forEach(function (logo) {
    const img = logo.querySelector("img");
    if (img) {
      logo.innerHTML = "";
      logo.appendChild(img);
      logo.appendChild(document.createTextNode(" VELORA"));
    }
  });

  /* Attach click listeners to all language toggle controls */
  const langToggleButtons = document.querySelectorAll("#lang-toggle, .lang-toggle-btn");
  langToggleButtons.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      currentLanguage = (currentLanguage === "it") ? "en" : "it";
      try {
        localStorage.setItem("velora_lang", currentLanguage);
      } catch (err) {}
      applyTranslations(currentLanguage);
    });
  });

  /* Translate all DOM elements tagged with data attributes */
  function applyTranslations(lang) {
    if (typeof VELORA_TRANSLATIONS === "undefined") return;
    const dict = VELORA_TRANSLATIONS[lang] || VELORA_TRANSLATIONS["it"];
    if (!dict) return;
    
    document.querySelectorAll("[data-i18n]").forEach(function (element) {
      const key = element.getAttribute("data-i18n");
      if (dict[key]) {
        element.textContent = dict[key];
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (input) {
      const key = input.getAttribute("data-i18n-placeholder");
      if (dict[key]) {
        input.placeholder = dict[key];
      }
    });

    if (dict["lang_btn"]) {
      document.querySelectorAll("#lang-toggle, .lang-toggle-btn").forEach(function (btn) {
        btn.textContent = dict["lang_btn"];
      });
    }

    document.documentElement.lang = lang;
    enforceGlobalConsistency(lang);
  }

  /* Mobile Hamburger Navigation Menu Controller */
  const menuToggleBtn = document.getElementById("mobile-menu-toggle");
  const navLinksContainer = document.getElementById("nav-links-menu");

  if (menuToggleBtn && navLinksContainer) {
    menuToggleBtn.addEventListener("click", function () {
      navLinksContainer.classList.toggle("active");
    });
  }

  /* CardNav Interactive Dropdown Controller */
  document.querySelectorAll(".cardnav-trigger").forEach(function(trigger) {
    trigger.addEventListener("click", function(e) {
      e.stopPropagation();
      const parentItem = this.closest(".cardnav-item");
      document.querySelectorAll(".cardnav-item").forEach(function(item) {
        if (item !== parentItem) item.classList.remove("open");
      });
      parentItem.classList.toggle("open");
    });
  });

  document.addEventListener("click", function() {
    document.querySelectorAll(".cardnav-item").forEach(function(item) {
      item.classList.remove("open");
    });
  });

  /* GDPR Cookie Consent Modal Logic */
  const cookieModal = document.getElementById("cookie-modal");
  const btnAccept = document.getElementById("btn-accept-cookies");
  const btnReject = document.getElementById("btn-reject-cookies");

  if (cookieModal && !localStorage.getItem("velora_cookie_consent")) {
    setTimeout(function () {
      cookieModal.classList.add("active");
    }, 1200);
  }

  if (btnAccept) {
    btnAccept.addEventListener("click", function () {
      localStorage.setItem("velora_cookie_consent", "accepted");
      if (cookieModal) cookieModal.classList.remove("active");
    });
  }

  if (btnReject) {
    btnReject.addEventListener("click", function () {
      localStorage.setItem("velora_cookie_consent", "rejected");
      if (cookieModal) cookieModal.classList.remove("active");
    });
  }

  /* Phase 17 Interactive Lead Generation Questionnaire Suite */
  const screeningForms = document.querySelectorAll(".candidate-form");
  screeningForms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const dict = VELORA_TRANSLATIONS[currentLanguage] || VELORA_TRANSLATIONS["it"];
      
      /* Gather candidate input details safely */
      const nameInput = form.querySelector("input[id*='name'], input[placeholder*='Laura'], input[placeholder*='Alessandro'], input[placeholder*='Gianluca'], input[placeholder*='Ahmed'], input[placeholder*='Roberto'], input[placeholder*='Marco'], input[placeholder*='Dott']");
      const countryInput = form.querySelector("input[id*='country'], input[id*='province'], input[placeholder*='Italia'], input[placeholder*='Marocco']");
      const emailInput = form.querySelector("input[type='email']");
      const phoneInput = form.querySelector("input[type='tel'], input[id*='phone']");
      const reasonInput = form.querySelector("textarea");

      const candidateName = nameInput ? nameInput.value.trim() : "Candidato";
      const candidateCountry = countryInput ? countryInput.value.trim() : "Non Specificato";
      const candidateEmail = emailInput ? emailInput.value.trim() : "Nessuna email";
      const candidatePhone = phoneInput ? phoneInput.value.trim() : "Nessuno";
      const candidateReason = reasonInput ? reasonInput.value.trim() : "Richiesta orientamento generale.";

      /* Build structured lead object and store within browser localStorage */
      const newLead = {
        name: candidateName,
        country: candidateCountry,
        email: candidateEmail,
        phone: candidatePhone,
        reason: candidateReason,
        timestamp: new Date().toISOString(),
        preferredLanguage: currentLanguage
      };

      let storedLeads = [];
      try {
        const existingLeads = localStorage.getItem("velora_candidate_leads");
        if (existingLeads) {
          storedLeads = JSON.parse(existingLeads);
        }
      } catch (err) {
        console.warn("Storage read failure for leads dictionary");
        storedLeads = [];
      }

      storedLeads.push(newLead);
      localStorage.setItem("velora_candidate_leads", JSON.stringify(storedLeads));

      /* Construct personalized bilingual confirmation alert */
      let confirmationNotice = "";
      if (currentLanguage === "en") {
        confirmationNotice = "Thank you for reaching out to Velora Formazione! We have recorded your application and Country of Origin details. Our study orientation advisors will contact you shortly at phone +39 327 626 9708 or via email.";
      } else {
        confirmationNotice = "Grazie per aver contattato Velora Formazione! Abbiamo registrato con successo la tua candidatura e il tuo Paese di Origine. Un nostro orientatore didattico madrelingua ti ricontatterà al più presto via telefono o WhatsApp.";
      }

      alert(confirmationNotice);
      form.reset();
    });
  });

  /* ==========================================================================
     Master UI Harmonizer: Universal React Bits CardNav & Site-Wide I18N
     ========================================================================== */
  /* ==========================================================================
     Master UI Harmonizer: Universal Magnetic Dock Navigation Engine
     ========================================================================== */
  function enforceGlobalConsistency(lang) {
    const isEnglish = (lang === "en");

    /* Hide any legacy headers */
    document.querySelectorAll("header.header, .header-old, #old-header, .navbar").forEach(h => h.style.display = "none");
    
    let dockWrapper = document.getElementById("velora-magnetic-dock-wrapper");
    if (!dockWrapper) {
      dockWrapper = document.createElement("div");
      dockWrapper.id = "velora-magnetic-dock-wrapper";
      dockWrapper.className = "magnetic-dock-wrapper";
      document.body.insertBefore(dockWrapper, document.body.firstChild);
    }

    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    dockWrapper.innerHTML = `
      <a href="index.html" class="brand-logo" title="Velora Formazione Home">
        <img src="assets/images/logo_velora.png" alt="Velora Formazione">
        VELORA
      </a>

      <nav class="magnetic-dock-container" id="magnetic-dock-nav">
        <!-- 1. Home -->
        <a href="index.html" class="dock-item-btn ${currentPath === 'index.html' ? 'active' : ''}">
          ${isEnglish ? "Home" : "Home"}
          <span class="dock-item-tooltip">Accademia Velora</span>
          ${currentPath === 'index.html' ? '<span class="dock-active-dot"></span>' : ''}
        </a>

        <!-- 2. About -->
        <a href="chi_siamo.html" class="dock-item-btn ${currentPath === 'chi_siamo.html' ? 'active' : ''}">
          ${isEnglish ? "About Us" : "Chi Siamo"}
          <span class="dock-item-tooltip">La Nostra Storia</span>
          ${currentPath === 'chi_siamo.html' ? '<span class="dock-active-dot"></span>' : ''}
        </a>

        <!-- 3. Student Area (Highlighted) -->
        <a href="area_studente.html" class="dock-item-btn highlighted-item ${currentPath === 'area_studente.html' ? 'active' : ''}">
          ${isEnglish ? "Student Area" : "Area Studente"}
          <span class="dock-item-tooltip">Portale Didattico</span>
          ${currentPath === 'area_studente.html' ? '<span class="dock-active-dot"></span>' : ''}
        </a>

        <!-- 4. Schedule -->
        <a href="calendario.html" class="dock-item-btn ${currentPath === 'calendario.html' ? 'active' : ''}">
          ${isEnglish ? "Schedule" : "Calendario & Orari"}
          <span class="dock-item-tooltip">Date e Lezioni</span>
          ${currentPath === 'calendario.html' ? '<span class="dock-active-dot"></span>' : ''}
        </a>

        <!-- 5. Corsi & Master Dropdown (Preserving all pages) -->
        <div class="dock-dropdown-container">
          <div class="dock-item-btn">
            ${isEnglish ? "Courses ▼" : "Corsi & Master ▼"}
            <span class="dock-item-tooltip">Catalogo Formativo</span>
          </div>
          <div class="dock-dropdown-menu">
            <a href="master_caf.html">Master CAF e Patronato <span>→</span></a>
            <a href="operatore_fiscale.html">Operatore Fiscale 360° <span>→</span></a>
            <a href="esame_italiano.html">Esami Lingua Italiana <span>→</span></a>
            <a href="corsi_gratuiti.html">Corsi Gratuiti Disoccupati <span>→</span></a>
            <a href="master_imprenditore.html">Master Imprenditore <span>→</span></a>
            <a href="manuali.html">Manuale Ufficiale <span>→</span></a>
            <a href="trasparenza.html">Trasparenza Civica <span>→</span></a>
          </div>
        </div>

        <!-- 6. Work With Us (At the end of sequence) -->
        <a href="lavora_con_noi.html" class="dock-item-btn ${currentPath === 'lavora_con_noi.html' ? 'active' : ''}">
          ${isEnglish ? "Work With Us" : "Lavora Con Noi"}
          <span class="dock-item-tooltip">Affiliati & Carriera</span>
          ${currentPath === 'lavora_con_noi.html' ? '<span class="dock-active-dot"></span>' : ''}
        </a>

        <!-- 7. Contact Us -->
        <a href="contatti.html" class="dock-item-btn ${currentPath === 'contatti.html' ? 'active' : ''}">
          ${isEnglish ? "Contact Us" : "Contatti"}
          <span class="dock-item-tooltip">Sede e Informazioni</span>
          ${currentPath === 'contatti.html' ? '<span class="dock-active-dot"></span>' : ''}
        </a>

        <!-- 8. Portal Login Button -->
        <a href="accedi.html" class="dock-item-btn specular-button specular-button--sm" style="background: rgba(200, 157, 66, 0.25); border-color: rgba(200, 157, 66, 0.6);">
          ${isEnglish ? "Sign In" : "Accedi"}
        </a>

        <!-- 9. Language Switcher -->
        <button type="button" class="dock-item-btnSpecular specular-button specular-button--sm" id="global-lang-toggle" style="padding: 6px 12px; font-weight: bold; border-radius: 14px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); color: #fff; cursor: pointer;">
          ${isEnglish ? "🇮🇹 IT" : "🇬🇧 EN"}
        </button>
      </nav>
    `;

    /* Attach interactive magnetic proximity scale calculation */
    const container = document.getElementById("magnetic-dock-nav");
    if (container) {
      const items = container.querySelectorAll(".dock-item-btn");
      container.addEventListener("mousemove", function(e) {
        const mouseX = e.clientX;
        items.forEach(function(item) {
          const rect = item.getBoundingClientRect();
          const itemCenter = rect.left + rect.width / 2;
          const distance = Math.abs(mouseX - itemCenter);
          const maxDistance = 140;
          if (distance < maxDistance) {
            const scale = 1 + (1 - distance / maxDistance) * 0.25;
            const translateY = (1 - distance / maxDistance) * -6;
            item.style.transform = `scale(${scale}) translateY(${translateY}px)`;
          } else {
            item.style.transform = "scale(1) translateY(0px)";
          }
        });
      });

      container.addEventListener("mouseleave", function() {
        items.forEach(function(item) {
          item.style.transform = "scale(1) translateY(0px)";
        });
      });
    }

    /* Attach language switcher listener */
    const langBtn = document.getElementById("global-lang-toggle");
    if (langBtn) {
      langBtn.addEventListener("click", function(e) {
        e.preventDefault();
        currentLanguage = (currentLanguage === "it") ? "en" : "it";
        try { localStorage.setItem("velora_lang", currentLanguage); } catch(err) {}
        applyTranslations(currentLanguage);
      });
    }


    /* 2. Enforce React Bits Specular Button interactive shader style site-wide */
    document.querySelectorAll(".btn, .card-nav-cta-button, button[type='submit'], .btn-primary, .btn-secondary").forEach(function(btn) {
      if (!btn.classList.contains("specular-button")) {
        btn.classList.add("specular-button", "specular-button--lg");
      }
      if (!btn.querySelector(".specular-button__fx")) {
        const fx = document.createElement("span");
        fx.className = "specular-button__fx";
        fx.setAttribute("aria-hidden", "true");
        btn.appendChild(fx);

        btn.addEventListener("mousemove", function(e) {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          btn.style.setProperty("--mouse-x", `${x}px`);
          btn.style.setProperty("--mouse-y", `${y}px`);
        });
      }
    });

    /* 3. Keep 'Thank you for your trust...' sentence exclusively on Contact Us page (contatti.html) */
    const isContactPage = window.location.pathname.includes("contatti") || document.title.toLowerCase().includes("contatti");
    document.querySelectorAll("[data-i18n='footer_trust'], .trust-message").forEach(function(el) {
      if (!isContactPage) {
        el.remove();
      }
    });

    /* 4. Ensure Developer Attribution appears at the very end of EVERY footer */
    document.querySelectorAll("footer").forEach(function(footer) {
      if (!footer.querySelector(".developer-attribution")) {
        const devDiv = document.createElement("div");
        devDiv.className = "developer-attribution";
        devDiv.innerHTML = `Developed by <a href="mailto:hello@quartermasters.me" target="_blank" title="Contact Quartermasters F.Z.C">Quartermasters F.Z.C</a>`;
        footer.appendChild(devDiv);
      }
    });
  }

  enforceGlobalConsistency(currentLanguage);
});
