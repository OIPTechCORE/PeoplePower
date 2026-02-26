// ========================================
// GAME-SPECIFIC INFRASTRUCTURE
// Game State Management for 900M Users
// ========================================

import { MatchmakingServer, GameStateServer, AssetDeliveryServer } from './game-servers';
import { ABTestingPlatform, FeatureFlagSystem } from './game-experimentation';
import { UnityMirror, Photon } from './game-engines';

export interface GameInfrastructure {
  matchmaking: {
    concurrent_matches: 10000000;
    match_creation_time: '<2s';
    player_latency: '<100ms';
  };
  asset_delivery: {
    cdn_bandwidth: '100Tbps';
    asset_optimization: true;
    progressive_loading: true;
  };
}

export class GameInfrastructureManager {
  private matchmakingServers: MatchmakingServer[];
  private gameStateServers: GameStateServer[];
  private assetDeliveryServers: AssetDeliveryServer[];
  private unityMirror: UnityMirror;
  private photon: Photon;
  private abTesting: ABTestingPlatform;
  private featureFlags: FeatureFlagSystem;
  private gameMetrics: GameMetricsCollector;

  constructor() {
    this.initializeGameInfrastructure();
  }

  private async initializeGameInfrastructure(): Promise<void> {
    console.log('Initializing game infrastructure for 900M users...');
    
    // Initialize matchmaking servers
    await this.initializeMatchmakingServers();
    
    // Initialize game state servers
    await this.initializeGameStateServers();
    
    // Initialize asset delivery servers
    await this.initializeAssetDeliveryServers();
    
    // Initialize game engines
    await this.initializeGameEngines();
    
    // Initialize experimentation platform
    await this.initializeExperimentationPlatform();
    
    // Initialize metrics collection
    await this.initializeMetricsCollection();
    
    // Start monitoring
    this.startMonitoring();
    
    console.log('Game infrastructure initialized successfully');
  }

  private async initializeMatchmakingServers(): Promise<void> {
    this.matchmakingServers = [];
    
    // Create matchmaking servers for each region
    const regions = ['north_america', 'europe', 'asia_pacific', 'latin_america', 'africa', 'middle_east'];
    
    for (const region of regions) {
      const serverCount = this.calculateMatchmakingServerCount(region);
      
      for (let i = 0; i < serverCount; i++) {
        const server = new MatchmakingServer({
          id: `matchmaking-${region}-${i}`,
          region,
          capacity: 100000, // 100K concurrent matches per server
          algorithms: ['skill_based', 'latency_based', 'region_based', 'social_based'],
          max_wait_time: 30000, // 30 seconds max wait time
          priority_levels: 5
        });
        
        await server.initialize();
        this.matchmakingServers.push(server);
      }
    }
    
    console.log(`Created ${this.matchmakingServers.length} matchmaking servers`);
  }

  private calculateMatchmakingServerCount(region: string): number {
    const regionMultipliers = {
      'north_america': 0.3,
      'europe': 0.25,
      'asia_pacific': 0.35,
      'latin_america': 0.05,
      'africa': 0.03,
      'middle_east': 0.02
    };
    
    const totalMatches = 10000000; // 10M concurrent matches
    const regionMatches = totalMatches * regionMultipliers[region];
    const matchesPerServer = 100000;
    
    return Math.ceil(regionMatches / matchesPerServer);
  }

  private async initializeGameStateServers(): Promise<void> {
    this.gameStateServers = [];
    
    // Create game state servers for each region
    const regions = ['north_america', 'europe', 'asia_pacific', 'latin_america', 'africa', 'middle_east'];
    
    for (const region of regions) {
      const serverCount = this.calculateGameStateServerCount(region);
      
      for (let i = 0; i < serverCount; i++) {
        const server = new GameStateServer({
          id: `gamestate-${region}-${i}`,
          region,
          capacity: 50000, // 50K concurrent games per server
          sync_frequency: 60, // 60Hz sync
          state_size_limit: 1024, // 1KB max state size
          conflict_resolution: 'last_writer_wins',
          persistence: 'redis_cluster',
          backup_frequency: 5000 // 5 seconds backup
        });
        
        await server.initialize();
        this.gameStateServers.push(server);
      }
    }
    
    console.log(`Created ${this.gameStateServers.length} game state servers`);
  }

  private calculateGameStateServerCount(region: string): number {
    const regionMultipliers = {
      'north_america': 0.3,
      'europe': 0.25,
      'asia_pacific': 0.35,
      'latin_america': 0.05,
      'africa': 0.03,
      'middle_east': 0.02
    };
    
    const totalGames = 20000000; // 20M concurrent games (2 per match)
    const regionGames = totalGames * regionMultipliers[region];
    const gamesPerServer = 50000;
    
    return Math.ceil(regionGames / gamesPerServer);
  }

  private async initializeAssetDeliveryServers(): Promise<void> {
    this.assetDeliveryServers = [];
    
    // Create asset delivery servers for each region
    const regions = ['north_america', 'europe', 'asia_pacific', 'latin_america', 'africa', 'middle_east'];
    
    for (const region of regions) {
      const serverCount = this.calculateAssetDeliveryServerCount(region);
      
      for (let i = 0; i < serverCount; i++) {
        const server = new AssetDeliveryServer({
          id: `asset-delivery-${region}-${i}`,
          region,
          cdn_bandwidth: '100Tbps',
          compression: true,
          optimization: true,
          progressive_loading: true,
          cache_ttl: {
            images: 86400, // 1 day
            audio: 604800, // 1 week
            video: 3600, // 1 hour
            models: 604800 // 1 week
          },
          formats: ['webp', 'avif', 'mp3', 'opus', 'mp4', 'hls', 'glb', 'fbx']
        });
        
        await server.initialize();
        this.assetDeliveryServers.push(server);
      }
    }
    
    console.log(`Created ${this.assetDeliveryServers.length} asset delivery servers`);
  }

  private calculateAssetDeliveryServerCount(region: string): number {
    const regionMultipliers = {
      'north_america': 0.3,
      'europe': 0.25,
      'asia_pacific': 0.35,
      'latin_america': 0.05,
      'africa': 0.03,
      'middle_east': 0.02
    };
    
    const totalUsers = 900000000;
    const regionUsers = totalUsers * regionMultipliers[region];
    const usersPerServer = 1000000; // 1M users per server
    
    return Math.ceil(regionUsers / usersPerServer);
  }

  private async initializeGameEngines(): Promise<void> {
    // Initialize Unity Mirror for real-time networking
    this.unityMirror = new UnityMirror({
      max_connections: 900000000,
      message_size_limit: 1024,
      send_rate: 60, // 60Hz
      reliability: 'unreliable',
      channel_count: 4
    });
    
    await this.unityMirror.initialize();
    
    // Initialize Photon for authoritative server networking
    this.photon = new Photon({
      max_rooms: 10000000,
      max_players_per_room: 100,
      update_rate: 60,
      serialization: 'protobuf',
      load_balancing: 'geographic'
    });
    
    await this.photon.initialize();
    
    console.log('Game engines initialized');
  }

  private async initializeExperimentationPlatform(): Promise<void> {
    // Initialize A/B testing platform
    this.abTesting = new ABTestingPlatform({
      max_experiments: 1000,
      max_variants: 10,
      traffic_allocation: 'auto',
      statistical_significance: 0.95,
      sample_size: 10000
    });
    
    await this.abTesting.initialize();
    
    // Initialize feature flag system
    this.featureFlags = new FeatureFlagSystem({
      max_flags: 10000,
      rollout_strategy: 'gradual',
      targeting: 'user_segment',
      cache_ttl: 300 // 5 minutes
    });
    
    await this.featureFlags.initialize();
    
    console.log('Experimentation platform initialized');
  }

  private async initializeMetricsCollection(): Promise<void> {
    this.gameMetrics = new GameMetricsCollector();
    await this.gameMetrics.initialize();
  }

  private startMonitoring(): void {
    // Monitor matchmaking servers
    setInterval(async () => {
      await this.monitorMatchmakingServers();
    }, 30000); // Every 30 seconds
    
    // Monitor game state servers
    setInterval(async () => {
      await this.monitorGameStateServers();
    }, 30000); // Every 30 seconds
    
    // Monitor asset delivery servers
    setInterval(async () => {
      await this.monitorAssetDeliveryServers();
    }, 60000); // Every minute
    
    // Monitor game engines
    setInterval(async () => {
      await this.monitorGameEngines();
    }, 30000); // Every 30 seconds
  }

  private async monitorMatchmakingServers(): Promise<void> {
    for (const server of this.matchmakingServers) {
      const metrics = await server.getMetrics();
      
      if (metrics.queue_size > 10000) {
        console.warn(`Matchmaking server ${server.id} queue size: ${metrics.queue_size}`);
        await this.scaleMatchmakingServer(server);
      }
    }
  }

  private async monitorGameStateServers(): Promise<void> {
    for (const server of this.gameStateServers) {
      const metrics = await server.getMetrics();
      
      if (metrics.sync_latency > 100) {
        console.warn(`Game state server ${server.id} sync latency: ${metrics.sync_latency}ms`);
        await this.optimizeGameStateServer(server);
      }
    }
  }

  private async monitorAssetDeliveryServers(): Promise<void> {
    for (const server of this.assetDeliveryServers) {
      const metrics = await server.getMetrics();
      
      if (metrics.bandwidth_usage > 0.8) {
        console.warn(`Asset delivery server ${server.id} bandwidth usage: ${metrics.bandwidth_usage}`);
        await this.scaleAssetDeliveryServer(server);
      }
    }
  }

  private async monitorGameEngines(): Promise<void> {
    const unityMetrics = await this.unityMirror.getMetrics();
    const photonMetrics = await this.photon.getMetrics();
    
    if (unityMetrics.connection_count > 800000000) {
      console.warn(`Unity Mirror connections: ${unityMetrics.connection_count}`);
      await this.scaleUnityMirror();
    }
    
    if (photonMetrics.active_rooms > 9000000) {
      console.warn(`Photon active rooms: ${photonMetrics.active_rooms}`);
      await this.scalePhoton();
    }
  }

  // Public API methods

  async findMatch(request: MatchmakingRequest): Promise<MatchmakingResult> {
    // Get best matchmaking server for user
    const server = await this.getBestMatchmakingServer(request);
    
    // Find match
    return await server.findMatch(request);
  }

  private async getBestMatchmakingServer(request: MatchmakingRequest): Promise<MatchmakingServer> {
    // Find server with lowest queue in user's region
    const regionServers = this.matchmakingServers.filter(s => s.region === request.region);
    
    if (regionServers.length === 0) {
      // Fallback to any server
      return this.matchmakingServers[0];
    }
    
    return regionServers.reduce((best, current) => 
      current.getQueueSize() < best.getQueueSize() ? current : best
    );
  }

  async createGameState(gameConfig: GameStateConfig): Promise<GameStateResult> {
    // Get best game state server
    const server = await this.getBestGameStateServer(gameConfig);
    
    // Create game state
    return await server.createGameState(gameConfig);
  }

  private async getBestGameStateServer(config: GameStateConfig): Promise<GameStateServer> {
    // Find server with lowest load in user's region
    const regionServers = this.gameStateServers.filter(s => s.region === config.region);
    
    if (regionServers.length === 0) {
      // Fallback to any server
      return this.gameStateServers[0];
    }
    
    return regionServers.reduce((best, current) => 
      current.getLoad() < best.getLoad() ? current : best
    );
  }

  async deliverAsset(request: AssetDeliveryRequest): Promise<AssetDeliveryResult> {
    // Get best asset delivery server
    const server = await this.getBestAssetDeliveryServer(request);
    
    // Deliver asset
    return await server.deliverAsset(request);
  }

  private async getBestAssetDeliveryServer(request: AssetDeliveryRequest): Promise<AssetDeliveryServer> {
    // Find server closest to user
    const regionServers = this.assetDeliveryServers.filter(s => s.region === request.region);
    
    if (regionServers.length === 0) {
      // Fallback to any server
      return this.assetDeliveryServers[0];
    }
    
    return regionServers[0]; // Use first available for simplicity
  }

  async runExperiment(experiment: ExperimentConfig): Promise<ExperimentResult> {
    return await this.abTesting.runExperiment(experiment);
  }

  async checkFeatureFlag(flagName: string, userContext: UserContext): Promise<boolean> {
    return await this.featureFlags.checkFlag(flagName, userContext);
  }

  async getGameMetrics(): Promise<GameMetrics> {
    return await this.gameMetrics.collectMetrics();
  }

  private async scaleMatchmakingServer(server: MatchmakingServer): Promise<void> {
    // Scale up matchmaking server
    await server.scaleUp();
    console.log(`Scaled up matchmaking server: ${server.id}`);
  }

  private async optimizeGameStateServer(server: GameStateServer): Promise<void> {
    // Optimize game state server
    await server.optimize();
    console.log(`Optimized game state server: ${server.id}`);
  }

  private async scaleAssetDeliveryServer(server: AssetDeliveryServer): Promise<void> {
    // Scale up asset delivery server
    await server.scaleUp();
    console.log(`Scaled up asset delivery server: ${server.id}`);
  }

  private async scaleUnityMirror(): Promise<void> {
    // Scale up Unity Mirror
    await this.unityMirror.scaleUp();
    console.log('Scaled up Unity Mirror');
  }

  private async scalePhoton(): Promise<void> {
    // Scale up Photon
    await this.photon.scaleUp();
    console.log('Scaled up Photon');
  }

  async getInfrastructureStatus(): Promise<GameInfrastructureStatus> {
    const matchmakingStatus = await this.getMatchmakingStatus();
    const gameStateStatus = await this.getGameStateStatus();
    const assetDeliveryStatus = await this.getAssetDeliveryStatus();
    const gameEngineStatus = await this.getGameEngineStatus();
    const experimentationStatus = await this.getExperimentationStatus();
    
    return {
      matchmaking: matchmakingStatus,
      game_state: gameStateStatus,
      asset_delivery: assetDeliveryStatus,
      game_engines: gameEngineStatus,
      experimentation: experimentationStatus,
      overall_health: this.calculateOverallHealth(matchmakingStatus, gameStateStatus, assetDeliveryStatus)
    };
  }

  private async getMatchmakingStatus(): Promise<MatchmakingStatus> {
    const servers = await Promise.all(
      this.matchmakingServers.map(server => server.getStatus())
    );
    
    return {
      total_servers: this.matchmakingServers.length,
      active_servers: servers.filter(s => s.status === 'active').length,
      total_queue_size: servers.reduce((sum, s) => sum + s.queue_size, 0),
      average_wait_time: servers.reduce((sum, s) => sum + s.average_wait_time, 0) / servers.length,
      matches_per_second: servers.reduce((sum, s) => sum + s.matches_per_second, 0)
    };
  }

  private async getGameStateStatus(): Promise<GameStateStatus> {
    const servers = await Promise.all(
      this.gameStateServers.map(server => server.getStatus())
    );
    
    return {
      total_servers: this.gameStateServers.length,
      active_servers: servers.filter(s => s.status === 'active').length,
      total_games: servers.reduce((sum, s) => sum + s.active_games, 0),
      average_sync_latency: servers.reduce((sum, s) => sum + s.sync_latency, 0) / servers.length,
      sync_frequency: 60, // 60Hz
      state_size_average: servers.reduce((sum, s) => sum + s.average_state_size, 0) / servers.length
    };
  }

  private async getAssetDeliveryStatus(): Promise<AssetDeliveryStatus> {
    const servers = await Promise.all(
      this.assetDeliveryServers.map(server => server.getStatus())
    );
    
    return {
      total_servers: this.assetDeliveryServers.length,
      active_servers: servers.filter(s => s.status === 'active').length,
      total_bandwidth_usage: servers.reduce((sum, s) => sum + s.bandwidth_usage, 0) / servers.length,
      cache_hit_ratio: servers.reduce((sum, s) => sum + s.cache_hit_ratio, 0) / servers.length,
      average_delivery_time: servers.reduce((sum, s) => sum + s.average_delivery_time, 0) / servers.length,
      compression_ratio: servers.reduce((sum, s) => sum + s.compression_ratio, 0) / servers.length
    };
  }

  private async getGameEngineStatus(): Promise<GameEngineStatus> {
    const unityMetrics = await this.unityMirror.getMetrics();
    const photonMetrics = await this.photon.getMetrics();
    
    return {
      unity_mirror: {
        connections: unityMetrics.connection_count,
        messages_per_second: unityMetrics.messages_per_second,
        average_latency: unityMetrics.average_latency
      },
      photon: {
        active_rooms: photonMetrics.active_rooms,
        total_players: photonMetrics.total_players,
        average_room_size: photonMetrics.average_room_size,
        update_rate: photonMetrics.update_rate
      }
    };
  }

  private async getExperimentationStatus(): Promise<ExperimentationStatus> {
    const abTestingMetrics = await this.abTesting.getMetrics();
    const featureFlagMetrics = await this.featureFlags.getMetrics();
    
    return {
      ab_testing: abTestingMetrics,
      feature_flags: featureFlagMetrics
    };
  }

  private calculateOverallHealth(
    matchmaking: MatchmakingStatus,
    gameState: GameStateStatus,
    assetDelivery: AssetDeliveryStatus
  ): GameHealth {
    let score = 100;
    let issues: string[] = [];
    
    // Matchmaking health
    if (matchmaking.average_wait_time > 10000) {
      score -= 20;
      issues.push('High matchmaking wait time');
    }
    
    // Game state health
    if (gameState.average_sync_latency > 50) {
      score -= 20;
      issues.push('High game state sync latency');
    }
    
    // Asset delivery health
    if (assetDelivery.total_bandwidth_usage > 0.8) {
      score -= 15;
      issues.push('High bandwidth usage');
    }
    
    let status: GameHealthStatus = 'excellent';
    if (score < 70) status = 'good';
    if (score < 50) status = 'fair';
    if (score < 30) status = 'poor';
    if (score < 10) status = 'critical';
    
    return {
      status,
      score,
      issues
    };
  }
}

// Supporting classes (simplified for brevity)

class MatchmakingServer {
  private config: any;
  private queue: any[] = [];
  private metrics: any = {};

  constructor(config: any) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    // Initialize matchmaking server
  }

  async findMatch(request: MatchmakingRequest): Promise<MatchmakingResult> {
    // Find match logic
    return {
      match_id: this.generateId(),
      players: [request.user_id],
      status: 'found',
      wait_time: 1000
    };
  }

  async getMetrics(): Promise<any> {
    return {
      queue_size: this.queue.length,
      average_wait_time: 5000,
      matches_per_second: 100,
      status: 'active'
    };
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  async scaleUp(): Promise<void> {
    // Scale up server
  }

  async getStatus(): Promise<any> {
    return {
      status: 'active',
      queue_size: this.queue.length,
      average_wait_time: 5000,
      matches_per_second: 100
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

class GameStateServer {
  private config: any;
  private games: Map<string, any> = new Map();
  private metrics: any = {};

  constructor(config: any) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    // Initialize game state server
  }

  async createGameState(config: GameStateConfig): Promise<GameStateResult> {
    const gameState = {
      id: this.generateId(),
      config,
      state: {},
      last_updated: new Date()
    };
    
    this.games.set(gameState.id, gameState);
    
    return {
      game_id: gameState.id,
      status: 'created',
      sync_url: `wss://gamestate-${this.config.id}.peoplepower.io/${gameState.id}`
    };
  }

  async getMetrics(): Promise<any> {
    return {
      active_games: this.games.size,
      sync_latency: 20,
      average_state_size: 512,
      status: 'active'
    };
  }

  getLoad(): number {
    return this.games.size / this.config.capacity;
  }

  async optimize(): Promise<void> {
    // Optimize server
  }

  async getStatus(): Promise<any> {
    return {
      status: 'active',
      active_games: this.games.size,
      sync_latency: 20,
      average_state_size: 512
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

class AssetDeliveryServer {
  private config: any;
  private metrics: any = {};

  constructor(config: any) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    // Initialize asset delivery server
  }

  async deliverAsset(request: AssetDeliveryRequest): Promise<AssetDeliveryResult> {
    // Deliver asset logic
    return {
      asset_url: `https://assets.peoplepower.io/${request.asset_id}`,
      delivery_time: 100,
      optimized: true,
      compressed: true
    };
  }

  async getMetrics(): Promise<any> {
    return {
      bandwidth_usage: 0.6,
      cache_hit_ratio: 0.85,
      average_delivery_time: 100,
      compression_ratio: 0.7,
      status: 'active'
    };
  }

  async scaleUp(): Promise<void> {
    // Scale up server
  }

  async getStatus(): Promise<any> {
    return {
      status: 'active',
      bandwidth_usage: 0.6,
      cache_hit_ratio: 0.85,
      average_delivery_time: 100,
      compression_ratio: 0.7
    };
  }
}

class UnityMirror {
  private config: any;
  private metrics: any = {};

  constructor(config: any) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    // Initialize Unity Mirror
  }

  async getMetrics(): Promise<any> {
    return {
      connection_count: 500000000,
      messages_per_second: 30000000,
      average_latency: 25
    };
  }

  async scaleUp(): Promise<void> {
    // Scale up Unity Mirror
  }
}

class Photon {
  private config: any;
  private metrics: any = {};

  constructor(config: any) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    // Initialize Photon
  }

  async getMetrics(): Promise<any> {
    return {
      active_rooms: 5000000,
      total_players: 900000000,
      average_room_size: 18,
      update_rate: 60
    };
  }

  async scaleUp(): Promise<void> {
    // Scale up Photon
  }
}

class ABTestingPlatform {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    // Initialize A/B testing
  }

  async runExperiment(experiment: ExperimentConfig): Promise<ExperimentResult> {
    // Run experiment
    return {
      experiment_id: this.generateId(),
      variant: 'control',
      success: true
    };
  }

  async getMetrics(): Promise<any> {
    return {
      active_experiments: 50,
      total_participants: 10000000,
      conversion_rate: 0.05
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

class FeatureFlagSystem {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    // Initialize feature flags
  }

  async checkFlag(flagName: string, userContext: UserContext): Promise<boolean> {
    // Check feature flag
    return Math.random() > 0.5; // Placeholder
  }

  async getMetrics(): Promise<any> {
    return {
      total_flags: 1000,
      active_flags: 500,
      evaluation_rate: 1000000
    };
  }
}

class GameMetricsCollector {
  private metrics: any = {};

  async initialize(): Promise<void> {
    // Initialize metrics collector
  }

  async collectMetrics(): Promise<GameMetrics> {
    return {
      total_players: 900000000,
      active_matches: 10000000,
      total_games: 20000000,
      average_session_duration: 1800, // 30 minutes
      retention_rate: 0.85
    };
  }
}

// Type definitions
export interface MatchmakingRequest {
  user_id: string;
  region: string;
  game_type: string;
  skill_level: number;
  preferences: any;
}

export interface MatchmakingResult {
  match_id: string;
  players: string[];
  status: string;
  wait_time: number;
}

export interface GameStateConfig {
  game_type: string;
  max_players: number;
  region: string;
  settings: any;
}

export interface GameStateResult {
  game_id: string;
  status: string;
  sync_url: string;
}

export interface AssetDeliveryRequest {
  asset_id: string;
  asset_type: string;
  region: string;
  user_context: any;
}

export interface AssetDeliveryResult {
  asset_url: string;
  delivery_time: number;
  optimized: boolean;
  compressed: boolean;
}

export interface ExperimentConfig {
  name: string;
  variants: any[];
  traffic_allocation: number;
  success_metric: string;
}

export interface ExperimentResult {
  experiment_id: string;
  variant: string;
  success: boolean;
}

export interface UserContext {
  user_id: string;
  region: string;
  segment: string;
  properties: any;
}

export interface GameInfrastructureStatus {
  matchmaking: MatchmakingStatus;
  game_state: GameStateStatus;
  asset_delivery: AssetDeliveryStatus;
  game_engines: GameEngineStatus;
  experimentation: ExperimentationStatus;
  overall_health: GameHealth;
}

export interface MatchmakingStatus {
  total_servers: number;
  active_servers: number;
  total_queue_size: number;
  average_wait_time: number;
  matches_per_second: number;
}

export interface GameStateStatus {
  total_servers: number;
  active_servers: number;
  total_games: number;
  average_sync_latency: number;
  sync_frequency: number;
  state_size_average: number;
}

export interface AssetDeliveryStatus {
  total_servers: number;
  active_servers: number;
  total_bandwidth_usage: number;
  cache_hit_ratio: number;
  average_delivery_time: number;
  compression_ratio: number;
}

export interface GameEngineStatus {
  unity_mirror: {
    connections: number;
    messages_per_second: number;
    average_latency: number;
  };
  photon: {
    active_rooms: number;
    total_players: number;
    average_room_size: number;
    update_rate: number;
  };
}

export interface ExperimentationStatus {
  ab_testing: any;
  feature_flags: any;
}

export interface GameHealth {
  status: GameHealthStatus;
  score: number;
  issues: string[];
}

export type GameHealthStatus = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';

export interface GameMetrics {
  total_players: number;
  active_matches: number;
  total_games: number;
  average_session_duration: number;
  retention_rate: number;
}

export default GameInfrastructureManager;
