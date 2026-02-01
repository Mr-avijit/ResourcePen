import { CMSPageConfig, AppUser, Product, BlogPost } from './types';

export const SEED_USERS: AppUser[] = [
  { id: 'u-1', firstName: 'Admin', lastName: 'Architect', email: 'admin@resourcespen.com', role: 'admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', plan: 'Enterprise', status: 'active', joinedAt: '2024-01-01' },
  { id: 'u-2', firstName: 'Alex', lastName: 'Rivera', email: 'alex@ark.io', role: 'user', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', plan: 'Pro', status: 'active', joinedAt: '2024-02-15' },
  { id: 'u-3', firstName: 'Elena', lastName: 'Petrova', email: 'elena@design.cc', role: 'user', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', plan: 'Basic', status: 'active', joinedAt: '2024-03-10' }
];

export const SEED_PROJECTS: Product[] = [
  {
    id: 'p-1',
    sku: 'SKU-HPRO-01',
    name: 'Horizon Dashboard Pro',
    subtitle: 'Enterprise SaaS Architectural Foundation',
    intro: 'The most comprehensive React dashboard ecosystem for high-throughput industrial applications. Engineered for performance, modularity, and rapid scaling.',
    description: 'Horizon provides a robust modular architecture for scaling your SaaS product. Built with high-throughput data visualization nodes and role-based clearance logic, this asset represents the current gold standard in administrative interfaces. It includes over 40+ pre-built semantic modules and is fully compatible with Next.js 15 app router architecture.',
    category: 'SaaS Dashboard',
    // Fix: Corrected type to 'Software'
    type: 'Software',
    language: 'English',
    owner: 'Resources Pen',
    supportContact: 'support@resourcespen.com',
    autoSlider: true,
    price: 149,
    originalPrice: 299,
    currency: 'USD',
    taxRule: 'Standard',
    refundPolicy: '14 Days',
    isStudentOffer: false,
    isLimitedDeal: true,
    emiAvailable: true,
    enableAddToCart: true,
    enableProcureNow: true,
    enableWishlist: true,
    enableShare: true,
    purchaseLimit: 1,
    accessType: 'Instant',
    fileFormats: ['ZIP', 'TS', 'SQL'],
    compatibility: ['Chrome', 'Firefox', 'Safari'],
    license: 'Commercial',
    longDescription: 'Extended description for Horizon Dashboard Pro...',
    highlights: ['Fast', 'Secure', 'Modular'],
    objectives: {
      technical: ['Learn Next.js', 'Scaling'],
      business: ['Rapid Launch'],
      learning: ['Clean Code']
    },
    scope: {
      industry: ['SaaS', 'Admin'],
      academic: ['Computer Science'],
      future: 'AI Integration'
    },
    techStack: [
      { name: 'React 19', layer: 'Frontend', reason: 'High-speed UI composition & concurrent rendering' },
      { name: 'Next.js 15', layer: 'Frontend', reason: 'App Router architecture and server components' },
      { name: 'Tailwind CSS', layer: 'Frontend', reason: 'Utility-first semantic styling' },
      { name: 'PostgreSQL', layer: 'Database', reason: 'Relational data integrity for enterprise nodes' },
      { name: 'Prisma ORM', layer: 'Backend', reason: 'Type-safe database orchestration' },
      { name: 'Redis', layer: 'Infrastructure', reason: 'High-speed session caching layer' }
    ],
    architectureSummary: 'Modular micro-frontend architecture.',
    workflow: [
      { step: 'Identity Verification', desc: 'Secure resolution of architectural credentials via JWT endpoints.' },
      { step: 'Resource Mapping', desc: 'Dynamic hydration of project manifests based on verified clearance.' },
      { step: 'Telemetry Pulse', desc: 'Real-time synchronization of industrial sensor and performance nodes.' },
      { step: 'Output Generation', desc: 'High-fidelity visual rendering of complex data clusters.' }
    ],
    systemModules: [
      { name: 'Auth Engine', description: 'RBAC Logic', features: ['JWT', 'Social Login'] }
    ],
    docs: [
      { label: 'Architecture Specs', type: 'PDF', isIncluded: true, version: '1.0.0' }
    ],
    enableReviews: true,
    moderationMode: 'Auto',
    faqs: [
      { question: 'Is this asset production-ready?', answer: 'Yes, it is currently powering over 500+ active enterprise instances.' },
      { question: 'Does it support multi-tenancy?', answer: 'Absolutely. The RBAC logic is designed for multi-tenant isolation protocols.' }
    ],
    relatedProductIds: ['p-2'],
    aiRecommendationEnabled: true,
    sections: {
      about: { isEnabled: true, order: 1, priority: 1, isOptional: false },
      features: { isEnabled: true, order: 2, priority: 2, isOptional: false },
      tech: { isEnabled: true, order: 3, priority: 3, isOptional: false }
    },
    seo: {
      metaTitle: 'Horizon Dashboard Pro - SaaS Blueprint',
      metaDescription: 'Elite React Dashboard Foundation',
      canonicalUrl: 'https://resourcespen.com/products/horizon-pro',
      ogTags: {},
      indexingRules: 'index, follow'
    },
    features_list: [
      'Dark Mode Native Protocol',
      'RBAC Authorization Logic',
      'Telemetry Data Visualization',
      'Modular Micro-frontend Support',
      'AES-256 State Encryption',
      'Responsive Architectural Grid',
      'Semantic UI Component Library',
      'Real-time Notification Node',
      'Multilingual i18n Core',
      'High-Speed Deployment Scripts'
    ],
    // Fix: Added missing Product properties
    tags: ['saas', 'dashboard', 'react'],
    keywords: ['admin', 'saas', 'react', 'dashboard'],
    lastUpdated: '2024-10-24',
    downloads: 1240,
    rating: 4.9,
    reviewCount: 84,
    slug: 'horizon-pro',
    version: '2.5.0',
    status: 'active',
    visibility: 'public',
    createdAt: '2024-01-10',
    updatedAt: '2024-10-24',
    image: 'https://picsum.photos/1200/800?random=1',
    gallery: [
      'https://picsum.photos/1200/800?random=11',
      'https://picsum.photos/1200/800?random=12',
      'https://picsum.photos/1200/800?random=13'
    ],
    demoUrl: '#',
    isFeatured: true
  },
  {
    id: 'p-2',
    sku: 'SKU-CRYP-02',
    name: 'CryptoNext v2',
    subtitle: 'Web3 Trading Interface & Swap Engine',
    intro: 'High-performance decentralized trading interface for modern blockchain assets.',
    description: 'CryptoNext provides an industrial-grade interface for decentralized finance. It includes real-time charting nodes, multi-wallet connectivity protocols, and a gas-optimized swap engine. Built with SvelteKit for peak reactive performance.',
    category: 'Web3 Interface',
    // Fix: Corrected type to 'Software'
    type: 'Software',
    language: 'English',
    owner: 'Resources Pen',
    supportContact: 'support@resourcespen.com',
    autoSlider: true,
    price: 199,
    currency: 'USD',
    taxRule: 'Standard',
    refundPolicy: '14 Days',
    isStudentOffer: true,
    isLimitedDeal: false,
    emiAvailable: true,
    enableAddToCart: true,
    enableProcureNow: true,
    enableWishlist: true,
    enableShare: true,
    purchaseLimit: 1,
    accessType: 'Instant',
    fileFormats: ['ZIP', 'TS'],
    compatibility: ['Chrome', 'Firefox', 'Brave'],
    license: 'Commercial',
    longDescription: 'Extended description for CryptoNext v2...',
    highlights: ['Web3', 'Real-time', 'Reactive'],
    objectives: {
      technical: ['SvelteKit Mastery'],
      business: ['DeFi Ready'],
      learning: ['Blockchain Logic']
    },
    scope: {
      industry: ['Finance', 'Crypto'],
      academic: ['FinTech'],
      future: 'L2 Scaling'
    },
    techStack: [
      { name: 'SvelteKit', layer: 'Frontend', reason: 'Unmatched reactive state management' },
      { name: 'Ethers.js', layer: 'Backend', reason: 'Blockchain interaction protocol' },
      { name: 'Wagmi', layer: 'Frontend', reason: 'Wallet connection hooks' }
    ],
    architectureSummary: 'Reactive state-driven DeFi architecture.',
    workflow: [
      { step: 'Wallet Handshake', desc: 'Secure EIP-1193 connection protocol.' }
    ],
    systemModules: [],
    docs: [],
    enableReviews: true,
    moderationMode: 'Auto',
    faqs: [
      { question: 'Supports MetaMask?', answer: 'Yes, full EIP-1193 compliance for all major browser wallets.' }
    ],
    relatedProductIds: ['p-1'],
    aiRecommendationEnabled: true,
    sections: {
      about: { isEnabled: true, order: 1, priority: 1, isOptional: false },
      tech: { isEnabled: true, order: 2, priority: 2, isOptional: false }
    },
    seo: {
      metaTitle: 'CryptoNext v2 - Web3 UI Kit',
      metaDescription: 'Professional DeFi Trading Interface',
      canonicalUrl: 'https://resourcespen.com/products/cryptonext',
      ogTags: {},
      indexingRules: 'index, follow'
    },
    features_list: [
      'Multi-wallet Support (EIP-1193)',
      'Real-time TV Charting Node',
      'Gas Optimization Logic',
      'Dark-Matter UI Theme',
      'Liquidity Pool Visualizer'
    ],
    // Fix: Added missing Product properties
    tags: ['web3', 'crypto', 'sveltekit'],
    keywords: ['web3', 'crypto', 'trading', 'interface'],
    lastUpdated: '2024-10-20',
    gallery: ['https://picsum.photos/1200/800?random=21', 'https://picsum.photos/1200/800?random=22'],
    downloads: 850,
    rating: 4.8,
    reviewCount: 42,
    slug: 'cryptonext',
    version: '2.0.1',
    status: 'active',
    visibility: 'public',
    createdAt: '2024-03-05',
    updatedAt: '2024-10-20',
    image: 'https://picsum.photos/1200/800?random=2',
    demoUrl: '#',
    isFeatured: false
  }
];

export const SEED_BLOGS: BlogPost[] = [
  { id: '1', title: 'The Future of Web Development 2025', excerpt: 'Trends in AI-driven architecture and edge computing.', content: 'Long form content...', author: 'Marcus Wong', date: 'Oct 12, 2024', category: 'Engineering', image: 'https://picsum.photos/600/400?random=50', readTime: '5 min' }
];

export const SEED_CMS_CONFIG: CMSPageConfig = {
  id: 'global-v1', version: '1.0.42', lastUpdated: '2024-10-24', status: 'published',
  globalSettings: { siteTitle: 'RESOURCES PEN', siteDescription: 'Digital Asset Marketplace', primaryColor: '#0284c7', showOrbitBar: true },
  seo: {
    metaTitle: 'Resources Pen - Enterprise Digital Assets',
    metaDescription: 'Premium React dashboards, UI kits, and architectural foundations for modern web development.',
    ogImage: 'https://resourcespen.com/og-image.jpg'
  },
  sections: [
    { id: 'sec-hero', type: 'hero', label: 'Identity Header', order: 1, isVisible: true, content: { headline: 'Architecting the Future of SaaS.', subheadline: 'Acquire elite digital assets and premium code foundations.', primaryCtaText: 'Explore Marketplace', secondaryCtaText: 'Start Building', badgeText: 'Certified Architecture' }, styles: { paddingTop: 0, paddingBottom: 0, theme: 'dark' } },
    { id: 'sec-categories', type: 'categories', label: 'Sector Exploration', order: 2, isVisible: true, content: {}, styles: { paddingTop: 40, paddingBottom: 0, theme: 'light' } },
    { id: 'sec-featured-deal', type: 'featured-deal', label: 'Limited Offer', order: 3, isVisible: true, content: {}, styles: { paddingTop: 40, paddingBottom: 40, theme: 'midnight' } },
    { id: 'sec-products', type: 'products', label: 'Asset Marketplace', order: 4, isVisible: true, content: {}, styles: { paddingTop: 0, paddingBottom: 40, theme: 'light' } },
    { id: 'sec-trust', type: 'trust', label: 'Client Alliances', order: 5, isVisible: true, content: {}, styles: { paddingTop: 40, paddingBottom: 40, theme: 'glass' } },
    { id: 'sec-services', type: 'services', label: 'Capabilities', order: 6, isVisible: true, content: {}, styles: { paddingTop: 40, paddingBottom: 40, theme: 'dark' } },
    { id: 'sec-team', type: 'team', label: 'Core Architects', order: 7, isVisible: true, content: {}, styles: { paddingTop: 40, paddingBottom: 40, theme: 'light' } },
    { id: 'sec-testimonials', type: 'testimonials', label: 'Social Proof', order: 8, isVisible: true, content: { title: 'Architect Success Stories', subtitle: 'Join over 10,000+ satisfied developers and entrepreneurs.' }, styles: { paddingTop: 40, paddingBottom: 40, theme: 'light' } },
    { id: 'sec-blog', type: 'blog', label: 'Insights Hub', order: 9, isVisible: true, content: {}, styles: { paddingTop: 40, paddingBottom: 40, theme: 'light' } },
    { id: 'sec-contact', type: 'contact', label: 'Direct Transmission', order: 10, isVisible: true, content: {}, styles: { paddingTop: 40, paddingBottom: 40, theme: 'dark' } }
  ]
};
