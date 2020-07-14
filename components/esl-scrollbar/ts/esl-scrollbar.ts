/**
 * ESL Scrollbar
 * @version 1.1.0
 * @author Yuliya Adamskaya
 */
import {ExportNs} from '../../esl-utils/enviroment/export-ns';
import {ESLBaseElement, attr} from '../../esl-base-element/esl-base-element';
import {findTarget} from '../../esl-utils/dom/traversing';
import {rafDecorator} from '../../esl-utils/async/raf';

@ExportNs('Scrollbar')
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
    }

    protected unbindEvents() {
        this.removeEventListener('click', this.onClick);
        this.$scrollbarThumb.removeEventListener('mousedown', this.onMouseDown);

        window.removeEventListener('resize', this.onResize);

        this.$scrollableContent.removeEventListener('scroll', this.onScroll);
    }

    public get thumbSize() {
        // behave as native scroll
        if (!this.$scrollableContent) return 1;
        return this.$scrollableContent.offsetHeight / this.$scrollableContent.scrollHeight;
    }

    public get position() {
        if (!this.$scrollableContent) return 0;
        const scrollableHeight = this.$scrollableContent.scrollHeight - this.$scrollableContent.offsetHeight;
        return scrollableHeight ? (this.$scrollableContent.scrollTop / scrollableHeight) : 0;
    }

    public set position(position) {
        const normalizedPosition = Math.min(1, Math.max(0, position));
        this.$scrollableContent.scrollTop = (this.$scrollableContent.scrollHeight - this.$scrollableContent.offsetHeight) * normalizedPosition;
        this.update();
    }

    /**
     * Update thumb size and position
     */
    public update() {
        if (!this.$scrollbarThumb || !this.$scrollbarTrack) return;
        const trackSize = this.$scrollbarTrack.offsetHeight;
        const thumbSize = trackSize * this.thumbSize;
        const thumbTop = (trackSize - thumbSize) * this.position;

        this.$scrollbarThumb.style.top = `${thumbTop}px`;
        this.$scrollbarThumb.style.height = `${thumbSize}px`;
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
        this._initialMousePosition = event.clientY;

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

        const positionChange = event.clientY - this._initialMousePosition;
        const scrollableAreaHeight = this.$scrollbarTrack.offsetHeight - this.$scrollbarThumb.offsetHeight;
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

        const thumbHeight = this.$scrollbarThumb.offsetHeight;
        const trackOffset = this.$scrollbarTrack.getBoundingClientRect().top + window.pageYOffset;
        const positionChange = event.pageY - trackOffset - thumbHeight / 2;
        this.position = positionChange / (this.$scrollbarTrack.offsetHeight - thumbHeight);
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
}

export default ESLScrollbar;
