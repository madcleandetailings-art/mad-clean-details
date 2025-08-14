// script.js

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const bookingForm = document.getElementById('booking-form');
  const formMessage = document.getElementById('form-message');

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
      const requiredFields = ['name', 'email', 'phone', 'vehicle', 'service', 'date', 'time'];
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
      // Show success message
      formMessage.textContent = 'Thank you! Your booking request has been received. We will contact you shortly to confirm.';
      formMessage.style.color = '#052d56';
      // Reset form
      bookingForm.reset();
    });
  }
});