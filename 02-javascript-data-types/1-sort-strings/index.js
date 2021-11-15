const sortHelper = (a, b) => {
  if(a[0].toLowerCase() === b[0].toLowerCase()){
    if(/^[ёа-яa-z]/.test(a[0]) && /^[ЁА-ЯA-Z]/.test(b[0])){
      return 1;
    };
    if(/^[ёа-яa-z]/.test(b[0]) && /^[ЁА-ЯA-Z]/.test(a[0])){
      return -1;
    };
};

  if (/^[a-zA-Z ]+$/.test(a[0]) && /^[a-zA-Z ]+$/.test(b[0])) {
    return a.localeCompare(b);
  }

  if (/^[ЁёА-я ]+$/.test(a[0]) && /^[ЁёА-я ]+$/.test(b[0])) {

    return a.localeCompare(b);
  }

  if (a === b){
      return 0
  };
  if (a[0] === b[0]){
      return sortHelper(a.slice(1), b.slice(1))
  }

  if (a > b) return -1;
  if (a < b) return 1;
};

/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  let result = [...arr];

  result.sort(sortHelper);

  if (param !== 'asc') result.reverse();

  return result;
}
