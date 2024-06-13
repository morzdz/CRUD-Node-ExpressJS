const express = require("express");
const bodyParser = require("body-parser");
const argon2 = require("argon2");
const port = 3000;

const app = express();

app.use(bodyParser.json());

let users = [
    { id: 1, name: 'Alice', email: 'alice@example.com', password: 'motdepasseAlice' },
    { id: 2, name: 'Bob', email: 'bob@example.com', password: 'motdepasseBob' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', password: 'motdepasseCharlie' }
];

app.get("", (req, res) => {
    res.status(200).send("hello world")
})

app.get("/users", (req, res) => {
    res.status(200).send(users)
})

app.get("/users/:id", (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = users.find(u => u.id === userId);

    if (user) {
        res.status(200).send(user);
    } else {
        res.status(404).send({ message: 'Utlisateur non trouvé'});
    }
})

app.post("/users", async (req, res) => {
    try {
        const hashPassword = await argon2.hash(req.body.password);

        const newUser = {
            id: users.length + 1,
            name: req.body.name,
            email: req.body.email,
            password: hashPassword
        };

        users.push(newUser);
        res.status(201).send(newUser);
    } catch (err) {
        console.error('Erreur lors du hachage du mot de passe:', err);
        res.status(500).send({message : `Erreur lors de la création de l'utilisateur`})
    }
})

// const verifyPassword = (req, res) => {

//     try {

//     } catch (err) {
//         console.log(err);
//         return res.status(500)
//     }
// }

app.put("/users/:id", (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...req.body };
        res.status(200).send(users[userIndex]);
    } else {
        res.status(404).send({ message: 'Utlisateur non trouvé'});
    }
});

app.patch("/users/:id", (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...req.body };
        res.status(200).send(users[userIndex]);
    } else {
        res.status(404).send({ message: 'Utlisateur non trouvé'});
    }
});

app.delete("/users/:id", (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.status(200).send();
    } else {
        res.status(404).send({ message: 'Utlisateur non trouvé'});
    }
})

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
}); 