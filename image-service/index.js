const express = require("express");
const { createCanvas, registerFont, loadImage } = require("canvas");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Register fonts (try multiple font sources)
try {
  // Try to register Inter-Bold font
  registerFont("./fonts/Inter-Bold.ttf", { family: "InterBold" });
  console.log("✅ Inter-Bold font registered");
} catch (error) {
  console.log("⚠️  Inter-Bold font not found, using system fonts");
}

// Cache for images
const imageCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Helper function to get cached image
function getCachedImage(key) {
  const cached = imageCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.buffer;
  }
  return null;
}

// Helper function to cache image
function cacheImage(key, buffer) {
  imageCache.set(key, { buffer, timestamp: Date.now() });
  
  // Limit cache size
  if (imageCache.size > 1000) {
    const firstKey = imageCache.keys().next().value;
    imageCache.delete(firstKey);
  }
}

// Generate referral image
app.post("/generate-referral", async (req, res) => {
  try {
    const { 
      playerName = "Player", 
      level = 1, 
      rank = "VOICE_STARTER", 
      supporters = 0, 
      referralCode = "INVITE123",
      theme = "dark"
    } = req.body;

    // Create cache key
    const cacheKey = `referral_${playerName}_${level}_${rank}_${supporters}_${referralCode}_${theme}`;
    
    // Check cache
    const cachedImage = getCachedImage(cacheKey);
    if (cachedImage) {
      res.set("Content-Type", "image/png");
      return res.send(cachedImage);
    }

    // Create canvas
    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext("2d");

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    if (theme === "dark") {
      gradient.addColorStop(0, "#111827");
      gradient.addColorStop(1, "#1f2937");
    } else {
      gradient.addColorStop(0, "#f3f4f6");
      gradient.addColorStop(1, "#e5e7eb");
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    // Add decorative border
    ctx.strokeStyle = theme === "dark" ? "#374151" : "#d1d5db";
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, 472, 472);

    // Title section
    ctx.fillStyle = theme === "dark" ? "#ffffff" : "#111827";
    ctx.font = "bold 32px Arial";
    ctx.fillText(playerName, 40, 80);

    // Level and rank
    ctx.font = "bold 24px Arial";
    ctx.fillStyle = theme === "dark" ? "#fbbf24" : "#d97706";
    ctx.fillText(`Level ${level}`, 40, 120);

    ctx.font = "20px Arial";
    ctx.fillStyle = theme === "dark" ? "#10b981" : "#059669";
    const formattedRank = rank.replace(/_/g, ' ');
    ctx.fillText(formattedRank, 40, 150);

    // Supporters count
    ctx.font = "bold 28px Arial";
    ctx.fillStyle = theme === "dark" ? "#ffffff" : "#111827";
    ctx.fillText(`${supporters.toLocaleString()} Supporters`, 40, 200);

    // Add decorative elements
    ctx.fillStyle = theme === "dark" ? "#374151" : "#d1d5db";
    ctx.fillRect(40, 240, 432, 2);

    // Referral code highlight box
    const codeBoxY = 320;
    const codeBoxHeight = 80;
    const codeBoxWidth = 432;
    
    // Draw referral box background
    ctx.fillStyle = theme === "dark" ? "#1f2937" : "#f9fafb";
    ctx.fillRect(40, codeBoxY, codeBoxWidth, codeBoxHeight);
    
    // Draw referral box border
    ctx.strokeStyle = theme === "dark" ? "#fbbf24" : "#d97706";
    ctx.lineWidth = 3;
    ctx.strokeRect(40, codeBoxY, codeBoxWidth, codeBoxHeight);

    // Referral code text
    ctx.fillStyle = theme === "dark" ? "#fbbf24" : "#d97706";
    ctx.font = "bold 36px Arial";
    ctx.textAlign = "center";
    ctx.fillText(referralCode, 256, codeBoxY + 50);
    ctx.textAlign = "left";

    // Add "Join the Movement" text
    ctx.font = "bold 18px Arial";
    ctx.fillStyle = theme === "dark" ? "#9ca3af" : "#6b7280";
    ctx.fillText("Join the Movement", 40, 440);

    // Add decorative bottom line
    ctx.fillStyle = theme === "dark" ? "#374151" : "#d1d5db";
    ctx.fillRect(40, 460, 432, 2);

    // Convert to buffer
    const buffer = canvas.toBuffer("image/png");
    
    // Cache the image
    cacheImage(cacheKey, buffer);

    // Send response
    res.set("Content-Type", "image/png");
    res.send(buffer);

  } catch (error) {
    console.error("Error generating referral image:", error);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

// Generate achievement badge
app.post("/generate-achievement", async (req, res) => {
  try {
    const { 
      playerName = "Player",
      achievementTitle = "Achievement",
      achievementDescription = "Description",
      badgeIcon = "🏆",
      theme = "dark"
    } = req.body;

    const cacheKey = `achievement_${playerName}_${achievementTitle}_${badgeIcon}_${theme}`;
    const cachedImage = getCachedImage(cacheKey);
    if (cachedImage) {
      res.set("Content-Type", "image/png");
      return res.send(cachedImage);
    }

    const canvas = createCanvas(400, 200);
    const ctx = canvas.getContext("2d");

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    if (theme === "dark") {
      gradient.addColorStop(0, "#1f2937");
      gradient.addColorStop(1, "#111827");
    } else {
      gradient.addColorStop(0, "#ffffff");
      gradient.addColorStop(1, "#f9fafb");
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 200);

    // Badge icon
    ctx.font = "48px Arial";
    ctx.fillText(badgeIcon, 30, 80);

    // Achievement title
    ctx.fillStyle = theme === "dark" ? "#ffffff" : "#111827";
    ctx.font = "bold 24px Arial";
    ctx.fillText(achievementTitle, 100, 60);

    // Achievement description
    ctx.font = "16px Arial";
    ctx.fillStyle = theme === "dark" ? "#9ca3af" : "#6b7280";
    
    // Wrap text if too long
    const maxWidth = 280;
    const words = achievementDescription.split(' ');
    let line = '';
    let y = 90;
    
    for (let word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line !== '') {
        ctx.fillText(line, 100, y);
        line = word + ' ';
        y += 25;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 100, y);

    // Player name
    ctx.font = "14px Arial";
    ctx.fillStyle = theme === "dark" ? "#6b7280" : "#9ca3af";
    ctx.fillText(`— ${playerName}`, 100, y + 30);

    const buffer = canvas.toBuffer("image/png");
    cacheImage(cacheKey, buffer);

    res.set("Content-Type", "image/png");
    res.send(buffer);

  } catch (error) {
    console.error("Error generating achievement image:", error);
    res.status(500).json({ error: "Failed to generate achievement image" });
  }
});

// Generate leaderboard preview
app.post("/generate-leaderboard", async (req, res) => {
  try {
    const { 
      title = "Leaderboard",
      players = [],
      theme = "dark"
    } = req.body;

    const cacheKey = `leaderboard_${title}_${players.length}_${theme}`;
    const cachedImage = getCachedImage(cacheKey);
    if (cachedImage) {
      res.set("Content-Type", "image/png");
      return res.send(cachedImage);
    }

    const canvas = createCanvas(512, 600);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = theme === "dark" ? "#111827" : "#ffffff";
    ctx.fillRect(0, 0, 512, 600);

    // Title
    ctx.fillStyle = theme === "dark" ? "#ffffff" : "#111827";
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "center";
    ctx.fillText(title, 256, 50);
    ctx.textAlign = "left";

    // Players list
    const startY = 100;
    const rowHeight = 70;
    const maxPlayers = Math.min(players.length, 7);

    for (let i = 0; i < maxPlayers; i++) {
      const player = players[i];
      const y = startY + (i * rowHeight);

      // Row background
      if (i < 3) {
        ctx.fillStyle = theme === "dark" 
          ? (i === 0 ? "#fbbf2420" : i === 1 ? "#9ca3af20" : "#6b728020")
          : (i === 0 ? "#fef3c7" : i === 1 ? "#f3f4f6" : "#f9fafb");
        ctx.fillRect(20, y - 25, 472, 60);
      }

      // Rank
      ctx.fillStyle = theme === "dark" ? "#ffffff" : "#111827";
      ctx.font = "bold 24px Arial";
      ctx.fillText(`#${i + 1}`, 40, y);

      // Player name
      ctx.font = "20px Arial";
      ctx.fillText(player.displayName || player.username || "Anonymous", 100, y);

      // Score
      ctx.textAlign = "right";
      ctx.fillStyle = theme === "dark" ? "#fbbf24" : "#d97706";
      ctx.font = "bold 20px Arial";
      ctx.fillText(player.score?.toLocaleString() || "0", 472, y);
      ctx.textAlign = "left";
    }

    const buffer = canvas.toBuffer("image/png");
    cacheImage(cacheKey, buffer);

    res.set("Content-Type", "image/png");
    res.send(buffer);

  } catch (error) {
    console.error("Error generating leaderboard image:", error);
    res.status(500).json({ error: "Failed to generate leaderboard image" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    cacheSize: imageCache.size,
    port: PORT
  });
});

// Clear cache endpoint
app.post("/clear-cache", (req, res) => {
  imageCache.clear();
  res.json({ message: "Cache cleared successfully" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🔥 Image service running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🎨 Available endpoints:`);
  console.log(`   POST /generate-referral`);
  console.log(`   POST /generate-achievement`);
  console.log(`   POST /generate-leaderboard`);
  console.log(`   POST /clear-cache`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  imageCache.clear();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  imageCache.clear();
  process.exit(0);
});
