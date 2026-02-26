// ========================================
// VISUAL EVOLUTION ENGINE (VEE)
// The Identity System That Never Ends
// ========================================

import { Pool } from 'pg';

export interface VisualEvolutionTrigger {
  type: EvolutionTriggerType;
  condition: string;
  visualEffect: VisualEffect;
  rarity: EvolutionRarity;
  permanence: PermanenceType;
}

export interface VisualLayer {
  id: string;
  name: string;
  type: LayerType;
  baseAsset: string;
  effects: VisualEffect[];
  conditions: LayerCondition[];
  stackOrder: number;
  blendMode: BlendMode;
}

export interface VisualEffect {
  type: EffectType;
  intensity: number;
  duration?: number;
  animation?: AnimationConfig;
  color?: ColorConfig;
  particle?: ParticleConfig;
  sound?: SoundConfig;
}

export interface PlayerVisualProfile {
  playerId: string;
  baseAvatar: string;
  activeLayers: VisualLayer[];
  evolutionHistory: EvolutionRecord[];
  currentTier: number;
  visualDNA: VisualDNA;
  prestigeLevel: number;
  lastEvolution: Date;
}

export interface VisualDNA {
  leadershipScore: number;
  communityImpact: number;
  economicActivity: number;
  knowledgeLevel: number;
  loyaltyTime: number;
  creativity: number;
  trustScore: number;
  wisdomScore: number;
  mentorshipScore: number;
  innovationScore: number;
}

export interface EvolutionRecord {
  id: string;
  triggerType: EvolutionTriggerType;
  visualChange: string;
  timestamp: Date;
  rarity: EvolutionRarity;
  socialVisibility: boolean;
  communityReaction: CommunityReaction;
}

export interface CommunityReaction {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  congratulations: number;
  inspirationLevel: number;
}

export enum EvolutionTriggerType {
  REPUTATION_MILESTONE = 'reputation_milestone',
  BADGE_EARNED = 'badge_earned',
  LEADERSHIP_ACHIEVEMENT = 'leadership_achievement',
  COMMUNITY_CONTRIBUTION = 'community_contribution',
  ECONOMIC_SUCCESS = 'economic_success',
  KNOWLEDGE_SHARING = 'knowledge_sharing',
  MENTORSHIP_EXCELLENCE = 'mentorship_excellence',
  LOYALITY_MILESTONE = 'loyalty_milestone',
  GOVERNANCE_PARTICIPATION = 'governance_participation',
  CRISIS_LEADERSHIP = 'crisis_leadership',
  INNOVATION_BREAKTHROUGH = 'innovation_breakthrough'
}

export enum LayerType {
  BASE_AVATAR = 'base_avatar',
  RANK_FRAME = 'rank_frame',
  REPUTATION_AURA = 'reputation_aura',
  LEADERSHIP_SYMBOL = 'leadership_symbol',
  SEASONAL_EFFECT = 'seasonal_effect',
  LEGENDARY_PARTICLES = 'legendary_particles',
  ACHIEVEMENT_BADGES = 'achievement_badges',
  COMMUNITY_BANNERS = 'community_banners',
  WISDOM_GLOW = 'wisdom_glow',
  ECONOMIC_AURA = 'economic_aura'
}

export enum EffectType {
  GLOW = 'glow',
  PARTICLE_SYSTEM = 'particle_system',
  COLOR_SHIFT = 'color_shift',
  ANIMATION_OVERRIDE = 'animation_override',
  SOUND_EFFECT = 'sound_effect',
  GEOMETRIC_TRANSFORMATION = 'geometric_transformation',
  LUMINOSITY = 'luminosity',
  RIPPLE_EFFECT = 'ripple_effect',
  ENERGY_FIELD = 'energy_field',
  MYSTICAL_AURA = 'mystical_aura'
}

export enum EvolutionRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
  MYTHIC = 'mythic',
  TRANSCENDENT = 'transcendent'
}

export enum PermanenceType {
  TEMPORARY = 'temporary',
  CONDITIONAL = 'conditional',
  PERMANENT = 'permanent',
  SACRED = 'sacred'
}

export enum BlendMode {
  NORMAL = 'normal',
  MULTIPLY = 'multiply',
  SCREEN = 'screen',
  OVERLAY = 'overlay',
  SOFT_LIGHT = 'soft_light',
  HARD_LIGHT = 'hard_light',
  COLOR_DODGE = 'color_dodge',
  COLOR_BURN = 'color_burn'
}

export interface AnimationConfig {
  type: string;
  speed: number;
  easing: string;
  loop: boolean;
  intensity: number;
}

export interface ColorConfig {
  primary: string;
  secondary: string;
  gradient?: string;
  pulseColor?: string;
  opacity: number;
}

export interface ParticleConfig {
  count: number;
  size: number;
  speed: number;
  lifetime: number;
  emissionRate: number;
  patterns: string[];
}

export interface SoundConfig {
  type: string;
  volume: number;
  pitch: number;
  trigger: string;
  loop: boolean;
}

export interface LayerCondition {
  type: ConditionType;
  threshold: number;
  duration?: number;
  decayRate?: number;
}

export enum ConditionType {
  REPUTATION_THRESHOLD = 'reputation_threshold',
  ACTIVITY_STREAK = 'activity_streak',
  LEADERSHIP_SCORE = 'leadership_score',
  COMMUNITY_CONTRIBUTION = 'community_contribution',
  ECONOMIC_SUCCESS = 'economic_success',
  MENTORSHIP_EXCELLENCE = 'mentorship_excellence',
  TIME_IN_COMMUNITY = 'time_in_community',
  GOVERNANCE_PARTICIPATION = 'governance_participation',
  INNOVATION_SCORE = 'innovation_score',
  WISDOM_LEVEL = 'wisdom_level',
  PRESTIGE_LEVEL = 'prestige_level'
}

export class VisualEvolutionEngine {
  private pool: Pool;
  private evolutionTriggers: Map<EvolutionTriggerType, VisualEvolutionTrigger[]>;
  private visualLayers: Map<LayerType, VisualLayer[]>;
  private assetLibrary: AssetLibrary;

  constructor(pool: Pool) {
    this.pool = pool;
    this.evolutionTriggers = new Map();
    this.visualLayers = new Map();
    this.assetLibrary = new AssetLibrary();
    this.initializeEvolutionSystem();
  }

  // ========================================
  // CORE VISUAL EVOLUTION SYSTEM
  // ========================================

  private async initializeEvolutionSystem(): Promise<void> {
    await this.loadEvolutionTriggers();
    await this.loadVisualLayers();
    await this.initializeAssetLibrary();
  }

  async processPlayerEvolution(playerId: string, actionData: any): Promise<{
    evolved: boolean;
    newVisuals: VisualLayer[];
    socialImpact: SocialImpact;
    prestigeChange: number;
  }> {
    try {
      // Get current player visual profile
      const currentProfile = await this.getPlayerVisualProfile(playerId);
      
      // Update player's Visual DNA based on action
      const updatedDNA = await this.updateVisualDNA(currentProfile.visualDNA, actionData);
      
      // Check for evolution triggers
      const triggeredEvolutions = await this.checkEvolutionTriggers(updatedDNA, currentProfile);
      
      if (triggeredEvolutions.length === 0) {
        return {
          evolved: false,
          newVisuals: [],
          socialImpact: { visibility: 0, inspiration: 0, status: 'unchanged' },
          prestigeChange: 0
        };
      }

      // Apply visual evolutions
      const newVisuals = await this.applyVisualEvolutions(currentProfile, triggeredEvolutions);
      
      // Calculate social impact
      const socialImpact = await this.calculateSocialImpact(triggeredEvolutions, currentProfile);
      
      // Update prestige level
      const prestigeChange = await this.updatePrestigeLevel(currentProfile, triggeredEvolutions);
      
      // Save updated profile
      await this.savePlayerVisualProfile({
        ...currentProfile,
        visualDNA: updatedDNA,
        activeLayers: [...currentProfile.activeLayers, ...newVisuals],
        lastEvolution: new Date()
      });

      // Broadcast evolution to community
      await this.broadcastEvolution(playerId, triggeredEvolutions, socialImpact);

      return {
        evolved: true,
        newVisuals,
        socialImpact,
        prestigeChange
      };
    } catch (error) {
      console.error('Error processing player evolution:', error);
      throw error;
    }
  }

  private async updateVisualDNA(currentDNA: VisualDNA, actionData: any): Promise<VisualDNA> {
    const updatedDNA = { ...currentDNA };

    // Update DNA based on action type
    switch (actionData.type) {
      case 'leadership_action':
        updatedDNA.leadershipScore = Math.min(100, updatedDNA.leadershipScore + actionData.impact);
        break;
      case 'community_contribution':
        updatedDNA.communityImpact = Math.min(100, updatedDNA.communityImpact + actionData.impact);
        break;
      case 'economic_activity':
        updatedDNA.economicActivity = Math.min(100, updatedDNA.economicActivity + actionData.impact);
        break;
      case 'knowledge_sharing':
        updatedDNA.knowledgeLevel = Math.min(100, updatedDNA.knowledgeLevel + actionData.impact);
        break;
      case 'mentorship':
        updatedDNA.mentorshipScore = Math.min(100, updatedDNA.mentorshipScore + actionData.impact);
        break;
      case 'innovation':
        updatedDNA.innovationScore = Math.min(100, updatedDNA.innovationScore + actionData.impact);
        break;
      case 'trust_building':
        updatedDNA.trustScore = Math.min(100, updatedDNA.trustScore + actionData.impact);
        break;
      case 'wisdom_demonstration':
        updatedDNA.wisdomScore = Math.min(100, updatedDNA.wisdomScore + actionData.impact);
        break;
    }

    // Apply time-based loyalty decay/growth
    const daysSinceLastActivity = actionData.daysSinceLastActivity || 0;
    if (daysSinceLastActivity < 7) {
      updatedDNA.loyaltyTime = Math.min(100, updatedDNA.loyaltyTime + 0.1);
    } else {
      updatedDNA.loyaltyTime = Math.max(0, updatedDNA.loyaltyTime - daysSinceLastActivity * 0.01);
    }

    return updatedDNA;
  }

  private async checkEvolutionTriggers(visualDNA: VisualDNA, currentProfile: PlayerVisualProfile): Promise<VisualEvolutionTrigger[]> {
    const triggeredEvolutions: VisualEvolutionTrigger[] = [];

    for (const [triggerType, triggers] of this.evolutionTriggers) {
      for (const trigger of triggers) {
        if (await this.evaluateTriggerCondition(trigger.condition, visualDNA, currentProfile)) {
          triggeredEvolutions.push(trigger);
        }
      }
    }

    // Sort by rarity (rarer first)
    return triggeredEvolutions.sort((a, b) => {
      const rarityOrder = {
        [EvolutionRarity.TRANSCENDENT]: 6,
        [EvolutionRarity.MYTHIC]: 5,
        [EvolutionRarity.LEGENDARY]: 4,
        [EvolutionRarity.EPIC]: 3,
        [EvolutionRarity.RARE]: 2,
        [EvolutionRarity.UNCOMMON]: 1,
        [EvolutionRarity.COMMON]: 0
      };
      return rarityOrder[b.rarity] - rarityOrder[a.rarity];
    });
  }

  private async evaluateTriggerCondition(condition: string, visualDNA: VisualDNA, profile: PlayerVisualProfile): Promise<boolean> {
    try {
      // Parse condition (simplified for this example)
      // In production, this would use a more sophisticated expression parser
      const conditionParts = condition.split(' ');
      
      if (conditionParts.length !== 3) return false;

      const [property, operator, value] = conditionParts;
      const threshold = parseFloat(value);
      
      let currentValue = 0;
      
      // Map property to Visual DNA
      switch (property) {
        case 'leadership':
          currentValue = visualDNA.leadershipScore;
          break;
        case 'community':
          currentValue = visualDNA.communityImpact;
          break;
        case 'economic':
          currentValue = visualDNA.economicActivity;
          break;
        case 'knowledge':
          currentValue = visualDNA.knowledgeLevel;
          break;
        case 'mentorship':
          currentValue = visualDNA.mentorshipScore;
          break;
        case 'loyalty':
          currentValue = visualDNA.loyaltyTime;
          break;
        case 'trust':
          currentValue = visualDNA.trustScore;
          break;
        case 'wisdom':
          currentValue = visualDNA.wisdomScore;
          break;
        case 'innovation':
          currentValue = visualDNA.innovationScore;
          break;
        case 'prestige':
          currentValue = profile.prestigeLevel;
          break;
        case 'tier':
          currentValue = profile.currentTier;
          break;
        default:
          return false;
      }

      // Evaluate condition
      switch (operator) {
        case '>=':
          return currentValue >= threshold;
        case '>':
          return currentValue > threshold;
        case '<=':
          return currentValue <= threshold;
        case '<':
          return currentValue < threshold;
        case '==':
          return currentValue === threshold;
        default:
          return false;
      }
    } catch (error) {
      console.error('Error evaluating trigger condition:', error);
      return false;
    }
  }

  private async applyVisualEvolutions(profile: PlayerVisualProfile, evolutions: VisualEvolutionTrigger[]): Promise<VisualLayer[]> {
    const newLayers: VisualLayer[] = [];

    for (const evolution of evolutions) {
      const layer = await this.createVisualLayer(evolution.visualEffect, profile);
      if (layer) {
        newLayers.push(layer);
        
        // Record evolution
        await this.recordEvolution(profile.playerId, evolution, layer);
      }
    }

    return newLayers;
  }

  private async createVisualLayer(effect: VisualEffect, profile: PlayerVisualProfile): Promise<VisualLayer | null> {
    try {
      // Get base layer template for effect type
      const layerTemplates = this.visualLayers.get(this.getLayerTypeForEffect(effect.type));
      if (!layerTemplates || layerTemplates.length === 0) return null;

      // Select appropriate template based on player's current tier and prestige
      const template = this.selectLayerTemplate(layerTemplates, profile);

      // Create customized layer
      const layer: VisualLayer = {
        id: `layer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: template.name,
        type: template.type,
        baseAsset: template.baseAsset,
        effects: [effect],
        conditions: template.conditions,
        stackOrder: template.stackOrder,
        blendMode: template.blendMode
      };

      return layer;
    } catch (error) {
      console.error('Error creating visual layer:', error);
      return null;
    }
  }

  private getLayerTypeForEffect(effectType: EffectType): LayerType {
    const effectToLayerMap: { [key in EffectType]: LayerType } = {
      [EffectType.GLOW]: LayerType.REPUTATION_AURA,
      [EffectType.PARTICLE_SYSTEM]: LayerType.LEGENDARY_PARTICLES,
      [EffectType.COLOR_SHIFT]: LayerType.REPUTATION_AURA,
      [EffectType.ANIMATION_OVERRIDE]: LayerType.BASE_AVATAR,
      [EffectType.SOUND_EFFECT]: LayerType.BASE_AVATAR,
      [EffectType.GEOMETRIC_TRANSFORMATION]: LayerType.LEADERSHIP_SYMBOL,
      [EffectType.LUMINOSITY]: LayerType.WISDOM_GLOW,
      [EffectType.RIPPLE_EFFECT]: LayerType.COMMUNITY_BANNERS,
      [EffectType.ENERGY_FIELD]: LayerType.ECONOMIC_AURA,
      [EffectType.MYSTICAL_AURA]: LayerType.REPUTATION_AURA
    };

    return effectToLayerMap[effectType] || LayerType.REPUTATION_AURA;
  }

  private selectLayerTemplate(templates: VisualLayer[], profile: PlayerVisualProfile): VisualLayer {
    // Select template based on player's prestige and tier
    const suitableTemplates = templates.filter(template => {
      return template.conditions.every(condition => 
        this.evaluateLayerCondition(condition, profile)
      );
    });

    if (suitableTemplates.length === 0) {
      return templates[0]; // Fallback to first template
    }

    // Return the highest quality suitable template
    return suitableTemplates.reduce((best, current) => {
      return (current.stackOrder > best.stackOrder) ? current : best;
    });
  }

  private evaluateLayerCondition(condition: LayerCondition, profile: PlayerVisualProfile): boolean {
    switch (condition.type) {
      case ConditionType.REPUTATION_THRESHOLD:
        // This would check actual reputation - simplified for example
        return profile.prestigeLevel >= condition.threshold;
      case ConditionType.PRESTIGE_LEVEL:
        return profile.prestigeLevel >= condition.threshold;
      case ConditionType.TIME_IN_COMMUNITY:
        const daysInCommunity = (Date.now() - new Date(profile.lastEvolution).getTime()) / (1000 * 60 * 60 * 24);
        return daysInCommunity >= condition.threshold;
      default:
        return true;
    }
  }

  private async calculateSocialImpact(evolutions: VisualEvolutionTrigger[], profile: PlayerVisualProfile): Promise<SocialImpact> {
    let visibility = 0;
    let inspiration = 0;

    for (const evolution of evolutions) {
      // Calculate visibility based on rarity
      const rarityVisibility = {
        [EvolutionRarity.COMMON]: 1,
        [EvolutionRarity.UNCOMMON]: 2,
        [EvolutionRarity.RARE]: 5,
        [EvolutionRarity.EPIC]: 10,
        [EvolutionRarity.LEGENDARY]: 25,
        [EvolutionRarity.MYTHIC]: 50,
        [EvolutionRarity.TRANSCENDENT]: 100
      };

      visibility += rarityVisibility[evolution.rarity] || 0;

      // Calculate inspiration based on visual impact
      inspiration += evolution.visualEffect.intensity * (evolution.visualEffect.duration || 1) / 100;
    }

    // Amplify based on player's existing prestige
    visibility *= (1 + profile.prestigeLevel * 0.1);
    inspiration *= (1 + profile.prestigeLevel * 0.05);

    // Determine status
    let status: 'unchanged' | 'noticed' | 'admired' | 'celebrated' | 'legendary' = 'unchanged';
    if (visibility > 100) status = 'legendary';
    else if (visibility > 50) status = 'celebrated';
    else if (visibility > 20) status = 'admired';
    else if (visibility > 5) status = 'noticed';

    return { visibility, inspiration, status };
  }

  private async updatePrestigeLevel(profile: PlayerVisualProfile, evolutions: VisualEvolutionTrigger[]): Promise<number> {
    let prestigeChange = 0;

    for (const evolution of evolutions) {
      const prestigeValue = {
        [EvolutionRarity.COMMON]: 1,
        [EvolutionRarity.UNCOMMON]: 2,
        [EvolutionRarity.RARE]: 5,
        [EvolutionRarity.EPIC]: 10,
        [EvolutionRarity.LEGENDARY]: 25,
        [EvolutionRarity.MYTHIC]: 50,
        [EvolutionRarity.TRANSCENDENT]: 100
      };

      prestigeChange += prestigeValue[evolution.rarity] || 0;
    }

    // Update player's prestige level
    const newPrestigeLevel = profile.prestigeLevel + prestigeChange;

    // Check for tier advancement
    const tierThresholds = [0, 10, 25, 50, 100, 200, 500, 1000, 2500, 5000];
    const newTier = tierThresholds.findIndex((threshold, index) => 
      threshold <= newPrestigeLevel && (index === tierThresholds.length - 1 || newPrestigeLevel < tierThresholds[index + 1])
    );

    if (newTier > profile.currentTier) {
      // Tier advancement - grant special visual rewards
      await this.grantTierAdvancementRewards(profile.playerId, newTier);
    }

    return prestigeChange;
  }

  private async recordEvolution(playerId: string, evolution: VisualEvolutionTrigger, layer: VisualLayer): Promise<void> {
    try {
      await this.pool.query(
        `INSERT INTO visual_evolution_records (
            player_id, evolution_trigger_id, visual_layer_id, 
            trigger_type, rarity, visual_change, timestamp, social_visibility
          ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)`,
        [
          playerId,
          evolution.type,
          layer.id,
          evolution.type,
          evolution.rarity,
          JSON.stringify(layer),
          evolution.rarity !== EvolutionRarity.COMMON
        ]
      );
    } catch (error) {
      console.error('Error recording evolution:', error);
    }
  }

  private async broadcastEvolution(playerId: string, evolutions: VisualEvolutionTrigger[], socialImpact: SocialImpact): Promise<void> {
    try {
      // Create social broadcast for significant evolutions
      if (socialImpact.visibility > 5) {
        await this.pool.query(
          `INSERT INTO social_broadcasts (
              player_id, event_type, event_data, visibility_level, 
              inspiration_score, broadcast_at
            ) VALUES ($1, $2, $3, $4, $5, NOW())`,
          [
            playerId,
            'visual_evolution',
            JSON.stringify({
              evolutions: evolutions.map(e => ({
                type: e.type,
                rarity: e.rarity,
                effect: e.visualEffect.type
              })),
              socialImpact
            }),
            socialImpact.status,
            socialImpact.inspiration
          ]
        );
      }
    } catch (error) {
      console.error('Error broadcasting evolution:', error);
    }
  }

  // ========================================
  // PLAYER PROFILE MANAGEMENT
  // ========================================

  async getPlayerVisualProfile(playerId: string): Promise<PlayerVisualProfile> {
    try {
      const result = await this.pool.query(
        `SELECT * FROM player_visual_profiles WHERE player_id = $1`,
        [playerId]
      );

      if (result.rows.length === 0) {
        // Create new profile
        return await this.createPlayerVisualProfile(playerId);
      }

      const profileData = result.rows[0];
      
      return {
        playerId: profileData.player_id,
        baseAvatar: profileData.base_avatar,
        activeLayers: JSON.parse(profileData.active_layers || '[]'),
        evolutionHistory: await this.getEvolutionHistory(playerId),
        currentTier: profileData.current_tier,
        visualDNA: JSON.parse(profileData.visual_dna || '{}'),
        prestigeLevel: profileData.prestige_level,
        lastEvolution: profileData.last_evolution
      };
    } catch (error) {
      console.error('Error getting player visual profile:', error);
      throw error;
    }
  }

  private async createPlayerVisualProfile(playerId: string): Promise<PlayerVisualProfile> {
    const defaultProfile: PlayerVisualProfile = {
      playerId,
      baseAvatar: '/assets/avatars/default.png',
      activeLayers: [],
      evolutionHistory: [],
      currentTier: 0,
      visualDNA: {
        leadershipScore: 0,
        communityImpact: 0,
        economicActivity: 0,
        knowledgeLevel: 0,
        loyaltyTime: 0,
        creativity: 0,
        trustScore: 0,
        wisdomScore: 0,
        mentorshipScore: 0,
        innovationScore: 0
      },
      prestigeLevel: 0,
      lastEvolution: new Date()
    };

    await this.savePlayerVisualProfile(defaultProfile);
    return defaultProfile;
  }

  private async savePlayerVisualProfile(profile: PlayerVisualProfile): Promise<void> {
    try {
      await this.pool.query(
        `INSERT INTO player_visual_profiles (
            player_id, base_avatar, active_layers, current_tier,
            visual_dna, prestige_level, last_evolution
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (player_id) DO UPDATE SET
            base_avatar = EXCLUDED.base_avatar,
            active_layers = EXCLUDED.active_layers,
            current_tier = EXCLUDED.current_tier,
            visual_dna = EXCLUDED.visual_dna,
            prestige_level = EXCLUDED.prestige_level,
            last_evolution = EXCLUDED.last_evolution`,
        [
          profile.playerId,
          profile.baseAvatar,
          JSON.stringify(profile.activeLayers),
          profile.currentTier,
          JSON.stringify(profile.visualDNA),
          profile.prestigeLevel,
          profile.lastEvolution
        ]
      );
    } catch (error) {
      console.error('Error saving player visual profile:', error);
    }
  }

  private async getEvolutionHistory(playerId: string): Promise<EvolutionRecord[]> {
    try {
      const result = await this.pool.query(
        `SELECT * FROM visual_evolution_records 
          WHERE player_id = $1 
          ORDER BY timestamp DESC 
          LIMIT 50`,
        [playerId]
      );

      return result.rows.map(row => ({
        id: row.id,
        triggerType: row.trigger_type,
        visualChange: row.visual_change,
        timestamp: row.timestamp,
        rarity: row.rarity,
        socialVisibility: row.social_visibility,
        communityReaction: JSON.parse(row.community_reaction || '{}')
      }));
    } catch (error) {
      console.error('Error getting evolution history:', error);
      return [];
    }
  }

  // ========================================
  // ASSET LIBRARY MANAGEMENT
  // ========================================

  private async loadEvolutionTriggers(): Promise<void> {
    try {
      const result = await this.pool.query('SELECT * FROM visual_evolution_triggers');
      
      for (const row of result.rows) {
        const triggerType = row.trigger_type as EvolutionTriggerType;
        const trigger: VisualEvolutionTrigger = {
          type: triggerType,
          condition: row.condition,
          visualEffect: JSON.parse(row.visual_effect),
          rarity: row.rarity,
          permanence: row.permanence
        };

        if (!this.evolutionTriggers.has(triggerType)) {
          this.evolutionTriggers.set(triggerType, []);
        }
        this.evolutionTriggers.get(triggerType)!.push(trigger);
      }
    } catch (error) {
      console.error('Error loading evolution triggers:', error);
    }
  }

  private async loadVisualLayers(): Promise<void> {
    try {
      const result = await this.pool.query('SELECT * FROM visual_layer_templates');
      
      for (const row of result.rows) {
        const layerType = row.layer_type as LayerType;
        const layer: VisualLayer = {
          id: row.id,
          name: row.name,
          type: layerType,
          baseAsset: row.base_asset,
          effects: JSON.parse(row.effects || '[]'),
          conditions: JSON.parse(row.conditions || '[]'),
          stackOrder: row.stack_order,
          blendMode: row.blend_mode
        };

        if (!this.visualLayers.has(layerType)) {
          this.visualLayers.set(layerType, []);
        }
        this.visualLayers.get(layerType)!.push(layer);
      }
    } catch (error) {
      console.error('Error loading visual layers:', error);
    }
  }

  private async initializeAssetLibrary(): Promise<void> {
    await this.assetLibrary.initialize();
  }

  // ========================================
  // TIER ADVANCEMENT AND SPECIAL REWARDS
  // ========================================

  private async grantTierAdvancementRewards(playerId: string, newTier: number): Promise<void> {
    try {
      // Grant tier-specific visual rewards
      const tierRewards = await this.getTierRewards(newTier);
      
      for (const reward of tierRewards) {
        await this.grantSpecialVisualReward(playerId, reward);
      }

      // Create celebration broadcast
      await this.pool.query(
        `INSERT INTO social_broadcasts (
            player_id, event_type, event_data, visibility_level, 
            inspiration_score, broadcast_at
          ) VALUES ($1, $2, $3, $4, $5, NOW())`,
        [
          playerId,
          'tier_advancement',
          JSON.stringify({ newTier, rewards: tierRewards }),
          'celebrated',
          newTier * 10
        ]
      );
    } catch (error) {
      console.error('Error granting tier advancement rewards:', error);
    }
  }

  private async getTierRewards(tier: number): Promise<VisualEffect[]> {
    const tierRewardMap: { [key: number]: VisualEffect[] } = {
      1: [
        {
          type: EffectType.GLOW,
          intensity: 0.2,
          color: { primary: '#4CAF50', secondary: '#81C784', opacity: 0.6 }
        }
      ],
      2: [
        {
          type: EffectType.PARTICLE_SYSTEM,
          intensity: 0.3,
          particle: { count: 20, size: 2, speed: 1, lifetime: 3, emissionRate: 5, patterns: ['spiral'] }
        }
      ],
      3: [
        {
          type: EffectType.COLOR_SHIFT,
          intensity: 0.4,
          color: { primary: '#2196F3', secondary: '#64B5F6', opacity: 0.7 }
        }
      ],
      4: [
        {
          type: EffectType.ANIMATION_OVERRIDE,
          intensity: 0.5,
          animation: { type: 'float', speed: 0.5, easing: 'ease-in-out', loop: true, intensity: 0.5 }
        }
      ],
      5: [
        {
          type: EffectType.ENERGY_FIELD,
          intensity: 0.6,
          particle: { count: 50, size: 3, speed: 2, lifetime: 5, emissionRate: 10, patterns: ['orbit', 'pulse'] }
        }
      ],
      6: [
        {
          type: EffectType.MYSTICAL_AURA,
          intensity: 0.7,
          color: { primary: '#9C27B0', secondary: '#BA68C8', opacity: 0.8 }
        }
      ],
      7: [
        {
          type: EffectType.LUMINOSITY,
          intensity: 0.8,
          color: { primary: '#FFD700', secondary: '#FFEB3B', opacity: 0.9 }
        }
      ],
      8: [
        {
          type: EffectType.RIPPLE_EFFECT,
          intensity: 0.9,
          animation: { type: 'ripple', speed: 1, easing: 'ease-out', loop: true, intensity: 0.9 }
        }
      ],
      9: [
        {
          type: EffectType.GEOMETRIC_TRANSFORMATION,
          intensity: 1.0,
          animation: { type: 'morph', speed: 0.3, easing: 'ease-in-out', loop: true, intensity: 1.0 }
        }
      ],
      10: [
        {
          type: EffectType.PARTICLE_SYSTEM,
          intensity: 1.0,
          particle: { count: 100, size: 5, speed: 3, lifetime: 10, emissionRate: 20, patterns: ['galaxy', 'constellation'] },
          color: { primary: '#FF1744', secondary: '#F50057', opacity: 1.0 }
        }
      ]
    };

    return tierRewardMap[tier] || [];
  }

  private async grantSpecialVisualReward(playerId: string, effect: VisualEffect): Promise<void> {
    try {
      await this.pool.query(
        `INSERT INTO special_visual_rewards (
            player_id, visual_effect, granted_at, is_active
          ) VALUES ($1, $2, NOW(), $3)`,
        [playerId, JSON.stringify(effect), true]
      );
    } catch (error) {
      console.error('Error granting special visual reward:', error);
    }
  }

  // ========================================
  // UTILITY AND ANALYTICS METHODS
  // ========================================

  async getVisualEvolutionAnalytics(period: string = '7d'): Promise<{
    totalEvolutions: number;
    rarityDistribution: { [key: string]: number };
    mostActiveEvolutions: { trigger: string; count: number }[];
    socialImpactMetrics: any;
    tierProgression: { tier: number; playerCount: number }[];
  }> {
    try {
      // Get total evolutions
      const totalResult = await this.pool.query(
        `SELECT COUNT(*) as total FROM visual_evolution_records 
          WHERE timestamp > NOW() - INTERVAL $1`,
        [period]
      );

      // Get rarity distribution
      const rarityResult = await this.pool.query(
        `SELECT rarity, COUNT(*) as count FROM visual_evolution_records 
          WHERE timestamp > NOW() - INTERVAL $1
          GROUP BY rarity`,
        [period]
      );

      // Get most active evolution triggers
      const triggerResult = await this.pool.query(
        `SELECT trigger_type, COUNT(*) as count FROM visual_evolution_records 
          WHERE timestamp > NOW() - INTERVAL $1
          GROUP BY trigger_type 
          ORDER BY count DESC 
          LIMIT 10`,
        [period]
      );

      // Get social impact metrics
      const socialResult = await this.pool.query(
        `SELECT 
            AVG(inspiration_score) as avg_inspiration,
            COUNT(*) as total_broadcasts,
            SUM(CASE WHEN visibility_level = 'legendary' THEN 1 ELSE 0 END) as legendary_count
          FROM social_broadcasts 
          WHERE broadcast_at > NOW() - INTERVAL $1 AND event_type = 'visual_evolution'`,
        [period]
      );

      // Get tier progression
      const tierResult = await this.pool.query(
        `SELECT current_tier, COUNT(*) as player_count 
          FROM player_visual_profiles 
          GROUP BY current_tier 
          ORDER BY current_tier`
      );

      return {
        totalEvolutions: parseInt(totalResult.rows[0].total),
        rarityDistribution: rarityResult.rows.reduce((acc, row) => {
          acc[row.rarity] = parseInt(row.count);
          return acc;
        }, {}),
        mostActiveEvolutions: triggerResult.rows.map(row => ({
          trigger: row.trigger_type,
          count: parseInt(row.count)
        })),
        socialImpactMetrics: socialResult.rows[0],
        tierProgression: tierResult.rows.map(row => ({
          tier: row.current_tier,
          playerCount: parseInt(row.player_count)
        }))
      };
    } catch (error) {
      console.error('Error getting visual evolution analytics:', error);
      return {
        totalEvolutions: 0,
        rarityDistribution: {},
        mostActiveEvolutions: [],
        socialImpactMetrics: {},
        tierProgression: []
      };
    }
  }
}

// ========================================
// ASSET LIBRARY
// ========================================

class AssetLibrary {
  private assets: Map<string, any> = new Map();

  async initialize(): Promise<void> {
    // Load visual assets from database or file system
    await this.loadAssets();
  }

  private async loadAssets(): Promise<void> {
    // Implementation for loading visual assets
    // This would include avatars, effects, particles, etc.
  }

  getAsset(assetId: string): any {
    return this.assets.get(assetId);
  }

  addAsset(assetId: string, assetData: any): void {
    this.assets.set(assetId, assetData);
  }
}

interface SocialImpact {
  visibility: number;
  inspiration: number;
  status: 'unchanged' | 'noticed' | 'admired' | 'celebrated' | 'legendary';
}

export default VisualEvolutionEngine;
