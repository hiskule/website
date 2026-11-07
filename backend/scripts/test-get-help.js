const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth.js');
const { HelpRequest } = require('../models/index.js');

async function testGet() {
  const token = jwt.sign({ role: 'admin', username: 'admin' }, JWT_SECRET);
  console.log("Generated Admin token:", token);

  const filterStatus = 'pending';
  const competitionId = '15';

  const whereClause = { status: filterStatus };
  if (competitionId) {
    whereClause.competitionId = competitionId;
  }

  const requests = await HelpRequest.findAll({
    where: whereClause,
    order: [['createdAt', 'DESC']]
  });

  console.log("DB returned requests count:", requests.length);
  console.log("DB returned requests:", JSON.stringify(requests, null, 2));
  process.exit(0);
}

testGet();
