// ========================================
// EDUCATION ENGINES
// Core engines for micro-courses, leadership challenges, and entrepreneurship quests
// ========================================

export interface MicroCourse {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  modules: CourseModule[];
  assessment: Assessment;
  certification: Certification;
}

export interface CourseModule {
  id: string;
  title: string;
  content: string;
  type: 'video' | 'text' | 'interactive' | 'quiz';
  duration: number;
  completed: boolean;
}

export interface Assessment {
  questions: Question[];
  passingScore: number;
  timeLimit: number;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Certification {
  name: string;
  issuer: string;
  validUntil: Date;
  badgeUrl: string;
}

export interface LeadershipChallenge {
  id: string;
  title: string;
  description: string;
  scenario: string;
  objectives: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  skills: string[];
  rewards: ChallengeReward;
}

export interface ChallengeReward {
  experience: number;
  reputation: number;
  tokens: number;
  badge: string;
}

export interface EntrepreneurshipQuest {
  id: string;
  title: string;
  description: string;
  businessIdea: string;
  phases: QuestPhase[];
  requirements: string[];
  rewards: QuestReward;
}

export interface QuestPhase {
  id: string;
  name: string;
  description: string;
  tasks: QuestTask[];
  deliverables: string[];
}

export interface QuestTask {
  id: string;
  title: string;
  description: string;
  type: 'research' | 'planning' | 'execution' | 'presentation';
  completed: boolean;
}

export interface QuestReward {
  funding: number;
  mentorship: boolean;
  resources: string[];
  certification: string;
}

export class MicroCourseEngine {
  private courses: Map<string, MicroCourse> = new Map();
  private enrollments: Map<string, string[]> = new Map(); // playerId -> courseIds

  async createCourse(course: Omit<MicroCourse, 'id'>): Promise<MicroCourse> {
    const id = `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newCourse: MicroCourse = { ...course, id };
    this.courses.set(id, newCourse);
    return newCourse;
  }

  async enrollPlayer(playerId: string, courseId: string): Promise<boolean> {
    const course = this.courses.get(courseId);
    if (!course) return false;

    const playerEnrollments = this.enrollments.get(playerId) || [];
    if (playerEnrollments.includes(courseId)) return false;

    playerEnrollments.push(courseId);
    this.enrollments.set(playerId, playerEnrollments);
    return true;
  }

  async getCourseProgress(playerId: string, courseId: string): Promise<number> {
    const course = this.courses.get(courseId);
    if (!course) return 0;

    const completedModules = course.modules.filter(module => module.completed).length;
    return (completedModules / course.modules.length) * 100;
  }

  async completeModule(playerId: string, courseId: string, moduleId: string): Promise<boolean> {
    const course = this.courses.get(courseId);
    if (!course) return false;

    const module = course.modules.find(m => m.id === moduleId);
    if (!module) return false;

    module.completed = true;
    this.courses.set(courseId, course);
    return true;
  }

  async getCoursesByCategory(category: string): Promise<MicroCourse[]> {
    return Array.from(this.courses.values()).filter(course => course.category === category);
  }

  async getPlayerCourses(playerId: string): Promise<MicroCourse[]> {
    const courseIds = this.enrollments.get(playerId) || [];
    return courseIds.map(id => this.courses.get(id)).filter(Boolean) as MicroCourse[];
  }
}

export class LeadershipChallengeEngine {
  private challenges: Map<string, LeadershipChallenge> = new Map();
  private attempts: Map<string, ChallengeAttempt[]> = new Map(); // playerId -> attempts

  async createChallenge(challenge: Omit<LeadershipChallenge, 'id'>): Promise<LeadershipChallenge> {
    const id = `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newChallenge: LeadershipChallenge = { ...challenge, id };
    this.challenges.set(id, newChallenge);
    return newChallenge;
  }

  async startChallenge(playerId: string, challengeId: string): Promise<ChallengeAttempt> {
    const challenge = this.challenges.get(challengeId);
    if (!challenge) throw new Error('Challenge not found');

    const attempt: ChallengeAttempt = {
      id: `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      playerId,
      challengeId,
      startTime: new Date(),
      status: 'in_progress',
      score: 0,
      decisions: []
    };

    const playerAttempts = this.attempts.get(playerId) || [];
    playerAttempts.push(attempt);
    this.attempts.set(playerId, playerAttempts);

    return attempt;
  }

  async submitDecision(attemptId: string, decision: string, reasoning: string): Promise<boolean> {
    for (const [playerId, attempts] of this.attempts.entries()) {
      const attempt = attempts.find(a => a.id === attemptId);
      if (attempt) {
        attempt.decisions.push({ decision, reasoning, timestamp: new Date() });
        return true;
      }
    }
    return false;
  }

  async completeChallenge(attemptId: string, finalScore: number): Promise<ChallengeReward> {
    for (const [playerId, attempts] of this.attempts.entries()) {
      const attempt = attempts.find(a => a.id === attemptId);
      if (attempt) {
        attempt.status = 'completed';
        attempt.score = finalScore;
        attempt.endTime = new Date();

        const challenge = this.challenges.get(attempt.challengeId);
        if (challenge) {
          return this.calculateReward(challenge, finalScore);
        }
      }
    }
    throw new Error('Attempt not found');
  }

  private calculateReward(challenge: LeadershipChallenge, score: number): ChallengeReward {
    const baseReward = challenge.rewards;
    const scoreMultiplier = score / 100;
    
    return {
      experience: Math.floor(baseReward.experience * scoreMultiplier),
      reputation: Math.floor(baseReward.reputation * scoreMultiplier),
      tokens: Math.floor(baseReward.tokens * scoreMultiplier),
      badge: baseReward.badge
    };
  }

  async getPlayerChallenges(playerId: string): Promise<ChallengeAttempt[]> {
    return this.attempts.get(playerId) || [];
  }

  async getAvailableChallenges(difficulty?: string): Promise<LeadershipChallenge[]> {
    const challenges = Array.from(this.challenges.values());
    return difficulty ? challenges.filter(c => c.difficulty === difficulty) : challenges;
  }
}

export interface ChallengeAttempt {
  id: string;
  playerId: string;
  challengeId: string;
  startTime: Date;
  endTime?: Date;
  status: 'in_progress' | 'completed' | 'failed';
  score: number;
  decisions: Decision[];
}

export interface Decision {
  decision: string;
  reasoning: string;
  timestamp: Date;
}

export class EntrepreneurshipQuestEngine {
  private quests: Map<string, EntrepreneurshipQuest> = new Map();
  private participations: Map<string, QuestParticipation[]> = new Map(); // playerId -> participations

  async createQuest(quest: Omit<EntrepreneurshipQuest, 'id'>): Promise<EntrepreneurshipQuest> {
    const id = `quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newQuest: EntrepreneurshipQuest = { ...quest, id };
    this.quests.set(id, newQuest);
    return newQuest;
  }

  async startQuest(playerId: string, questId: string): Promise<QuestParticipation> {
    const quest = this.quests.get(questId);
    if (!quest) throw new Error('Quest not found');

    const participation: QuestParticipation = {
      id: `participation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      playerId,
      questId,
      startTime: new Date(),
      status: 'in_progress',
      currentPhase: 0,
      completedTasks: [],
      progress: 0
    };

    const playerParticipations = this.participations.get(playerId) || [];
    playerParticipations.push(participation);
    this.participations.set(playerId, playerParticipations);

    return participation;
  }

  async completeTask(playerId: string, participationId: string, taskId: string, deliverable: string): Promise<boolean> {
    const participations = this.participations.get(playerId) || [];
    const participation = participations.find(p => p.id === participationId);
    
    if (!participation) return false;

    const quest = this.quests.get(participation.questId);
    if (!quest) return false;

    const currentPhase = quest.phases[participation.currentPhase];
    const task = currentPhase.tasks.find(t => t.id === taskId);
    
    if (!task) return false;

    task.completed = true;
    participation.completedTasks.push({ taskId, deliverable, completedAt: new Date() });
    participation.progress = this.calculateProgress(quest, participation);

    return true;
  }

  async advancePhase(playerId: string, participationId: string): Promise<boolean> {
    const participations = this.participations.get(playerId) || [];
    const participation = participations.find(p => p.id === participationId);
    
    if (!participation) return false;

    const quest = this.quests.get(participation.questId);
    if (!quest) return false;

    if (participation.currentPhase < quest.phases.length - 1) {
      participation.currentPhase++;
      return true;
    }

    // Quest completed
    participation.status = 'completed';
    participation.endTime = new Date();
    return false;
  }

  private calculateProgress(quest: EntrepreneurshipQuest, participation: QuestParticipation): number {
    const totalTasks = quest.phases.reduce((sum, phase) => sum + phase.tasks.length, 0);
    const completedTasks = participation.completedTasks.length;
    return (completedTasks / totalTasks) * 100;
  }

  async getPlayerQuests(playerId: string): Promise<QuestParticipation[]> {
    return this.participations.get(playerId) || [];
  }

  async getAvailableQuests(): Promise<EntrepreneurshipQuest[]> {
    return Array.from(this.quests.values());
  }
}

export interface QuestParticipation {
  id: string;
  playerId: string;
  questId: string;
  startTime: Date;
  endTime?: Date;
  status: 'in_progress' | 'completed' | 'failed';
  currentPhase: number;
  completedTasks: CompletedTask[];
  progress: number;
}

export interface CompletedTask {
  taskId: string;
  deliverable: string;
  completedAt: Date;
}
