import { v4 as uuidv4 } from 'uuid';

// ===================================
// CIVILIZATION EMOTION ENGINE
// THE INVISIBLE PSYCHOLOGICAL OPERATING SYSTEM
// ===================================

export class CivilizationEmotionEngine {
  constructor(db, aiService, notificationService) {
    this.db = db;
    this.aiService = aiService;
    this.notificationService = notificationService;
    
    // Emotional configuration
    this.emotionalWeights = {
      belonging: 0.25,
      recognition: 0.20,
      purpose: 0.20,
      impact: 0.20,
      legacy: 0.15
    };
    
    // Safety thresholds
    this.safetyThresholds = {
      maxSessionTime: 120, // minutes
      restBonusInterval: 240, // minutes
      emotionalHealthMin: 0.3,
      engagementMax: 0.85
    };
  }

  // ===================================
  // 1. IDENTITY → MEANING LOOP
  // ===================================

  async developPlayerIdentity(playerId) {
    try {
      // Get player data
      const playerQuery = `
        SELECT p.*, pe.power_tokens, pe.total_earned, pe.reputation_score,
               gc.country_code, gc.community_id
        FROM players p
        LEFT JOIN player_economy pe ON p.id = pe.player_id
        LEFT JOIN global_citizens gc ON p.id = gc.player_id
        WHERE p.id = $1
      `;
      const playerResult = await this.db.query(playerQuery, [playerId]);
      
      if (playerResult.rows.length === 0) {
        throw new Error('Player not found');
      }
      
      const player = playerResult.rows[0];
      
      // Analyze behavior patterns
      const behaviorAnalysis = await this.analyzePlayerBehavior(playerId);
      
      // Create identity layers
      const identity = {
        playerId,
        origin: await this.assignOrigin(player),
        storyPath: await this.generateStoryPath(playerId, behaviorAnalysis),
        contributionStyle: this.determineContributionStyle(behaviorAnalysis),
        reputationAura: await this.calculateReputationAura(playerId),
        evolutionStage: this.determineEvolutionStage(player),
        emotionalProfile: await this.calculateEmotionalProfile(playerId),
        identityStrength: 0.0
      };
      
      // Save identity
      await this.savePlayerIdentity(identity);
      
      // Update identity visuals
      await this.updateIdentityVisuals(playerId, identity);
      
      // Trigger psychological effect
      await this.triggerIdentityEffect(playerId, identity);
      
      return identity;
    } catch (error) {
      console.error('Error developing player identity:', error);
      throw error;
    }
  }

  async analyzePlayerBehavior(playerId) {
    try {
      const behaviorQuery = `
        SELECT 
          action_type,
          COUNT(*) as frequency,
          AVG(impact_score) as avg_impact,
          MAX(created_at) as last_action
        FROM player_actions 
        WHERE player_id = $1 AND created_at > NOW() - INTERVAL '30 days'
        GROUP BY action_type
        ORDER BY frequency DESC
      `;
      
      const behaviorResult = await this.db.query(behaviorQuery, [playerId]);
      
      return {
        patterns: behaviorResult.rows,
        primaryActions: behaviorResult.rows.slice(0, 3),
        socialTendencies: await this.analyzeSocialTendencies(playerId),
        contributionPreferences: await this.analyzeContributionPreferences(playerId),
        emotionalTriggers: await this.identifyEmotionalTriggers(playerId)
      };
    } catch (error) {
      console.error('Error analyzing player behavior:', error);
      return { patterns: [], primaryActions: [] };
    }
  }

  async assignOrigin(player) {
    try {
      // Determine origin based on registration data and early behavior
      let origin = {
        type: 'citizen',
        country: player.country || 'Unknown',
        community: player.community_id || null,
        joinDate: player.created_at,
        pathway: 'standard'
      };
      
      // Special origins based on early behavior
      const earlyActionsQuery = `
        SELECT action_type, COUNT(*) as count
        FROM player_actions 
        WHERE player_id = $1 AND created_at < created_at + INTERVAL '7 days'
        GROUP BY action_type
      `;
      
      const earlyActions = await this.db.query(earlyActionsQuery, [player.id]);
      
      if (earlyActions.rows.some(action => action.action_type === 'invite')) {
        origin.pathway = 'recruiter';
        origin.type = 'ambassador';
      } else if (earlyActions.rows.some(action => action.action_type === 'teach')) {
        origin.pathway = 'educator';
        origin.type = 'mentor';
      } else if (earlyActions.rows.some(action => action.action_type === 'create')) {
        origin.pathway = 'creator';
        origin.type = 'cultural_leader';
      }
      
      return origin;
    } catch (error) {
      console.error('Error assigning origin:', error);
      return { type: 'citizen', country: 'Unknown', pathway: 'standard' };
    }
  }

  async generateStoryPath(playerId, behaviorAnalysis) {
    try {
      const storyPath = {
        chapters: [],
        currentChapter: 1,
        theme: 'discovery',
        narrative: 'A citizen begins their journey'
      };
      
      // Generate story chapters based on actions
      const actionsQuery = `
        SELECT action_type, description, impact_score, created_at
        FROM player_actions 
        WHERE player_id = $1 
        ORDER BY created_at ASC
        LIMIT 10
      `;
      
      const actions = await this.db.query(actionsQuery, [playerId]);
      
      actions.rows.forEach((action, index) => {
        storyPath.chapters.push({
          chapter: index + 1,
          title: this.generateChapterTitle(action.action_type),
          description: action.description,
          impact: action.impact_score,
          timestamp: action.created_at,
          emotionalWeight: this.calculateEmotionalWeight(action.action_type)
        });
      });
      
      // Determine story theme
      if (behaviorAnalysis.primaryActions.some(action => action.action_type === 'teach')) {
        storyPath.theme = 'mentorship';
        storyPath.narrative = 'A guide emerges to light the way for others';
      } else if (behaviorAnalysis.primaryActions.some(action => action.action_type === 'create')) {
        storyPath.theme = 'creation';
        storyPath.narrative = 'A builder shapes the world with imagination';
      } else if (behaviorAnalysis.primaryActions.some(action => action.action_type === 'diplomacy')) {
        storyPath.theme = 'unity';
        storyPath.narrative = 'A bridge builder connects distant shores';
      }
      
      return storyPath;
    } catch (error) {
      console.error('Error generating story path:', error);
      return { chapters: [], theme: 'discovery' };
    }
  }

  determineContributionStyle(behaviorAnalysis) {
    const styles = {
      mentor: { keywords: ['teach', 'guide', 'help', 'support'], weight: 0 },
      creator: { keywords: ['create', 'design', 'art', 'story'], weight: 0 },
      organizer: { keywords: ['organize', 'coordinate', 'manage', 'lead'], weight: 0 },
      diplomat: { keywords: 'diplomacy', weight: 0 },
      builder: { keywords: ['build', 'construct', 'develop', 'infrastructure'], weight: 0 },
      explorer: { keywords: ['discover', 'explore', 'research', 'investigate'], weight: 0 }
    };
    
    // Calculate weights based on behavior patterns
    behaviorAnalysis.patterns.forEach(pattern => {
      Object.keys(styles).forEach(style => {
        if (styles[style].keywords.some(keyword => 
          pattern.action_type.toLowerCase().includes(keyword.toLowerCase()))) {
          styles[style].weight += pattern.frequency;
        }
      });
    });
    
    // Find dominant style
    const dominantStyle = Object.keys(styles).reduce((a, b) => 
      styles[a].weight > styles[b].weight ? a : b
    );
    
    return {
      primary: dominantStyle,
      secondary: Object.keys(styles).sort((a, b) => styles[b].weight - styles[a].weight)[1],
      confidence: styles[dominantStyle].weight / behaviorAnalysis.patterns.reduce((sum, p) => sum + p.frequency, 0),
      visualSignature: this.getVisualSignature(dominantStyle)
    };
  }

  async calculateReputationAura(playerId) {
    try {
      const reputationQuery = `
        SELECT 
          reputation_score,
          positive_actions,
          negative_actions,
          community_recognition,
          historical_significance
        FROM reputation_dna 
        WHERE player_id = $1
      `;
      
      const reputationResult = await this.db.query(reputationQuery, [playerId]);
      
      if (reputationResult.rows.length === 0) {
        return { intensity: 0.1, color: 'gray', pattern: 'simple' };
      }
      
      const reputation = reputationResult.rows[0];
      
      // Calculate aura properties
      const intensity = Math.min(1.0, reputation.reputation_score / 1000);
      const color = this.getAuraColor(reputation);
      const pattern = this.getAuraPattern(reputation);
      
      return {
        intensity,
        color,
        pattern,
        glowRadius: intensity * 50,
        pulseFrequency: 0.5 + (intensity * 2),
        emotionalResonance: await this.calculateEmotionalResonance(playerId)
      };
    } catch (error) {
      console.error('Error calculating reputation aura:', error);
      return { intensity: 0.1, color: 'gray', pattern: 'simple' };
    }
  }

  // ===================================
  // 2. BELONGING ENGINE
  // ===================================

  async createCommunityBond(countryId, achievement) {
    try {
      // Get all citizens of the country
      const citizensQuery = `
        SELECT player_id FROM global_citizens 
        WHERE country_code = $1 AND is_active = true
      `;
      const citizensResult = await this.db.query(citizensQuery, [countryId]);
      
      // Trigger community celebration
      await this.triggerCommunityCelebration(countryId, achievement);
      
      // Display contributor names
      await this.displayContributors(countryId, achievement);
      
      // Create shared memory
      await this.createSharedMemory(countryId, achievement);
      
      // Update emotional bonds for all citizens
      for (const citizen of citizensResult.rows) {
        await this.updateEmotionalBond(citizen.player_id, 'belonging', 0.3);
        await this.updateEmotionalBond(citizen.player_id, 'country_pride', 0.2);
        await this.triggerBelongingEffect(citizen.player_id, countryId, achievement);
      }
      
      return { success: true, message: 'Community bond created' };
    } catch (error) {
      console.error('Error creating community bond:', error);
      throw error;
    }
  }

  async triggerCommunityCelebration(countryId, achievement) {
    try {
      // Create celebration event
      const celebrationQuery = `
        INSERT INTO community_celebrations (
          country_id, achievement_type, description, 
          celebration_level, duration, created_at
        ) VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING id
      `;
      
      const celebrationResult = await this.db.query(celebrationQuery, [
        countryId, 
        achievement.type, 
        achievement.description,
        this.calculateCelebrationLevel(achievement),
        300 // 5 minutes
      ]);
      
      const celebrationId = celebrationResult.rows[0].id;
      
      // Trigger visual effects
      await this.triggerCelebrationVisuals(countryId, celebrationId);
      
      // Send notifications
      await this.sendCelebrationNotifications(countryId, celebrationId);
      
      return celebrationId;
    } catch (error) {
      console.error('Error triggering community celebration:', error);
      throw error;
    }
  }

  // ===================================
  // 3. RECOGNITION CASCADE
  // ===================================

  async processContribution(playerId, action) {
    try {
      // Calculate impact
      const impact = await this.calculateImpact(action);
      
      let recognitionLevel = 'micro';
      let recognitionActions = [];
      
      if (impact.score >= 0.8) {
        // Historical Recognition
        recognitionLevel = 'historical';
        recognitionActions = await this.grantHistoricalRecognition(playerId, action, impact);
      } else if (impact.score >= 0.5) {
        // Social Recognition
        recognitionLevel = 'social';
        recognitionActions = await this.grantSocialRecognition(playerId, action, impact);
      } else {
        // Micro Recognition
        recognitionLevel = 'micro';
        recognitionActions = await this.grantMicroRecognition(playerId, action, impact);
      }
      
      // Update emotional state
      await this.updateEmotionalState(playerId, 'recognition', impact.emotionalWeight);
      
      // Log recognition
      await this.logRecognition(playerId, action, recognitionLevel, impact);
      
      return {
        recognitionLevel,
        actions: recognitionActions,
        impact: impact.score
      };
    } catch (error) {
      console.error('Error processing contribution:', error);
      throw error;
    }
  }

  async grantHistoricalRecognition(playerId, action, impact) {
    try {
      const actions = [];
      
      // Add to history book
      const historyEntry = await this.addToHistoryBook(playerId, action);
      actions.push(historyEntry);
      
      // Create monument
      const monument = await this.createMonument(playerId, action);
      actions.push(monument);
      
      // Grant title
      const title = await this.grantTitle(playerId, action);
      actions.push(title);
      
      // Public announcement
      const announcement = await this.makePublicAnnouncement(playerId, action, 'historical');
      actions.push(announcement);
      
      return actions;
    } catch (error) {
      console.error('Error granting historical recognition:', error);
      throw error;
    }
  }

  async addToHistoryBook(playerId, action) {
    try {
      const historyQuery = `
        INSERT INTO civilization_history (
          player_id, action_type, description, impact_score,
          historical_significance, recorded_at, category
        ) VALUES ($1, $2, $3, $4, $5, NOW(), $6)
        RETURNING id, historical_significance
      `;
      
      const result = await this.db.query(historyQuery, [
        playerId,
        action.type,
        action.description,
        action.impact_score,
        'legendary',
        'achievement'
      ]);
      
      return {
        type: 'history_entry',
        id: result.rows[0].id,
        significance: result.rows[0].historical_significance
      };
    } catch (error) {
      console.error('Error adding to history book:', error);
      throw error;
    }
  }

  // ===================================
  // 4. PURPOSE GENERATION SYSTEM
  // ===================================

  async discoverPurpose(playerId) {
    try {
      // Analyze behavior patterns
      const behavior = await this.analyzePlayerBehavior(playerId);
      
      // Match behavior to purpose
      const purpose = await this.matchBehaviorToPurpose(behavior);
      
      // Present purpose as discovery
      const discoveryEvent = await this.presentPurposeAsDiscovery(playerId, purpose);
      
      // Unlock purpose-specific features
      await this.unlockPurposeFeatures(playerId, purpose);
      
      // Update emotional state
      await this.updateEmotionalState(playerId, 'purpose', 0.4);
      
      return {
        purpose,
        discoveryEvent,
        unlockedFeatures: purpose.unlockedFeatures
      };
    } catch (error) {
      console.error('Error discovering purpose:', error);
      throw error;
    }
  }

  async matchBehaviorToPurpose(behavior) {
    const purposes = {
      mentor: {
        indicators: ['teach', 'guide', 'help', 'support', 'answer'],
        features: ['mentee_assignment', 'teaching_tools', 'knowledge_sharing'],
        title: 'Mentor',
        description: 'You guide others on their journey'
      },
      cultural_leader: {
        indicators: ['create', 'art', 'story', 'music', 'design'],
        features: ['cultural_creation', 'curation_tools', 'event_planning'],
        title: 'Cultural Leader',
        description: 'You shape the soul of civilization'
      },
      organizer: {
        indicators: ['organize', 'coordinate', 'manage', 'lead', 'plan'],
        features: ['event_tools', 'coordination_features', 'team_management'],
        title: 'Organizer',
        description: 'You bring people together'
      },
      diplomat: {
        indicators: ['diplomacy', 'negotiate', 'mediate', 'bridge', 'connect'],
        features: ['negotiation_tools', 'embassy_access', 'peacekeeping'],
        title: 'Diplomat',
        description: 'You build bridges between communities'
      },
      builder: {
        indicators: ['build', 'construct', 'develop', 'infrastructure', 'system'],
        features: ['building_tools', 'infrastructure_access', 'system_design'],
        title: 'Builder',
        description: 'You create the foundations of civilization'
      },
      explorer: {
        indicators: ['discover', 'explore', 'research', 'investigate', 'pioneer'],
        features: ['exploration_tools', 'research_access', 'discovery_sharing'],
        title: 'Explorer',
        description: 'You venture into the unknown'
      }
    };
    
    // Calculate purpose scores
    const purposeScores = {};
    
    Object.keys(purposes).forEach(purposeKey => {
      const purpose = purposes[purposeKey];
      let score = 0;
      
      behavior.patterns.forEach(pattern => {
        if (purpose.indicators.some(indicator => 
          pattern.action_type.toLowerCase().includes(indicator.toLowerCase()))) {
          score += pattern.frequency * (pattern.avg_impact || 1);
        }
      });
      
      purposeScores[purposeKey] = score;
    });
    
    // Find best match
    const bestPurpose = Object.keys(purposeScores).reduce((a, b) => 
      purposeScores[a] > purposeScores[b] ? a : b
    );
    
    return {
      type: bestPurpose,
      confidence: purposeScores[bestPurpose] / Object.values(purposeScores).reduce((sum, score) => sum + score, 0),
      ...purposes[bestPurpose],
      score: purposeScores[bestPurpose]
    };
  }

  // ===================================
  // 5. VISIBLE IMPACT FEEDBACK
  // ===================================

  async visualizeImpact(playerId, action) {
    try {
      // Calculate impact
      const impact = await this.calculateImpact(action);
      
      // Create visualization
      const visualization = await this.createVisualization(impact);
      
      // Render world effect
      await this.renderWorldEffect(visualization);
      
      // Show personal feedback
      await this.showPersonalFeedback(playerId, impact);
      
      // Update community stats
      await this.updateCommunityStats(playerId, action);
      
      // Psychological reinforcement
      await this.reinforcePsychologically(playerId, impact);
      
      return {
        visualization,
        impact: impact.score,
        emotionalResponse: impact.emotionalWeight
      };
    } catch (error) {
      console.error('Error visualizing impact:', error);
      throw error;
    }
  }

  async createVisualization(impact) {
    const visualizations = {
      country_expansion: {
        type: 'territory_growth',
        duration: 3000,
        intensity: impact.score,
        color: '#4CAF50',
        effect: 'expanding_border'
      },
      knowledge_growth: {
        type: 'structure_illumination',
        duration: 2000,
        intensity: impact.score,
        color: '#2196F3',
        effect: 'glowing_structures'
      },
      stability_increase: {
        type: 'aura_formation',
        duration: 2500,
        intensity: impact.score,
        color: '#9C27B0',
        effect: 'protective_field'
      },
      collaboration_bridge: {
        type: 'bridge_creation',
        duration: 4000,
        intensity: impact.score,
        color: '#FF9800',
        effect: 'energy_bridge'
      },
      cultural_creation: {
        type: 'art_manifestation',
        duration: 3500,
        intensity: impact.score,
        color: '#E91E63',
        effect: 'cultural_artifact'
      }
    };
    
    return visualizations[impact.type] || visualizations.country_expansion;
  }

  // ===================================
  // 6. LEGACY ENGINE
  // ===================================

  async createLegacy(playerId) {
    try {
      // Gather legacy data
      const legacy = await this.gatherLegacyData(playerId);
      
      // Create historical records
      const historicalRecords = await this.createHistoricalRecords(playerId, legacy);
      
      // Create memorial
      const memorial = await this.createMemorial(playerId, legacy);
      
      // Enable storytelling
      await this.enableStorytelling(playerId, legacy);
      
      // Grant immortality
      await this.grantEmotionalImmortality(playerId);
      
      return {
        legacy,
        historicalRecords,
        memorial,
        storytellingEnabled: true
      };
    } catch (error) {
      console.error('Error creating legacy:', error);
      throw error;
    }
  }

  async gatherLegacyData(playerId) {
    try {
      const legacyQuery = `
        SELECT 
          -- Founding status
          created_at < NOW() - INTERVAL '2 years' as founding_member,
          
          -- Historic missions
          (SELECT COUNT(*) FROM mission_participants 
           WHERE player_id = $1 AND impact_score > 0.8) as historic_missions,
           
          -- Diplomatic achievements
          (SELECT COUNT(*) FROM diplomatic_achievements 
           WHERE player_id = $1 AND success_rate > 0.9) as diplomatic_wins,
           
          -- Cultural contributions
          (SELECT COUNT(*) FROM cultural_creations 
           WHERE creator_id = $1 AND community_value > 0.7) as cultural_contributions,
           
          -- Mentorship impact
          (SELECT COUNT(*) FROM mentorship_relationships 
           WHERE mentor_id = $1 AND rating > 4.5) as mentorship_impact,
           
          -- Leadership roles
          (SELECT COUNT(*) FROM leadership_positions 
           WHERE holder_id = $1 AND tenure_days > 30) as leadership_roles,
           
          -- Total impact score
          (SELECT COALESCE(SUM(impact_score), 0) FROM player_actions 
           WHERE player_id = $1) as total_impact
      `;
      
      const result = await this.db.query(legacyQuery, [playerId]);
      
      return result.rows[0] || {};
    } catch (error) {
      console.error('Error gathering legacy data:', error);
      return {};
    }
  }

  // ===================================
  // 7. SHARED STRUGGLE MECHANIC
  // ===================================

  async createSharedChallenge(civilizationId) {
    try {
      // Generate appropriate challenge
      const challenge = await this.generateAppropriateChallenge(civilizationId);
      
      // Announce challenge
      await this.announceChallenge(challenge);
      
      // Enable cooperation tools
      await this.enableCooperationTools(challenge);
      
      // Track cooperation
      const cooperationTracker = await this.trackCooperation(challenge);
      
      return {
        challenge,
        cooperationTracker,
        status: 'active'
      };
    } catch (error) {
      console.error('Error creating shared challenge:', error);
      throw error;
    }
  }

  // ===================================
  // 8. SYMBOL & MYTH CREATION
  // ===================================

  async createCommunitySymbols(countryId) {
    try {
      // Get country history
      const history = await this.getCountryHistory(countryId);
      
      // Evolve symbols
      const symbols = await this.evolveSymbols(countryId, history);
      
      // Update symbols
      await this.updateSymbols(countryId, symbols);
      
      // Enable storytelling
      await this.enableStorytelling(countryId, symbols);
      
      return symbols;
    } catch (error) {
      console.error('Error creating community symbols:', error);
      throw error;
    }
  }

  // ===================================
  // 9. EMOTIONAL RHYTHM SYSTEM
  // ===================================

  async manageEmotionalCycle(playerId) {
    try {
      // Detect current phase
      const currentPhase = await this.detectEmotionalPhase(playerId);
      
      // Provide phase-appropriate features
      await this.providePhaseFeatures(playerId, currentPhase);
      
      // Monitor emotional health
      await this.monitorEmotionalHealth(playerId);
      
      return {
        currentPhase,
        featuresEnabled: await this.getPhaseFeatures(currentPhase),
        emotionalHealth: await this.getEmotionalHealth(playerId)
      };
    } catch (error) {
      console.error('Error managing emotional cycle:', error);
      throw error;
    }
  }

  // ===================================
  // 10. ETHICAL SAFETY CORE
  // ===================================

  async ensureHealthyEngagement(playerId) {
    try {
      // Check session time
      const sessionInfo = await this.checkSessionTime(playerId);
      
      // Send gentle reminders
      if (sessionInfo.duration > this.safetyThresholds.maxSessionTime) {
        await this.sendGentleReminder(playerId);
      }
      
      // Offer rest bonuses
      if (sessionInfo.sinceLastSession > this.safetyThresholds.restBonusInterval) {
        await this.offerRestBonus(playerId);
      }
      
      // Monitor emotional health
      const emotionalHealth = await this.getEmotionalHealth(playerId);
      
      if (emotionalHealth.score < this.safetyThresholds.emotionalHealthMin) {
        await this.provideSupportResources(playerId);
      }
      
      // Ensure no manipulation
      await this.ensureEthicalBoundaries(playerId);
      
      return {
        sessionHealthy: sessionInfo.duration <= this.safetyThresholds.maxSessionTime,
        emotionalHealthy: emotionalHealth.score >= this.safetyThresholds.emotionalHealthMin,
        ethicalBoundaries: true
      };
    } catch (error) {
      console.error('Error ensuring healthy engagement:', error);
      throw error;
    }
  }

  // ===================================
  // HELPER METHODS
  // ===================================

  async calculateImpact(action) {
    // AI-powered impact calculation
    const impactAnalysis = await this.aiService.analyzeImpact(action);
    
    return {
      score: impactAnalysis.score,
      type: impactAnalysis.type,
      emotionalWeight: impactAnalysis.emotionalWeight,
      communityValue: impactAnalysis.communityValue,
      historicalSignificance: impactAnalysis.historicalSignificance
    };
  }

  async updateEmotionalState(playerId, emotion, intensity) {
    const updateQuery = `
      INSERT INTO player_emotional_state (
        player_id, emotion_type, intensity, updated_at
      ) VALUES ($1, $2, $3, NOW())
      ON CONFLICT (player_id, emotion_type) 
      DO UPDATE SET 
        intensity = EXCLUDED.intensity,
        updated_at = NOW()
    `;
    
    await this.db.query(updateQuery, [playerId, emotion, intensity]);
  }

  async triggerIdentityEffect(playerId, identity) {
    // Create psychological effect of identity formation
    const effectQuery = `
      INSERT INTO psychological_effects (
        player_id, effect_type, intensity, duration, created_at
      ) VALUES ($1, 'identity_formation', $2, $3, NOW())
    `;
    
    await this.db.query(effectQuery, [
      playerId, 
      identity.identityStrength, 
      86400 // 24 hours
    ]);
  }

  getAuraColor(reputation) {
    if (reputation.reputation_score > 800) return 'gold';
    if (reputation.reputation_score > 600) return 'purple';
    if (reputation.reputation_score > 400) return 'blue';
    if (reputation.reputation_score > 200) return 'green';
    return 'gray';
  }

  getAuraPattern(reputation) {
    if (reputation.historical_significance === 'legendary') return 'radiant';
    if (reputation.community_recognition > 0.8) return 'pulsing';
    if (reputation.positive_actions > reputation.negative_actions * 2) return 'steady';
    return 'flickering';
  }

  getVisualSignature(style) {
    const signatures = {
      mentor: 'wisdom_glow',
      creator: 'creative_spark',
      organizer: 'coordination_web',
      diplomat: 'peace_aura',
      builder: 'foundation_strength',
      explorer: 'discovery_light'
    };
    
    return signatures[style] || 'neutral_aura';
  }

  generateChapterTitle(actionType) {
    const titles = {
      invite: 'The Ambassador\'s Call',
      teach: 'The First Lesson',
      create: 'The Creator\'s Mark',
      help: 'The Helping Hand',
      organize: 'The Gathering',
      diplomacy: 'The Bridge Builder',
      build: 'The Foundation',
      explore: 'The Discovery'
    };
    
    return titles[actionType] || 'A New Beginning';
  }

  calculateEmotionalWeight(actionType) {
    const weights = {
      teach: 0.8,
      create: 0.7,
      help: 0.6,
      organize: 0.7,
      diplomacy: 0.9,
      invite: 0.5,
      build: 0.6,
      explore: 0.4
    };
    
    return weights[actionType] || 0.3;
  }
}

export default CivilizationEmotionEngine;
