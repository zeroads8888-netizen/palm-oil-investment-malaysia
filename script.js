const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const snapshot = document.querySelector('.market-snapshot');

if (snapshot) {
  const overlay = snapshot.querySelector('.snapshot-hover');
  const crosshair = snapshot.querySelector('.snapshot-crosshair');
  const dot = snapshot.querySelector('.snapshot-dot');
  const tooltip = snapshot.querySelector('.snapshot-tooltip');
  const prices = [4640,4648,4657,4664,4669,4671,4668,4670,4666,4674,4677,4668,4661,4668,4672,4682,4679,4681,4673,4669,4671,4668,4665];

  const formatTime = (ratio) => {
    const morningShare = 120 / 260;
    let totalMinutes;
    if (ratio <= morningShare) totalMinutes = 630 + (ratio / morningShare) * 120;
    else totalMinutes = 870 + ((ratio - morningShare) / (1 - morningShare)) * 140;
    const rounded = Math.round(totalMinutes / 5) * 5;
    return `${String(Math.floor(rounded / 60)).padStart(2, '0')}:${String(rounded % 60).padStart(2, '0')}`;
  };

  snapshot.addEventListener('pointermove', (event) => {
    const box = overlay.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) {
      snapshot.classList.remove('is-hovering');
      return;
    }
    const ratio = Math.max(0, Math.min(1, (event.clientX - box.left) / box.width));
    const position = ratio * (prices.length - 1);
    const index = Math.floor(position);
    const next = Math.min(prices.length - 1, index + 1);
    const price = Math.round(prices[index] + (prices[next] - prices[index]) * (position - index));
    const x = ratio * 100;
    const y = (1 - (price - 4638) / 46) * 76 + 7;
    snapshot.classList.add('is-hovering');
    crosshair.style.left = `${x}%`;
    dot.style.left = `${x}%`; dot.style.top = `${y}%`;
    tooltip.style.left = `${x}%`; tooltip.style.top = `${y}%`;
    tooltip.style.transform = x > 78 ? 'translate(calc(-100% - 14px), 18px)' : 'translate(14px, 18px)';
    tooltip.innerHTML = `<strong>${price.toLocaleString('en-MY')}</strong><small>30 Okt '26<br>${formatTime(ratio)} UTC+8</small>`;
  });
  snapshot.addEventListener('pointerleave', () => snapshot.classList.remove('is-hovering'));
}

