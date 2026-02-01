
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ShieldAlert, Home, Lock } from 'lucide-react';
import Navbar from './components/Navbar';
import OrbitBar from './components/OrbitBar';
import Hero from './sections/Hero';
import About from './sections/About';
import Services from './sections/Services';
import Products from './sections/Products';
import Team from './sections/Team';
import Testimonials from './sections/Testimonials';
import Blog from './sections/Blog';
import BlogList from './sections/BlogList';
import BlogDetail from './sections/BlogDetail';
import Contact from './sections/Contact';
import AdminDashboard from './sections/AdminDashboard';
import UserDashboard from './sections/UserDashboard';
import UserManagement from './sections/UserManagement';
import ProjectManagement from './sections/ProjectManagement';
import UserProfile from './sections/UserProfile';
import SupportTickets from './sections/SupportTickets';
import EnquiryManagement from './sections/EnquiryManagement';
import FeedbackManagement from './sections/FeedbackManagement';
import AnalyticsDashboard from './sections/AnalyticsDashboard';
import PaymentManagement from './sections/PaymentManagement';
import InvoiceManagement from './sections/InvoiceManagement';
import CouponManagement from './sections/CouponManagement';
import ReferralSystem from './sections/ReferralSystem';
import TaxManagement from './sections/TaxManagement';
import TeamManagement from './sections/TeamManagement';
import TeamDetail from './sections/TeamDetail';
import RoleManagement from './sections/RoleManagement';
import SystemSettings from './sections/SystemSettings';
import ActivityLogs from './sections/ActivityLogs';
import RevenueManagement from './sections/RevenueManagement';

import SystemGrid from './sections/SystemGrid';
import GrowthSeoEngine from './sections/GrowthSeoEngine';
import SEOTokenLab from './sections/SEOTokenLab';
import UserOrders from './sections/UserOrders';
import UserAssets from './sections/UserAssets';
import UserSettings from './sections/UserSettings';
import Checkout from './sections/Checkout';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import ProductDetails from './components/ProductDetails';
import CartPanel from './components/CartPanel';
import DashboardLayout from './components/DashboardLayout';
import CMS_Renderer from './components/CMS_Renderer';
import SupportChat from './components/SupportChat';
import LandingPageSkeleton from './components/LandingPageSkeleton';
import { useTheme, useAuth, useCart, useNavigation, useSystemInitializer } from './store';
import { AppView, CMSPageConfig } from './types';
import { MockApiService } from './MockApiService';

const App: React.FC = () => {
  useSystemInitializer();
  const { theme, toggleTheme } = useTheme();
  const { user, role, login, logout } = useAuth();
  const { cart, addToCart, removeFromCart, isCartOpen, setIsCartOpen } = useCart();
  const { view, navigate, params } = useNavigation();

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [cmsConfig, setCmsConfig] = useState<CMSPageConfig | null>(null);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (view === 'login' || view === 'signup') setIsAuthModalVisible(true);
    else setIsAuthModalVisible(false);
  }, [view]);

  useEffect(() => {
    const loadCMS = async () => {
      const config = await MockApiService.getCMSConfig();
      setCmsConfig(config);
    };
    loadCMS();
  }, [view]);

  const handleLoginSuccess = async (mode: 'login' | 'signup', credentials?: { email: string, password?: string }) => {
    if (!credentials) throw new Error('Missing credentials');
    const authUser = await login(credentials.email, credentials.password);
    if (authUser) navigate('home');
    else throw new Error('Authentication failed');
  };

  const handleLogout = () => {
    logout();
    navigate('home');
  };

  const renderContent = () => {
    if (view === '403') {
      return (
        <div className="h-screen w-full flex flex-col items-center justify-center text-center px-6 amoled-surface">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-24 h-24 bg-red-500/10 text-red-500 rounded-[2.5rem] flex items-center justify-center mb-8 border border-red-500/20">
            <ShieldAlert size={48} />
          </motion.div>
          <h2 className="text-5xl font-display font-black dark:text-white mb-4 tracking-tighter">Identity Breach</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-10 font-medium">Your current clearance is insufficient for this node.</p>
          <div className="flex gap-4">
            <button onClick={() => navigate('home')} className="flex items-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold">
              <Home size={18} /> Return Home
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold">
              <Lock size={18} /> Re-Authenticate
            </button>
          </div>
        </div>
      );
    }

    if (view.startsWith('admin-') || view === 'admin-dashboard') {
      return (
        <DashboardLayout user={user!} onLogout={handleLogout} activeSection={view} onNavigate={navigate} onBackToHome={() => navigate('home')}>
          {view === 'admin-dashboard' && <AdminDashboard />}
          {view === 'admin-grid' && <SystemGrid />}
          {view === 'admin-analytics' && <AnalyticsDashboard />}
          {view === 'admin-users' && <UserManagement />}
          {view === 'admin-projects' && <ProjectManagement />}
          {view === 'admin-seo' && <GrowthSeoEngine />}
          {view === 'admin-token-lab' && <SEOTokenLab />}

          {view === 'admin-orders' && <InvoiceManagement />}
          {view === 'admin-payments' && <RevenueManagement />}
          {view === 'admin-tax' && <TaxManagement />}
          {view === 'admin-coupons' && <CouponManagement />}
          {view === 'admin-referrals' && <ReferralSystem mode="admin" />}
          {view === 'admin-support' && <SupportTickets />}
          {view === 'admin-enquiries' && <EnquiryManagement />}
          {view === 'admin-feedback' && <FeedbackManagement />}
          {view === 'admin-team' && <TeamManagement />}
          {view === 'admin-roles' && <RoleManagement />}
          {view === 'admin-logs' && <ActivityLogs />}
          {view === 'admin-settings' && <SystemSettings />}
        </DashboardLayout>
      );
    }

    if (view.startsWith('user-') || view === 'user-dashboard') {
      return (
        <DashboardLayout user={user!} onLogout={handleLogout} activeSection={view} onNavigate={navigate} onBackToHome={() => navigate('home')}>
          {view === 'user-dashboard' && <UserDashboard />}
          {view === 'user-profile' && <UserProfile />}
          {view === 'user-orders' && <UserOrders />}
          {view === 'user-projects' && <UserAssets />}
          {view === 'user-referrals' && <ReferralSystem mode="user" />}
          {view === 'user-settings' && <UserSettings />}
        </DashboardLayout>
      );
    }

    switch (view) {
      case 'home':
      case 'login':
      case 'signup':
        return cmsConfig ? (
          <CMS_Renderer config={cmsConfig} onNavigate={navigate} onAddToCart={addToCart} />
        ) : <LandingPageSkeleton />;
      case 'blog-list':
        return <BlogList onSelectBlog={(blog) => navigate('blog-detail', blog)} onBack={() => navigate('home')} />;
      case 'blog-detail':
        return <BlogDetail blog={params} onBack={() => navigate('blog-list')} />;
      case 'product-detail':
        return <ProductDetails product={params} onClose={() => navigate('home')} onAddToCart={addToCart} />;
      case 'team-detail':
        return <TeamDetail member={params} onBack={() => navigate('home')} />;
      case 'contact':
        return <Contact />;
      case 'services':
        return <Services />;
      case 'products':
        return <Products onSelectProduct={(p) => navigate('product-detail', p)} onAddToCart={addToCart} onPreviewProduct={() => { }} />;
      case 'checkout':
        return <Checkout />;
      default:
        return <div className="h-screen flex items-center justify-center font-bold text-slate-500">404 - Node Not Found</div>;
    }
  };

  const isDashboardView = view.includes('dashboard') || view.includes('admin-') || view.includes('user-') || view === '403';
  const viewKey = isDashboardView ? `dashboard-${role}-${user?.id}` : view;

  return (
    <div className={`min-h-screen font-sans selection:bg-primary-500/30 overflow-x-hidden ${theme === 'dark' ? 'bg-black text-slate-100' : 'bg-white text-slate-900'}`}>
      {!isDashboardView && (
        <Navbar
          theme={theme} toggleTheme={toggleTheme}
          openAuth={(m) => navigate(m as AppView)}
          cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)}
          onNavigateHome={() => navigate('home')} user={user}
          onNavigateDashboard={() => navigate(role === 'admin' ? 'admin-dashboard' : 'user-dashboard')}
        />
      )}

      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={viewKey}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {!isDashboardView && <Footer />}

      {/* --- Unified Floating Action Layer --- */}
      {!isDashboardView && (
        <>
          {/* Scroll to Top - LEFT SIDE (Lowered slightly for better visual proximity) */}
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                initial={{ opacity: 0, x: -50, scale: 0.5 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.5 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-32 left-6 lg:bottom-12 lg:left-12 z-[100] p-4 rounded-[1.5rem] bg-primary-600 text-white shadow-[0_20px_50px_rgba(2,132,199,0.3)] hover:bg-primary-500 transition-all active:scale-90 border border-white/10"
              >
                <ChevronUp size={24} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Chat Bot - RIGHT SIDE */}
          <SupportChat />
        </>
      )}

      {!isDashboardView && (
        <OrbitBar
          user={user}
          onNavigateHome={() => navigate('home')}
          onNavigateDashboard={() => navigate(role === 'admin' ? 'admin-dashboard' : 'user-dashboard')}
          openAuth={(m) => navigate(m as AppView)}
          onOpenCart={() => setIsCartOpen(true)}
          toggleTheme={toggleTheme}
          theme={theme}
          currentView={view}
        />
      )}

      <AuthModal isOpen={isAuthModalVisible} onClose={() => navigate('home')} mode={view === 'signup' ? 'signup' : 'login'} setMode={(m) => navigate(m as AppView)} onLogin={handleLoginSuccess} />
      <CartPanel
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={() => { }}
        onCheckout={async () => {
          setIsCartOpen(false);
          navigate('checkout');
        }}
      />
    </div>
  );
};

export default App;
