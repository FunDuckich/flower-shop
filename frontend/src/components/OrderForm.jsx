import React, {useState} from 'react';
import axios from 'axios';

const OrderForm = () => {
    const [addressId, setAddressId] = useState('');
    const [paymentMethodId, setPaymentMethodId] = useState('');
    const [token] = useState(localStorage.getItem('token') || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = () => {
        if (!token) {
            setError('Требуется авторизация');
            return;
        }
        setLoading(true);
        axios.post('http://localhost:8000/products/orders/',
            {address_id: parseInt(addressId), payment_method_id: parseInt(paymentMethodId)},
            {headers: {Authorization: `Bearer ${token}`}}
        )
            .then(response => {
                setError(null);
                alert('Заказ успешно оформлен');
            })
            .catch(err => setError('Ошибка оформления заказа: ' + err.response?.data?.detail || err.message))
            .finally(() => setLoading(false));
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p style={{color: 'red'}}>{error}</p>;

    return (
        <div className="order-form">
            <h1>Оформить заказ</h1>
            <div className="form-group">
                <label htmlFor="address">ID адреса:</label>
                <input
                    id="address"
                    type="number"
                    value={addressId}
                    onChange={e => setAddressId(e.target.value)}
                    placeholder="Введите ID адреса"
                />
            </div>
            <div className="form-group">
                <label htmlFor="payment">ID метода оплаты:</label>
                <input
                    id="payment"
                    type="number"
                    value={paymentMethodId}
                    onChange={e => setPaymentMethodId(e.target.value)}
                    placeholder="Введите ID метода оплаты"
                />
            </div>
            <button onClick={handleSubmit}>Оформить заказ</button>
        </div>
    );
};

export default OrderForm;