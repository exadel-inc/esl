/**
 * Type declarations for version-scoped deprecation configuration blocks used in configs.js.
 * These types power editor IntelliSense and validation when extending the raw config.
 */

/** Mapping of deprecated alias (key) -> canonical alias (value). */
export interface AliasMap {
  [deprecated: string]: string;
}

/** Configuration describing a deprecated import path (legacy) and its replacement (path). */
export interface DeprecatedPathConfig {
  /** One or more legacy import sources that should be replaced. */
  legacy: string | readonly string[];
  /** Target path to be used instead of any legacy value. */
  path: string;
}

/** Map: alias (import specifier name) -> deprecation path config. */
export interface DeprecatedPathsMap {
  [alias: string]: DeprecatedPathConfig;
}

/** Object replacement with optional custom message. */
export interface StaticMemberReplacementObject {
  /** Optional human‑readable explanation; if omitted, replacement name is used in message. */
  message?: string;
  /** Identifier to replace the deprecated static member with. */
  replacement: string;
}

/** Possible replacement forms for a deprecated static member. */
export type StaticMemberReplacement = string | StaticMemberReplacementObject;

/** Runtime factory to compute a replacement; receives parent AST node. */
export type StaticMemberReplacementFactory = (parentNode: any) => StaticMemberReplacement;

/** Map of deprecated member name -> replacement (direct or factory). */
export interface StaticMemberMap {
  [member: string]: StaticMemberReplacement | StaticMemberReplacementFactory;
}

/** Top-level mapping: ClassName -> static member mapping. */
export interface StaticMembersConfig {
  [className: string]: StaticMemberMap;
}

/** A single version-scoped deprecation configuration block. */
export interface DeprecationConfigBlock {
  /** Inclusive lower bound (config applies when detected version >= min). */
  min?: string;
  /** Exclusive upper bound (config ignored when detected version >= max). */
  max?: string;
  /** Deprecated alias replacements. */
  aliases?: AliasMap;
  /** Deprecated import path replacements. */
  paths?: DeprecatedPathsMap;
  /** Deprecated static member replacements. */
  staticMembers?: StaticMembersConfig;
}

/** All registered deprecation configuration blocks (ordered by ascending min). */
export const configs: readonly DeprecationConfigBlock[];

