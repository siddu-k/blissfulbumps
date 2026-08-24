/**
 * Blissful Bumps — Member Login (temporary demo auth)
 */

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const errorBox = document.getElementById('auth-error');
  const pwToggle = document.getElementById('pw-toggle');

  pwToggle.addEventListener('click', () => {
    const show = passwordInput.type === 'password';
    passwordInput.type = show ? 'text' : 'password';
    pwToggle.textContent = show ? 'Hide' : 'Show';
  });

  const showError = (msg) => {
    errorBox.textContent = msg;
    errorBox.hidden = false;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorBox.hidden = true;

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('Please enter a valid email address.');
      return;
    }
    if (password.length < 4) {
      showError('Password must be at least 4 characters.');
      return;
    }

    // Temporary demo auth — any valid email + 4+ char password works.
    // Replace with a real API check later.
    const namePart = email.split('@')[0].replace(/[._-]+/g, ' ').trim();
    const name = namePart
      ? namePart.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      : 'Mom';

    localStorage.setItem('bb_user', JSON.stringify({ name, email }));
    window.location.href = 'courses.html';
  });

});
