/**
 * ESL Scrollbar
 * @version 1.1.0
 * @author Yuliya Adamskaya
 */
import {ESLBaseElement, attr} from '../../esl-base-element/esl-base-element';
import {findTarget, isRelative} from '../../esl-utils/dom/traversing';
import {rafDecorator} from '../../esl-utils/async/raf';
import {normalizeCoordinates} from '../../esl-utils/dom/events';

export class ESLScrollbar extends ESLBaseElement {
    public static is = 'esl-scrollbar';
    public static eventNs = 'esl:scrollbar';

    protected $scrollbarThumb: HTMLElement;
    protected $scrollbarTrack: HTMLElement;
    protected $scrollableContent: HTMLElement;

    protected _initialMousePosition: number;
    protected _initialPosition: number;

    @attr({conditional: true}) protected dragging: boolean;
    @attr({conditional: true, readonly: true}) public inactive: boolean;

    @attr({defaultValue: '::parent'}) public target: string;
    @attr({defaultValue: 'vertical'}) public direction: string;
    @attr({defaultValue: 'scrollbar-thumb'}) public thumbClass: string;
    @attr({defaultValue: 'scrollbar-track'}) public trackClass: string;

    static get observedAttributes() {
        return ['target'];
    }

    protected connectedCallback() {
        super.connectedCallback();

        this.findTarget();

        this.render();
        this.refresh();

        this.bindEvents();
    }

    protected disconnectedCallback() {
        this.unbindEvents();
    }

    private attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
        if (!this.connected && oldVal === newVal) return;
        if (attrName === 'target') {
            this.findTarget();
        }
    }

    protected findTarget() {
        if (!this.target) return;
        const content = findTarget(this.target, this) as HTMLDivElement;
        this.targetElement = content ? content : null;
    }

    public get targetElement() {
        return this.$scrollableContent || null;
    }

    public set targetElement(content: HTMLElement) {
        if (this.$scrollableContent) {
            this.$scrollableContent.removeEventListener('scroll', this.onScroll);
        }
        this.$scrollableContent = content;
        this.$scrollableContent.addEventListener('scroll', this.onScroll, {passive: true});
    }

    protected render() {
        this.innerHTML = '';
        this.$scrollbarTrack = document.createElement('div');
        this.$scrollbarTrack.className = this.trackClass;
        this.$scrollbarThumb = document.createElement('div');
        this.$scrollbarThumb.className = this.thumbClass;

        this.$scrollbarTrack.appendChild(this.$scrollbarThumb);
        this.appendChild(this.$scrollbarTrack);
    }

    protected bindEvents() {
        this.addEventListener('click', this.onClick);
        this.$scrollbarThumb.addEventListener('mousedown', this.onMouseDown);
        window.addEventListener('resize', this.onResize, {passive: true});
        window.addEventListener('esl:refresh', this.onRefresh);
    }

    protected unbindEvents() {
        this.removeEventListener('click', this.onClick);
        this.$scrollbarThumb.removeEventListener('mousedown', this.onMouseDown);

        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('esl:refresh', this.onRefresh);

        this.targetElement.removeEventListener('scroll', this.onScroll);
    }

    public isHorizontal() {
        return this.direction === 'horizontal';
    }

    public get trackOffset() {
        return this.isHorizontal() ? this.$scrollbarTrack.offsetWidth : this.$scrollbarTrack.offsetHeight;
    }

    public get thumbOffset() {
        return this.isHorizontal() ? this.$scrollbarThumb.offsetWidth : this.$scrollbarThumb.offsetHeight;
    }

    public get thumbSize() {
        // behave as native scroll
        if (!this.targetElement || !this.targetElement.scrollWidth || !this.targetElement.scrollHeight) return 1;
        return this.isHorizontal() ? this.targetElement.offsetWidth / this.targetElement.scrollWidth : this.targetElement.offsetHeight / this.targetElement.scrollHeight;
    }

    public get position() {
        if (!this.targetElement) return 0;
        if (this.isHorizontal()) {
            const scrollableWidth = this.targetElement.scrollWidth - this.targetElement.offsetWidth;
            return scrollableWidth ? (this.targetElement.scrollLeft / scrollableWidth) : 0;
        }
        const scrollableHeight = this.targetElement.scrollHeight - this.targetElement.offsetHeight;
        return scrollableHeight ? (this.targetElement.scrollTop / scrollableHeight) : 0;
    }

    public set position(position) {
        const normalizedPosition = Math.min(1, Math.max(0, position));
        if (this.isHorizontal()) {
            this.targetElement.scrollLeft = (this.targetElement.scrollWidth - this.targetElement.offsetWidth) * normalizedPosition;
        } else {
            this.targetElement.scrollTop = (this.targetElement.scrollHeight - this.targetElement.offsetHeight) * normalizedPosition;
        }
        this.update();
    }

    /**
     * Update thumb size and position
     */
    public update() {
        if (!this.$scrollbarThumb || !this.$scrollbarTrack) return;
        const thumbSize = this.trackOffset * this.thumbSize;
        const thumb = (this.trackOffset - thumbSize) * this.position;
        if (this.isHorizontal()) {

            this.$scrollbarThumb.style.left = `${thumb}px`;
            this.$scrollbarThumb.style.width = `${thumbSize}px`;
        } else {
            this.$scrollbarThumb.style.top = `${thumb}px`;
            this.$scrollbarThumb.style.height = `${thumbSize}px`;
        }
    }

    /**
     * Update auxiliary markers
     */
    public updateMarkers() {
        if (this.thumbSize === 1) {
            this.setAttribute('inactive', '');
        } else {
            this.removeAttribute('inactive');
        }
    }

    /**
     * Refresh scroll state and position
     */
    public refresh() {
        this.update();
        this.updateMarkers();
    }

    // Event listeners
    /**
     * Mousedown event to track thumb drag start.
     */
    protected onMouseDown = (event: MouseEvent) => {
        this.dragging = true;
        this._initialPosition = this.position;
        this._initialMousePosition = this.isHorizontal() ? event.clientX : event.clientY;

        // Attach drag listeners
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);
        window.addEventListener('click', this.onBodyClick, {capture: true});

        // Prevents default text selection, etc.
        event.preventDefault();
    };

    /**
     * Mousemove document handler for thumb drag event. Active only if drag action is active.
     */
    protected onMouseMove = rafDecorator((event: MouseEvent) => {
        if (!this.dragging) return;

        const positionChange = this.isHorizontal() ? event.clientX - this._initialMousePosition : event.clientY - this._initialMousePosition;
        const scrollableAreaHeight = this.trackOffset - this.thumbOffset;
        const absChange = scrollableAreaHeight ? (positionChange / scrollableAreaHeight) : 0;
        this.position = this._initialPosition + absChange;

        // Prevents default text selection, etc.
        event.preventDefault();
        event.stopPropagation();
    });

    /**
     * Mouse up short time document handler to handle drag end
     */
    protected onMouseUp = (event: MouseEvent) => {
        this.dragging = false;

        // Unbind drag listeners
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
    };

    /**
     * Body click short time handler to prevent clicks event on thumb drag. Handles capture phase.
     */
    protected onBodyClick = (event: MouseEvent) => {
        event.stopImmediatePropagation();

        window.removeEventListener('click', this.onBodyClick, {capture: true});
    };

    /**
     * Handler for track clicks. Move scroll to selected position.
     */
    protected onClick = (event: MouseEvent) => {
        if (event.target !== this.$scrollbarTrack) return;

        const clickCoordinates = normalizeCoordinates(event, this.$scrollbarTrack);
        const clickPosition = this.isHorizontal() ? clickCoordinates.x : clickCoordinates.y;

        const freeTrackArea = this.trackOffset - this.thumbOffset; // px
        const clickPositionNoOffset = clickPosition - this.thumbOffset / 2;
        const newPosition = clickPositionNoOffset / freeTrackArea;  // abs % to track

        this.position = Math.min(this.position + this.thumbSize,
            Math.max(this.position - this.thumbSize, newPosition));
    };

    /**
     * Handler to redraw scroll on element native scroll events
     */
    protected onScroll = rafDecorator(() => {
        if (!this.dragging) this.update();
    });

    /**
     * Handler for document resize events to redraw scroll.
     */
    protected onResize = rafDecorator(() => this.refresh());

    private onRefresh = (event: Event) => {
        const target = event.target as HTMLElement;
        if (isRelative(target.parentNode, this.targetElement)) this.refresh();
    }
}

export default ESLScrollbar;
