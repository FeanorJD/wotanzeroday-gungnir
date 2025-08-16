import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Target, 
  AlertTriangle, 
  Activity, 
  Eye, 
  Search, 
  Bell, 
  Settings, 
  User, 
  TrendingUp,
  Database,
  Network,
  Lock,
  Zap,
  Filter,
  Download,
  RefreshCw,
  ChevronRight,
  MapPin,
  Clock,
  Cpu,
  HardDrive,
  Wifi
} from 'lucide-react';

const Gungnir = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [threats, setThreats] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [stats, setStats] = useState({
    threatsDetected: 127,
    zerodays: 3,
    activeSessions: 1247,
    systemHealth: 98.7
  });

  // Simulación de datos en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        threatsDetected: prev.threatsDetected + Math.floor(Math.random() * 3),
        activeSessions: prev.activeSessions + Math.floor(Math.random() * 10 - 5),
        systemHealth: Math.max(95, Math.min(100, prev.systemHealth + (Math.random() - 0.5) * 2))
      }));
      
      // Agregar nuevas amenazas ocasionalmente
      if (Math.random() < 0.3) {
        const newThreat = {
          id: Date.now(),
          type: ['Zero-day', 'Malware', 'Phishing', 'DDoS', 'Ransomware'][Math.floor(Math.random() * 5)],
          severity: ['Critical', 'High', 'Medium', 'Low'][Math.floor(Math.random() * 4)],
          source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          timestamp: new Date().toLocaleTimeString(),
          status: 'Active'
        };
        setThreats(prev => [newThreat, ...prev.slice(0, 9)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  const ThreatCard = ({ threat }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800/70 transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          threat.severity === 'Critical' ? 'bg-red-900/50 text-red-300' :
          threat.severity === 'High' ? 'bg-orange-900/50 text-orange-300' :
          threat.severity === 'Medium' ? 'bg-yellow-900/50 text-yellow-300' :
          'bg-green-900/50 text-green-300'
        }`}>
          {threat.severity}
        </span>
        <span className="text-slate-400 text-xs">{threat.timestamp}</span>
      </div>
      <h4 className="text-cyan-300 font-semibold mb-1">{threat.type}</h4>
      <p className="text-slate-300 text-sm mb-2">Source: {threat.source}</p>
      <div className="flex justify-between items-center">
        <span className={`px-2 py-1 rounded text-xs ${
          threat.status === 'Active' ? 'bg-red-900/30 text-red-300' : 'bg-gray-900/30 text-gray-300'
        }`}>
          {threat.status}
        </span>
        <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );

  const StatCard = ({ icon: Icon, title, value, change, color = "cyan" }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-900/30`}>
          <Icon className={`text-${color}-400`} size={24} />
        </div>
        {change && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            change > 0 ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
          }`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <h3 className="text-slate-300 text-sm font-medium mb-1">{title}</h3>
      <p className={`text-2xl font-bold text-${color}-300`}>{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Target className="text-cyan-400 norse-glow" size={32} />
                <div>
                  <h1 className="text-2xl font-bold text-gungnir">Wotanzeroday</h1>
                  <p className="text-slate-400 text-sm">Gungnir SOC Platform | creado por Pablo Bobadilla</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <button 
                onClick={startScan}
                disabled={isScanning}
                className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-800 rounded-lg transition-colors font-medium"
              >
                {isScanning ? <RefreshCw className="animate-spin" size={18} /> : <Search size={18} />}
                <span>{isScanning ? 'Scanning...' : 'Deep Scan'}</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                </button>
                <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                  <Settings size={20} />
                </button>
                <div className="flex items-center space-x-2 pl-3 border-l border-slate-700">
                  <User size={20} className="text-slate-400" />
                  <span className="text-sm font-medium">Admin</span>
                  <span className="text-xs text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded-full">SOC L3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <nav className="flex space-x-1 mb-8 bg-slate-800/30 rounded-lg p-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Activity },
            { id: 'threats', label: 'Threat Hunter', icon: Eye },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'network', label: 'Network', icon: Network }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === id 
                  ? 'bg-cyan-600 text-white shadow-lg' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </nav>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard 
                icon={AlertTriangle} 
                title="Threats Detected" 
                value={stats.threatsDetected} 
                change={+12}
                color="red"
              />
              <StatCard 
                icon={Zap} 
                title="Zero-days Found" 
                value={stats.zerodays} 
                change={+1}
                color="orange"
              />
              <StatCard 
                icon={Users} 
                title="Active Sessions" 
                value={stats.activeSessions.toLocaleString()} 
                change={-3}
                color="blue"
              />
              <StatCard 
                icon={Shield} 
                title="System Health" 
                value={`${stats.systemHealth.toFixed(1)}%`} 
                change={+0.2}
                color="green"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Real-time Threats */}
              <div className="lg:col-span-2">
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-cyan-300 flex items-center space-x-2">
                      <Target size={24} />
                      <span>Live Threat Feed</span>
                    </h2>
                    <div className="flex space-x-2">
                      <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                        <Filter size={18} />
                      </button>
                      <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                        <Download size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {threats.length > 0 ? threats.map(threat => (
                      <ThreatCard key={threat.id} threat={threat} />
                    )) : (
                      <div className="text-center py-8 text-slate-400">
                        <Eye size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No active threats detected</p>
                        <p className="text-sm">Gungnir is watching...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="space-y-6">
                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center space-x-2">
                    <Activity size={20} />
                    <span>System Status</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Cpu size={16} className="text-blue-400" />
                        <span className="text-sm">CPU Usage</span>
                      </div>
                      <span className="text-blue-400 font-semibold">23%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '23%'}}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <HardDrive size={16} className="text-green-400" />
                        <span className="text-sm">Memory</span>
                      </div>
                      <span className="text-green-400 font-semibold">67%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '67%'}}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Wifi size={16} className="text-cyan-400" />
                        <span className="text-sm">Network</span>
                      </div>
                      <span className="text-cyan-400 font-semibold">Online</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center space-x-2">
                    <MapPin size={20} />
                    <span>Threat Map</span>
                  </h3>
                  
                  <div className="bg-slate-900/50 rounded-lg p-4 h-48 flex items-center justify-center">
                    <div className="text-center text-slate-400">
                      <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Global Threat Visualization</p>
                      <p className="text-xs">Interactive map coming soon</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center space-x-2">
                    <Clock size={20} />
                    <span>Recent Activity</span>
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-slate-300">Critical alert triggered</span>
                      <span className="text-slate-500 ml-auto">2m ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-slate-300">Scan completed</span>
                      <span className="text-slate-500 ml-auto">5m ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-slate-300">System updated</span>
                      <span className="text-slate-500 ml-auto">1h ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Threat Hunter Tab */}
        {activeTab === 'threats' && (
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-8 text-center">
            <Eye size={64} className="mx-auto mb-4 text-cyan-400 opacity-70" />
            <h2 className="text-2xl font-bold text-cyan-300 mb-2">Threat Hunter</h2>
            <p className="text-slate-400 mb-6">Advanced threat hunting capabilities</p>
            <p className="text-slate-500">This module is under development</p>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-8 text-center">
            <TrendingUp size={64} className="mx-auto mb-4 text-cyan-400 opacity-70" />
            <h2 className="text-2xl font-bold text-cyan-300 mb-2">Analytics Dashboard</h2>
            <p className="text-slate-400 mb-6">Deep dive into threat patterns and trends</p>
            <p className="text-slate-500">Advanced analytics coming soon</p>
          </div>
        )}

        {/* Network Tab */}
        {activeTab === 'network' && (
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-8 text-center">
            <Network size={64} className="mx-auto mb-4 text-cyan-400 opacity-70" />
            <h2 className="text-2xl font-bold text-cyan-300 mb-2">Network Monitor</h2>
            <p className="text-slate-400 mb-6">Real-time network traffic analysis</p>
            <p className="text-slate-500">Network monitoring tools in development</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/30 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Target className="text-cyan-400" size={20} />
              <span className="text-slate-400 text-sm">
                Wotanzeroday - Gungnir v2.3.1 | The spear that never misses its target
              </span>
            </div>
            <div className="text-slate-500 text-sm">
              Developed by <span className="text-cyan-400">Pablo Bobadilla</span> - SOC L3
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Fix para el icono Users que faltaba
const Users = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

export default Gungnir;
