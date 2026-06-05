async function testEndpoint(url, options = {}) {
  try {
    const response = await fetch(url, options);
    const text = await response.text();
    console.log(`URL: ${url} (Status: ${response.status})`);
    console.log('BODY:', text);
  } catch (err) {
    console.error(`ERROR for ${url}:`, err);
  }
}

async function run() {
  const headers = {
    'apikey': 'ChaveGlobalSeguraEvolution123',
    'Content-Type': 'application/json'
  };

  // Test: GET /instance/connectionState/nexum
  await testEndpoint('https://xantoniocleite-evolution-api.hf.space/instance/connectionState/nexum', {
    method: 'GET',
    headers
  });
}

run();
