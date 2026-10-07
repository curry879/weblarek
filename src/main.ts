import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { WebLarekApi } from './components/WebLarekApi';
import { Products } from './components/Models/Products';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';

import { Page } from './components/View/Page';
import { Modal } from './components/View/Modal';
import { CardCatalog } from './components/View/CardCatalog';
import { CardPreview } from './components/View/CardPreview';
import { CardBasket } from './components/View/CardBasket';
import { BasketView } from './components/View/BasketView';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';

import { IFieldChange, IOrder, TPayment, TProductEvent } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

const productsModel = new Products(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

const page = new Page(
    ensureElement<HTMLElement>('.page__wrapper'),
    events
);

const modal = new Modal(
    ensureElement<HTMLElement>('#modal-container'),
    events
);

const basket = new BasketView(
    cloneTemplate<HTMLElement>('#basket'),
    events
);

const orderForm = new OrderForm(
    cloneTemplate<HTMLFormElement>('#order'),
    events
);

const contactsForm = new ContactsForm(
    cloneTemplate<HTMLFormElement>('#contacts'),
    events
);

const success = new Success(
    cloneTemplate<HTMLElement>('#success'),
    events
);

let preview: CardPreview | null = null;
let isOrderSending = false;

function updatePreview(): void {
    const product = productsModel.getSelectedItem();

    if (!product || !preview) {
        return;
    }

    let buttonText = 'Купить';

    if (product.price === null) {
        buttonText = 'Недоступно';
    } else if (basketModel.hasItem(product.id)) {
        buttonText = 'Удалить из корзины';
    }

    preview.render({
        title: product.title,
        price: product.price,
        image: `${CDN_URL}${product.image}`,
        category: product.category,
        description: product.description,
        buttonText,
        disabled: product.price === null,
    });
}

function updateBasket(): void {
    const items = basketModel.getItems().map((product, index) => {
        const card = new CardBasket(
            cloneTemplate<HTMLElement>('#card-basket'),
            events.trigger('basket:remove', { id: product.id })
        );

        return card.render({
            index: index + 1,
            title: product.title,
            price: product.price,
        });
    });

    basket.render({
        items,
        total: basketModel.getTotal(),
    });

    page.render({
        counter: basketModel.getCount(),
    });
}

function updateForms(): void {
    const data = buyerModel.getData();
    const errors = buyerModel.validate();

    const orderErrors = [errors.payment, errors.address]
        .filter(Boolean)
        .join(' ');

    const contactsErrors = [errors.email, errors.phone]
        .filter(Boolean)
        .join(' ');

    orderForm.render({
        payment: data.payment ?? null,
        address: data.address ?? '',
        valid: !orderErrors,
        errors: orderErrors,
    });

    contactsForm.render({
        email: data.email ?? '',
        phone: data.phone ?? '',
        valid: !contactsErrors,
        errors: contactsErrors,
    });
}

// События моделей данных
events.on('products:changed', () => {
    const cards = productsModel.getItems().map((product) => {
        const card = new CardCatalog(
            cloneTemplate<HTMLElement>('#card-catalog'),
            events.trigger('product:select', { id: product.id })
        );

        return card.render({
            title: product.title,
            price: product.price,
            image: `${CDN_URL}${product.image}`,
            category: product.category,
        });
    });

    page.render({ catalog: cards });
});

events.on('product:selected', () => {
    const product = productsModel.getSelectedItem();

    if (!product) {
        return;
    }

    preview = new CardPreview(
        cloneTemplate<HTMLElement>('#card-preview'),
        events.trigger('product:action', { id: product.id })
    );

    updatePreview();
    modal.render({ content: preview.render() });
    modal.open();
});

events.on('basket:changed', () => {
    updateBasket();
    updatePreview();
});

events.on('buyer:changed', updateForms);

// События карточек и корзины
events.on<TProductEvent>('product:select', ({ id }) => {
    const product = productsModel.getItem(id);

    if (product) {
        productsModel.setSelectedItem(product);
    }
});

events.on<TProductEvent>('product:action', ({ id }) => {
    const product = productsModel.getItem(id);

    if (!product || product.price === null) {
        return;
    }

    if (basketModel.hasItem(id)) {
        basketModel.removeItem(product);
    } else {
        basketModel.addItem(product);
    }

    modal.close();
});

events.on<TProductEvent>('basket:remove', ({ id }) => {
    const product = basketModel.getItems().find((item) => item.id === id);

    if (product) {
        basketModel.removeItem(product);
    }
});

events.on('basket:open', () => {
    updateBasket();
    modal.render({ content: basket.render() });
    modal.open();
});

// Открытие форм
events.on('order:open', () => {
    if (basketModel.getCount() === 0) {
        return;
    }

    updateForms();
    modal.render({ content: orderForm.render() });
    modal.open();
});

events.on('order:submit', () => {
    const errors = buyerModel.validate();

    if (errors.payment || errors.address || basketModel.getCount() === 0) {
        return;
    }

    updateForms();
    modal.render({ content: contactsForm.render() });
    modal.open();
});

// Изменение данных покупателя
events.on<IFieldChange<TPayment>>('order.payment:change', ({ value }) => {
    buyerModel.setData({ payment: value });
});

events.on<IFieldChange>('order.address:change', ({ value }) => {
    buyerModel.setData({ address: value });
});

events.on<IFieldChange>('contacts.email:change', ({ value }) => {
    buyerModel.setData({ email: value });
});

events.on<IFieldChange>('contacts.phone:change', ({ value }) => {
    buyerModel.setData({ phone: value });
});

// Отправка заказа
events.on('contacts:submit', async () => {
    const errors = buyerModel.validate();
    const { payment, address, email, phone } = buyerModel.getData();

    if (
        isOrderSending ||
        basketModel.getCount() === 0 ||
        Object.keys(errors).length > 0 ||
        !payment || !address || !email || !phone
    ) {
        return;
    }

    const order: IOrder = {
        payment,
        address,
        email,
        phone,
        total: basketModel.getTotal(),
        items: basketModel.getItems().map((product) => product.id),
    };

    isOrderSending = true;

    try {
        const result = await webLarekApi.createOrder(order);

        basketModel.clear();
        buyerModel.clear();

        modal.render({
            content: success.render({ total: result.total }),
        });
        modal.open();
    } catch (error) {
        console.error('Ошибка оформления заказа:', error);
    } finally {
        isOrderSending = false;
    }
});

// Закрытие модального окна
events.on('modal:close-request', () => {
    modal.close();
});

events.on('success:close', () => {
    modal.close();
});

// Загрузка каталога
webLarekApi
    .getProducts()
    .then((data) => {
        productsModel.setItems(data.items);
    })
    .catch((error) => {
        console.error('Ошибка получения товаров с сервера:', error);
    });