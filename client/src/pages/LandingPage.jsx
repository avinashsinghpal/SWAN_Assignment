/**
 * LandingPage component for Swan Digital Solutions.
 * High-converting, responsive landing page showcasing:
 * - Glassmorphic sticky header with theme switcher & auth links
 * - Hero section with vibrant gradients and animated badges
 * - Interactive pipeline simulator demo
 * - Capabilities Bento grid with hover micro-interactions
 * - Growth audit / lead inquiry interactive submission form
 * - Proof & metrics showcase
 * - Expandable FAQ accordion
 * - SEO-optimized semantic markup with structured footer
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  BarChart3,
  Code2,
  TrendingUp,
  Shield,
  Layers,
  Smartphone,
  Search,
  CheckCircle2,
  ChevronDown,
  Mail,
  Phone,
  Building2,
  Send,
  Star,
  Zap,
  Globe,
  Sun,
  Moon,
  Menu,
  X,
  Laptop,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Button } from '../components/ui/Button.jsx';
import { cn } from '../lib/cn.js';

const SERVICES = [
  {
    icon: Code2,
    title: 'Custom Web & Software Development',
    description:
      'Engineered for extreme performance and enterprise scalability. Modern React, Node.js, and cloud-native systems crafted to power mission-critical operations.',
    tags: ['React', 'Node.js', 'PostgreSQL / Mongo', 'Microservices'],
    metric: '99.9% Uptime Guarantee',
  },
  {
    icon: TrendingUp,
    title: 'Performance & Growth Marketing',
    description:
      'Hyper-targeted multi-channel acquisition campaigns. We turn ad spend into profitable pipeline with predictable customer acquisition costs and algorithmic targeting.',
    tags: ['Meta Ads', 'Google Search', 'LinkedIn B2B', 'Attribution Modeling'],
    metric: '4.8x Average ROAS',
  },
  {
    icon: Search,
    title: 'Technical SEO & Inbound Engine',
    description:
      'Dominate organic search with technical audits, semantic content architecture, high-authority backlink development, and core web vitals optimization.',
    tags: ['Core Web Vitals', 'Semantic Search', 'Content Architecture', 'Rank Tracker'],
    metric: '+310% Inbound Organic Traffic',
  },
  {
    icon: Smartphone,
    title: 'Mobile App Engineering',
    description:
      'Fluid, high-performance cross-platform mobile apps for iOS and Android. Seamless offline capability, biometrics, real-time push, and app store compliance.',
    tags: ['React Native', 'Swift / Kotlin', 'Push Engine', 'Offline Sync'],
    metric: '4.9 Star Store Average',
  },
  {
    icon: Layers,
    title: 'UI/UX Product & Brand Systems',
    description:
      'Conversion-obsessed product design. We engineer digital interfaces that eliminate cognitive friction, dazzle users, and double conversion funnels.',
    tags: ['Design Systems', 'Interactive Prototyping', 'User Research', 'A/B Testing'],
    metric: '2.4x Higher Conversion Rate',
  },
  {
    icon: BarChart3,
    title: 'Proprietary Lead Management (LMS)',
    description:
      'Never lose a prospective deal again. Built-in lead qualification pipelines, instant SLA alerts, role-scoped permissions, and comprehensive activity audit trails.',
    tags: ['Kanban Pipeline', 'Overdue Alerts', 'Audit History', 'CSV Intelligence'],
    metric: '< 15min Lead Response Velocity',
  },
];

const CASE_STUDIES = [
  {
    client: 'Apex FinTech Global',
    service: 'Enterprise Portal & Growth Marketing',
    results: ['+285% Verified Inbound Leads', '8-Week Production Delivery', '$14M New Pipeline'],
    quote:
      'Swan Digital completely transformed our sales velocity. Their custom software architecture combined with performance marketing generated record pipeline within 60 days.',
    author: 'Vikram Singhania',
    role: 'Chief Revenue Officer',
  },
  {
    client: 'HealthPulse Diagnostics',
    service: 'Mobile App & Technical SEO',
    results: ['120K Monthly Active Users', '#1 Organic Search Rank in 14 Markets', '99.98% System Uptime'],
    quote:
      'The technical depth and speed of Swan Digital is unmatched. From architecture design to lead capture, they deliver enterprise caliber excellence.',
    author: 'Elena Rostova',
    role: 'VP of Digital Transformation',
  },
];

const FAQS = [
  {
    question: 'What makes Swan Digital Solutions different from typical agencies?',
    answer:
      'We combine high-end software engineering with data-driven performance marketing under one roof. Instead of handoffs between disconnected developers and marketers, our engineering team builds custom tracking, high-speed web apps, and automated pipeline tools that directly accelerate your revenue.',
  },
  {
    question: 'How does the integrated Swan Lead Management System (LMS) work?',
    answer:
      'Every lead captured through web forms, marketing campaigns, or sales outreach flows directly into our secure, role-scoped Lead Management System. Your team gets Kanban boards, table filtering, instant overdue reminders, and audit history to guarantee no prospect falls through the cracks.',
  },
  {
    question: 'What is the typical timeline to launch a custom web or software project?',
    answer:
      'Standard high-performance web applications and marketing campaign engines typically launch within 3 to 6 weeks. Larger enterprise platforms or custom ERP/CRM tools span 8 to 12 weeks with milestone-driven sprints.',
  },
  {
    question: 'Do you provide continuous maintenance and pipeline optimization post-launch?',
    answer:
      'Yes. We offer continuous SLAs including cloud infrastructure management, 24/7 uptime monitoring, conversion rate optimization (CRO), ongoing SEO audits, and marketing channel scaling.',
  },
  {
    question: 'Can our internal sales team access the Swan LMS with role-based scoping?',
    answer:
      'Absolutely. The platform features strict role-based access control (RBAC). Sales representatives only view their designated inquiries and assigned accounts, while administrators have full organizational oversight, team assignment, and pipeline metrics.',
  },
];

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [interactiveStage, setInteractiveStage] = useState('Qualified');

  // Inquiry form state
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: 'Web Development',
    notes: '',
  });

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({
        title: 'Required fields missing',
        message: 'Please provide your name and work email.',
        variant: 'error',
      });
      return;
    }

    setInquirySubmitted(true);
    toast({
      title: 'Growth Consultation Requested!',
      message: 'Our digital strategy team will contact you within 4 business hours.',
      variant: 'success',
    });
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] dark:bg-[var(--color-dark-canvas)] text-[var(--color-ink)] dark:text-[var(--color-dark-ink)] transition-colors duration-200">
      {/* ── 1. Sticky Navigation Bar ── */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-[#0b131f]/85 border-b border-[var(--color-border)] dark:border-[var(--color-dark-border)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-700 to-emerald-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10 C2 6, 5 2, 7 2 C9 2, 12 6, 12 10" stroke="white" strokeWidth="1.75" strokeLinecap="round" fill="none"/>
                <path d="M7 2 L7 10" stroke="white" strokeWidth="1.75" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-[var(--color-ink)] dark:text-white leading-none">
                Swan Digital Solutions
              </span>
              <span className="text-[10px] font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider mt-0.5">
                Software & Marketing Agency
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[var(--color-ink-muted)] dark:text-gray-300">
            <a href="#services" className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors">
              Capabilities
            </a>
            <a href="#pipeline" className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors">
              Lead Engine
            </a>
            <a href="#results" className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors">
              Case Studies
            </a>
            <a href="#faq" className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors">
              FAQ
            </a>
            <a href="#contact" className="hover:text-teal-700 dark:hover:text-teal-400 transition-colors">
              Consultation
            </a>
          </nav>

          {/* Header Action Controls */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="gap-1.5 shadow-sm"
              >
                Go to Workspace <ArrowRight size={14} />
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="text-xs"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="gap-1.5 shadow-sm text-xs"
                >
                  Access LMS <ArrowRight size={14} />
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-white dark:bg-[#0b131f] px-4 pt-3 pb-5 space-y-3 shadow-lg">
            <div className="flex flex-col space-y-2 text-sm font-medium">
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Capabilities
              </a>
              <a
                href="#pipeline"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Lead Engine
              </a>
              <a
                href="#results"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Case Studies
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                FAQ
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-teal-700 dark:text-teal-400 font-semibold"
              >
                Book Consultation
              </a>
            </div>

            <div className="pt-3 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)] flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="w-1/2 text-xs"
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(isAuthenticated ? '/dashboard' : '/login');
                }}
                className="w-1/2 text-xs gap-1"
              >
                {isAuthenticated ? 'Workspace' : 'Access LMS'} <ArrowRight size={13} />
              </Button>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* ── 2. Hero Section ── */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
          {/* Subtle glowing background orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-teal-500/15 via-emerald-400/10 to-transparent blur-3xl pointer-events-none rounded-full" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Value Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 shadow-2xs mb-6">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              <span className="text-xs font-semibold text-teal-800 dark:text-teal-300 tracking-wide uppercase">
                Swan Digital Solutions • Engineering & Marketing Agency
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.12]">
              Accelerate Inbound Pipeline Velocity with{' '}
              <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Intelligent Digital Systems
              </span>
            </h1>

            {/* Subheading */}
            <p className="mt-5 text-sm sm:text-base lg:text-lg text-[var(--color-ink-muted)] dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              We engineer custom cloud software, high-converting digital marketing funnels, and proprietary lead management pipelines for modern companies ready to scale.
            </p>

            {/* Hero CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
              <a href="#contact" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full gap-2 shadow-md">
                  Request Growth Audit <ArrowRight size={16} />
                </Button>
              </a>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                className="w-full sm:w-auto gap-2"
              >
                <Laptop size={16} /> Explore LMS Workspace
              </Button>
            </div>

            {/* Social Proof Metric Pill */}
            <div className="mt-12 pt-8 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)] grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-teal-700 dark:text-teal-400">
                  $48M+
                </p>
                <p className="text-xs text-[var(--color-ink-subtle)] font-medium mt-1">
                  Client Pipeline Generated
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-teal-700 dark:text-teal-400">
                  +310%
                </p>
                <p className="text-xs text-[var(--color-ink-subtle)] font-medium mt-1">
                  Organic Traffic Scale
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-teal-700 dark:text-teal-400">
                  99.8%
                </p>
                <p className="text-xs text-[var(--color-ink-subtle)] font-medium mt-1">
                  SLA Delivery On-Time
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-teal-700 dark:text-teal-400">
                  &lt; 15 min
                </p>
                <p className="text-xs text-[var(--color-ink-subtle)] font-medium mt-1">
                  Lead Response Velocity
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. Interactive Lead Engine Showcase ── */}
        <section id="pipeline" className="py-16 bg-gray-50/70 dark:bg-[#080e18] border-y border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-widest">
                Proprietary Pipeline Intelligence
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Turn Raw Inquiries Into High-Value Closes
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-ink-muted)] dark:text-gray-400">
                Swan LMS tracks every prospect stage with automated audit trails, overdue alerts, and role-scoped confidentiality. Click below to preview the pipeline stages:
              </p>
            </div>

            {/* Interactive Pipeline Stage Selector */}
            <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
              {['New', 'Contacted', 'Qualified', 'Converted', 'Lost'].map((st) => (
                <button
                  key={st}
                  onClick={() => setInteractiveStage(st)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                    interactiveStage === st
                      ? 'bg-teal-700 text-white shadow-sm ring-2 ring-teal-600'
                      : 'bg-white dark:bg-gray-900 border border-[var(--color-border)] dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  {st} Stage
                </button>
              ))}
            </div>

            {/* Interactive Preview Mockup Box */}
            <div className="max-w-4xl mx-auto bg-white dark:bg-[#0e1726] rounded-2xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] shadow-md overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-gray-50 dark:bg-gray-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-semibold text-gray-500 ml-2">
                    Swan Lead Workspace • Stage: <strong className="text-teal-700 dark:text-teal-400">{interactiveStage}</strong>
                  </span>
                </div>
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Real-Time Sync
                </span>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1: Lead Snapshot */}
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 space-y-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Inquiry Card
                  </span>
                  <div>
                    <h3 className="text-sm font-bold">Acme Cloud Technologies</h3>
                    <p className="text-xs text-gray-500">Contact: rahul@acmecloud.io</p>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-200 dark:border-gray-800">
                    <span className="text-gray-500">Interest:</span>
                    <span className="font-semibold text-teal-700 dark:text-teal-400">Custom Software</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Pipeline Stage:</span>
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300">
                      {interactiveStage}
                    </span>
                  </div>
                </div>

                {/* Column 2: Audit History Log */}
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 space-y-3">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Audit Trail & Timeline
                  </span>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-teal-600 mt-1 shrink-0" />
                      <div>
                        <p className="font-semibold">Stage set to {interactiveStage}</p>
                        <p className="text-[10px] text-gray-500">Updated by Lead Specialist</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-teal-600 mt-1 shrink-0" />
                      <div>
                        <p className="font-semibold">Discovery meeting completed</p>
                        <p className="text-[10px] text-gray-500">Requirements verified</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 3: SLA & Action Button */}
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      SLA Follow-Up
                    </span>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Automated follow-up task scheduled for <strong className="text-teal-700 dark:text-teal-400">Tomorrow at 10:00 AM</strong>.
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(isAuthenticated ? '/leads' : '/login')}
                    className="w-full mt-4 text-xs gap-1.5"
                  >
                    Open in LMS <ArrowRight size={13} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. Core Agency Capabilities Bento Grid ── */}
        <section id="services" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-widest">
              Full-Spectrum Capabilities
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Software Architecture & Performance Marketing
            </h2>
            <p className="text-sm text-[var(--color-ink-muted)] dark:text-gray-400">
              End-to-end digital solutions designed to acquire, convert, and retain high-lifetime-value customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((srv) => {
              const Icon = srv.icon;
              return (
                <div
                  key={srv.title}
                  className="p-6 rounded-2xl bg-white dark:bg-[#0e1726] border border-[var(--color-border)] dark:border-[var(--color-dark-border)] shadow-xs hover:shadow-md hover:border-teal-600/50 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[var(--color-ink)] dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                        {srv.title}
                      </h3>
                      <p className="text-xs text-[var(--color-ink-muted)] dark:text-gray-400 mt-2 leading-relaxed">
                        {srv.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {srv.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)] flex items-center justify-between text-xs font-semibold text-teal-700 dark:text-teal-400">
                    <span>{srv.metric}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 5. Client Case Studies & Impact ── */}
        <section id="results" className="py-20 bg-gray-50/70 dark:bg-[#080e18] border-y border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
              <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-widest">
                Proven Client Results
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Real Companies. Quantifiable Growth.
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {CASE_STUDIES.map((cs) => (
                <div
                  key={cs.client}
                  className="p-8 rounded-2xl bg-white dark:bg-[#0e1726] border border-[var(--color-border)] dark:border-[var(--color-dark-border)] shadow-xs flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                        {cs.service}
                      </span>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold">{cs.client}</h3>
                    <p className="text-xs sm:text-sm text-[var(--color-ink-muted)] dark:text-gray-300 italic leading-relaxed">
                      "{cs.quote}"
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 py-3 px-4 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/30 text-center">
                      {cs.results.map((res, idx) => (
                        <div key={idx} className="text-xs font-bold text-teal-800 dark:text-teal-300">
                          {res}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center font-bold text-teal-800 dark:text-teal-300 text-xs">
                        {cs.author.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold">{cs.author}</p>
                        <p className="text-[11px] text-[var(--color-ink-subtle)]">{cs.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. Interactive Growth Consultation Form ── */}
        <section id="contact" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-[#0e1726] rounded-3xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] p-8 sm:p-12 shadow-sm">
            <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
              <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-widest">
                Direct Inbound Engine
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Request a Confidential Growth Audit
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-ink-muted)] dark:text-gray-400">
                Share your core initiatives and our technical team will deliver a structured action plan and pipeline breakdown within 4 hours.
              </p>
            </div>

            {inquirySubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-xl font-bold">Inquiry Successfully Dispatched!</h3>
                <p className="text-xs text-[var(--color-ink-muted)] dark:text-gray-300 max-w-md mx-auto">
                  Thank you, <strong>{formData.name}</strong>. Your inquiry has been routed into our pipeline under the <strong>{formData.service}</strong> division.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInquirySubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      company: '',
                      phone: '',
                      service: 'Web Development',
                      notes: '',
                    });
                  }}
                  className="mt-2 text-xs"
                >
                  Submit Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[var(--color-ink)] dark:text-gray-200">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajiv Kapoor"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-gray-50/50 dark:bg-gray-900 text-xs text-[var(--color-ink)] dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[var(--color-ink)] dark:text-gray-200">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="rajiv@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-gray-50/50 dark:bg-gray-900 text-xs text-[var(--color-ink)] dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[var(--color-ink)] dark:text-gray-200">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Nexus Enterprises"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-gray-50/50 dark:bg-gray-900 text-xs text-[var(--color-ink)] dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-[var(--color-ink)] dark:text-gray-200">
                      Primary Service Interest
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-gray-50/50 dark:bg-gray-900 text-xs text-[var(--color-ink)] dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                    >
                      <option value="Web Development">Web & Cloud Software Development</option>
                      <option value="Performance Marketing">Performance & Paid Marketing</option>
                      <option value="SEO">Technical SEO & Inbound</option>
                      <option value="Mobile App Development">Mobile App Development</option>
                      <option value="UI/UX Design">UI/UX Product Design</option>
                      <option value="Custom Software">Custom Enterprise Platform</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-[var(--color-ink)] dark:text-gray-200">
                    Project Scope / Brief
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe your objectives, target audience, or current bottlenecks..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-gray-50/50 dark:bg-gray-900 text-xs text-[var(--color-ink)] dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full gap-2 shadow-sm">
                  <Send size={15} /> Submit Consultation Request
                </Button>
              </form>
            )}
          </div>
        </section>

        {/* ── 7. FAQ Accordion ── */}
        <section id="faq" className="py-20 bg-gray-50/70 dark:bg-[#080e18] border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-widest">
                Clarity & Transparency
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white dark:bg-[#0e1726] rounded-2xl border border-[var(--color-border)] dark:border-[var(--color-dark-border)] overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm hover:text-teal-700 dark:hover:text-teal-400 transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        size={16}
                        className={cn('shrink-0 transition-transform duration-200', isOpen && 'rotate-180 text-teal-600')}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[var(--color-ink-muted)] dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-800">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* ── 8. High-Impact Footer ── */}
      <footer className="border-t border-[var(--color-border)] dark:border-[var(--color-dark-border)] bg-white dark:bg-[#060b13] pt-14 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[var(--color-border)] dark:border-[var(--color-dark-border)]">
            {/* Col 1: Brand & Mission */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-700 flex items-center justify-center">
                  <svg width="15" height="15" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 10 C2 6, 5 2, 7 2 C9 2, 12 6, 12 10" stroke="white" strokeWidth="1.75" strokeLinecap="round" fill="none"/>
                    <path d="M7 2 L7 10" stroke="white" strokeWidth="1.75" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="font-bold text-base tracking-tight">Swan Digital Solutions</span>
              </div>
              <p className="text-xs text-[var(--color-ink-subtle)] dark:text-gray-400 max-w-sm leading-relaxed">
                A premier software architecture and digital growth firm. We design modern web products, high-converting customer acquisition funnels, and proprietary lead management software.
              </p>
              <div className="flex items-center gap-2 pt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Operational • Swan LMS v1.0
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-subtle)] mb-3">
                Agency
              </p>
              <ul className="space-y-2 text-xs text-[var(--color-ink-muted)] dark:text-gray-400">
                <li><a href="#services" className="hover:text-teal-700 dark:hover:text-teal-400">Capabilities</a></li>
                <li><a href="#pipeline" className="hover:text-teal-700 dark:hover:text-teal-400">Lead Engine</a></li>
                <li><a href="#results" className="hover:text-teal-700 dark:hover:text-teal-400">Case Studies</a></li>
                <li><a href="#faq" className="hover:text-teal-700 dark:hover:text-teal-400">Frequently Asked</a></li>
              </ul>
            </div>

            {/* Col 3: Portal & Platform */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-subtle)] mb-3">
                Client Portal
              </p>
              <ul className="space-y-2 text-xs text-[var(--color-ink-muted)] dark:text-gray-400">
                <li><Link to="/login" className="hover:text-teal-700 dark:hover:text-teal-400">Sign In to LMS</Link></li>
                <li><Link to="/register" className="hover:text-teal-700 dark:hover:text-teal-400">Register Account</Link></li>
                <li><Link to="/dashboard" className="hover:text-teal-700 dark:hover:text-teal-400">Live Workspace</Link></li>
                <li><a href="/api/docs" target="_blank" rel="noreferrer" className="hover:text-teal-700 dark:hover:text-teal-400">API Documentation</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-ink-subtle)] dark:text-gray-500">
            <p>&copy; {new Date().getFullYear()} Swan Digital Solutions. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Security & Privacy</span>
              <span>•</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
