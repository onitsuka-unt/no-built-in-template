/**
 * 360px以下はビューポートを固定する
 * @see https://zenn.dev/tak_dcxi/articles/690caf6e9c4e26#360px-%E6%9C%AA%E6%BA%80%E3%81%AF-js-%E3%81%A7-viewport-%E3%82%92%E5%9B%BA%E5%AE%9A%E3%81%99%E3%82%8B
 */

const VIEWPORT = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;

const switchViewport = () => {
  // 360px以下の場合はビューポートを固定する
  const value = window.outerWidth > 360 ? 'width=device-width,initial-scale=1' : 'width=360';

  if (VIEWPORT.getAttribute('content') !== value) {
    VIEWPORT.setAttribute('content', value);
  }
};

const initializeViewport = () => {
  window.addEventListener('resize', switchViewport, false);
  switchViewport();
};

export default initializeViewport;
