import {intersection} from '@exadel/esl/modules/esl-utils/misc/set';

/** Class for processing attribute's tokens */
export class TokenListUtils {
  /**
   * Divides string by whitespace regexp
   * @returns array of items or empty array
   */
  static split(str: string | null): string[] {
    return str?.split(/\s+/) || [];
  }

  /** Creates new string by concatenating all passed elements */
  static join(values: any[]): string {
    return values.join(' ');
  }

  /** Checks if all array elements are equal */
  static isAllEqual(values: any[]): boolean {
    return values.every((val) => val === values[0]);
  }

  /** Checks if array contains all elements from subArray */
  static contains<T>(array: T[], subArray: T[]): boolean {
    return subArray.every((val) => array.includes(val));
  }

  /** Removes all element appearances from array */
  static remove<T>(array: T[], element: T): T[] {
    return array.filter((el) => el !== element);
  }

  /** Returns intersection of all arrays */
  static intersection = intersection;
}
