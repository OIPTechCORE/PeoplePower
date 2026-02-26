// Test script for image service
const http = require('http');

const makeRequest = (options, data) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
};

const testReferralImage = async () => {
  console.log('🧪 Testing referral image generation...');
  
  const testData = {
    playerName: "TestPlayer",
    level: 25,
    rank: "INFLUENCER",
    supporters: 1500,
    referralCode: "TEST12345",
    theme: "dark"
  };

  const options = {
    hostname: 'localhost',
    port: 3002,
    path: '/generate-referral',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await makeRequest(options, testData);
    if (response.status === 200) {
      console.log('✅ Referral image generated successfully!');
      console.log(`📊 Response size: ${response.body.length} bytes`);
      console.log(`🎨 Content-Type: ${response.headers['content-type']}`);
    } else {
      console.log('❌ Failed to generate referral image');
      console.log('Response:', response.body);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

const testAchievementImage = async () => {
  console.log('\n🧪 Testing achievement image generation...');
  
  const testData = {
    playerName: "TestPlayer",
    achievementTitle: "First Victory",
    achievementDescription: "Complete your first mission and earn your first supporters",
    badgeIcon: "🏆",
    theme: "dark"
  };

  const options = {
    hostname: 'localhost',
    port: 3002,
    path: '/generate-achievement',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await makeRequest(options, testData);
    if (response.status === 200) {
      console.log('✅ Achievement image generated successfully!');
      console.log(`📊 Response size: ${response.body.length} bytes`);
    } else {
      console.log('❌ Failed to generate achievement image');
      console.log('Response:', response.body);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

const testLeaderboardImage = async () => {
  console.log('\n🧪 Testing leaderboard image generation...');
  
  const testData = {
    title: "Top Players This Week",
    players: [
      { displayName: "Alice", score: 15000 },
      { displayName: "Bob", score: 12000 },
      { displayName: "Charlie", score: 10000 },
      { displayName: "Diana", score: 8500 },
      { displayName: "Eve", score: 7200 }
    ],
    theme: "dark"
  };

  const options = {
    hostname: 'localhost',
    port: 3002,
    path: '/generate-leaderboard',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await makeRequest(options, testData);
    if (response.status === 200) {
      console.log('✅ Leaderboard image generated successfully!');
      console.log(`📊 Response size: ${response.body.length} bytes`);
    } else {
      console.log('❌ Failed to generate leaderboard image');
      console.log('Response:', response.body);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

const testHealthCheck = async () => {
  console.log('\n🧪 Testing health check...');
  
  const options = {
    hostname: 'localhost',
    port: 3002,
    path: '/health',
    method: 'GET'
  };

  try {
    const response = await makeRequest(options);
    if (response.status === 200) {
      const data = JSON.parse(response.body);
      console.log('✅ Health check passed!');
      console.log(`📊 Status: ${data.status}`);
      console.log(`🕐 Timestamp: ${data.timestamp}`);
      console.log(`💾 Cache size: ${data.cacheSize}`);
    } else {
      console.log('❌ Health check failed');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

const runTests = async () => {
  console.log('🔥 Starting People Power Image Service Tests\n');
  
  // Wait a bit for server to start
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await testHealthCheck();
  await testReferralImage();
  await testAchievementImage();
  await testLeaderboardImage();
  
  console.log('\n🎉 All tests completed!');
  console.log('📝 Check the generated images in your response data');
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, testReferralImage, testAchievementImage, testLeaderboardImage, testHealthCheck };
