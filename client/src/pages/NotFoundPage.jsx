import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { SplitFlapText } from '../components/landing/SplitFlapText.jsx';
import { SoundProvider } from '../components/landing/SoundContext.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  const { isAuthenticated } = useAuth();
  const returnPath = isAuthenticated ? '/dashboard' : '/';

  return (
    <SoundProvider>
      <div className="min-h-screen bg-[#020202] text-[#EEEEEE] font-mono flex items-center justify-center p-6 relative overflow-hidden">
        {/* Global grid background & noise */}
        <div className="app-grid-bg" aria-hidden="true" />
        <div className="app-noise-overlay" aria-hidden="true" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-md space-y-6">
          <div className="pb-2">
            <SplitFlapText
              word="404"
              fontSize="clamp(5rem, 15vw, 10rem)"
              hideSoundToggle={true}
              noReplay={false}
            />
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-4xl uppercase tracking-wide text-[#EEEEEE]">
              PAGE NOT FOUND
            </h2>
            <p className="text-xs text-[#717171] leading-relaxed max-w-sm">
              The endpoint or resource you requested cannot be located in the current routing table.
            </p>
          </div>

          <div className="pt-4">
            <Link to={returnPath}>
              <Button variant="outline" size="md">
                <span className="inline-flex items-center gap-2">
                  <ArrowLeft size={14} /> Return to {isAuthenticated ? 'Dashboard' : 'Home'}
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </SoundProvider>
  );
}

export default NotFoundPage;
