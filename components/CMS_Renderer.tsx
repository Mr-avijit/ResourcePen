
import React from 'react';
import { CMSPageConfig, CMSSection } from '../types';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Services from '../sections/Services';
import Products from '../sections/Products';
import Team from '../sections/Team';
import Testimonials from '../sections/Testimonials';
import Blog from '../sections/Blog';
import Contact from '../sections/Contact';
import Trust from '../sections/Trust';
import Categories from '../sections/Categories';
import FeaturedDeal from '../sections/FeaturedDeal';

// Define specialized types for component props based on CMS logic
interface DynamicSectionProps {
  section: CMSSection;
  onNavigate?: (view: any, params?: any) => void;
  onAddToCart?: (product: any) => void;
}

const SectionMap: Record<string, React.FC<any>> = {
  hero: Hero,
  categories: Categories,
  'featured-deal': FeaturedDeal,
  about: About,
  services: Services,
  products: Products,
  team: Team,
  testimonials: Testimonials,
  blog: Blog,
  contact: Contact,
  trust: Trust
};

const CMS_Renderer: React.FC<{
  config: CMSPageConfig;
  onNavigate: (view: any, params?: any) => void;
  onAddToCart: (p: any) => void;
}> = ({ config, onNavigate, onAddToCart }) => {

  // Only render visible sections sorted by order
  const visibleSections = config.sections
    .filter(s => s.isVisible)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      {visibleSections.map(section => {
        const Component = SectionMap[section.type];
        if (!Component) {
          console.warn(`CMS_Renderer: Missing component mapping for type "${section.type}"`);
          return null;
        }

        // Standardized props passed to every section from CMS
        return (
          <div key={section.id} id={section.id} style={{
            paddingTop: section.styles?.paddingTop || 0,
            paddingBottom: section.styles?.paddingBottom || 0
          }}>
            <Component
              content={section.content}
              styles={section.styles}
              onNavigate={onNavigate}
              onAddToCart={onAddToCart}
              // Fallback handlers for existing components
              openAuth={onNavigate}
              onViewAll={() => onNavigate('blog-list')}
              onSelectBlog={(b: any) => onNavigate('blog-detail', b)}
              onSelectProduct={(p: any) => onNavigate('product-detail', p)}
            />
          </div>
        );
      })}
    </>
  );
};

export default CMS_Renderer;
