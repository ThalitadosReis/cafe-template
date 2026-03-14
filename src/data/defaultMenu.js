export const defaultMenu = [
  {
    id: "cat_coffee",
    label: { en: "Coffee", de: "Kaffee" },
    items: [
      {
        id: "i_e1",
        name: { en: "Espresso", de: "Espresso" },
        desc: {
          en: "Double shot, Ethiopian blend",
          de: "Doppelter Schuss, äthiopische Mischung",
        },
        price: "3.50",
      },
      {
        id: "i_e2",
        name: { en: "Flat White", de: "Flat White" },
        desc: { en: "Velvety microfoam", de: "Samtiger Mikroschaum" },
        price: "5.00",
      },
      {
        id: "i_e3",
        name: { en: "Filter Coffee", de: "Filterkaffee" },
        desc: { en: "Single origin, rotating", de: "Single Origin, wechselnd" },
        price: "4.50",
      },
      {
        id: "i_e4",
        name: { en: "Cold Brew", de: "Cold Brew" },
        desc: { en: "18-hour steep", de: "18 Stunden kalt gebrüht" },
        price: "6.00",
      },
      {
        id: "i_e5",
        name: { en: "Cappuccino", de: "Cappuccino" },
        desc: {
          en: "Rich espresso, silky foam",
          de: "Kräftiger Espresso, seidiger Schaum",
        },
        price: "4.80",
      },
      {
        id: "i_e6",
        name: { en: "Iced Latte", de: "Eiskaffee Latte" },
        desc: { en: "Espresso, milk, ice", de: "Espresso, Milch, Eis" },
        price: "5.80",
      },
    ],
  },
  {
    id: "cat_food",
    label: { en: "Food", de: "Speisen" },
    items: [
      {
        id: "i_f1",
        name: { en: "Avocado Toast", de: "Avocado Toast" },
        desc: {
          en: "Sourdough, lemon, chilli",
          de: "Sauerteig, Zitrone, Chili",
        },
        price: "14.00",
      },
      {
        id: "i_f2",
        name: { en: "Granola Bowl", de: "Granola Bowl" },
        desc: {
          en: "House granola, seasonal fruit",
          de: "Hausgranola, saisonale Früchte",
        },
        price: "12.00",
      },
      {
        id: "i_f3",
        name: { en: "Pastry of the Day", de: "Gebäck des Tages" },
        desc: {
          en: "Baked fresh each morning",
          de: "Jeden Morgen frisch gebacken",
        },
        price: "5.50",
      },
      {
        id: "i_f4",
        name: { en: "Seasonal Soup", de: "Tagessuppe" },
        desc: { en: "With bread", de: "Mit Brot" },
        price: "13.00",
      },
      {
        id: "i_f5",
        name: { en: "Croissant Sandwich", de: "Croissant Sandwich" },
        desc: { en: "Ham, cheese, mustard", de: "Schinken, Käse, Senf" },
        price: "9.50",
      },
      {
        id: "i_f6",
        name: { en: "Banana Bread", de: "Bananenbrot" },
        desc: {
          en: "Toasted, whipped butter",
          de: "Getoastet, aufgeschlagene Butter",
        },
        price: "6.00",
      },
    ],
  },
  {
    id: "cat_drinks",
    label: { en: "Drinks", de: "Getränke" },
    items: [
      {
        id: "i_d1",
        name: { en: "Matcha Latte", de: "Matcha Latte" },
        desc: { en: "Ceremonial grade", de: "Ceremonial Grade" },
        price: "6.50",
      },
      {
        id: "i_d2",
        name: { en: "Hot Chocolate", de: "Heisse Schokolade" },
        desc: { en: "Dark 72%, house-made", de: "Dunkel 72%, hausgemacht" },
        price: "5.50",
      },
      {
        id: "i_d3",
        name: { en: "Herbal Tea", de: "Kräutertee" },
        desc: { en: "Rotating selection", de: "Wechselnde Auswahl" },
        price: "4.00",
      },
      {
        id: "i_d4",
        name: { en: "Lemonade", de: "Limonade" },
        desc: {
          en: "Fresh pressed, seasonal",
          de: "Frisch gepresst, saisonal",
        },
        price: "5.00",
      },
      {
        id: "i_d5",
        name: { en: "Chai Latte", de: "Chai Latte" },
        desc: {
          en: "Spiced black tea, steamed milk",
          de: "Gewürzter Schwarztee, gedämpfte Milch",
        },
        price: "5.80",
      },
      {
        id: "i_d6",
        name: { en: "Sparkling Water", de: "Mineralwasser" },
        desc: { en: "Still or sparkling", de: "Still oder mit Kohlensäure" },
        price: "3.80",
      },
    ],
  },
];

export function cloneDefaultMenu() {
  return JSON.parse(JSON.stringify(defaultMenu));
}
