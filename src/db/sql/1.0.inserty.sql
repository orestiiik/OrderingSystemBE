INSERT INTO groups (name)
VALUES ('admin'),
       ('supervisor'),
       ('worker');

INSERT INTO users (username, password, first_name, last_name, groups_id)
VALUES ('admin', 'admin123', 'Admin', 'Admin', '{1}'),
       ('supervisor', 'supervisor123', 'Super', 'Visor', '{2}'),
       ('worker', 'worker123', 'John', 'Doe', '{3}');

iNSERT INTO allergens (name)
VALUES ('Obilniny obsahujúce lepok'),
       ('Kôrovce'),
       ('Vajcia'),
       ('Ryby'),
       ('Arašidy'),
       ('Sójové zrná'),
       ('Mlieko'),
       ('Orechy'),
       ('Zeler'),
       ('Horčica'),
       ('Sezamové semená'),
       ('Oxid siričitý a siričitany'),
       ('Vlčie bôby');

INSERT INTO menu_categories (name, description)
VALUES ('Pizza', 'Neodolateľné kruhové chutné placky s rôznymi prísadami.'),
       ('Cestoviny', 'Široká škála cestovín s rôznymi omáčkami.'),
       ('Šaláty', 'Svieže a zdravé šaláty s rôznymi dressingmi.');

INSERT INTO pizza_ingredients (name, price, weight)
VALUES ('Mozzarella', 1.50, 100),
       ('Parmezán', 2.00, 50),
       ('Šunka', 1.80, 80),
       ('Šampiňóny', 1.20, 60),
       ('Olivy', 1.00, 30),
       ('Ananás', 1.50, 50),
       ('Šalámová Saláma', 2.00, 70),
       ('Klobása', 1.80, 60),
       ('Cibuľa', 0.50, 30),
       ('Korenie', 0.20, 10),
       ('Origano', 0.30, 5),
       ('Kukurica', 1.00, 50),
       ('Paprika', 0.80, 30),
       ('Chilli', 0.50, 10),
       ('Krevety', 2.50, 50),
       ('Losos', 3.00, 80),
       ('Bazalka', 0.40, 5);

INSERT INTO menu_items (name, description, price, category_id, allergens, ingredients, weight)
VALUES ('Margaréta', 'Klasická pizza s paradajkovou omáčkou a syrom', 6.50, 1, '{1}', '{1}', 400),
       ('Šunková', 'Pizza s paradajkovou omáčkou, syrom a šunkou', 7.50, 1, '{1}', '{1,2}', 450),
       ('Hawaii', 'Pizza s paradajkovou omáčkou, syrom, šunkou a ananásom', 8.50, 1, '{1}', '{1,2,3}', 500),
       ('Vegetariánska', 'Pizza s paradajkovou omáčkou, syrom a zeleninou', 9.50, 1, '{1,2}', '{1,2,4}', 450),
       ('Capricciosa', 'Pizza s paradajkovou omáčkou, syrom, šunkou, šampiňónmi a olivami', 10.50, 1, '{1,2}',
        '{1,2,3,4,5}', 500);