import { Form } from './Form';
import { IEvents } from '../base/Events';
import { TContactsForm } from '../../types';
import { ensureElement } from '../../utils/utils';

export class ContactsForm extends Form<TContactsForm> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.emailInput = ensureElement<HTMLInputElement>(
            'input[name="email"]',
            container
        );

        this.phoneInput = ensureElement<HTMLInputElement>(
            'input[name="phone"]',
            container
        );
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }
}