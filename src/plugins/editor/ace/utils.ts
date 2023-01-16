/** Config interface to define inner ACE editor settings. */
export interface EditorConfig {
  /** Editor's appearance theme. */
  theme: string;
  /** Position of the vertical line for wrapping. */
  printMarginColumn: number;
  /** Limit of characters before wrapping. */
  wrap?: number | boolean;
  /** Editor's default amount of lines (height). */
  minLines? : number;
  /** Editor's max amount of lines (height). */
  maxLines? : number;
}

/** Enum to match themes to {@link https://github.com/ajaxorg/ace/tree/master/src/theme Ace styles}. */
export enum AceTheme {
  /** Light editor theme. */
  Light = 'ace/theme/chrome',
  /** Dark editor theme. */
  Dark = 'ace/theme/tomorrow_night',
}
