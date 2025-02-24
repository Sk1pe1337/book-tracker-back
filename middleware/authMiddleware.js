const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token = null;

  // Проверяем заголовок Authorization (Bearer Token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // Проверяем httpOnly cookie
  else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // Если токена нет – отказ в доступе
  if (!token) {
    console.warn('⚠️ No token provided.');
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  // Проверяем, установлен ли секретный ключ
  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is missing in .env file.');
    return res.status(500).json({ message: 'Internal Server Error: Missing JWT_SECRET' });
  }

  try {
    // Декодируем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Добавляем пользователя в `req`
    
    // ✅ Продолжаем выполнение запроса
    next();
  } catch (error) {
    console.error('❌ JWT verification failed:', error.message);
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

module.exports = { protect };
