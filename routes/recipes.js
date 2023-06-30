const express = require("express");
const api = require("../api");
const db = require("../db");
const { NotFoundError } = require("../expressError");


const router = express.Router();


async function fetchAndStoreRecipes(apiParams) {
    const response = await api.get("/recipes/complexSearch", {
        params: apiParams,
        headers: {
            Accept: "application/json",
        },
    });
    // Fetch recipes from the api
    const apiRecipes = response.data.results.map((recipe) => ({
        id: recipe.id,
        title: recipe.title,
        description: recipe.summary
            ? recipe.summary
                .replace(/<\/?b>/g, "")
                .replace(/<\/?a(?:\s+href="([^"]+)")?>/g, "")
            : "No description available",
        image: recipe.image,
    }));

    // Insert recipes to the database
    for (const recipe of apiRecipes) {
        await db.query(
            `INSERT INTO recipes (id, title, description, image)
       VALUES ($1, $2, $3, $4)`,
            [recipe.id, recipe.title, recipe.description, recipe.image]
        );
    }

    const dbRecipes = await db.query("SELECT * FROM recipes");

    return { apiRecipes, dbRecipes };
}

/** GET /recipes => { recipes: [{ recipe1 }, { recipe2 }, ...] }
 *
 * Returns a list of all recipes.
 * 
 **/

router.get("/", async function (req, res, next) {
    try {
        // Fetch recipes from the database
        const dbRecipes = await db.query("SELECT * FROM recipes");

        // If there are recipes in the database, return them
        if (dbRecipes.rows.length > 0) {
            return res.json({ recipes: dbRecipes.rows });
        }

        // If no recipes found in the database, fetch from the Spoonacular API
        const apiParams = {
            number: 10,
        };

        const updatedDbRecipes = await fetchAndStoreRecipes(apiParams);

        // Set the Cache-Control header to disable caching
        res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");

        return res.json({ recipes: updatedDbRecipes });
    } catch (err) {
        if (err.response && err.response.status === 404) {
            throw new NotFoundError("Recipe not found");
        }
        return next(err);
    }
});


/** GET /recipes/search => { recipes: [{ recipe1 }, { recipe2 }, ...] }
 *
 * Returns a list of recipes that include a specified search.
 **/
router.get("/search", async function (req, res, next) {
    const { query } = req.query;

    try {
        const searchQuery = `%${query}%`;

        const dbRecipes = await db.query(
            `SELECT * FROM recipes WHERE title ILIKE $1`,
            [searchQuery]
        );

        if (dbRecipes.rows.length > 0) {
            return res.json({ recipes: dbRecipes.rows });
        } else {
            return res.json({ recipes: [] });
        }
    } catch (err) {
        return next(err);
    }
});

/** GET /recipes/gluten => { recipes: [{ recipe1 }, { recipe2 }, ...] }
 *
 * Returns a list of gluten free recipes.
 **/
router.get("/gluten", async function (req, res, next) {
    try {

        const apiParams = {
            intolerances: "gluten",
            number: 20,
        };

        const { apiRecipes, dbRecipes } = await fetchAndStoreRecipes(apiParams);

        res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");

        return res.json({ apiRecipes, dbRecipes });
    } catch (err) {
        if (err.response && err.response.status === 404) {
            throw new NotFoundError("Recipe not found");
        }
        return next(err);
    }
});



/** GET /recipes/dairy => { recipes: [{ recipe1 }, { recipe2 }, ...] }
 *
 * Returns a list of dairy free recipes.
 **/

router.get("/dairy", async function (req, res, next) {
    try {
        const apiParams = {
            intolerances: "dairy",
            number: 20,
        };

        const { apiRecipes, dbRecipes } = await fetchAndStoreRecipes(apiParams);

        res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");

        return res.json({ apiRecipes, dbRecipes });
    } catch (err) {
        if (err.response && err.response.status === 404) {
            throw new NotFoundError("Recipe not found");
        }
        return next(err);
    }
});

/** GET /recipes/breakfast => { recipes: [{ recipe1 }, { recipe2 }, ...] }
 *
 * Returns a list of breakfast recipes.
 **/
router.get("/breakfast", async function (req, res, next) {
    try {
        const apiParams = {
            type: "breakfast",
            number: 20,
        };

        const { apiRecipes, dbRecipes } = await fetchAndStoreRecipes(apiParams);

        res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");

        return res.json({ apiRecipes, dbRecipes });
    } catch (err) {
        if (err.response && err.response.status === 404) {
            throw new NotFoundError("Recipe not found");
        }
        return next(err);
    }
});



/** GET /recipes/maincourse => { recipes: [{ recipe1 }, { recipe2 }, ...] }
 *
 * Returns a list of maincourse recipes.
 **/

router.get("/maincourse", async function (req, res, next) {
    try {
        const apiParams = {
            type: "main course",
            number: 20,
        };

        const { apiRecipes, dbRecipes } = await fetchAndStoreRecipes(apiParams);

        res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");

        return res.json({ apiRecipes, dbRecipes });
    } catch (err) {
        if (err.response && err.response.status === 404) {
            throw new NotFoundError("Recipe not found");
        }
        return next(err);
    }
});


/** GET /recipes/:id => { recipe }
 *
 * Returns the recipe with the given ID.
 **/
router.get("/:id", async function (req, res, next) {
    try {
        const id = req.params.id;

        const response = await api.get(`/recipes/${id}/information`);

        const recipe = {
            id: response.data.id,
            title: response.data.title,
            description: response.data.summary
                .replace(/<\/?b>/g, "")
                .replace(/<\/?a(?:\s+href="([^"]+)")?>/g, ""),
            image: response.data.image,
            ingredients: response.data.extendedIngredients.map((ingredient) => ingredient.original),
            instructions: response.data.instructions ? response.data.instructions
                .replace(/<[^>]+>/g, "")
                .split("\n") : [],
        };

        // Make a separate request to fetch the recipe's nutrition label as an HTML widget
        const nutritionResponse = await api.get(`/recipes/${id}/nutritionLabel`, {
            headers: {
                Accept: "text/html",
            },
        });

        const nutritionLabelWidget = nutritionResponse.data;

        // Include the nutrition label widget in the response
        recipe.nutritionLabelWidget = nutritionLabelWidget;

        return res.json({ recipe });
    } catch (err) {
        if (err.response && err.response.status === 404) {
            return res.status(404).json({ error: "Recipe not found" });
        }
        return next(err);
    }
});



module.exports = router;
