import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { 
  GlobalCivilizationFramework,
  CivilizationLayer,
  PropertyOwnershipSystem,
  AdvancedEconomicSystem,
  GovernanceSystem,
  KnowledgeSystem,
  SocialIdentitySystem,
  TrustSecuritySystem,
  InteroperableNetwork,
  TelegramIntegration,
  CivilizationMaturity,
  EvolutionPhase,
  RequirementType,
  AssetCategory,
  OwnershipType,
  ActivityType,
  GovernanceType,
  VotingType,
  InstitutionType,
  StructureType,
  IdentityType,
  NetworkType,
  ProcessType,
  TransparencyLevel,
  PublicAccess,
  VerificationMethod,
  SecurityType,
  JusticeType,
  FeatureType,
  EvolutionMetrics
} from '../../../shared/types/civilization-advanced';

export function createCivilizationAdvancedRoutes(pool: Pool): Router {
  const router = Router();

  // ==================== GLOBAL FRAMEWORK OVERVIEW ====================
  
  // Get civilization framework overview
  router.get('/framework', async (req: Request, res: Response) => {
    try {
      const result = await pool.query(
        'SELECT * FROM global_civilization_framework WHERE id = $1',
        ['main-framework']
      );

      // Get current layer metrics
      const layerMetrics = await pool.query(
        'SELECT * FROM civilization_layer_metrics WHERE framework_id = $1 ORDER BY calculated_at DESC LIMIT 10',
        ['main-framework']
      );

      // Get maturity assessment
      const maturityResult = await pool.query(
        'SELECT * FROM civilization_maturity_assessment WHERE framework_id = $1 ORDER BY assessed_at DESC LIMIT 1',
        ['main-framework']
      );

      res.json({ 
        success: true, 
        data: {
          framework: result.rows[0],
          layerMetrics: layerMetrics.rows,
          maturityAssessment: maturityResult.rows[0]
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== LAYER 1: PROPERTY OWNERSHIP ====================
  
  // Get property ownership system
  router.get('/property-ownership', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.query;
      
      // Get player's assets
      const assetsResult = await pool.query(
        `SELECT 
          pa.*,
          a.name as asset_name,
          a.category,
          a.is_transferable,
          a.is_stakeable
        FROM player_assets pa
        JOIN assets a ON pa.asset_id = a.id
        WHERE pa.player_id = $1
        ORDER BY a.acquired_at DESC`,
        [playerId]
      );

      // Get land ownership
      const landResult = await pool.query(
        `SELECT 
          lo.*,
          l.name as land_name,
          l.total_parcels,
          l.owned_parcels
        FROM land_ownership lo
        JOIN lands l ON lo.land_id = l.id
        WHERE lo.player_id = $1`,
        [playerId]
      );

      // Get marketplace activities
      const marketplaceResult = await pool.query(
        `SELECT 
          ma.*,
          m.type as market_type
        FROM marketplace_activities ma
        JOIN marketplaces m ON ma.marketplace_id = m.id
        WHERE ma.player_id = $1
        ORDER BY ma.created_at DESC LIMIT 20`,
        [playerId]
      );

      res.json({ 
        success: true, 
        data: {
          assets: assetsResult.rows,
          landOwnership: landResult.rows,
          marketplaceActivities: marketplaceResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Create new asset
  router.post('/assets/create', async (req: Request, res: Response) => {
    try {
      const { playerId, name, category, description, metadata } = req.body;

      // Verify creation permissions
      const hasPermission = await checkAssetCreationPermission(playerId, category, pool);
      
      if (!hasPermission) {
        return res.status(403).json({ 
          success: false, 
          error: 'Insufficient permissions for asset creation' 
        });
      }

      const result = await pool.query(
        `INSERT INTO assets (
          name, category, description, metadata, created_by, created_at
        ) VALUES ($1, $2, $3, $4, $5, NOW()) 
        RETURNING *`,
        [name, category, description, JSON.stringify(metadata), playerId]
      );

      // Grant ownership to creator
      await pool.query(
        `INSERT INTO player_assets (
          player_id, asset_id, ownership_type, acquired_at, metadata
        ) VALUES ($1, $2, $3, NOW(), $4)`,
        [playerId, result.rows[0].id, 'full_ownership', JSON.stringify({acquired_at: new Date()})]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== LAYER 2: ADVANCED ECONOMIC SYSTEM ====================
  
  // Get economic system overview
  router.get('/economic-system', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.query;
      
      // Get player's economic activities
      const activitiesResult = await pool.query(
        `SELECT 
          ea.*,
          a.name as activity_name
        FROM economic_activities ea
        JOIN activities a ON ea.activity_id = a.id
        WHERE ea.player_id = $1
        ORDER BY ea.created_at DESC`,
        [playerId]
      );

      // Get production chain participation
      const productionResult = await pool.query(
        `SELECT 
          pc.*,
          p.name as chain_name
        FROM production_chain_participation pc
        JOIN production_chains p ON pc.chain_id = p.id
        WHERE pc.player_id = $1`,
        [playerId]
      );

      // Get service economy participation
      const serviceResult = await pool.query(
        `SELECT 
          se.*,
          s.name as service_name
        FROM service_economy_participation se
        JOIN services s ON se.service_id = s.id
        WHERE se.player_id = $1`,
        [playerId]
      );

      res.json({ 
        success: true, 
        data: {
          economicActivities: activitiesResult.rows,
          productionChains: productionResult.rows,
          serviceEconomy: serviceResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Create production chain
  router.post('/production-chains', async (req: Request, res: Response) => {
    try {
      const { playerId, name, description, stages } = req.body;

      const result = await pool.query(
        `INSERT INTO production_chains (
          name, description, stages, created_by, created_at
        ) VALUES ($1, $2, $3, $4, NOW()) 
        RETURNING *`,
        [name, description, JSON.stringify(stages), playerId]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== LAYER 3: GOVERNANCE & LAW ====================
  
  // Get governance system
  router.get('/governance', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.query;
      
      // Get voting systems
      const votingResult = await pool.query(
        'SELECT * FROM voting_systems WHERE is_active = true ORDER BY created_at',
        []
      );

      // Get active proposals
      const proposalsResult = await pool.query(
        `SELECT 
          gp.*,
          v.name as voting_system_name
        FROM governance_proposals gp
        JOIN voting_systems v ON gp.voting_system_id = v.id
        WHERE gp.status = 'active'
        ORDER BY gp.created_at DESC LIMIT 20`,
        []
      );

      // Get judicial cases
      const judicialResult = await pool.query(
        `SELECT 
          jc.*,
          ct.name as court_type
        FROM judicial_cases jc
        JOIN court_types ct ON jc.court_type_id = ct.id
        WHERE jc.status = 'active'
        ORDER BY jc.filed_at DESC LIMIT 10`,
        []
      );

      res.json({ 
        success: true, 
        data: {
          votingSystems: votingResult.rows,
          activeProposals: proposalsResult.rows,
          judicialCases: judicialResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Submit governance proposal
  router.post('/governance/proposals', async (req: Request, res: Response) => {
    try {
      const { playerId, title, description, type, votingSystemId } = req.body;

      // Verify voting system exists
      const votingSystemResult = await pool.query(
        'SELECT * FROM voting_systems WHERE id = $1 AND is_active = true',
        [votingSystemId]
      );

      if (votingSystemResult.rows.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: 'Voting system not found or inactive' 
        });
      }

      const result = await pool.query(
        `INSERT INTO governance_proposals (
          title, description, type, voting_system_id, proposer_id, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, 'pending', NOW()) 
        RETURNING *`,
        [title, description, type, votingSystemId, playerId]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== LAYER 4: KNOWLEDGE & EDUCATION ====================
  
  // Get knowledge system
  router.get('/knowledge-system', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.query;
      
      // Get educational institutions
      const institutionsResult = await pool.query(
        `SELECT 
          ei.*,
          i.name as institution_name
        FROM educational_institutions ei
        JOIN institutions i ON ei.institution_id = i.id
        WHERE ei.player_id = $1
        ORDER BY ei.enrolled_at DESC`,
        [playerId]
      );

      // Get research participation
      const researchResult = await pool.query(
        `SELECT 
          rp.*,
          r.name as research_name
        FROM research_participation rp
        JOIN research r ON rp.research_id = r.id
        WHERE rp.player_id = $1
        ORDER BY rp.joined_at DESC`,
        [playerId]
      );

      // Get knowledge creation
      const creationResult = await pool.query(
        `SELECT 
          kc.*,
          k.name as knowledge_name
        FROM knowledge_creation kc
        JOIN knowledge k ON kc.knowledge_id = k.id
        WHERE kc.creator_id = $1
        ORDER BY kc.created_at DESC`,
        [playerId]
      );

      res.json({ 
        success: true, 
        data: {
          educationalInstitutions: institutionsResult.rows,
          researchParticipation: researchResult.rows,
          knowledgeCreation: creationResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== LAYER 5: SOCIAL IDENTITY & CULTURE ====================
  
  // Get social identity system
  router.get('/social-identity', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.query;
      
      // Get identity components
      const identityResult = await pool.query(
        `SELECT 
          ic.*,
          i.name as identity_name
        FROM identity_components ic
        JOIN identities i ON ic.identity_id = i.id
        WHERE ic.player_id = $1
        ORDER BY ic.created_at DESC`,
        [playerId]
      );

      // Get social structures
      const socialResult = await pool.query(
        `SELECT 
          ss.*,
          s.name as structure_name
        FROM social_structures ss
        JOIN structures s ON ss.structure_id = s.id
        WHERE ss.player_id = $1
        ORDER BY ss.joined_at DESC`,
        [playerId]
      );

      // Get cultural participation
      const culturalResult = await pool.query(
        `SELECT 
          cc.*,
          c.name as cultural_name
        FROM cultural_participation cc
        JOIN cultures c ON cc.culture_id = c.id
        WHERE cc.player_id = $1
        ORDER BY cc.participated_at DESC`,
        [playerId]
      );

      res.json({ 
        success: true, 
        data: {
          identityComponents: identityResult.rows,
          socialStructures: socialResult.rows,
          culturalParticipation: culturalResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== LAYER 6: TRUST, SECURITY & JUSTICE ====================
  
  // Get trust and security system
  router.get('/trust-security', async (req: Request, res: Response) => {
    try {
      const { playerId } = req.query;
      
      // Get trust metrics
      const trustResult = await pool.query(
        `SELECT 
          tm.*,
          t.name as mechanism_name
        FROM trust_mechanisms tm
        JOIN trust t ON tm.trust_id = t.id
        WHERE tm.player_id = $1
        ORDER BY tm.assessed_at DESC`,
        [playerId]
      );

      // Get security incidents
      const securityResult = await pool.query(
        `SELECT 
          si.*,
          s.name as security_name
        FROM security_incidents si
        JOIN security s ON si.security_id = s.id
        WHERE si.player_id = $1
        ORDER BY si.occurred_at DESC LIMIT 20`,
        [playerId]
      );

      // Get justice cases
      const justiceResult = await pool.query(
        `SELECT 
          jc.*,
          jt.name as justice_type
        FROM justice_cases jc
        JOIN justice_types jt ON jc.justice_type_id = jt.id
        WHERE jc.player_id = $1
        ORDER BY jc.filed_at DESC LIMIT 10`,
        [playerId]
      );

      res.json({ 
        success: true, 
        data: {
          trustMechanisms: trustResult.rows,
          securityIncidents: securityResult.rows,
          justiceCases: justiceResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== LAYER 7: INTEROPERABLE NETWORK ====================
  
  // Get network overview
  router.get('/interoperable-network', async (req: Request, res: Response) => {
    try {
      const result = await pool.query(
        'SELECT * FROM interoperable_network WHERE id = $1',
        ['main-network']
      );

      // Get connected civilizations
      const connectionsResult = await pool.query(
        `SELECT 
          cn.*,
          c.name as civilization_name
        FROM network_connections cn
        JOIN civilizations c ON cn.civilization_id = c.id
        WHERE cn.network_id = $1
        ORDER BY cn.established_at DESC`,
        ['main-network']
      );

      // Get asset transfers
      const transfersResult = await pool.query(
        `SELECT 
          at.*,
          a.name as asset_name
        FROM asset_transfers at
        JOIN assets a ON at.asset_id = a.id
        WHERE at.network_id = $1
        ORDER BY at.transferred_at DESC LIMIT 50`,
        ['main-network']
      );

      res.json({ 
        success: true, 
        data: {
          network: result.rows[0],
          connections: connectionsResult.rows,
          assetTransfers: transfersResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== TELEGRAM INTEGRATION ====================
  
  // Get Telegram integration status
  router.get('/telegram-integration', async (req: Request, res: Response) => {
    try {
      const result = await pool.query(
        'SELECT * FROM telegram_integration WHERE id = $1',
        ['main-integration']
      );

      // Get social graph metrics
      const socialGraphResult = await pool.query(
        'SELECT * FROM telegram_social_graph WHERE integration_id = $1 ORDER BY analyzed_at DESC LIMIT 10',
        ['main-integration']
      );

      // Get mini-app usage
      const miniAppsResult = await pool.query(
        `SELECT 
          tm.*,
          ma.name as app_name
        FROM telegram_mini_apps tm
        JOIN mini_apps ma ON tm.app_id = ma.id
        WHERE tm.integration_id = $1
        ORDER BY tm.last_used_at DESC`,
        ['main-integration']
      );

      res.json({ 
        success: true, 
        data: {
          integration: result.rows[0],
          socialGraph: socialGraphResult.rows,
          miniApps: miniAppsResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== CIVILIZATION MATURITY ASSESSMENT ====================
  
  // Get maturity assessment
  router.get('/maturity-assessment', async (req: Request, res: Response) => {
    try {
      const result = await pool.query(
        'SELECT * FROM civilization_maturity_assessment WHERE framework_id = $1 ORDER BY assessed_at DESC LIMIT 5',
        ['main-framework']
      );

      // Calculate overall maturity score
      const latestAssessment = result.rows[0];
      const maturityScore = calculateMaturityScore(latestAssessment);

      res.json({ 
        success: true, 
        data: {
          assessments: result.rows,
          currentMaturity: latestAssessment,
          maturityScore,
          recommendations: generateMaturityRecommendations(latestAssessment)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== EVOLUTION ROADMAP ====================
  
  // Get evolution roadmap
  router.get('/evolution-roadmap', async (req: Request, res: Response) => {
    try {
      const result = await pool.query(
        'SELECT * FROM evolution_roadmap WHERE framework_id = $1 ORDER BY phase_order',
        ['main-framework']
      );

      // Get current phase progress
      const progressResult = await pool.query(
        'SELECT * FROM evolution_phase_progress WHERE framework_id = $1 AND phase_id = $1',
        ['main-framework', result.rows[0]?.current_phase]
      );

      res.json({ 
        success: true, 
        data: {
          roadmap: result.rows,
          currentProgress: progressResult.rows[0]
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== ANALYTICS & INSIGHTS ====================
  
  // Get comprehensive civilization analytics
  router.get('/analytics', async (req: Request, res: Response) => {
    try {
      const { period = '30d', layer } = req.query;
      
      // Get global metrics
      const globalMetrics = await pool.query(
        'SELECT * FROM global_civilization_metrics WHERE calculated_at > NOW() - INTERVAL $1',
        [period]
      );

      // Get layer-specific metrics
      let layerTable = '';
      switch (layer) {
        case 'property_ownership':
          layerTable = 'property_ownership_metrics';
          break;
        case 'economic_system':
          layerTable = 'economic_system_metrics';
          break;
        case 'governance_law':
          layerTable = 'governance_metrics';
          break;
        case 'knowledge_education':
          layerTable = 'knowledge_system_metrics';
          break;
        case 'social_identity_culture':
          layerTable = 'social_identity_metrics';
          break;
        case 'trust_security_justice':
          layerTable = 'trust_security_metrics';
          break;
        case 'interoperable_network':
          layerTable = 'network_metrics';
          break;
      }

      const layerMetrics = layerTable ? await pool.query(
        `SELECT * FROM ${layerTable} WHERE calculated_at > NOW() - INTERVAL $1`,
        [period]
      ) : [];

      res.json({ 
        success: true, 
        data: {
          globalMetrics: globalMetrics.rows,
          layerMetrics: layerMetrics.rows,
          period,
          layer
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  return router;
}

// Helper functions
async function checkAssetCreationPermission(playerId: string, category: AssetCategory, pool: Pool): Promise<boolean> {
  try {
    // Check player's reputation and skill level
    const result = await pool.query(
      `SELECT 
        reputation_score,
        skill_level
      FROM player_reputation pr
      WHERE pr.player_id = $1`,
      [playerId]
    );

    if (result.rows.length === 0) return false;

    const reputation = result.rows[0].reputation_score;
    const skillLevel = result.rows[0].skill_level;

    // Define permission requirements based on asset category
    const requirements = {
      [AssetCategory.REAL_ESTATE]: { reputation: 1000, skillLevel: 5 },
      [AssetCategory.VIRTUAL_LAND]: { reputation: 500, skillLevel: 3 },
      [AssetCategory.DIGITAL_ASSETS]: { reputation: 100, skillLevel: 2 },
      [AssetCategory.INTELLECTUAL_PROPERTY]: { reputation: 2000, skillLevel: 8 },
      [AssetCategory.CREATIONS]: { reputation: 50, skillLevel: 2 }
    };

    const requirement = requirements[category] || { reputation: 0, skillLevel: 0 };
    
    return reputation >= requirement.reputation && skillLevel >= requirement.skillLevel;
  } catch (error) {
    console.error('Error checking asset creation permission:', error);
    return false;
  }
}

function calculateMaturityScore(assessment: any): number {
  const weights = {
    economicComplexity: 0.2,
    governanceEffectiveness: 0.25,
    socialCohesion: 0.2,
    securityLevel: 0.15,
    interoperability: 0.1,
    sustainability: 0.1
  };

  let score = 0;
  for (const [metric, weight] of Object.entries(weights)) {
    if (assessment[metric] !== undefined) {
      score += assessment[metric] * weight;
    }
  }

  return Math.round(score * 100);
}

function generateMaturityRecommendations(assessment: any): string[] {
  const recommendations = [];

  if (assessment.economicComplexity < 70) {
    recommendations.push('Develop more diverse economic activities beyond simple token transfers');
  }

  if (assessment.governanceEffectiveness < 60) {
    recommendations.push('Implement more transparent and participatory governance mechanisms');
  }

  if (assessment.securityLevel < 80) {
    recommendations.push('Strengthen security protocols and monitoring systems');
  }

  if (assessment.interoperability < 50) {
    recommendations.push('Adopt standardized protocols for cross-civilization compatibility');
  }

  return recommendations;
}
