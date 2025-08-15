// script.js

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const bookingForm = document.getElementById('booking-form');
  const formMessage = document.getElementById('form-message');

  /* ===============================
   * Package & add‑ons data
   * Each package includes a title, description, features, image and pricing.
   */
  const packages = {
    'Bronze – Exterior Only': {
      title: 'Bronze – Exterior Only',
      description: 'Exterior Only – Hand washed and dried, premium wheel and body products, pre‑wash shampoo and windows cleaned inside and out.',
      features: [
        'Hand washed and dried by hand',
        'Pre‑wash foam & shampoo to loosen heavy grime',
        'Premium wheel & tire deep clean with specialized products',
        'Windows and mirrors cleaned inside and out'
      ],
      image: '',
      priceSedan: 50,
      priceSUV: 70
    },
    'Silver – Interior Only': {
      title: 'Silver – Interior Only',
      description: 'Interior Only – Comprehensive interior clean including vacuum, shampoo & extraction, door jambs and cup holders, plus leather conditioning where applicable.',
      features: [
        'Vacuum carpets and seats thoroughly',
        'Shampoo & hot‑water extraction to lift dirt and stains',
        'Door jambs, cup holders and hard surfaces cleaned and sanitised',
        'Leather conditioning (if applicable); no exterior polish or wax'
      ],
      image: '',
      priceSedan: 150,
      priceSUV: 180
    },
    'Gold – Inside & Out': {
      title: 'Gold – Inside & Out',
      description: 'Inside & Out – Our complete package combining Bronze & Silver services with an added wax & paint sealant for long‑lasting protection.',
      features: [
        'Includes all Bronze & Silver services',
        'Wax & paint sealant (protects paint for 3–6 months)',
        'Light exterior polish',
        'Door jambs & cup holders cleaned'
      ],
      image: '',
      priceSedan: 180,
      priceSUV: 230,
      oldPrice: 200
    }
  };

  const addonsData = [
    { id: 'headlight', label: 'Headlight Restoration', price: 30 },
    { id: 'clay', label: 'Clay Bar Treatment', price: 50 },
    { id: 'spray', label: 'Spray Wax', price: 25 },
    { id: 'sealant', label: 'Paint Sealant', price: 60 }
  ];

  // Helper to populate add‑ons inside the modal
  function renderModalAddons(container) {
    container.innerHTML = '';
    addonsData.forEach((addon) => {
      const label = document.createElement('label');
      label.textContent = `${addon.label} ($${addon.price})`;
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `modal-addon-${addon.id}`;
      checkbox.dataset.price = addon.price;
      checkbox.value = addon.label;
      label.prepend(checkbox);
      container.appendChild(label);
    });
  }

  // Modal elements
  const modal = document.getElementById('package-modal');
  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-description');
  const modalFeatures = document.getElementById('modal-features');
  const modalPrice = document.getElementById('modal-price');
  const modalAddons = document.getElementById('modal-addons');
  const modalBookBtn = document.getElementById('modal-book-btn');
  const modalClose = document.getElementById('close-modal');

  // Load embedded base64 images from JSON and set hero and package visuals
  fetch('embedded_images2.json')
    .then(response => response.json())
    .then(images => {
      // Apply hero background
      const heroSection = document.querySelector('.hero');
      if (heroSection && images.hero) {
        heroSection.style.backgroundImage = `url('data:image/jpeg;base64,${images.hero}')`;
        heroSection.style.backgroundSize = 'cover';
        heroSection.style.backgroundPosition = 'center';
      }
      // Update package images
      if (images.exterior) {
        if (packages['Bronze – Exterior Only']) {
          packages['Bronze – Exterior Only'].image = `data:image/jpeg;base64,${images.exterior}`;
        }
        if (packages['Gold – Inside & Out']) {
          packages['Gold – Inside & Out'].image = `data:image/jpeg;base64,${images.exterior}`;
        }
      }
      if (images.hero) {
        if (packages['Silver – Interior Only']) {
          packages['Silver – Interior Only'].image = `data:image/jpeg;base64,${images.hero}`;
        }
      }
    })
    .catch(error => {
      console.error('Error loading embedded images:', error);
    });

  // Show package modal with details
  function openPackageModal(pkgName) {
    const pkg = packages[pkgName];
    if (!pkg) return;
    // Only set the modal image if it exists and an image is provided
    if (modalImage) {
      if (pkg.image) {
        modalImage.src = pkg.image;
        modalImage.style.display = 'block';
      } else {
        modalImage.style.display = 'none';
      }
    }
    modalTitle.textContent = pkg.title;
    modalDesc.textContent = pkg.description;
    // Populate features
    modalFeatures.innerHTML = '';
    pkg.features.forEach((feat) => {
      const li = document.createElement('li');
      li.textContent = feat;
      modalFeatures.appendChild(li);
    });
    // Set price string
    let priceText = '';
    if (pkg.oldPrice) {
      priceText = `<span class="old-price">$${pkg.oldPrice}</span> $${pkg.priceSedan} (Sedan) / $${pkg.priceSUV} (SUV)`;
    } else {
      priceText = `$${pkg.priceSedan} (Sedan) / $${pkg.priceSUV} (SUV)`;
    }
    modalPrice.innerHTML = priceText;
    // Render add‑ons checkboxes
    renderModalAddons(modalAddons);
    // Store current package on button for later
    modalBookBtn.dataset.package = pkgName;
    // Show modal
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closePackageModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  // Event listeners for service cards
  document.querySelectorAll('.service-card').forEach((card) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const heading = card.querySelector('h3');
      if (heading) {
        const pkgName = heading.textContent.trim();
        openPackageModal(pkgName);
      }
    });
  });

  // Close modal on clicking X or outside content
  modalClose.addEventListener('click', closePackageModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closePackageModal();
    }
  });

  // Handle booking from modal
  modalBookBtn.addEventListener('click', () => {
    const pkgName = modalBookBtn.dataset.package;
    // Set selected package in booking form
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) {
      // Find option by text content
      Array.from(serviceSelect.options).forEach((opt) => {
        if (opt.textContent.includes(pkgName.split('–')[0].trim())) {
          opt.selected = true;
        }
      });
    }
    // Copy selected add‑ons to booking form
    addonsData.forEach((addon) => {
      const modalCheckbox = document.getElementById(`modal-addon-${addon.id}`);
      const formCheckbox = document.getElementById(`addon-${addon.id}`);
      if (modalCheckbox && formCheckbox) {
        formCheckbox.checked = modalCheckbox.checked;
      }
    });
    // Update price summary
    updatePriceSummary();
    // Scroll to booking form
    if (bookingForm) {
      bookingForm.scrollIntoView({ behavior: 'smooth' });
    }
    closePackageModal();
  });

  /* Price calculation logic
   * Computes the estimated total for a sedan based on selected package and add‑ons.
   */
  function updatePriceSummary() {
    const serviceSelect = document.getElementById('service');
    const summaryEl = document.getElementById('price-summary');
    if (!serviceSelect || !summaryEl) return;
    const selectedOption = serviceSelect.value;
    let basePrice = 0;
    if (selectedOption && packages[selectedOption]) {
      // Determine vehicle type: SUV/truck vs sedan
      const vehicleTypeSelect = document.getElementById('vehicle-type');
      const vehicleType = vehicleTypeSelect ? vehicleTypeSelect.value : 'Sedan';
      if (vehicleType && vehicleType.toLowerCase().startsWith('suv')) {
        basePrice = packages[selectedOption].priceSUV;
      } else {
        basePrice = packages[selectedOption].priceSedan;
      }
    }
    let addonsTotal = 0;
    addonsData.forEach((addon) => {
      const checkbox = document.getElementById(`addon-${addon.id}`);
      if (checkbox && checkbox.checked) {
        addonsTotal += addon.price;
      }
    });
    const total = basePrice + addonsTotal;
    summaryEl.textContent = `$${total}`;
  }

  // Attach change listeners to package select and add‑on checkboxes
  const serviceSelect = document.getElementById('service');
  if (serviceSelect) {
    serviceSelect.addEventListener('change', updatePriceSummary);
  }
  addonsData.forEach((addon) => {
    const checkbox = document.getElementById(`addon-${addon.id}`);
    if (checkbox) {
      checkbox.addEventListener('change', updatePriceSummary);
    }
  });

  // Update price summary when vehicle type changes
  const vehicleTypeSelect = document.getElementById('vehicle-type');
  if (vehicleTypeSelect) {
    vehicleTypeSelect.addEventListener('change', updatePriceSummary);
  }


  // Toggle mobile navigation
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
  }

  // Handle form submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (event) => {
      event.preventDefault();
      // Simple front‑end validation: ensure required fields are filled
      const requiredFields = ['name', 'email', 'phone', 'vehicle-type', 'service', 'date', 'time'];
      let valid = true;
      requiredFields.forEach((id) => {
        const input = document.getElementById(id);
        if (!input || !input.value.trim()) {
          valid = false;
          input.classList.add('error');
        } else {
          input.classList.remove('error');
        }
      });
      if (!valid) {
        formMessage.textContent = 'Please complete all required fields.';
        formMessage.style.color = '#c0392b';
        return;
      }
      // Gather form data for email/sms
      const name = document.getElementById('name').value.trim();
      const emailVal = document.getElementById('email').value.trim();
      const phoneVal = document.getElementById('phone').value.trim();
      const vehicleVal = document.getElementById('vehicle-type').value;
      const serviceVal = document.getElementById('service').value;
      const dateVal = document.getElementById('date').value;
      const timeVal = document.getElementById('time').value;
      const notesVal = document.getElementById('notes') ? document.getElementById('notes').value.trim() : '';
      // Compile selected add‑ons
      let selectedAddons = [];
      addonsData.forEach((addon) => {
        const chk = document.getElementById(`addon-${addon.id}`);
        if (chk && chk.checked) {
          selectedAddons.push(addon.label);
        }
      });
      // Build message body
      let body = `Name: ${name}%0D%0AEmail: ${emailVal}%0D%0APhone: ${phoneVal}%0D%0AVehicle Type: ${vehicleVal}%0D%0APackage: ${serviceVal}%0D%0AAdd‑Ons: ${selectedAddons.join(', ') || 'None'}%0D%0ADate: ${dateVal}%0D%0ATime: ${timeVal}%0D%0ANotes: ${notesVal}`;
      // Encode URI components
      const mailtoLink = `mailto:madclean.detailings@gmail.com?subject=${encodeURIComponent('New Detailing Booking')}&body=${body}`;
      // Compose SMS link for 6518906856 (may open on devices with SMS apps)
      const smsLink = `sms:6518906856?body=${body}`;
      // Open email and sms links
      window.open(mailtoLink);
      window.open(smsLink);
      // Show success message
      formMessage.textContent = 'Thank you! Your booking request has been sent via email/text. We will contact you shortly to confirm.';
      formMessage.style.color = '#052d56';
      // Reset form
      bookingForm.reset();
      // Hide success message after a few seconds
      setTimeout(() => {
        formMessage.textContent = '';
      }, 6000);
    });
  }

  // Initialize price summary on load
  updatePriceSummary();

  /* Scroll to top button functionality */
  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 500) {
        scrollTopBtn.style.display = 'flex';
      } else {
        scrollTopBtn.style.display = 'none';
      }
    });
    // Scroll smoothly to top when clicked
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});