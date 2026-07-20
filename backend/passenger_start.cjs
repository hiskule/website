// passenger_start.cjs
// This is a CommonJS wrapper required by Plesk's Phusion Passenger 
// to dynamically load our ES Module backend without throwing an ERR_REQUIRE_ESM error.

import('./server.js').catch(err => {
    console.error("Error starting ES Module server:", err);
    process.exit(1);
});
