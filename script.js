/**
 * AGBELIA RAMADHANTY BIRTHDAY WEBSITE — SCRIPT
 * Theme: Calla Lily Minimalist Luxury & Aesthetic
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. AMBIENT PETAL CANVAS PHYSICS (Calla Lily Translucent Petals)
     ========================================================================== */
  const canvas = document.getElementById('petal-canvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = (canvas.width = window.innerWidth);
    height = (canvas.height = window.innerHeight);
  });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const numPetals = Math.min(Math.floor(width / 35), 32);
  const petals = [];

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -30;
      this.size = Math.random() * 12 + 10;
      this.speedY = Math.random() * 0.8 + 0.4;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
      this.opacity = Math.random() * 0.45 + 0.35;
      
      // Calla lily petal soft colors (soft cream, pearl white, faint blush)
      const hues = ['#FFFFFF', '#FBF8F3', '#F2F6F9', '#E9F1F6', '#FAF3E8'];
      this.color = hues[Math.floor(Math.random() * hues.length)];
      this.swingAmp = Math.random() * 1.5 + 0.5;
      this.swingAngle = Math.random() * Math.PI * 2;
    }

    update() {
      this.y += this.speedY;
      this.swingAngle += 0.02;
      this.x += Math.sin(this.swingAngle) * this.swingAmp * 0.4 + this.speedX;
      this.rotation += this.rotSpeed;

      if (this.y > height + 40 || this.x < -40 || this.x > width + 40) {
        this.reset(false);
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      // Draw soft organic Calla Lily petal shape
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.15)';
      ctx.shadowBlur = 8;

      ctx.moveTo(0, -this.size * 1.2);
      ctx.bezierCurveTo(this.size * 0.9, -this.size * 0.5, this.size * 0.8, this.size * 0.8, 0, this.size);
      ctx.bezierCurveTo(-this.size * 0.8, this.size * 0.8, -this.size * 0.9, -this.size * 0.5, 0, -this.size * 1.2);
      ctx.fill();

      // Delicate inner vein line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(197, 160, 89, 0.2)';
      ctx.lineWidth = 0.8;
      ctx.moveTo(0, -this.size * 0.9);
      ctx.lineTo(0, this.size * 0.7);
      ctx.stroke();

      ctx.restore();
    }
  }

  if (!prefersReducedMotion) {
    for (let i = 0; i < numPetals; i++) {
      petals.push(new Petal());
    }

    function animatePetals() {
      ctx.clearRect(0, 0, width, height);
      petals.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animatePetals);
    }
    animatePetals();
  }


  /* ==========================================================================
     2. AUDIO & AMBIENT MUSIC SYNTHESIZER
     ========================================================================== */
  const audioEl = document.getElementById('bg-audio');
  const musicToggleBtn = document.getElementById('music-toggle');
  const musicUploadBtn = document.getElementById('music-upload-btn');
  const audioFileInput = document.getElementById('audio-file-input');

  let audioCtx = null;
  let synthInterval = null;
  let isPlaying = false;

  // Romantic ambient soft chord progression (Web Audio API Synthesizer)
  // Play background music (assets/music.mp3) or fallback to ambient synth
  function startSoftAmbientSynth() {
    // Force audio element play attempt first
    const playPromise = audioEl.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // HTML5 Audio (music.mp3) is playing successfully!
        return;
      }).catch((err) => {
        console.log('HTML5 Audio play fallback to WebAudio Synth:', err);
        // Fallback to WebAudio Synth if audio file is not available or blocked
        playWebAudioSynth();
      });
    } else {
      playWebAudioSynth();
    }
  }

  function playWebAudioSynth() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const chords = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 329.63], // Fmaj7
        [196.00, 246.94, 293.66, 392.00]  // G7
      ];

      let chordIdx = 0;

      function playChord(freqs) {
        if (!isPlaying) return;
        freqs.forEach(freq => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

          gain.gain.setValueAtTime(0, audioCtx.currentTime);
          gain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 1.2);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 4.5);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start();
          osc.stop(audioCtx.currentTime + 4.6);
        });
      }

      playChord(chords[chordIdx]);
      synthInterval = setInterval(() => {
        chordIdx = (chordIdx + 1) % chords.length;
        playChord(chords[chordIdx]);
      }, 4500);

    } catch (err) {
      console.log('Audio synth notice:', err);
    }
  }

  function stopSoftAmbientSynth() {
    if (synthInterval) clearInterval(synthInterval);
    if (audioEl.src) audioEl.pause();
  }

  function toggleMusic() {
    isPlaying = !isPlaying;
    musicToggleBtn.classList.toggle('paused', !isPlaying);
    musicToggleBtn.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');

    if (isPlaying) {
      startSoftAmbientSynth();
      showToast('🎵 Musik ambient diputar');
    } else {
      stopSoftAmbientSynth();
      showToast('🔇 Musik dihentikan');
    }
  }

  musicToggleBtn.addEventListener('click', toggleMusic);

  // Custom MP3 Uploader
  musicUploadBtn.addEventListener('click', () => audioFileInput.click());
  audioFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      audioEl.src = fileUrl;
      isPlaying = true;
      musicToggleBtn.classList.remove('paused');
      stopSoftAmbientSynth();
      audioEl.play().then(() => {
        showToast(`🎶 Memutar: ${file.name}`);
      });
    }
  });


  /* ==========================================================================
     3. NAVIGATION & COVER OVERLAY
     ========================================================================== */
  const cover = document.getElementById('cover');
  const startBtn = document.getElementById('start-btn');
  const navButtons = document.querySelectorAll('.nav-btn');
  const appSections = document.querySelectorAll('.app-section');

  startBtn.addEventListener('click', () => {
    cover.classList.add('hide');
    isPlaying = true;
    musicToggleBtn.classList.remove('paused');
    startSoftAmbientSynth();
  });

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      appSections.forEach(sec => {
        if (sec.id === targetId) {
          sec.classList.add('active');
        } else {
          sec.classList.remove('active');
        }
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });


  /* ==========================================================================
     4. HERO PHOTO CUSTOMIZER
     ========================================================================== */
  // Always load the latest uploaded hero photo from assets folder
  heroImg.src = `assets/agbelia-lobby.jpg?v=${Date.now()}`;

  // Load saved hero image only if user uploaded dynamically in session
  const savedHero = localStorage.getItem('agbelia_hero_img_custom');
  if (savedHero) {
    heroImg.src = savedHero;
  }

  heroPhotoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        heroImg.src = dataUrl;
        localStorage.setItem('agbelia_hero_img_custom', dataUrl);
        showToast('✨ Foto utama berhasil diperbarui!');
      };
      reader.readAsDataURL(file);
    }
  });


  /* ==========================================================================
     5. MEMORY GALLERY & POLAROID GRID
     ========================================================================== */
  const photoGrid = document.getElementById('photo-grid');
  const addPhotoBtn = document.getElementById('add-photo-btn');
  const resetGalleryBtn = document.getElementById('reset-gallery-btn');
  const galleryFileInput = document.getElementById('gallery-file-input');

  const defaultPolaroids = [
    { title: "Agbelia ke-4 Tahun 🎂", image: "assets/agbelia-childhood.jpg" },
    { title: "Anggun & Elegan 🌷", image: "assets/agbelia-lobby.jpg" },
    { title: "Petualangan Laut 🌊", image: "assets/agbelia-snorkeling.jpg" },
    { title: "Senja di Pantai ☀️", image: "assets/agbelia-beach.jpg" }
  ];

  let currentGalleryCards = defaultPolaroids;
  let targetCardIndexToUpdate = null;

  function renderGallery() {
    photoGrid.innerHTML = '';
    currentGalleryCards.forEach((card, idx) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'polaroid-card';
      
      const imgSrc = card.image || 'assets/calla-lily-hero.jpg';

      cardEl.innerHTML = `
        <div class="polaroid-frame" data-index="${idx}">
          <img src="${imgSrc}" alt="${card.title}">
        </div>
        <div class="polaroid-caption-area">
          <div class="polaroid-caption-text" contenteditable="true" data-index="${idx}">${card.title}</div>
          <div class="polaroid-actions">
            <button class="btn-card-action btn-change-img" data-index="${idx}">📷 Ganti Foto</button>
            <button class="btn-card-action btn-del-img" data-index="${idx}">🗑️ Hapus</button>
          </div>
        </div>
      `;
      photoGrid.appendChild(cardEl);
    });

    // Attach Event Listeners
    document.querySelectorAll('.polaroid-frame').forEach(frame => {
      frame.addEventListener('click', (e) => {
        const idx = e.currentTarget.getAttribute('data-index');
        openLightbox(currentGalleryCards[idx].image || 'assets/calla-lily-hero.jpg', currentGalleryCards[idx].title);
      });
    });

    document.querySelectorAll('.btn-change-img').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        targetCardIndexToUpdate = parseInt(btn.getAttribute('data-index'));
        galleryFileInput.click();
      });
    });

    document.querySelectorAll('.btn-del-img').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-index'));
        currentGalleryCards.splice(idx, 1);
        saveAndRenderGallery();
        showToast('Kartu foto dihapus');
      });
    });

    document.querySelectorAll('.polaroid-caption-text').forEach(textEl => {
      textEl.addEventListener('blur', (e) => {
        const idx = parseInt(textEl.getAttribute('data-index'));
        currentGalleryCards[idx].title = textEl.textContent.trim();
        saveGallery();
      });
    });
  }

  function saveGallery() {
    localStorage.setItem('agbelia_gallery_cards', JSON.stringify(currentGalleryCards));
  }

  function saveAndRenderGallery() {
    saveGallery();
    renderGallery();
  }

  galleryFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        if (targetCardIndexToUpdate !== null) {
          currentGalleryCards[targetCardIndexToUpdate].image = dataUrl;
          targetCardIndexToUpdate = null;
        } else {
          currentGalleryCards.push({
            title: `Kenangan Baru ✨`,
            image: dataUrl
          });
        }
        saveAndRenderGallery();
        showToast('📷 Foto galeri diperbarui!');
      };
      reader.readAsDataURL(file);
    }
  });

  addPhotoBtn.addEventListener('click', () => {
    targetCardIndexToUpdate = null;
    galleryFileInput.click();
  });

  resetGalleryBtn.addEventListener('click', () => {
    if (confirm('Kembalikan susunan foto ke preset awal?')) {
      currentGalleryCards = defaultPolaroids;
      saveAndRenderGallery();
      showToast('Galeri direset ke awal');
    }
  });

  renderGallery();


  /* ==========================================================================
     6. LIGHTBOX MODAL
     ========================================================================== */
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(src, caption) {
    lightboxImg.src = src;
    lightboxCaption.textContent = caption;
    lightboxModal.style.display = 'flex';
  }

  lightboxClose.addEventListener('click', () => {
    lightboxModal.style.display = 'none';
  });

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.style.display = 'none';
    }
  });


  /* ==========================================================================
     7. COPY LETTER FEATURE
     ========================================================================== */
  const letterDisplay = document.getElementById('letter-content-display');
  const copyLetterBtn = document.getElementById('copy-letter-btn');

  if (copyLetterBtn && letterDisplay) {
    copyLetterBtn.addEventListener('click', () => {
      const textToCopy = letterDisplay.innerText;
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('📋 Teks doa & ucapan berhasil disalin!');
      }).catch(() => {
        showToast('Gagal menyalin teks');
      });
    });
  }


  /* ==========================================================================
     8. TOAST NOTIFICATIONS
     ========================================================================== */
  const toast = document.getElementById('toast');
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

});
