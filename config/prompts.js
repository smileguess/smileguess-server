const utils = require('../controllers/utils');

const categoriesAndPrompts = {
  'Places': "Suburb,San Francisco,Hack Reactor,Airport Runway,Amish Country,Amusement Park,Animal Rescue,Apartment Building,Apple Orchard,Appliance Store,Art Gallery,Auto Supply Store,Ballpark,Banquet Hall,Bar And Grill,Barnyard,Baseball Stadium,Bathroom,Batter's Box,New York,Beach Cottage,Beauty Parlor,Bed And Breakfast,Boarding School,Boardroom,Boston Bruins,Hotel,Boxing Ring,Boy Scout Camp,Branch Office,Brick House,Bridal Salon,Broom Closet,Bumpy Road,Burger Joint,Business District,Highway,Butcher Shop,Camera Shop,Campaign Headquarters,Campground,Candy Factory,Car Dealership,Cattle Ranch,Chinese Restaurant,City Hall,Civic Auditorium,Civic Center,Coastline,Cockpit,Laundromat,Comedy Club,College,Corner Deli,Corner Newsstand,Corner Office,Courtroom,Covered Patio,Bank,Crosswalk,Crowded Room,Dairy Farm,Dance Studio,Deli Counter,Dentist's Office,Dinner Theater,Distant Galaxies",
  'Food and Drink': "Apple Butter,After-Dinner Mint,Cheddar Cheese,Tuna Salad,Alphabet Soup,Apple Dumplings,Apple Jacks,Apple Juice,Applesauce,Avocados,Bacon Bits,Banana Bread,Barbecued Chicken,Ribs,Cookies,BBQ Pork,Baked Beans,Bean Sprouts,Beef Spaghetti,Beef Pot Roast,Cherries,Birthday Cake,Ice Cream,Biscuits & Gravy,Fudge Brownie,Chocolate,Bean Soup,Black-Eyed Peas,Blackberry Jam,Blue Plate Special,Strawberry Shortcake,Boiled Cabbage,Boiled Eggs,Bologna Sandwich,Boston Baked Beans,Bottled Beer,Box Lunch,Bread And Butter,Breakfast Burrito,Breakfast Cereal,Chcken Drumstick,Brown Bag Lunch,Bulk Candy,Burger & Fries,Buttermilk Pancakes,Candied Apple,Canned Tuna",
};
const promptsForDisplay = [];
const simplifiedPrompts = [];
const categories = Object.keys(categoriesAndPrompts);

let categoryCount = 0;
categories.forEach((category) => {
  simplifiedPrompts.push(category);
  simplifiedPrompts[categoryCount] = categoriesAndPrompts[category].split(',').map((prompt) =>
    utils.simplifyString(prompt));
  promptsForDisplay.push(category);
  promptsForDisplay[categoryCount] = categoriesAndPrompts[category].split(',');
  categoryCount++;
});

module.exports = {
  categories,
  promptsForDisplay,
  simplifiedPrompts,
};
