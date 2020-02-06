import SmartCarouselPlugin from './smart-carousel-plugin';

/**
 * Slide Carousel Dots plugin
 * Dots plugin renders carousel dots navigation
 *
 * @author Julia Murashko
 */
class SmartCarouselDotsPlugin extends SmartCarouselPlugin {
    public static freePlacement = true;

    static get is() {
        return 'smart-carousel-dots';
    }

    private _onUpdate = () => this.rerender();

    public bind() {
        this.rerender();
        this.carousel.addEventListener('sc:slide:changed', this._onUpdate);
    }

    public unbind() {
        this.innerHTML = '';
        this.carousel.removeEventListener('sc:slide:changed', this._onUpdate);
    }

    public rerender() {
        let html = '';
        const activeDot = Math.floor(this.carousel.activeIndexes[this.carousel.activeCount - 1] / this.carousel.activeCount);
        for (let i = 0; i < Math.ceil(this.carousel.count / this.carousel.activeCount); ++i) {
            html += this.buildDot(i, i === activeDot);
        }
        this.innerHTML = html;
    }

    public buildDot(index: number, isActive: boolean) {
        return `<button role="button" class="carousel-dot ${isActive ? 'active-dot' : ''}" data-slide-target="${index}"></button>`;
    }
}

customElements.define(SmartCarouselDotsPlugin.is, SmartCarouselDotsPlugin);

export default SmartCarouselDotsPlugin;

