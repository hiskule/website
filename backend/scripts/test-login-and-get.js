async function testLoginAndGet() {
  // 1. Login as admin
  const loginRes = await fetch('http://127.0.0.1:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'admin',
      password: process.env.ADMIN_PASSWORD || 'G}Q19U{p%^8O'
    })
  });
  console.log("Login status:", loginRes.status);
  const loginData = await loginRes.json();
  console.log("Login user:", loginData.user, "Role:", loginData.role);
  const token = loginData.token;

  // 2. Fetch help requests with token
  const helpRes = await fetch('http://127.0.0.1:3000/help-requests?competitionId=15&status=pending', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  console.log("Help requests status:", helpRes.status);
  const helpData = await helpRes.json();
  console.log("Help requests data:", JSON.stringify(helpData, null, 2));

  // 3. Fetch without competitionId
  const helpResAll = await fetch('http://127.0.0.1:3000/help-requests?status=pending', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  console.log("Help requests (all) status:", helpResAll.status);
  const helpDataAll = await helpResAll.json();
  console.log("Help requests (all) count:", helpDataAll.requests?.length);
  process.exit(0);
}

testLoginAndGet();
