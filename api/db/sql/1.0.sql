CREATE TABLE groups
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE users
(
    id         SERIAL PRIMARY KEY,
    username   VARCHAR(50)  NOT NULL,
    password   VARCHAR(255) NOT NULL,
    first_name VARCHAR(50)  NOT NULL,
    last_name  VARCHAR(50)  NOT NULL,
    groups_id  INTEGER[]
);

CREATE TABLE allergens
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE menu_categories
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE menu_items
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255)   NOT NULL,
    description TEXT,
    price       DECIMAL(10, 2) NOT NULL,
    category_id INTEGER        NOT NULL REFERENCES menu_categories (id),
    allergens   INTEGER[],
    ingredients INTEGER[],
    weight      INTEGER
);

CREATE TABLE pizza_ingredients
(
    id     SERIAL PRIMARY KEY,
    name   VARCHAR(255)   NOT NULL,
    price  DECIMAL(10, 2) NOT NULL,
    weight INTEGER        NOT NULL
);

