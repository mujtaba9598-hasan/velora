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

    /* 5. Inject Site-Wide Browser Tab Favicon Icon */
    if (!document.querySelector("link[rel*='icon']")) {
      const iconLink = document.createElement("link");
      iconLink.rel = "icon";
      iconLink.type = "image/png";
      iconLink.href = "favicon.png";
      document.head.appendChild(iconLink);
    }
    if (!document.querySelector("link[rel='apple-touch-icon']")) {
      const appleIcon = document.createElement("link");
      appleIcon.rel = "apple-touch-icon";
      appleIcon.href = "favicon.png";
      document.head.appendChild(appleIcon);
    }

    /* 6. Inject Site-Wide Floating WhatsApp & Direct Phone Call Action Buttons */
    if (!document.getElementById("velora-floating-action-bar")) {
      const floatBar = document.createElement("div");
      floatBar.id = "velora-floating-action-bar";
      floatBar.className = "floating-action-bar";
      floatBar.innerHTML = `
        <!-- Floating Direct Phone Call Button -->
        <a href="tel:+390282954825" class="floating-action-btn floating-btn-phone" aria-label="Call Velora Desk">
          <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
          <span class="floating-btn-tooltip">Chiama Ora: +39 02 82954825</span>
        </a>

        <!-- Floating WhatsApp Support Button -->
        <a href="https://wa.me/390282954825" target="_blank" rel="noopener noreferrer" class="floating-action-btn floating-btn-whatsapp" aria-label="WhatsApp Support">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
          <span class="floating-btn-tooltip">Chatta su WhatsApp</span>
        </a>
      `;
      document.body.appendChild(floatBar);
    }
  }

  enforceGlobalConsistency(currentLanguage);
});
