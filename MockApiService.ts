
import {
  Product, AppUser, Order, BlogPost, Enquiry,
  CMSPageConfig, Feedback, FeedbackStatus,
  SEOKeyword, SEOAutomationRule, SEOPerformanceMetric,
  EnquiryMessage, EnquiryAnalytics, FeedbackAnalytics,
  ProductStatus
} from './types';
import { MockDB } from './MockDB';
import { SEED_CMS_CONFIG, SEED_USERS, SEED_PROJECTS, SEED_BLOGS } from './SeedData';

/**
 * INTEGRATION BRIDGE: MockApiService
 * High-fidelity orchestration of marketplace and product genesis.
 */
export class MockApiService {
  private static delay(ms = 800) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async initialize() {
    await MockDB.save('cms_config', [SEED_CMS_CONFIG]);
    await MockDB.init('users', SEED_USERS);
    await MockDB.init('projects', SEED_PROJECTS);
    await MockDB.init('blogs', SEED_BLOGS);
    await MockDB.init('enquiries', []);
    await MockDB.init('feedbacks', []);
    await MockDB.init('logs', []);
  }

  // --- CMS ---
  static async getCMSConfig(): Promise<CMSPageConfig> {
    const configs = await MockDB.getAll<CMSPageConfig>('cms_config');
    return configs[0];
  }

  static async updateCMSConfig(updates: Partial<CMSPageConfig>): Promise<CMSPageConfig> {
    const config = await this.getCMSConfig();
    const updated = await MockDB.update<CMSPageConfig>('cms_config', config.id, updates);
    return updated!;
  }

  // --- Auth & Users ---
  static async login(email: string, password?: string): Promise<AppUser | null> {
    await this.delay(500);
    const users = await MockDB.getAll<AppUser>('users');
    const user = users.find(u => u.email === email);
    if (user) {
      localStorage.setItem('psp_token', 'mock_jwt_token_' + Date.now());
      return user;
    }
    return null;
  }

  static async getUsers(): Promise<AppUser[]> {
    return MockDB.getAll<AppUser>('users');
  }

  static async createUser(user: Partial<AppUser>): Promise<AppUser> {
    const newUser = {
      ...user,
      id: user.id || 'usr-' + Date.now(),
      status: user.status || 'active',
      role: user.role || 'user',
      joinedAt: new Date().toISOString(),
      avatar: user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user.email || 'anon'),
      plan: user.plan || 'Free'
    } as AppUser;
    return MockDB.create('users', newUser);
  }

  static async updateUser(id: string, updates: Partial<AppUser>): Promise<AppUser> {
    const res = await MockDB.update<AppUser>('users', id, updates);
    return res!;
  }

  static async deleteUser(id: string): Promise<boolean> {
    return MockDB.delete('users', id);
  }

  // --- ProductForge Engine™ ---
  static async getProjects(): Promise<Product[]> {
    const projects = await MockDB.getAll<Product>('projects');
    // Hydrate with mock reviews for demo
    const allFeedback = await this.getGlobalFeedbacks();
    return projects.map(p => ({
      ...p,
      reviews: allFeedback.filter(f => f.status === 'approved' || f.status === 'featured') // In real app, filter by product ID
    }));
  }

  static async createProject(project: Partial<Product>): Promise<Product> {
    const newProject = {
      ...project,
      id: project.id || 'p-' + Date.now(),
      status: project.status || 'draft',
      version: project.version || '1.0.0',
      downloads: 0,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Product;
    return MockDB.create('projects', newProject);
  }

  static async updateProject(id: string, updates: Partial<Product>): Promise<Product> {
    const res = await MockDB.update<Product>('projects', id, { ...updates, updatedAt: new Date().toISOString() });
    return res!;
  }

  static async cloneProject(id: string): Promise<Product> {
    const projects = await this.getProjects();
    const project = projects.find(p => p.id === id);
    if (!project) throw new Error("Project node not found.");
    const cloned = {
      ...project,
      id: 'p-' + Date.now(),
      name: `${project.name} (Replication)`,
      sku: `SKU-CLONE-${Math.random().toString(36).substring(7).toUpperCase()}`,
      slug: `${project.slug}-clone`,
      // Fix: Ensured status is cast to ProductStatus
      status: 'draft' as ProductStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return MockDB.create('projects', cloned);
  }

  // --- SmartConnect Enquiry Engine™ ---
  static async getEnquiries(): Promise<Enquiry[]> {
    const stored = await MockDB.getAll<Enquiry>('enquiries');
    if (stored.length > 0) return stored;

    const seed: Enquiry[] = [
      {
        id: 'ENQ-9001',
        userName: 'Sarah Jenkins',
        email: 'sarah.j@tech-corp.io',
        phone: '+1 (555) 012-3456',
        subject: 'Enterprise License Inquiry for Horizon UI',
        message: 'We are looking to equip our 50-person engineering team with the Horizon UI kit. Do you offer volume licensing or team seats?',
        enquiry_type: 'sales',
        status: 'new',
        priority: 'high',
        source: 'Landing Page',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        sla_deadline: '22h',
        thread: [
          { id: 'm1', sender: 'user', senderName: 'Sarah Jenkins', text: 'We are looking to equip our 50-person engineering team with the Horizon UI kit. Do you offer volume licensing or team seats?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() }
        ],
        internal_notes: 'Potential high-value lead. Check if they need a demo.',
        activity_log: [
          { id: 'l1', action: 'Enquiry Received', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), performedBy: 'System' }
        ]
      },
      {
        id: 'ENQ-9002',
        userName: 'David Miller',
        email: 'david.m@startups.net',
        phone: '+44 20 7123 4567',
        subject: 'Custom Development Services',
        message: 'I really like your dashboard components. Are you available for freelance work to help us build a custom CRM on top of this?',
        enquiry_type: 'custom',
        status: 'open',
        priority: 'medium',
        source: 'Portfolio',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        sla_deadline: '4h',
        thread: [
          { id: 'm1', sender: 'user', senderName: 'David Miller', text: 'I really like your dashboard components. Are you available for freelance work to help us build a custom CRM on top of this?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() }
        ],
        internal_notes: '',
        activity_log: [
          { id: 'l1', action: 'Enquiry Received', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), performedBy: 'System' }
        ]
      },
      {
        id: 'ENQ-9003',
        userName: 'Emily Chen',
        email: 'emily@design-studio.co',
        subject: 'Format Compatibility Question',
        message: 'Does the UI kit include Figma variables for the color system? I need to know before purchasing.',
        enquiry_type: 'support',
        status: 'replied',
        priority: 'low',
        source: 'Contact Form',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        sla_deadline: 'CLEARED',
        thread: [
          { id: 'm1', sender: 'user', senderName: 'Emily Chen', text: 'Does the UI kit include Figma variables for the color system? I need to know before purchasing.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
          { id: 'm2', sender: 'admin', senderName: 'Support Team', text: 'Yes, Emily! The kit fully supports Figma variables for colors, spacing, and radius.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString() }
        ],
        internal_notes: 'Answered via FAQ standard response.',
        activity_log: [
          { id: 'l1', action: 'Enquiry Received', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), performedBy: 'System' },
          { id: 'l2', action: 'Reply Sent', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(), performedBy: 'System' }
        ]
      }
    ];

    await MockDB.init('enquiries', seed);
    return seed;
  }

  static async createEnquiry(enquiry: Partial<Enquiry>): Promise<Enquiry> {
    const newEnq = { ...enquiry, id: 'ENQ-' + Date.now(), created_at: new Date().toISOString(), status: 'new', thread: enquiry.thread || [], activity_log: enquiry.activity_log || [] } as Enquiry;
    return MockDB.create('enquiries', newEnq);
  }

  // Fix: Added getEnquiryAnalytics
  static async getEnquiryAnalytics(): Promise<EnquiryAnalytics> {
    return {
      newEnquiries: 4,
      avgResponseTime: '2.4h',
      urgentTickets: 1,
      conversionRate: 64
    };
  }

  // Fix: Added updateEnquiry
  static async updateEnquiry(id: string, updates: Partial<Enquiry>): Promise<Enquiry | null> {
    return MockDB.update<Enquiry>('enquiries', id, updates);
  }

  // Fix: Added addEnquiryReply
  static async addEnquiryReply(id: string, message: Partial<EnquiryMessage>): Promise<Enquiry> {
    const enquiries = await this.getEnquiries();
    const enq = enquiries.find(e => e.id === id);
    if (!enq) throw new Error("Enquiry not found");
    const newMessage: EnquiryMessage = {
      id: 'MSG-' + Date.now(),
      sender: message.sender || 'admin',
      senderName: message.senderName || 'Architect',
      text: message.text || '',
      timestamp: new Date().toISOString()
    };
    const updated = await MockDB.update<Enquiry>('enquiries', id, {
      thread: [...enq.thread, newMessage],
      status: 'replied'
    });
    return updated!;
  }

  // --- Feedback ---
  // Fix: Added submitFeedback
  static async submitFeedback(feedback: Partial<Feedback>): Promise<Feedback> {
    const newFb = {
      ...feedback,
      id: 'FB-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      sentiment: feedback.rating && feedback.rating >= 4 ? 'positive' : feedback.rating && feedback.rating <= 2 ? 'negative' : 'neutral'
    } as Feedback;
    return MockDB.create('feedbacks', newFb);
  }

  // Fix: Added getGlobalFeedbacks
  static async getGlobalFeedbacks(): Promise<Feedback[]> {
    const stored = await MockDB.getAll<Feedback>('feedbacks');
    if (stored.length > 0) return stored;

    const seed: Feedback[] = [
      {
        id: 'FB-5001',
        userName: 'Marcus Aurelius',
        isVerifiedPurchase: true,
        isVerifiedUser: true,
        rating: 5,
        title: 'Exceptional Architecture Kit',
        content: 'This UI kit is a masterpiece. The component modularity allowed our team to ship the MVP in half the estimated time. The dark mode implementation is flawless.',
        sentiment: 'positive',
        status: 'approved',
        source: 'Product Hunt',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        adminReply: 'Honor to serve a fellow builder. We are shipping the new chart modules next week!'
      },
      {
        id: 'FB-5002',
        userName: 'Unit 734',
        isVerifiedPurchase: false,
        isVerifiedUser: false,
        rating: 2,
        title: 'Documentation Gaps',
        content: 'The components are nice but the documentation lacks examples for the complex data grids. Took me hours to figure out the sorting props.',
        sentiment: 'negative',
        status: 'pending',
        source: 'Docs Feedback',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
      },
      {
        id: 'FB-5003',
        userName: 'DesignBot 9000',
        rating: 4,
        title: 'Great aesthetics, heavy bundle',
        content: 'Visually stunning but the initial bundle size is a bit heavy. Had to tree-shake aggressively to get good Lighthouse scores.',
        sentiment: 'neutral',
        status: 'approved',
        source: 'NPM Review',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
      }
    ];

    await MockDB.init('feedbacks', seed);
    return seed;
  }

  // Fix: Added getFeedbackAnalytics
  static async getFeedbackAnalytics(): Promise<FeedbackAnalytics> {
    return {
      avgRating: 4.8,
      sentimentScore: 92
    };
  }

  // Fix: Added moderateFeedback
  static async moderateFeedback(id: string, updates: Partial<Feedback>): Promise<Feedback | null> {
    return MockDB.update<Feedback>('feedbacks', id, updates);
  }

  // --- Activity Logs ---
  static async getLogs(): Promise<any[]> {
    const stored = await MockDB.getAll<any>('logs');
    if (stored.length > 0) return stored;

    const seed = [
      {
        id: 'EVT-9921',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        type: 'auth',
        action: 'User Login',
        description: 'Successful authentication via OAuth provider (Google).',
        userName: 'Alex Mercer',
        status: 'Success',
        ipAddress: '192.168.1.104'
      },
      {
        id: 'EVT-9920',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        type: 'system',
        action: 'Database Backup',
        description: 'Automated nightly snapshot completed. Size: 4.2GB.',
        userName: 'System',
        status: 'Success',
        ipAddress: 'localhost'
      },
      {
        id: 'EVT-9919',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        type: 'security',
        action: 'Failed Login Attempt',
        description: 'Multiple failed password attempts detected from unknown IP.',
        userName: 'Unknown',
        status: 'Warning',
        ipAddress: '45.22.19.112'
      },
      {
        id: 'EVT-9918',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        type: 'api',
        action: 'Payment Gateway Error',
        description: 'Stripe webhook timeout. Retrying transaction.',
        userName: 'System',
        status: 'Failure',
        ipAddress: '10.0.0.5'
      }
    ];

    await MockDB.init('logs', seed);
    return seed;
  }

  static async getStats(): Promise<any> {
    return {
      revenue: 842590,
      userCount: (await this.getUsers()).length,
      projectCount: (await this.getProjects()).length,
      orderCount: 1242
    };
  }

  // --- Neural Synthesis Proxies ---
  static async getGlobalKeywords(): Promise<SEOKeyword[]> {
    return [
      { keyword_id: 'kw1', keyword: 'saas dashboard blueprint', search_volume: 12400, difficulty: 45, intent_type: 'commercial' },
      { keyword_id: 'kw2', keyword: 'industrial react ui', search_volume: 8200, difficulty: 62, intent_type: 'transactional' }
    ];
  }

  static async getSEOAutomationRules(): Promise<SEOAutomationRule[]> {
    return [
      { rule_id: 'r1', rule_name: 'Auto-Manifest Meta', trigger_condition: 'on_genesis', action_type: 'neural_synthesis', status: 'active', priority: 'high' }
    ];
  }

  static async getGrowthSEOSummary(productId: string): Promise<{ performance: SEOPerformanceMetric[] }> {
    return {
      performance: [
        { metric_id: 'm1', date: '2024-10-20', impressions: 1200, clicks: 150, avg_position: 4.2, revenue: 1200 },
        { metric_id: 'm5', date: '2024-10-24', impressions: 1850, clicks: 245, avg_position: 2.8, revenue: 2450 },
      ]
    };
  }
  // --- Support Tickets ---
  static async getTickets(): Promise<any[]> {
    // MOCK DATA for Tickets
    const stored = await MockDB.getAll('tickets');
    if (stored.length > 0) return stored;

    // Seed if empty
    const seed = [
      {
        id: 'TK-8821', subject: 'License activation issue with Horizon Pro', category: 'License', status: 'in-progress', priority: 'high', lastUpdated: '12m ago',
        messages: [
          { id: '1', sender: 'user', text: "I'm unable to activate the commercial license key for my recent purchase.", timestamp: '1h ago', attachments: [] },
          { id: '2', sender: 'support', text: "Hello Alex! I'm sorry to hear that. Could you please provide the order ID associated with the purchase?", timestamp: '45m ago' },
          { id: '3', sender: 'user', text: "Sure, it's ORD-7241. I've attached a screenshot of the error message.", timestamp: '12m ago', attachments: [{ name: 'error_log.png', type: 'image' }] },
        ]
      },
      {
        id: 'TK-8819', subject: 'Request for custom SaaS component architecture', category: 'Technical', status: 'open', priority: 'medium', lastUpdated: '2h ago',
        messages: [
          { id: '1', sender: 'user', text: "Do you offer custom component design for the EcoShop kit?", timestamp: '2h ago' },
        ]
      },
      {
        id: 'TK-8790', subject: 'Refund request for duplicate order', category: 'Billing', status: 'resolved', priority: 'low', lastUpdated: '2 days ago',
        messages: [
          { id: '1', sender: 'user', text: "I accidentally purchased the same product twice.", timestamp: '3 days ago' },
          { id: '2', sender: 'support', text: "We have processed your refund for the duplicate order. It should reflect in your account within 3-5 business days.", timestamp: '2 days ago' },
        ]
      }
    ];
    await MockDB.init('tickets', seed);
    return seed;
  }

  static async createTicket(ticket: any): Promise<any> {
    const newTicket = {
      ...ticket,
      id: 'TK-' + Math.floor(Math.random() * 10000),
      status: 'open',
      messages: ticket.messages || [],
      lastUpdated: 'Just now'
    };
    return MockDB.create('tickets', newTicket);
  }

  static async updateTicket(id: string, updates: any): Promise<any> {
    return MockDB.update('tickets', id, updates);
  }

  static async addTicketMessage(ticketId: string, message: any): Promise<any> {
    const tickets = await this.getTickets();
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) throw new Error("Ticket node not found");

    const updated = {
      ...ticket,
      messages: [...ticket.messages, message],
      lastUpdated: 'Just now',
      status: message.sender === 'support' ? 'in-progress' : ticket.status
    };
    return MockDB.update('tickets', ticketId, updated);
  }

  static async getTicketAnalytics(): Promise<any> {
    return {
      activeTickets: 14,
      avgResolutionTime: '4.2h',
      satisfactionRate: 98
    };
  }
}
