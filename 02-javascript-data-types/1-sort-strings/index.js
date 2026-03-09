/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const locales = ['ru', 'en'];
  const options = {caseFirst: 'upper'};
  let order;

  switch (param) {
  case 'asc': {
    order = 1;
    break;
  }
  case 'desc': {
    order = -1;
    break;
  }
  default:
    throw new Error('Unknown sorting type');
  }

  return [...arr].sort((a, b) => a.localeCompare(b, locales, options) * order);
}
