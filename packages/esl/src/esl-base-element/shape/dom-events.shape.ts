/**
 * Base DOM Element events attributes definitions for TSX
 */
export interface DOMEventsAttributesShape<T> {
  // Clipboard Events
  onCopy?: ClipboardEventHandler<T>;
  onCopyCapture?: ClipboardEventHandler<T>;
  onCut?: ClipboardEventHandler<T>;
  onCutCapture?: ClipboardEventHandler<T>;
  onPaste?: ClipboardEventHandler<T>;
  onPasteCapture?: ClipboardEventHandler<T>;

  // Composition Events
  onCompositionEnd?: CompositionEventHandler<T>;
  onCompositionEndCapture?: CompositionEventHandler<T>;
  onCompositionStart?: CompositionEventHandler<T>;
  onCompositionStartCapture?: CompositionEventHandler<T>;
  onCompositionUpdate?: CompositionEventHandler<T>;
  onCompositionUpdateCapture?: CompositionEventHandler<T>;

  // Focus Events
  onFocus?: FocusEventHandler<T>;
  onFocusCapture?: FocusEventHandler<T>;
  onBlur?: FocusEventHandler<T>;
  onBlurCapture?: FocusEventHandler<T>;

  // Form Events
  onChange?: GenericEventHandler<T>;
  onChangeCapture?: GenericEventHandler<T>;
  onBeforeInput?: GenericEventHandler<T>;
  onBeforeInputCapture?: GenericEventHandler<T>;
  onInput?: GenericEventHandler<T>;
  onInputCapture?: GenericEventHandler<T>;
  onReset?: GenericEventHandler<T>;
  onResetCapture?: GenericEventHandler<T>;
  onSubmit?: GenericEventHandler<T>;
  onSubmitCapture?: GenericEventHandler<T>;
  onInvalid?: GenericEventHandler<T>;
  onInvalidCapture?: GenericEventHandler<T>;

  // Image Events
  onLoad?: GenericEventHandler<T>;
  onLoadCapture?: GenericEventHandler<T>;
  onError?: GenericEventHandler<T>; // also a Media Event
  onErrorCapture?: GenericEventHandler<T>; // also a Media Event

  // Keyboard Events
  onKeyDown?: KeyboardEventHandler<T>;
  onKeyDownCapture?: KeyboardEventHandler<T>;
  onKeyPress?: KeyboardEventHandler<T>;
  onKeyPressCapture?: KeyboardEventHandler<T>;
  onKeyUp?: KeyboardEventHandler<T>;
  onKeyUpCapture?: KeyboardEventHandler<T>;

  // MouseEvents
  onAuxClick?: MouseEventHandler<T>;
  onAuxClickCapture?: MouseEventHandler<T>;
  onClick?: MouseEventHandler<T>;
  onClickCapture?: MouseEventHandler<T>;
  onContextMenu?: MouseEventHandler<T>;
  onContextMenuCapture?: MouseEventHandler<T>;
  onDoubleClick?: MouseEventHandler<T>;
  onDoubleClickCapture?: MouseEventHandler<T>;
  onDrag?: DragEventHandler<T>;
  onDragCapture?: DragEventHandler<T>;
  onDragEnd?: DragEventHandler<T>;
  onDragEndCapture?: DragEventHandler<T>;
  onDragEnter?: DragEventHandler<T>;
  onDragEnterCapture?: DragEventHandler<T>;
  onDragExit?: DragEventHandler<T>;
  onDragExitCapture?: DragEventHandler<T>;
  onDragLeave?: DragEventHandler<T>;
  onDragLeaveCapture?: DragEventHandler<T>;
  onDragOver?: DragEventHandler<T>;
  onDragOverCapture?: DragEventHandler<T>;
  onDragStart?: DragEventHandler<T>;
  onDragStartCapture?: DragEventHandler<T>;
  onDrop?: DragEventHandler<T>;
  onDropCapture?: DragEventHandler<T>;
  onMouseDown?: MouseEventHandler<T>;
  onMouseDownCapture?: MouseEventHandler<T>;
  onMouseEnter?: MouseEventHandler<T>;
  onMouseLeave?: MouseEventHandler<T>;
  onMouseMove?: MouseEventHandler<T>;
  onMouseMoveCapture?: MouseEventHandler<T>;
  onMouseOut?: MouseEventHandler<T>;
  onMouseOutCapture?: MouseEventHandler<T>;
  onMouseOver?: MouseEventHandler<T>;
  onMouseOverCapture?: MouseEventHandler<T>;
  onMouseUp?: MouseEventHandler<T>;
  onMouseUpCapture?: MouseEventHandler<T>;

  // Selection Events
  onSelect?: GenericEventHandler<T>;
  onSelectCapture?: GenericEventHandler<T>;

  // Touch Events
  onTouchCancel?: TouchEventHandler<T>;
  onTouchCancelCapture?: TouchEventHandler<T>;
  onTouchEnd?: TouchEventHandler<T>;
  onTouchEndCapture?: TouchEventHandler<T>;
  onTouchMove?: TouchEventHandler<T>;
  onTouchMoveCapture?: TouchEventHandler<T>;
  onTouchStart?: TouchEventHandler<T>;
  onTouchStartCapture?: TouchEventHandler<T>;

  // Pointer Events
  onPointerDown?: PointerEventHandler<T>;
  onPointerDownCapture?: PointerEventHandler<T>;
  onPointerMove?: PointerEventHandler<T>;
  onPointerMoveCapture?: PointerEventHandler<T>;
  onPointerUp?: PointerEventHandler<T>;
  onPointerUpCapture?: PointerEventHandler<T>;
  onPointerCancel?: PointerEventHandler<T>;
  onPointerCancelCapture?: PointerEventHandler<T>;
  onPointerEnter?: PointerEventHandler<T>;
  onPointerEnterCapture?: PointerEventHandler<T>;
  onPointerLeave?: PointerEventHandler<T>;
  onPointerLeaveCapture?: PointerEventHandler<T>;
  onPointerOver?: PointerEventHandler<T>;
  onPointerOverCapture?: PointerEventHandler<T>;
  onPointerOut?: PointerEventHandler<T>;
  onPointerOutCapture?: PointerEventHandler<T>;
  onGotPointerCapture?: PointerEventHandler<T>;
  onGotPointerCaptureCapture?: PointerEventHandler<T>;
  onLostPointerCapture?: PointerEventHandler<T>;
  onLostPointerCaptureCapture?: PointerEventHandler<T>;

  // UI Events
  onScroll?: UIEventHandler<T>;
  onScrollCapture?: UIEventHandler<T>;

  // Wheel Events
  onWheel?: WheelEventHandler<T>;
  onWheelCapture?: WheelEventHandler<T>;

  // Animation Events
  onAnimationStart?: AnimationEventHandler<T>;
  onAnimationStartCapture?: AnimationEventHandler<T>;
  onAnimationEnd?: AnimationEventHandler<T>;
  onAnimationEndCapture?: AnimationEventHandler<T>;
  onAnimationIteration?: AnimationEventHandler<T>;
  onAnimationIterationCapture?: AnimationEventHandler<T>;

  // Transition Events
  onTransitionEnd?: TransitionEventHandler<T>;
  onTransitionEndCapture?: TransitionEventHandler<T>;
}

type EventHandler<E extends Event, T> = (this: T, event: E & {currentTarget: EventTarget & T}) => void;

type GenericEventHandler<T = Element> = EventHandler<Event, T>;
type ClipboardEventHandler<T = Element> = EventHandler<ClipboardEvent, T>;
type CompositionEventHandler<T = Element> = EventHandler<CompositionEvent, T>;
type DragEventHandler<T = Element> = EventHandler<DragEvent, T>;
type FocusEventHandler<T = Element> = EventHandler<FocusEvent, T>;
type KeyboardEventHandler<T = Element> = EventHandler<KeyboardEvent, T>;
type MouseEventHandler<T = Element> = EventHandler<MouseEvent, T>;
type TouchEventHandler<T = Element> = EventHandler<TouchEvent, T>;
type PointerEventHandler<T = Element> = EventHandler<PointerEvent, T>;
type UIEventHandler<T = Element> = EventHandler<UIEvent, T>;
type WheelEventHandler<T = Element> = EventHandler<WheelEvent, T>;
type AnimationEventHandler<T = Element> = EventHandler<AnimationEvent, T>;
type TransitionEventHandler<T = Element> = EventHandler<TransitionEvent, T>;
