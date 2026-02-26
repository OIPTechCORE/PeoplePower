// ========================================
// COLLABORATIVE SYSTEMS
// Mentorship, knowledge sharing, and collaborative learning platforms
// ========================================

export interface MentorshipPlatform {
  createMentorshipProgram(program: MentorshipProgram): Promise<string>;
  applyForMentorship(application: MentorshipApplication): Promise<string>;
  matchMentorsAndMentees(criteria: MatchingCriteria): Promise<MentorshipMatch[]>;
  scheduleSession(session: MentorshipSession): Promise<string>;
  provideFeedback(feedback: SessionFeedback): Promise<void>;
  getMentorshipPrograms(): Promise<MentorshipProgram[]>;
  getMentorshipHistory(playerId: string): Promise<MentorshipSession[]>;
}

export interface KnowledgeSharing {
  createPost(post: KnowledgePost): Promise<string>;
  commentOnPost(postId: string, comment: Comment): Promise<string>;
  upvotePost(postId: string, playerId: string): Promise<void>;
  shareResource(resource: SharedResource): Promise<string>;
  getPosts(filters?: PostFilters): Promise<KnowledgePost[]>;
  getTrendingTopics(): Promise<TrendingTopic[]>;
  searchContent(query: string): Promise<SearchResult[]>;
}

export interface CollaborativeLearning {
  createStudyGroup(group: StudyGroup): Promise<string>;
  joinStudyGroup(groupId: string, playerId: string): Promise<void>;
  scheduleGroupSession(session: GroupSession): Promise<string>;
  collaborateOnProject(project: CollaborativeProject): Promise<string>;
  contributeToContribution(projectId: string, contribution: Contribution): Promise<string>;
  getStudyGroups(playerId?: string): Promise<StudyGroup[]>;
  getActiveProjects(playerId: string): Promise<CollaborativeProject[]>;
}

export interface MentorshipProgram {
  id: string;
  title: string;
  description: string;
  category: string;
  requirements: string[];
  benefits: string[];
  duration: number; // in weeks
  maxMentees: number;
  mentorRequirements: MentorRequirement[];
  menteeRequirements: MenteeRequirement[];
  status: 'active' | 'inactive' | 'full';
  createdAt: Date;
}

export interface MentorRequirement {
  skill: string;
  minLevel: number;
  experience: string;
  availability: string;
}

export interface MenteeRequirement {
  skillLevel: string;
  goals: string[];
  commitment: string;
  background?: string;
}

export interface MentorshipApplication {
  id: string;
  playerId: string;
  programId: string;
  type: 'mentor' | 'mentee';
  profile: MentorshipProfile;
  motivation: string;
  availability: AvailabilityWindow[];
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'matched';
}

export interface MentorshipProfile {
  skills: Skill[];
  experience: Experience[];
  interests: string[];
  goals: string[];
  background: string;
}

export interface Skill {
  name: string;
  level: number;
  yearsExperience: number;
  certifications?: string[];
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface AvailabilityWindow {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timezone: string;
}

export interface MatchingCriteria {
  programId: string;
  skills: string[];
  goals: string[];
  availability: AvailabilityWindow[];
  preferences: MatchingPreference[];
}

export interface MatchingPreference {
  type: 'skill_level' | 'experience' | 'availability' | 'background' | 'goals';
  weight: number;
  criteria: string;
}

export interface MentorshipMatch {
  id: string;
  mentorId: string;
  menteeId: string;
  programId: string;
  matchScore: number;
  matchReasons: string[];
  status: 'pending' | 'accepted' | 'rejected' | 'active' | 'completed';
  matchedAt: Date;
}

export interface MentorshipSession {
  id: string;
  matchId: string;
  type: 'video_call' | 'chat' | 'in_person' | 'workshop';
  scheduledAt: Date;
  duration: number;
  topic: string;
  agenda: string[];
  notes?: string;
  recordingUrl?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  feedback?: SessionFeedback;
}

export interface SessionFeedback {
  rating: number;
  comments: string;
  takeaways: string[];
  improvements: string[];
  wouldRecommend: boolean;
}

export interface KnowledgePost {
  id: string;
  authorId: string;
  title: string;
  content: string;
  type: 'article' | 'question' | 'tutorial' | 'resource' | 'announcement';
  tags: string[];
  attachments: Attachment[];
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
  status: 'published' | 'draft' | 'archived';
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  parentId?: string;
  upvotes: number;
  downvotes: number;
  replies: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'video' | 'link';
  url: string;
  size: number;
}

export interface SharedResource {
  id: string;
  contributorId: string;
  title: string;
  description: string;
  type: 'template' | 'tool' | 'guide' | 'example' | 'link';
  content: string;
  url?: string;
  tags: string[];
  downloads: number;
  rating: number;
  reviews: ResourceReview[];
  createdAt: Date;
}

export interface ResourceReview {
  id: string;
  reviewerId: string;
  rating: number;
  comment: string;
  helpful: number;
  createdAt: Date;
}

export interface PostFilters {
  type?: string;
  tags?: string[];
  author?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: 'newest' | 'oldest' | 'popular' | 'most_discussed';
}

export interface TrendingTopic {
  topic: string;
  postCount: number;
  engagement: number;
  growth: number;
  relatedTags: string[];
}

export interface SearchResult {
  type: 'post' | 'resource' | 'user' | 'group';
  id: string;
  title: string;
  description: string;
  relevance: number;
  url: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subject: string;
  maxMembers: number;
  currentMembers: string[];
  creatorId: string;
  moderators: string[];
  goals: string[];
  resources: SharedResource[];
  sessions: GroupSession[];
  projects: CollaborativeProject[];
  rules: GroupRule[];
  status: 'active' | 'inactive' | 'archived';
  createdAt: Date;
}

export interface GroupRule {
  id: string;
  title: string;
  description: string;
  enforced: boolean;
  createdAt: Date;
}

export interface GroupSession {
  id: string;
  groupId: string;
  title: string;
  description: string;
  type: 'study' | 'discussion' | 'workshop' | 'review';
  scheduledAt: Date;
  duration: number;
  hostId: string;
  attendees: string[];
  materials: SharedResource[];
  recordingUrl?: string;
  notes?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

export interface CollaborativeProject {
  id: string;
  title: string;
  description: string;
  type: 'research' | 'development' | 'design' | 'writing' | 'presentation';
  goals: string[];
  requirements: ProjectRequirement[];
  contributors: ProjectContributor[];
  tasks: ProjectTask[];
  milestones: ProjectMilestone[];
  resources: SharedResource[];
  communications: ProjectCommunication[];
  status: 'planning' | 'active' | 'review' | 'completed' | 'cancelled';
  createdAt: Date;
  deadline?: Date;
}

export interface ProjectRequirement {
  id: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo?: string;
}

export interface ProjectContributor {
  playerId: string;
  role: string;
  permissions: string[];
  joinedAt: Date;
  contributionScore: number;
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string[];
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: Date;
  dependencies: string[];
  estimatedHours: number;
  actualHours?: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  tasks: string[];
  status: 'pending' | 'completed';
  completedAt?: Date;
}

export interface ProjectCommunication {
  id: string;
  type: 'message' | 'file' | 'meeting' | 'decision';
  authorId: string;
  content: string;
  attachments: Attachment[];
  timestamp: Date;
  replies: ProjectCommunication[];
}

export interface Contribution {
  id: string;
  contributorId: string;
  type: 'code' | 'content' | 'design' | 'research' | 'feedback';
  content: string;
  files: Attachment[];
  description: string;
  timestamp: Date;
  reviews: ContributionReview[];
  status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
}

export interface ContributionReview {
  id: string;
  reviewerId: string;
  rating: number;
  comment: string;
  suggestions: string[];
  approved: boolean;
  timestamp: Date;
}

// Implementation classes
export class MentorshipPlatformImpl implements MentorshipPlatform {
  private programs: Map<string, MentorshipProgram> = new Map();
  private applications: Map<string, MentorshipApplication> = new Map();
  private matches: Map<string, MentorshipMatch> = new Map();
  private sessions: Map<string, MentorshipSession> = new Map();

  async createMentorshipProgram(program: Omit<MentorshipProgram, 'id' | 'createdAt'>): Promise<string> {
    const id = `program_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newProgram: MentorshipProgram = {
      ...program,
      id,
      createdAt: new Date()
    };
    this.programs.set(id, newProgram);
    return id;
  }

  async applyForMentorship(application: Omit<MentorshipApplication, 'id' | 'submittedAt' | 'status'>): Promise<string> {
    const id = `application_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newApplication: MentorshipApplication = {
      ...application,
      id,
      submittedAt: new Date(),
      status: 'pending'
    };
    this.applications.set(id, newApplication);
    return id;
  }

  async matchMentorsAndMentees(criteria: MatchingCriteria): Promise<MentorshipMatch[]> {
    const program = this.programs.get(criteria.programId);
    if (!program) throw new Error('Program not found');

    const mentorApplications = Array.from(this.applications.values())
      .filter(a => a.programId === criteria.programId && a.type === 'mentor' && a.status === 'approved');
    
    const menteeApplications = Array.from(this.applications.values())
      .filter(a => a.programId === criteria.programId && a.type === 'mentee' && a.status === 'approved');

    const matches: MentorshipMatch[] = [];

    for (const mentee of menteeApplications) {
      for (const mentor of mentorApplications) {
        const matchScore = this.calculateMatchScore(mentor.profile, mentee.profile, criteria);
        if (matchScore > 0.7) { // Threshold for matching
          const matchId = `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const match: MentorshipMatch = {
            id: matchId,
            mentorId: mentor.playerId,
            menteeId: mentee.playerId,
            programId: criteria.programId,
            matchScore,
            matchReasons: this.generateMatchReasons(mentor.profile, mentee.profile),
            status: 'pending',
            matchedAt: new Date()
          };
          matches.push(match);
          this.matches.set(matchId, match);
        }
      }
    }

    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  async scheduleSession(session: Omit<MentorshipSession, 'id' | 'status'>): Promise<string> {
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newSession: MentorshipSession = {
      ...session,
      id,
      status: 'scheduled'
    };
    this.sessions.set(id, newSession);
    return id;
  }

  async provideFeedback(feedback: SessionFeedback): Promise<void> {
    // Find session and update feedback
    for (const session of this.sessions.values()) {
      if (session.status === 'completed' && !session.feedback) {
        session.feedback = feedback;
        break;
      }
    }
  }

  async getMentorshipPrograms(): Promise<MentorshipProgram[]> {
    return Array.from(this.programs.values()).filter(p => p.status === 'active');
  }

  async getMentorshipHistory(playerId: string): Promise<MentorshipSession[]> {
    return Array.from(this.sessions.values())
      .filter(session => {
        const match = this.matches.get(session.matchId);
        return match && (match.mentorId === playerId || match.menteeId === playerId);
      });
  }

  private calculateMatchScore(mentor: MentorshipProfile, mentee: MentorshipProfile, criteria: MatchingCriteria): number {
    let score = 0;
    let factors = 0;

    // Skill compatibility
    const mentorSkills = new Set(mentor.skills.map(s => s.name));
    const menteeSkills = new Set(mentee.skills.map(s => s.name));
    const commonSkills = [...mentorSkills].filter(skill => menteeSkills.has(skill));
    
    if (commonSkills.length > 0) {
      score += (commonSkills.length / Math.max(mentorSkills.size, menteeSkills.size)) * 0.4;
      factors += 0.4;
    }

    // Goals alignment
    const commonGoals = mentor.goals.filter(goal => mentee.goals.includes(goal));
    if (commonGoals.length > 0) {
      score += (commonGoals.length / Math.max(mentor.goals.length, mentee.goals.length)) * 0.3;
      factors += 0.3;
    }

    // Experience level compatibility
    const mentorAvgLevel = mentor.skills.reduce((sum, s) => sum + s.level, 0) / mentor.skills.length;
    const menteeAvgLevel = mentee.skills.reduce((sum, s) => sum + s.level, 0) / mentee.skills.length;
    
    if (mentorAvgLevel > menteeAvgLevel + 2) {
      score += 0.3;
      factors += 0.3;
    }

    return factors > 0 ? score / factors : 0;
  }

  private generateMatchReasons(mentor: MentorshipProfile, mentee: MentorshipProfile): string[] {
    const reasons: string[] = [];
    
    const commonSkills = mentor.skills.filter(ms => 
      mentee.skills.some(mes => mes.name === ms.name)
    );
    
    if (commonSkills.length > 0) {
      reasons.push(`Shared expertise in ${commonSkills.map(s => s.name).join(', ')}`);
    }

    const commonGoals = mentor.goals.filter(goal => mentee.goals.includes(goal));
    if (commonGoals.length > 0) {
      reasons.push(`Aligned goals: ${commonGoals.join(', ')}`);
    }

    return reasons;
  }
}

export class KnowledgeSharingImpl implements KnowledgeSharing {
  private posts: Map<string, KnowledgePost> = new Map();
  private resources: Map<string, SharedResource> = new Map();
  private upvotes: Map<string, Set<string>> = new Map(); // postId -> playerIds

  async createPost(post: Omit<KnowledgePost, 'id' | 'upvotes' | 'downvotes' | 'comments' | 'views' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> {
    const id = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newPost: KnowledgePost = {
      ...post,
      id,
      upvotes: 0,
      downvotes: 0,
      comments: [],
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'published'
    };
    this.posts.set(id, newPost);
    return id;
  }

  async commentOnPost(postId: string, comment: Omit<Comment, 'id' | 'upvotes' | 'downvotes' | 'replies' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const post = this.posts.get(postId);
    if (!post) throw new Error('Post not found');

    const id = `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newComment: Comment = {
      ...comment,
      id,
      upvotes: 0,
      downvotes: 0,
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (comment.parentId) {
      // Add as reply to parent comment
      const parentComment = this.findComment(post.comments, comment.parentId);
      if (parentComment) {
        parentComment.replies.push(newComment);
      }
    } else {
      // Add as top-level comment
      post.comments.push(newComment);
    }

    post.updatedAt = new Date();
    return id;
  }

  async upvotePost(postId: string, playerId: string): Promise<void> {
    const post = this.posts.get(postId);
    if (!post) throw new Error('Post not found');

    const postUpvotes = this.upvotes.get(postId) || new Set();
    
    if (postUpvotes.has(playerId)) {
      postUpvotes.delete(playerId);
      post.upvotes--;
    } else {
      postUpvotes.add(playerId);
      post.upvotes++;
    }
    
    this.upvotes.set(postId, postUpvotes);
    post.updatedAt = new Date();
  }

  async shareResource(resource: Omit<SharedResource, 'id' | 'downloads' | 'rating' | 'reviews' | 'createdAt'>): Promise<string> {
    const id = `resource_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newResource: SharedResource = {
      ...resource,
      id,
      downloads: 0,
      rating: 0,
      reviews: [],
      createdAt: new Date()
    };
    this.resources.set(id, newResource);
    return id;
  }

  async getPosts(filters?: PostFilters): Promise<KnowledgePost[]> {
    let posts = Array.from(this.posts.values()).filter(p => p.status === 'published');

    if (filters) {
      if (filters.type) {
        posts = posts.filter(p => p.type === filters.type);
      }
      if (filters.tags && filters.tags.length > 0) {
        posts = posts.filter(p => filters.tags!.some(tag => p.tags.includes(tag)));
      }
      if (filters.author) {
        posts = posts.filter(p => p.authorId === filters.author);
      }
      if (filters.dateRange) {
        posts = posts.filter(p => 
          p.createdAt >= filters.dateRange!.start && 
          p.createdAt <= filters.dateRange!.end
        );
      }
    }

    // Sort posts
    posts.sort((a, b) => {
      switch (filters?.sortBy) {
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'popular':
          return b.upvotes - a.upvotes;
        case 'most_discussed':
          return b.comments.length - a.comments.length;
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

    return posts;
  }

  async getTrendingTopics(): Promise<TrendingTopic[]> {
    const topicMap = new Map<string, { posts: number; engagement: number }>();

    this.posts.forEach(post => {
      post.tags.forEach(tag => {
        const existing = topicMap.get(tag) || { posts: 0, engagement: 0 };
        existing.posts++;
        existing.engagement += post.upvotes + post.comments.length;
        topicMap.set(tag, existing);
      });
    });

    return Array.from(topicMap.entries())
      .map(([topic, data]) => ({
        topic,
        postCount: data.posts,
        engagement: data.engagement,
        growth: this.calculateTopicGrowth(topic),
        relatedTags: this.getRelatedTags(topic)
      }))
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 10);
  }

  async searchContent(query: string): Promise<SearchResult[]> {
    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search posts
    this.posts.forEach(post => {
      if (post.title.toLowerCase().includes(lowerQuery) || 
          post.content.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'post',
          id: post.id,
          title: post.title,
          description: post.content.substring(0, 200),
          relevance: this.calculateRelevance(query, post.title + ' ' + post.content),
          url: `/posts/${post.id}`
        });
      }
    });

    // Search resources
    this.resources.forEach(resource => {
      if (resource.title.toLowerCase().includes(lowerQuery) || 
          resource.description.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'resource',
          id: resource.id,
          title: resource.title,
          description: resource.description,
          relevance: this.calculateRelevance(query, resource.title + ' ' + resource.description),
          url: `/resources/${resource.id}`
        });
      }
    });

    return results.sort((a, b) => b.relevance - a.relevance).slice(0, 20);
  }

  private findComment(comments: Comment[], commentId: string): Comment | undefined {
    for (const comment of comments) {
      if (comment.id === commentId) return comment;
      const found = this.findComment(comment.replies, commentId);
      if (found) return found;
    }
    return undefined;
  }

  private calculateTopicGrowth(topic: string): number {
    // Implementation would calculate growth over time
    return Math.random() * 100; // Placeholder
  }

  private getRelatedTags(topic: string): string[] {
    // Implementation would find related tags
    return ['related1', 'related2']; // Placeholder
  }

  private calculateRelevance(query: string, content: string): number {
    const queryTerms = query.toLowerCase().split(' ');
    const contentLower = content.toLowerCase();
    
    const matches = queryTerms.filter(term => contentLower.includes(term));
    return matches.length / queryTerms.length;
  }
}

export class CollaborativeLearningImpl implements CollaborativeLearning {
  private groups: Map<string, StudyGroup> = new Map();
  private sessions: Map<string, GroupSession> = new Map();
  private projects: Map<string, CollaborativeProject> = new Map();

  async createStudyGroup(group: Omit<StudyGroup, 'id' | 'currentMembers' | 'sessions' | 'projects' | 'createdAt'>): Promise<string> {
    const id = `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newGroup: StudyGroup = {
      ...group,
      id,
      currentMembers: [group.creatorId],
      sessions: [],
      projects: [],
      createdAt: new Date()
    };
    this.groups.set(id, newGroup);
    return id;
  }

  async joinStudyGroup(groupId: string, playerId: string): Promise<void> {
    const group = this.groups.get(groupId);
    if (!group) throw new Error('Group not found');

    if (group.currentMembers.length >= group.maxMembers) {
      throw new Error('Group is full');
    }

    if (!group.currentMembers.includes(playerId)) {
      group.currentMembers.push(playerId);
    }
  }

  async scheduleGroupSession(session: Omit<GroupSession, 'id' | 'attendees' | 'status'>): Promise<string> {
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newSession: GroupSession = {
      ...session,
      id,
      attendees: [],
      status: 'scheduled'
    };
    this.sessions.set(id, newSession);

    // Add session to group
    const group = this.groups.get(session.groupId);
    if (group) {
      group.sessions.push(newSession);
    }

    return id;
  }

  async collaborateOnProject(project: Omit<CollaborativeProject, 'id' | 'contributors' | 'tasks' | 'milestones' | 'communications' | 'createdAt'>): Promise<string> {
    const id = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newProject: CollaborativeProject = {
      ...project,
      id,
      contributors: [],
      tasks: [],
      milestones: [],
      communications: [],
      createdAt: new Date()
    };
    this.projects.set(id, newProject);
    return id;
  }

  async contributeToContribution(projectId: string, contribution: Omit<Contribution, 'id' | 'reviews' | 'status'>): Promise<string> {
    const project = this.projects.get(projectId);
    if (!project) throw new Error('Project not found');

    const id = `contribution_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newContribution: Contribution = {
      ...contribution,
      id,
      reviews: [],
      status: 'pending'
    };

    // Add contribution to project communications
    project.communications.push({
      id: `comm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'message',
      authorId: contribution.contributorId,
      content: `New contribution: ${contribution.description}`,
      attachments: contribution.files,
      timestamp: new Date(),
      replies: []
    });

    return id;
  }

  async getStudyGroups(playerId?: string): Promise<StudyGroup[]> {
    let groups = Array.from(this.groups.values()).filter(g => g.status === 'active');
    
    if (playerId) {
      groups = groups.filter(g => g.currentMembers.includes(playerId));
    }

    return groups;
  }

  async getActiveProjects(playerId: string): Promise<CollaborativeProject[]> {
    return Array.from(this.projects.values())
      .filter(p => 
        p.status === 'active' && 
        p.contributors.some(c => c.playerId === playerId)
      );
  }
}

// Export instances for easy use
export const MentorshipPlatform = new MentorshipPlatformImpl();
export const KnowledgeSharing = new KnowledgeSharingImpl();
export const CollaborativeLearning = new CollaborativeLearningImpl();
