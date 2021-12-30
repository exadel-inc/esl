import type {ESLBaseElementShape} from '../../esl-base-element/core/esl-base-element.shape';
import type {ESLPanelGroup} from './esl-panel-group';

/**
 * Tag declaration interface of {@link ESLPanelGroup} element
 * Used for TSX declaration
 */
export interface ESLPanelGroupTagShape extends ESLBaseElementShape<ESLPanelGroup> {
  /**
   * Define rendering mode of the component (takes values from the list of supported modes; 'accordion' by default)
   * Supported values: `accordion|tabs|open`
   */
  'mode'?: string;

  /** Define element {@link TraversingQuery} selector to add class that identifies the rendering mode (ESLPanelGroup itself by default) */
  'mode-cls-target'?: string;

  /** Define class(es) to be added during animation ('animate' by default) */
  'animation-class'?: string;

  /** Define time to clear animation common params (max-height style + classes) ('auto' by default) */
  'fallback-duration'?: string | number;

  /** Define a list of comma-separated "modes" to disable collapse/expand animation (for both Group and Panel animations)*/
  'no-collapse'?: string;

  /** Define json of action params for show/hide requests from the group to child panels */
  'action-params'?: string;

  /** Allowed children */
  children: any;
}

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      /** {@link ESLPanelGroup} custom tag */
      'esl-panel-group': ESLPanelGroupTagShape;
    }
  }
}
