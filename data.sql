USE usinepapier;

-- Insérer des clients
INSERT INTO usinepapier.clients (nom, prenom, email, adresse, code_postal, num_telephone) VALUES
('Dupont', 'Jean', 'jean.dupont@example.com', '12 Rue des Fleurs, Paris', 75012, '0601020304'),
('Martin', 'Sophie', 'sophie.martin@example.com', '5 Avenue du Soleil, Lyon', 69003, '0611121314'),
('Durand', 'Paul', 'paul.durand@example.com', '8 Rue de la Paix, Marseille', 13006, '0622232425'),
('Bernard', 'Elise', 'elise.bernard@example.com', '3 Place de la République, Toulouse', 31000, '0633343536'),
('Morel', 'Lucas', 'lucas.morel@example.com', '10 Boulevard des Arts, Bordeaux', 33000, '0644454647');

-- Insérer des fournisseurs
INSERT INTO fournisseurs (nom_entreprise, email, num_telephone) VALUES
('Papier France', 'contact@papierfrance.com', '0123456789'),
('World Paper Co.', 'info@worldpaperco.com', '0134567890'),
('Eco Papier', 'support@ecopapier.com', '0145678901'),
('Paper Solutions', 'sales@papersolutions.com', '0156789012');

-- Insérer des catégories
INSERT INTO categories (nom) VALUES
('Papier A4'),
('Carton'),
('Papier recyclé'),
('Cahiers'),
('Stylos');

-- Insérer des produits
INSERT INTO produits (id_categorie, nom, description, prix_unitaire, quantite) VALUES
(1, 'Papier A4 Premium', 'Papier blanc de haute qualité, grammage 80g/m²', 5.99, 500),
(2, 'Carton ondulé', 'Carton résistant pour emballage', 12.50, 200),
(3, 'Papier recyclé A4', 'Papier écologique fabriqué à partir de matériaux recyclés', 4.99, 300),
(4, 'Cahier ligné 96 pages', 'Cahier standard pour prise de notes', 2.49, 100),
(5, 'Stylo bille bleu', 'Stylo bille de marque renommée', 0.99, 500);

-- Insérer les relations entre fournisseurs et produits
INSERT INTO fournisseur_produit (id_fournisseur, id_produit) VALUES
(1, 1),
(1, 3),
(2, 2),
(3, 4),
(4, 5);

-- Insérer des commandes
INSERT INTO commandes (id_client, date_commande, date_expidition) VALUES
(1, '2024-02-01', '2024-02-03'),
(2, '2024-02-05', '2024-02-07'),
(3, '2024-02-10', '2024-02-12');

-- Insérer des lignes de commande
INSERT INTO ligne_commande (id_produit, id_commande, quantite, prix) VALUES
(1, 1, 10, 5.99),
(2, 1, 5, 12.50),
(3, 2, 20, 4.99),
(4, 3, 5, 2.49),
(5, 3, 10, 0.99);