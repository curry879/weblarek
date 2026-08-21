import { IBuyer, TPayment } from '../../types';

export class Buyer {
    private payment: TPayment | null = null;
    private address = '';
    private email = '';
    private phone = '';

    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) {
            this.payment = data.payment;
        }

        if (data.address !== undefined) {
            this.address = data.address;
        }

        if (data.email !== undefined) {
            this.email = data.email;
        }

        if (data.phone !== undefined) {
            this.phone = data.phone;
        }
    }

    getData(): Partial<IBuyer> {
        const data: Partial<IBuyer> = {
            address: this.address,
            email: this.email,
            phone: this.phone,
        };

        if (this.payment !== null) {
            data.payment = this.payment;
        }

        return data;
    }

    clear(): void {
        this.payment = null;
        this.address = '';
        this.email = '';
        this.phone = '';
    }

    validate(): Partial<Record<keyof IBuyer, string>> {
        const errors: Partial<Record<keyof IBuyer, string>> = {};

        if (!this.payment) {
            errors.payment = 'Не выбран вид оплаты';
        }

        if (!this.address.trim()) {
            errors.address = 'Укажите адрес доставки';
        }

        if (!this.email.trim()) {
            errors.email = 'Укажите email';
        }

        if (!this.phone.trim()) {
            errors.phone = 'Укажите телефон';
        }

        return errors;
    }
}