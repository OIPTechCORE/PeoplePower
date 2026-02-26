# People Power Journey API Documentation

## Overview

The People Power Journey API provides endpoints for the Telegram game, including player management, missions, communities, leaderboards, and analytics.

**Base URL**: `https://api.your-domain.com/api/v1`

## Authentication

### Telegram Authentication

All requests must include Telegram Web App init data for authentication:

```http
POST /api/v1/auth/telegram
Content-Type: application/json

{
  "telegramUser": {
    "id": 123456789,
    "first_name": "John",
    "last_name": "Doe",
    "username": "johndoe",
    "language_code": "en"
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "player": {
      "id": "uuid",
      "telegramId": 123456789,
      "username": "johndoe",
      "displayName": "John Doe",
      "level": 1,
      "rank": "VOICE_STARTER",
      "experience": 0,
      "influence": 0,
      "supporters": 0,
      "powerTokens": 0,
      "totalEarned": 0,
      "referralCode": "ABC12345",
      "generation": "FOUNDERS",
      "permanentBonus": 0.4
    },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

## Endpoints

### Authentication

#### POST /auth/telegram
Authenticate user via Telegram Web App data.

#### POST /auth/create-or-get
Create or get player with optional referral code.

#### POST /auth/refresh
Refresh JWT token.

#### POST /auth/logout
Logout user and invalidate tokens.

### Players

#### GET /players/{playerId}
Get player profile.

```json
{
  "success": true,
  "data": {
    "player": {
      "id": "uuid",
      "telegramId": 123456789,
      "username": "johndoe",
      "displayName": "John Doe",
      "level": 15,
      "rank": "ORGANIZER",
      "experience": 1500,
      "influence": 2500,
      "supporters": 150,
      "powerTokens": 500,
      "totalEarned": 2000,
      "referralCode": "ABC12345",
      "generation": "FOUNDERS",
      "permanentBonus": 0.4,
      "badges": [
        {
          "id": "uuid",
          "name": "First Steps",
          "description": "Complete your first mission",
          "icon": "🎯",
          "rarity": "common",
          "earnedAt": "2026-02-22T10:00:00Z"
        }
      ],
      "titles": ["Early Adopter"],
      "joinedAt": "2026-02-20T12:00:00Z",
      "lastActiveAt": "2026-02-22T15:30:00Z"
    }
  }
}
```

#### PATCH /players/{playerId}
Update player data.

#### GET /players/{playerId}/stats
Get player statistics and leaderboard position.

```json
{
  "success": true,
  "data": {
    "stats": {
      "rank": 1250,
      "totalPlayers": 50000,
      "percentile": 97.5,
      "influenceRank": 890,
      "supportersRank": 1450,
      "levelRank": 2000
    }
  }
}
```

#### GET /players/{playerId}/missions
Get player's available and completed missions.

#### GET /players/{playerId}/community
Get player's community information.

#### GET /players/{playerId}/referrals
Get player's referral network.

#### GET /players/{playerId}/session-info
Get session information for addiction-safe framework.

### Missions

#### GET /missions
Get available missions by type and category.

**Query Parameters**:
- `type`: `daily`, `weekly`, `story`, `special`
- `category`: `daily`, `weekly`, `story`, `special`
- `playerLevel`: Player's level (for filtering)

```json
{
  "success": true,
  "data": {
    "missions": [
      {
        "id": "uuid",
        "title": "Daily Tap Challenge",
        "description": "Tap 100 times to earn influence",
        "type": "DAILY_TAP",
        "category": "daily",
        "requirements": {
          "type": "taps",
          "value": 100
        },
        "rewards": {
          "influence": 50,
          "experience": 25,
          "powerTokens": 10
        },
        "isAvailable": true,
        "progress": 45,
        "maxProgress": 100,
        "expiresAt": "2026-02-23T00:00:00Z"
      }
    ]
  }
}
```

#### POST /missions/{missionId}/complete
Complete a mission.

#### GET /missions/player/{playerId}
Get player-specific mission data.

### Communities

#### GET /communities
Get list of public communities.

#### POST /communities
Create a new community.

#### GET /communities/{communityId}
Get community details.

#### POST /communities/{communityId}/join
Join a community.

#### POST /communities/{communityId}/leave
Leave a community.

#### GET /communities/{communityId}/members
Get community members.

#### POST /communities/{communityId}/upgrade
Purchase community upgrade.

### Leaderboards

#### GET /leaderboards/{type}
Get leaderboard by type.

**Types**: `global`, `regional`, `community`, `campus`

**Query Parameters**:
- `period`: `daily`, `weekly`, `seasonal`, `all_time`
- `limit`: Number of entries (default: 50, max: 100)
- `offset`: Pagination offset

```json
{
  "success": true,
  "data": {
    "leaderboard": {
      "type": "global",
      "period": "weekly",
      "entries": [
        {
          "playerId": "uuid",
          "rank": 1,
          "score": 15000,
          "displayName": "Alice",
          "username": "alice",
          "avatar": "https://example.com/avatar.jpg",
          "badges": ["🏆", "⭐"],
          "change": 5,
          "level": 25,
          "supporters": 500,
          "rank": "MOVEMENT_LEADER"
        }
      ],
      "totalEntries": 50000,
      "playerRank": 1250,
      "resetsAt": "2026-02-29T00:00:00Z"
    }
  }
}
```

#### GET /leaderboards/referrals
Get top referrers leaderboard.

### Referrals

#### POST /referrals
Create a new referral.

#### GET /referrals/validate/{referralCode}
Validate a referral code.

#### POST /referrals/{referralId}/reward
Process referral rewards.

#### GET /referrals/stats/{playerId}
Get referral statistics for a player.

### Stories

#### GET /stories/chapters
Get available story chapters.

#### GET /stories/chapters/{chapterId}
Get chapter details.

#### POST /stories/chapters/{chapterId}/progress
Update chapter progress.

#### GET /stories/player/{playerId}/progress
Get player's story progress.

### Analytics

#### POST /analytics/activity
Log player activity.

#### GET /analytics/impact
Get impact metrics.

#### GET /analytics/stats/players
Get player statistics.

## Error Handling

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-02-22T15:30:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human readable error message",
  "timestamp": "2026-02-22T15:30:00Z"
}
```

### Common Error Codes

- `VALIDATION_ERROR`: Invalid input data
- `UNAUTHORIZED`: Invalid or missing authentication
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error
- `MISSION_NOT_AVAILABLE`: Mission is not available
- `INSUFFICIENT_RESOURCES`: Not enough influence/tokens
- `COMMUNITY_FULL`: Community has reached maximum capacity
- `INVALID_REFERRAL_CODE`: Referral code is invalid or used

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **General endpoints**: 100 requests per 15 minutes
- **Authentication endpoints**: 10 requests per 15 minutes
- **Mission completion**: 5 requests per minute

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1645587600
```

## WebSocket Events

Real-time events are available via WebSocket connection:

```javascript
const ws = new WebSocket('wss://api.your-domain.com/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'PLAYER_UPDATE':
      // Player stats updated
      break;
    case 'MISSION_COMPLETED':
      // Mission completed
      break;
    case 'COMMUNITY_UPDATE':
      // Community updated
      break;
    case 'LEADERBOARD_UPDATE':
      // Leaderboard updated
      break;
  }
};
```

### Event Types

- `PLAYER_UPDATE`: Player stats changed
- `MISSION_COMPLETED`: Mission completed
- `COMMUNITY_UPDATE`: Community joined/left/upgrade
- `LEADERBOARD_UPDATE`: Leaderboard position changed
- `VIRAL_EVENT`: New viral event started
- `SEASON_RESET`: Season reset notification

## SDK Examples

### JavaScript/TypeScript

```typescript
import { PeoplePowerAPI } from '@people-power/sdk';

const api = new PeoplePowerAPI({
  baseURL: 'https://api.your-domain.com/api/v1',
  token: 'your-jwt-token'
});

// Get player profile
const player = await api.players.getProfile();

// Complete mission
const result = await api.missions.complete('mission-uuid');

// Get leaderboard
const leaderboard = await api.leaderboards.getGlobal({
  period: 'weekly',
  limit: 50
});
```

### Python

```python
import requests

class PeoplePowerAPI:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
    
    def get_player(self, player_id):
        response = requests.get(
            f'{self.base_url}/players/{player_id}',
            headers=self.headers
        )
        return response.json()

# Usage
api = PeoplePowerAPI('https://api.your-domain.com/api/v1', 'token')
player = api.get_player('player-uuid')
```

## Testing

### Environment

- **Development**: `https://dev-api.your-domain.com/api/v1`
- **Staging**: `https://staging-api.your-domain.com/api/v1`
- **Production**: `https://api.your-domain.com/api/v1`

### Test Data

Use test Telegram user IDs for development:
- Test User 1: `123456789`
- Test User 2: `987654321`

### Postman Collection

A Postman collection is available with all endpoints pre-configured:
[Download Postman Collection](./postman/people-power-api.postman_collection.json)

## Changelog

### v1.0.0 (2026-02-22)
- Initial API release
- Authentication endpoints
- Player management
- Missions system
- Communities
- Leaderboards
- Basic analytics

### Upcoming Features
- Real-time WebSocket events
- Advanced analytics
- Admin endpoints
- Batch operations
- GraphQL support

## Support

For API support and questions:
- Documentation: https://docs.people-power.game
- Email: api-support@people-power.game
- Telegram: @PeoplePowerSupport

## License

This API is part of the People Power Journey game. See LICENSE.md for licensing information.
