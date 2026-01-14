import { useState } from 'react';
import { Menu, X, Instagram, Home, Edit, Hash, BarChart3, Calendar, TrendingUp } from 'lucide-react';
import Dashboard from './components/Dashboard';
import CaptionGenerator from './components/CaptionGenerator';
import HashtagResearch from './components/HashtagResearch';
import Analytics from './components/Analytics';
import ContentCalendar from './components/ContentCalendar';
import Competitors from './components/Competitors';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user] = useState({
    name: 'Ivan',
    instagram: '@your_account',
    avatar: 'https://ui-avatars.com/api/?name=Ivan&background=667eea&color=fff',
    plan: 'Pro'
  });

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'captions', label: 'Caption Generator', icon: Edit },
    { id: 'hashtags', label: 'Hashtag Research', icon: Hash },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'calendar', label: 'Content Calendar', icon: Calendar },
    { id: 'competitors', label: 'Competitors', icon: TrendingUp },
  ];

  const NavItem = ({ item, onClick }) => {
    const Icon = item.icon;
    return (
      <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
          activeView === item.id
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{item.label}</span>
      </button>
    );
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard setActiveView={setActiveView} />;
      case 'captions':
        return <CaptionGenerator />;
      case 'hashtags':
        return <HashtagResearch />;
      case 'analytics':
        return <Analytics />;
      case 'calendar':
        return <ContentCalendar />;
      case 'competitors':
        return <Competitors />;
      default:
        return <Dashboard setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <div className="instagram-gradient w-8 h-8 rounded-lg flex items-center justify-center">
              <Instagram className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">InstaGrowth</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      <div className="flex h-screen md:h-auto">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200 fixed h-screen">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-8">
              <div className="instagram-gradient w-10 h-10 rounded-lg flex items-center justify-center">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">InstaGrowth</span>
            </div>

            <nav className="space-y-2">
              {navigation.map(item => (
                <NavItem 
                  key={item.id}
                  item={item}
                  onClick={() => setActiveView(item.id)}
                />
              ))}
            </nav>
          </div>

          <div className="mt-auto p-6 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 truncate">{user.name}</div>
                <div className="text-sm text-gray-500 truncate">{user.instagram}</div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-purple-700">{user.plan} Plan</span>
                <span className="text-xs text-purple-600">75/∞</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-1.5">
                <div className="bg-purple-600 h-1.5 rounded-full" style={{width: '75%'}}></div>
              </div>
            </div>
            <button className="w-full text-sm text-gray-600 hover:text-gray-900 transition">
              Settings & Billing
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <aside className="md:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="relative w-64 h-full bg-white">
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-2">
                    <div className="instagram-gradient w-8 h-8 rounded-lg flex items-center justify-center">
                      <Instagram className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-gray-900">InstaGrowth</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {navigation.map(item => (
                    <NavItem 
                      key={item.id}
                      item={item}
                      onClick={() => {
                        setActiveView(item.id);
                        setMobileMenuOpen(false);
                      }}
                    />
                  ))}
                </nav>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-3">
                  <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.instagram}</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 md:ml-64 overflow-auto">
          <div className="p-4 md:p-8">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
