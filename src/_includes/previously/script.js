// Image lazy loading
const observer = new IntersectionObserver(entries => {
  for (const { isIntersecting, target } of entries) {
    if (isIntersecting === false) continue;
    target.src = target.dataset.src;
    target.style.opacity = 1;
    observer.unobserve(target);
  }
});

const imgs = document.currentScript.parentNode.querySelectorAll(
  'img[data-src]',
);
for (const img of imgs) observer.observe(img);
