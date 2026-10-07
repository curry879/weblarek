import { Component } from '../base/Component';
import { TCard } from '../../types';
import { ensureElement } from '../../utils/utils';

export class Card<T extends TCard = TCard> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>(
            '.card__title',
            container
        );

        this.priceElement = ensureElement<HTMLElement>(
            '.card__price',
            container
        );
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent =
            value === null ? 'Бесценно' : `${value} синапсов`;
    }
}