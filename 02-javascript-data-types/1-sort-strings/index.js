/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const locales = ['ru', 'en'];
  const options = {caseFirst: 'upper'};
  const order = param === 'desc' ? -1 : 1;

  return [...arr].sort((a, b) => a.localeCompare(b, locales, options) * order);
}
