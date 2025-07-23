/**
 * アコーディオンのアニメーション設定
 */
const options = {
  duration: 400,
  easing: 'ease-out',
};

const closingAnimation = (content: HTMLElement) => [
  {
    height: content.offsetHeight + 'px',
    opacity: 1,
  },
  {
    height: 0,
    opacity: 0,
  },
];

const openingAnimation = (content: HTMLElement) => [
  {
    height: 0,
    opacity: 0,
  },
  {
    height: content.offsetHeight + 'px',
    opacity: 1,
  },
];

// 閉じる動作
const closeDetails = (details: HTMLDetailsElement, content: HTMLElement) => {
  details.dataset.status = 'running';
  const closingAnimate = content.animate(closingAnimation(content), options);

  closingAnimate.onfinish = () => {
    details.removeAttribute('open');
    details.dataset.status = '';
  };
};

// 開ける動作
const openDetails = (details: HTMLDetailsElement, content: HTMLElement) => {
  details.setAttribute('open', 'true');
  details.dataset.status = 'running';

  const openingAnimate = content.animate(openingAnimation(content), options);
  openingAnimate.onfinish = () => {
    details.dataset.status = '';
  };
};

// ターゲットを取得して初期処理を行う
const initializeAccordion = (target: HTMLDetailsElement) => {
  const summary = target.querySelector<HTMLElement>('[data-summary]');

  if (!summary) {
    console.log('Summary element not found');
    return;
  }

  summary.addEventListener('click', (event) => {
    event.preventDefault();
    const target = event.currentTarget;

    if (target instanceof HTMLElement) {
      const details = target.closest('details');
      if (!details) return;
      const content = details.querySelector<HTMLElement>('[data-content]');

      if (!details || !content) return;
      if (details.dataset.status === 'running') {
        return;
      }

      if (details.open) {
        target.removeAttribute('data-open');
        closeDetails(details, content);
      } else {
        target.setAttribute('data-open', 'true');
        openDetails(details, content);
      }
    }
  });
};

export default initializeAccordion;
