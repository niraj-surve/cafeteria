import Espresso from '../assets/coffee/Espresso.png'
import Cappuccino from "../assets/coffee/Cappuccino.png";
import Latte from "../assets/coffee/Latte.png";
import Americano from "../assets/coffee/Americano.png";
import Mocha from "../assets/coffee/Mocha.png";

export const coffeeData = [
  {
    id: 1,
    name: "Espresso",
    cookTime: 5,
    price: 10,
    favourite: true,
    origins: ["italy", "brazil"],
    stars: 5,
    image: Espresso,
    tags: ["strong", "short", "black"],
  },
  {
    id: 2,
    name: "Cappuccino",
    cookTime: 6,
    price: 20,
    favourite: false,
    origins: ["italy", "colombia"],
    stars: 4,
    image: Cappuccino,
    tags: ["frothy", "milky", "light"],
  },
  {
    id: 3,
    name: "Latte",
    cookTime: 7,
    price: 15,
    favourite: true,
    origins: ["france", "guatemala"],
    stars: 4,
    image: Latte,
    tags: ["creamy", "smooth", "light"],
  },
  {
    id: 4,
    name: "Americano",
    cookTime: 4,
    price: 25,
    favourite: false,
    origins: ["usa", "ethiopia"],
    stars: 3,
    image: Americano,
    tags: ["strong", "black"],
  },
  {
    id: 5,
    name: "Mocha",
    cookTime: 8,
    price: 25,
    favourite: true,
    origins: ["yemen", "colombia"],
    stars: 5,
    image: Mocha,
    tags: ["chocolate", "sweet", "milky"],
  },
];
