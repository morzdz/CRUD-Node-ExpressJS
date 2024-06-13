const express = require("express");
const bodyParser = require("body-parser");
const argon2 = require("argon2");
const port = 3000;

const app = express(); // Initialise une instance d'Express

app.use(bodyParser.json()); // Middleware pour parser les requêtes JSON

let users = [ // Tableau d'exemple d'utilisateurs
    { id: 1, name: 'Alice', email: 'alice@example.com', password: 'motdepasseAlice' },
    { id: 2, name: 'Bob', email: 'bob@example.com', password: 'motdepasseBob' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', password: 'motdepasseCharlie' }
];

// Endpoint GET pour la racine de l'API
app.get("", (req, res) => {
    res.status(200).send("hello world"); // Répond avec "hello world" et un statut 200
});

// Endpoint GET pour récupérer tous les utilisateurs
app.get("/users", (req, res) => {
    res.status(200).send(users); // Renvoie la liste complète des utilisateurs avec un statut 200
});

// Endpoint GET pour récupérer un utilisateur par son ID
app.get("/users/:id", (req, res) => {
    const userId = parseInt(req.params.id, 10); // Récupère l'ID de l'utilisateur depuis les paramètres de l'URL
    const user = users.find(u => u.id === userId); // Cherche l'utilisateur dans le tableau

    if (user) {
        res.status(200).send(user); // Renvoie l'utilisateur trouvé avec un statut 200
    } else {
        res.status(404).send({ message: 'Utilisateur non trouvé' }); // Renvoie un message si l'utilisateur n'est pas trouvé
    }
});

// Endpoint POST pour créer un nouvel utilisateur
app.post("/users", async (req, res) => {
    try {
        const hashPassword = await argon2.hash(req.body.password); // Hash du mot de passe fourni

        const newUser = {
            id: users.length + 1,
            name: req.body.name,
            email: req.body.email,
            password: hashPassword
        };

        users.push(newUser); // Ajoute le nouvel utilisateur au tableau
        res.status(201).send(newUser); // Renvoie le nouvel utilisateur créé avec un statut 201 (Created)
    } catch (err) {
        console.error('Erreur lors du hachage du mot de passe:', err);
        res.status(500).send({ message: `Erreur lors de la création de l'utilisateur` }); // Gestion des erreurs
    }
});

// Endpoint POST pour l'authentification de l'utilisateur
app.post("/login", async (req, res) => {
    const { email, password } = req.body; // Récupère email et mot de passe depuis le corps de la requête

    try {
        const user = users.find(u => u.email === email); // Recherche de l'utilisateur par email
        
        if (!user) {
            res.status(404).send({ message: `Utilisateur non trouvé` }); // Renvoie un message si l'utilisateur n'est pas trouvé
        }

        if (await argon2.verify(user.password, password)) {
            res.send({ message: 'Connexion réussie' }); // Renvoie un message de connexion réussie si le mot de passe correspond
        } else {
            res.status(401).send('Mot de passe incorrect'); // Renvoie un statut 401 si le mot de passe est incorrect
        }
        
    } catch (err) {
        console.error('Erreur lors de la vérification du mot de passe', err);
        res.status(500).send({ message: 'Erreur lors de la connexion' }); // Gestion des erreurs
    }
});

// Endpoint PUT pour mettre à jour un utilisateur existant par son ID
app.put("/users/:id", (req, res) => {
    const userId = parseInt(req.params.id, 10); // Récupère l'ID de l'utilisateur depuis les paramètres de l'URL
    const userIndex = users.findIndex((u) => u.id === userId); // Trouve l'index de l'utilisateur dans le tableau

    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...req.body }; // Met à jour les données de l'utilisateur avec celles fournies dans le corps de la requête
        res.status(200).send(users[userIndex]); // Renvoie l'utilisateur mis à jour avec un statut 200
    } else {
        res.status(404).send({ message: 'Utilisateur non trouvé' }); // Renvoie un message si l'utilisateur n'est pas trouvé
    }
});

// Endpoint PATCH pour mettre à jour partiellement un utilisateur existant par son ID
app.patch("/users/:id", (req, res) => {
    const userId = parseInt(req.params.id, 10); // Récupère l'ID de l'utilisateur depuis les paramètres de l'URL
    const userIndex = users.findIndex((u) => u.id === userId); // Trouve l'index de l'utilisateur dans le tableau

    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...req.body }; // Met à jour partiellement les données de l'utilisateur avec celles fournies dans le corps de la requête
        res.status(200).send(users[userIndex]); // Renvoie l'utilisateur mis à jour avec un statut 200
    } else {
        res.status(404).send({ message: 'Utilisateur non trouvé' }); // Renvoie un message si l'utilisateur n'est pas trouvé
    }
});

// Endpoint DELETE pour supprimer un utilisateur par son ID
app.delete("/users/:id", (req, res) => {
    const userId = parseInt(req.params.id, 10); // Récupère l'ID de l'utilisateur depuis les paramètres de l'URL
    const userIndex = users.findIndex((u) => u.id === userId); // Trouve l'index de l'utilisateur dans le tableau

    if (userIndex !== -1) {
        users.splice(userIndex, 1); // Supprime l'utilisateur du tableau
        res.status(200).send(); // Renvoie un statut 200 pour indiquer que l'utilisateur a été supprimé avec succès
    } else {
        res.status(404).send({ message: 'Utilisateur non trouvé' }); // Renvoie un message si l'utilisateur n'est pas trouvé
    }
});

// Écoute le serveur sur le port spécifié
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
