const disableCallOnNonMobile = () => {
  // タッチデバイスを判定
  const IS_TOUCH_DEVICE = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer:coarse)').matches;

  if (!IS_TOUCH_DEVICE) {
    const telLinks = document.querySelectorAll('a[href^="tel:"]');

    telLinks.forEach((link) => {
      if (link instanceof HTMLAnchorElement) {
        link.style.pointerEvents = 'none';
        link.addEventListener('click', (e) => {
          e.preventDefault();
        });
      }
    });
  }
};

export default disableCallOnNonMobile;
