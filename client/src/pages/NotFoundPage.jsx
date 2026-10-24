/**
 * NotFoundPage component.
 * Clean 404 error page with navigation back to safety.
 */

import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-canvas)] dark:bg-[var(--color-dark-canvas)]">
      <div className="text-center space-y-4 max-w-sm">
        <h1 className="text-6xl font-black text-teal-800 dark:text-teal-400">404</h1>
        <h2 className="text-xl font-bold text-[var(--color-ink)] dark:text-[var(--color-dark-ink)]">
          Page Not Found
        </h2>
        <p className="text-xs text-[var(--color-ink-subtle)] dark:text-[var(--color-dark-ink-subtle)]">
          The requested page does not exist or you do not have permission to view it.
        </p>
        <Link to="/dashboard">
          <Button variant="primary" size="md" className="gap-2 mt-2">
            <ArrowLeft size={15} /> Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
