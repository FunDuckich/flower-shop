import {BrowserRouter as Router, Route, Routes, Link, useNavigate, Navigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import CategoryList from './components/CategoryList';
import ProductList from './components/ProductList';
import OrderForm from './components/OrderForm';
import axios from 'axios';

function Login({setUser}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const navigate = useNavigate();

    const handleLogin = () => {
        axios.post('http://localhost:8000/auth/token', {
            username: username,
            password: password
        }, {
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
            .then(response => {
                const newToken = response.data.access_token;
                setToken(newToken);
                localStorage.setItem('token', newToken);
                axios.get('http://localhost:8000/auth/me', {
                    headers: {Authorization: `Bearer ${newToken}`}
                })
                    .then(res => {
                        setUser(res.data);
                        navigate('/products');
                    })
                    .catch(error => alert('Ошибка получения данных пользователя: ' + (error.response?.data?.detail || error.message)));
            })
            .catch(error => alert('Ошибка входа: ' + (error.response?.data?.detail || error.message)));
    };

    const handleRegister = () => {
        axios.post('http://localhost:8000/auth/register', {
            client_name: username,
            password: password
        })
            .then(() => alert('Регистрация успешна, теперь войдите'))
            .catch(error => alert('Ошибка регистрации: ' + (error.response?.data?.detail || error.message)));
    };

    return (
        <div className="login-form">
            <h1>Вход или регистрация</h1>
            <div className="form-group">
                <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Имя пользователя"
                />
            </div>
            <div className="form-group">
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Пароль"
                />
            </div>
            <button onClick={handleLogin}>Войти</button>
            <button onClick={handleRegister}>Зарегистрироваться</button>
            {token && <p>Токен: {token}</p>}
        </div>
    );
}

function App() {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.defaults.headers.Authorization = token ? `Bearer ${token}` : null;
        if (token && !user) {
            axios.get('http://localhost:8000/auth/me')
                .then(res => setUser(res.data))
                .catch(() => {
                    setToken('');
                    localStorage.removeItem('token');
                });
        }
    }, [token]);

    return (
        <Router>
            <div className="App">
                <nav className="navbar">
                    <Link to="/products">Товары</Link>
                    {user?.is_admin && <Link to="/categories">Категории</Link>}
                    <Link to="/order">Оформить заказ</Link>
                    {!token && <Link to="/login">Вход</Link>}
                    {token && <button onClick={() => {
                        setToken('');
                        setUser(null);
                        localStorage.removeItem('token');
                    }}>Выйти</button>}
                </nav>
                <Routes>
                    <Route path="/login" element={<Login setUser={setUser}/>}/>
                    <Route path="/" element={token ? <Navigate to="/products"/> : <Navigate to="/login"/>}/>
                    <Route path="/products" element={<ProductList/>}/>
                    <Route path="/categories"
                           element={user?.is_admin ? <CategoryList/> : <p>Доступ только для администраторов</p>}/>
                    <Route path="/order" element={<OrderForm/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;