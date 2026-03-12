/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const nodes = path.split('.');

  return function(tree) {
    const checkIsObj = (val) => tree instanceof Object;
    const checkHasKey = (key) => Object.hasOwn(tree, key);

    for (const node of nodes) {
      if (!checkIsObj(tree) || !checkHasKey(node)) {return;}

      tree = tree[node];
    }

    return tree;
  };
}
