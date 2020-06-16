import {CustomElement} from '../../smart-utils/abstract/custom-element';
import {attr} from '../../smart-utils/decorators/attr';
import {findTarget} from '../../smart-utils/dom/traversing';
import {rafDecorator} from '../../smart-utils/async/raf';

export class SmartScrollbar extends CustomElement {
    public static is = 'smart-scrollbar';

    protected $scrollableContent: HTMLDivElement;
    protected $scrollbarThumb: HTMLDivElement;
    protected $scrollbarTrack: HTMLDivElement;

    protected _draggingStarted: boolean;
    protected _initialMousePosition: number;
    protected _initialPosition: number;

    @attr({conditional: true}) protected inactive: boolean;

    @attr({defaultValue: 'vertical'}) protected direction: string;
    @attr({defaultValue: '::parent'}) protected target: string;
    @attr({defaultValue: 'scrollbar-thumb'}) protected thumbClass: string;
    @attr({defaultValue: 'scrollbar-track'}) protected trackClass: string;

    protected connectedCallback() {
        super.connectedCallback();

        this.updateScrollableTarget();

        this.render();
        this.refresh();

        this.bindEvents();
    }

    protected disconnectedCallback() {
        this.unbindEvents();
    }

    protected render() {
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

    protected set scrollableContent (content: HTMLDivElement) {
        if (this.$scrollableContent) {
            this.$scrollableContent.removeEventListener('scroll', this.onScroll);
        }
        this.$scrollableContent = content;
        this.$scrollableContent.addEventListener('scroll', this.onScroll, {passive: true});
    }
    public refresh() {
        this.update();
        this.updateMarkers();
    }

    public get active() {
        return this.thumbSize === 1;
    }
    public get thumbSize() {
        // behave as native scroll
        if (!this.$scrollableContent) return 1;
        return this.$scrollableContent.offsetHeight / this.$scrollableContent.scrollHeight;
    }

    public get position() {
        if (!this.$scrollableContent) return 0;
        return this.$scrollableContent.scrollTop / (this.$scrollableContent.scrollHeight - this.$scrollableContent.offsetHeight);
    }
    public set position(position) {
        const normalizedPosition = Math.min(1, Math.max(0, position));
        this.$scrollableContent.scrollTop = (this.$scrollableContent.scrollHeight - this.$scrollableContent.offsetHeight) * normalizedPosition;
        this.update();
    }

    public update() {
        if (!this.$scrollbarThumb || !this.$scrollbarTrack) return;
        const trackSize = this.$scrollbarTrack.offsetHeight;
        const thumbSize = trackSize * this.thumbSize;
        const thumbTop = (trackSize - thumbSize) * this.position;

        this.$scrollbarThumb.style.top = `${thumbTop}px`;
        this.$scrollbarThumb.style.height = `${thumbSize}px`;
    }

    protected updateScrollableTarget() {
        if (!this.target) return;
        const content = findTarget(this.target, this) as HTMLDivElement;
        this.scrollableContent = content ? content : null;
    }

    protected updateMarkers() {
        if (this.active) {
            this.setAttribute('active', '')
        } else {
            this.removeAttribute('active');
        }
    }

    protected onMouseDown = (event: MouseEvent) => {
        this._draggingStarted = true;
        this._initialPosition = this.position;
        this._initialMousePosition = event.clientY;
        event.preventDefault();
        event.stopPropagation();
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);
    };

    protected onMouseMove = rafDecorator((event: MouseEvent) => {
        if (!this._draggingStarted) return;
        const positionChange = event.clientY - this._initialMousePosition;
        const absChange = positionChange / (this.$scrollbarTrack.offsetHeight - this.$scrollbarThumb.offsetHeight);
        this.position = this._initialPosition + absChange;
        event.preventDefault();
    });

    protected onMouseUp = (event: MouseEvent) => {
        if (this._draggingStarted) {
            event.stopPropagation();
            event.preventDefault();
        }
        this._draggingStarted = false;
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
    };

    protected onClick = (event: MouseEvent) => {
        if (event.target !== this.$scrollbarTrack) return;
        const thumbHeight = this.$scrollbarThumb.offsetHeight;
        const trackOffset = this.$scrollbarTrack.getBoundingClientRect().top + document.body.scrollTop;
        const positionChange = event.pageY - trackOffset - thumbHeight / 2;
        this.position = positionChange / (this.$scrollbarTrack.offsetHeight - thumbHeight);
    };

    protected onScroll = rafDecorator(() => {
        if (!this._draggingStarted) {
            this.update();
        }
    });

    protected onResize = rafDecorator(() => this.refresh());
}

export default SmartScrollbar;
