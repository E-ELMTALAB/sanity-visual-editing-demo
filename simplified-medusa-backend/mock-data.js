// Load products and promotions from data.json
// This file matches the Medusa backend product structure exactly

const fs = require('fs');
const path = require('path');

let data = {
  products: [],
  promotions: []
};

try {
  const dataPath = path.join(__dirname, 'data.json');
  const rawData = fs.readFileSync(dataPath, 'utf8');
  data = JSON.parse(rawData);
} catch (err) {
  console.warn('⚠️  Could not load data.json, using empty data:', err.message);
}

module.exports = {
  products: data.products || [],
  promotions: data.promotions || [],
  
  // Helper function to save data back to file
  saveData: function(newData) {
    try {
      const dataPath = path.join(__dirname, 'data.json');
      fs.writeFileSync(dataPath, JSON.stringify(newData, null, 2), 'utf8');
      data = newData;
      return true;
    } catch (err) {
      console.error('❌ Failed to save data.json:', err.message);
      return false;
    }
  },
  
  // Get current data
  getData: function() {
    return data;
  }
};
