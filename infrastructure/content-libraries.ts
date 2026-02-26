// ========================================
// CONTENT LIBRARIES
// Centralized content management for courses, challenges, and quests
// ========================================

import { MicroCourse, LeadershipChallenge, EntrepreneurshipQuest } from './education-engines';

export interface CourseLibrary {
  courses: Map<string, MicroCourse>;
  categories: Map<string, CourseCategory>;
  tags: Map<string, string[]>;
}

export interface CourseCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface ChallengeLibrary {
  challenges: Map<string, LeadershipChallenge>;
  scenarios: Map<string, ChallengeScenario>;
  skillMaps: Map<string, string[]>;
}

export interface ChallengeScenario {
  id: string;
  title: string;
  description: string;
  context: string;
  stakeholders: string[];
  constraints: string[];
  objectives: string[];
}

export interface QuestLibrary {
  quests: Map<string, EntrepreneurshipQuest>;
  businessIdeas: Map<string, BusinessIdea>;
  resources: Map<string, QuestResource>;
}

export interface BusinessIdea {
  id: string;
  title: string;
  description: string;
  market: string;
  investment: number;
  timeline: string;
  skills: string[];
}

export interface QuestResource {
  id: string;
  title: string;
  type: 'template' | 'guide' | 'tool' | 'example';
  content: string;
  url?: string;
  downloadUrl?: string;
}

export class CourseLibraryManager {
  private library: CourseLibrary = {
    courses: new Map(),
    categories: new Map(),
    tags: new Map()
  };

  async addCourse(course: MicroCourse): Promise<void> {
    this.library.courses.set(course.id, course);
  }

  async getCourse(id: string): Promise<MicroCourse | undefined> {
    return this.library.courses.get(id);
  }

  async getCoursesByCategory(categoryId: string): Promise<MicroCourse[]> {
    return Array.from(this.library.courses.values())
      .filter(course => course.category === categoryId);
  }

  async searchCourses(query: string): Promise<MicroCourse[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.library.courses.values())
      .filter(course => 
        course.title.toLowerCase().includes(lowerQuery) ||
        course.description.toLowerCase().includes(lowerQuery)
      );
  }

  async addCategory(category: CourseCategory): Promise<void> {
    this.library.categories.set(category.id, category);
  }

  async getCategories(): Promise<CourseCategory[]> {
    return Array.from(this.library.categories.values());
  }

  async getFeaturedCourses(limit: number = 10): Promise<MicroCourse[]> {
    return Array.from(this.library.courses.values())
      .slice(0, limit);
  }

  async getCoursesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): Promise<MicroCourse[]> {
    return Array.from(this.library.courses.values())
      .filter(course => course.difficulty === difficulty);
  }

  async updateCourse(id: string, updates: Partial<MicroCourse>): Promise<boolean> {
    const course = this.library.courses.get(id);
    if (!course) return false;

    Object.assign(course, updates);
    this.library.courses.set(id, course);
    return true;
  }

  async deleteCourse(id: string): Promise<boolean> {
    return this.library.courses.delete(id);
  }

  async getLibraryStats(): Promise<{
    totalCourses: number;
    totalCategories: number;
    averageDuration: number;
  }> {
    const courses = Array.from(this.library.courses.values());
    const totalDuration = courses.reduce((sum, course) => sum + course.duration, 0);
    
    return {
      totalCourses: courses.length,
      totalCategories: this.library.categories.size,
      averageDuration: courses.length > 0 ? totalDuration / courses.length : 0
    };
  }
}

export class ChallengeLibraryManager {
  private library: ChallengeLibrary = {
    challenges: new Map(),
    scenarios: new Map(),
    skillMaps: new Map()
  };

  async addChallenge(challenge: LeadershipChallenge): Promise<void> {
    this.library.challenges.set(challenge.id, challenge);
  }

  async getChallenge(id: string): Promise<LeadershipChallenge | undefined> {
    return this.library.challenges.get(id);
  }

  async getChallengesByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Promise<LeadershipChallenge[]> {
    return Array.from(this.library.challenges.values())
      .filter(challenge => challenge.difficulty === difficulty);
  }

  async getChallengesBySkill(skill: string): Promise<LeadershipChallenge[]> {
    return Array.from(this.library.challenges.values())
      .filter(challenge => challenge.skills.includes(skill));
  }

  async addScenario(scenario: ChallengeScenario): Promise<void> {
    this.library.scenarios.set(scenario.id, scenario);
  }

  async getScenario(id: string): Promise<ChallengeScenario | undefined> {
    return this.library.scenarios.get(id);
  }

  async getRandomChallenge(difficulty?: string): Promise<LeadershipChallenge | undefined> {
    const challenges = Array.from(this.library.challenges.values());
    const filtered = difficulty ? challenges.filter(c => c.difficulty === difficulty) : challenges;
    
    if (filtered.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * filtered.length);
    return filtered[randomIndex];
  }

  async getRecommendedChallenges(playerSkills: string[]): Promise<LeadershipChallenge[]> {
    const challenges = Array.from(this.library.challenges.values());
    
    return challenges
      .filter(challenge => 
        challenge.skills.some(skill => playerSkills.includes(skill))
      )
      .slice(0, 5);
  }

  async updateChallenge(id: string, updates: Partial<LeadershipChallenge>): Promise<boolean> {
    const challenge = this.library.challenges.get(id);
    if (!challenge) return false;

    Object.assign(challenge, updates);
    this.library.challenges.set(id, challenge);
    return true;
  }

  async deleteChallenge(id: string): Promise<boolean> {
    return this.library.challenges.delete(id);
  }

  async getLibraryStats(): Promise<{
    totalChallenges: number;
    totalScenarios: number;
    difficultyDistribution: Record<string, number>;
  }> {
    const challenges = Array.from(this.library.challenges.values());
    const difficultyDistribution = challenges.reduce((acc, challenge) => {
      acc[challenge.difficulty] = (acc[challenge.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalChallenges: challenges.length,
      totalScenarios: this.library.scenarios.size,
      difficultyDistribution
    };
  }
}

export class QuestLibraryManager {
  private library: QuestLibrary = {
    quests: new Map(),
    businessIdeas: new Map(),
    resources: new Map()
  };

  async addQuest(quest: EntrepreneurshipQuest): Promise<void> {
    this.library.quests.set(quest.id, quest);
  }

  async getQuest(id: string): Promise<EntrepreneurshipQuest | undefined> {
    return this.library.quests.get(id);
  }

  async getQuestsByInvestment(minInvestment: number, maxInvestment?: number): Promise<EntrepreneurshipQuest[]> {
    return Array.from(this.library.quests.values())
      .filter(quest => {
        if (maxInvestment) {
          return quest.rewards.funding >= minInvestment && quest.rewards.funding <= maxInvestment;
        }
        return quest.rewards.funding >= minInvestment;
      });
  }

  async addBusinessIdea(idea: BusinessIdea): Promise<void> {
    this.library.businessIdeas.set(idea.id, idea);
  }

  async getBusinessIdea(id: string): Promise<BusinessIdea | undefined> {
    return this.library.businessIdeas.get(id);
  }

  async getBusinessIdeasByMarket(market: string): Promise<BusinessIdea[]> {
    return Array.from(this.library.businessIdeas.values())
      .filter(idea => idea.market === market);
  }

  async addResource(resource: QuestResource): Promise<void> {
    this.library.resources.set(resource.id, resource);
  }

  async getResource(id: string): Promise<QuestResource | undefined> {
    return this.library.resources.get(id);
  }

  async getResourcesByType(type: 'template' | 'guide' | 'tool' | 'example'): Promise<QuestResource[]> {
    return Array.from(this.library.resources.values())
      .filter(resource => resource.type === type);
  }

  async getRecommendedQuests(playerSkills: string[], interests: string[]): Promise<EntrepreneurshipQuest[]> {
    const quests = Array.from(this.library.quests.values());
    
    return quests
      .filter(quest => {
        const skillMatch = quest.requirements.some(req => playerSkills.includes(req));
        const interestMatch = interests.some(interest => 
          quest.title.toLowerCase().includes(interest.toLowerCase()) ||
          quest.description.toLowerCase().includes(interest.toLowerCase())
        );
        return skillMatch || interestMatch;
      })
      .slice(0, 5);
  }

  async updateQuest(id: string, updates: Partial<EntrepreneurshipQuest>): Promise<boolean> {
    const quest = this.library.quests.get(id);
    if (!quest) return false;

    Object.assign(quest, updates);
    this.library.quests.set(id, quest);
    return true;
  }

  async deleteQuest(id: string): Promise<boolean> {
    return this.library.quests.delete(id);
  }

  async getLibraryStats(): Promise<{
    totalQuests: number;
    totalBusinessIdeas: number;
    totalResources: number;
    averageFunding: number;
  }> {
    const quests = Array.from(this.library.quests.values());
    const totalFunding = quests.reduce((sum, quest) => sum + quest.rewards.funding, 0);
    
    return {
      totalQuests: quests.length,
      totalBusinessIdeas: this.library.businessIdeas.size,
      totalResources: this.library.resources.size,
      averageFunding: quests.length > 0 ? totalFunding / quests.length : 0
    };
  }
}

// Export instances for easy use
export const CourseLibrary = new CourseLibraryManager();
export const ChallengeLibrary = new ChallengeLibraryManager();
export const QuestLibrary = new QuestLibraryManager();
