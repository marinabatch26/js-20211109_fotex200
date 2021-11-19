/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const objPath = path.split('.');

  return (obj) => {
    return // obj path понимаю, что надо идти по массиву, но туплю, как правильно обратиться, скорее всего рекурсия, поправлю завтра если успею до волны
  }
}
