export default class TokenListUtils {
  static equals<T>(arr1: T[], arr2: T[]): boolean {
    return TokenListUtils.contains(arr1, arr2) && TokenListUtils.contains(arr2, arr1);
  }

  static contains<T>(array: T[], subArray: T[]): boolean {
    return subArray.every(el => array.indexOf(el) !== -1);
  }

  static intersection<T>(...arrays: T[][]): T[] {
    return arrays.reduce((inter, array) => inter.filter(el => array.indexOf(el) !== -1), arrays[0]);
  }

  static remove<T>(array: T[], element: T): T[] {
    return array.filter(el => el !== element);
  }
}
