const Recipe = require("./models/recipe");
const mongoose = require("mongoose");

require("dotenv").config();

const bread = require("./data/bread.json");
const biscuits = require("./data/biscuits.json");
const cake = require("./data/cake.json");
const burrito = require("./data/burrito.json");
const burger = require("./data/burger.json");
const chicken = require("./data/chicken.json");
const chips = require("./data/chips.json");
const cookies = require("./data/cookies.json");
const doughnut = require("./data/doughnut.json");
const drink = require("./data/drink.json");
const fries = require("./data/fries.json");
const iceCream = require("./data/ice-cream.json");
const milk = require("./data/milk.json");
const noodles = require("./data/noodles.json");
const pizza = require("./data/pizza.json");
const sausage = require("./data/sausage.json");

const recipesCategory = [
  burger,
  chicken,
  chips,
  cookies,
  doughnut,
  drink,
  fries,
  pizza,
  sausage,
  noodles,
  bread,
  biscuits,
  cake,
  iceCream,
  milk,
  burrito,
];

const data = recipesCategory.flat();

const formatRecipe = (recipe) => {
  let obj = {};
  obj.name = recipe.name;
  obj.image = recipe.image;
  obj.nutrients = recipe.nutrients;
  obj.likes = [];
  obj.pricePerServing = recipe.pricePerServing;
  obj.cuisines = recipe.cuisines;
  obj.diets = recipe.diets;
  obj.cheap = recipe.cheap;
  obj.vegetarian = recipe.vegetarian;
  obj.vegan = recipe.vegan;
  obj.orders = [];
  obj.comments = [];
  obj.dishTypes = recipe.dishTypes;
  obj.veryPopular = recipe.veryPopular;
  obj.glutenFree = recipe.glutenFree;
  obj.dairyFree = recipe.dairyFree;
  return obj;
};

async function seed(data) {
  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await Recipe.deleteMany({});

  for (item of data) {
    let obj = formatRecipe(item);
    // Find if title
    let recipe = await Recipe.findOne({ name: obj.name.toUpperCase() });

    if (!recipe) {
      await Recipe.create({ ...obj });
    }
  }

  console.info("Success!");
  mongoose.disconnect();
}

seed(data);

// console.log(data.length);
