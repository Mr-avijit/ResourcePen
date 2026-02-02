
import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Product, AppUser, AppView, AppRole } from './types';
import { MockApiService } from './MockApiService';
import { canAccessView } from './permissions';

export interface CartItem extends Product {
  quantity: number;
}

// --- Global Auth Context ---
interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  role: AppRole | null;
  login: (email: string, password?: string) => Promise<AppUser | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem('psp_session');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (email: string, password?: string) => {
    try {
      const authUser = await MockApiService.login(email, password);
      if (authUser) {
        setUser(authUser);
        localStorage.setItem('psp_session', JSON.stringify(authUser));
        return authUser;
      }
    } catch (error) {
      console.error("Auth identity protocol failed:", error);
    }
    return null;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('psp_session');
    localStorage.removeItem('psp_token');
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    role: user?.role || null,
    login,
    logout
  };

  return React.createElement(AuthContext, { value }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- Navigation Context ---
interface NavigationContextType {
  view: AppView;
  navigate: (newView: AppView, newParams?: any, overrideRole?: AppRole) => void;
  params: any;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role } = useAuth();

  const [view, setView] = useState<AppView>(() => {
    const savedView = localStorage.getItem('psp_last_view') as AppView;
    if (savedView && canAccessView(role, savedView)) {
      return savedView;
    }
    return 'home';
  });

  const [params, setParams] = useState<any>(() => {
    const savedParams = localStorage.getItem('psp_last_params');
    try {
      return savedParams ? JSON.parse(savedParams) : null;
    } catch {
      return null;
    }
  });

  const navigate = useCallback((newView: AppView, newParams?: any, overrideRole?: AppRole) => {
    const effectiveRole = overrideRole !== undefined ? overrideRole : role;

    // Save to localStorage
    localStorage.setItem('psp_last_view', newView);
    if (newParams) {
      localStorage.setItem('psp_last_params', JSON.stringify(newParams));
    } else {
      localStorage.removeItem('psp_last_params');
    }

    if (!canAccessView(effectiveRole, newView)) {
      if (!effectiveRole) {
        setView('login');
        // Even if redirected to login, we might want to keep the INTENDED view in storage? 
        // For now, let's keep simple behavior. The user is redirected.
      } else {
        setView('403');
      }
      return;
    }

    setView(newView);
    setParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [role]);

  return React.createElement(NavigationContext, { value: { view, navigate, params } }, children);
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

// --- Cart Context ---
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('psp_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('psp_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => setCart(p => p.filter(x => x.id !== id));

  return React.createElement(CartContext, { value: { cart, addToCart, removeFromCart, isCartOpen, setIsCartOpen } }, children);
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// --- Other Shared Hooks ---

export const useSystemInitializer = () => {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const init = async () => {
      // In production, we check health/session integrity
      await MockApiService.initialize();
      setIsReady(true);
    };
    init();
  }, []);
  return isReady;
};

export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'dark'
  );
  useEffect(() => {
    const root = window.document.documentElement;
    theme === 'dark' ? root.classList.add('dark') : root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);
  return { theme, toggleTheme: () => setTheme(prev => prev === 'light' ? 'dark' : 'light') };
};
