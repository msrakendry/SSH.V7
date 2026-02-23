// ============================================
// TOUCH DEVICE DETECTION AND HANDLING
// ============================================
(function handleTouchDevices() {
  // Detect if touch device
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (isTouchDevice) {
    document.body.classList.add('touch-device');

    // Prevent double-tap zoom on buttons
    const buttons = document.querySelectorAll('button, .dropdown-toggle');
    buttons.forEach(button => {
      button.addEventListener('touchend', function (e) {
        e.preventDefault();
        this.click();
      });
    });
  }
})();

// ============================================
// FULL-SCREEN MOBILE MENU OVERLAY
// ============================================
function initMobileMenuOverlay() {
  const menuTrigger = document.getElementById('menu-trigger');

  if (!menuTrigger) return;

  // Create overlay structure on first click for mobile devices
  let overlay = document.getElementById('mobile-menu-overlay');

  menuTrigger.addEventListener('click', function (e) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      e.stopPropagation();

      // Create overlay if it doesn't exist
      if (!overlay) {
        overlay = createMobileMenuOverlay();
        document.body.appendChild(overlay);
      }

      // Toggle overlay
      overlay.classList.toggle('active');
      document.body.classList.toggle('mobile-menu-open');
    }
  });
}

function createMobileMenuOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'mobile-menu-overlay';
  overlay.className = 'mobile-menu-overlay';

  overlay.innerHTML = `
    <div class="mobile-menu-header">
      <div class="mobile-menu-title">SSH MENU</div>
      <button class="mobile-menu-close" aria-label="Close menu">×</button>
    </div>
    <div class="mobile-menu-content">
      <!-- Livelihood Category -->
      <div class="mobile-category-item">
        <button class="mobile-category-title" data-category="livelihood">Livelihood</button>
        <div class="mobile-subcategory">
          <div class="mobile-section-header">OUR WORK</div>
          <ul class="mobile-subcategory-list">
            <li class="mobile-subcategory-item"><a href="#livelihood" class="mobile-subcategory-link">Economic Empowerment</a></li>
            <li class="mobile-subcategory-item"><a href="#livelihood" class="mobile-subcategory-link">Women Programs</a></li>
            <li class="mobile-subcategory-item"><a href="#livelihood" class="mobile-subcategory-link">SME Support</a></li>
          </ul>
        </div>
      </div>
      
      <!-- Water Category -->
      <div class="mobile-category-item">
        <button class="mobile-category-title" data-category="water">Water</button>
        <div class="mobile-subcategory">
          <div class="mobile-section-header">OUR WORK</div>
          <ul class="mobile-subcategory-list">
            <li class="mobile-subcategory-item"><a href="#water" class="mobile-subcategory-link">Clean Water</a></li>
            <li class="mobile-subcategory-item"><a href="#water" class="mobile-subcategory-link">WASH Programs</a></li>
            <li class="mobile-subcategory-item"><a href="#water" class="mobile-subcategory-link">Infrastructure</a></li>
          </ul>
        </div>
      </div>
      
      <!-- Education Category -->
      <div class="mobile-category-item">
        <button class="mobile-category-title" data-category="education">Education</button>
        <div class="mobile-subcategory">
          <div class="mobile-section-header">OUR WORK</div>
          <ul class="mobile-subcategory-list">
            <li class="mobile-subcategory-item"><a href="#education" class="mobile-subcategory-link">Basic Education</a></li>
            <li class="mobile-subcategory-item"><a href="#education" class="mobile-subcategory-link">Digital Learning</a></li>
            <li class="mobile-subcategory-item"><a href="#education" class="mobile-subcategory-link">Teacher Training</a></li>
          </ul>
        </div>
      </div>
      
      <!-- Power Category -->
      <div class="mobile-category-item">
        <button class="mobile-category-title" data-category="power">Power</button>
        <div class="mobile-subcategory">
          <div class="mobile-section-header">OUR WORK</div>
          <ul class="mobile-subcategory-list">
            <li class="mobile-subcategory-item"><a href="#energy" class="mobile-subcategory-link">Solar Energy</a></li>
            <li class="mobile-subcategory-item"><a href="#energy" class="mobile-subcategory-link">Renewable Systems</a></li>
            <li class="mobile-subcategory-item"><a href="#energy" class="mobile-subcategory-link">Community Power</a></li>
          </ul>
        </div>
      </div>
    </div>
  `;

  // Close button handler
  const closeBtn = overlay.querySelector('.mobile-menu-close');
  closeBtn.addEventListener('click', function () {
    overlay.classList.remove('active');
    document.body.classList.remove('mobile-menu-open');
  });

  // Category toggle handlers
  const categoryTitles = overlay.querySelectorAll('.mobile-category-title');
  categoryTitles.forEach(title => {
    title.addEventListener('click', function () {
      const subcategory = this.nextElementSibling;

      // Toggle current
      this.classList.toggle('expanded');
      subcategory.classList.toggle('expanded');

      // Close others
      categoryTitles.forEach(otherTitle => {
        if (otherTitle !== this) {
          otherTitle.classList.remove('expanded');
          otherTitle.nextElementSibling.classList.remove('expanded');
        }
      });
    });
  });

  // Close on link click
  const links = overlay.querySelectorAll('.mobile-subcategory-link');
  links.forEach(link => {
    link.addEventListener('click', function () {
      overlay.classList.remove('active');
      document.body.classList.remove('mobile-menu-open');
    });
  });

  // Close on overlay background click
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      document.body.classList.remove('mobile-menu-open');
    }
  });

  // Close on escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      overlay.classList.remove('active');
      document.body.classList.remove('mobile-menu-open');
    }
  });

  return overlay;
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function () {
  initMobileMenuOverlay();
});
