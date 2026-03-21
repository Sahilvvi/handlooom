const fs = require('fs');
const path = require('path');

const PRODUCTS_JSON_PATH = path.join(__dirname, 'src', 'data', 'products.json');

const updatePrices = () => {
  try {
    const productsData = JSON.parse(fs.readFileSync(PRODUCTS_JSON_PATH, 'utf8'));
    
    const updatedProducts = productsData.map(product => ({
      ...product,
      price: 299,
      originalPrice: 999 // Fixed price as requested by user
    }));

    fs.writeFileSync(PRODUCTS_JSON_PATH, JSON.stringify(updatedProducts, null, 4));
    console.log(`Successfully updated prices for ${updatedProducts.length} products to ₹299.`);

  } catch (err) {
    console.error('Error updating prices:', err);
  }
};

updatePrices();
