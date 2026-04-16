CREATE DATABASE IF NOT EXISTS cybelia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cybelia;

CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(20) NOT NULL
);

CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL
);

CREATE TABLE utilisateurs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE produits (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    prix DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    categorie_id INT NOT NULL,
    FOREIGN KEY (categorie_id) REFERENCES categories(id)
);

CREATE TABLE commandes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    utilisateur_id INT NOT NULL,
    montant_total DECIMAL(10, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
);

CREATE TABLE lignes_commande (
    id INT PRIMARY KEY AUTO_INCREMENT,
    commande_id INT NOT NULL,
    produit_id INT NOT NULL,
    quantite INT NOT NULL,
    prix_unitaire DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE,
    FOREIGN KEY (produit_id) REFERENCES produits(id)
);

-- Données de référence
INSERT INTO roles (nom) VALUES ('admin'), ('client');
INSERT INTO categories (nom) VALUES ('Carte postale'), ('Affiche');