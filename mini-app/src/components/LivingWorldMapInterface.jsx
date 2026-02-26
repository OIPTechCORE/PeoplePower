import React, { useState, useEffect, useRef } from 'react';
import { 
    Globe, 
    Zap, 
    Users, 
    TrendingUp, 
    Activity, 
    Eye, 
    Clock, 
    Award,
    MapPin,
    Pulse,
    Flame,
    Cloud,
    Bridge,
    Star,
    BarChart3,
    Settings,
    Play,
    Pause,
    RotateCcw,
    Maximize2,
    Layers,
    Filter,
    Search,
    Bell,
    Heart,
    Shield,
    Target,
    Navigation,
    Compass,
    Radio,
    Database,
    BrainCircuit,
    History,
    TrendingDown,
    AlertTriangle
} from 'lucide-react';

// ===================================
// LIVING WORLD MAP INTERFACE
// "THE CIVILIZATION NERVOUS SYSTEM"
// ===================================

const LivingWorldMapInterface = ({ playerId, onClose }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    
    // State management
    const [worldState, setWorldState] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [activeEffects, setActiveEffects] = useState([]);
    const [viewMode, setViewMode] = useState('energy'); // energy, unity, knowledge, economy, stability
    const [isPaused, setIsPaused] = useState(false);
    const [showTimeline, setShowTimeline] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [showDNA, setShowDNA] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [realtimeStats, setRealtimeStats] = useState(null);
    const [historicalEvents, setHistoricalEvents] = useState([]);
    const [playerAttachments, setPlayerAttachments] = useState([]);

    // Animation settings
    const [animationSpeed, setAnimationSpeed] = useState(1);
    const [showConnections, setShowConnections] = useState(true);
    const [showEffects, setShowEffects] = useState(true);
    const [showLabels, setShowLabels] = useState(true);

    useEffect(() => {
        loadWorldData();
        startRealTimeUpdates();
        
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    const loadWorldData = async () => {
        try {
            // Load world state
            const worldResponse = await fetch('/api/living-world-map/world/state');
            const worldData = await worldResponse.json();
            setWorldState(worldData.data);

            // Load active effects
            const effectsResponse = await fetch('/api/living-world-map/effects/active');
            const effectsData = await effectsResponse.json();
            setActiveEffects(effectsData.data);

            // Load player attachments
            const attachmentsResponse = await fetch(`/api/living-world-map/attachments/player/${playerId}`);
            const attachmentsData = await attachmentsResponse.json();
            setPlayerAttachments(attachmentsData.data);

            // Load historical events
            const historyResponse = await fetch('/api/living-world-map/history/events?limit=10');
            const historyData = await historyResponse.json();
            setHistoricalEvents(historyData.data);

        } catch (error) {
            console.error('Error loading world data:', error);
        }
    };

    const startRealTimeUpdates = () => {
        const updateWorld = async () => {
            if (!isPaused) {
                try {
                    const response = await fetch('/api/living-world-map/world/state');
                    const data = await response.json();
                    setWorldState(data.data);
                    
                    // Update canvas
                    drawWorldMap(data.data);
                } catch (error) {
                    console.error('Error updating world:', error);
                }
            }
            
            animationRef.current = requestAnimationFrame(updateWorld);
        };
        
        updateWorld();
    };

    const drawWorldMap = (countries) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, width, height);

        // Draw grid
        drawGrid(ctx, width, height);

        // Draw connections
        if (showConnections) {
            drawConnections(ctx, countries);
        }

        // Draw countries
        countries.forEach(country => {
            drawCountry(ctx, country, width, height);
        });

        // Draw effects
        if (showEffects) {
            drawEffects(ctx, activeEffects);
        }

        // Draw labels
        if (showLabels) {
            drawLabels(ctx, countries);
        }
    };

    const drawGrid = (ctx, width, height) => {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;

        // Draw latitude lines
        for (let lat = -90; lat <= 90; lat += 30) {
            const y = ((lat + 90) / 180) * height;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Draw longitude lines
        for (let lng = -180; lng <= 180; lng += 30) {
            const x = ((lng + 180) / 360) * width;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
    };

    const drawCountry = (ctx, country, width, height) => {
        const coords = country.coordinates || { lat: 0, lng: 0 };
        const x = ((coords.lng + 180) / 360) * width;
        const y = ((coords.lat + 90) / 180) * height;

        // Get color based on view mode
        const color = getCountryColor(country, viewMode);
        
        // Draw country circle
        const radius = 10 + (country.global_influence || 0) * 20;
        
        // Glow effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.5, color + '40');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Core circle
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Evolution stage indicator
        if (country.evolution_stage >= 3) {
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, radius + 5, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Pulse animation for active countries
        if (country.activity_energy > 0.5) {
            const pulseRadius = radius + Math.sin(Date.now() * 0.002) * 5;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
            ctx.stroke();
        }
    };

    const getCountryColor = (country, mode) => {
        const value = country[getAttributeByMode(mode)] || 0;
        const intensity = Math.floor(value * 255);
        
        const colors = {
            energy: `rgb(${intensity}, ${255 - intensity}, 100)`,
            unity: `rgb(100, ${intensity}, ${255 - intensity})`,
            knowledge: `rgb(${255 - intensity}, 100, ${intensity})`,
            economy: `rgb(${intensity}, ${intensity}, 100)`,
            stability: `rgb(100, ${intensity}, ${intensity})`
        };
        
        return colors[mode] || colors.energy;
    };

    const getAttributeByMode = (mode) => {
        const attributes = {
            energy: 'activity_energy',
            unity: 'unity_level',
            knowledge: 'knowledge_index',
            economy: 'economy_strength',
            stability: 'stability_factor'
        };
        return attributes[mode] || 'activity_energy';
    };

    const drawConnections = (ctx, countries) => {
        // This would draw influence connections between countries
        ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)';
        ctx.lineWidth = 2;
        
        // Placeholder for connection drawing
        // Would need connection data from API
    };

    const drawEffects = (ctx, effects) => {
        effects.forEach(effect => {
            const coords = effect.effect_position || { lat: 0, lng: 0 };
            const x = ((coords.lng + 180) / 360) * ctx.canvas.width;
            const y = ((coords.lat + 90) / 180) * ctx.canvas.height;
            
            const effectColor = getEffectColor(effect.effect_type);
            
            // Draw effect
            ctx.fillStyle = effectColor + '40';
            ctx.beginPath();
            ctx.arc(x, y, effect.effect_radius * 20, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw effect core
            ctx.fillStyle = effectColor;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        });
    };

    const getEffectColor = (effectType) => {
        const colors = {
            pulse: '#FFD700',
            glow: '#00FF00',
            storm: '#FF4444',
            expansion: '#4444FF',
            bridge: '#FF44FF'
        };
        return colors[effectType] || '#FFFFFF';
    };

    const drawLabels = (ctx, countries) => {
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        
        countries.forEach(country => {
            const coords = country.coordinates || { lat: 0, lng: 0 };
            const x = ((coords.lng + 180) / 360) * ctx.canvas.width;
            const y = ((coords.lat + 90) / 180) * ctx.canvas.height;
            
            ctx.fillText(country.country_code, x, y - 20);
        });
    };

    const handleCountryClick = (country) => {
        setSelectedCountry(country);
        loadCountryDetails(country.country_code);
    };

    const loadCountryDetails = async (countryCode) => {
        try {
            const response = await fetch(`/api/living-world-map/country/${countryCode}`);
            const data = await response.json();
            
            // Load country DNA
            const dnaResponse = await fetch(`/api/living-world-map/country/${countryCode}/dna`);
            const dnaData = await dnaResponse.json();
            
            setSelectedCountry({
                ...data.data.country,
                metrics: data.data.metrics,
                visualEffects: data.data.visualEffects,
                dna: dnaData.data
            });
        } catch (error) {
            console.error('Error loading country details:', error);
        }
    };

    const handlePlayerAction = async (actionType, magnitude = 0.1) => {
        try {
            const response = await fetch('/api/living-world-map/actions/process', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    playerId,
                    actionData: {
                        actionType,
                        countryCode: selectedCountry?.country_code || 'UGA',
                        magnitude,
                        metadata: { timestamp: new Date().toISOString() }
                    }
                })
            });
            
            const result = await response.json();
            if (result.success) {
                setNotifications([...notifications, {
                    type: 'success',
                    message: `Action "${actionType}" processed successfully!`,
                    data: result.data
                }]);
                
                // Reload world data
                loadWorldData();
            }
        } catch (error) {
            console.error('Error processing player action:', error);
        }
    };

    const getEvolutionStageName = (stage) => {
        const stages = {
            1: 'Awakening',
            2: 'Organization',
            3: 'Influence',
            4: 'Civilization Node',
            5: 'Beacon Nation'
        };
        return stages[stage] || 'Unknown';
    };

    const getEvolutionStageColor = (stage) => {
        const colors = {
            1: 'text-gray-500',
            2: 'text-green-500',
            3: 'text-blue-500',
            4: 'text-purple-500',
            5: 'text-yellow-500'
        };
        return colors[stage] || 'text-gray-500';
    };

    // ===================================
    // MAIN RENDER
    // ===================================
    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Main Map Area */}
            <div className="flex-1 relative">
                {/* Header Controls */}
                <div className="absolute top-4 left-4 z-10 bg-gray-900 bg-opacity-90 rounded-lg p-4 space-y-3">
                    <div className="flex items-center space-x-3">
                        <h1 className="text-xl font-bold flex items-center">
                            <Globe className="w-6 h-6 mr-2 text-blue-400" />
                            Living World Map
                        </h1>
                        
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setIsPaused(!isPaused)}
                                className="p-2 bg-gray-800 rounded hover:bg-gray-700 transition-colors"
                            >
                                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                            </button>
                            
                            <button
                                onClick={() => loadWorldData()}
                                className="p-2 bg-gray-800 rounded hover:bg-gray-700 transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                            
                            <button
                                onClick={() => setShowConnections(!showConnections)}
                                className={`p-2 rounded transition-colors ${showConnections ? 'bg-blue-600' : 'bg-gray-800'}`}
                            >
                                <Bridge className="w-4 h-4" />
                            </button>
                            
                            <button
                                onClick={() => setShowEffects(!showEffects)}
                                className={`p-2 rounded transition-colors ${showEffects ? 'bg-blue-600' : 'bg-gray-800'}`}
                            >
                                <Zap className="w-4 h-4" />
                            </button>
                            
                            <button
                                onClick={() => setShowLabels(!showLabels)}
                                className={`p-2 rounded transition-colors ${showLabels ? 'bg-blue-600' : 'bg-gray-800'}`}
                            >
                                <MapPin className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    
                    {/* View Mode Selector */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-xs text-gray-400">View Mode</label>
                        <div className="grid grid-cols-2 gap-1">
                            {['energy', 'unity', 'knowledge', 'economy', 'stability'].map(mode => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={`px-2 py-1 text-xs rounded transition-colors ${
                                        viewMode === mode ? 'bg-blue-600' : 'bg-gray-800'
                                    }`}
                                >
                                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Animation Speed */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-xs text-gray-400">Animation Speed</label>
                        <input
                            type="range"
                            min="0.1"
                            max="3"
                            step="0.1"
                            value={animationSpeed}
                            onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                            className="w-32"
                        />
                    </div>
                </div>

                {/* World Statistics */}
                <div className="absolute top-4 right-4 z-10 bg-gray-900 bg-opacity-90 rounded-lg p-4">
                    <h3 className="text-sm font-semibold mb-3 flex items-center">
                        <BarChart3 className="w-4 h-4 mr-2 text-green-400" />
                        World Statistics
                    </h3>
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Total Countries:</span>
                            <span>{worldState.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Active Effects:</span>
                            <span>{activeEffects.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Beacon Nations:</span>
                            <span>{worldState.filter(c => c.evolution_stage === 5).length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Civilization Nodes:</span>
                            <span>{worldState.filter(c => c.evolution_stage >= 3).length}</span>
                        </div>
                    </div>
                </div>

                {/* Canvas */}
                <canvas
                    ref={canvasRef}
                    width={1200}
                    height={600}
                    className="w-full h-full cursor-crosshair"
                    onClick={(e) => {
                        const rect = e.target.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        // Find clicked country (simplified)
                        const clickedCountry = worldState.find(country => {
                            const coords = country.coordinates || { lat: 0, lng: 0 };
                            const countryX = ((coords.lng + 180) / 360) * 1200;
                            const countryY = ((coords.lat + 90) / 180) * 600;
                            const distance = Math.sqrt(Math.pow(x - countryX, 2) + Math.pow(y - countryY, 2));
                            return distance < 30;
                        });
                        
                        if (clickedCountry) {
                            handleCountryClick(clickedCountry);
                        }
                    }}
                />

                {/* Selected Country Panel */}
                {selectedCountry && (
                    <div className="absolute bottom-4 left-4 z-10 bg-gray-900 bg-opacity-95 rounded-lg p-4 max-w-sm">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-bold">{selectedCountry.country_name}</h3>
                            <button
                                onClick={() => setSelectedCountry(null)}
                                className="text-gray-400 hover:text-white"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            {/* Evolution Stage */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-400">Evolution Stage</span>
                                <span className={`font-semibold ${getEvolutionStageColor(selectedCountry.evolution_stage)}`}>
                                    {getEvolutionStageName(selectedCountry.evolution_stage)}
                                </span>
                            </div>
                            
                            {/* Core Metrics */}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Energy:</span>
                                    <span>{(selectedCountry.activity_energy * 100).toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Unity:</span>
                                    <span>{(selectedCountry.unity_level * 100).toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Knowledge:</span>
                                    <span>{(selectedCountry.knowledge_index * 100).toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Economy:</span>
                                    <span>{(selectedCountry.economy_strength * 100).toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Stability:</span>
                                    <span>{(selectedCountry.stability_factor * 100).toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Influence:</span>
                                    <span>{selectedCountry.global_influence?.toFixed(2) || 0}</span>
                                </div>
                            </div>
                            
                            {/* DNA Analysis */}
                            {selectedCountry.dna && (
                                <div className="border-t border-gray-700 pt-3">
                                    <h4 className="text-sm font-semibold mb-2 flex items-center">
                                        <BrainCircuit className="w-4 h-4 mr-2 text-purple-400" />
                                        Country DNA
                                    </h4>
                                    <div className="text-xs space-y-1">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Primary Trait:</span>
                                            <span className="capitalize">{selectedCountry.dna.primary_trait}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Secondary Trait:</span>
                                            <span className="capitalize">{selectedCountry.dna.secondary_trait}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Action Buttons */}
                            <div className="border-t border-gray-700 pt-3 space-y-2">
                                <button
                                    onClick={() => handlePlayerAction('daily_participation', 0.1)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm transition-colors"
                                >
                                    <Activity className="w-4 h-4 inline mr-2" />
                                    Daily Participation
                                </button>
                                <button
                                    onClick={() => handlePlayerAction('collaboration', 0.2)}
                                    className="w-full bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm transition-colors"
                                >
                                    <Users className="w-4 h-4 inline mr-2" />
                                    Collaborate
                                </button>
                                <button
                                    onClick={() => handlePlayerAction('mission_completion', 0.3)}
                                    className="w-full bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded text-sm transition-colors"
                                >
                                    <Target className="w-4 h-4 inline mr-2" />
                                    Complete Mission
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Side Panel Toggle Buttons */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 space-y-2">
                    <button
                        onClick={() => setShowTimeline(!showTimeline)}
                        className={`p-3 bg-gray-900 bg-opacity-90 rounded-l-lg transition-colors ${
                            showTimeline ? 'bg-blue-600' : ''
                        }`}
                    >
                        <History className="w-5 h-5" />
                    </button>
                    
                    <button
                        onClick={() => setShowAnalytics(!showAnalytics)}
                        className={`p-3 bg-gray-900 bg-opacity-90 rounded-l-lg transition-colors ${
                            showAnalytics ? 'bg-blue-600' : ''
                        }`}
                    >
                        <BarChart3 className="w-5 h-5" />
                    </button>
                    
                    <button
                        onClick={() => setShowDNA(!showDNA)}
                        className={`p-3 bg-gray-900 bg-opacity-90 rounded-l-lg transition-colors ${
                            showDNA ? 'bg-blue-600' : ''
                        }`}
                    >
                        <BrainCircuit className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Side Panels */}
            {/* Timeline Panel */}
            {showTimeline && (
                <div className="w-80 bg-gray-900 border-l border-gray-800 overflow-y-auto">
                    <div className="p-4">
                        <h3 className="text-lg font-bold mb-4 flex items-center">
                            <History className="w-5 h-5 mr-2 text-yellow-400" />
                            Historical Events
                        </h3>
                        
                        <div className="space-y-3">
                            {historicalEvents.map((event, index) => (
                                <div key={index} className="bg-gray-800 rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-sm">{event.event_title}</h4>
                                        <span className="text-xs text-gray-400">
                                            {new Date(event.event_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-300 mb-2">{event.event_description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs bg-yellow-600 text-yellow-100 px-2 py-1 rounded">
                                            Level {event.significance_level}
                                        </span>
                                        <span className="text-xs text-gray-400">{event.country_name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Analytics Panel */}
            {showAnalytics && (
                <div className="w-80 bg-gray-900 border-l border-gray-800 overflow-y-auto">
                    <div className="p-4">
                        <h3 className="text-lg font-bold mb-4 flex items-center">
                            <BarChart3 className="w-5 h-5 mr-2 text-green-400" />
                            World Analytics
                        </h3>
                        
                        <div className="space-y-4">
                            {/* Top Countries */}
                            <div>
                                <h4 className="font-semibold mb-2">Top Countries by Influence</h4>
                                <div className="space-y-2">
                                    {worldState
                                        .sort((a, b) => (b.global_influence || 0) - (a.global_influence || 0))
                                        .slice(0, 5)
                                        .map((country, index) => (
                                            <div key={country.id} className="flex justify-between items-center">
                                                <span className="text-sm">{country.country_name}</span>
                                                <span className="text-sm font-semibold">{country.global_influence?.toFixed(2) || 0}</span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                            
                            {/* Evolution Distribution */}
                            <div>
                                <h4 className="font-semibold mb-2">Evolution Distribution</h4>
                                <div className="space-y-2">
                                    {[1, 2, 3, 4, 5].map(stage => {
                                        const count = worldState.filter(c => c.evolution_stage === stage).length;
                                        return (
                                            <div key={stage} className="flex justify-between items-center">
                                                <span className={`text-sm ${getEvolutionStageColor(stage)}`}>
                                                    {getEvolutionStageName(stage)}
                                                </span>
                                                <span className="text-sm">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* DNA Panel */}
            {showDNA && (
                <div className="w-80 bg-gray-900 border-l border-gray-800 overflow-y-auto">
                    <div className="p-4">
                        <h3 className="text-lg font-bold mb-4 flex items-center">
                            <BrainCircuit className="w-5 h-5 mr-2 text-purple-400" />
                            Country DNA Analysis
                        </h3>
                        
                        <div className="space-y-4">
                            {worldState.map(country => (
                                <div key={country.id} className="bg-gray-800 rounded-lg p-3">
                                    <h4 className="font-semibold mb-2">{country.country_name}</h4>
                                    <div className="text-xs space-y-1">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Civilization Type:</span>
                                            <span className="capitalize">{country.civilization_type || 'balanced'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Evolution Stage:</span>
                                            <span className={getEvolutionStageColor(country.evolution_stage)}>
                                                {getEvolutionStageName(country.evolution_stage)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Total Actions:</span>
                                            <span>{country.total_actions_ever || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Notifications */}
            <div className="fixed bottom-4 right-4 z-50 space-y-2">
                {notifications.map((notification, index) => (
                    <div
                        key={index}
                        className={`p-4 rounded-lg shadow-lg max-w-sm ${
                            notification.type === 'success' ? 'bg-green-600' : 'bg-blue-600'
                        }`}
                    >
                        <p className="text-sm">{notification.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LivingWorldMapInterface;
