/**
 * Blissful Bumps — Course Page (player + playlist)
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

  const firstName = (user.name || 'Mom').split(' ')[0];
  document.getElementById('user-name').textContent = firstName;

  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem(BB.userKey);
    window.location.href = 'login.html';
  });

  /* ---------- Streak (visit counts too) ---------- */
  const todayKey = () => new Date().toISOString().slice(0, 10);
  let s;
  try { s = JSON.parse(localStorage.getItem(BB.streakKey)) || {}; }
  catch (e) { s = {}; }
  const today = todayKey();
  if (s.last !== today) {
    const yest = new Date();
    yest.setDate(yest.getDate() - 1);
    s.count = (s.last === yest.toISOString().slice(0, 10)) ? (s.count || 0) + 1 : 1;
    s.best = Math.max(s.best || 0, s.count);
    s.last = today;
    s.days = Array.from(new Set([...(s.days || []), today]));
    localStorage.setItem(BB.streakKey, JSON.stringify(s));
  }
  document.getElementById('streak-count').textContent = s.count || 0;

  /* ---------- Course lookup ---------- */
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get('id');
  const course = COURSES.find(c => c.id === courseId);

  if (!course) {
    window.location.replace('courses.html');
    return;
  }

  document.title = `${course.title} | Blissful Bumps`;
  document.getElementById('course-title').textContent = course.title;
  document.getElementById('course-meta').textContent =
    `${course.level} · ${course.lessons.length} lessons`;

  /* ---------- Elements ---------- */
  const video = document.getElementById('course-video');
  const nowTitle = document.getElementById('now-title');
  const nowMeta = document.getElementById('now-meta');
  const markDoneBtn = document.getElementById('mark-done');
  const nextBtn = document.getElementById('next-lesson');
  const plList = document.getElementById('pl-list');
  const plProgress = document.getElementById('pl-progress');
  const plLabel = document.getElementById('pl-label');

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

  let activeIdx = 0;

  const isDone = (idx) => (bbGetProgress()[course.id] || []).includes(idx);

  const refreshPlaylist = () => {
    const done = bbGetProgress()[course.id] || [];
    plList.innerHTML = '';

    course.lessons.forEach((lesson, i) => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className =
        'lesson-row pl-row' + (done.includes(i) ? ' done' : '') + (i === activeIdx ? ' active' : '');
      row.innerHTML = `
        <span class="lesson-num">${done.includes(i) ? '✓' : i + 1}</span>
        <span class="lesson-name">
          ${lesson.name}
          ${i === activeIdx ? '<span class="now-tag">Now Playing</span>' : ''}
        </span>
        <span class="lesson-dur">${lesson.dur}</span>
      `;
      row.addEventListener('click', () => loadLesson(i));
      plList.appendChild(row);
    });

    const pct = Math.round((done.length / course.lessons.length) * 100);
    plProgress.style.width = pct + '%';
    plLabel.textContent = `${pct}% complete`;
  };

  const loadLesson = (idx) => {
    activeIdx = idx;
    const lesson = course.lessons[idx];
    nowTitle.textContent = `${idx + 1}. ${lesson.name}`;
    nowMeta.textContent = `${lesson.dur} · ${isDone(idx) ? 'Completed' : 'Not completed yet'}`;
    video.src = lesson.video || BB.videoUrl;
    video.play().catch(() => {});
    refreshPlaylist();
    const activeRow = plList.querySelector('.pl-row.active');
    if (activeRow) activeRow.scrollIntoView({ block: 'nearest' });
  };

  markDoneBtn.addEventListener('click', () => {
    const progress = bbGetProgress();
    const done = progress[course.id] || [];
    if (!done.includes(activeIdx)) {
      done.push(activeIdx);
      progress[course.id] = done;
      bbSaveProgress(progress);
      refreshPlaylist();
      nowMeta.textContent =
        `${course.lessons[activeIdx].dur} · Completed`;
      const pct = Math.round((done.length / course.lessons.length) * 100);
      toast(pct === 100
        ? `Amazing! You completed "${course.title}" 🌸`
        : `Lesson complete! ${pct}% of the course done.`);
    } else {
      toast('This lesson is already marked complete.');
    }
  });

  nextBtn.addEventListener('click', () => {
    if (activeIdx < course.lessons.length - 1) {
      loadLesson(activeIdx + 1);
    } else {
      toast('This is the last lesson of the course 🌸');
    }
  });

  video.addEventListener('ended', () => {
    if (!isDone(activeIdx)) {
      markDoneBtn.click();
    }
  });

  loadLesson(0);

});
