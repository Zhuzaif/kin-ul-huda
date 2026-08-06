export interface HeartFlyOptions {
  duration?: number;
}

const HEART_PATH = 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z';

let overlay: HTMLElement | null = null;
let stylesInjected = false;

function injectStyles() {
  if (stylesInjected) return;
  const style = document.createElement('style');
  style.innerHTML = `
    #flyOverlay { position: fixed; inset: 0; pointer-events: none; z-index: 9999; }
    .fly-heart {
      position: fixed; left: 0; top: 0;
      color: var(--color-theme-rose, #e8919a);
      filter: drop-shadow(0 0 10px rgba(232, 145, 154, .85)) drop-shadow(0 2px 4px rgba(0,0,0,.35));
      pointer-events: none;
      will-change: transform, opacity;
    }
    .fly-heart svg path { fill: currentColor; }
    .ghost-heart {
      position: fixed; left: 0; top: 0;
      color: var(--color-theme-rose, #e8919a);
      pointer-events: none;
      filter: blur(.3px);
    }
    .fly-ring {
      position: fixed; left: 0; top: 0;
      width: 44px; height: 44px; margin-left: -22px; margin-top: -22px;
      border-radius: 50%;
      border: 1.5px solid var(--ring-color, var(--color-theme-rose, #e8919a));
      box-shadow: 0 0 16px 0 var(--ring-color, var(--color-theme-rose, #e8919a));
      pointer-events: none;
    }
    .fly-sparkle {
      position: fixed; left: 0; top: 0;
      margin-left: -3px; margin-top: -3px;
      border-radius: 50%;
      background: radial-gradient(circle, #FFE9BE 0%, var(--color-theme-gold, #C9A66B) 60%, transparent 100%);
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);
  stylesInjected = true;
}

function getOverlay() {
  if (!overlay) {
    overlay = document.getElementById('flyOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'flyOverlay';
      const root = document.getElementById('mobile-frame-root') || document.body;
      root.appendChild(overlay);
    }
  }
  return overlay;
}

function centerOf(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

function elasticPop(el: HTMLElement, big: boolean) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;
  const mid = big ? 1.55 : 1.4;
  el.animate(
    [
      { transform: 'scale(1)' },
      { transform: `scale(${mid})`, offset: 0.4 },
      { transform: 'scale(.88)', offset: 0.65 },
      { transform: 'scale(1.08)', offset: 0.85 },
      { transform: 'scale(1)' }
    ],
    { duration: 620, easing: 'cubic-bezier(.22,.9,.32,1)' }
  );
}

function spawnRing(center: { x: number, y: number }, color?: string) {
  const ov = getOverlay();
  const ring = document.createElement('div');
  ring.className = 'fly-ring';
  ring.style.left = center.x + 'px';
  ring.style.top = center.y + 'px';
  if (color) ring.style.setProperty('--ring-color', color);
  ov.appendChild(ring);
  const anim = ring.animate(
    [
      { transform: 'scale(.5)', opacity: 0.7 },
      { transform: 'scale(2.3)', opacity: 0 }
    ],
    { duration: 650, easing: 'cubic-bezier(.16,.8,.3,1)' }
  );
  anim.onfinish = () => ring.remove();
}

function spawnSparkles(center: { x: number, y: number }) {
  const ov = getOverlay();
  const n = 8;
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i / n) + (Math.random() * 0.5 - 0.25);
    const dist = 24 + Math.random() * 22;
    const size = 4 + Math.random() * 4;
    const sp = document.createElement('div');
    sp.className = 'fly-sparkle';
    sp.style.width = size + 'px';
    sp.style.height = size + 'px';
    sp.style.left = center.x + 'px';
    sp.style.top = center.y + 'px';
    ov.appendChild(sp);
    
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    
    const anim = sp.animate(
      [
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${dx}px,${dy}px) scale(0)`, opacity: 0 }
      ],
      { duration: 520 + Math.random() * 180, easing: 'cubic-bezier(.16,.8,.3,1)' }
    );
    anim.onfinish = () => sp.remove();
  }
}

function quadPoint(p0: { x: number, y: number }, p1: { x: number, y: number }, p2: { x: number, y: number }, t: number) {
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y
  };
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function heartFly(sourceEl: HTMLElement, targetEl: HTMLElement, opts: HeartFlyOptions = {}) {
  injectStyles();
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = opts.duration || 780;
  
  const start = centerOf(sourceEl);
  const end = centerOf(targetEl);
  const ov = getOverlay();

  spawnRing(start, 'var(--color-theme-gold)');
  spawnSparkles(start);

  if (prefersReduced) {
    targetEl.style.color = 'var(--color-theme-rose)';
    spawnRing(end, 'var(--color-theme-rose)');
    setTimeout(() => { targetEl.style.color = ''; }, 500);
    return;
  }

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dist = Math.hypot(dx, dy) || 1;
  const bend = Math.min(150, dist * 0.5);
  const ctrl = {
    x: start.x + dx * 0.5 + bend,
    y: start.y + dy * 0.5 - bend * 0.55
  };

  const dot = document.createElement('div');
  dot.className = 'fly-heart';
  dot.style.width = '22px';
  dot.style.height = '22px';
  dot.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22"><path d="${HEART_PATH}" fill="currentColor"/></svg>`;
  ov.appendChild(dot);

  let startTime: number | null = null;
  let lastGhost = 0;

  function spawnGhost(pt: { x: number, y: number }, scale: number, t: number) {
    const g = document.createElement('div');
    g.className = 'ghost-heart';
    const s = 15 * scale;
    g.style.width = s + 'px';
    g.style.height = s + 'px';
    g.style.opacity = String(0.5 * (1 - t * 0.4));
    g.innerHTML = `<svg viewBox="0 0 24 24" width="${s}" height="${s}"><path d="${HEART_PATH}" fill="currentColor"/></svg>`;
    g.style.transform = `translate(${pt.x - s / 2}px,${pt.y - s / 2}px)`;
    ov.appendChild(g);
    const anim = g.animate(
      [
        { opacity: g.style.opacity, filter: 'blur(0px)' },
        { opacity: 0, filter: 'blur(3px)' }
      ],
      { duration: 380, easing: 'ease-out' }
    );
    anim.onfinish = () => g.remove();
  }

  function frame(now: number) {
    if (startTime === null) startTime = now;
    const t = Math.min(1, (now - startTime) / duration);
    const eased = easeInOutCubic(t);
    const pt = quadPoint(start, ctrl, end, eased);
    const scale = 1.15 - eased * 0.65;
    const flutter = Math.sin(t * Math.PI * 5) * 12;

    dot.style.transform = `translate(${pt.x - 11}px,${pt.y - 11}px) rotate(${flutter}deg) scale(${scale})`;
    dot.style.opacity = String(1 - Math.max(0, eased - 0.82) / 0.18);

    if (now - lastGhost > 30 && t < 0.92) {
      lastGhost = now;
      spawnGhost(pt, scale, t);
    }

    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      dot.remove();
      elasticPop(targetEl, true);
      const originalColor = targetEl.style.color;
      targetEl.style.color = 'var(--color-theme-rose)';
      spawnRing(end, 'var(--color-theme-rose)');
      spawnSparkles(end);
      setTimeout(() => { targetEl.style.color = originalColor; }, 550);
    }
  }
  
  requestAnimationFrame(frame);
}
