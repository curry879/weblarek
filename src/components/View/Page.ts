import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface IPage {
    catalog: HTMLElement[];
}

export class Page extends Component<IPage> {
    protected gallery: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.gallery = ensureElement<HTMLElement>(
            '.gallery',
            container
        );
    }

    set catalog(items: HTMLElement[]) {
        this.gallery.replaceChildren(...items);
    }
}