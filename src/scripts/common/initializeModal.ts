/**
 * モーダルの初期化
 * @see https://www.tak-dcxi.com/article/implementation-example-of-a-modal-created-using-the-dialog-element/
 */
const initializeModal = (modal: HTMLDialogElement): void => {
  if (!modal) {
    console.error('initializeModal: Modal element is not found.');
    return;
  }

  const modalId = modal.dataset.modal;
  const openTriggers = document.querySelectorAll(`[data-modal-open="${modalId}"]`) as NodeListOf<HTMLButtonElement>;
  const closeTriggers = modal.querySelectorAll('[data-modal-close]') as NodeListOf<HTMLButtonElement>;

  if (openTriggers.length === 0 || closeTriggers.length === 0) {
    console.error('initializeModal: Elements required for modal trigger are not found.');
    return;
  }

  openTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => handleOpenTriggerClick(event, modal, trigger), false);
    trigger.addEventListener('mousedown', handleTriggerFocus, false);
    trigger.addEventListener('keydown', handleTriggerFocus, false);
  });

  closeTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => handleCloseTriggerClick(event, modal), false);
  });
};

// getAnimations()で引数にとったモーダルの要素内すべてのアニメーションを捕捉し、対象のアニメーションが終了するまで待機して値を返す
const waitModalAnimation = (modal: HTMLDialogElement): Promise<PromiseSettledResult<Animation>[]> => {
  if (modal.getAnimations().length === 0) {
    // モーダル内にアニメーションがない場合は空の配列を返す
    return Promise.resolve([]);
  }
  return Promise.allSettled([...modal.getAnimations()].map((animation) => animation.finished));
};

// モーダルを開くトリガーの要素を保持（フォーカスを戻す処理で利用）
let currentOpenTrigger: HTMLButtonElement | null = null;

// モーダルを開くトリガーのクリックイベント
const handleOpenTriggerClick = (event: Event, modal: HTMLDialogElement, trigger: HTMLButtonElement): void => {
  event.preventDefault();
  currentOpenTrigger = trigger;
  openModal(modal);
};

// モーダルを閉じるトリガーのクリックイベント
const handleCloseTriggerClick = (event: Event, modal: HTMLDialogElement): void => {
  event.preventDefault();
  closeModal(modal);
};

// Safariの場合tabキー以外でもフォーカスが表示されるため、data-mousedown属性の切り替えとCSSでフォーカスの表示を抑制
const handleTriggerFocus = (event: Event): void => {
  if (event.type === 'mousedown') {
    document.documentElement.setAttribute('data-mousedown', 'true');
  }
  // キーボード操作が発生した時点でdata-mousedownを削除する
  if (event.type === 'keydown') {
    document.documentElement.removeAttribute('data-mousedown');
  }
};

// backdropにはclickイベントが発火しないため、モーダルのクリックイベントで判定
const handleBackdropClick = (event: MouseEvent, modal: HTMLDialogElement): void => {
  if (event.target === modal) {
    closeModal(modal);
  }
};

// Escキーでモーダルを閉じる
const handleKeyDown = (event: KeyboardEvent, modal: HTMLDialogElement): void => {
  // キー操作があった場合にSafari用のdata-mousedown属性を削除
  document.documentElement.removeAttribute('data-mousedown');
  if (event.key === 'Escape') {
    event.preventDefault();
    closeModal(modal);
  }
};

const unsubscribeListeners: Array<() => void> = [];

let isAnimating: boolean = false;

const openModal = (modal: HTMLDialogElement): void => {
  if (isAnimating) return;

  isAnimating = true;
  modal.showModal();

  const backdropClickHandler = (event: MouseEvent) => handleBackdropClick(event, modal);
  modal.addEventListener('click', backdropClickHandler, false);

  const keyDownHandler = (event: KeyboardEvent) => handleKeyDown(event, modal);
  window.addEventListener('keydown', keyDownHandler, false);

  // クリーンアップ処理を行うための関数を配列に格納
  unsubscribeListeners.push(() => {
    modal.removeEventListener('click', backdropClickHandler);
    window.removeEventListener('keydown', keyDownHandler);
  });

  // requestAnimationFrameを使用してモーダルのアニメーションが完了するまで待機
  requestAnimationFrame(async () => {
    modal.setAttribute('data-active', 'true');
    await waitModalAnimation(modal);
    isAnimating = false;
  });
};

const closeModal = async (modal: HTMLDialogElement): Promise<void> => {
  if (isAnimating) return;

  isAnimating = true;
  modal.setAttribute('data-active', 'false');
  // 配列に登録しておいたクリーンアップ処理を実行
  unsubscribeListeners.forEach((unsubscribe) => unsubscribe());
  // クリーンアップ処理を実行後に配列をクリア
  unsubscribeListeners.length = 0;

  await waitModalAnimation(modal);
  modal.close();

  if (currentOpenTrigger) {
    currentOpenTrigger.focus();
    currentOpenTrigger = null;
  }

  isAnimating = false;
};

export default initializeModal;
