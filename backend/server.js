const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const SECRET = "seu_segredo_aqui";

const users = {
    id: 1,
    email: "admin@prefeitura.com",
    password: "123456",
    name: "software manager"
};

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Token não enviado" });

    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido" });
    }
}


app.post("/login", (req, res) => {
    const { email, password } = req.body;
    
    if (email === users.email && password === users.password) {

        const token = jwt.sign(
            { id: users.id, email: users.email }, SECRET, 
            { expiresIn: "1h" }
        );
        return res.json({ token });
    }
    return res.status(401).json({ message: "credenciais invalidas" });
});

app.get("/me", authMiddleware, (req, res) => {

    setTimeout(() => {
        res.json({ 
            id: req.user.id, 
            email: req.user.email, 
            name: users.name 
        });
    }, 2000);
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
}); 