import {CustomElement} from '../../smart-utils/abstract/custom-element';
import {attr} from '../../smart-utils/decorators/attr';
import {findTarget} from '../../smart-utils/dom/traversing';

export class SmartScrollbar extends CustomElement {
    public static is = 'smart-scrollbar';

    private _scrollableContent: HTMLDivElement;
    private _scrollbarThumb: HTMLDivElement;

    private draggingStarted: boolean;
    private lastMousePosition: number;
    private isScrolling: boolean;

    @attr({conditional: true}) protected inactive: boolean;

    @attr({defaultValue: 'vertical'}) protected direction: string;
    @attr({defaultValue: 'smart-scrollable-content'}) protected target: string;

    protected connectedCallback() {
        super.connectedCallback();

        this.updateScrollableTarget();
        this.buildScrollbarWrapper();

        this.updateThumbSize();
        this.bindEvents();

        this.setAttribute('inactive', '');
    }

    protected disconnectedCallback() {
        this.unbindEvents();
    }

    protected bindEvents() {
        this._scrollableContent.addEventListener('scroll', this.onScroll.bind(this));
        window.addEventListener('mousemove', this.onMousemove.bind(this));
        this._scrollbarThumb.addEventListener('click', this.onClick.bind(this));
        this._scrollbarThumb.addEventListener('mousedown', this.onMousedown.bind(this));

        window.addEventListener('mouseup', this.onMouseup);
        window.addEventListener('resize', this.refresh);
    }

    protected unbindEvents() {
        this._scrollableContent.removeEventListener('scroll', this.onScroll);
        this.removeEventListener('mousemove', this.onMousemove);
        this.removeEventListener('click', this.onClick);
        this._scrollbarThumb.removeEventListener('mousedown', this.onMousedown);

        window.removeEventListener('mouseup', this.onMouseup);
        window.removeEventListener('resize', this.refresh);
    }

    protected  refresh() {
        this.updateThumbSize();
        this.updateThumbPosition();
        this.updateContentPosition();
    }

    protected onMousemove(event: MouseEvent) {
        if (this.draggingStarted) {
            const currentMousePosition = event.clientY - this._scrollableContent.offsetTop;
            const positionChange = currentMousePosition - this.lastMousePosition;
            this.lastMousePosition = currentMousePosition;

            const newThumbPosition = this.limitThumbPosition(this.getThumbPosition() + positionChange);
            this.setThumbPosition(newThumbPosition);
            this.updateContentPosition();
            event.preventDefault();
        }
    }

    protected onMousedown = (event: MouseEvent) => {
        this.draggingStarted = true;
        this.lastMousePosition = event.clientY - this._scrollableContent.offsetTop;
        event.preventDefault();
        event.stopPropagation();
    };

    private onMouseup() {
        this.draggingStarted = false;
    }

    protected onScroll = () => {
        if (!this.draggingStarted && !this.isScrolling) {
            this.updateThumbPosition();
            this.draggingStarted = false;
        }
    };

    private onClick(event: MouseEvent) {
        const position = event.clientY;
        if (position < this.getThumbPosition() || position > this.getThumbPosition() + this.getThumbSize()) {
            const newThumbPosition = this.limitThumbPosition(position - this.getThumbSize() / 2);
            this.setThumbPosition(newThumbPosition);
        }
        this.draggingStarted = false;
    }

    protected limitThumbPosition(position: number) {
        if (position < 0) {
            return 0;
        } else if (position > this.getScrollbarSize() - this.getThumbSize()) {
            return this.getScrollbarSize() - this.getThumbSize();
        }
        return position;
    }

    protected updateThumbPosition() {
        const position = this._scrollableContent.scrollTop / this.getContentSize() * this.getScrollbarSize();
        this._scrollbarThumb.style.top = `${position}px`;
    }

    protected setThumbPosition(position: number) {
        this._scrollbarThumb.style.top = `${position}px`;
    }

    protected getThumbPosition() {
        return this._scrollbarThumb.offsetTop;
    }

    protected updateThumbSize() {
        this._scrollbarThumb.style.height = `${this._scrollableContent.offsetHeight / this.getContentSize() * this.getScrollbarSize()}px`;
    }

    protected getThumbSize() {
        return this._scrollbarThumb.offsetHeight;
    }

    protected updateScrollableTarget() {
        if (!this.target) return;
        const content = findTarget(this.target, this) as HTMLDivElement;
        this._scrollableContent = content ? content : null;
    }

    protected getScrollbarSize() {
        return this._scrollableContent.offsetHeight /*- +this.top - +this.bottom*/;
    }

    protected updateContentPosition() {
        this._scrollableContent.scrollTop = this.getThumbPosition() / this.getScrollbarSize() * this.getContentSize();
    }

    protected getContentSize() {
        return this._scrollableContent.scrollHeight;
    }

    protected buildScrollbarWrapper() {
        const scrollbarTrack = document.createElement('div');
        scrollbarTrack.className = 'scrollbar-track';
        this._scrollbarThumb =  document.createElement('div');
        this._scrollbarThumb.className = 'scrollbar-thumb';

        this.appendChild(scrollbarTrack);
        this.appendChild(this._scrollbarThumb);
    }
}

export default SmartScrollbar;
