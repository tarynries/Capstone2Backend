
CREATE TABLE recipes (
  id INTEGER,
  recipe_id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT NOT NULL,
  image VARCHAR(255),
  meal_category_id INTEGER REFERENCES meal_categories(meal_category_id)
);

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);


CREATE TABLE jokes (
  id SERIAL PRIMARY KEY,
  text VARCHAR(255)
);
