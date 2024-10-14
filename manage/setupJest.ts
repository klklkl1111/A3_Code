import 'jest-preset-angular/setup-jest'; // jest 对于 angular 的预配置

const noop = (x: number, y: number) => {
  document.documentElement.scrollTop = y;
};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });
