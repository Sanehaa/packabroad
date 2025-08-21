const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('Testing API endpoints...\n');

  const visaTypes = ['tourist', 'student', 'work'];
  const categories = ['Documents', 'Personal'];

  // Test each visa type with different categories
  for (const visa of visaTypes) {
    console.log(`=== Testing visa type: ${visa} ===`);
    
    for (const category of categories) {
      try {
        console.log(`\nTesting category: ${category}`);
        const response = await fetch(`${BASE_URL}/api/items?visa=${visa}&category=${category}`);
        const data = await response.json();

        if (response.ok) {
          console.log(`✅ Success: Found ${data.length} items for ${visa} visa in ${category} category`);
          
          // Group items by sub_category to see the structure
          const grouped = data.reduce((acc, item) => {
            const subCategory = item.sub_category || 'General';
            if (!acc[subCategory]) acc[subCategory] = [];
            acc[subCategory].push(item.name);
            return acc;
          }, {});

          console.log('Sub-categories found:');
          Object.entries(grouped).forEach(([subCategory, items]) => {
            console.log(`  ${subCategory}: ${items.length} items`);
          });
        } else {
          console.log(`❌ Error: ${response.status} - ${data.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.log(`❌ Network error for ${visa}/${category}: ${error.message}`);
      }
    }
    console.log('\n' + '='.repeat(50) + '\n');
  }
}

// Run the test
testAPI().catch(console.error);
