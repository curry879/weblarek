import { CardWithImage } from './CardWithImage';
import { TCardPreview } from '../../types';
import { ensureElement } from '../../utils/utils';

export class CardPreview extends CardWithImage<TCardPreview> {
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, onClick: () => void) {
        super(container);

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