/**
 * LandingPage - Swan Digital Solutions public marketing page.
 * Dark editorial design with GSAP animations, split-flap hero,
 * and smooth Lenis scroll.
 */

import '../styles/landing.css';

import { useAuth } from '../context/AuthContext.jsx';
import { SoundProvider } from '../components/landing/SoundContext.jsx';
import { SmoothScroll } from '../components/landing/SmoothScroll.jsx';
import { SideNav } from '../components/landing/SideNav.jsx';
import { HeroSection } from '../components/landing/HeroSection.jsx';
import { PipelineSection } from '../components/landing/PipelineSection.jsx';
import { CapabilitiesSection } from '../components/landing/CapabilitiesSection.jsx';
import { WorkflowSection } from '../components/landing/WorkflowSection.jsx';
import { DetailsSection } from '../components/landing/DetailsSection.jsx';
import { Link } from 'react-router-dom';

const NAV_ITEMS = [
  { id: 'hero', label: 'Index' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'workflow', label: 'Workflow' },
  { id: 'details', label: 'Details' },
];

export function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <SoundProvider>
      <SmoothScroll>
        <div className="landing-page">
          {/* Fixed grid background */}
          <div className="lp-grid-bg" aria-hidden="true" />

          {/* Fixed SVG noise overlay */}
          <div className="lp-noise-overlay" aria-hidden="true" />

          {/* Desktop side navigation */}
          <SideNav items={NAV_ITEMS} />

          {/* Mobile top-right login link */}
          <Link
            to={isAuthenticated ? '/dashboard' : '/login'}
            className="lp-mobile-login"
            aria-label={isAuthenticated ? 'Open dashboard' : 'Log in'}
          >
            {isAuthenticated ? 'Dashboard' : 'Log In'}
          </Link>

          {/* Page content */}
          <main>
            <HeroSection isAuthenticated={isAuthenticated} />
            <PipelineSection />
            <CapabilitiesSection />
            <WorkflowSection />
            <DetailsSection isAuthenticated={isAuthenticated} />
          </main>
        </div>
      </SmoothScroll>
    </SoundProvider>
  );
}

export default LandingPage;
