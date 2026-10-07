import { Card } from './Card';
import { TCardPreview } from '../../types';
import { ensureElement } from '../../utils/utils';

export class CardPreview extends Card<TCardPreview> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

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

        this.descriptionElement = ensureElement<HTMLElement>(
            '.card__text',
            container
        );

        this.buttonElement = ensureElement<HTMLButtonElement>(
            '.card__button',
            container
        );

        this.buttonElement.addEventListener('click', onClick);
    }

    set image(value: string) {
        this.setCardImage(this.imageElement, value);
    }

    set category(value: string) {
        this.setCategory(this.categoryElement, value);
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set buttonText(value: string) {
        this.buttonElement.textContent = value;
    }

    set disabled(value: boolean) {
        this.buttonElement.disabled = value;
    }
}