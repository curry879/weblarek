import { CardWithImage } from './CardWithImage';
import { TCardCatalog } from '../../types';

export class CardCatalog extends CardWithImage<TCardCatalog> {
    constructor(container: HTMLElement, onClick: () => void) {
        super(container);

        this.container.addEventListener('click', onClick);
    }
}