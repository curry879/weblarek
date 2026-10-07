import { Card } from './Card';
import { TCardCatalog } from '../../types';
import { ensureElement } from '../../utils/utils';

export class CardCatalog extends Card<TCardCatalog> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement, onClick: () => void) {
        super(container);

        this.imageElement = ensureElement<HTMLImageElement>(
            '.card__image',
            container
        );

        this.categoryElement = ensureElement<HTMLElement>(
            '.card__category',
            container
        );

        this.container.addEventListener('click', onClick);
    }

    set image(value: string) {
        this.setCardImage(this.imageElement, value);
    }

    set category(value: string) {
        this.setCategory(this.categoryElement, value);
    }
}