const designWidth = 1920;
const designHeight = 1080;

export const px2vw = (px: number) =>
  `${(px / (designWidth / 100)).toFixed(1)}vw`;
export const px2vh = (px: number) =>
  `${(px / (designHeight / 100)).toFixed(1)}vh`;
export const realPx = (px: number, viewport: 'vw' | 'vh' = 'vw') => {
  if (viewport === 'vw') {
    return px * (window.innerWidth / designWidth);
  } else {
    return px * (window.innerHeight / designHeight);
  }
};
