import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Circle, 
  Calendar,
  BookOpen,
  Target,
  BarChart3,
  Star,
  AlertCircle,
  Minus,
  Edit3,
  Save,
  X,
  Clock,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';

const ProductivityApp = () => {
  // State Management
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [goals, setGoals] = useState([]);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  
  // Form states
  const [taskForm, setTaskForm] = useState({ title: '', priority: 'medium', dueDate: '', subject: '' });
  const [noteForm, setNoteForm] = useState({ title: '', content: '', subject: '' });
  const [goalForm, setGoalForm] = useState({ title: '', target: '', current: 0, category: '' });
  
  const timerRef = useRef(null);

  // Timer Effect
  useEffect(() => {
    if (isRunning && pomodoroTime > 0) {
      timerRef.current = setTimeout(() => {
        setPomodoroTime(pomodoroTime - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      if (!isBreak) {
        setCompletedPomodoros(prev => prev + 1);
        setPomodoroTime(5 * 60); // 5 minute break
        setIsBreak(true);
      } else {
        setPomodoroTime(25 * 60); // Back to 25 minutes
        setIsBreak(false);
      }
      setIsRunning(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [isRunning, pomodoroTime, isBreak]);

  // Task Functions
  const addTask = () => {
    if (taskForm.title.trim()) {
      const newTask = {
        id: Date.now(),
        ...taskForm,
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTasks([...tasks, newTask]);
      setTaskForm({ title: '', priority: 'medium', dueDate: '', subject: '' });
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Note Functions
  const addNote = () => {
    if (noteForm.title.trim() && noteForm.content.trim()) {
      const newNote = {
        id: Date.now(),
        ...noteForm,
        createdAt: new Date().toISOString()
      };
      setNotes([...notes, newNote]);
      setNoteForm({ title: '', content: '', subject: '' });
    }
  };

  // Goal Functions
  const addGoal = () => {
    if (goalForm.title.trim() && goalForm.target) {
      const newGoal = {
        id: Date.now(),
        ...goalForm,
        target: parseInt(goalForm.target),
        createdAt: new Date().toISOString()
      };
      setGoals([...goals, newGoal]);
      setGoalForm({ title: '', target: '', current: 0, category: '' });
    }
  };

  const updateGoalProgress = (id, increment) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { 
        ...goal, 
        current: Math.max(0, Math.min(goal.target, goal.current + increment))
      } : goal
    ));
  };

  // Timer Functions
  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setPomodoroTime(25 * 60);
    setIsBreak(false);
  };

  // Analytics Functions
  const getCompletionRate = () => {
    if (tasks.length === 0) return 0;
    return Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-300 bg-red-400/20 border-red-400/30';
      case 'medium': return 'text-yellow-300 bg-yellow-400/20 border-yellow-400/30';
      case 'low': return 'text-green-300 bg-green-400/20 border-green-400/30';
      default: return 'text-gray-300 bg-gray-400/20 border-gray-400/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 text-slate-900">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                FutureFlow
              </h1>
            </div>
            <div className="flex items-center space-x-4 text-sm text-slate-700">
              <div className="flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>{tasks.filter(t => t.completed).length} completed</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4" />
                <span>{completedPomodoros} focus sessions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white/60 backdrop-blur-xl border-b border-slate-200/30">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-1">
            {[
              { id: 'tasks', label: 'Tasks', icon: CheckCircle2 },
              { id: 'notes', label: 'Notes', icon: BookOpen },
              { id: 'pomodoro', label: 'Focus Timer', icon: Clock },
              { id: 'goals', label: 'Goals', icon: Target },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-indigo-700 bg-indigo-100/70 border-b-2 border-indigo-500 shadow-sm'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-slate-800">
                <Plus className="w-5 h-5 text-cyan-500" />
                <span>Add New Task</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                  placeholder="Task title..."
                  className="bg-white/80 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 text-slate-800 placeholder-slate-500"
                />
                <select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                  className="bg-white/80 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-slate-800"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                  className="bg-white/80 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-slate-800"
                />
                <input
                  value={taskForm.subject}
                  onChange={(e) => setTaskForm({...taskForm, subject: e.target.value})}
                  placeholder="Subject/Category"
                  className="bg-white/80 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-slate-800 placeholder-slate-500"
                />
              </div>
              <button
                onClick={addTask}
                className="mt-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 text-white"
              >
                Add Task
              </button>
            </div>

            <div className="grid gap-4">
              {tasks.map(task => (
                <div key={task.id} className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all duration-200 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="text-cyan-500 hover:text-cyan-400 transition-colors"
                      >
                        {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </button>
                      <div>
                        <h3 className={`font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                          {task.title}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-slate-600">
                          {task.subject && <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">{task.subject}</span>}
                          {task.dueDate && (
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-slate-800">
                <BookOpen className="w-5 h-5 text-cyan-500" />
                <span>Create Note</span>
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    value={noteForm.title}
                    onChange={(e) => setNoteForm({...noteForm, title: e.target.value})}
                    placeholder="Note title..."
                    className="bg-white/80 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-slate-800 placeholder-slate-500"
                  />
                  <input
                    value={noteForm.subject}
                    onChange={(e) => setNoteForm({...noteForm, subject: e.target.value})}
                    placeholder="Subject"
                    className="bg-white/80 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-slate-800 placeholder-slate-500"
                  />
                </div>
                <textarea
                  value={noteForm.content}
                  onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
                  placeholder="Write your note content here..."
                  rows={4}
                  className="w-full bg-white/80 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 resize-none text-slate-800 placeholder-slate-500"
                />
              </div>
              <button
                onClick={addNote}
                className="mt-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 text-white"
              >
                Save Note
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {notes.map(note => (
                <div key={note.id} className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all duration-200 shadow-md">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-slate-800">{note.title}</h3>
                    {note.subject && (
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                        {note.subject}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">{note.content}</p>
                  <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-500">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pomodoro Tab */}
        {activeTab === 'pomodoro' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-white/20 text-center shadow-lg">
              <h2 className="text-2xl font-semibold mb-8 flex items-center justify-center space-x-2 text-slate-800">
                <Clock className="w-6 h-6 text-cyan-500" />
                <span>{isBreak ? 'Break Time' : 'Focus Session'}</span>
              </h2>
              
              <div className="relative w-64 h-64 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20"></div>
                <div className="absolute inset-4 rounded-full bg-white/80 backdrop-blur-xl flex items-center justify-center border border-slate-200 shadow-lg">
                  <div className="text-center">
                    <div className="text-4xl font-mono font-bold text-slate-800 mb-2">
                      {formatTime(pomodoroTime)}
                    </div>
                    <div className="text-sm text-slate-600">
                      {isBreak ? 'Take a break' : 'Stay focused'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4 mb-6">
                <button
                  onClick={startTimer}
                  disabled={isRunning}
                  className="bg-green-100 hover:bg-green-200 text-green-700 p-3 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-6 h-6" />
                </button>
                <button
                  onClick={pauseTimer}
                  disabled={!isRunning}
                  className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 p-3 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Pause className="w-6 h-6" />
                </button>
                <button
                  onClick={resetTimer}
                  className="bg-red-100 hover:bg-red-200 text-red-700 p-3 rounded-full transition-all duration-200"
                >
                  <RotateCcw className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-slate-100 rounded-lg p-4">
                <div className="text-sm text-slate-600 mb-2">Today's Progress</div>
                <div className="flex items-center justify-center space-x-4 text-lg">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-slate-800">{completedPomodoros}</span>
                    <span className="text-slate-600">sessions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2 text-slate-800">
                <Target className="w-5 h-5 text-cyan-500" />
                <span>Create Goal</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  value={goalForm.title}
                  onChange={(e) => setGoalForm({...goalForm, title: e.target.value})}
                  placeholder="Goal title..."
                  className="bg-white/80 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-slate-800 placeholder-slate-500"
                />
                <input
                  type="number"
                  value={goalForm.target}
                  onChange={(e) => setGoalForm({...goalForm, target: e.target.value})}
                  placeholder="Target number"
                  className="bg-white/80 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-slate-800 placeholder-slate-500"
                />
                <input
                  value={goalForm.category}
                  onChange={(e) => setGoalForm({...goalForm, category: e.target.value})}
                  placeholder="Category"
                  className="bg-white/80 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-slate-800 placeholder-slate-500"
                />
                <button
                  onClick={addGoal}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 text-white"
                >
                  Add Goal
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {goals.map(goal => {
                const progress = Math.round((goal.current / goal.target) * 100);
                return (
                  <div key={goal.id} className="bg-white/70 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-md">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-slate-800 mb-1">{goal.title}</h3>
                        {goal.category && (
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                            {goal.category}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-cyan-600">
                          {goal.current}/{goal.target}
                        </div>
                        <div className="text-sm text-slate-600">{progress}%</div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-200 rounded-full h-2 mb-4 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => updateGoalProgress(goal.id, -1)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateGoalProgress(goal.id, 1)}
                        className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-md">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-cyan-100 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Task Completion</h3>
                    <p className="text-sm text-slate-600">Overall progress</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-cyan-600 mb-2">
                  {getCompletionRate()}%
                </div>
                <div className="text-sm text-slate-600">
                  {tasks.filter(t => t.completed).length} of {tasks.length} tasks completed
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-md">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Focus Sessions</h3>
                    <p className="text-sm text-slate-600">Pomodoro completed</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {completedPomodoros}
                </div>
                <div className="text-sm text-slate-600">
                  {Math.round(completedPomodoros * 25 / 60 * 10) / 10} hours focused
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-md">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Active Goals</h3>
                    <p className="text-sm text-slate-600">In progress</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {goals.length}
                </div>
                <div className="text-sm text-slate-600">
                  {goals.filter(g => g.current >= g.target).length} completed
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 border border-white/20 shadow-md">
              <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2 text-slate-800">
                <TrendingUp className="w-5 h-5 text-cyan-500" />
                <span>Productivity Overview</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-slate-800 mb-4">Recent Tasks by Priority</h4>
                  <div className="space-y-3">
                    {['high', 'medium', 'low'].map(priority => {
                      const count = tasks.filter(t => t.priority === priority).length;
                      const completed = tasks.filter(t => t.priority === priority && t.completed).length;
                      return (
                        <div key={priority} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                              priority === 'high' ? 'bg-red-400' : 
                              priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                            }`} />
                            <span className="capitalize text-slate-700">{priority}</span>
                          </div>
                          <span className="text-sm text-slate-600">
                            {completed}/{count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-800 mb-4">Notes by Subject</h4>
                  <div className="space-y-3">
                    {Array.from(new Set(notes.map(n => n.subject).filter(Boolean))).map(subject => {
                      const count = notes.filter(n => n.subject === subject).length;
                      return (
                        <div key={subject} className="flex items-center justify-between">
                          <span className="text-slate-700">{subject}</span>
                          <span className="text-sm text-slate-600">{count} notes</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductivityApp;
                