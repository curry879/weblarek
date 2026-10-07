import { Form } from './Form';
import { IEvents } from '../base/Events';
import { TOrderForm, TPayment } from '../../types';
import {
    ensureAllElements,
    ensureElement,
} from '../../utils/utils';

export class OrderForm extends Form<TOrderForm> {
    protected paymentButtons: HTMLButtonElement[];
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.paymentButtons = ensureAllElements<HTMLButtonElement>(
            '.order__buttons button',
            container
        );

        this.addressInput = ensureElement<HTMLInputElement>(
            'input[name="address"]',
            container
        );

        this.paymentButtons.forEach((button) => {
            button.addEventListener('click', () => {
                this.onInputChange('payment', button.name);
            });
        });
    }

    set payment(value: TPayment | null) {
        this.paymentButtons.forEach((button) => {
            button.classList.toggle(
                'button_alt-active',
                button.name === value
            );
        });
    }

    set address(value: string) {
        this.addressInput.value = value;
    }
}