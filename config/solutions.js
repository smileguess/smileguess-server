const utils = require('../controllers/utils');

const categoriesAndSolutions = {
  places: "Affluent Suburb,Airport Runway,American Consulate,American Embassy,Amish Country,Amusement Park,Animal Rescue,Apartment Building,Apple Orchard,Appliance Store,Art Gallery,Auto Supply Store,Back Alley,Bakeshop,Ballpark,Banquet Hall,Bar And Grill,Barnyard,Baseball Stadium,Bathroom,Bathroom,Batter's Box,Battery Park In New York,Beach Cottage,Beauty Parlor,Beauty Salon,Bed And Breakfast,Bed And Breakfast,Bed And Breakfast,Bird Sanctuary,Boarding School,Boardroom,Boston Bruins,Boutique Hotel,Boxing Ring,Boy Scout Camp,Branch Bank,Branch Offices,Brick House,Bridal Salon,Broom Closet,Bullpen,Bumpy Road,Bunkhouse,Burger Joint,Business District,Busy Highway,Butcher Shop,Butler's Pantry,Camera Shop,Campaign Headquarters,Campground Site,Camping Ground,Candy Counter,Candy Factory,Car Dealership,Car Park,Cattle Ranch,Charm School,Charming Neighborhoods,Chinese Restaurant,City Hall,City Property,Civic Auditorium,Civic Center,Coastline,Cockpit,Coin-Operated Laundromat,College Campus,College Dormitory,Comedy Club,Comedy Club,Community College,Concert Hall,Congressional District,Convenient Location,Convention Center,Corner Deli,Corner Newsstand,Corner Office With Windows,County Courthouse,Courtroom,Courtside,Covered Patio,Covered Porch,Cozy Study,Credit Union,Crosswalk,Crowded Restaurant,Crowded Room,Cul-De-Sac,Cultural Center,Cultural Institution,Dairy Farm,Dance Studio,Deli Counter,Dentist's Office,Desert Landscape,Dinner Theater,Distant Galaxies",
  foodAndDrink: "Apple Butter,After-Dinner Mint,Aged Cheddar Cheese,Aged Parmesan Cheese,Ahi Tuna Salad,Alaskan Cod Fillets,Alfalfa Sprouts,All-Natural Ingredients,Alphabet Soup,Apple Dumplings,Apple Jacks,Apple Juice,Apple Cider Vinegar,Applesauce,Apricot Raisin Pie,Artichoke Hearts,Arugula Salad,Authentic Italian Cuisine,Avocados,Bacon Bits,Bacon And Cheese Pizza,Baked Alaska,Baked Halibut With Tomato Salsa,Baked Lasagna,Baked Macaroni,Baked Ziti,Baked Fruit Compote,Banana Nut Bread,Banana Rum Creme Brulee,Barbecued Chicken,Barbecued Spare Ribs,Barbecued Beef Ribs,Barbecued Beef Sandwich,Barley Soup,Bartlett Pears,Basil Leaves,Batch Of Cookies,Batch Of Cookies,BBQ Pork,BBQ Baked Beans,Bean Sprouts,Beef Spaghetti,Beef Wellington,Beef And Vegetable Stir-Fry,Beef Filet With Red Pepper Relish,Beef Pot Roast,Beef Rib Roast,Beef Satay On Skewers,Bing Cherries,Birthday Cake,Birthday Cake With Buttermilk Icing,Birthday Cake & Ice Cream,Biscotti,Biscuits & Gravy,Bite-Sized Fudge Brownie Pieces,Bittersweet Chocolate,Black Bean Soup With Roasted Jalapenos,Black-Eyed Peas And Rice,Blackberry Jam,Blue Plate Special,Blueberry Shortcake,Boiled Beans,Boiled Beets,Boiled Cabbage,Boiled Eggs,Boiled Noodles,Boiled New Potatoes,Bologna Sandwich,Bolognese Pasta Sauce,Boston Baked Beans,Bottled Beer,Bountiful Harvest,Box Lunch,Braised Pheasant,Braised Veal Chops,Bread And Butter Pickles,Breakfast Burrito,Breakfast Cereals,Breast Wing Thigh & Drumstick,Broiled Mushrooms,Brown And Serve Rolls,Brown Bag Lunch,Buckwheat Pancakes,Buckwheat Pancakes,Bulk Candy,Burger & Fries,Buttered Bagel,Buttered Croissant,Buttermilk Waffles,Butterscotch Pudding,Buttery Biscuits,Cajun Cuisine,Cake,Canadian Bacon Pizza,Candied Apple,Candied Walnuts,Candied Yams,Canned Tuna,Canned Baked Beans,Canned Tomato Salad",
};
let solutionsForDisplay = [];
let simplifiedSolutions = [];

let categoryCount = 0;
Object.keys(categoriesAndSolutions).forEach((category) => {
  simplifiedSolutions.push(category);
  simplifiedSolutions[categoryCount] = categoriesAndSolutions[category].split(',').map((solution) =>
    utils.simplifyString(solution));
  solutionsForDisplay.push(category);
  solutionsForDisplay[categoryCount] = categoriesAndSolutions[category].split(',');
  categoryCount++;
});

module.exports = {
  solutionsForDisplay,
  simplifiedSolutions,
};
