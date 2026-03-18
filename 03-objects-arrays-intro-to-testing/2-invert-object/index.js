/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns the new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  if (!obj) {return;}

  const ent = Object.entries(obj);
  const inv = ent.map(([key, val]) => [val, key]);

  return Object.fromEntries(inv);
}
