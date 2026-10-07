import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IFormState } from '../../types';
import { ensureElement } from '../../utils/utils';

export class Form<T extends object = object>
    extends Component<T & IFormState> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(
        container: HTMLFormElement,
        protected events: IEvents
    ) {
        super(container);

        this.submitButton = ensureElement<HTMLButtonElement>(
            'button[type="submit"]',
            container
        );

        this.errorsElement = ensureElement<HTMLElement>(
            '.form__errors',
            container
        );

        container.addEventListener('input', (event) => {
            const target = event.target;

            if (target instanceof HTMLInputElement) {
                this.onInputChange(target.name, target.value);
            }
        });

        container.addEventListener('submit', (event) => {
            event.preventDefault();

            this.events.emit(`${container.name}:submit`);
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.errorsElement.textContent = value;
    }

    protected onInputChange(field: string, value: string): void {
        const formName = this.container.getAttribute('name');

        this.events.emit(`${formName}.${field}:change`, {
            field,
            value,
        });
    }
}