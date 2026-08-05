/* ==========================================================================
   Velora Formazione Native Animation Engine and Interactive UI Drivers
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  initializeParticleTextEngine();
  initializeStrokeTextEngine();
  initializeCircularGallery();
  initializeMagicBentoEngine();
  initializePixelCardEngine();
  injectGlobalWidgets();
});

/* ==========================================================================
   Canvas Particle Text Engine for Hero Banner
   ========================================================================== */
function initializeParticleTextEngine() {
  const container = document.getElementById("hero-particle-container");
  if (!container) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  container.appendChild(canvas);

  let width = container.clientWidth || window.innerWidth;
  let height = container.clientHeight || 360;
  canvas.width = width;
  canvas.height = height;

  let particles = [];
  let mouse = { x: -1000, y: -1000, radius: 120 };

  canvas.addEventListener("mousemove", function (e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener("mouseleave", function () {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  canvas.addEventListener("touchmove", function (e) {
    if (e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
    }
  });

  window.addEventListener("resize", function () {
    width = container.clientWidth || window.innerWidth;
    height = container.clientHeight || 360;
    canvas.width = width;
    canvas.height = height;
    generateParticles();
  });

  function generateParticles() {
    particles = [];
    const offCanvas = document.createElement("canvas");
    const offCtx = offCanvas.getContext("2d");
    offCanvas.width = width;
    offCanvas.height = height;

    /* Responsive font scale calculations */
    const fontSize = Math.min(Math.max(Math.floor(width / 6.5), 60), 130);
    offCtx.font = "800 " + fontSize + "px 'Outfit', sans-serif";
    offCtx.fillStyle = "#FFFFFF";
    offCtx.textAlign = "center";
    offCtx.textBaseline = "middle";
    offCtx.fillText("VELORA", width / 2, height / 2);

    const imageData = offCtx.getImageData(0, 0, width, height).data;
    const density = 4;

    for (let y = 0; y < height; y += density) {
      for (let x = 0; x < width; x += density) {
        const index = (y * width + x) * 4;
        if (imageData[index + 3] > 128) {
          const scatterX = x + (Math.random() - 0.5) * 190;
          const scatterY = y + (Math.random() - 0.5) * 190;
          const isGold = Math.random() < 0.35;

          particles.push({
            x: scatterX,
            y: scatterY,
            originX: x,
            originY: y,
            size: 2.2,
            color: isGold ? "#C89D42" : "#F8FAFC",
            glow: isGold ? "#E3BA5E" : "#8B5CF6",
            vx: 0,
            vy: 0,
            angle: Math.random() * Math.PI * 2,
            driftSpeed: 0.03 + Math.random() * 0.02
          });
        }
      }
    }
  }

  function renderLoop() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];

      /* Idle floating drift calculations */
      p.angle += p.driftSpeed;
      let targetX = p.originX + Math.cos(p.angle) * 0.8;
      let targetY = p.originY + Math.sin(p.angle) * 0.8;

      /* Mouse pointer repulsion physics */
      let dx = mouse.x - p.x;
      let dy = mouse.y - p.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius && distance > 0) {
        let force = (mouse.radius - distance) / mouse.radius;
        let repelDirectionX = dx / distance;
        let repelDirectionY = dy / distance;
        let repelStrength = 42 * force;
        
        p.x -= repelDirectionX * repelStrength * 0.15;
        p.y -= repelDirectionY * repelStrength * 0.15;
      }

      /* Smooth gathering towards origin position */
      p.x += (targetX - p.x) * 0.08;
      p.y += (targetY - p.y) * 0.08;

      ctx.save();
      ctx.fillStyle = p.color;
      if (p.color === "#C89D42") {
        ctx.shadowColor = p.glow;
        ctx.shadowBlur = 8;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(renderLoop);
  }

  generateParticles();
  renderLoop();
}

/* ==========================================================================
   SVG Stroke Text Drawing and Color Wipe Engine for Footer
   ========================================================================== */
function initializeStrokeTextEngine() {
  const container = document.getElementById("footer-stroke-container");
  if (!container) return;

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 1600 220");
  svg.style.width = "100%";
  svg.style.maxHeight = "200px";
  svg.style.display = "block";

  /* Construct style sheet for continuous infinite looping stroke and wipe animation */
  const styleTag = document.createElementNS(svgNS, "style");
  styleTag.textContent = `
    @keyframes strokeLoop {
      0% { stroke-dashoffset: 800; opacity: 1; }
      45% { stroke-dashoffset: 0; opacity: 1; }
      75% { stroke-dashoffset: 0; opacity: 1; }
      95% { stroke-dashoffset: 0; opacity: 0; }
      100% { stroke-dashoffset: 800; opacity: 0; }
    }
    @keyframes fillWipeLoop {
      0% { opacity: 0; }
      35% { opacity: 0; }
      60% { opacity: 1; filter: drop-shadow(0 0 16px rgba(200, 157, 66, 0.6)); }
      85% { opacity: 1; filter: drop-shadow(0 0 16px rgba(200, 157, 66, 0.6)); }
      95% { opacity: 0; }
      100% { opacity: 0; }
    }
    .stroke-layer { animation: strokeLoop 6s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
    .fill-layer { animation: fillWipeLoop 6s ease-in-out infinite; }
  `;
  svg.appendChild(styleTag);

  const defs = document.createElementNS(svgNS, "defs");
  const linearGrad = document.createElementNS(svgNS, "linearGradient");
  linearGrad.setAttribute("id", "wipe-gradient-loop");
  linearGrad.setAttribute("x1", "0%");
  linearGrad.setAttribute("y1", "0%");
  linearGrad.setAttribute("x2", "100%");
  linearGrad.setAttribute("y2", "0%");

  const stopColor1 = document.createElementNS(svgNS, "stop");
  stopColor1.setAttribute("offset", "0%");
  stopColor1.setAttribute("stop-color", "#F8FAFC");
  const stopColor2 = document.createElementNS(svgNS, "stop");
  stopColor2.setAttribute("offset", "100%");
  stopColor2.setAttribute("stop-color", "#C89D42");
  
  linearGrad.appendChild(stopColor1);
  linearGrad.appendChild(stopColor2);
  defs.appendChild(linearGrad);
  svg.appendChild(defs);

  /* Outline stroke text layer matching user specifications */
  const strokeText = document.createElementNS(svgNS, "text");
  strokeText.setAttribute("x", "50%");
  strokeText.setAttribute("y", "65%");
  strokeText.setAttribute("text-anchor", "middle");
  strokeText.setAttribute("font-family", "'Syncopate', 'Orbitron', sans-serif");
  strokeText.setAttribute("font-size", "110");
  strokeText.setAttribute("font-weight", "700");
  strokeText.setAttribute("letter-spacing", "10");
  strokeText.setAttribute("fill", "transparent");
  strokeText.setAttribute("stroke", "#C89D42");
  strokeText.setAttribute("stroke-width", "1.6");
  strokeText.style.strokeDasharray = "800";
  strokeText.setAttribute("class", "stroke-layer");
  strokeText.textContent = "VELORA";
  svg.appendChild(strokeText);

  /* Color wipe fill text layer */
  const fillText = document.createElementNS(svgNS, "text");
  fillText.setAttribute("x", "50%");
  fillText.setAttribute("y", "65%");
  fillText.setAttribute("text-anchor", "middle");
  fillText.setAttribute("font-family", "'Syncopate', 'Orbitron', sans-serif");
  fillText.setAttribute("font-size", "110");
  fillText.setAttribute("font-weight", "700");
  fillText.setAttribute("letter-spacing", "10");
  fillText.setAttribute("fill", "url(#wipe-gradient-loop)");
  fillText.setAttribute("class", "fill-layer");
  fillText.textContent = "VELORA";
  svg.appendChild(fillText);

  container.appendChild(svg);
}

/* ==========================================================================
   Global Interactive Floating Action Widget and Strict EU GDPR Cookie Consent
   ========================================================================== */
function injectGlobalWidgets() {
  /* Inject Quick Contact Floating Buttons if not present */
  if (!document.querySelector(".floating-widget")) {
    const widget = document.createElement("div");
    widget.className = "floating-widget";
    widget.innerHTML = `
      <a href="https://wa.me/393276269708" target="_blank" title="WhatsApp Assistance" class="widget-btn btn-whatsapp" aria-label="WhatsApp Assistance">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="white"><path d="M12.031 2c-5.467 0-9.914 4.446-9.914 9.914 0 1.954.568 3.774 1.554 5.313L2.518 21.48l4.417-1.127c1.482.934 3.235 1.474 5.096 1.474 5.467 0 9.914-4.447 9.914-9.914S17.498 2 12.031 2zM12.031 20.09c-1.636 0-3.17-.492-4.462-1.343l-.32-.212-2.635.672.705-2.564-.23-.357A8.103 8.103 0 0 1 3.844 11.914c0-4.515 3.673-8.188 8.187-8.188s8.187 3.673 8.187 8.188-3.673 8.176-8.187 8.176zm4.493-6.143c-.246-.123-1.455-.717-1.68-.8-.225-.082-.389-.123-.553.123s-.634.8-.778.963c-.143.164-.287.184-.533.061-.246-.123-1.037-.382-1.977-1.22-.731-.652-1.225-1.458-1.368-1.704-.143-.246-.015-.379.108-.501.111-.111.246-.287.369-.43.123-.143.164-.246.246-.41.082-.164.041-.307-.02-.43-.061-.123-.553-1.332-.758-1.824-.199-.479-.401-.414-.553-.422-.143-.008-.307-.008-.471-.008s-.43.061-.655.307c-.225.246-.86.84-.86 2.049 0 1.209.881 2.377 1.004 2.541.123.164 1.733 2.645 4.198 3.711.587.254 1.045.406 1.401.52.59.188 1.127.162 1.551.098.473-.072 1.455-.594 1.66-1.168.205-.574.205-1.065.143-1.168-.061-.102-.225-.164-.471-.287z"/></svg>
      </a>
      <a href="tel:+393276269708" title="Call Operations Desk" class="widget-btn btn-phone" aria-label="Call Operations Desk">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>
      </a>
      <a href="mailto:info@veloragroupacademy.com" title="Email Inquiry" class="widget-btn btn-email" aria-label="Email Inquiry">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="white"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
      </a>
    `;
    document.body.appendChild(widget);
  }

  /* Inject Strict EU GDPR Law Cookie Consent Modal */
  if (!document.getElementById("cookie-modal")) {
    const modal = document.createElement("div");
    modal.id = "cookie-modal";
    modal.className = "cookie-modal";
    modal.innerHTML = `
      <div style="max-width: 720px;">
        <p style="color: #C89D42; font-weight: 700; font-size: 0.95rem; margin-bottom: 4px;">Conforme alla Direttiva Europea GDPR 2016/679 & ePrivacy</p>
        <p data-i18n="cookie_text" style="color: #F8FAFC; font-size: 0.88rem; line-height: 1.5; margin-bottom: 0;">
          Utilizziamo cookie essenziali tecnici per il funzionamento protetto del sito e cookie di profilazione previo consenso per offrirti un'esperienza di formazione ottimizzata. Vuoi saperne di più? 
          <a href="privacy_cookie_policy.html" style="color: #D1A142; text-decoration: underline; margin-left: 4px;">Leggi la Cookie & Privacy Policy EU</a>.
        </p>
      </div>
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <button id="btn-reject-cookies" class="btn btn-secondary" style="padding: 8px 16px; font-size: 0.85rem;" data-i18n="btn_reject">Solo Essenziali</button>
        <button id="btn-accept-cookies" class="btn btn-primary" style="padding: 8px 16px; font-size: 0.85rem;" data-i18n="btn_accept">Accetta Tutti</button>
      </div>
    `;
    document.body.appendChild(modal);

    /* Bind freshly injected buttons with app storage logic */
    const btnAccept = document.getElementById("btn-accept-cookies");
    const btnReject = document.getElementById("btn-reject-cookies");

    let consentGained = false;
    try {
      consentGained = localStorage.getItem("velora_cookie_consent");
    } catch (err) {}

    if (!consentGained) {
      setTimeout(function () {
        modal.classList.add("active");
      }, 800);
    }

    if (btnAccept) {
      btnAccept.addEventListener("click", function () {
        try { localStorage.setItem("velora_cookie_consent", "accepted_all_gdpr"); } catch(err) {}
        modal.classList.remove("active");
      });
    }

    if (btnReject) {
      btnReject.addEventListener("click", function () {
        try { localStorage.setItem("velora_cookie_consent", "essential_only_gdpr"); } catch(err) {}
        modal.classList.remove("active");
      });
    }
  }
}

/* ==========================================================================
   3D Interactive CircularGallery Engine (Physics & Orbitron Typography)
   ========================================================================== */
function initializeCircularGallery() {
  const wrappers = document.querySelectorAll(".circular-gallery-wrapper, #circular-gallery-container");
  wrappers.forEach(function(wrapper) {
    const track = wrapper.querySelector(".circular-gallery-track") || wrapper.querySelector(".circular-gallery-container") || wrapper;
    const cards = Array.from(wrapper.querySelectorAll(".gallery-card"));
    if (cards.length === 0) return;

    /* Parameters matching user specifications: bend, scrollEase, scrollSpeed, font */
    const bend = parseFloat(wrapper.getAttribute("data-bend") || "1");
    const scrollSpeed = parseFloat(wrapper.getAttribute("data-scroll-speed") || "2");
    const scrollEase = 0.05;

    let currentRot = 0;
    let targetRot = 0;
    let isDragging = false;
    let startX = 0;
    let autoPlay = true;

    const numCards = cards.length;
    const angleStep = 360 / numCards;
    const radius = Math.min(wrapper.clientWidth * 0.42 * bend, 390) || 320;

    wrapper.addEventListener("mousedown", function(e) {
      isDragging = true;
      startX = e.clientX;
      autoPlay = false;
    });

    window.addEventListener("mousemove", function(e) {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      targetRot += deltaX * 0.45;
      startX = e.clientX;
    });

    window.addEventListener("mouseup", function() {
      if (isDragging) {
        isDragging = false;
        setTimeout(() => { autoPlay = true; }, 3000);
      }
    });

    wrapper.addEventListener("touchstart", function(e) {
      if (e.touches.length > 0) {
        isDragging = true;
        startX = e.touches[0].clientX;
        autoPlay = false;
      }
    }, { passive: true });

    window.addEventListener("touchmove", function(e) {
      if (!isDragging || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - startX;
      targetRot += deltaX * 0.55;
      startX = e.touches[0].clientX;
    }, { passive: true });

    window.addEventListener("touchend", function() {
      isDragging = false;
      setTimeout(() => { autoPlay = true; }, 3000);
    });

    const btnPrev = wrapper.querySelector("#btn-gal-prev, .btn-gal-prev") || document.getElementById("btn-gal-prev");
    const btnNext = wrapper.querySelector("#btn-gal-next, .btn-gal-next") || document.getElementById("btn-gal-next");

    if (btnPrev) {
      btnPrev.addEventListener("click", function() {
        targetRot += angleStep;
        autoPlay = false;
        setTimeout(() => { autoPlay = true; }, 4000);
      });
    }

    if (btnNext) {
      btnNext.addEventListener("click", function() {
        targetRot -= angleStep;
        autoPlay = false;
        setTimeout(() => { autoPlay = true; }, 4000);
      });
    }

    function renderGallery() {
      if (autoPlay && !isDragging) {
        targetRot -= 0.12 * scrollSpeed;
      }

      currentRot += (targetRot - currentRot) * scrollEase;

      cards.forEach(function(card, idx) {
        const angle = (idx * angleStep) + currentRot;
        const rad = (angle * Math.PI) / 180;
        
        const x = Math.sin(rad) * radius;
        const z = Math.cos(rad) * radius - radius;
        
        /* Calculate depth perspective lighting and stacking */
        const normalizedZ = (z + radius * 2) / (radius * 2);
        const opacity = Math.max(0.25, Math.min(1, Math.pow(normalizedZ, 1.5)));
        const scale = Math.max(0.65, Math.min(1.05, normalizedZ));

        card.style.transform = `translate3d(${x}px, 0px, ${z}px) rotateY(${angle}deg) scale(${scale})`;
        card.style.opacity = opacity;
        card.style.zIndex = Math.round(normalizedZ * 100);
        
        if (normalizedZ < 0.45) {
          card.style.filter = "brightness(0.45) blur(2px)";
        } else {
          card.style.filter = "brightness(1) blur(0px)";
        }
      });

      requestAnimationFrame(renderGallery);
    }

    renderGallery();
  });
}

/* ==========================================================================
   React Bits BorderGlow Dynamic Pointer & Edge Proximity Tracker
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function() {
  const glowCards = document.querySelectorAll(".border-glow-card");
  
  glowCards.forEach(function(card) {
    card.addEventListener("pointermove", function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = x - cx;
      const dy = y - cy;

      let kx = Infinity;
      let ky = Infinity;
      if (dx !== 0) kx = cx / Math.abs(dx);
      if (dy !== 0) ky = cy / Math.abs(dy);
      const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);

      let degrees = 0;
      if (dx !== 0 || dy !== 0) {
        const radians = Math.atan2(dy, dx);
        degrees = radians * (180 / Math.PI) + 90;
        if (degrees < 0) degrees += 360;
      }

      card.style.setProperty("--edge-proximity", `${(edge * 100).toFixed(3)}`);
      card.style.setProperty("--cursor-angle", `${degrees.toFixed(3)}deg`);
    });
  });
});

/* ==========================================================================
   React Bits PixelCard Native Canvas Animation Driver
   ========================================================================== */
function initializePixelCardEngine() {
  const cards = document.querySelectorAll('.pixel-card');
  cards.forEach(card => {
    let canvas = card.querySelector('canvas.pixel-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'pixel-canvas';
      card.insertBefore(canvas, card.firstChild);
    }

    const ctx = canvas.getContext('2d');
    let pixels = [];
    let animationId = null;
    let timePrevious = performance.now();
    const colors = '#e3ba5e,#c89d42,#f8fafc'.split(',');

    function initPixels() {
      const rect = card.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);

      canvas.width = width;
      canvas.height = height;

      pixels = [];
      const gap = 6;
      for (let x = 0; x < width; x += gap) {
        for (let y = 0; y < height; y += gap) {
          const color = colors[Math.floor(Math.random() * colors.length)];
          const dx = x - width / 2;
          const dy = y - height / 2;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          pixels.push({
            x, y, color,
            size: 0,
            maxSize: Math.random() * 1.5 + 0.5,
            sizeStep: Math.random() * 0.3 + 0.1,
            speed: (Math.random() * 0.8 + 0.1) * 0.035,
            counter: 0,
            counterStep: Math.random() * 4 + (width + height) * 0.01,
            delay: distance,
            isIdle: false,
            isReverse: false,
            isShimmer: false
          });
        }
      }
    }

    function drawPixel(p) {
      const centerOffset = 1 - p.size * 0.5;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x + centerOffset, p.y + centerOffset, p.size, p.size);
    }

    function appear(p) {
      p.isIdle = false;
      if (p.counter <= p.delay) {
        p.counter += p.counterStep;
        return;
      }
      if (p.size >= p.maxSize) {
        p.isShimmer = true;
      }
      if (p.isShimmer) {
        if (p.size >= p.maxSize) p.isReverse = true;
        else if (p.size <= 0.5) p.isReverse = false;
        p.size += p.isReverse ? -p.speed : p.speed;
      } else {
        p.size += p.sizeStep;
      }
      drawPixel(p);
    }

    function disappear(p) {
      p.isShimmer = false;
      p.counter = 0;
      if (p.size <= 0) {
        p.isIdle = true;
      } else {
        p.size -= 0.1;
        drawPixel(p);
      }
    }

    function animate(action) {
      if (animationId) cancelAnimationFrame(animationId);

      function loop() {
        const timeNow = performance.now();
        const timePassed = timeNow - timePrevious;
        if (timePassed >= 1000 / 60) {
          timePrevious = timeNow - (timePassed % (1000 / 60));
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          let allIdle = true;
          pixels.forEach(p => {
            if (action === 'appear') appear(p);
            else disappear(p);
            if (!p.isIdle) allIdle = false;
          });

          if (allIdle && action === 'disappear') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
          }
        }
        animationId = requestAnimationFrame(loop);
      }

      loop();
    }

    initPixels();
    card.addEventListener('mouseenter', () => animate('appear'));
    card.addEventListener('mouseleave', () => animate('disappear'));
    window.addEventListener('resize', initPixels);
  });
}

