
import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

// Single page application with all components in one file
const Index = () => {
  // State for active view
  const [activeView, setActiveView] = useState<string>('landing');
  
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  // State for settings modal
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  
  // State for new habit modal
  const [newHabitModalOpen, setNewHabitModalOpen] = useState<boolean>(false);
  
  // State for notification permissions
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);

  // Current date
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const currentDate = today.toLocaleDateString('en-US', dateOptions);
  
  // State for habits
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'Drink Water',
      icon: '💧',
      target: 8,
      unit: 'glasses',
      color: 'blue',
      progress: 5,
      streakDays: 12,
      history: [
        { date: '2023-05-01', completed: 8 },
        { date: '2023-05-02', completed: 6 },
        { date: '2023-05-03', completed: 7 },
        { date: '2023-05-04', completed: 8 },
        { date: '2023-05-05', completed: 5 },
        { date: '2023-05-06', completed: 4 },
        { date: '2023-05-07', completed: 6 },
      ],
    },
    {
      id: '2',
      name: 'Sleep',
      icon: '😴',
      target: 8,
      unit: 'hours',
      color: 'purple',
      progress: 7.5,
      streakDays: 5,
      history: [
        { date: '2023-05-01', completed: 7 },
        { date: '2023-05-02', completed: 8 },
        { date: '2023-05-03', completed: 6.5 },
        { date: '2023-05-04', completed: 7 },
        { date: '2023-05-05', completed: 8 },
        { date: '2023-05-06', completed: 7.5 },
        { date: '2023-05-07', completed: 7.5 },
      ],
    },
    {
      id: '3',
      name: 'Screen Time',
      icon: '📱',
      target: 2,
      unit: 'hours',
      color: 'pink',
      progress: 3,
      streakDays: 0,
      history: [
        { date: '2023-05-01', completed: 3 },
        { date: '2023-05-02', completed: 2.5 },
        { date: '2023-05-03', completed: 2 },
        { date: '2023-05-04', completed: 3 },
        { date: '2023-05-05', completed: 4 },
        { date: '2023-05-06', completed: 3.5 },
        { date: '2023-05-07', completed: 3 },
      ],
    },
    {
      id: '4',
      name: 'Exercise',
      icon: '🏃',
      target: 30,
      unit: 'minutes',
      color: 'green',
      progress: 15,
      streakDays: 3,
      history: [
        { date: '2023-05-01', completed: 30 },
        { date: '2023-05-02', completed: 45 },
        { date: '2023-05-03', completed: 20 },
        { date: '2023-05-04', completed: 30 },
        { date: '2023-05-05', completed: 0 },
        { date: '2023-05-06', completed: 15 },
        { date: '2023-05-07', completed: 15 },
      ],
    },
    {
      id: '5',
      name: 'Meditation',
      icon: '🧘',
      target: 10,
      unit: 'minutes',
      color: 'teal',
      progress: 10,
      streakDays: 7,
      history: [
        { date: '2023-05-01', completed: 10 },
        { date: '2023-05-02', completed: 10 },
        { date: '2023-05-03', completed: 15 },
        { date: '2023-05-04', completed: 10 },
        { date: '2023-05-05', completed: 10 },
        { date: '2023-05-06', completed: 5 },
        { date: '2023-05-07', completed: 10 },
      ],
    },
    {
      id: '6',
      name: 'Read',
      icon: '📚',
      target: 20,
      unit: 'pages',
      color: 'orange',
      progress: 10,
      streakDays: 2,
      history: [
        { date: '2023-05-01', completed: 0 },
        { date: '2023-05-02', completed: 15 },
        { date: '2023-05-03', completed: 0 },
        { date: '2023-05-04', completed: 10 },
        { date: '2023-05-05', completed: 5 },
        { date: '2023-05-06', completed: 20 },
        { date: '2023-05-07', completed: 10 },
      ],
    }
  ]);
  
  // State for new habit form
  const [newHabit, setNewHabit] = useState<{
    name: string;
    icon: string;
    target: number;
    unit: string;
    color: string;
  }>({
    name: '',
    icon: '📝',
    target: 1,
    unit: 'times',
    color: 'blue',
  });
  
  // State for selected habit for detailed view
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  
  // Forms validation state
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    target?: string;
    unit?: string;
  }>({});
  
  // Check for notification permissions
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);
  
  // Request notification permissions
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
      
      if (permission === 'granted') {
        // Show a test notification
        new Notification('HabitFlow Notifications Enabled', {
          body: 'You will now receive reminders for your habits',
          icon: '/favicon.ico',
        });
      }
    }
  };
  
  // Handle updating a habit's progress
  const updateHabitProgress = (habitId: string, newProgress: number) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => 
        habit.id === habitId 
          ? { 
              ...habit, 
              progress: newProgress,
              streakDays: newProgress >= habit.target ? habit.streakDays + (habit.progress < habit.target ? 1 : 0) : 0,
              history: [
                ...habit.history,
                { date: new Date().toISOString().split('T')[0], completed: newProgress }
              ]
            } 
          : habit
      )
    );
  };
  
  // Handle creating a new habit
  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors: {name?: string; target?: string; unit?: string} = {};
    
    if (!newHabit.name.trim()) {
      errors.name = 'Habit name is required';
    }
    
    if (newHabit.target <= 0) {
      errors.target = 'Target must be greater than 0';
    }
    
    if (!newHabit.unit.trim()) {
      errors.unit = 'Unit is required';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Clear any previous errors
    setFormErrors({});
    
    // Create new habit
    const newHabitEntry: Habit = {
      id: Date.now().toString(),
      name: newHabit.name,
      icon: newHabit.icon,
      target: newHabit.target,
      unit: newHabit.unit,
      color: newHabit.color,
      progress: 0,
      streakDays: 0,
      history: Array(7).fill(0).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toISOString().split('T')[0],
          completed: 0,
        };
      }),
    };
    
    setHabits(prevHabits => [...prevHabits, newHabitEntry]);
    
    // Reset form and close modal
    setNewHabit({
      name: '',
      icon: '📝',
      target: 1,
      unit: 'times',
      color: 'blue',
    });
    setNewHabitModalOpen(false);
    
    // Show success toast
    showToast('Habit created successfully!');
  };
  
  // Handle deleting a habit
  const handleDeleteHabit = (habitId: string) => {
    setHabits(prevHabits => prevHabits.filter(habit => habit.id !== habitId));
    
    if (selectedHabit?.id === habitId) {
      setSelectedHabit(null);
      setActiveView('dashboard');
    }
    
    // Show success toast
    showToast('Habit deleted successfully!');
  };
  
  // Handle viewing habit details
  const viewHabitDetails = (habit: Habit) => {
    setSelectedHabit(habit);
    setActiveView('habitDetail');
  };
  
  // Toast notification system
  const [toast, setToast] = useState<{
    message: string;
    visible: boolean;
  }>({
    message: '',
    visible: false,
  });
  
  const showToast = (message: string) => {
    setToast({
      message,
      visible: true,
    });
    
    setTimeout(() => {
      setToast(prev => ({
        ...prev,
        visible: false,
      }));
    }, 3000);
  };
  
  // Calculate overall completion stats
  const completionStats = habits.reduce(
    (stats, habit) => {
      stats.total += 1;
      stats.completed += habit.progress >= habit.target ? 1 : 0;
      stats.progress += (habit.progress / habit.target > 1 ? 1 : habit.progress / habit.target) / habits.length;
      return stats;
    },
    { total: 0, completed: 0, progress: 0 }
  );
  
  // Get color class based on habit color
  const getColorClass = (color: string, type: 'bg' | 'text' | 'border' = 'bg') => {
    const colorMap: {[key: string]: {bg: string, text: string, border: string}} = {
      blue: {
        bg: 'bg-habit-blue',
        text: 'text-habit-blue',
        border: 'border-habit-blue',
      },
      purple: {
        bg: 'bg-habit-purple',
        text: 'text-habit-purple',
        border: 'border-habit-purple',
      },
      pink: {
        bg: 'bg-habit-pink',
        text: 'text-habit-pink',
        border: 'border-habit-pink',
      },
      orange: {
        bg: 'bg-habit-orange',
        text: 'text-habit-orange',
        border: 'border-habit-orange',
      },
      green: {
        bg: 'bg-habit-green',
        text: 'text-habit-green',
        border: 'border-habit-green',
      },
      teal: {
        bg: 'bg-habit-teal',
        text: 'text-habit-teal',
        border: 'border-habit-teal',
      },
      red: {
        bg: 'bg-habit-red',
        text: 'text-habit-red',
        border: 'border-habit-red',
      },
      yellow: {
        bg: 'bg-habit-yellow',
        text: 'text-habit-yellow',
        border: 'border-habit-yellow',
      },
    };
    
    return colorMap[color]?.[type] || colorMap.blue[type];
  };

  // Icons for different sections
  const IconDashboard = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );

  const IconAnalytics = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );

  const IconSettings = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
  
  const IconPlus = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
  
  const IconClose = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  const IconChevronLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );

  const IconChevronRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );

  const IconMenu = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );

  const IconTrash = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
  
  const IconSave = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
  
  const IconCalendar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  const IconFire = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );

  // Landing Page Component
  const LandingPage = () => {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-indigo-500 to-purple-700 text-white py-20 px-6 sm:px-12 md:py-28">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-reveal" style={{ animationDelay: '0.1s' }}>
                  Track Your Habits, Transform Your Life
                </h1>
                <p className="text-lg md:text-xl opacity-90 mb-6 animate-reveal" style={{ animationDelay: '0.3s' }}>
                  Monitor your daily habits, set goals, and build better routines with powerful analytics and streak tracking.
                </p>
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="bg-white text-purple-700 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 animate-reveal flex items-center"
                  style={{ animationDelay: '0.5s' }}
                >
                  Get Started
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
              
              <div className="md:w-1/2 animate-reveal" style={{ animationDelay: '0.7s' }}>
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Today's Progress</h3>
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{currentDate}</span>
                  </div>
                  
                  <div className="space-y-4">
                    {habits.slice(0, 3).map((habit) => (
                      <div key={habit.id} className="bg-white/10 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <span className="text-xl mr-2">{habit.icon}</span>
                            <span>{habit.name}</span>
                          </div>
                          <span>
                            {habit.progress}/{habit.target} {habit.unit}
                          </span>
                        </div>
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-white" 
                            style={{ width: `${Math.min(100, (habit.progress / habit.target) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Powerful Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18" />
                    <path d="M18 17V9" />
                    <path d="M13 17V5" />
                    <path d="M8 17v-3" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Detailed Analytics</h3>
                <p className="text-gray-600">Track your progress with beautiful charts and insightful metrics to stay motivated.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 15c3.5 6 10 6 13.5 0" />
                    <path d="M20 10c-2-2-6-4.5-10-4.5S2 8 0 10" />
                    <path d="M10 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Habit Streaks</h3>
                <p className="text-gray-600">Build momentum with streak counters that help you form lasting habits.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Reminders</h3>
                <p className="text-gray-600">Get gentle notifications to keep you on track with your daily habits.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our Users Say</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold">JD</div>
                  <div className="ml-4">
                    <h4 className="font-semibold">Jane Doe</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">"This app helped me build a consistent meditation practice. The streak counter keeps me motivated, and I love seeing my progress visualized in the charts."</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold">MS</div>
                  <div className="ml-4">
                    <h4 className="font-semibold">Mike Smith</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">"I've tried many habit trackers, but this one stands out with its clean design and powerful analytics. It's helped me increase my water intake and reduce screen time."</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Build Better Habits?</h2>
            <p className="text-xl opacity-90 mb-8">Start tracking your habits today and transform your daily routine.</p>
            <button
              onClick={() => setActiveView('dashboard')}
              className="bg-white text-purple-700 font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300"
            >
              Get Started Now
            </button>
          </div>
        </section>
        
        {/* Footer */}
        <Footer />
      </div>
    );
  };
  
  // Navbar Component
  const Navbar = () => {
    return (
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <span className="font-semibold text-xl text-gray-800">HabitFlow</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeView === 'dashboard' || activeView === 'habitDetail'
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveView('analytics')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeView === 'analytics'
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setSettingsOpen(true)}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-indigo-600"
              >
                Settings
              </button>
              <button
                onClick={() => setActiveView('landing')}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-indigo-600"
              >
                About
              </button>
              <button
                onClick={() => setNewHabitModalOpen(true)}
                className="ml-4 px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <div className="flex items-center">
                  <IconPlus />
                  <span className="ml-1">New Habit</span>
                </div>
              </button>
            </div>
            
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-600 focus:outline-none"
              >
                <IconMenu />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg z-50 absolute w-full">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button
                onClick={() => {
                  setActiveView('dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  activeView === 'dashboard' || activeView === 'habitDetail'
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveView('analytics');
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  activeView === 'analytics'
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => {
                  setSettingsOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600"
              >
                Settings
              </button>
              <button
                onClick={() => {
                  setActiveView('landing');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600"
              >
                About
              </button>
              <button
                onClick={() => {
                  setNewHabitModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <div className="flex items-center">
                  <IconPlus />
                  <span className="ml-1">New Habit</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </header>
    );
  };
  
  // Footer Component
  const Footer = () => {
    return (
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md flex items-center justify-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <span className="font-semibold text-xl text-white">HabitFlow</span>
              </div>
              <p className="mt-4 text-sm">
                Building better habits one day at a time with powerful tracking and analytics.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Quick Links</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <button onClick={() => setActiveView('dashboard')} className="text-sm text-gray-300 hover:text-white">Dashboard</button>
                </li>
                <li>
                  <button onClick={() => setActiveView('analytics')} className="text-sm text-gray-300 hover:text-white">Analytics</button>
                </li>
                <li>
                  <button onClick={() => setSettingsOpen(true)} className="text-sm text-gray-300 hover:text-white">Settings</button>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">About</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <button onClick={() => setActiveView('landing')} className="text-sm text-gray-300 hover:text-white">About Us</button>
                </li>
                <li>
                  <button className="text-sm text-gray-300 hover:text-white">Privacy Policy</button>
                </li>
                <li>
                  <button className="text-sm text-gray-300 hover:text-white">Terms of Service</button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-800 pt-8 text-center">
            <p className="text-sm">&copy; {new Date().getFullYear()} HabitFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  };
  
  // Dashboard Component
  const Dashboard = () => {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentDate}</h1>
          <p className="text-gray-600">Track your daily habits and keep up with your goals.</p>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-600">Daily Progress</h3>
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold">{Math.round(completionStats.progress * 100)}%</p>
              <p className="text-gray-500 mb-1">complete</p>
            </div>
            <div className="mt-4 h-2 bg-gray-100 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                style={{ width: `${completionStats.progress * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-600">Habits Completed</h3>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold">{completionStats.completed}</p>
              <p className="text-gray-500 mb-1">of {completionStats.total}</p>
            </div>
            <div className="mt-4 h-2 bg-gray-100 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full"
                style={{ width: `${(completionStats.completed / completionStats.total) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-600">Longest Streak</h3>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <IconFire className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold">{Math.max(...habits.map(h => h.streakDays))}</p>
              <p className="text-gray-500 mb-1">days</p>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Keep it up! You're building momentum.
            </div>
          </div>
        </div>
        
        {/* Habits list */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Your Habits</h2>
            <button
              onClick={() => setNewHabitModalOpen(true)}
              className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              <IconPlus />
              <span className="ml-1">New Habit</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map((habit, index) => (
              <div 
                key={habit.id} 
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow animate-scale-in p-5"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 ${getColorClass(habit.color, 'bg')} rounded-full flex items-center justify-center text-white shadow-sm`}>
                      <span className="text-lg">{habit.icon}</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-lg">{habit.name}</h3>
                      <p className="text-sm text-gray-500">
                        Target: {habit.target} {habit.unit}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => viewHabitDetails(habit)}
                    className="text-gray-400 hover:text-indigo-600"
                    aria-label="View details"
                  >
                    <IconChevronRight />
                  </button>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className={`font-medium ${habit.progress >= habit.target ? 'text-green-600' : 'text-gray-700'}`}>
                      {habit.progress} / {habit.target}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div 
                      className={`h-full ${getColorClass(habit.color, 'bg')} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, (habit.progress / habit.target) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <IconFire className={`h-5 w-5 ${habit.streakDays > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
                    <span className={`ml-1 text-sm font-medium ${habit.streakDays > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
                      {habit.streakDays} day{habit.streakDays !== 1 ? 's' : ''} streak
                    </span>
                  </div>
                  
                  <div className="flex">
                    <button
                      onClick={() => updateHabitProgress(habit.id, Math.max(0, habit.progress - (habit.unit === 'minutes' ? 5 : 1)))}
                      className="p-1 text-gray-400 hover:text-gray-700"
                      disabled={habit.progress <= 0}
                      aria-label="Decrease"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 12h8" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => updateHabitProgress(habit.id, habit.progress + (habit.unit === 'minutes' ? 5 : 1))}
                      className="p-1 ml-2 text-gray-400 hover:text-gray-700"
                      aria-label="Increase"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v8" />
                        <path d="M8 12h8" />
                      </svg>
                    </button>
                    
                    <input
                      type="range"
                      min="0"
                      max={habit.target * 2}
                      step={habit.unit === 'minutes' ? 5 : 1}
                      value={habit.progress}
                      onChange={(e) => updateHabitProgress(habit.id, Number(e.target.value))}
                      className="custom-slider ml-2 w-24"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Habit Detail Component
  const HabitDetail = () => {
    if (!selectedHabit) return null;
    
    // Reformat history data for charts
    const weeklyData = selectedHabit.history.map((entry) => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
      value: entry.completed,
    }));
    
    // Calculate weekly average
    const weeklyAverage = weeklyData.reduce((acc, entry) => acc + entry.value, 0) / weeklyData.length;
    
    // Format streak message
    const streakMessage = selectedHabit.streakDays > 0
      ? `${selectedHabit.streakDays} day streak! Keep it up!`
      : 'Start your streak today!';
    
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <button
          onClick={() => setActiveView('dashboard')}
          className="flex items-center text-gray-600 hover:text-indigo-600 mb-6"
        >
          <IconChevronLeft />
          <span className="ml-1">Back to Dashboard</span>
        </button>
        
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8 gap-4">
          <div className="flex items-center">
            <div className={`w-16 h-16 ${getColorClass(selectedHabit.color, 'bg')} rounded-full flex items-center justify-center text-white shadow-sm`}>
              <span className="text-2xl">{selectedHabit.icon}</span>
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">{selectedHabit.name}</h1>
              <p className="text-gray-600">
                Target: {selectedHabit.target} {selectedHabit.unit} daily
              </p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => handleDeleteHabit(selectedHabit.id)}
              className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 flex items-center"
            >
              <IconTrash />
              <span className="ml-2">Delete</span>
            </button>
          </div>
        </div>
        
        {/* Progress card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Today's Progress</h2>
          
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-600">Progress</span>
                <span className={`font-medium ${selectedHabit.progress >= selectedHabit.target ? 'text-green-600' : 'text-gray-700'}`}>
                  {selectedHabit.progress} / {selectedHabit.target} {selectedHabit.unit}
                </span>
              </div>
              
              <div className="h-3 bg-gray-100 rounded-full mb-4">
                <div 
                  className={`h-full ${getColorClass(selectedHabit.color, 'bg')} rounded-full transition-all duration-500`}
                  style={{ width: `${Math.min(100, (selectedHabit.progress / selectedHabit.target) * 100)}%` }}
                ></div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="range"
                  min="0"
                  max={selectedHabit.target * 2}
                  step={selectedHabit.unit === 'minutes' ? 5 : 1}
                  value={selectedHabit.progress}
                  onChange={(e) => updateHabitProgress(selectedHabit.id, Number(e.target.value))}
                  className="custom-slider flex-1 mr-4"
                />
                
                <div className="flex">
                  <button
                    onClick={() => updateHabitProgress(selectedHabit.id, Math.max(0, selectedHabit.progress - (selectedHabit.unit === 'minutes' ? 5 : 1)))}
                    className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                    disabled={selectedHabit.progress <= 0}
                    aria-label="Decrease"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 12h8" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => updateHabitProgress(selectedHabit.id, selectedHabit.progress + (selectedHabit.unit === 'minutes' ? 5 : 1))}
                    className="p-2 rounded-full ml-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                    aria-label="Increase"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v8" />
                      <path d="M8 12h8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="md:w-40 flex flex-row md:flex-col items-center justify-between md:justify-center gap-2">
              <div className={`relative w-16 h-16 md:w-24 md:h-24 rounded-full ${getColorClass(selectedHabit.color, 'border')} border-4 flex items-center justify-center animate-scale-in`}>
                {selectedHabit.streakDays > 0 && (
                  <div className={`absolute w-full h-full rounded-full ${getColorClass(selectedHabit.color, 'border')} border-4 animate-ping-slow`}></div>
                )}
                <div className="text-center">
                  <span className="block text-xl md:text-3xl font-bold">{selectedHabit.streakDays}</span>
                  <span className="text-xs md:text-sm text-gray-600">days</span>
                </div>
              </div>
              <p className="text-sm md:text-center text-gray-600">
                {streakMessage}
              </p>
            </div>
          </div>
        </div>
        
        {/* Weekly progress chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Weekly Progress</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="value" 
                    name={selectedHabit.unit}
                    fill={`hsl(var(--primary))`} 
                    radius={[4, 4, 0, 0]}
                  />
                  {/* Target reference line */}
                  <ReferenceLine y={selectedHabit.target} stroke="#FF8C00" strokeDasharray="3 3" label={{
                    position: 'right',
                    value: 'Target',
                    fill: '#FF8C00',
                    fontSize: 12
                  }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Stats & Insights</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Weekly Average:</span>
                <span className="font-medium">
                  {weeklyAverage.toFixed(1)} {selectedHabit.unit}/day
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Completion Rate:</span>
                <span className="font-medium">
                  {((selectedHabit.history.filter(entry => entry.completed >= selectedHabit.target).length / selectedHabit.history.length) * 100).toFixed(0)}%
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Best Day:</span>
                <span className="font-medium">
                  {weeklyData[selectedHabit.history.findIndex(entry => entry.completed === Math.max(...selectedHabit.history.map(e => e.completed)))].date} 
                  ({Math.max(...selectedHabit.history.map(e => e.completed))} {selectedHabit.unit})
                </span>
              </div>
              
              <div className="pt-4 mt-4 border-t">
                <h3 className="font-medium mb-2">Insight</h3>
                <p className="text-gray-600 text-sm">
                  {weeklyAverage >= selectedHabit.target 
                    ? `Great job! You're consistently meeting or exceeding your target of ${selectedHabit.target} ${selectedHabit.unit} per day.` 
                    : `You're averaging ${weeklyAverage.toFixed(1)} ${selectedHabit.unit}/day, which is ${((weeklyAverage / selectedHabit.target) * 100).toFixed(0)}% of your target. Keep working toward your goal!`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional stats */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Detailed Tracking</h2>
          
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name={`${selectedHabit.name} (${selectedHabit.unit})`} 
                  stroke={`hsl(var(--primary))`} 
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                />
                {/* Target reference line */}
                <ReferenceLine y={selectedHabit.target} stroke="#FF8C00" strokeDasharray="3 3" label={{
                  position: 'right',
                  value: 'Target',
                  fill: '#FF8C00',
                  fontSize: 12
                }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };
  
  // Analytics Component
  const Analytics = () => {
    // Generate data for charts
    const weeklyCompletionData = Array(7).fill(0).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const dateString = date.toISOString().split('T')[0];
      
      const dayCompletion = habits.reduce((acc, habit) => {
        const dayEntry = habit.history.find(h => h.date === dateString);
        if (dayEntry) {
          acc.total += 1;
          acc.completed += dayEntry.completed >= habit.target ? 1 : 0;
        }
        return acc;
      }, { total: 0, completed: 0 });
      
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: dayCompletion.completed,
        total: dayCompletion.total,
        rate: dayCompletion.total > 0 ? (dayCompletion.completed / dayCompletion.total) * 100 : 0,
      };
    });
    
    // Calculate habit success rates for pie chart
    const habitSuccessRates = habits.map(habit => {
      const completedDays = habit.history.filter(entry => entry.completed >= habit.target).length;
      const totalDays = habit.history.length;
      return {
        name: habit.name,
        value: totalDays > 0 ? (completedDays / totalDays) * 100 : 0,
        color: getColorClass(habit.color, 'bg'),
      };
    });
    
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Analytics</h1>
          <p className="text-gray-600">Track your progress and get insights into your habits.</p>
        </div>
        
        {/* Summary stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-600 mb-2">Total Habits</h3>
            <div className="text-3xl font-bold">{habits.length}</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-600 mb-2">Weekly Completion</h3>
            <div className="text-3xl font-bold">
              {((weeklyCompletionData.reduce((acc, day) => acc + day.rate, 0) / 7)).toFixed(0)}%
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-600 mb-2">Best Streak</h3>
            <div className="text-3xl font-bold">
              {Math.max(...habits.map(h => h.streakDays))} days
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-600 mb-2">Top Habit</h3>
            <div className="text-xl font-bold truncate">
              {
                habits.sort((a, b) => 
                  (b.history.filter(h => h.completed >= b.target).length / b.history.length) -
                  (a.history.filter(h => h.completed >= a.target).length / a.history.length)
                )[0]?.name || 'None'
              }
            </div>
          </div>
        </div>
        
        {/* Weekly overview chart */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Weekly Overview</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyCompletionData} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="completed" name="Habits Completed" fill="#8884d8" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="rate" name="Completion Rate %" stroke="#82ca9d" strokeWidth={3} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Habits comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Habit Success Rate</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={habitSuccessRates}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {habitSuccessRates.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color.replace('bg-', '')} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value.toFixed(0)}%`, 'Success Rate']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Habit Comparison</h2>
            <div className="space-y-4">
              {habits.map(habit => {
                const completionRate = habit.history.filter(entry => entry.completed >= habit.target).length / habit.history.length * 100;
                
                return (
                  <div key={habit.id} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{habit.icon}</span>
                        <span>{habit.name}</span>
                      </div>
                      <span className="text-sm font-medium">{completionRate.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div 
                        className={`h-full ${getColorClass(habit.color, 'bg')} rounded-full`} 
                        style={{ width: `${completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Insights */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Insights & Recommendations</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Weekly Trends</h3>
              <p className="text-blue-700">
                {weeklyCompletionData[6].rate > weeklyCompletionData[0].rate
                  ? 'Your completion rate is improving this week. Keep up the momentum!'
                  : weeklyCompletionData[6].rate < weeklyCompletionData[0].rate
                    ? 'Your completion rate has decreased this week. Try setting reminders to get back on track.'
                    : 'Your completion rate has been consistent this week.'
                }
              </p>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Top Performing Habit</h3>
              <p className="text-green-700">
                {habitSuccessRates.sort((a, b) => b.value - a.value)[0]?.value > 0
                  ? `"${habitSuccessRates.sort((a, b) => b.value - a.value)[0]?.name}" is your most consistent habit with a ${habitSuccessRates.sort((a, b) => b.value - a.value)[0]?.value.toFixed(0)}% success rate.`
                  : 'Start building consistency with your habits to see which ones you excel at.'
                }
              </p>
            </div>
            
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
              <h3 className="font-semibold text-amber-800 mb-2">Needs Improvement</h3>
              <p className="text-amber-700">
                {habitSuccessRates.sort((a, b) => a.value - b.value)[0]?.value < 50
                  ? `"${habitSuccessRates.sort((a, b) => a.value - b.value)[0]?.name}" needs attention with only a ${habitSuccessRates.sort((a, b) => a.value - b.value)[0]?.value.toFixed(0)}% success rate.`
                  : 'All your habits are performing well with at least 50% success rates!'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Settings Modal Component
  const SettingsModal = () => {
    if (!settingsOpen) return null;
    
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" onClick={() => setSettingsOpen(false)}></div>
          
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Settings</h2>
              <button
                onClick={() => setSettingsOpen(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Close"
              >
                <IconClose />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Notifications</h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Habit Reminders</p>
                    <p className="text-sm text-gray-600">Get notified about your habits</p>
                  </div>
                  <button
                    onClick={requestNotificationPermission}
                    className={`w-10 h-5 rounded-full focus:outline-none ${
                      notificationsEnabled ? 'bg-indigo-600' : 'bg-gray-300'
                    } relative`}
                    aria-pressed={notificationsEnabled}
                  >
                    <span className="sr-only">Enable notifications</span>
                    <div
                      className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform transform ${
                        notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    ></div>
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Theme</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="border-2 border-indigo-600 p-3 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white border"></div>
                    <span className="ml-2">Light</span>
                  </button>
                  <button className="border border-gray-300 p-3 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-gray-900 border"></div>
                    <span className="ml-2">Dark</span>
                  </button>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-300">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Account</h3>
                <button className="w-full py-2 px-4 rounded-lg border border-gray-300 text-center hover:bg-gray-50">
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // New Habit Modal Component
  const NewHabitModal = () => {
    if (!newHabitModalOpen) return null;
    
    const habitIcons = ['📝', '💧', '😴', '📱', '🏃', '🧘', '📚', '🥗', '🎸', '💪', '🧠', '🧹'];
    const habitColors = ['blue', 'purple', 'pink', 'orange', 'green', 'teal', 'red', 'yellow'];
    
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" onClick={() => setNewHabitModalOpen(false)}></div>
          
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Create New Habit</h2>
              <button
                onClick={() => setNewHabitModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Close"
              >
                <IconClose />
              </button>
            </div>
            
            <form onSubmit={handleCreateHabit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="habit-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Habit Name
                  </label>
                  <input
                    type="text"
                    id="habit-name"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-300 focus:border-indigo-300 ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Drink Water"
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {habitIcons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        className={`flex items-center justify-center h-10 rounded-md text-xl ${
                          newHabit.icon === icon ? 'bg-indigo-100 border-2 border-indigo-500' : 'border border-gray-300'
                        }`}
                        onClick={() => setNewHabit({ ...newHabit, icon })}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label htmlFor="habit-target" className="block text-sm font-medium text-gray-700 mb-1">
                      Daily Target
                    </label>
                    <input
                      type="number"
                      id="habit-target"
                      min="1"
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-300 focus:border-indigo-300 ${
                        formErrors.target ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 8"
                      value={newHabit.target}
                      onChange={(e) => setNewHabit({ ...newHabit, target: Number(e.target.value) })}
                    />
                    {formErrors.target && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.target}</p>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <label htmlFor="habit-unit" className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <input
                      type="text"
                      id="habit-unit"
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-indigo-300 focus:border-indigo-300 ${
                        formErrors.unit ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., glasses"
                      value={newHabit.unit}
                      onChange={(e) => setNewHabit({ ...newHabit, unit: e.target.value })}
                    />
                    {formErrors.unit && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.unit}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <div className="grid grid-cols-8 gap-2">
                    {habitColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`h-10 rounded-md border-2 ${getColorClass(color, 'bg')} ${
                          newHabit.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                        }`}
                        onClick={() => setNewHabit({ ...newHabit, color })}
                        aria-label={`Select ${color} color`}
                      ></button>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-300 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setNewHabitModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create Habit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };
  
  // Toast notification
  const Toast = () => {
    if (!toast.visible) return null;
    
    return (
      <div className={`fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300 ${
        toast.visible ? 'opacity-100' : 'opacity-0'
      }`}>
        {toast.message}
      </div>
    );
  };
  
  // Main layout
  return (
    <div className="min-h-screen flex flex-col">
      {activeView !== 'landing' && <Navbar />}
      
      <main className="flex-grow">
        {activeView === 'landing' && <LandingPage />}
        {activeView === 'dashboard' && <Dashboard />}
        {activeView === 'analytics' && <Analytics />}
        {activeView === 'habitDetail' && <HabitDetail />}
      </main>
      
      {activeView !== 'landing' && <Footer />}
      
      <SettingsModal />
      <NewHabitModal />
      <Toast />
    </div>
  );
};

// Type definitions
interface HabitHistory {
  date: string;
  completed: number;
}

interface Habit {
  id: string;
  name: string;
  icon: string;
  target: number;
  unit: string;
  color: string;
  progress: number;
  streakDays: number;
  history: HabitHistory[];
}

// Define ReferenceLine component for Recharts
const ReferenceLine = ({
  y,
  stroke,
  strokeDasharray,
  label,
}: {
  y: number;
  stroke: string;
  strokeDasharray: string;
  label?: {
    position: string;
    value: string;
    fill: string;
    fontSize: number;
  };
}) => {
  return null; // This is a mock component that Recharts will replace with its actual implementation
};

export default Index;
