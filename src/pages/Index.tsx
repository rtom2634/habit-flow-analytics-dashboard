
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Moon, Sun, Menu, X, Bell, Settings, ChevronRight, User, Home, BarChart3, Calendar, Droplets, Coffee, Smartphone, Moon as MoonIcon, Zap, Info, Award, TrendingUp, Heart, Check, AlertCircle } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

// Mock data for habits
const mockHabits = [
  { id: 1, name: "Drink Water", icon: "Droplets", goal: 8, unit: "glasses", color: "habit-blue", data: [6, 7, 8, 6, 8, 7, 8], streak: 5 },
  { id: 2, name: "Sleep", icon: "Moon", goal: 8, unit: "hours", color: "habit-purple", data: [7, 6.5, 7, 8, 7.5, 8, 6], streak: 7 },
  { id: 3, name: "Exercise", icon: "Zap", goal: 30, unit: "minutes", color: "habit-green", data: [20, 30, 30, 20, 0, 30, 45], streak: 2 },
  { id: 4, name: "Read", icon: "Book", goal: 30, unit: "minutes", color: "habit-orange", data: [15, 30, 20, 30, 45, 0, 30], streak: 0 },
  { id: 5, name: "Meditate", icon: "Heart", goal: 10, unit: "minutes", color: "habit-teal", data: [10, 10, 5, 10, 10, 0, 10], streak: 0 },
  { id: 6, name: "Screen Time", icon: "Smartphone", goal: 120, unit: "minutes", color: "habit-red", data: [180, 120, 90, 150, 120, 100, 130], streak: 3 },
  { id: 7, name: "Coffee", icon: "Coffee", goal: 2, unit: "cups", color: "habit-yellow", data: [3, 2, 2, 3, 2, 1, 2], streak: 4 }
];

// Days data for charts
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Transform data for charts
const sleepData = days.map((day, index) => ({
  name: day,
  hours: mockHabits.find(h => h.name === "Sleep")?.data[index] || 0
}));

const waterData = days.map((day, index) => ({
  name: day,
  glasses: mockHabits.find(h => h.name === "Drink Water")?.data[index] || 0
}));

const screenTimeData = days.map((day, index) => ({
  name: day,
  minutes: mockHabits.find(h => h.name === "Screen Time")?.data[index] || 0
}));

// Mock data for dashboard stats
const weeklyStats = [
  { name: "Sleep Average", value: "7.3 hrs", change: "+0.5", isPositive: true },
  { name: "Water Intake", value: "7.1 glasses", change: "-0.2", isPositive: false },
  { name: "Screen Time", value: "127 mins", change: "-15", isPositive: true },
  { name: "Exercise", value: "25 mins", change: "+5", isPositive: true }
];

// Overall habit completion rate
const completionData = [
  { name: "Complete", value: 75 },
  { name: "Incomplete", value: 25 }
];

const COLORS = ["#8B5CF6", "#E4E4E7"];

// Progress calculation helper
const calculateProgress = (current: number, goal: number) => {
  return Math.min(Math.round((current / goal) * 100), 100);
};

// Mock data for motivation quotes
const motivationalQuotes = [
  "The only way to do great work is to love what you do.",
  "It's not about being the best. It's about being better than you were yesterday.",
  "Success is not final, failure is not fatal: It is the courage to continue that counts.",
  "Your habits today determine your future tomorrow."
];

const getRandomQuote = () => {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
};

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label, unit }: { active?: boolean, payload?: any[], label?: string, unit: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-medium">{`${label}`}</p>
        <p className="text-sm text-primary">{`${payload[0].value} ${unit}`}</p>
      </div>
    );
  }
  return null;
};

// Execute habit data
const executeHabit = (habit: typeof mockHabits[0], value: number) => {
  // Update the current day's value
  const today = new Date().getDay();
  const adjustedIndex = today === 0 ? 6 : today - 1; // Convert to 0-6 where 0 is Monday
  habit.data[adjustedIndex] = value;
  
  // Check goal completion for streak
  if (habit.name === "Screen Time") {
    // For screen time, less is better
    if (value <= habit.goal) {
      habit.streak += 1;
    } else {
      habit.streak = 0;
    }
  } else {
    // For other habits, more or equal is better
    if (value >= habit.goal) {
      habit.streak += 1;
    } else {
      habit.streak = 0;
    }
  }
  
  return habit;
};

// Format date helper
const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
};

const habitIcons: Record<string, React.ReactNode> = {
  Droplets: <Droplets className="h-5 w-5" />,
  Moon: <MoonIcon className="h-5 w-5" />,
  Zap: <Zap className="h-5 w-5" />,
  Book: <Info className="h-5 w-5" />,
  Heart: <Heart className="h-5 w-5" />,
  Smartphone: <Smartphone className="h-5 w-5" />,
  Coffee: <Coffee className="h-5 w-5" />
};

// Component for Dashboard Top Stats
const StatCard = ({ title, value, change, isPositive }: { title: string, value: string, change: string, isPositive: boolean }) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h4 className="text-2xl font-bold mt-1">{value}</h4>
        </div>
        <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'} text-sm font-medium`}>
          {isPositive ? '+' : ''}{change}
          <TrendingUp className={`h-4 w-4 ml-1 ${isPositive ? '' : 'transform rotate-180'}`} />
        </div>
      </div>
    </CardContent>
  </Card>
);

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [habits, setHabits] = useState(mockHabits);
  const [currentDate] = useState(new Date());
  const [quote] = useState(getRandomQuote());
  const [showAddHabitModal, setShowAddHabitModal] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: "", goal: 1, unit: "" });

  const isMobile = useMobile();

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
  };

  // Check if habit was completed today
  const wasHabitCompletedToday = (habit: typeof habits[0]) => {
    const today = new Date().getDay();
    const adjustedIndex = today === 0 ? 6 : today - 1; // Convert to 0-6 where 0 is Monday
    const value = habit.data[adjustedIndex];
    
    if (habit.name === "Screen Time") {
      // For screen time, less is better
      return value <= habit.goal;
    } else {
      // For other habits, more or equal is better
      return value >= habit.goal;
    }
  };

  // Update habit value
  const updateHabitValue = (id: number, value: number) => {
    setHabits(habits.map(h => {
      if (h.id === id) {
        return executeHabit({ ...h }, value);
      }
      return h;
    }));

    toast({
      title: "Habit Updated",
      description: "Your progress has been saved.",
    });
  };

  // Add new habit
  const addNewHabit = () => {
    if (newHabit.name.trim() === "" || newHabit.unit.trim() === "") {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const id = habits.length + 1;
    const colors = ["habit-blue", "habit-purple", "habit-green", "habit-orange", "habit-teal", "habit-red", "habit-yellow"];
    const icons = ["Droplets", "Moon", "Zap", "Book", "Heart", "Smartphone", "Coffee"];
    
    const newHabitItem = {
      id,
      name: newHabit.name,
      icon: icons[Math.floor(Math.random() * icons.length)],
      goal: newHabit.goal,
      unit: newHabit.unit,
      color: colors[Math.floor(Math.random() * colors.length)],
      data: [0, 0, 0, 0, 0, 0, 0],
      streak: 0
    };
    
    setHabits([...habits, newHabitItem]);
    setNewHabit({ name: "", goal: 1, unit: "" });
    setShowAddHabitModal(false);
    
    toast({
      title: "Success",
      description: "New habit has been added",
    });
  };

  // Calculate completion percentage
  const calculateOverallCompletion = () => {
    let completed = 0;
    let total = 0;
    
    habits.forEach(habit => {
      if (wasHabitCompletedToday(habit)) {
        completed++;
      }
      total++;
    });
    
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  // Navigation
  const navigate = useNavigate();
  const location = useLocation();

  // Handle navigation
  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false);
    navigate(`#${tab}`);
  };

  // Check URL hash on initial load
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash) {
      setActiveTab(hash);
    }
  }, [location]);

  const renderIconByName = (iconName: string) => {
    return habitIcons[iconName] || <Info className="h-5 w-5" />;
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="flex flex-col min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 h-16 border-b bg-background">
          <div className="flex items-center">
            <button
              className="mr-2 p-2 rounded-md hover:bg-accent md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <h1 className="text-xl font-bold flex items-center">
              <Zap className="h-5 w-5 text-primary mr-2" />
              HabitTracker
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={toggleDarkMode}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    2
                  </span>
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-4 pt-2 pb-3 border-b">
                  <h3 className="font-semibold text-lg">Notifications</h3>
                  <p className="text-sm text-muted-foreground">You have 2 unread messages</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <DropdownMenuItem className="p-0">
                    <div className="flex items-start gap-3 p-3 cursor-pointer hover:bg-accent w-full">
                      <div className="bg-primary/20 p-2 rounded-full">
                        <AlertCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Streak Alert!</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          You're on a 7-day streak for Sleep habit. Keep it up!
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                      </div>
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-0">
                    <div className="flex items-start gap-3 p-3 cursor-pointer hover:bg-accent w-full">
                      <div className="bg-primary/20 p-2 rounded-full">
                        <Award className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Achievement Unlocked!</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          You've completed all habits for today. Great job!
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                      </div>
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                    </div>
                  </DropdownMenuItem>
                </div>
                <div className="p-2 border-t">
                  <Button variant="ghost" className="w-full justify-center text-sm">
                    View all notifications
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex flex-1">
          {/* Sidebar for navigation */}
          <motion.aside 
            className={`fixed inset-y-0 left-0 z-20 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform lg:translate-x-0 lg:static lg:w-64 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            initial={false}
            animate={{ x: sidebarOpen ? 0 : isMobile ? -320 : 0 }}
          >
            <div className="flex flex-col h-full pt-16">
              <div className="p-4">
                <div className="flex items-center mb-6 px-2 pt-4">
                  <div className="flex h-10 w-10 rounded-full bg-primary/10 items-center justify-center mr-3">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sidebar-foreground">Jane Smith</p>
                    <p className="text-xs text-sidebar-foreground/70">jane@example.com</p>
                  </div>
                </div>
                
                <nav>
                  <Button
                    variant={activeTab === "dashboard" ? "secondary" : "ghost"}
                    className="w-full justify-start mb-1"
                    onClick={() => handleNavigate("dashboard")}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                  
                  <Button
                    variant={activeTab === "habits" ? "secondary" : "ghost"}
                    className="w-full justify-start mb-1"
                    onClick={() => handleNavigate("habits")}
                  >
                    <CheckCheck className="h-4 w-4 mr-2" />
                    My Habits
                  </Button>
                  
                  <Button
                    variant={activeTab === "analytics" ? "secondary" : "ghost"}
                    className="w-full justify-start mb-1"
                    onClick={() => handleNavigate("analytics")}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                  
                  <Button
                    variant={activeTab === "calendar" ? "secondary" : "ghost"}
                    className="w-full justify-start mb-1"
                    onClick={() => handleNavigate("calendar")}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendar
                  </Button>
                  
                  <Button
                    variant={activeTab === "settings" ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleNavigate("settings")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </nav>
              </div>
              
              <div className="mt-auto p-4">
                <Card className="bg-sidebar-accent">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-medium text-sm">Habit Reminders</p>
                      <Switch checked />
                    </div>
                    <p className="text-xs text-sidebar-foreground/70">
                      Daily reminders are enabled. You'll receive notifications when it's time to complete your habits.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.aside>

          {/* Main content area */}
          <main className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto"
              >
                {/* Dashboard */}
                {activeTab === "dashboard" && (
                  <div className="space-y-6">
                    {/* Header with date and overall completion */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h1 className="text-2xl font-bold">Daily Progress</h1>
                        <p className="text-muted-foreground">{formatDate(currentDate)}</p>
                      </div>
                      <Card className="w-full md:w-auto">
                        <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
                          <div className="relative h-16 w-16">
                            <PieChart width={64} height={64}>
                              <Pie
                                data={completionData}
                                innerRadius={25}
                                outerRadius={30}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                              >
                                {completionData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                ))}
                              </Pie>
                            </PieChart>
                            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                              <p className="text-sm font-bold">{calculateOverallCompletion()}%</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Today's Progress</p>
                            <p className="text-xs text-muted-foreground">
                              {habits.filter(h => wasHabitCompletedToday(h)).length} of {habits.length} habits completed
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {weeklyStats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                      ))}
                    </div>

                    {/* Quote of the day */}
                    <Card className="bg-gradient-to-r from-primary/20 to-primary/5">
                      <CardContent className="p-6">
                        <p className="text-lg font-medium italic">{quote}</p>
                      </CardContent>
                    </Card>

                    {/* Main Content Tabs */}
                    <Tabs defaultValue="today" className="w-full">
                      <TabsList className="w-full sm:w-auto grid grid-cols-3">
                        <TabsTrigger value="today">Today's Habits</TabsTrigger>
                        <TabsTrigger value="charts">Insights</TabsTrigger>
                        <TabsTrigger value="streaks">Streaks</TabsTrigger>
                      </TabsList>
                      <TabsContent value="today" className="space-y-4 mt-4">
                        {/* Today's habits */}
                        {habits.map((habit) => {
                          const today = new Date().getDay();
                          const adjustedIndex = today === 0 ? 6 : today - 1;
                          const currentValue = habit.data[adjustedIndex];
                          const progress = calculateProgress(currentValue, habit.goal);
                          
                          return (
                            <Card key={habit.id} className="overflow-hidden">
                              <CardContent className="p-0">
                                <div className="p-6">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white bg-${habit.color}`}>
                                        {renderIconByName(habit.icon)}
                                      </div>
                                      <div className="ml-4">
                                        <h3 className="font-medium">{habit.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                          Goal: {habit.goal} {habit.unit}
                                        </p>
                                      </div>
                                    </div>
                                    <Badge 
                                      variant={wasHabitCompletedToday(habit) ? "default" : "outline"}
                                      className={wasHabitCompletedToday(habit) ? "bg-green-500/20 text-green-600 hover:bg-green-500/20" : ""}
                                    >
                                      {wasHabitCompletedToday(habit) ? 
                                        <><Check className="h-3 w-3 mr-1" /> Complete</> : 
                                        'Pending'}
                                    </Badge>
                                  </div>
                                  
                                  <div className="mt-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm">{currentValue} {habit.unit}</span>
                                      <span className="text-sm">{habit.goal} {habit.unit}</span>
                                    </div>
                                    <Progress value={progress} className="h-2" />
                                    
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-2">
                                        Adjust today's value:
                                      </p>
                                      <div className="flex items-center">
                                        <Slider
                                          className="flex-1 custom-slider"
                                          defaultValue={[currentValue]}
                                          max={habit.name === "Screen Time" ? habit.goal * 2 : habit.goal * 1.5}
                                          step={habit.unit === "hours" ? 0.5 : 1}
                                          onValueChange={(value) => {
                                            updateHabitValue(habit.id, value[0]);
                                          }}
                                        />
                                        <span className="ml-4 w-12 text-center">
                                          {currentValue}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                        
                        <Button 
                          className="w-full mt-4" 
                          variant="outline"
                          onClick={() => setShowAddHabitModal(true)}
                        >
                          + Add New Habit
                        </Button>
                      </TabsContent>
                      
                      <TabsContent value="charts" className="space-y-6 mt-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Sleep Chart */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Sleep Pattern</CardTitle>
                              <CardDescription>Last 7 days sleeping hours</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={sleepData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <defs>
                                      <linearGradient id="sleepColor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip unit="hours" />} />
                                    <Area 
                                      type="monotone" 
                                      dataKey="hours" 
                                      stroke="#8B5CF6" 
                                      fillOpacity={1} 
                                      fill="url(#sleepColor)" 
                                    />
                                  </AreaChart>
                                </ResponsiveContainer>
                              </div>
                            </CardContent>
                          </Card>
                          
                          {/* Water Intake Chart */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Water Intake</CardTitle>
                              <CardDescription>Last 7 days consumption</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={waterData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip unit="glasses" />} />
                                    <Bar 
                                      dataKey="glasses" 
                                      fill="#0EA5E9" 
                                      radius={[4, 4, 0, 0]} 
                                    />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            </CardContent>
                          </Card>
                          
                          {/* Screen Time Chart */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Screen Time</CardTitle>
                              <CardDescription>Last 7 days usage</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={screenTimeData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip content={<CustomTooltip unit="minutes" />} />
                                    <Line 
                                      type="monotone" 
                                      dataKey="minutes" 
                                      stroke="#EF4444" 
                                      strokeWidth={2}
                                      dot={{ r: 4 }}
                                      activeDot={{ r: 6, stroke: "#EF4444", strokeWidth: 2, fill: "#FFFFFF" }}
                                    />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            </CardContent>
                          </Card>
                          
                          {/* Overall Completion Chart */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Weekly Completion</CardTitle>
                              <CardDescription>Habit completion by day</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart
                                    data={days.map((day, i) => ({
                                      name: day,
                                      complete: habits.filter(h => {
                                        const val = h.data[i];
                                        return h.name === "Screen Time" ? val <= h.goal : val >= h.goal;
                                      }).length,
                                      incomplete: habits.filter(h => {
                                        const val = h.data[i];
                                        return h.name === "Screen Time" ? val > h.goal : val < h.goal;
                                      }).length
                                    }))}
                                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                                  >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="complete" stackId="a" fill="#22C55E" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="incomplete" stackId="a" fill="#F87171" radius={[4, 4, 0, 0]} />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="streaks" className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {habits.map((habit) => (
                            <Card key={habit.id} className={habit.streak > 0 ? "border-l-4 border-l-primary" : ""}>
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white bg-${habit.color}`}>
                                      {renderIconByName(habit.icon)}
                                    </div>
                                    <div className="ml-3">
                                      <h3 className="font-medium text-sm">{habit.name}</h3>
                                      <p className="text-xs text-muted-foreground">
                                        Goal: {habit.goal} {habit.unit}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl font-bold">{habit.streak}</div>
                                    <p className="text-xs text-muted-foreground">day streak</p>
                                  </div>
                                </div>
                                
                                <div className="mt-4">
                                  <div className="flex justify-between mb-1">
                                    <span className="text-xs text-muted-foreground">This Week:</span>
                                  </div>
                                  <div className="flex gap-1">
                                    {habit.data.map((value, index) => {
                                      const isCompleted = habit.name === "Screen Time" 
                                        ? value <= habit.goal 
                                        : value >= habit.goal;
                                      
                                      return (
                                        <div 
                                          key={index} 
                                          className={`h-2 flex-1 rounded-full ${
                                            isCompleted ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                                          }`}
                                        />
                                      );
                                    })}
                                  </div>
                                  <div className="flex justify-between mt-1">
                                    <span className="text-xs text-muted-foreground">Mon</span>
                                    <span className="text-xs text-muted-foreground">Sun</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
                
                {/* HABITS TAB */}
                {activeTab === "habits" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h1 className="text-2xl font-bold">My Habits</h1>
                      <Button onClick={() => setShowAddHabitModal(true)}>
                        Add Habit
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {habits.map((habit) => {
                        const today = new Date().getDay();
                        const adjustedIndex = today === 0 ? 6 : today - 1;
                        const currentValue = habit.data[adjustedIndex];
                        const progress = calculateProgress(currentValue, habit.goal);
                        
                        return (
                          <Card key={habit.id} className="overflow-hidden">
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white bg-${habit.color}`}>
                                    {renderIconByName(habit.icon)}
                                  </div>
                                  <div className="ml-3">
                                    <CardTitle className="text-base">{habit.name}</CardTitle>
                                  </div>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <span className="sr-only">Open menu</span>
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuItem>Archive</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <CardDescription className="mt-2">
                                Goal: {habit.goal} {habit.unit} per day
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                  <span>Progress</span>
                                  <span>{currentValue} / {habit.goal} {habit.unit}</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                                
                                {habit.streak > 0 && (
                                  <div className="flex items-center text-amber-500">
                                    <Flame className="h-4 w-4 mr-1" />
                                    <span className="text-sm font-medium">{habit.streak} day streak</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="mt-4">
                                <p className="text-xs text-muted-foreground mb-2">
                                  Last 7 days:
                                </p>
                                <div className="flex justify-between">
                                  {days.map((day, index) => {
                                    const value = habit.data[index];
                                    const isCompleted = habit.name === "Screen Time" 
                                      ? value <= habit.goal 
                                      : value >= habit.goal;
                                    
                                    return (
                                      <div key={index} className="flex flex-col items-center">
                                        <div
                                          className={`h-8 w-8 rounded-full flex items-center justify-center text-xs ${
                                            isCompleted 
                                              ? "bg-green-500 text-white" 
                                              : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                                          }`}
                                        >
                                          {isCompleted ? <Check className="h-3 w-3" /> : null}
                                        </div>
                                        <div className="text-xs mt-1">{day[0]}</div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* ANALYTICS TAB */}
                {activeTab === "analytics" && (
                  <div className="space-y-6">
                    <h1 className="text-2xl font-bold">Analytics</h1>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Weekly Overview</CardTitle>
                        <CardDescription>Your habit completion rate for the past week</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                              data={days.map((day, i) => {
                                const total = habits.length;
                                const completed = habits.filter(h => {
                                  const val = h.data[i];
                                  return h.name === "Screen Time" ? val <= h.goal : val >= h.goal;
                                }).length;
                                
                                return {
                                  name: day,
                                  value: (completed / total) * 100
                                };
                              })}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="name" />
                              <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                              <Tooltip 
                                formatter={(value: string | number) => [`${Number(value).toFixed(1)}%`, 'Completion Rate']}
                                labelFormatter={(label) => `${label}`}
                              />
                              <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]}>
                                {days.map((_, index) => (
                                  <Cell 
                                    key={`cell-${index}`}
                                    fill={`hsl(${262 + (index * 10)}, 83%, ${58 - (index * 3)}%)`}
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Habit Performance</CardTitle>
                          <CardDescription>Average completion rate by habit</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                layout="vertical"
                                data={habits.map(habit => {
                                  const completedDays = habit.data.filter((val, i) => 
                                    habit.name === "Screen Time" ? val <= habit.goal : val >= habit.goal
                                  ).length;
                                  
                                  return {
                                    name: habit.name,
                                    value: (completedDays / 7) * 100
                                  };
                                })}
                                margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                                <YAxis type="category" dataKey="name" width={80} />
                                <Tooltip 
                                  formatter={(value: string | number) => [`${Number(value).toFixed(1)}%`, 'Completion Rate']}
                                  labelFormatter={(label) => `${label}`}
                                />
                                <Bar dataKey="value" fill="#0EA5E9" radius={[0, 4, 4, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Consistency Score</CardTitle>
                          <CardDescription>How consistent you are with each habit</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="space-y-8">
                            {habits.map(habit => {
                              // Calculate consistency - how close to the goal each day
                              const consistencyScore = habit.data.reduce((acc, val) => {
                                if (habit.name === "Screen Time") {
                                  // For screen time, less is better
                                  return acc + (val <= habit.goal ? 100 : (habit.goal / val) * 100);
                                } else {
                                  // For other habits, more is better
                                  return acc + (val >= habit.goal ? 100 : (val / habit.goal) * 100);
                                }
                              }, 0) / 7;
                              
                              return (
                                <div key={habit.id} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-white bg-${habit.color} mr-2`}>
                                        {renderIconByName(habit.icon)}
                                      </div>
                                      <span className="text-sm font-medium">{habit.name}</span>
                                    </div>
                                    <span className="text-sm font-medium">{consistencyScore.toFixed(0)}%</span>
                                  </div>
                                  <Progress value={consistencyScore} className="h-2" />
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
                
                {/* CALENDAR TAB */}
                {activeTab === "calendar" && (
                  <div className="space-y-6">
                    <h1 className="text-2xl font-bold">Calendar</h1>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>May 2025</CardTitle>
                        <CardDescription>Track your habits across the month</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-7 gap-1 text-center">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                            <div key={i} className="py-2 text-sm font-medium">
                              {day}
                            </div>
                          ))}
                          
                          {/* Week 1 */}
                          <div className="h-24 p-1 bg-muted/30 rounded border border-border/50"></div>
                          <div className="h-24 p-1 bg-muted/30 rounded border border-border/50">
                            <div className="text-xs mb-1 font-medium">1</div>
                            <div className="space-y-1">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="h-1.5 rounded-full bg-green-500"></div>
                              ))}
                            </div>
                          </div>
                          <div className="h-24 p-1 bg-muted/30 rounded border border-border/50">
                            <div className="text-xs mb-1 font-medium">2</div>
                            <div className="space-y-1">
                              {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={`h-1.5 rounded-full ${i === 3 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                              ))}
                            </div>
                          </div>
                          <div className="h-24 p-1 bg-muted/30 rounded border border-border/50">
                            <div className="text-xs mb-1 font-medium">3</div>
                            <div className="space-y-1">
                              {[1, 2].map((i) => (
                                <div key={i} className={`h-1.5 rounded-full bg-green-500`}></div>
                              ))}
                            </div>
                          </div>
                          <div className="h-24 p-1 bg-muted/30 rounded border border-border/50">
                            <div className="text-xs mb-1 font-medium">4</div>
                            <div className="space-y-1">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className={`h-1.5 rounded-full ${i === 1 || i === 4 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                              ))}
                            </div>
                          </div>
                          <div className="h-24 p-1 bg-muted/30 rounded border border-border/50">
                            <div className="text-xs mb-1 font-medium">5</div>
                            <div className="space-y-1">
                              {[1, 2].map((i) => (
                                <div key={i} className={`h-1.5 rounded-full ${i === 1 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Add more weeks and days - simplified for demo */}
                          {Array.from({ length: 30 }, (_, i) => (
                            <div key={i + 6} className="h-24 p-1 bg-muted/30 rounded border border-border/50">
                              {i + 6 <= 31 && <div className="text-xs mb-1 font-medium">{i + 6}</div>}
                              {i + 6 <= 31 && Math.random() > 0.3 && (
                                <div className="space-y-1">
                                  {Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => (
                                    <div 
                                      key={j} 
                                      className={`h-1.5 rounded-full ${
                                        Math.random() > 0.8 ? 'bg-red-500' : 'bg-green-500'
                                      }`}
                                    ></div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="flex items-center justify-between gap-2">
                      <Card className="flex-1">
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="h-10 w-10 bg-green-500/20 rounded-full flex items-center justify-center">
                            <Check className="h-5 w-5 text-green-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Completed Days</p>
                            <p className="text-xl font-bold">24</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="flex-1">
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="h-10 w-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                            <Flame className="h-5 w-5 text-amber-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Best Streak</p>
                            <p className="text-xl font-bold">7 days</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="flex-1">
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="h-10 w-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <Percent className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Completion Rate</p>
                            <p className="text-xl font-bold">78%</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
                
                {/* SETTINGS TAB */}
                {activeTab === "settings" && (
                  <div className="space-y-6">
                    <h1 className="text-2xl font-bold">Settings</h1>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Preferences</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Dark Mode</p>
                            <p className="text-sm text-muted-foreground">
                              Toggle between light and dark mode
                            </p>
                          </div>
                          <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Notifications</p>
                            <p className="text-sm text-muted-foreground">
                              Receive reminders for your habits
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Weekly Report</p>
                            <p className="text-sm text-muted-foreground">
                              Receive a weekly summary of your habits
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <p className="font-medium">Reminder Time</p>
                          <p className="text-sm text-muted-foreground">
                            Set when you'd like to receive daily reminders
                          </p>
                          <div className="flex space-x-2">
                            <Input
                              type="time"
                              defaultValue="20:00"
                              className="w-full"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Account</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Email</p>
                          <Input defaultValue="jane@example.com" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Password</p>
                          <Input type="password" value="********" readOnly />
                        </div>
                        <Button variant="outline">Change Password</Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Data Management</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Export Data</p>
                            <p className="text-sm text-muted-foreground">
                              Download all your habit data as JSON
                            </p>
                          </div>
                          <Button variant="outline">Export</Button>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-destructive">Delete Account</p>
                            <p className="text-sm text-muted-foreground">
                              Permanently delete your account and all data
                            </p>
                          </div>
                          <Button variant="destructive">Delete</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            
            {/* Fixed footer */}
            <footer className="border-t bg-background py-6 px-4 md:px-6">
              <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <Zap className="h-5 w-5 text-primary mr-2" />
                      HabitTracker
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Build better habits and track your progress with our intuitive habit tracking app.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Support</h4>
                      <ul className="space-y-2 text-sm">
                        <li><a href="#" className="text-muted-foreground hover:text-foreground">Help Center</a></li>
                        <li><a href="#" className="text-muted-foreground hover:text-foreground">FAQ</a></li>
                        <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact Us</a></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Company</h4>
                      <ul className="space-y-2 text-sm">
                        <li><a href="#" className="text-muted-foreground hover:text-foreground">About</a></li>
                        <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy</a></li>
                        <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms</a></li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Stay Updated</h4>
                    <div className="flex space-x-2">
                      <Input placeholder="Enter your email" className="max-w-[220px]" />
                      <Button>Subscribe</Button>
                    </div>
                    <div className="flex space-x-4 mt-4">
                      <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-foreground">
                        <Twitter className="h-5 w-5" />
                      </a>
                      <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-foreground">
                        <Instagram className="h-5 w-5" />
                      </a>
                      <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-foreground">
                        <Facebook className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-4 border-t flex flex-col md:flex-row justify-between items-center">
                  <p className="text-sm text-muted-foreground">&copy; 2025 HabitTracker. All rights reserved.</p>
                  <div className="flex space-x-4 mt-4 md:mt-0">
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Cookies</a>
                  </div>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
      
      {/* Add Habit Modal */}
      {showAddHabitModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New Habit</CardTitle>
              <CardDescription>Create a new habit to track daily</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="habitName" className="text-sm font-medium">
                    Habit Name
                  </label>
                  <Input
                    id="habitName"
                    placeholder="e.g. Drink Water, Meditate"
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="habitGoal" className="text-sm font-medium">
                      Daily Goal
                    </label>
                    <Input
                      id="habitGoal"
                      type="number"
                      min="1"
                      value={newHabit.goal}
                      onChange={(e) => setNewHabit({ ...newHabit, goal: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="habitUnit" className="text-sm font-medium">
                      Unit
                    </label>
                    <Input
                      id="habitUnit"
                      placeholder="e.g. glasses, minutes"
                      value={newHabit.unit}
                      onChange={(e) => setNewHabit({ ...newHabit, unit: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setShowAddHabitModal(false)}>
                Cancel
              </Button>
              <Button onClick={addNewHabit}>
                Add Habit
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;

// Missing import helper components
const CheckCheck = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 7 17l-5-5" />
      <path d="m22 10-7.5 7.5L13 16" />
    </svg>
  );
};

const Flame = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
};

const MoreHorizontal = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
};

const Percent = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="19" x2="5" y1="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
};

const Twitter = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
};

const Instagram = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
};

const Facebook = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
};
