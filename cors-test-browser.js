// CORS Test Script for Browser Console
// Run this in your browser's developer console to test CORS

const BACKEND_URL = 'http://localhost:9000'; // Change this to your backend URL

console.log('🧪 Starting CORS Tests...');

// Test 1: Basic CORS test endpoint
async function testCorsEndpoint() {
  console.log('1️⃣ Testing CORS endpoint...');
  try {
    const response = await fetch(`${BACKEND_URL}/store/cors-test-comprehensive`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ CORS endpoint working:', data.message);
      return true;
    } else {
      console.log('❌ CORS endpoint failed:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.log('❌ CORS endpoint error:', error.message);
    return false;
  }
}

// Test 2: Test cart creation
async function testCartCreation() {
  console.log('2️⃣ Testing cart creation...');
  try {
    const cartData = {
      items: [
        {
          id: 1,
          title: "Test Product",
          price: 100000,
          image: "test.jpg",
          quantity: 1,
          selectedOption: "Default"
        }
      ],
      customer_email: "test@example.com",
      customer_phone: "+989123456789"
    };
    
    const response = await fetch(`${BACKEND_URL}/store/cart/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cartData)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Cart creation working:', data.message);
      return true;
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.log('❌ Cart creation failed:', response.status, errorData.error || response.statusText);
      return false;
    }
  } catch (error) {
    console.log('❌ Cart creation error:', error.message);
    return false;
  }
}

// Test 3: Test Zarinpal verification
async function testZarinpalVerification() {
  console.log('3️⃣ Testing Zarinpal verification...');
  try {
    const verifyData = {
      authority: "test_authority_123",
      Status: "OK",
      cart_id: "test_cart_123"
    };
    
    const response = await fetch(`${BACKEND_URL}/store/zarinpal/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(verifyData)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Zarinpal verification accessible:', data.message);
      return true;
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.log('❌ Zarinpal verification failed:', response.status, errorData.error || response.statusText);
      return false;
    }
  } catch (error) {
    console.log('❌ Zarinpal verification error:', error.message);
    return false;
  }
}

// Test 4: Test preflight request
async function testPreflightRequest() {
  console.log('4️⃣ Testing preflight request...');
  try {
    const response = await fetch(`${BACKEND_URL}/store/cors-test-comprehensive`, {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    if (response.ok) {
      console.log('✅ Preflight request working');
      return true;
    } else {
      console.log('❌ Preflight request failed:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.log('❌ Preflight request error:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Running all CORS tests...');
  console.log('Backend URL:', BACKEND_URL);
  console.log('Current origin:', window.location.origin);
  
  const results = await Promise.all([
    testCorsEndpoint(),
    testCartCreation(),
    testZarinpalVerification(),
    testPreflightRequest()
  ]);
  
  const passedTests = results.filter(Boolean).length;
  const totalTests = results.length;
  
  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All CORS tests passed! Your backend is properly configured.');
  } else {
    console.log('⚠️ Some tests failed. Check your backend configuration and ensure it\'s running.');
  }
  
  return results;
}

// Export functions for manual testing
window.corsTests = {
  runAll: runAllTests,
  testCorsEndpoint,
  testCartCreation,
  testZarinpalVerification,
  testPreflightRequest
};

console.log('💡 CORS test functions loaded. Run corsTests.runAll() to start testing.');
