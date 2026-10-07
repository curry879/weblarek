import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IBasketView } from '../../types';
import { ensureElement } from '../../utils/utils';

export class BasketView extends Component<IBasketView> {
    protected listElement: HTMLElement;
    protected totalElement: HTMLElement;
    protected orderButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.listElement = ensureElement<HTMLElement>(
            '.basket__list',
            container
        );

        this.totalElement = ensureElement<HTMLElement>(
            '.basket__price',
            container
        );

        this.orderButton = ensureElement<HTMLButtonElement>(
            '.basket__button',
            container
        );

        this.orderButton.addEventListener('click', () => {
            events.emit('order:open');
        });
    }

    set items(items: HTMLElement[]) {
        this.listElement.replaceChildren(...items);
        this.orderButton.disabled = items.length === 0;
    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }
}