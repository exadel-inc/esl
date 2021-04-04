export default class ArrayUtils {
  static equals<T>(arr1: T[], arr2: T[]): boolean {
    return ArrayUtils.contains(arr1, arr2) && ArrayUtils.contains(arr2, arr1);
  }

  static contains<T>(array: T[], subArray: T[]): boolean {
    return subArray.every(el => array.indexOf(el) !== -1);
  }

  static select<T>(array: T[], selectItems: T[]): T[] {
    return array.filter(el => selectItems.indexOf(el) !== -1);
  }

  static intersection<T>(...arrays: T[][]): T[] {
    return arrays.reduce((inter, array) => ArrayUtils.select(array, inter), arrays[0]);
  }
}
