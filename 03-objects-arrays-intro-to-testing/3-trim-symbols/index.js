/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  let str = '';
  let sym = '';
  let cnt = 0;

  if (size === undefined) {return string;}

  for (const s of string) {
    if (s !== sym) {
      str += sym.repeat(cnt);
      sym = s;
      cnt = 0;
    }

    if (cnt < size) {
      cnt += 1;
    }
  }

  return str + sym.repeat(cnt);
}
