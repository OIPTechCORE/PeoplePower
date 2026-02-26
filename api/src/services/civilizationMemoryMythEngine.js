import { v4 as uuidv4 } from 'uuid';

// ===================================
// CIVILIZATION MEMORY & MYTH ENGINE
// THE CULTURAL SOUL OF DIGITAL CIVILIZATION
// ===================================

export class CivilizationMemoryMythEngine {
  constructor(db, aiService, notificationService, worldMapService) {
    this.db = db;
    this.aiService = aiService;
    this.notificationService = notificationService;
    this.worldMapService = worldMapService;
    
    // Myth creation thresholds
    this.legendaryThresholds = {
      impact: 0.8,
      cooperation: 0.7,
      emotionalResponse: 0.6,
      longevity: 0.5,
      uniqueness: 0.4
    };
    
    // Cultural evolution weights
    this.culturalWeights = {
      cooperation: 0.3,
      education: 0.25,
      recruitment: 0.2,
      creativity: 0.15,
      defense: 0.1
    };
  }

  // ===================================
  // 1. LIVING HISTORY LAYER
  // ===================================

  async recordHistoricalEvent(eventData) {
    try {
      // Calculate significance
      const significance = await this.calculateEventSignificance(eventData);
      
      // Create historical entry
      const historicalEntry = {
        id: uuidv4(),
        timestamp: eventData.timestamp || new Date(),
        eventType: eventData.type,
        eventCategory: eventData.category || 'community',
        title: eventData.title,
        description: eventData.description,
        
        // Significance metrics
        significance: significance.score,
        impactLevel: significance.impact,
        emotionalWeight: significance.emotionalWeight,
        culturalImportance: significance.culturalImportance,
        
        // Participants and context
        participants: eventData.participants || [],
        countries: eventData.countries || [],
        communities: eventData.communities || [],
        location: eventData.location || {},
        
        // Narrative elements
        narrative: await this.generateEventNarrative(eventData),
        visualAssets: await this.generateEventVisuals(eventData),
        symbolicElements: await this.extractSymbolicElements(eventData),
        
        // Timeline placement
        timelinePosition: await this.calculateTimelinePosition(eventData),
        relatedEvents: await this.findRelatedEvents(eventData),
        
        // Memory status
        isMythic: false,
        isLegendary: false,
        memoryStrength: 1.0,
        lastRemembered: new Date(),
        
        created_at: new Date()
      };
      
      // Store in civilization timeline
      await this.saveToCivilizationTimeline(historicalEntry);
      
      // Update world map markers
      await this.updateWorldMapMarkers(historicalEntry);
      
      // Notify historical societies
      await this.notifyHistoricalSocieties(historicalEntry);
      
      // Trigger memory effects
      await this.triggerMemoryEffects(historicalEntry);
      
      return historicalEntry;
    } catch (error) {
      console.error('Error recording historical event:', error);
      throw error;
    }
  }

  async calculateEventSignificance(eventData) {
    try {
      const significanceFactors = {
        // Impact factors
        participantCount: eventData.participants?.length || 0,
        countryCount: eventData.countries?.length || 0,
        communityCount: eventData.communities?.length || 0,
        
        // Cooperation factors
        crossCommunityParticipation: this.calculateCrossCommunityParticipation(eventData),
        unityLevel: eventData.unityLevel || 0,
        
        // Innovation factors
        isFirstOccurrence: await this.checkIfFirstOccurrence(eventData),
        innovationLevel: eventData.innovationLevel || 0,
        
        // Emotional factors
        emotionalIntensity: eventData.emotionalIntensity || 0,
        celebrationLevel: eventData.celebrationLevel || 0,
        
        // Duration factors
        eventDuration: eventData.duration || 0,
        preparationTime: eventData.preparationTime || 0
      };
      
      // Calculate weighted significance score
      const significance = {
        score: this.calculateSignificanceScore(significanceFactors),
        impact: this.calculateImpactLevel(significanceFactors),
        emotionalWeight: this.calculateEmotionalWeight(significanceFactors),
        culturalImportance: this.calculateCulturalImportance(significanceFactors)
      };
      
      return significance;
    } catch (error) {
      console.error('Error calculating event significance:', error);
      return { score: 0.5, impact: 'moderate', emotionalWeight: 0.5, culturalImportance: 0.5 };
    }
  }

  async generateEventNarrative(eventData) {
    try {
      const narrativeContext = {
        eventType: eventData.type,
        participants: eventData.participants || [],
        location: eventData.location || {},
        outcome: eventData.outcome || {},
        emotionalTone: eventData.emotionalTone || 'neutral',
        culturalContext: await this.getCulturalContext(eventData)
      };
      
      const narrative = await this.aiService.generateNarrative(narrativeContext);
      
      return {
        title: narrative.title,
        summary: narrative.summary,
        fullStory: narrative.fullStory,
        keyMoments: narrative.keyMoments,
        quotes: narrative.quotes,
        symbolism: narrative.symbolism
      };
    } catch (error) {
      console.error('Error generating event narrative:', error);
      return {
        title: eventData.title || 'Historical Event',
        summary: eventData.description || 'A significant event occurred.',
        fullStory: eventData.description || 'Details of this event are being recorded.',
        keyMoments: [],
        quotes: [],
        symbolism: {}
      };
    }
  }

  // ===================================
  // 2. MYTH CREATION SYSTEM
  // ===================================

  async transformToMyth(historicalEventId) {
    try {
      const historicalEvent = await this.getHistoricalEvent(historicalEventId);
      
      if (!historicalEvent) {
        throw new Error('Historical event not found');
      }
      
      // Check if event qualifies for myth transformation
      const mythPotential = await this.calculateMythPotential(historicalEvent);
      
      if (mythPotential.score < this.legendaryThresholds.impact) {
        return { success: false, reason: 'Event does not meet myth threshold' };
      }
      
      // Create myth from historical event
      const myth = await this.createMythFromEvent(historicalEvent, mythPotential);
      
      // Save myth to cultural canon
      await this.saveToCulturalCanon(myth);
      
      // Update historical event status
      await this.markEventAsMythic(historicalEventId);
      
      // Enable storytelling features
      await this.enableStorytelling(myth);
      
      // Create cultural artifacts
      await this.createMythArtifacts(myth);
      
      return { success: true, myth };
    } catch (error) {
      console.error('Error transforming to myth:', error);
      throw error;
    }
  }

  async createMythFromEvent(historicalEvent, mythPotential) {
    try {
      const myth = {
        id: uuidv4(),
        sourceEventId: historicalEvent.id,
        
        // Myth identification
        mythTitle: await this.generateMythTitle(historicalEvent),
        mythCategory: this.determineMythCategory(historicalEvent),
        mythType: this.determineMythType(historicalEvent),
        
        // Story elements
        storyChapters: await this.createStoryChapters(historicalEvent),
        illustratedSummary: await this.generateIllustratedSummary(historicalEvent),
        narrativeRecap: await this.createNarrativeRecap(historicalEvent),
        legendaryTitles: await this.generateLegendaryTitles(historicalEvent),
        
        // Cultural elements
        culturalSymbols: await this.extractCulturalSymbols(historicalEvent),
        moralLessons: await this.extractMoralLessons(historicalEvent),
        ritualElements: await this.createRitualElements(historicalEvent),
        
        // Myth properties
        mythPotential: mythPotential.score,
        emotionalResonance: mythPotential.emotionalResonance,
        culturalWeight: mythPotential.culturalWeight,
        longevityPrediction: mythPotential.longevity,
        
        // Distribution
        isPublic: true,
        teachingLevel: this.determineTeachingLevel(historicalEvent),
        adaptationCount: 0,
        lastAdapted: new Date(),
        
        created_at: new Date()
      };
      
      return myth;
    } catch (error) {
      console.error('Error creating myth from event:', error);
      throw error;
    }
  }

  async generateMythTitle(historicalEvent) {
    try {
      const titleContext = {
        eventType: historicalEvent.eventType,
        significance: historicalEvent.significance,
        participants: historicalEvent.participants,
        location: historicalEvent.location,
        emotionalTone: historicalEvent.emotionalWeight,
        culturalContext: historicalEvent.culturalImportance
      };
      
      const titleSuggestions = await this.aiService.generateMythTitles(titleContext);
      
      // Select most impactful title
      return titleSuggestions[0] || `The ${historicalEvent.eventType} of ${historicalEvent.location?.name || 'Legend'}`;
    } catch (error) {
      console.error('Error generating myth title:', error);
      return `The Great ${historicalEvent.eventType}`;
    }
  }

  async createStoryChapters(historicalEvent) {
    try {
      const chapterContext = {
        eventNarrative: historicalEvent.narrative,
        keyMoments: historicalEvent.keyMoments || [],
        participants: historicalEvent.participants,
        timeline: historicalEvent.timelinePosition,
        emotionalArc: historicalEvent.emotionalWeight
      };
      
      const chapters = await this.aiService.createStoryChapters(chapterContext);
      
      return chapters.map((chapter, index) => ({
        chapterNumber: index + 1,
        title: chapter.title,
        content: chapter.content,
        moral: chapter.moral,
        symbolism: chapter.symbolism,
        visualElements: chapter.visualElements
      }));
    } catch (error) {
      console.error('Error creating story chapters:', error);
      return [{
        chapterNumber: 1,
        title: 'The Beginning',
        content: historicalEvent.description,
        moral: 'Unity creates strength',
        symbolism: {},
        visualElements: []
      }];
    }
  }

  // ===================================
  // 3. LEGENDARY PLAYER ASCENSION
  // ===================================

  async evaluateLegendaryStatus(playerId) {
    try {
      const playerData = await this.getPlayerContributions(playerId);
      
      const legendaryMetrics = {
        totalImpact: playerData.totalImpact || 0,
        historicalSignificance: playerData.historicalEvents?.length || 0,
        culturalInfluence: playerData.culturalContributions || 0,
        mentorshipLegacy: playerData.mentorshipImpact || 0,
        communityBuilding: playerData.communityContributions || 0,
        innovationScore: playerData.innovations?.length || 0,
        leadershipScore: playerData.leadershipEvents?.length || 0,
        cooperationScore: playerData.cooperationEvents?.length || 0
      };
      
      const legendaryScore = this.calculateLegendaryScore(legendaryMetrics);
      
      if (legendaryScore >= 0.8) {
        await this.ascendToLegend(playerId, legendaryMetrics, legendaryScore);
        return { legendary: true, score: legendaryScore };
      }
      
      return { legendary: false, score: legendaryScore, nextMilestone: this.getNextLegendaryMilestone(legendaryScore) };
    } catch (error) {
      console.error('Error evaluating legendary status:', error);
      return { legendary: false, score: 0, error: error.message };
    }
  }

  async ascendToLegend(playerId, metrics, score) {
    try {
      const legend = {
        id: uuidv4(),
        playerId,
        
        // Legendary identity
        legendaryTitle: await this.generateLegendaryTitle(playerId, metrics),
        legendaryTier: this.determineLegendaryTier(score),
        legendaryDomain: this.determineLegendaryDomain(metrics),
        
        // Physical monuments
        engravings: await this.createPermanentEngravings(playerId),
        worldMapMarker: await this.createWorldMapMarker(playerId),
        statueDesign: await this.createStatueDesign(playerId),
        
        // Story integration
        storyArcs: await this.createStoryArcs(playerId),
        teachingMaterial: await this.createTeachingMaterial(playerId),
        culturalReferences: await this.createCulturalReferences(playerId),
        
        // Legacy properties
        legendaryScore: score,
        ascensionDate: new Date(),
        contributionSummary: metrics,
        legendaryPowers: await this.grantLegendaryPowers(playerId),
        
        // Recognition
        ceremonyPlanned: true,
        ceremonyDate: await this.scheduleAscensionCeremony(playerId),
        invitedParticipants: await this.getCeremonyParticipants(playerId),
        
        created_at: new Date()
      };
      
      // Add to Hall of Legends
      await this.addToHallOfLegends(legend);
      
      // Notify civilization
      await this.notifyCivilizationOfAscension(legend);
      
      // Update player status
      await this.updatePlayerLegendaryStatus(playerId, legend);
      
      return legend;
    } catch (error) {
      console.error('Error ascending to legend:', error);
      throw error;
    }
  }

  async generateLegendaryTitle(playerId, metrics) {
    try {
      const titleContext = {
        playerId,
        metrics,
        dominantContributions: this.getDominantContributions(metrics),
        culturalImpact: metrics.culturalInfluence,
        leadershipStyle: this.determineLeadershipStyle(metrics)
      };
      
      const titleSuggestions = await this.aiService.generateLegendaryTitles(titleContext);
      
      return titleSuggestions[0] || 'Legendary Citizen';
    } catch (error) {
      console.error('Error generating legendary title:', error);
      return 'Legendary Hero';
    }
  }

  // ===================================
  // 4. CULTURAL EVOLUTION SYSTEM
  // ===================================

  async observeAndEvolve(countryId) {
    try {
      const behaviorPatterns = await this.analyzeBehaviorPatterns(countryId);
      const culturalOutcome = await this.predictCulturalOutcome(behaviorPatterns);
      
      const evolution = {
        countryId,
        currentTraditions: await this.getCurrentTraditions(countryId),
        observedPatterns: behaviorPatterns,
        predictedEvolution: culturalOutcome,
        newTraditions: await this.generateNewTraditions(culturalOutcome),
        culturalIdentity: await this.updateCulturalIdentity(countryId, culturalOutcome),
        evolutionScore: this.calculateEvolutionScore(behaviorPatterns, culturalOutcome)
      };
      
      // Implement cultural evolution
      await this.implementCulturalEvolution(evolution);
      
      // Notify citizens of cultural changes
      await this.notifyCulturalEvolution(evolution);
      
      return evolution;
    } catch (error) {
      console.error('Error in cultural evolution:', error);
      throw error;
    }
  }

  async analyzeBehaviorPatterns(countryId) {
    try {
      const patternsQuery = `
        SELECT 
          action_type,
          COUNT(*) as frequency,
          AVG(impact_score) as avg_impact,
          COUNT(DISTINCT participant_count) as participant_diversity,
          MAX(created_at) as last_occurrence
        FROM historical_events 
        WHERE countries @> ARRAY[$1]::VARCHAR[]
        AND created_at > NOW() - INTERVAL '90 days'
        GROUP BY action_type
        ORDER BY frequency DESC
      `;
      
      const result = await this.db.query(patternsQuery, [countryId]);
      
      return {
        patterns: result.rows,
        dominantPattern: result.rows[0]?.action_type || 'unknown',
        cooperationFrequency: this.calculateCooperationFrequency(result.rows),
        educationFrequency: this.calculateEducationFrequency(result.rows),
        recruitmentFrequency: this.calculateRecruitmentFrequency(result.rows),
        creativityFrequency: this.calculateCreativityFrequency(result.rows),
        defenseFrequency: this.calculateDefenseFrequency(result.rows)
      };
    } catch (error) {
      console.error('Error analyzing behavior patterns:', error);
      return { patterns: [], dominantPattern: 'unknown' };
    }
  }

  async predictCulturalOutcome(behaviorPatterns) {
    try {
      const outcomeFactors = {
        cooperation: behaviorPatterns.cooperationFrequency * this.culturalWeights.cooperation,
        education: behaviorPatterns.educationFrequency * this.culturalWeights.education,
        recruitment: behaviorPatterns.recruitmentFrequency * this.culturalWeights.recruitment,
        creativity: behaviorPatterns.creativityFrequency * this.culturalWeights.creativity,
        defense: behaviorPatterns.defenseFrequency * this.culturalWeights.defense
      };
      
      const culturalOutcome = {
        primaryTradition: this.getHighestFactor(outcomeFactors),
        culturalValues: await this.generateCulturalValues(outcomeFactors),
        ritualTypes: await this.predictRitualTypes(outcomeFactors),
        artisticStyle: await this.predictArtisticStyle(outcomeFactors),
        communicationStyle: await this.predictCommunicationStyle(outcomeFactors),
        identityMarkers: await this.generateIdentityMarkers(outcomeFactors)
      };
      
      return culturalOutcome;
    } catch (error) {
      console.error('Error predicting cultural outcome:', error);
      return {
        primaryTradition: 'unity',
        culturalValues: ['cooperation', 'growth'],
        ritualTypes: ['celebration'],
        artisticStyle: 'minimalist',
        communicationStyle: 'direct',
        identityMarkers: ['unity', 'strength']
      };
    }
  }

  // ===================================
  // 5. MEMORY REACTIVATION EVENTS
  // ===================================

  async scheduleMemoryReactivations() {
    try {
      const historicalEvents = await this.getSignificantEvents();
      
      const reactivationSchedule = [];
      
      historicalEvents.forEach(event => {
        const anniversaryDate = this.calculateAnniversaryDate(event.timestamp);
        const celebrationType = this.determineCelebrationType(event);
        
        const reactivation = {
          eventId: event.id,
          anniversaryDate,
          celebrationType,
          invitedParticipants: event.participants,
          newPlayerActivities: this.createHistoricalActivities(event),
          rewards: this.createAnniversaryRewards(event),
          ceremonyDetails: this.planAnniversaryCeremony(event)
        };
        
        reactivationSchedule.push(reactivation);
      });
      
      // Schedule all reactivations
      await this.scheduleAllReactivations(reactivationSchedule);
      
      return reactivationSchedule;
    } catch (error) {
      console.error('Error scheduling memory reactivations:', error);
      throw error;
    }
  }

  async triggerMemoryReactivation(eventId) {
    try {
      const event = await this.getHistoricalEvent(eventId);
      
      if (!event) {
        throw new Error('Historical event not found');
      }
      
      // Reactivate memory in present
      const reactivation = {
        eventId,
        event,
        celebration: await this.createAnniversaryCelebration(event),
        oldPlayerInvitations: await this.inviteOldPlayers(event),
        historicalMissions: await this.enableHistoricalMissions(event),
        memorySharing: await this.createMemorySharing(event),
        culturalImpact: await this.measureCulturalImpact(event)
      };
      
      // Announce anniversary
      await this.announceAnniversary(reactivation);
      
      // Enable historical activities
      await this.enableHistoricalActivities(reactivation);
      
      // Track participation
      await this.trackReactivationParticipation(reactivation);
      
      return reactivation;
    } catch (error) {
      console.error('Error triggering memory reactivation:', error);
      throw error;
    }
  }

  // ===================================
  // 6. GENERATIONAL HANDOFF SYSTEM
  // ===================================

  async manageStoryInheritance() {
    try {
      const ongoingStories = await this.getOngoingStories();
      const newPlayers = await this.getNewPlayers();
      
      const inheritanceAssignments = [];
      
      ongoingStories.forEach(story => {
        if (story.needsContinuation) {
          const suitablePlayers = this.matchPlayersToStory(newPlayers, story);
          
          suitablePlayers.forEach(player => {
            const inheritance = {
              playerId: player.id,
              storyId: story.id,
              inheritedRole: this.determineInheritedRole(player, story),
              storyContext: this.createStoryContext(story),
              continuationTasks: this.createContinuationTasks(story),
              mentorConnection: this.connectToStoryMentor(player, story)
            };
            
            inheritanceAssignments.push(inheritance);
          });
        }
      });
      
      // Assign all inherited stories
      await this.assignInheritedStories(inheritanceAssignments);
      
      return inheritanceAssignments;
    } catch (error) {
      console.error('Error managing story inheritance:', error);
      throw error;
    }
  }

  matchPlayersToStory(newPlayers, story) {
    return newPlayers.filter(player => {
      const playerProfile = player.profile || {};
      const storyRequirements = story.requirements || {};
      
      return this.matchesRequirements(playerProfile, storyRequirements);
    });
  }

  // ===================================
  // 7. SYMBOLIC ARTIFACTS
  // ===================================

  async createArtifact(event, significance) {
    try {
      const artifact = {
        id: uuidv4(),
        name: await this.generateArtifactName(event),
        type: this.determineArtifactType(event),
        description: await this.createArtifactDescription(event),
        
        // Visual design
        visualDesign: await this.createVisualDesign(event),
        culturalSymbols: await this.extractCulturalSymbols(event),
        artisticStyle: await this.determineArtisticStyle(event),
        
        // Placement and access
        location: await this.determineArtifactLocation(event),
        unlockRequirements: await this.createUnlockRequirements(event),
        accessLevel: this.determineAccessLevel(event, significance),
        
        // Cultural significance
        culturalSignificance: significance,
        emotionalWeight: await this.calculateEmotionalWeight(event),
        historicalContext: await this.createHistoricalContext(event),
        
        // Interaction
        interactionType: this.determineInteractionType(event),
        artifactPowers: await this.grantArtifactPowers(event),
        memoryConnection: event.id,
        
        created_at: new Date()
      };
      
      // Place artifact on world map
      await this.placeArtifactOnMap(artifact);
      
      // Add to artifact collection
      await this.addToArtifactCollection(artifact);
      
      // Enable artifact interaction
      await this.enableArtifactInteraction(artifact);
      
      return artifact;
    } catch (error) {
      console.error('Error creating artifact:', error);
      throw error;
    }
  }

  // ===================================
  // 8. MEMORY AI CURATOR
  // ===================================

  async curateHistoricalEvents() {
    try {
      const allEvents = await this.getAllHistoricalEvents();
      
      const curatedEvents = allEvents
        .map(event => ({
          ...event,
          legendScore: this.calculateLegendScore(event)
        }))
        .filter(event => event.legendScore >= 0.7)
        .sort((a, b) => b.legendScore - a.legendScore);
      
      // Update cultural canon
      await this.updateCulturalCanon(curatedEvents);
      
      // Archive less significant events
      await this.archiveLessSignificantEvents(allEvents, curatedEvents);
      
      return curatedEvents;
    } catch (error) {
      console.error('Error curating historical events:', error);
      throw error;
    }
  }

  calculateLegendScore(event) {
    const factors = {
      impact: event.significance || 0.5,
      cooperation: this.calculateCooperationLevel(event),
      emotionalResponse: event.emotionalWeight || 0.5,
      longevity: this.predictLongevity(event),
      uniqueness: this.calculateUniqueness(event),
      culturalSignificance: event.culturalImportance || 0.5
    };
    
    // Legend Score = Impact × Cooperation × Emotional Response × Longevity
    const legendScore = (
      factors.impact * 
      factors.cooperation * 
      factors.emotionalResponse * 
      factors.longevity
    ) + (factors.uniqueness + factors.culturalSignificance);
    
    return Math.min(1.0, legendScore);
  }

  // ===================================
  // 9. SHARED STORY PARTICIPATION
  // ===================================

  async enableStoryParticipation(eventId) {
    try {
      const event = await this.getHistoricalEvent(eventId);
      
      const participation = {
        eventId,
        votingSessions: await this.createVotingSessions(event),
        messagePreservation: await this.enableMessageArchiving(event),
        symbolicChoices: await this.createSymbolicChoices(event),
        coAuthorship: await this.enableCoAuthorship(event),
        culturalContribution: await this.enableCulturalContribution(event)
      };
      
      // Open participation
      await this.openParticipation(participation);
      
      // Notify community
      await this.notifyParticipationOpportunity(participation);
      
      return participation;
    } catch (error) {
      console.error('Error enabling story participation:', error);
      throw error;
    }
  }

  // ===================================
  // 10. ANTI-COPY DEFENSE
  // ===================================

  async calculateCompetitiveAdvantage() {
    try {
      const advantage = {
        historicalDepth: await this.calculateHistoricalDepth(),
        culturalComplexity: await this.calculateCulturalComplexity(),
        legendaryFigures: await this.countLegendaryFigures(),
        uniqueTraditions: await this.countUniqueTraditions(),
        emotionalAttachments: await this.calculateEmotionalAttachments(),
        imitationDifficulty: await this.calculateImitationDifficulty()
      };
      
      const totalAdvantage = this.calculateTotalAdvantage(advantage);
      
      return {
        ...advantage,
        totalAdvantage,
        monthlyGrowth: await this.calculateMonthlyGrowth(),
        competitiveMoat: this.assessCompetitiveMoat(totalAdvantage)
      };
    } catch (error) {
      console.error('Error calculating competitive advantage:', error);
      throw error;
    }
  }

  // ===================================
  // HELPER METHODS
  // ===================================

  async saveToCivilizationTimeline(historicalEntry) {
    const query = `
      INSERT INTO civilization_timeline (
        id, timestamp, event_type, event_category, title, description,
        significance, impact_level, emotional_weight, cultural_importance,
        participants, countries, communities, location, narrative,
        visual_assets, symbolic_elements, timeline_position, related_events,
        is_mythic, is_legendary, memory_strength, last_remembered, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
    `;
    
    await this.db.query(query, [
      historicalEntry.id,
      historicalEntry.timestamp,
      historicalEntry.eventType,
      historicalEntry.eventCategory,
      historicalEntry.title,
      historicalEntry.description,
      historicalEntry.significance,
      historicalEntry.impactLevel,
      historicalEntry.emotionalWeight,
      historicalEntry.culturalImportance,
      JSON.stringify(historicalEntry.participants),
      historicalEntry.countries,
      historicalEntry.communities,
      JSON.stringify(historicalEntry.location),
      JSON.stringify(historicalEntry.narrative),
      JSON.stringify(historicalEntry.visualAssets),
      JSON.stringify(historicalEntry.symbolicElements),
      historicalEntry.timelinePosition,
      JSON.stringify(historicalEntry.relatedEvents),
      historicalEntry.isMythic,
      historicalEntry.isLegendary,
      historicalEntry.memoryStrength,
      historicalEntry.lastRemembered,
      historicalEntry.created_at
    ]);
  }

  calculateSignificanceScore(factors) {
    const weights = {
      participantCount: 0.2,
      countryCount: 0.15,
      communityCount: 0.15,
      crossCommunityParticipation: 0.2,
      unityLevel: 0.1,
      isFirstOccurrence: 0.1,
      innovationLevel: 0.05,
      emotionalIntensity: 0.05
    };
    
    let score = 0;
    Object.keys(weights).forEach(factor => {
      score += (factors[factor] || 0) * weights[factor];
    });
    
    return Math.min(1.0, score);
  }

  calculateLegendaryScore(metrics) {
    const weights = {
      totalImpact: 0.2,
      historicalSignificance: 0.15,
      culturalInfluence: 0.15,
      mentorshipLegacy: 0.15,
      communityBuilding: 0.1,
      innovationScore: 0.1,
      leadershipScore: 0.1,
      cooperationScore: 0.05
    };
    
    let score = 0;
    Object.keys(weights).forEach(metric => {
      const normalizedValue = Math.min(1.0, metrics[metric] / 100); // Normalize to 0-1
      score += normalizedValue * weights[metric];
    });
    
    return score;
  }

  determineLegendaryTier(score) {
    if (score >= 0.95) return 'mythic';
    if (score >= 0.9) return 'legendary';
    if (score >= 0.85) return 'epic';
    if (score >= 0.8) return 'rare';
    return 'common';
  }

  async getHistoricalEvent(eventId) {
    const query = `
      SELECT * FROM civilization_timeline WHERE id = $1
    `;
    const result = await this.db.query(query, [eventId]);
    return result.rows[0] || null;
  }

  async getAllHistoricalEvents() {
    const query = `
      SELECT * FROM civilization_timeline 
      ORDER BY timestamp DESC
    `;
    const result = await this.db.query(query);
    return result.rows;
  }
}

export default CivilizationMemoryMythEngine;
