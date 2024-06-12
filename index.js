const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require('cors');

// Configuración de body-parser para manejar datos POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'b0hzslljgil9xkwaf0np-mysql.services.clever-cloud.com',
    user: 'uwy46ggoxj7fmctg', // reemplaza con tu usuario de MySQL
    password: 'jz1cVX7mzRdKfqfa7tgl', // reemplaza con tu contraseña de MySQL
    database: 'b0hzslljgil9xkwaf0np' // reemplaza con tu base de datos de MySQL
});

// Conexión a la base de datos
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Ruta para el registro de usuario
app.post('/registro', (req, res) => {
    const { nombreUsuario, contraseña } = req.body;
    const sql = 'INSERT INTO usuarios (nombreUsuario, contraseña) VALUES (?, ?)';
    db.query(sql, [nombreUsuario, contraseña], (err, result) => {
        if (err) {
            console.error('Error al insertar en la base de datos:', err);
            res.status(500).send('Error al registrar usuario');
        } else {
            res.send('Usuario registrado');
        }
    });
});

// Ruta de inicio de sesión
/* app.post('/login', (req, res) => {
    const { nombreUsuario, contraseña } = req.body;
    const query = 'SELECT * FROM usuarios WHERE nombreUsuario = ? AND contraseña = ?';

    db.query(query, [nombreUsuario, contraseña], (err, results) => {
        if (err) {
            return res.status(500).send('Error en el servidor');
        }
        if (results.length > 0) {
            res.status(200).send('Login exitoso');
        } else {
            res.status(401).send('Usuario o contraseña incorrectos');
        }
    });
});
 */
app.post('/login', (req, res) => {
    const { nombreUsuario, contraseña } = req.body;
    const query = 'SELECT * FROM usuarios WHERE nombreUsuario = ? AND contraseña = ?';

    db.query(query, [nombreUsuario, contraseña], (err, results) => {
        if (err) {
            return res.status(500).send('Error en el servidor');
        }
        if (results.length > 0) {
            res.status(200).json({ message: 'Login exitoso', usuario: nombreUsuario });
        } else {
            res.status(401).send('Usuario o contraseña incorrectos');
        }
    });
});

app.get('/usuarios', (req, res) => {
    const query = 'SELECT nombreUsuario FROM usuarios';

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send('Error en el servidor');
        }
        res.json(results);
    });
});

app.post('/enviarMensaje', (req, res) => {
    const { emisor, receptor, mensaje } = req.body;
    const query = 'INSERT INTO mensajes (emisor, receptor, mensaje) VALUES (?, ?, ?)';

    db.query(query, [emisor, receptor, mensaje], (err, results) => {
        if (err) {
            return res.status(500).send('Error en el servidor');
        }
        res.status(200).send('Mensaje enviado');
    });
});

app.get('/mensajes/:usuario', (req, res) => {
    const { usuario } = req.params;
    const query = 'SELECT emisor, mensaje FROM mensajes WHERE receptor = ?';

    db.query(query, [usuario], (err, results) => {
        if (err) {
            return res.status(500).send('Error en el servidor');
        }
        res.json(results);
    });
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});
