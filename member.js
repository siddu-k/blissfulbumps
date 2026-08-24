/**
 * Blissful Bumps — Courses Dashboard
 * Progress, streaks, feedback and support (all stored locally for now).
 */

const BB = {
  userKey: 'bb_user',
  progressKey: 'bb_progress',
  streakKey: 'bb_streak',
  videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
};

const COURSES = [
  {
    id: 'prenatal-flow',
    title: 'Prenatal Gentle Flow',
    level: 'All Trimesters',
    image: 'assets/flow.jpg',
    lessons: [
      { name: 'Welcome & Safety Basics', dur: '8 min' },
      { name: 'Morning Warm-up Flow', dur: '15 min' },
      { name: 'Hip Opening & Back Care', dur: '18 min' },
      { name: 'Pelvic Floor Strengthening', dur: '14 min' },
      { name: 'Full Prenatal Flow Practice', dur: '25 min' }
    ]
  },
  {
    id: 'restorative',
    title: 'Deep Relax & Breathing',
    level: 'Best in 3rd Trimester',
    image: 'assets/restorative.jpg',
    lessons: [
      { name: 'Supported Rest Postures', dur: '12 min' },
      { name: 'Breathing for Labor', dur: '16 min' },
      { name: 'Calming the Nervous System', dur: '14 min' },
      { name: 'Night Relaxation Practice', dur: '20 min' }
    ]
  },
  {
    id: 'partner-prep',
    title: 'Partner Birth Prep',
    level: '2nd & 3rd Trimesters',
    image: 'assets/partner.jpg',
    lessons: [
      { name: 'Massage Techniques', dur: '18 min' },
      { name: 'Support Positions for Labor', dur: '15 min' },
      { name: 'Breathing Together', dur: '12 min' },
      { name: 'The Big Day Plan', dur: '10 min' }
    ]
  },
  {
    id: 'postnatal',
    title: 'Postnatal & Baby Yoga',
    level: '6 Weeks Postpartum +',
    image: 'assets/postnatal.jpg',
    lessons: [
      { name: 'Gentle Core Reconnect', dur: '14 min' },
      { name: 'Neck & Back Relief', dur: '12 min' },
      { name: 'Baby Bonding Movements', dur: '15 min' },
      { name: 'Full Recovery Flow', dur: '22 min' }
    ]
  }
];

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

  /* ---------- Storage helpers ---------- */
  const getProgress = () => {
    try { return JSON.parse(localStorage.getItem(BB.progressKey)) || {}; }
    catch (e) { return {}; }
  };

  const saveProgress = (p) => localStorage.setItem(BB.progressKey, JSON.stringify(p));

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

  /* ---------- Courses render ---------- */
  const coursesList = document.getElementById('courses-list');

  const renderCourses = () => {
    const progress = getProgress();
    coursesList.innerHTML = '';

    COURSES.forEach((course) => {
      const done = (progress[course.id] || []);
      const pct = Math.round((done.length / course.lessons.length) * 100);

      const card = document.createElement('div');
      card.className = 'course-card';
      card.innerHTML = `
        <div class="course-top">
          <img src="${course.image}" alt="${course.title}">
          <div class="course-info">
            <h3>${course.title}</h3>
            <div class="course-meta">${course.level} · ${course.lessons.length} lessons</div>
            <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
            <span class="progress-label">${pct}% complete</span>
          </div>
        </div>
        <div class="lesson-list"></div>
      `;

      const list = card.querySelector('.lesson-list');
      course.lessons.forEach((lesson, i) => {
        const row = document.createElement('button');
        row.type = 'button';
        row.className = 'lesson-row' + (done.includes(i) ? ' done' : '');
        row.innerHTML = `
          <span class="lesson-num">${done.includes(i) ? '✓' : i + 1}</span>
          <span class="lesson-name">${lesson.name}</span>
          <span class="lesson-dur">${lesson.dur}</span>
        `;
        row.addEventListener('click', () => openPlayer(course, i));
        list.appendChild(row);
      });

      coursesList.appendChild(card);
    });
  };

  /* ---------- Video player ---------- */
  const overlay = document.getElementById('player-overlay');
  const video = document.getElementById('player-video');
  const playerTitle = document.getElementById('player-title');
  const markDoneBtn = document.getElementById('mark-done');
  let activeCourse = null;
  let activeLesson = -1;

  const openPlayer = (course, idx) => {
    activeCourse = course;
    activeLesson = idx;
    playerTitle.textContent = `${course.title} — ${course.lessons[idx].name}`;
    video.src = BB.videoUrl;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    video.play().catch(() => {});
  };

  const closePlayer = () => {
    overlay.classList.remove('open');
    video.pause();
    video.src = '';
    document.body.style.overflow = '';
  };

  document.getElementById('player-close').addEventListener('click', closePlayer);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePlayer();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closePlayer();
  });

  markDoneBtn.addEventListener('click', () => {
    if (!activeCourse || activeLesson < 0) return;
    const progress = getProgress();
    const done = progress[activeCourse.id] || [];
    if (!done.includes(activeLesson)) {
      done.push(activeLesson);
      progress[activeCourse.id] = done;
      saveProgress(progress);
      renderCourses();
      const pct = Math.round((done.length / activeCourse.lessons.length) * 100);
      toast(pct === 100
        ? `Amazing! You completed "${activeCourse.title}" 🌸`
        : `Lesson complete! "${activeCourse.title}" is now ${pct}% done.`);
    } else {
      toast('This lesson is already marked complete.');
    }
    closePlayer();
  });

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
