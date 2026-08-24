/**
 * Blissful Bumps — Shared member data & storage
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

function bbGetProgress() {
  try { return JSON.parse(localStorage.getItem(BB.progressKey)) || {}; }
  catch (e) { return {}; }
}

function bbSaveProgress(p) {
  localStorage.setItem(BB.progressKey, JSON.stringify(p));
}
