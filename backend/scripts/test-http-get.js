const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth.js');

async function testHttp() {
  const token = jwt.sign({ role: 'admin', username: 'admin' }, JWT_SECRET);
  try {
    const res = await fetch('http://127.0.0.1:3000/help-requests?competitionId=15&status=pending', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log("HTTP Status:", res.status);
    const data = await res.json();
    console.log("Response Body:", JSON.stringify(data, null, 2));
    process.exit(0);
  } catch (err) {
    console.error("HTTP Fetch failed:", err.message);
    process.exit(1);
  }
}

testHttp();
