import matchMediaController from '@/scripts/common/matchMediaController';
import { breakpoints } from '@/const/breakpoints';

// tabbableな要素を取得
// @see https://github.com/ghosh/Micromodal/blob/master/lib/src/index.js
const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
  'select:not([disabled]):not([aria-hidden])',
  'textarea:not([disabled]):not([aria-hidden])',
  'button:not([disabled]):not([aria-hidden])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex^="-"])',
];

// windowに登録したイベントリスナーを登録・解除するための配列
const unsubscribeListeners: Array<() => void> = [];

const initializeDrawerMenu = () => {
  let beforeFocusedElement: HTMLElement | null = null;

  const elements: {
    navigation: HTMLElement | null;
    openButton: HTMLElement | null;
    contents: HTMLElement | undefined | null;
    closeButton: NodeListOf<HTMLElement> | undefined | null;
    focusableElements: HTMLElement[] | null;
  } = {
    navigation: null,
    openButton: null,
    closeButton: null,
    contents: null,
    focusableElements: null,
  };

  const states = {
    isOpen: false,
    isTransitioning: false,
  };

  // Transitionの完了を待ってから開閉処理を行えるようにする
  const handleTransitionEnd = () => {
    states.isTransitioning = false;
    elements.navigation?.removeEventListener('transitionend', handleTransitionEnd);
  };

  // フォーカス処理がアニメーション中だと安定しないので、transitionendイベントを待つ
  const handleFocus = () => {
    if (elements.focusableElements) {
      elements.focusableElements[0].focus();
    }
    elements.navigation?.removeEventListener('transitionend', handleFocus);
  };

  // Tabキー押下時のフォーカスとEscapeキー押下時の閉じる処理を管理
  const handleKeydown = (event: KeyboardEvent) => {
    if (elements.focusableElements === null) return;

    const firstFocusableElement = elements.focusableElements[0];
    const lastFocusableElement = elements.focusableElements[elements.focusableElements.length - 1];

    // Tabキー押下時
    if (event.code === 'Tab') {
      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusableElement) {
          event.preventDefault();
          // ダイアログ内で最初のtabbableの要素の時、最後のtabbableの要素にフォーカスを移す
          lastFocusableElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusableElement) {
          event.preventDefault();
          // ダイアログ内で最後のtabbableの要素の時、最初のtabbableの要素にフォーカスを移す
          firstFocusableElement.focus();
        }
      }
    }

    // Escapeキー押下時
    if (event.code === 'Escape') {
      close();
    }
  };

  const open = () => {
    if (states.isOpen && states.isTransitioning) return;

    states.isOpen = true;
    states.isTransitioning = true;

    elements.navigation?.setAttribute('data-open', 'true');
    elements.navigation?.setAttribute('aria-hidden', 'false');
    if (document.activeElement instanceof HTMLElement) beforeFocusedElement = document.activeElement;
    elements.navigation?.addEventListener('transitionend', handleFocus);

    document.body.style.overflow = 'hidden';
    if (elements.navigation) elements.navigation.style.scrollbarGutter = 'stable';
    if (elements.navigation) elements.navigation.style.overflow = 'auto';

    elements.navigation?.addEventListener('transitionend', handleTransitionEnd);
    window.addEventListener('keydown', handleKeydown);
    unsubscribeListeners.push(() => {
      window.removeEventListener('keydown', handleKeydown);
    });
  };

  const close = () => {
    if (states.isOpen && states.isTransitioning) return;
    states.isOpen = false;
    states.isTransitioning = true;

    elements.navigation?.setAttribute('data-open', 'false');
    elements.navigation?.setAttribute('aria-hidden', 'true');
    beforeFocusedElement?.focus();
    beforeFocusedElement = null;

    document.body.removeAttribute('style');
    elements.navigation?.removeAttribute('style');

    elements.navigation?.addEventListener('transitionend', handleTransitionEnd);
    unsubscribeListeners.forEach((unsubscribe) => unsubscribe());
  };

  const init = () => {
    elements.navigation = document.querySelector('[data-role="menu"]');
    elements.openButton = document.querySelector('[data-role="open"]');
    elements.contents = elements.navigation?.querySelector('[data-role="contents"]');
    elements.closeButton = elements.navigation?.querySelectorAll('[data-role="close"]');
    elements.focusableElements = elements.contents ? [...elements.contents.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS.join(','))] : null;

    elements.openButton?.addEventListener('click', open);
    elements.closeButton?.forEach((button) => {
      button.addEventListener('click', close);
    });

    // メニュー内のページ内リンククリック時にはメニューを閉じる
    if (elements.contents) {
      const links = [...elements.contents.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
      if (!links || links.length < 0) return;

      links.forEach((link) => {
        link.addEventListener('click', () => {
          if (states.isOpen) close();
        });
      });
    }

    // 画面幅が変わったときにメニューを閉じる
    matchMediaController().init({
      condition: `(width > ${breakpoints.sm})`,
      callback: (match) => {
        if (match) close();
      },
    });
  };

  return { init };
};

export default initializeDrawerMenu;
