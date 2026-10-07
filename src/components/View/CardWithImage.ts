import { Card } from './Card';
import { TCardCatalog } from '../../types';
import { categoryMap } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export class CardWithImage<
    T extends TCardCatalog = TCardCatalog
> extends Card<T> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.imageElement = ensureElement<HTMLImageElement>(
            '.card__image',
            container
        );

        this.categoryElement = ensureElement<HTMLElement>(
            '.card__category',
            container
        );
    }

    set image(value: string) {
        this.setImage(
            this.imageElement,
            value,
            this.titleElement.textContent ?? ''
        );
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        this.categoryElement.classList.remove(
            ...Object.values(categoryMap)
        );

        const categoryClass =
            categoryMap[value as keyof typeof categoryMap];

        if (categoryClass) {
            this.categoryElement.classList.add(categoryClass);
        }
    }
}