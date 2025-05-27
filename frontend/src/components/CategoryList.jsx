import React, {useEffect, useState} from 'react';
import axios from 'axios';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [editCategory, setEditCategory] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:8000/categories/')
            .then(response => setCategories(response.data))
            .catch(err => setError('Ошибка загрузки категорий: ' + err.message))
            .finally(() => setLoading(false));
    }, []);

    const handleAddCategory = () => {
        if (!token) {
            setError('Требуется авторизация');
            return;
        }
        setLoading(true);
        axios.post('http://localhost:8000/categories/', {category_name: newCategory}, {
            headers: {Authorization: `Bearer ${token}`}
        })
            .then(response => {
                setCategories([...categories, response.data]);
                setNewCategory('');
            })
            .catch(err => setError('Ошибка добавления категории: ' + err.response?.data?.detail || err.message))
            .finally(() => setLoading(false));
    };

    const handleEditCategory = (category) => {
        if (!token) {
            setError('Требуется авторизация');
            return;
        }
        setLoading(true);
        axios.put(`http://localhost:8000/categories/${category.id}`, {category_name: newCategory}, {
            headers: {Authorization: `Bearer ${token}`}
        })
            .then(response => {
                setCategories(categories.map(cat => cat.id === category.id ? response.data : cat));
                setEditCategory(null);
            })
            .catch(err => setError('Ошибка редактирования: ' + err.response?.data?.detail || err.message))
            .finally(() => setLoading(false));
    };

    const handleDeleteCategory = (categoryId) => {
        if (!token) {
            setError('Требуется авторизация');
            return;
        }
        setLoading(true);
        axios.delete(`http://localhost:8000/categories/${categoryId}`, {
            headers: {Authorization: `Bearer ${token}`}
        })
            .then(() => {
                setCategories(categories.filter(cat => cat.id !== categoryId));
            })
            .catch(err => setError('Ошибка удаления: ' + err.response?.data?.detail || err.message))
            .finally(() => setLoading(false));
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p style={{color: 'red'}}>{error}</p>;

    return (
        <div className="category-list">
            <h1>Категории</h1>
            <div className="category-form">
                <input
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    placeholder="Новая категория"
                />
                <button onClick={handleAddCategory}>Добавить категорию</button>
            </div>
            <ul>
                {categories.map(category => (
                    <li key={category.id}>
                        {editCategory === category.id ? (
                            <div className="edit-form">
                                <input
                                    value={newCategory}
                                    onChange={e => setNewCategory(e.target.value)}
                                    placeholder="Новое название"
                                />
                                <button onClick={() => handleEditCategory(category)}>Сохранить</button>
                                <button onClick={() => setEditCategory(null)}>Отмена</button>
                            </div>
                        ) : (
                            <>
                                <span>{category.category_name}</span>
                                <div className="actions">
                                    <button onClick={() => {
                                        setEditCategory(category.id);
                                        setNewCategory(category.category_name);
                                    }}>
                                        Редактировать
                                    </button>
                                    <button className="delete" onClick={() => handleDeleteCategory(category.id)}>
                                        Удалить
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;