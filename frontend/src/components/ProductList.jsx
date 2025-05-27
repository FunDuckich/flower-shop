import React, {useEffect, useState} from 'react';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:8000/categories/')
            .then(response => setCategories(response.data))
            .catch(err => setError('Ошибка загрузки категорий: ' + err.message))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = {
            skip: (page - 1) * limit,
            limit: limit
        };
        if (selectedCategory) params.category_id = selectedCategory;
        axios.get('http://localhost:8000/products/', {params})
            .then(response => setProducts(response.data))
            .catch(err => setError('Ошибка загрузки товаров: ' + err.message))
            .finally(() => setLoading(false));
    }, [selectedCategory, page, limit]);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p style={{color: 'red'}}>{error}</p>;

    return (
        <div className="product-list">
            <h1>Товары</h1>
            <div className="filter">
                <label htmlFor="category">Фильтр по категории: </label>
                <select
                    id="category"
                    value={selectedCategory}
                    onChange={e => {
                        setSelectedCategory(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">Все категории</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.category_name}
                        </option>
                    ))}
                </select>
            </div>
            <ul>
                {products.length === 0 ? (
                    <li>Нет товаров</li>
                ) : (
                    products.map(product => (
                        <li key={product.id}>
                            <strong>{product.product_name}</strong>
                            <p>{product.description || 'Нет описания'}</p>
                            <p>На складе: {product.available_amount}</p>
                        </li>
                    ))
                )}
            </ul>
            <div className="pagination">
                <button
                    onClick={() => setPage(page => Math.max(page - 1, 1))}
                    disabled={page === 1}
                >
                    Предыдущая страница
                </button>
                <span>Страница {page}</span>
                <button
                    onClick={() => setPage(page => page + 1)}
                    disabled={products.length < limit}
                >
                    Следующая страница
                </button>
            </div>
        </div>
    );
};

export default ProductList;