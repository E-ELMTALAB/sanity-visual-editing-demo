/**
 * Test script to verify the simple payment endpoint works
 * This tests the /store/simple-payment endpoint that doesn't require publishable key
 */

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'

async function testSimplePayment() {
  console.log('Testing simple payment endpoint...')
  console.log('Backend URL:', MEDUSA_BACKEND_URL)
  
  const testData = {
    items: [
      {
        id: 1,
        title: 'Test Product',
        price: 100000,
        quantity: 1
      }
    ],
    customer_email: 'test@example.com',
    customer_phone: '+989123456789'
  }
  
  try {
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/simple-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    })
    
    console.log('Response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response:', errorText)
      return
    }
    
    const result = await response.json()
    console.log('Success! Payment result:', JSON.stringify(result, null, 2))
    
    if (result.success && result.payment?.payment_url) {
      console.log('✅ Payment URL generated successfully:', result.payment.payment_url)
    } else {
      console.log('❌ No payment URL found in response')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Run the test
testSimplePayment()
