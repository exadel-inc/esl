/** {@link ESLAnchornav} item renderer */
export type ESLAnchornavRender = (data: ESLAnchorData) => string | Element;

/** {@link ESLAnchornav} anchor data interface */
export interface ESLAnchorData {
  id: string;
  title: string;
  index: number; // order number in the anchor list
  $anchor: HTMLElement;
}
