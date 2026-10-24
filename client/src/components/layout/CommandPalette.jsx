import { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { leadsApi } from '../../api/leads.api.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { LayoutDashboard, Users, Sliders, Plus, Download, FileText, Search, X } from 'lucide-react';
import { StatusTag } from '../ui/StatusTag.jsx';

export function CommandPalette({ open, onOpenChange, onNewLead }) {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);
  const [leadResults, setLeadResults] = useState([]);
  const [isSearchingLeads, setIsSearchingLeads] = useState(false);

  useEffect(() => {
    const down = (e) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        onOpenChange((prev) => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [onOpenChange]);

  useEffect(() => {
    if (!debouncedSearch || debouncedSearch.trim().length < 2) return;

    let active = true;
    setIsSearchingLeads(true);

    leadsApi
      .list({ search: debouncedSearch.trim(), pageSize: 5 })
      .then((res) => {
        if (!active) return;
        setLeadResults(res.data?.data || []);
      })
      .catch(() => {
        if (!active) return;
        setLeadResults([]);
      })
      .finally(() => {
        if (active) setIsSearchingLeads(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedSearch]);

  const activeResults = (!debouncedSearch || debouncedSearch.trim().length < 2) ? [] : leadResults;

  if (!open) return null;

  const runCommand = (action) => {
    onOpenChange(false);
    action();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/75 animate-in fade-in duration-150"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-lg bg-[#030303] border border-[#222222] shadow-2xl font-mono text-xs overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Command Palette" shouldFilter={!search}>
          <div className="flex items-center border-b border-[#222222] px-4 bg-[#161616]">
            <Search size={15} className="text-[#717171] shrink-0 mr-3" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Type a command or search leads..."
              className="w-full h-12 bg-transparent text-[#EEEEEE] placeholder:text-[#717171] focus:outline-none text-xs font-mono"
            />
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-[#717171] hover:text-[#EEEEEE] p-1"
              aria-label="Close"
            >
              <X size={15} />
            </button>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-xs text-[#717171]">
              {isSearchingLeads ? 'Searching leads...' : 'No matching results found.'}
            </Command.Empty>

            {/* Navigation Section */}
            <Command.Group heading="Navigation">
              <Command.Item
                onSelect={() => runCommand(() => navigate('/dashboard'))}
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#EEEEEE] hover:bg-[#FE6A00]/10 hover:text-[#FE6A00] cursor-pointer"
              >
                <LayoutDashboard size={14} className="text-[#FE6A00]" />
                <span>01 / Dashboard</span>
              </Command.Item>

              <Command.Item
                onSelect={() => runCommand(() => navigate('/leads'))}
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#EEEEEE] hover:bg-[#FE6A00]/10 hover:text-[#FE6A00] cursor-pointer"
              >
                <FileText size={14} className="text-[#FE6A00]" />
                <span>02 / Leads</span>
              </Command.Item>

              {isAdmin && (
                <Command.Item
                  onSelect={() => runCommand(() => navigate('/users'))}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#EEEEEE] hover:bg-[#FE6A00]/10 hover:text-[#FE6A00] cursor-pointer"
                >
                  <Users size={14} className="text-[#FE6A00]" />
                  <span>03 / Users</span>
                </Command.Item>
              )}

              <Command.Item
                onSelect={() => runCommand(() => navigate('/settings'))}
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#EEEEEE] hover:bg-[#FE6A00]/10 hover:text-[#FE6A00] cursor-pointer"
              >
                <Sliders size={14} className="text-[#FE6A00]" />
                <span>04 / Settings</span>
              </Command.Item>
            </Command.Group>

            {/* Actions Section */}
            <Command.Group heading="Actions">
              <Command.Item
                onSelect={() =>
                  runCommand(() => {
                    if (onNewLead) onNewLead();
                    else navigate('/leads?drawer=new');
                  })
                }
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#EEEEEE] hover:bg-[#FE6A00]/10 hover:text-[#FE6A00] cursor-pointer"
              >
                <Plus size={14} className="text-[#FE6A00]" />
                <span>Create New Lead</span>
              </Command.Item>

              <Command.Item
                onSelect={() =>
                  runCommand(() => {
                    const exportHost = import.meta.env.VITE_API_URL || 'https://swan-assignment-backend.onrender.com';
                    window.location.href = `${exportHost.replace(/\/+$/, '')}/api/v1/leads/export`;
                  })
                }
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#EEEEEE] hover:bg-[#FE6A00]/10 hover:text-[#FE6A00] cursor-pointer"
              >
                <Download size={14} className="text-[#FE6A00]" />
                <span>Export Leads CSV</span>
              </Command.Item>
            </Command.Group>

            {/* Leads Search Results */}
            {activeResults.length > 0 && (
              <Command.Group heading="Leads">
                {activeResults.map((lead) => (
                  <Command.Item
                    key={lead._id}
                    onSelect={() => runCommand(() => navigate(`/leads/${lead._id}`))}
                    className="flex items-center justify-between px-3 py-2 text-xs text-[#EEEEEE] hover:bg-[#FE6A00]/10 hover:text-[#FE6A00] cursor-pointer"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-semibold text-[#EEEEEE] truncate">{lead.name}</span>
                      <span className="text-[#717171] truncate">({lead.company || lead.email})</span>
                    </div>
                    <StatusTag status={lead.status} />
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>

          <div className="flex items-center justify-between px-4 py-2 bg-[#060606] border-t border-[#222222] text-[10px] text-[#717171]">
            <span>Navigate: <span className="text-[#EEEEEE]">↑↓</span></span>
            <span>Select: <span className="text-[#EEEEEE]">↵</span></span>
            <span>Close: <span className="text-[#EEEEEE]">ESC</span></span>
          </div>
        </Command>
      </div>
    </div>
  );
}
