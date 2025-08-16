import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Target, 
  Search, 
  Bell, 
  Settings,
  ChevronDown,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Lock,
  Cpu,
  Database,
  Network,
  Globe,
  TrendingUp,
  Users,
  FileText,
  Download,
  Upload,
  Zap,
  Star,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info
} from 'lucide-react';

const Gungnir = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isScanning, setIsScanning] = useState(false);
  const [threats, setThreats] = useState([]);
  const [networkData, setNetworkData] = useState([]);
  const canvasRef = useRef(null);

  // Simulated real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      setThreats(prev => [
        ...prev.slice(-9),
        {
          id: Date.now(),
          type: ['Critical', 'High', 'Medium', 'Low'][Math.floor(Math.random() * 4)],
          source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          description: [
            'Suspicious network activity detected',
            'Potential zero-day exploit attempt',
            'Unusual authentication patterns',
            'Malware signature match',
            'DDoS attack pattern identified'
          ][Math.floor(Math.random() * 5)],
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Network visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    const nodes = Array.from({ length: 20 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius: Math.random() * 5 + 3,
      color: `hsl(${200 + Math.random() * 60}, 70%, ${60 + Math.random() * 20}%)`
    }));

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, width, height);

      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Draw connections
        nodes.forEach(other => {
          const distance = Math.sqrt((node.x - other.x) ** 2 + (node.y - other.y) ** 2);
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.3 - distance / 300})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Shield },
    { id: 'threats', name: 'Threat Detection', icon: AlertTriangle },
    { id: 'network', name: 'Network Monitor', icon: Network },
    { id: 'hunting', name: 'Threat Hunting', icon: Target },
    { id: 'incidents', name: 'Incidents', icon: Bell },
    { id: 'intelligence', name: 'Threat Intel', icon: Eye },
    { id: 'analysis', name: 'Analysis', icon: TrendingUp }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Active Threats', value: '23', change: '+12%', color: 'text-red-400', bg: 'bg-red-900/20' },
          { title: 'Systems Monitored', value: '1,847', change: '+5%', color: 'text-blue-400', bg: 'bg-blue-900/20' },
          { title: 'Incidents Resolved', value: '156', change: '+8%', color: 'text-green-400', bg: 'bg-green-900/20' },
          { title: 'Zero-Day Signatures', value: '89', change: '+3%', color: 'text-purple-400', bg: 'bg-purple-900/20' }
        ].map((stat, idx) => (
          <div key={idx} className={`${stat.bg} border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.change} from last hour</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <Activity className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Network Visualization */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-blue-400" />
            Network Topology
          </h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors">
              Live View
            </button>
            <button className="px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded text-sm transition-colors">
              Historical
            </button>
          </div>
        </div>
        <canvas 
          ref={canvasRef} 
          className="w-full h-64 bg-slate-900/50 rounded-lg"
          style={{ background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.9) 100%)' }}
        />
      </div>

      {/* Recent Threats */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg backdrop-blur-sm">
        <div className="p-6 border-b border-slate-700/50">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Recent Threat Activity
          </h3>
        </div>
        <div className="p-0">
          {threats.slice(0, 5).map((threat, idx) => (
            <div key={threat.id} className="flex items-center justify-between p-4 border-b border-slate-700/30 last:border-b-0 hover:bg-slate-700/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${
                  threat.type === 'Critical' ? 'bg-red-500' :
                  threat.type === 'High' ? 'bg-orange-500' :
                  threat.type === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div>
                  <p className="text-white font-medium">{threat.description}</p>
                  <p className="text-slate-400 text-sm">Source: {threat.source}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  threat.type === 'Critical' ? 'bg-red-900 text-red-200' :
                  threat.type === 'High' ? 'bg-orange-900 text-orange-200' :
                  threat.type === 'Medium' ? 'bg-yellow-900 text-yellow-200' :
                  'bg-green-900 text-green-200'
                }`}>
                  {threat.type}
                </span>
                <p className="text-slate-400 text-xs mt-1">{threat.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderThreatDetection = () => (
    <div className="space-y-6">
      {/* Scanning Controls */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-red-400" />
            Zero-Day Detection Engine
          </h3>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsScanning(!isScanning)}
              className={`px-4 py-2 rounded font-medium transition-colors flex items-center gap-2 ${
                isScanning 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isScanning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isScanning ? 'Stop Scan' : 'Start Scan'}
            </button>
            <button className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded transition-colors flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
        
        {isScanning && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-slate-300 mb-1">
              <span>Scanning in progress...</span>
              <span>73%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{width: '73%'}}></div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Signatures Updated', value: '2,847', icon: Database },
            { label: 'Systems Scanned', value: '1,245', icon: Cpu },
            { label: 'Threats Found', value: '23', icon: AlertTriangle }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-900/50 rounded-lg p-4 text-center">
              <item.icon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{item.value}</p>
              <p className="text-slate-400 text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detection Results */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg backdrop-blur-sm">
        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Detection Results</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded text-sm transition-colors flex items-center gap-1">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors flex items-center gap-1">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="text-left p-4 text-slate-300 font-medium">Timestamp</th>
                <th className="text-left p-4 text-slate-300 font-medium">Threat Type</th>
                <th className="text-left p-4 text-slate-300 font-medium">Source</th>
                <th className="text-left p-4 text-slate-300 font-medium">Severity</th>
                <th className="text-left p-4 text-slate-300 font-medium">Status</th>
                <th className="text-left p-4 text-slate-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {threats.map((threat, idx) => (
                <tr key={idx} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                  <td className="p-4 text-slate-300">{threat.timestamp}</td>
                  <td className="p-4 text-white">{threat.description}</td>
                  <td className="p-4 text-slate-300">{threat.source}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      threat.type === 'Critical' ? 'bg-red-900 text-red-200' :
                      threat.type === 'High' ? 'bg-orange-900 text-orange-200' :
                      threat.type === 'Medium' ? 'bg-yellow-900 text-yellow-200' :
                      'bg-green-900 text-green-200'
                    }`}>
                      {threat.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-amber-900 text-amber-200 rounded text-xs font-medium">
                      Investigating
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors">
                        <Lock className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderNetworkMonitor = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-green-400" />
          Network Traffic Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Inbound Traffic', value: '2.3 GB/s', color: 'text-green-400' },
            { label: 'Outbound Traffic', value: '1.8 GB/s', color: 'text-blue-400' },
            { label: 'Active Connections', value: '15,847', color: 'text-purple-400' },
            { label: 'Blocked IPs', value: '234', color: 'text-red-400' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-slate-900/50 rounded-lg p-4 text-center">
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-slate-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="h-64 bg-slate-900/50 rounded-lg flex items-center justify-center">
          <p className="text-slate-400">Network Traffic Visualization</p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return renderDashboard();
      case 'threats': return renderThreatDetection();
      case 'network': return renderNetworkMonitor();
      default: 
        return (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-8 backdrop-blur-sm text-center">
            <div className="text-slate-400 mb-4">
              <Zap className="w-12 h-12 mx-auto mb-2" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {tabs.find(t => t.id === activeTab)?.name || 'Module'}
            </h3>
            <p className="text-slate-400">This module is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-blue-400" />
                <div>
                  <h1 className="text-xl font-bold text-white">GUNGNIR</h1>
                  <p className="text-xs text-slate-400">Zero-Day SOC Platform</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search threats..." 
                  className="pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <button className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              </button>
              
              <button className="p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-2 pl-4 border-l border-slate-700">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">PB</span>
                </div>
                <div className="text-sm">
                  <p className="text-white font-medium">Pablo Bobadilla</p>
                  <p className="text-slate-400">SOC Analyst</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-400 text-blue-400 bg-slate-700/30'
                      : 'border-transparent text-slate-400 hover:text-white hover:border-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800/50 backdrop-blur-sm border-t border-slate-700/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <p>© 2024 Gungnir SOC Platform - v2.3.1</p>
            <div className="flex items-center space-x-4">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                System Operational
              </span>
              <span>Last Update: {new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Gungnir;
