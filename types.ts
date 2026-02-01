
export type AppRole = 'admin' | 'user';

export type Permission =
  | 'access_admin_dashboard'
  | 'manage_users'
  | 'manage_projects'
  | 'manage_seo'
  | 'manage_cms'
  | 'manage_orders'
  | 'manage_payments'
  | 'manage_settings'
  | 'access_user_dashboard'
  | 'view_profile'
  | 'view_own_orders'
  | 'view_own_projects'
  | 'manage_cart'
  | 'manage_referrals';

export interface Breadcrumb {
  label: string;
  view: AppView;
  params?: any;
}

// --- PRODUCT SUB-INTERFACES ---
export interface TechModule {
  name: string;
  /**
   * Fix: Added 'Infrastructure' to TechModule.layer to satisfy SeedData.ts requirements
   */
  layer: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Tools' | 'Cloud' | 'Infrastructure';
  reason: string;
}

export interface ProductDoc {
  label: string;
  type: 'PDF' | 'DOCX' | 'ZIP' | 'PPT' | 'SQL' | 'CSV';
  isIncluded: boolean;
  version: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface WorkflowStep {
  step: string;
  desc: string;
}

export interface ModuleInfo {
  name: string;
  description: string;
  features: string[];
}

export interface SectionConfig {
  isEnabled: boolean;
  order: number;
  priority: number;
  /**
   * Fix: Added isOptional to SectionConfig to satisfy SeedData.ts requirements
   */
  isOptional?: boolean;
}

/**
 * Fix: Added 'published' to ProductStatus to satisfy ProjectManagement.tsx requirements
 */
export type ProductStatus = 'draft' | 'review' | 'approved' | 'active' | 'archived' | 'disabled' | 'published';
export type VisibilityType = 'public' | 'private' | 'unlisted';

// --- THE EXPANDED PRODUCT INTERFACE ---
export interface Product {
  // Step 1: Basic Identity
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  slug: string;
  intro: string;
  description: string;
  type: 'Digital' | 'Service' | 'Website' | 'Software';
  visibility: VisibilityType;
  status: ProductStatus;
  tags: string[];
  keywords: string[];
  language: string;
  version: string;
  lastUpdated: string;
  owner: string;
  supportContact: string;

  // Step 2: Classification
  category: string;
  subcategory?: string;
  industryCategory?: string;
  domainCategory?: string;
  academicCategory?: string;

  // Step 3: Media
  image: string; // Main Visual
  gallery: string[]; // 10 Nodes
  videoUrl?: string;
  demoUrl?: string;
  coverImage?: string;
  bannerImage?: string;
  autoSlider: boolean;

  // Step 4: Economics
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  couponCode?: string;
  offerText?: string;
  isStudentOffer: boolean;
  isLimitedDeal: boolean;
  dealExpiry?: string;
  emiAvailable: boolean;
  taxRule: string;
  currency: string;
  refundPolicy: string;

  // Step 5 & 6: Logistics
  enableAddToCart: boolean;
  enableProcureNow: boolean;
  enableWishlist: boolean;
  enableShare: boolean;
  purchaseLimit: number;
  accessType: 'Instant' | 'Delayed';
  fileFormats: string[];
  compatibility: string[];
  license: string;

  // Step 7-10: Content & Strategy
  longDescription: string;
  highlights: string[];
  features_list: string[];
  objectives: {
    technical: string[];
    business: string[];
    learning: string[];
  };
  scope: {
    industry: string[];
    academic: string[];
    future: string;
  };

  // Step 11-14: Engineering
  techStack: TechModule[];
  architectureSummary: string;
  workflow: WorkflowStep[];
  systemModules: ModuleInfo[];

  // Step 15: Manifest Assets
  docs: ProductDoc[];

  // Step 16 & 17: Community
  enableReviews: boolean;
  moderationMode: 'Auto' | 'Manual';
  reviews?: Feedback[];
  faqs: FAQItem[];

  // Step 18-20: Governance
  relatedProductIds: string[];
  aiRecommendationEnabled: boolean;
  sections: Record<string, SectionConfig>;

  // Step 21: Search Architecture (SEO)
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string;
    ogTags: Record<string, string>;
    indexingRules: string;
  };

  // Stats
  downloads: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  isFeatured?: boolean;
  /**
   * Added isBestSeller property used in Products.tsx
   */
  isBestSeller?: boolean;
}

export interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: AppRole;
  avatar: string;
  plan: string;
  status: 'active' | 'suspended' | 'pending';
  joinedAt: string;
}

export type AppView =
  | 'home' | 'login' | 'signup' | 'products' | 'product-detail' | 'blog-list' | 'blog-detail' | 'contact' | 'services' | 'checkout' | 'team-detail'
  | 'admin-dashboard' | 'admin-analytics' | 'admin-users' | 'admin-projects' | 'admin-seo'
  | 'admin-orders' | 'admin-payments' | 'admin-coupons' | 'admin-referrals' | 'admin-support'
  | 'admin-enquiries' | 'admin-feedback' | 'admin-tax' | 'admin-team' | 'admin-roles' | 'admin-logs' | 'admin-settings'
  | 'user-dashboard' | 'user-profile' | 'user-orders' | 'user-projects' | 'user-cart' | 'user-referrals' | 'user-settings'
  | '403';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  specialty: string[];
  bio: string;
}

/**
 * Fix: Added missing types and interfaces used across the app
 */

// --- BLOG ---
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
}

// --- CMS ---
export interface CMSGlobalSettings {
  siteTitle: string;
  siteDescription: string;
  primaryColor: string;
  showOrbitBar: boolean;
}

export interface CMSSection {
  id: string;
  type: string;
  label: string;
  order: number;
  isVisible: boolean;
  content: any;
  styles?: {
    paddingTop?: number;
    paddingBottom?: number;
    theme?: 'light' | 'dark' | 'glass' | 'midnight';
  };
}

export interface CMSPageConfig {
  id: string;
  version: string;
  lastUpdated: string;
  status: string;
  globalSettings: CMSGlobalSettings;
  seo?: {
    metaTitle: string;
    metaDescription: string;
    ogImage?: string;
  };
  sections: CMSSection[];
}

// --- ENQUIRY ---
export type EnquiryType = 'general' | 'sales' | 'support' | 'partnership' | 'custom';
export type EnquiryStatus = 'new' | 'open' | 'in-progress' | 'replied' | 'closed';
export type EnquiryPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface EnquiryMessage {
  id: string;
  sender: 'user' | 'admin';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface ActivityLogEntry {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
}

export interface Enquiry {
  id: string;
  userName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  enquiry_type: EnquiryType;
  source: string;
  status: EnquiryStatus;
  priority: EnquiryPriority;
  sla_deadline: string;
  created_at: string;
  internal_notes?: string;
  thread: EnquiryMessage[];
  activity_log: ActivityLogEntry[];
}

export interface EnquiryAnalytics {
  newEnquiries: number;
  avgResponseTime: string;
  urgentTickets: number;
  conversionRate: number;
}

// --- FEEDBACK ---
export type FeedbackStatus = 'pending' | 'approved' | 'featured' | 'rejected' | 'flagged';
export type SentimentType = 'positive' | 'neutral' | 'negative';

export interface Feedback {
  id: string;
  userName: string;
  userAvatar?: string;
  isVerifiedPurchase?: boolean;
  isVerifiedUser?: boolean;
  rating: number;
  title: string;
  content: string;
  sentiment: SentimentType;
  status: FeedbackStatus;
  source: string;
  createdAt: string;
  adminReply?: string;
}

export interface FeedbackAnalytics {
  avgRating: number;
  sentimentScore: number;
}

// --- ORDER ---
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

// --- SEO ---
export interface SEOKeyword {
  keyword_id: string;
  keyword: string;
  search_volume: number;
  difficulty: number;
  intent_type: string;
}

export interface SEOAutomationRule {
  rule_id: string;
  rule_name: string;
  trigger_condition: string;
  action_type: string;
  status: 'active' | 'inactive';
  priority: 'low' | 'medium' | 'high';
}

export interface SEOPerformanceMetric {
  metric_id: string;
  date: string;
  impressions: number;
  clicks: number;
  avg_position: number;
  revenue: number;
}

// --- REFERRAL ---
export type CommissionType = 'percentage' | 'fixed';
export type ReferralStatus = 'active' | 'inactive' | 'expired';

export interface ReferralPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  commissionType: CommissionType;
  commissionValue: number;
  targetAmount: number;
  maxCommission: number;
  minPayoutThreshold: number;
  validityMonths: number;
  status: ReferralStatus;
  visibility: 'public' | 'private';
  autoRenew: boolean;
  upgradeAllowed: boolean;
  terms: string;
  createdAt: string;
}

export interface UserReferral {
  id: string;
  userId: string;
  userName: string;
  packageId: string;
  packageName: string;
  referralCode: string;
  referralLink: string;
  walletBalance: number;
  totalEarned: number;
  pendingCommission: number;
  paidCommission: number;
  targetProgress: number;
  validityEndDate: string;
  status: ReferralStatus;
  referralsCount: number;
  conversions: number;
}

export interface Payout {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  upiId: string;
  status: 'pending' | 'paid' | 'rejected';
  transactionId?: string;
  createdAt: string;
  paidAt?: string;
}
