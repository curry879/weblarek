import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { IModal } from '../../types';
import { ensureElement } from '../../utils/utils';

export class Modal extends Component<IModal> {
    protected contentElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.contentElement = ensureElement<HTMLElement>(
            '.modal__content',
            container
        );

        this.closeButton = ensureElement<HTMLButtonElement>(
            '.modal__close',
            container
        );

        this.closeButton.addEventListener('click', () => {
            events.emit('modal:close-request');
        });

        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                events.emit('modal:close-request');
            }
        });
    }

    set content(value: HTMLElement) {
        this.contentElement.replaceChildren(value);
    }

    open(): void {
        this.container.classList.add('modal_active');
    }

    close(): void {
        this.container.classList.remove('modal_active');
    }
}