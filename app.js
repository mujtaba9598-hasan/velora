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
  function enforceGlobalConsistency(lang) {
    const isEnglish = (lang === "en");

    /* 1. Remove old inconsistent headers and inject identical floating CardNav across ALL pages */
    document.querySelectorAll("header.header, .header-old, #old-header").forEach(h => h.style.display = "none");
    
    let cardNavContainer = document.getElementById("velora-card-nav-container");
    if (!cardNavContainer) {
      cardNavContainer = document.createElement("div");
      cardNavContainer.id = "velora-card-nav-container";
      cardNavContainer.className = "card-nav-container";
      document.body.insertBefore(cardNavContainer, document.body.firstChild);
    }

    cardNavContainer.innerHTML = `
      <nav class="card-nav" id="official-card-nav">
        <div class="card-nav-top">
          <div class="hamburger-menu" id="nav-hamburger" role="button" tabindex="0" aria-label="Toggle Menu">
            <div class="hamburger-line"></div>
            <div class="hamburger-line"></div>
          </div>

          <a href="index.html" class="logo-container" title="Velora Formazione Home">
            <img src="assets/images/logo_velora.png" onerror="this.style.display='none';this.onerror=null;" alt="Velora Logo">
            <span>VELORA</span>
          </a>

          <div style="display: flex; align-items: center; gap: 12px;">
            <button type="button" class="btn lang-toggle-btn specular-button specular-button--sm" id="global-lang-toggle" style="padding: 6px 14px; min-height: 38px; font-weight: bold;">
              ${isEnglish ? "🇮🇹 IT" : "🇬🇧 EN"}
            </button>
            <a href="area_studente.html" class="btn btn-primary card-nav-cta-button specular-button" style="min-height: 38px; display: inline-flex; align-items: center;">
              ${isEnglish ? "Student Area" : "Area Studente"}
            </a>
          </div>
        </div>

        <div class="card-nav-content" aria-hidden="true">
          <!-- Card 1: Academy & About -->
          <div class="nav-card" style="background-color: #0F1A2E; color: #fff;">
            <div class="nav-card-label">${isEnglish ? "Academy" : "Accademia"}</div>
            <div class="nav-card-links">
              <a class="nav-card-link" href="index.html"><span class="nav-card-link-icon">↗</span> ${isEnglish ? "Home" : "Home"}</a>
              <a class="nav-card-link" href="chi_siamo.html"><span class="nav-card-link-icon">↗</span> ${isEnglish ? "About Us" : "Chi Siamo"}</a>
              <a class="nav-card-link" href="manuali.html"><span class="nav-card-link-icon">↗</span> ${isEnglish ? "Official Handbook" : "Manuale Ufficiale"}</a>
            </div>
          </div>

          <!-- Card 2: Portals & Dates -->
          <div class="nav-card" style="background-color: #162238; color: #fff;">
            <div class="nav-card-label">${isEnglish ? "Portals & Schedule" : "Corsi & Orari"}</div>
            <div class="nav-card-links">
              <a class="nav-card-link" href="area_studente.html" style="color: #E3BA5E !important; font-weight: 700;"><span class="nav-card-link-icon">↗</span> ${isEnglish ? "Student Area" : "Area Studente"}</a>
              <a class="nav-card-link" href="calendario.html"><span class="nav-card-link-icon">↗</span> ${isEnglish ? "Schedule & Timetables" : "Calendario & Orari"}</a>
              <a class="nav-card-link" href="corsi_gratuiti.html"><span class="nav-card-link-icon">↗</span> ${isEnglish ? "Free Courses" : "Corsi Gratuiti"}</a>
            </div>
          </div>

          <!-- Card 3: Connect & Careers -->
          <div class="nav-card" style="background-color: #1D2A44; color: #fff;">
            <div class="nav-card-label">${isEnglish ? "Connect" : "Connettiti"}</div>
            <div class="nav-card-links">
              <a class="nav-card-link" href="contatti.html"><span class="nav-card-link-icon">↗</span> ${isEnglish ? "Contact Us" : "Contatti"}</a>
              <a class="nav-card-link" href="lavora_con_noi.html"><span class="nav-card-link-icon">↗</span> ${isEnglish ? "Work With Us" : "Lavora Con Noi"}</a>
            </div>
          </div>
        </div>
      </nav>
    `;

    /* Attach hamburger open/close toggle functionality */
    const navEl = document.getElementById("official-card-nav");
    const hamb = document.getElementById("nav-hamburger");
    if (hamb && navEl) {
      hamb.addEventListener("click", function() {
        const isClosed = !navEl.classList.contains("open");
        if (isClosed) {
          navEl.classList.add("open");
          hamb.classList.add("open");
          navEl.style.height = window.innerWidth <= 768 ? "390px" : "280px";
        } else {
          navEl.classList.remove("open");
          hamb.classList.remove("open");
          navEl.style.height = "64px";
        }
      });
    }

    /* Attach language toggle event listener */
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
