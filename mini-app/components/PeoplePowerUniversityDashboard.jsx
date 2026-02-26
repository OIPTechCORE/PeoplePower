import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, DollarSign, Users, Target, Award, Calendar,
  BarChart3, PieChart, Activity, Globe, Shield, Zap,
  Crown, Home, Gamepad2, Briefcase, Heart, Star,
  ChevronRight, AlertTriangle, CheckCircle, Info,
  Eye, Download, Filter, Search, Gem, Building,
  GraduationCap, Music, ShoppingBag, Stethoscope,
  Flame, Coins, Lock, Unlock, Vote, Burn, Droplet,
  Trophy, Medal, Gift, Users2, CalendarDays,
  Clock, TargetIcon, AwardIcon, UserPlus, Swords,
  BookOpen, Brain, Lightbulb, Award as AwardIcon,
  Users as UsersIcon, UserCheck, UserX, UserPlus as UserPlusIcon,
  Certificate, GraduationCap as GraduationCapIcon,
  School, University, Chalkboard, Teacher
} from 'lucide-react';

const PeoplePowerUniversityDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [ppuData, setPpuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    fetchPpuData();
  }, []);

  const fetchPpuData = async () => {
    try {
      // Mock data - replace with actual API call
      const mockData = {
        overview: {
          totalStudents: 2500000,
          activeStudents: 1500000,
          totalCourses: 45,
          totalFaculties: 5,
          totalCertificates: 750000,
          totalMentors: 15000,
          averageGPA: 3.75,
          mentorshipHours: 2500000
        },
        faculties: [
          {
            id: 'leadership_governance',
            name: 'Leadership & Governance',
            description: 'Develop negotiation, ethics, and community leadership skills',
            economicRole: 'community_leaders',
            duration: '8 weeks',
            difficulty: 'intermediate',
            enrolledStudents: 750000,
            completedStudents: 450000,
            courses: 12,
            certificates: 180000,
            averageCompletion: 85.5
          },
          {
            id: 'digital_entrepreneurship',
            name: 'Digital Entrepreneurship',
            description: 'Build and scale online businesses and digital ventures',
            economicRole: 'creators_founders',
            duration: '10 weeks',
            difficulty: 'advanced',
            enrolledStudents: 500000,
            completedStudents: 250000,
            courses: 8,
            certificates: 125000,
            averageCompletion: 78.2
          },
          {
            id: 'technology_ai_literacy',
            name: 'Technology & AI Literacy',
            description: 'Master coding basics, AI tools, and digital technology',
            economicRole: 'builders',
            duration: '12 weeks',
            difficulty: 'intermediate',
            enrolledStudents: 600000,
            completedStudents: 350000,
            courses: 15,
            certificates: 175000,
            averageCompletion: 82.1
          },
          {
            id: 'creative_arts_media',
            name: 'Creative Arts & Media',
            description: 'Storytelling, design, and content creation skills',
            economicRole: 'cultural_creators',
            duration: '6 weeks',
            difficulty: 'beginner',
            enrolledStudents: 400000,
            completedStudents: 300000,
            courses: 6,
            certificates: 150000,
            averageCompletion: 91.3
          },
          {
            id: 'civic_community_development',
            name: 'Civic & Community Development',
            description: 'Community organization, civic engagement, and social impact',
            economicRole: 'coordinators',
            duration: '8 weeks',
            difficulty: 'intermediate',
            enrolledStudents: 250000,
            completedStudents: 150000,
            courses: 4,
            certificates: 120000,
            averageCompletion: 88.7
          }
        ],
        mentorship: {
          totalPrograms: 3,
          activeMentors: 15000,
          totalApplications: 45000,
          activeMentees: 75000,
          totalHours: 2500000,
          averageRating: 4.7,
          programs: [
            {
              id: 'course_mentor',
              title: 'Course Mentor',
              activeMentors: 10000,
              totalMentees: 50000,
              totalHours: 1500000,
              averageRating: 4.8
            },
            {
              id: 'faculty_assistant',
              title: 'Faculty Assistant',
              activeMentors: 3000,
              totalMentees: 15000,
              totalHours: 750000,
              averageRating: 4.9
            },
            {
              id: 'community_educator',
              title: 'Community Educator',
              activeMentors: 2000,
              totalMentees: 10000,
              totalHours: 250000,
              averageRating: 4.6
            }
          ]
        },
        achievements: {
          totalCertificates: 750000,
          certificateTypes: {
            'course_completion': 450000,
            'skill_mastery': 200000,
            'faculty_honor': 100000
          },
          topCertificates: [
            { name: 'Community Leadership Certificate', count: 85000 },
            { name: 'Digital Business Certificate', count: 62000 },
            { name: 'AI Specialist Certificate', count: 58000 },
            { name: 'Governance Specialist Certificate', count: 45000 },
            { name: 'Junior Developer Certificate', count: 38000 }
          ]
        },
        impact: {
          economicRoles: {
            'community_leaders': 450000,
            'creators_founders': 125000,
            'builders': 350000,
            'cultural_creators': 300000,
            'coordinators': 150000
          },
          skillDevelopment: {
            'leadership': 850000,
            'entrepreneurship': 500000,
            'technology': 750000,
            'creativity': 600000,
            'community': 400000
          },
          communityImpact: {
            'projects_completed': 25000,
            'people_helped': 5000000,
            'businesses_started': 15000,
            'communities_organized': 5000
          }
        }
      };
      
      setPpuData(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching PPU data:', error);
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className={`mt-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Loading People Power University...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'faculties', name: 'Faculties', icon: School },
    { id: 'courses', name: 'Courses', icon: BookOpen },
    { id: 'mentorship', name: 'Mentorship', icon: UsersIcon },
    { id: 'achievements', name: 'Achievements', icon: Award },
    { id: 'impact', name: 'Impact', icon: Target }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Main Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-xl text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">🎓 People Power University</h2>
            <p className="text-blue-100 text-lg">Total Students: {formatNumber(ppuData.overview.totalStudents)}</p>
            <p className="text-blue-200 text-sm mt-2">Knowledge Engine • Skill Development • Economic Opportunity</p>
          </div>
          <div className="text-right">
            <GraduationCap className="h-16 w-16 text-blue-200" />
            <p className="text-2xl font-bold mt-2">{formatNumber(ppuData.overview.activeStudents)}</p>
            <p className="text-blue-100 text-sm">Active Students</p>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Courses</p>
              <p className="text-3xl font-bold">{ppuData.overview.totalCourses}</p>
              <p className="text-green-100 text-xs">Across {ppuData.overview.totalFaculties} faculties</p>
            </div>
            <BookOpen className="h-8 w-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Certificates Issued</p>
              <p className="text-3xl font-bold">{formatNumber(ppuData.overview.totalCertificates)}</p>
              <p className="text-purple-100 text-xs">Verified achievements</p>
            </div>
            <Certificate className="h-8 w-8 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Active Mentors</p>
              <p className="text-3xl font-bold">{formatNumber(ppuData.overview.totalMentors)}</p>
              <p className="text-orange-100 text-xs">Knowledge contributors</p>
            </div>
            <UsersIcon className="h-8 w-8 text-orange-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-cyan-500 to-blue-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm">Average GPA</p>
              <p className="text-3xl font-bold">{ppuData.overview.averageGPA}</p>
              <p className="text-cyan-100 text-xs">Academic excellence</p>
            </div>
            <Award className="h-8 w-8 text-cyan-200" />
          </div>
        </motion.div>
      </div>

      {/* Faculty Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🎓 Faculty Performance
          </h3>
          <div className="space-y-3">
            {ppuData.faculties.slice(0, 3).map((faculty) => (
              <div key={faculty.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <School className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{faculty.name}</p>
                    <p className="text-gray-400 text-xs">{faculty.economicRole}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold">{faculty.averageCompletion}%</p>
                  <p className="text-gray-400 text-xs">{formatNumber(faculty.enrolledStudents)} students</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🎯 Economic Roles Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(ppuData.impact.economicRoles).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {role.replace('_', ' ').toUpperCase()}
                </span>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatNumber(count)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderFaculties = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        🎓 PPU Faculties
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {ppuData.faculties.map((faculty, index) => (
          <motion.div
            key={faculty.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <School className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {faculty.name}
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-500 text-white">
                    {faculty.economicRole}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${
                  faculty.difficulty === 'beginner' ? 'text-green-500' :
                  faculty.difficulty === 'intermediate' ? 'text-yellow-500' :
                  'text-red-500'
                }`}>
                  {faculty.difficulty}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Duration</span>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {faculty.duration}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Courses</span>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {faculty.courses}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Enrolled Students</span>
                <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatNumber(faculty.enrolledStudents)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Completion Rate</span>
                <span className={`font-bold text-green-500`}>
                  {faculty.averageCompletion}%
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                {faculty.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                    {formatNumber(faculty.completedStudents)} completed
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                    {formatNumber(faculty.certificates)} certificates
                  </span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderMentorship = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        👥 Mentorship Programs
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📊 Mentorship Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Active Mentors</span>
              <span className={`font-bold text-green-500`}>
                {formatNumber(ppuData.mentorship.activeMentors)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Mentees</span>
              <span className={`font-bold text-blue-500`}>
                {formatNumber(ppuData.mentorship.totalMentees)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Hours</span>
              <span className={`font-bold text-purple-500`}>
                {formatNumber(ppuData.mentorship.totalHours)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Average Rating</span>
              <span className={`font-bold text-orange-500`}>
                {ppuData.mentorship.averageRating}/5.0
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🎯 Program Performance
          </h3>
          <div className="space-y-4">
            {ppuData.mentorship.programs.map((program) => (
              <div key={program.id} className="p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{program.title}</h4>
                  <span className="text-green-400 text-sm">Active</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Mentors:</span>
                    <span className="text-white font-bold">{formatNumber(program.activeMentors)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Mentees:</span>
                    <span className="text-white font-bold">{formatNumber(program.totalMentees)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Hours:</span>
                    <span className="text-white font-bold">{formatNumber(program.totalHours)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Rating:</span>
                    <span className="text-white font-bold">{program.averageRating}/5.0</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        🏆 Academic Achievements
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            📊 Certificate Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Total Certificates</span>
              <span className={`font-bold text-green-500`}>
                {formatNumber(ppuData.achievements.totalCertificates)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Course Completion</span>
              <span className={`font-bold text-blue-500`}>
                {formatNumber(ppuData.achievements.certificateTypes.course_completion)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Skill Mastery</span>
              <span className={`font-bold text-purple-500`}>
                {formatNumber(ppuData.achievements.certificateTypes.skill_mastery)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Faculty Honors</span>
              <span className={`font-bold text-orange-500`}>
                {formatNumber(ppuData.achievements.certificateTypes.faculty_honor)}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🏅 Top Certificates
          </h3>
          <div className="space-y-3">
            {ppuData.achievements.topCertificates.map((cert, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{cert.name}</p>
                  </div>
                </div>
                <span className="text-yellow-400 font-bold">{formatNumber(cert.count)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderImpact = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        🎯 Economic & Social Impact
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            💼 Economic Roles Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(ppuData.impact.economicRoles).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {role.replace('_', ' ').toUpperCase()}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${(count / 450000) * 100}%` }}
                    ></div>
                  </div>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatNumber(count)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            🌍 Community Impact
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Projects Completed</span>
              <span className={`font-bold text-green-500`}>
                {formatNumber(ppuData.impact.communityImpact.projects_completed)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>People Helped</span>
              <span className={`font-bold text-blue-500`}>
                {formatNumber(ppuData.impact.communityImpact.people_helped)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Businesses Started</span>
              <span className={`font-bold text-purple-500`}>
                {formatNumber(ppuData.impact.communityImpact.businesses_started)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Communities Organized</span>
              <span className={`font-bold text-orange-500`}>
                {formatNumber(ppuData.impact.communityImpact.communities_organized)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'faculties': return renderFaculties();
      case 'courses': return renderFaculties(); // For now, show faculties
      case 'mentorship': return renderMentorship();
      case 'achievements': return renderAchievements();
      case 'impact': return renderImpact();
      default: return renderOverview();
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-blue-600">🎓 People Power University</h1>
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Knowledge Engine • Skill Development • Economic Opportunity
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} hover:bg-gray-600`}>
                <Download className="h-5 w-5 text-gray-400" />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} hover:bg-gray-600`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default PeoplePowerUniversityDashboard;
