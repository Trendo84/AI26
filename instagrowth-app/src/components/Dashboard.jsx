import { Users, Heart, Eye, Image, TrendingUp, Edit, Hash, Clock } from 'lucide-react';

function Dashboard({ setActiveView }) {
  const stats = [
    { 
      label: 'Total Followers', 
      value: '45.2K', 
      change: '+12.5%', 
      positive: true, 
      icon: Users,
      color: 'green'
    },
    { 
      label: 'Engagement Rate', 
      value: '8.4%', 
      change: '+2.3%', 
      positive: true, 
      icon: Heart,
      color: 'pink'
    },
    { 
      label: 'Avg. Reach', 
      value: '12.3K', 
      change: '+8.1%', 
      positive: true, 
      icon: Eye,
      color: 'blue'
    },
    { 
      label: 'Posts This Week', 
      value: '7', 
      change: 'On track', 
      positive: true, 
      icon: Image,
      color: 'purple'
    },
  ];

  const quickActions = [
    {
      title: 'Generate Caption',
      description: 'Create engaging captions with AI',
      icon: Edit,
      gradient: 'from-purple-500 to-blue-500',
      view: 'captions'
    },
    {
      title: 'Find Hashtags',
      description: 'Research trending hashtags',
      icon: Hash,
      gradient: 'from-pink-500 to-red-500',
      view: 'hashtags'
    },
    {
      title: 'View Analytics',
      description: 'Track your performance',
      icon: TrendingUp,
      gradient: 'from-orange-500 to-yellow-500',
      view: 'analytics'
    },
  ];

  const recentActivity = [
    {
      action: 'Generated caption',
      description: 'For your coffee shop photo',
      time: '2 hours ago',
      icon: Edit
    },
    {
      action: 'Researched hashtags',
      description: 'For #coffeelover niche',
      time: '5 hours ago',
      icon: Hash
    },
    {
      action: 'Analyzed best time',
      description: 'Optimal posting: 6 PM',
      time: 'Yesterday',
      icon: Clock
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Welcome back, Ivan! 👋</h1>
        <p className="text-gray-600">Here's what's happening with your Instagram growth</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <StatCard key={idx} stat={stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map((action, idx) => (
            <QuickActionCard 
              key={idx} 
              action={action}
              onClick={() => setActiveView(action.view)}
            />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, idx) => (
            <ActivityItem key={idx} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ stat }) {
  const Icon = stat.icon;
  const colorClasses = {
    green: 'bg-green-100 text-green-600',
    pink: 'bg-pink-100 text-pink-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[stat.color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
      <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
      <div className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
        {stat.change}
      </div>
    </div>
  );
}

function QuickActionCard({ action, onClick }) {
  const Icon = action.icon;
  
  return (
    <div 
      onClick={onClick}
      className="tool-card bg-white rounded-xl shadow-sm p-6 cursor-pointer border border-gray-100"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-bold text-gray-900 mb-2">{action.title}</h3>
      <p className="text-sm text-gray-600">{action.description}</p>
    </div>
  );
}

function ActivityItem({ activity }) {
  const Icon = activity.icon;
  
  return (
    <div className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-0">
      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-purple-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900">{activity.action}</p>
        <p className="text-sm text-gray-600">{activity.description}</p>
      </div>
      <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
    </div>
  );
}

export default Dashboard;
