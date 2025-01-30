const express = require('express');
const mysql = require('mysql2/promise');
const fs = require('fs');

const app = express();
app.use(express.json());

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    multipleStatements: true
};

const executeSQLFile = async (connection, filePath) => {
    const sql = fs.readFileSync(filePath, 'utf8');
    await connection.query(sql);
    console.log(`${filePath} exécuté avec succès`);
};

const initDB = async () => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connexion à MySQL réussie');

        await connection.changeUser({ database: 'usinepapier' });

        console.log('Base de données initialisée avec succès');
        return connection;
    } catch (err) {
        console.error('Erreur lors de l\'initialisation de la base de données :', err);
        process.exit(1);
    }
};

initDB().then(connection => {

    //Clients
    app.get('/clients', async (req, res) => {
        const [result] = await connection.query('SELECT * FROM clients');
        res.json(result);
    });

    app.post('/clients', async (req, res) => {
        const { nom, prenom, email, adresse, code_postal, num_telephone } = req.body;
        const sql = 'INSERT INTO clients (nom, prenom, email, adresse, code_postal, num_telephone) VALUES (?, ?, ?, ?,?,?)';
        await connection.query(sql, [nom, prenom, email, adresse, code_postal, num_telephone]);
        res.status(201).json({ message: 'Client ajouté avec succès' });
    });

    app.put('/clients/:id', async (req, res) => {
        const { nom, prenom, email, adresse, code_postal, num_telephone } = req.body;
        const sql = 'UPDATE vehicules SET nom = ?, prenom = ?, email = ?, adresse = ?, code_postal = ? , num_telephone = ? WHERE id_client = ?';
        await connection.query(sql, [nom, prenom, email, adresse, code_postal, num_telephone, req.params.id]);
        res.json({ message: 'client mis à jour avec succès' });
    });

    app.delete('/clients/:id', async (req, res) => {
        await connection.query('DELETE FROM clients WHERE id_client = ?', [req.params.id]);
        res.json({ message: 'client supprimé avec succès' });
    });


    // Fournisseur

    app.get('/fournisseurs', async (req, res) => {
        const [result] = await connection.query('SELECT * FROM fournisseurs');
        res.json(result);
    });

    app.post('/fournisseurs', async (req, res) => {
        const { nom_entreprise, email, num_telephone } = req.body;
        const sql = 'INSERT INTO fournisseurs (nom_entreprise, email, num_telephone) VALUES (?, ?, ?, ?,?,?)';
        await connection.query(sql, [nom_entreprise, email, num_telephone]);
        res.status(201).json({ message: 'fournisseurs ajouté avec succès' });
    });

    app.put('/fournisseurs/:id', async (req, res) => {
        const { nom_entreprise, email, num_telephone } = req.body;
        const sql = 'UPDATE fournisseurs SET nom_entreprise = ?, email = ?, num_telephone = ? WHERE id_fournisseur = ?';
        await connection.query(sql, [nom_entreprise, email, num_telephone, req.params.id]);
        res.json({ message: 'fournisseurs mis à jour avec succès' });
    });

    app.delete('/fournisseurs/:id', async (req, res) => {
        await connection.query('DELETE FROM fournisseurs WHERE id_fournisseur = ?', [req.params.id]);
        res.json({ message: 'fournisseurs supprimé avec succès' });
    });

    // Categories

    app.get('/categories', async (req, res) => {
        const [result] = await connection.query('SELECT * FROM categories');
        res.json(result);
    });

    app.post('/categories', async (req, res) => {
        const { nom } = req.body;
        const sql = 'INSERT INTO categories (nom) VALUES (?)';
        await connection.query(sql, [nom]);
        res.status(201).json({ message: 'categories ajouté avec succès' });
    });

    app.put('/categories/:id', async (req, res) => {
        const { nom } = req.body;
        const sql = 'UPDATE categories SET nom = ? WHERE id_categories = ?';
        await connection.query(sql, [nom, req.params.id]);
        res.json({ message: 'categories mis à jour avec succès' });
    });

    app.delete('/categories/:id', async (req, res) => {
        await connection.query('DELETE FROM categories WHERE id_categories = ?', [req.params.id]);
        res.json({ message: 'categories supprimé avec succès' });
    });

    // Produits

    app.get('/produits', async (req, res) => {
        const [result] = await connection.query('SELECT p.*, c.nom categorie  FROM produits p\n' +
            'JOIN usinepapier.categories c on p.id_categorie = c.id_categories ');
        res.json(result);
    });

    app.post('/produits', async (req, res) => {
        const { id_categorie, nom, description, prix_unitaire, quantite } = req.body;
        const sql = 'INSERT INTO produits (id_categorie, nom, description, prix_unitaire, quantite) VALUES (?,?,?,?,?)';
        await connection.query(sql, [id_categorie, nom, description, prix_unitaire, quantite]);

        await connection.beginTransaction();

        // Insertion dans la table produits
        const [resultProduit] = await connection.execute(`INSERT INTO produits (id_categorie, nom, description, prix_unitaire, quantite) VALUES (?, ?, ?, ?, ?)`,
            [produit.id_categorie, produit.nom, produit.description, produit.prix_unitaire, produit.quantite]);

        const produitId = resultProduit.insertId;
        console.log(`Produit inséré avec succès, ID : ${produitId}`);

        // Insertion dans la table fournisseur_produit
        await connection.execute(
            `INSERT INTO fournisseur_produit (id_fournisseur, id_produit, prix_propose, quantite_disponible) VALUES (?, ?, ?, ?)`,
            [fournisseurId, produitId, prixPropose, quantiteDisponible]
        );
        await connection.commit();
        console.log(`Relation fournisseur-produit ajoutée avec succès.`);
        res.status(201).json({ message: 'produit ajouté avec succès' });
    });

    app.put('/produits/:id', async (req, res) => {
        const { id_categorie, nom, description, prix_unitaire, quantite } = req.body;
        const sql = 'UPDATE produits SET id_categorie = ?, nom = ?, description = ?, prix_unitaire = ?, quantite = ? WHERE id_categories = ?';
        await connection.query(sql, [id_categorie, nom, description, prix_unitaire, quantite, req.params.id]);
        res.json({ message: 'produit mis à jour avec succès' });
    });

    app.delete('/produits/:id', async (req, res) => {
        await connection.query('DELETE FROM produits WHERE id_produit = ?', [req.params.id]);
        res.json({ message: 'produit supprimé avec succès' });
    });

    // Fournisseur_produit


    // Commandes

    app.get('/commandes', async (req, res) => {
        const [result] = await connection.query('SELECT l.id_ligne_commande, l.quantite, l.prix, p.nom as nom_produit, c2.nom as nom_client, c2.email FROM ligne_commande l\n' +
            'JOIN usinepapier.commandes c on c.id_commande = l.id_commande\n' +
            'JOIN usinepapier.clients c2 on c2.id_client = c.id_client\n' +
            'JOIN usinepapier.produits p on p.id_produit = l.id_produit');
        res.json(result);
    });

    app.post('/commandes', async (req, res) => {
        const { id_client, id_ligne_commande, date_commande, date_expidition } = req.body;
        const sql = 'INSERT INTO commandes (id_client, id_ligne_commande, date_commande, date_expidition) VALUES (?, ?, ?, ?)';
        await connection.query(sql, [id_client, id_ligne_commande, date_commande, date_expidition]);
        res.status(201).json({ message: 'commandes ajouté avec succès' });
    });

    app.put('/commandes/:id', async (req, res) => {
        const { id_client, id_ligne_commande, date_commande, date_expidition } = req.body;
        const sql = 'UPDATE commandes SET id_client = ?, id_ligne_commande = ?, date_commande = ?, date_expidition = ? WHERE id_commande = ?';
        await connection.query(sql, [id_client, id_ligne_commande, date_commande, date_expidition, req.params.id]);
        res.json({ message: 'commandes mis à jour avec succès' });
    });

    app.delete('/commandes/:id', async (req, res) => {
        await connection.query('DELETE FROM commandes WHERE id = ?', [req.params.id]);
        res.json({ message: 'commandes supprimé avec succès' });
    });


    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur le port ${PORT}`);
    });
});