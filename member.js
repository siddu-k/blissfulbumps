/**
 * Blissful Bumps — Courses Dashboard
 * Module cards open the course page (player + playlist).
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Auth guard ---------- */
  let user;
  try {
    user = JSON.parse(localStorage.getItem(BB.userKey));
  } catch (e) { user = null; }

  if (!user || !user.email) {
    window.location.replace('login.html');
    return;
  }

  /* ---------- User ---------- */
  const firstName = (user.name || 'Mom').split(' ')[0];
  document.getElementById('welcome-name').textContent = firstName;
  document.getElementById('user-name').textContent = firstName;

  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem(BB.userKey);
    window.location.href = 'login.html';
  });

  /* ---------- Toast ---------- */
  const toast = (msg) => {
    const old = document.querySelector('.toast');
    if (old) old.remove();
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 500);
    }, 3500);
  };

  /* ---------- Streak ---------- */
  const todayKey = () => new Date().toISOString().slice(0, 10);

  const updateStreak = () => {
    let s;
    try { s = JSON.parse(localStorage.getItem(BB.streakKey)) || {}; }
    catch (e) { s = {}; }

    const today = todayKey();
    if (s.last !== today) {
      const yest = new Date();
      yest.setDate(yest.getDate() - 1);
      const yestKey = yest.toISOString().slice(0, 10);
      s.count = (s.last === yestKey) ? (s.count || 0) + 1 : 1;
      s.best = Math.max(s.best || 0, s.count);
      s.last = today;
      s.days = Array.from(new Set([...(s.days || []), today]));
      localStorage.setItem(BB.streakKey, JSON.stringify(s));
    }
    return s;
  };

  const streak = updateStreak();
  document.getElementById('streak-count').textContent = streak.count || 0;
  document.getElementById('streak-big').textContent = streak.count || 0;
  document.getElementById('stat-streak').textContent = streak.count || 0;

  const days = streak.days || [];
  const dotBox = document.getElementById('week-dots');
  ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach((label, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    const wrap = document.createElement('div');
    wrap.className = 'day';
    const dot = document.createElement('span');
    dot.className = 'dot' + (days.includes(key) ? ' hit' : '');
    dot.textContent = days.includes(key) ? '🌸' : '';
    wrap.appendChild(dot);
    wrap.insertAdjacentHTML('beforeend', `<span>${label}</span>`);
    dotBox.appendChild(wrap);
  });

  /* ---------- Course modules ---------- */
  const coursesList = document.getElementById('courses-list');

  const updateStats = () => {
    const progress = bbGetProgress();
    let lessons = 0;
    let started = 0;
    COURSES.forEach((c) => {
      const d = progress[c.id] || [];
      lessons += d.length;
      if (d.length > 0) started += 1;
    });
    document.getElementById('stat-lessons').textContent = lessons;
    document.getElementById('stat-courses').textContent = started;
  };

  const renderCourses = () => {
    const progress = bbGetProgress();
    coursesList.innerHTML = '';

    COURSES.forEach((course) => {
      const done = (progress[course.id] || []);
      const pct = Math.round((done.length / course.lessons.length) * 100);

      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'course-card';
      card.setAttribute('aria-label', `Open ${course.title}`);
      card.innerHTML = `
        <span class="thumb-wrap">
          <img class="course-thumb" src="${course.image}" alt="${course.title}">
          <span class="thumb-overlay">Open Course →</span>
        </span>
        <span class="course-body">
          <h3>${course.title}</h3>
          <span class="course-meta">${course.level} · ${course.lessons.length} lessons</span>
          <span class="progress-track"><span class="progress-fill" style="width:${pct}%"></span></span>
          <span class="progress-label">${pct}% complete</span>
        </span>
      `;
      card.addEventListener('click', () => {
        window.location.href = `course.html?id=${course.id}`;
      });

      coursesList.appendChild(card);
    });

    updateStats();
  };

  renderCourses();

  /* ---------- Feedback ---------- */
  const starRow = document.getElementById('star-row');
  const starBtns = starRow.querySelectorAll('button');
  let rating = 0;

  const paintStars = (n) => {
    starBtns.forEach((b, i) => b.classList.toggle('lit', i < n));
  };

  starBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      rating = Number(btn.dataset.star);
      paintStars(rating);
    });
  });

  document.getElementById('feedback-send').addEventListener('click', () => {
    const text = document.getElementById('feedback-text').value.trim();
    if (!rating) {
      toast('Please tap a star to rate first 🌸');
      return;
    }
    const box = { rating, text, date: todayKey() };
    let all = [];
    try { all = JSON.parse(localStorage.getItem('bb_feedback')) || []; }
    catch (e) { all = []; }
    all.push(box);
    localStorage.setItem('bb_feedback', JSON.stringify(all));
    rating = 0;
    paintStars(0);
    document.getElementById('feedback-text').value = '';
    toast('Thank you for your feedback! It helps us improve 💚');
  });

  /* ---------- Support ---------- */
  const waMsg = encodeURIComponent(
    `Namaste! I am ${firstName} (member). I need some help with my yoga practice.`
  );
  document.getElementById('support-wa').href =
    `https://wa.me/917337326686?text=${waMsg}`;

});
