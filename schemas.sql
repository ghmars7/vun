CREATE DATABASE IF NOT EXISTS usinepapier;

USE usinepapier;

CREATE TABLE clients
(
    id_client     INT AUTO_INCREMENT PRIMARY KEY,
    nom           VARCHAR(55),
    prenom        VARCHAR(55),
    email         VARCHAR(55),
    adresse       VARCHAR(110),
    code_postal   INT,
    num_telephone VARCHAR(55)
);

CREATE TABLE fournisseurs
(
    id_fournisseur INT AUTO_INCREMENT PRIMARY KEY,
    nom_entreprise VARCHAR(55),
    email          VARCHAR(55),
    num_telephone  VARCHAR(55)
);

CREATE TABLE categories
(
    id_categories INT AUTO_INCREMENT PRIMARY KEY,
    nom           VARCHAR(55)
);

CREATE TABLE produits
(
    id_produit     INT AUTO_INCREMENT PRIMARY KEY,
    id_categorie   INT,
    nom            VARCHAR(55),
    description    TEXT,
    prix_unitaire  DECIMAL(2),
    quantite       INT,
    FOREIGN KEY (id_categorie) REFERENCES categories (id_categories),
);

CREATE TABLE fournisseur_produit
(
    id_fournisseur INT,
    id_produit     INT,
    PRIMARY KEY (id_fournisseur, id_produit),
    FOREIGN KEY (id_fournisseur) REFERENCES fournisseurs (id_fournisseur) ON DELETE CASCADE,
    FOREIGN KEY (id_produit) REFERENCES produits (id_produit) ON DELETE CASCADE
);

CREATE TABLE commandes
(
    id_commande       INT AUTO_INCREMENT PRIMARY KEY,
    id_client         INT,
    id_ligne_commande INT,
    date_commande     DATE,
    date_expidition   DATE,
    FOREIGN KEY (id_client) REFERENCES clients (id_client)
);

CREATE TABLE ligne_commande
(
    id_ligne_commande INT AUTO_INCREMENT PRIMARY KEY,
    id_produit        INT,
    id_commande       INT,
    quantite          INT,
    prix              DECIMAL(2),
    FOREIGN KEY (id_commande) REFERENCES commandes (id_commande),
    FOREIGN KEY (id_produit) REFERENCES produits (id_produit)
);



