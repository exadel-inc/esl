document.body.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (target && target.closest('.gn-back-trigger')) {
    window.history.back();
    e.preventDefault();
    e.stopPropagation();
  }
});

if (window.history.length < 2) {
  Array.from(document.querySelectorAll('.gn-back'))
    .forEach((el) => {
      el.classList.add('d-none');
    });
}
