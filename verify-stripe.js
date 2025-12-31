
async function testLifetime() {
  console.log('Testing Lifetime Checkout (lifetimePurchase)...');
  try {
    const response = await fetch('https://us-central1-my-crochetkit.cloudfunctions.net/lifetimePurchase');
    console.log('Lifetime Status:', response.status);
    const text = await response.text();
    if (text.includes('checkout.stripe.com')) {
      console.log('✅ Lifetime Checkout Success: Redirect URL found');
    } else {
      console.log('❌ Lifetime Checkout Failed:', text.substring(0, 500));
    }
  } catch (error) {
    console.error('❌ Lifetime Checkout Error:', error.message);
  }
}

async function testPro() {
  console.log('\nTesting Pro Checkout (checkoutSession - OPTIONS check)...');
  try {
    const response = await fetch('https://us-central1-my-crochetkit.cloudfunctions.net/checkoutSession', {
      method: 'OPTIONS',
      headers: {
        'Access-Control-Request-Method': 'POST',
        'Origin': 'https://mycrochetkit.com'
      }
    });
    console.log('Pro Checkout (OPTIONS) Status:', response.status);
    if (response.status === 204 || response.status === 200) {
      console.log('✅ Pro Checkout Service is UP and CORS-ready');
    } else {
      console.log('❌ Pro Checkout Service might be down:', response.status);
    }
  } catch (error) {
    console.error('❌ Pro Checkout Error:', error.message);
  }
}

async function testPortal() {
  console.log('\nTesting Portal Session (portalSession - OPTIONS check)...');
  try {
    const response = await fetch('https://us-central1-my-crochetkit.cloudfunctions.net/portalSession', {
      method: 'OPTIONS',
      headers: {
        'Access-Control-Request-Method': 'POST',
        'Origin': 'https://mycrochetkit.com'
      }
    });
    console.log('Portal Session (OPTIONS) Status:', response.status);
    if (response.status === 204 || response.status === 200) {
      console.log('✅ Portal Session Service is UP');
    } else {
      console.log('❌ Portal Session Service might be down:', response.status);
    }
  } catch (error) {
    console.error('❌ Portal Session Error:', error.message);
  }
}

async function run() {
  await testLifetime();
  await testPro();
  await testPortal();
}

run();
