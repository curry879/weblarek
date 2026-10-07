import { Card } from './Card';
import { TCardBasket } from '../../types';
import { ensureElement } from '../../utils/utils';

export class CardBasket extends Card<TCardBasket> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, onClick: () => void) {
        super(container);

        this.indexElement = ensureElement<HTMLElement>(
            '.basket__item-index',
            container
        );

        this.deleteButton = ensureElement<HTMLButtonElement>(
            '.basket__item-delete',
            container
        );

        this.deleteButton.addEventListener('click', onClick);
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}