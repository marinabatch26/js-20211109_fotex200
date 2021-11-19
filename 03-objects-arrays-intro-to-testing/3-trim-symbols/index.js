/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (string.length === 0 || size === 0) return '';
  if (size === undefined) return string;

  let st = string.split('');
  let result = '';
  let currentChar = string[0];
  let counter = 0;

  for (let i = 0; i < st.length; i++) {
    counter++;

    if (currentChar !== string[i]) {
      counter = 1;
      currentChar = string[i];
    }

    if (counter <= size) {
      console.log(counter)
      result += string[i];
    }
  }

  return result;
}
