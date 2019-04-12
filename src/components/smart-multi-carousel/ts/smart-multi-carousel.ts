import SmartCarousel from '../../smart-carousel/ts/smart-carousel';

class SmartMultiCarousel extends SmartCarousel {

    static get is() {
        return 'smart-multi-_carousel';
    }

    constructor() {
        super();
    }

}

customElements.define(SmartMultiCarousel.is, SmartMultiCarousel);
export default SmartMultiCarousel;
