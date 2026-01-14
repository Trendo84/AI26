const { useState, useEffect } = React;

// API Configuration
const REPLICATE_API_TOKEN = 'r8_UNy2qX51jGq4NJ9nDRmpxutypOJ8X2w3rUX0h';
const REPLICATE_API_URL = 'https://api.replicate.com/v1/predictions';

// Use Mixtral for caption generation (fast and cost-effective)
const MIXTRAL_MODEL = 'mistralai/mixtral-8x7b-instruct-v0.1:7b3212fbaf88310cfef07a061ce94224e82efc8403c26fc67e8f6c065de51f21';

// Main App Component
function App() {
    const [activeView, setActiveView] = useState('dashboard');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState({
        name: 'Ivan',
        instagram: '@cat.z0ne',
        avatar: 'https://ui-avatars.com/api/?name=Ivan&background=667eea&color=fff',
        plan: 'Pro',
        captionsUsed: 75,
        captionsLimit: 999999
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <header className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center space-x-2">
                        <div className="instagram-gradient w-8 h-8 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                        </div>
                        <span className="font-bold text-gray-900">InstaGrowth</span>
                    </div>
                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </header>

            <div className="flex h-screen md:h-auto">
                {/* Sidebar - Desktop */}
                <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200 fixed h-screen">
                    <div className="p-6">
                        <div className="flex items-center space-x-2 mb-8">
                            <div className="instagram-gradient w-10 h-10 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-gray-900">InstaGrowth</span>
                        </div>

                        <nav className="space-y-2">
                            <NavItem 
                                icon="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                label="Dashboard"
                                active={activeView === 'dashboard'}
                                onClick={() => setActiveView('dashboard')}
                            />
                            <NavItem 
                                icon="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                label="Caption Generator"
                                active={activeView === 'captions'}
                                onClick={() => setActiveView('captions')}
                            />
                            <NavItem 
                                icon="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                                label="Hashtag Research"
                                active={activeView === 'hashtags'}
                                onClick={() => setActiveView('hashtags')}
                            />
                            <NavItem 
                                icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                label="Analytics"
                                active={activeView === 'analytics'}
                                onClick={() => setActiveView('analytics')}
                            />
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
                                <span className="text-xs text-purple-600">{user.captionsUsed}/∞</span>
                            </div>
                            <div className="w-full bg-purple-200 rounded-full h-1.5">
                                <div className="bg-purple-600 h-1.5 rounded-full" style={{width: '15%'}}></div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Mobile Sidebar */}
                <aside className={`md:hidden fixed inset-0 z-50 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
                    <div className="absolute inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileMenuOpen(false)}></div>
                    <div className="relative w-64 h-full bg-white">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center space-x-2">
                                    <div className="instagram-gradient w-8 h-8 rounded-lg"></div>
                                    <span className="font-bold text-gray-900">InstaGrowth</span>
                                </div>
                                <button onClick={() => setMobileMenuOpen(false)}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <nav className="space-y-2">
                                <NavItem 
                                    icon="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    label="Dashboard"
                                    active={activeView === 'dashboard'}
                                    onClick={() => {setActiveView('dashboard'); setMobileMenuOpen(false);}}
                                />
                                <NavItem 
                                    icon="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    label="Caption Generator"
                                    active={activeView === 'captions'}
                                    onClick={() => {setActiveView('captions'); setMobileMenuOpen(false);}}
                                />
                                <NavItem 
                                    icon="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                                    label="Hashtag Research"
                                    active={activeView === 'hashtags'}
                                    onClick={() => {setActiveView('hashtags'); setMobileMenuOpen(false);}}
                                />
                                <NavItem 
                                    icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    label="Analytics"
                                    active={activeView === 'analytics'}
                                    onClick={() => {setActiveView('analytics'); setMobileMenuOpen(false);}}
                                />
                            </nav>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white">
                            <div className="flex items-center space-x-3 mb-4">
                                <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full" />
                                <div className="flex-1">
                                    <div className="font-semibold text-gray-900">{user.name}</div>
                                    <div className="text-sm text-gray-500">{user.instagram}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 md:ml-64 overflow-auto">
                    <div className="p-4 md:p-8">
                        {activeView === 'dashboard' && <DashboardView setActiveView={setActiveView} />}
                        {activeView === 'captions' && <CaptionGenerator />}
                        {activeView === 'hashtags' && <HashtagResearch />}
                        {activeView === 'analytics' && <AnalyticsView />}
                    </div>
                </main>
            </div>
        </div>
    );
}

// Navigation Item Component
function NavItem({ icon, label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                active 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
            }`}
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
            </svg>
            <span className="font-medium">{label}</span>
        </button>
    );
}

// Dashboard View
function DashboardView({ setActiveView }) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Welcome back, Ivan! 👋</h1>
                <p className="text-gray-600">Here's what's happening with your Instagram growth</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    label="Total Followers"
                    value="100K"
                    change="+12.5%"
                    positive={true}
                    icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
                <StatCard 
                    label="Engagement Rate"
                    value="8.4%"
                    change="+2.3%"
                    positive={true}
                    icon="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
                <StatCard 
                    label="Avg. Reach"
                    value="12.3K"
                    change="+8.1%"
                    positive={true}
                    icon="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
                <StatCard 
                    label="Posts This Week"
                    value="7"
                    change="On track"
                    positive={true}
                    icon="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    <QuickActionCard 
                        title="Generate Caption"
                        description="Create engaging captions with AI"
                        icon="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        gradient="from-purple-500 to-blue-500"
                        onClick={() => setActiveView('captions')}
                    />
                    <QuickActionCard 
                        title="Find Hashtags"
                        description="Research trending hashtags"
                        icon="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                        gradient="from-pink-500 to-red-500"
                        onClick={() => setActiveView('hashtags')}
                    />
                    <QuickActionCard 
                        title="View Analytics"
                        description="Track your performance"
                        icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        gradient="from-orange-500 to-yellow-500"
                        onClick={() => setActiveView('analytics')}
                    />
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    <ActivityItem 
                        action="Generated caption"
                        description="For your cat photo post"
                        time="2 hours ago"
                        icon="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                    <ActivityItem 
                        action="Researched hashtags"
                        description="For #catsofinstagram niche"
                        time="5 hours ago"
                        icon="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                    />
                    <ActivityItem 
                        action="Analyzed best time"
                        description="Optimal posting: 6 PM"
                        time="Yesterday"
                        icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, change, positive, icon }) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${positive ? 'bg-green-100' : 'bg-red-100'}`}>
                    <svg className={`w-5 h-5 ${positive ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                    </svg>
                </div>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{value}</div>
            <div className="text-sm text-gray-600 mb-2">{label}</div>
            <div className={`text-sm font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>
                {change}
            </div>
        </div>
    );
}

function QuickActionCard({ title, description, icon, gradient, onClick }) {
    return (
        <div onClick={onClick} className="tool-card bg-white rounded-xl shadow-sm p-6 cursor-pointer border border-gray-100">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    );
}

function ActivityItem({ action, description, time, icon }) {
    return (
        <div className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-0">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                </svg>
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{action}</p>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">{time}</span>
        </div>
    );
}

// Caption Generator View with Real Replicate API
function CaptionGenerator() {
    const [description, setDescription] = useState('');
    const [tone, setTone] = useState('inspirational');
    const [loading, setLoading] = useState(false);
    const [captions, setCaptions] = useState([]);
    const [error, setError] = useState(null);

    const tones = [
        { id: 'inspirational', label: '✨ Inspirational', emoji: '✨' },
        { id: 'funny', label: '😄 Funny', emoji: '😄' },
        { id: 'educational', label: '📚 Educational', emoji: '📚' },
        { id: 'engaging', label: '💬 Engaging', emoji: '💬' }
    ];

    const generateCaptions = async () => {
        if (!description.trim()) return;
        
        setLoading(true);
        setError(null);
        setCaptions([]);

        try {
            // Create prompt based on tone
            const prompt = `Generate 3 Instagram captions with a ${tone} tone for the following post description: "${description}". 

Requirements:
- Each caption should be engaging and natural
- Include relevant emojis
- Keep each caption between 100-200 characters
- Add a call-to-action or question to encourage engagement
- Make them Instagram-friendly

Format your response exactly like this (separated by triple dashes):
Caption 1 text here
---
Caption 2 text here
---
Caption 3 text here`;

            // Call Replicate API
            const response = await fetch(REPLICATE_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${REPLICATE_API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    version: MIXTRAL_MODEL.split(':')[1],
                    input: {
                        prompt: prompt,
                        max_new_tokens: 500,
                        temperature: 0.8,
                        top_p: 0.9,
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const prediction = await response.json();
            
            // Poll for completion
            let result = prediction;
            while (result.status !== 'succeeded' && result.status !== 'failed') {
                await new Promise(resolve => setTimeout(resolve, 1000));
                const pollResponse = await fetch(
                    `https://api.replicate.com/v1/predictions/${result.id}`,
                    {
                        headers: {
                            'Authorization': `Token ${REPLICATE_API_TOKEN}`,
                        }
                    }
                );
                result = await pollResponse.json();
            }

            if (result.status === 'failed') {
                throw new Error('Caption generation failed');
            }

            // Parse the output
            const output = result.output.join('');
            const captionTexts = output.split('---').map(c => c.trim()).filter(c => c);
            
            // Create caption objects
            const generatedCaptions = captionTexts.slice(0, 3).map(text => ({
                text: text,
                length: text.length
            }));

            // If we didn't get enough captions, add fallback
            if (generatedCaptions.length === 0) {
                throw new Error('No captions were generated');
            }

            setCaptions(generatedCaptions);
        } catch (err) {
            console.error('Error generating captions:', err);
            setError(err.message || 'Failed to generate captions. Please try again.');
            
            // Fallback to example captions on error
            setCaptions([
                {
                    text: `${tones.find(t => t.id === tone).emoji} ${description} ✨ This is what life's all about. What do you think? 💫`,
                    length: 145
                },
                {
                    text: `Living for moments like these ${tones.find(t => t.id === tone).emoji} ${description} Drop a ❤️ if you agree!`,
                    length: 128
                },
                {
                    text: `Current mood: ${description} ${tones.find(t => t.id === tone).emoji} Who else can relate? Let me know! 👇`,
                    length: 132
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">AI Caption Generator</h1>
                <p className="text-gray-600">Create engaging Instagram captions powered by AI</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    </svg>
                    <div>
                        <p className="text-sm font-medium text-red-800">{error}</p>
                        <p className="text-xs text-red-600 mt-1">Showing example captions instead</p>
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Input Side */}
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Describe your post
                        </label>
                        <textarea 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                            placeholder="Example: A photo of my adorable cat lounging in the sun by the window..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Select tone
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {tones.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setTone(t.id)}
                                    className={`px-4 py-3 rounded-lg font-medium transition ${
                                        tone === t.id
                                            ? 'border-2 border-purple-500 bg-purple-50 text-purple-700'
                                            : 'border border-gray-300 text-gray-700 hover:border-purple-500 hover:bg-purple-50'
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={generateCaptions}
                        disabled={loading || !description.trim()}
                        className="w-full instagram-gradient text-white py-4 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating with AI...
                            </span>
                        ) : 'Generate Captions'}
                    </button>

                    <div className="text-xs text-gray-500 text-center">
                        Powered by Replicate AI • Mixtral 8x7B
                    </div>
                </div>

                {/* Output Side */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Generated Captions</h3>
                    
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            ))}
                        </div>
                    ) : captions.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <p className="text-gray-500">Your AI-generated captions will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {captions.map((caption, idx) => (
                                <CaptionCard key={idx} caption={caption} index={idx} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function CaptionCard({ caption, index }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(caption.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="caption-output bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-purple-700">Caption {index + 1}</span>
            </div>
            <p className="text-gray-800 text-sm leading-relaxed mb-3">{caption.text}</p>
            <div className="flex items-center justify-between pt-3 border-t border-purple-200">
                <span className="text-xs text-purple-600 font-medium">{caption.length} characters</span>
                <button 
                    onClick={copyToClipboard}
                    className="text-xs text-purple-600 font-semibold hover:text-purple-800 flex items-center"
                >
                    {copied ? (
                        <>
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                            Copied!
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

// Hashtag Research View
function HashtagResearch() {
    const [niche, setNiche] = useState('');
    const [loading, setLoading] = useState(false);
    const [hashtags, setHashtags] = useState([]);

    const searchHashtags = async () => {
        if (!niche.trim()) return;
        
        setLoading(true);
        
        // Simulate API call - in production this would call Replicate or a hashtag API
        setTimeout(() => {
            const mockHashtags = [
                { tag: 'catsofinstagram', posts: '250M', competition: 'high', relevant: 95 },
                { tag: 'catstagram', posts: '150M', competition: 'high', relevant: 98 },
                { tag: 'cats_of_world', posts: '45M', competition: 'medium', relevant: 92 },
                { tag: 'catlover', posts: '120M', competition: 'high', relevant: 90 },
                { tag: 'catlife', posts: '80M', competition: 'medium', relevant: 88 },
                { tag: 'catoftheday', posts: '95M', competition: 'high', relevant: 85 },
                { tag: 'instacats', posts: '70M', competition: 'medium', relevant: 93 },
                { tag: 'meow', posts: '180M', competition: 'high', relevant: 75 },
                { tag: 'kitty', posts: '140M', competition: 'high', relevant: 80 },
                { tag: 'catsagram', posts: '60M', competition: 'medium', relevant: 94 },
            ];
            
            setHashtags(mockHashtags);
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Hashtag Research</h1>
                <p className="text-gray-600">Find the perfect hashtags for your niche</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex gap-4 mb-6">
                    <input
                        type="text"
                        value={niche}
                        onChange={(e) => setNiche(e.target.value)}
                        placeholder="Enter your niche (e.g., cats, fitness, travel)"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && searchHashtags()}
                    />
                    <button
                        onClick={searchHashtags}
                        disabled={loading || !niche.trim()}
                        className="px-8 py-3 instagram-gradient text-white rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50"
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : hashtags.length > 0 ? (
                    <div className="space-y-3">
                        {hashtags.map((hashtag, idx) => (
                            <HashtagCard key={idx} hashtag={hashtag} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        <p className="text-gray-500">Search for hashtags to get started</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function HashtagCard({ hashtag }) {
    const [copied, setCopied] = useState(false);

    const getCompetitionColor = (level) => {
        switch(level) {
            case 'high': return 'text-red-600 bg-red-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'low': return 'text-green-600 bg-green-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const copyHashtag = () => {
        navigator.clipboard.writeText(`#${hashtag.tag}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200 flex items-center justify-between">
            <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                    <span className="font-bold text-purple-700">#{hashtag.tag}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCompetitionColor(hashtag.competition)}`}>
                        {hashtag.competition}
                    </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{hashtag.posts} posts</span>
                    <span>•</span>
                    <span>{hashtag.relevant}% relevant</span>
                </div>
            </div>
            <button
                onClick={copyHashtag}
                className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition"
            >
                {copied ? '✓ Copied' : 'Copy'}
            </button>
        </div>
    );
}

// Analytics View
function AnalyticsView() {
    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
                <p className="text-gray-600">Track your Instagram performance</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Follower Growth</h3>
                    <div className="h-64 flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
                        <p className="text-gray-500">Chart coming soon</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Engagement Rate</h3>
                    <div className="h-64 flex items-center justify-center bg-gradient-to-br from-pink-50 to-red-50 rounded-lg">
                        <p className="text-gray-500">Chart coming soon</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Top Posts</h3>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg"></div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">Cat in sunbeam</p>
                                <p className="text-sm text-gray-500">12.5K likes • 342 comments</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-400 rounded-lg"></div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">Playful kitten</p>
                                <p className="text-sm text-gray-500">10.8K likes • 289 comments</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Best Time to Post</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Monday - Friday</span>
                                <span className="font-semibold text-purple-600">6:00 PM</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-purple-600 h-2 rounded-full" style={{width: '75%'}}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Saturday - Sunday</span>
                                <span className="font-semibold text-pink-600">11:00 AM</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-pink-600 h-2 rounded-full" style={{width: '65%'}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Render App
ReactDOM.render(<App />, document.getElementById('root'));
