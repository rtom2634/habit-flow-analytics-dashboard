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
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
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

  const isMobile = useIsMobile();

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
          <aside 
            className={`fixed inset-y-0 left-0 z-20 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform lg:translate-x-0 lg:static lg:w-64 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
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
          </aside>

          {/* Main content area */}
          <main className="flex-1 overflow-hidden">
            <div
              key={activeTab}
              className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto animate-fade-in"
            >
              {activeTab === "dashboard" && (
                <div>
                  {/* Date and Quote */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold">{formatDate(currentDate)}</h2>
                    <p className="text-muted-foreground mt-1 italic">"{quote}"</p>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {weeklyStats.map((stat, index) => (
                      <StatCard 
                        key={index} 
                        title={stat.name} 
                        value={stat.value} 
                        change={stat.change} 
                        isPositive={stat.isPositive} 
                      />
                    ))}
                  </div>

                  {/* Charts and Progress */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    {/* Sleep Chart */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Sleep Analysis</CardTitle>
                        <CardDescription>Weekly sleep patterns</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <AreaChart data={sleepData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis unit="hrs" />
                            <Tooltip content={<CustomTooltip unit="hrs" />} />
                            <Area type="monotone" dataKey="hours" stroke="#8B5CF6" fill="#C4B5FD" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Water Intake Chart */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Water Intake</CardTitle>
                        <CardDescription>Daily water consumption</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={waterData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis unit="glasses" />
                            <Tooltip content={<CustomTooltip unit="glasses" />} />
                            <Bar dataKey="glasses" fill="#3B82F6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Screen Time Chart */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Screen Time</CardTitle>
                        <CardDescription>Daily screen time analysis</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <LineChart data={screenTimeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis unit="mins" />
                            <Tooltip content={<CustomTooltip unit="mins" />} />
                            <Line type="monotone" dataKey="minutes" stroke="#EF4444" fill="#FCA5A5" />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Overall Completion Rate */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Overall Completion</CardTitle>
                        <CardDescription>Habit completion rate</CardDescription>
                      </CardHeader>
                      <CardContent className="flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              dataKey="value"
                              data={completionData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              label
                            >
                              {completionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === "habits" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">My Habits</h2>
                    <Button onClick={() => setShowAddHabitModal(true)}>Add New Habit</Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {habits.map(habit => (
                      <Card key={habit.id}>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            {renderIconByName(habit.icon)}
                            {habit.name}
                          </CardTitle>
                          <CardDescription>
                            Goal: {habit.goal} {habit.unit}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <p className="text-sm text-muted-foreground">Progress</p>
                            <Progress value={calculateProgress(habit.data[new Date().getDay() - 1] || 0, habit.goal)} />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>0</span>
                              <span>{habit.goal}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Update Progress</p>
                            <Slider
                              defaultValue={[habit.data[new Date().getDay() - 1] || 0]}
                              max={habit.goal}
                              step={1}
                              onValueChange={(value) => updateHabitValue(habit.id, value[0])}
                            />
                          </div>
                        </CardContent>
                        <CardFooter className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Flame className="h-4 w-4 text-orange-500" />
                            <span>{habit.streak}</span>
                          </div>
                          <Badge variant={wasHabitCompletedToday(habit) ? "outline" : "default"}>
                            {wasHabitCompletedToday(habit) ? "Completed" : "Incomplete"}
                          </Badge>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "analytics" && (
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Analytics</h2>
                  <p>Detailed analytics and insights coming soon!</p>
                </div>
              )}

              {activeTab === "calendar" && (
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Calendar</h2>
                  <p>Calendar view and habit scheduling coming soon!</p>
                </div>
              )}

              {activeTab === "settings" && (
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Settings</h2>
                  <p>App settings and customization options coming soon!</p>
                </div>
              )}
            </div>
            
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
                  <div className="flex flex-wrap justify-center md:justify-end space-x-4 mt-4 md:mt-0">
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground mb-2 md:mb-0">Privacy Policy</a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground mb-2 md:mb-0">Terms of Service</a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground mb-2 md:mb-0">Cookies</a>
                  </div>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
      
      {/* Add Habit Modal */}
      {showAddHabitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="max-w-md w-full p-6">
            <CardHeader>
              <CardTitle>Add New Habit</CardTitle>
              <CardDescription>Create a new habit to track</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium leading-none">
                    Habit Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Drink Water"
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="goal" className="text-sm font-medium leading-none">
                    Daily Goal
                  </label>
                  <Input
                    id="goal"
                    type="number"
                    placeholder="8"
                    value={newHabit.goal}
                    onChange={(
