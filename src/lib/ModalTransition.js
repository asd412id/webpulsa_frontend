export const ModalTransition = (node) => {
  const o = +getComputedStyle(node).opacity;
  return {
    delay: 0,
    duration: 100,
    css: (t) => `opacity: ${t * o}`,
  };
};