import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { 
  CivilizationComparison,
  ComparedCivilization,
  ComparisonMetrics,
  CivilizationInsight,
  ComparativeRecommendation,
  SuccessfulCivilization,
  SuccessFactor,
  GovernanceModel,
  SocialStructure,
  InnovationEcosystem,
  CivilizationFailure,
  FailureCause,
  FailureLesson,
  EmergingPattern,
  TrendAnalysis,
  ComparativeFramework,
  SuccessFactorAnalysis,
  CivilizationHealth,
  PredictiveAnalytics
} from '../../../shared/types/civilization-comparative';

export function createCivilizationComparativeRoutes(pool: Pool): Router {
  const router = Router();

  // ==================== COMPARATIVE ANALYSIS ====================
  
  // Get civilization comparison overview
  router.get('/comparison', async (req: Request, res: Response) => {
    try {
      const { frameworkId = 'main-framework' } = req.query;
      
      // Get comparison framework
      const frameworkResult = await pool.query(
        'SELECT * FROM comparative_framework WHERE id = $1',
        [frameworkId]
      );

      // Get compared civilizations
      const civilizationsResult = await pool.query(
        `SELECT 
          cc.*,
          cf.name as framework_name
        FROM compared_civilizations cc
        JOIN comparative_framework cf ON cc.framework_id = cf.id
        WHERE cc.framework_id = $1
        ORDER BY cc.maturity_level DESC`,
        [frameworkId]
      );

      // Get comparison metrics
      const metricsResult = await pool.query(
        'SELECT * FROM comparison_metrics WHERE framework_id = $1 ORDER BY calculated_at DESC LIMIT 10',
        [frameworkId]
      );

      res.json({ 
        success: true, 
        data: {
          framework: frameworkResult.rows[0],
          civilizations: civilizationsResult.rows,
          metrics: metricsResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Compare specific civilizations
  router.post('/compare', async (req: Request, res: Response) => {
    try {
      const { civilizationIds, comparisonFramework } = req.body;

      // Get civilization data for comparison
      const placeholders = civilizationIds.map((_, index) => `$${index + 1}`).join(',');
      const civilizationsResult = await pool.query(
        `SELECT 
          cc.*,
          cf.name as framework_name
        FROM compared_civilizations cc
        JOIN comparative_framework cf ON cc.framework_id = cf.id
        WHERE cc.id IN (${placeholders})
        ORDER BY cc.maturity_level DESC`,
        civilizationIds
      );

      // Calculate comparative metrics
      const comparisonMetrics = await calculateComparativeMetrics(civilizationsResult.rows, pool);

      // Generate insights
      const insights = await generateComparativeInsights(civilizationsResult.rows, comparisonMetrics, pool);

      res.json({ 
        success: true, 
        data: {
          civilizations: civilizationsResult.rows,
          metrics: comparisonMetrics,
          insights,
          framework: comparisonFramework
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== SUCCESSFUL CIVILIZATIONS ANALYSIS ====================
  
  // Get successful civilizations analysis
  router.get('/successful-civilizations', async (req: Request, res: Response) => {
    try {
      const { category, minMaturity = 5 } = req.query;
      
      let query = 'SELECT * FROM successful_civilizations WHERE maturity_level >= $1';
      const params: any[] = [minMaturity];

      if (category) {
        query += ' AND category = $' + (params.length + 1);
        params.push(category);
      }

      query += ' ORDER BY maturity_level DESC, total_users DESC';

      const result = await pool.query(query, params);

      // Get success factors analysis
      const successFactorsResult = await pool.query(
        'SELECT * FROM success_factor_analysis WHERE analysis_date > NOW() - INTERVAL \'30 days\' ORDER BY impact DESC',
        []
      );

      res.json({ 
        success: true, 
        data: {
          civilizations: result.rows,
          successFactors: successFactorsResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get detailed success factors
  router.get('/success-factors', async (req: Request, res: Response) => {
    try {
      const { civilizationId } = req.query;
      
      const result = await pool.query(
        `SELECT 
          sf.*,
          sfc.category,
          sfc.impact,
          sfc.implementation
        FROM success_factors sf
        JOIN success_factor_categories sfc ON sf.category_id = sfc.id
        WHERE sf.civilization_id = $1
        ORDER BY sfc.impact DESC`,
        [civilizationId]
      );

      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== FAILURE ANALYSIS ====================
  
  // Get civilization failures analysis
  router.get('/failures', async (req: Request, res: Response) => {
    try {
      const { failureType, severity } = req.query;
      
      let query = 'SELECT * FROM civilization_failures WHERE 1=1';
      const params: any[] = [];

      if (failureType) {
        query += ' AND failure_type = $' + (params.length + 1);
        params.push(failureType);
      }

      if (severity) {
        query += ' AND severity = $' + (params.length + 1);
        params.push(severity);
      }

      query += ' ORDER BY collapse_year DESC';

      const result = await pool.query(query, params);

      // Get failure patterns
      const patternsResult = await pool.query(
        'SELECT * FROM failure_patterns WHERE pattern_date > NOW() - INTERVAL \'90 days\' ORDER BY frequency DESC',
        []
      );

      res.json({ 
        success: true, 
        data: {
          failures: result.rows,
          patterns: patternsResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get failure lessons
  router.get('/failure-lessons', async (req: Request, res: Response) => {
    try {
      const { failureId } = req.query;
      
      const result = await pool.query(
        `SELECT 
          fl.*,
          flc.category,
          flc.preventable,
          flc.cost
        FROM failure_lessons fl
        JOIN failure_lesson_categories flc ON fl.category_id = flc.id
        WHERE fl.failure_id = $1
        ORDER BY flc.cost DESC`,
        [failureId]
      );

      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== EMERGING PATTERNS & TRENDS ====================
  
  // Get emerging patterns
  router.get('/emerging-patterns', async (req: Request, res: Response) => {
    try {
      const { category, status } = req.query;
      
      let query = 'SELECT * FROM emerging_patterns WHERE 1=1';
      const params: any[] = [];

      if (category) {
        query += ' AND category = $' + (params.length + 1);
        params.push(category);
      }

      if (status) {
        query += ' AND current_status = $' + (params.length + 1);
        params.push(status);
      }

      query += ' ORDER BY adoption_rate DESC, first_observed DESC';

      const result = await pool.query(query, params);

      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get trend analysis
  router.get('/trend-analysis', async (req: Request, res: Response) => {
    try {
      const { period = '90d', category } = req.query;
      
      // Get current patterns
      const patternsResult = await pool.query(
        `SELECT * FROM emerging_patterns 
         WHERE first_observed > NOW() - INTERVAL $1
         ORDER BY adoption_rate DESC`,
        [period]
      );

      // Get emerging trends
      const trendsResult = await pool.query(
        `SELECT * FROM emerging_trends 
         WHERE identified_date > NOW() - INTERVAL $1
         ORDER BY impact DESC`,
        [period]
      );

      // Get technological advances
      const techResult = await pool.query(
        `SELECT * FROM technological_advances 
         WHERE announced_date > NOW() - INTERVAL $1
         ORDER BY impact DESC`,
        [period]
      );

      res.json({ 
        success: true, 
        data: {
          patterns: patternsResult.rows,
          trends: trendsResult.rows,
          technologicalAdvances: techResult.rows,
          period
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== BENCHMARK DATA ====================
  
  // Get benchmark data
  router.get('/benchmarks', async (req: Request, res: Response) => {
    try {
      const { category, source } = req.query;
      
      let query = 'SELECT * FROM benchmark_data WHERE 1=1';
      const params: any[] = [];

      if (category) {
        query += ' AND category = $' + (params.length + 1);
        params.push(category);
      }

      if (source) {
        query += ' AND source = $' + (params.length + 1);
        params.push(source);
      }

      query += ' ORDER BY collection_date DESC';

      const result = await pool.query(query, params);

      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Create new benchmark
  router.post('/benchmarks', async (req: Request, res: Response) => {
    try {
      const { name, category, source, metrics, methodology } = req.body;

      const result = await pool.query(
        `INSERT INTO benchmark_data (
          name, category, source, metrics, methodology, collection_date
        ) VALUES ($1, $2, $3, $4, $5, NOW()) 
        RETURNING *`,
        [name, category, source, JSON.stringify(metrics), methodology]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== CIVILIZATION HEALTH MONITORING ====================
  
  // Get civilization health assessment
  router.get('/health-assessment', async (req: Request, res: Response) => {
    try {
      const { civilizationId } = req.query;
      
      // Get overall health
      const healthResult = await pool.query(
        'SELECT * FROM civilization_health WHERE civilization_id = $1 ORDER BY assessed_at DESC LIMIT 1',
        [civilizationId]
      );

      // Get vital metrics
      const vitalsResult = await pool.query(
        'SELECT * FROM vital_metrics WHERE civilization_id = $1 ORDER BY last_updated DESC LIMIT 20',
        [civilizationId]
      );

      // Get risk assessment
      const risksResult = await pool.query(
        'SELECT * FROM risk_assessments WHERE civilization_id = $1 ORDER BY assessed_at DESC LIMIT 10',
        [civilizationId]
      );

      // Get opportunities
      const opportunitiesResult = await pool.query(
        'SELECT * FROM opportunities WHERE civilization_id = $1 ORDER BY identified_at DESC LIMIT 10',
        [civilizationId]
      );

      res.json({ 
        success: true, 
        data: {
          health: healthResult.rows[0],
          vitalMetrics: vitalsResult.rows,
          risks: risksResult.rows,
          opportunities: opportunitiesResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Get health recommendations
  router.get('/health-recommendations', async (req: Request, res: Response) => {
    try {
      const { civilizationId, category } = req.query;
      
      let query = 'SELECT * FROM health_recommendations WHERE civilization_id = $1';
      const params: any[] = [civilizationId];

      if (category) {
        query += ' AND category = $' + (params.length + 1);
        params.push(category);
      }

      query += ' ORDER BY priority DESC, generated_at DESC';

      const result = await pool.query(query, params);

      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== PREDICTIVE ANALYTICS ====================
  
  // Get predictive analytics
  router.get('/predictive-analytics', async (req: Request, res: Response) => {
    try {
      const { civilizationId, modelType } = req.query;
      
      // Get available models
      const modelsResult = await pool.query(
        'SELECT * FROM predictive_models WHERE civilization_id = $1 ORDER BY accuracy DESC',
        [civilizationId]
      );

      // Get scenarios
      const scenariosResult = await pool.query(
        'SELECT * FROM scenarios WHERE civilization_id = $1 ORDER BY probability DESC',
        [civilizationId]
      );

      // Get forecasts
      const forecastsResult = await pool.query(
        'SELECT * FROM forecasts WHERE civilization_id = $1 ORDER BY generated_at DESC LIMIT 10',
        [civilizationId]
      );

      res.json({ 
        success: true, 
        data: {
          models: modelsResult.rows,
          scenarios: scenariosResult.rows,
          forecasts: forecastsResult.rows
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // Generate new prediction
  router.post('/predictions', async (req: Request, res: Response) => {
    try {
      const { civilizationId, modelId, parameters, timeframe } = req.body;

      // Get model details
      const modelResult = await pool.query(
        'SELECT * FROM predictive_models WHERE id = $1 AND civilization_id = $2',
        [modelId, civilizationId]
      );

      if (modelResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Model not found' });
      }

      // Generate prediction (simplified - in real implementation would use ML model)
      const prediction = await generatePrediction(modelResult.rows[0], parameters, timeframe);

      // Store forecast
      const forecastResult = await pool.query(
        `INSERT INTO forecasts (
          civilization_id, model_id, type, timeframe, predictions, confidence, generated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
        RETURNING *`,
        [civilizationId, modelId, prediction.type, timeframe, JSON.stringify(prediction.predictions), prediction.confidence]
      );

      res.json({ success: true, data: forecastResult.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  // ==================== COMPREHENSIVE ANALYTICS ====================
  
  // Get comprehensive civilization analytics
  router.get('/analytics', async (req: Request, res: Response) => {
    try {
      const { period = '30d', civilizationId } = req.query;
      
      // Get overall metrics
      const overallMetrics = await pool.query(
        `SELECT 
          COUNT(DISTINCT id) as total_civilizations,
          AVG(maturity_level) as avg_maturity,
          AVG(total_users) as avg_users,
          AVG(active_users) as avg_active_users,
          AVG(economic_metrics->>'gdp') as avg_gdp
        FROM compared_civilizations 
        WHERE assessed_at > NOW() - INTERVAL $1`,
        [period]
      );

      // Get category breakdown
      const categoryBreakdown = await pool.query(
        `SELECT 
          category,
          COUNT(*) as count,
          AVG(maturity_level) as avg_maturity,
          AVG(total_users) as avg_users
        FROM compared_civilizations 
        WHERE assessed_at > NOW() - INTERVAL $1
        GROUP BY category`,
        [period]
      );

      // Get trend analysis
      const trendAnalysis = await pool.query(
        `SELECT 
          DATE_TRUNC('day', assessed_at) as date,
          AVG(maturity_level) as avg_maturity,
          AVG(total_users) as avg_users,
          AVG(active_users) as avg_active_users
        FROM compared_civilizations 
        WHERE assessed_at > NOW() - INTERVAL $1
        GROUP BY DATE_TRUNC('day', assessed_at)
        ORDER BY date DESC`,
        [period]
      );

      res.json({ 
        success: true, 
        data: {
          overallMetrics: overallMetrics.rows[0],
          categoryBreakdown: categoryBreakdown.rows,
          trendAnalysis: trendAnalysis.rows,
          period
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: (error as Error).message });
    }
  });

  return router;
}

// Helper functions
async function calculateComparativeMetrics(civilizations: any[], pool: Pool): Promise<any> {
  try {
    const metrics = {
      economicComplexity: 0,
      economicStability: 0,
      governanceEffectiveness: 0,
      socialEngagement: 0,
      securityRobustness: 0,
      innovationCapacity: 0,
      culturalRichness: 0,
      sustainabilityIndex: 0,
      adaptabilityScore: 0,
      scalability: 0
    };

    // Calculate averages across civilizations
    for (const civ of civilizations) {
      metrics.economicComplexity += civ.economic_metrics?.complexity || 0;
      metrics.governanceEffectiveness += civ.governance_structure?.effectiveness || 0;
      metrics.socialEngagement += civ.social_cohesion?.engagement || 0;
      metrics.securityLevel += civ.security_level || 0;
      metrics.innovationIndex += civ.innovation_index || 0;
      metrics.sustainabilityScore += civ.sustainability_score || 0;
    }

    const count = civilizations.length || 1;
    for (const key in metrics) {
      metrics[key] = Math.round((metrics[key] / count) * 100) / 100;
    }

    return metrics;
  } catch (error) {
    console.error('Error calculating comparative metrics:', error);
    return {};
  }
}

async function generateComparativeInsights(civilizations: any[], metrics: any, pool: Pool): Promise<any[]> {
  try {
    const insights = [];

    // Analyze economic patterns
    if (metrics.economicComplexity < 50) {
      insights.push({
        category: 'ECONOMIC',
        title: 'Low Economic Complexity',
        description: 'Most civilizations show limited economic diversity',
        severity: 'MEDIUM',
        recommendations: ['Develop multiple revenue streams', 'Encourage service economies']
      });
    }

    // Analyze governance patterns
    if (metrics.governanceEffectiveness < 60) {
      insights.push({
        category: 'GOVERNANCE',
        title: 'Governance Effectiveness Concerns',
        description: 'Governance systems show limited effectiveness',
        severity: 'HIGH',
        recommendations: ['Improve participation rates', 'Enhance transparency']
      });
    }

    // Analyze security patterns
    if (metrics.securityRobustness < 70) {
      insights.push({
        category: 'SECURITY',
        title: 'Security Gaps Identified',
        description: 'Security measures need improvement',
        severity: 'HIGH',
        recommendations: ['Implement advanced monitoring', 'Enhance threat detection']
      });
    }

    return insights;
  } catch (error) {
    console.error('Error generating comparative insights:', error);
    return [];
  }
}

async function generatePrediction(model: any, parameters: any, timeframe: string): Promise<any> {
  try {
    // Simplified prediction logic - in real implementation would use actual ML model
    const basePrediction = {
      type: 'growth',
      timeframe,
      predictions: {
        userGrowth: Math.random() * 100,
        economicGrowth: Math.random() * 50,
        governanceImprovement: Math.random() * 30,
        securityImprovement: Math.random() * 20
      },
      confidence: model.accuracy || 0.75
    };

    return basePrediction;
  } catch (error) {
    console.error('Error generating prediction:', error);
    return {
      type: 'unknown',
      timeframe,
      predictions: {},
      confidence: 0
    };
  }
}
