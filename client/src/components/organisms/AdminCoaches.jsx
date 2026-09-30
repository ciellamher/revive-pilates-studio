import { useState } from 'react';
import { Plus, Edit3, Trash2, XCircle } from 'lucide-react';
import { apiFetch } from '../../api/base';

const BRANCHES = ['Angeles', 'San Fernando'];
const EMPTY_FORM = { name: '', specialty: '', bio: '', branches: [] };

// The admin's Coaches page. It lists the coaches who teach at the branch picked
// in the sidebar; a coach switched on for both branches appears under both.
export default function AdminCoaches({ coaches, branch, theme, onChanged }) {
  const [editing, setEditing] = useState(null); // null = closed, 'new', or a coach
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [listError, setListError] = useState('');

  const branchCoaches = coaches.filter(coach => coach.branches.includes(branch));
  const otherBranch = BRANCHES.find(b => b !== branch);

  const openNew = () => {
    setForm({ ...EMPTY_FORM, branches: [branch] });
    setError('');
    setEditing('new');
  };

  const openEdit = (coach) => {
    setForm({ name: coach.name, specialty: coach.specialty, bio: coach.bio, branches: coach.branches });
    setError('');
    setEditing(coach);
  };

  const toggleBranch = (name) => {
    setForm(prev => ({
      ...prev,
      branches: prev.branches.includes(name) ? prev.branches.filter(b => b !== name) : [...prev.branches, name],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.branches.length === 0) return setError('Choose at least one branch.');
    setSaving(true);
    setError('');
    try {
      const res = await apiFetch(editing === 'new' ? '/api/coaches' : `/api/coaches/${editing.id}`, {
        method: editing === 'new' ? 'POST' : 'PUT',
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || 'Request failed');
      setEditing(null);
      onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (coach) => {
    if (!window.confirm(`Delete ${coach.name}? This removes them from both branches.`)) return;
    setListError('');
    try {
      const res = await apiFetch(`/api/coaches/${coach.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || 'Request failed');
      onChanged();
    } catch (err) {
      setListError(err.message);
    }
  };

  const inputClass = "w-full border border-brand-sand/50 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-brown font-medium";
  const labelClass = "block text-xs font-bold text-brand-dark/50 uppercase tracking-wider mb-2";

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-3xl font-bold text-brand-dark flex items-baseline gap-3">
          Coaches
          <span className={`text-lg font-medium px-3 py-1 rounded-full ${theme.pillBg} ${theme.pillText}`}>{branch}</span>
        </h2>
        <button
          onClick={openNew}
          className={`${theme.bg} ${theme.text} ${theme.bgHover} px-5 py-2.5 rounded-[10px] font-bold text-[13px] flex items-center gap-2 transition-colors shadow-sm self-start`}
        >
          <Plus size={16} /> Add Coach
        </button>
      </div>

      {listError && <p role="alert" className="mb-4 text-sm font-medium text-[#E02424]">{listError}</p>}

      {branchCoaches.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-brand-sand/30 py-12 px-6 text-center text-brand-dark/50 font-medium">
          No coaches at the {branch} branch yet. Add one, or edit a {otherBranch} coach and switch {branch} on.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {branchCoaches.map((coach) => (
            <div key={coach.id} className="bg-white rounded-xl shadow-sm border border-brand-sand/30 p-6 flex flex-col">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-brand-dark break-words">{coach.name}</h3>
                  {coach.specialty && <p className="text-sm text-brand-dark/60">{coach.specialty}</p>}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(coach)} aria-label={`Edit ${coach.name}`} className="p-2 rounded-lg text-brand-dark/60 hover:bg-black/5 hover:text-brand-dark transition-colors">
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => handleDelete(coach)} aria-label={`Delete ${coach.name}`} className="p-2 rounded-lg text-[#E02424]/70 hover:bg-[#fff5f5] hover:text-[#E02424] transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              {coach.bio && <p className="text-sm text-brand-dark/80 mb-4 whitespace-pre-line break-words">{coach.bio}</p>}
              <div className="mt-auto flex flex-wrap gap-2 pt-2">
                {coach.branches.map((name) => (
                  <span key={name} className="bg-brand-sand/30 text-brand-dark px-2 py-1 rounded text-xs font-bold">{name}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-8">
                <h3 className="text-2xl font-bold text-brand-dark">{editing === 'new' ? 'Add Coach' : 'Edit Coach'}</h3>
                <button type="button" onClick={() => setEditing(null)} aria-label="Close" className="text-brand-dark/40 hover:text-brand-dark transition-colors">
                  <XCircle size={24} />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label htmlFor="coach-name" className={labelClass}>Name</label>
                  <input id="coach-name" required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Coach Name" />
                </div>
                <div>
                  <label htmlFor="coach-specialty" className={labelClass}>Specialty</label>
                  <input id="coach-specialty" maxLength={100} value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} className={inputClass} placeholder="e.g. Reformer, Mat Pilates" />
                </div>
                <div>
                  <label htmlFor="coach-bio" className={labelClass}>About</label>
                  <textarea id="coach-bio" rows={4} maxLength={1000} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className={inputClass} placeholder="Certifications, experience, teaching style" />
                </div>
                <fieldset>
                  <legend className={labelClass}>Branches</legend>
                  <div className="flex flex-wrap gap-3">
                    {BRANCHES.map((name) => (
                      <label key={name} className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer font-medium text-sm transition-colors ${form.branches.includes(name) ? 'border-brand-brown bg-brand-brown/5 text-brand-dark' : 'border-brand-sand/50 text-brand-dark/60'}`}>
                        <input type="checkbox" checked={form.branches.includes(name)} onChange={() => toggleBranch(name)} className="w-4 h-4 accent-[#3A2A20]" />
                        {name}
                      </label>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-brand-dark/50">The coach can only be picked as an instructor at the branches switched on here.</p>
                </fieldset>
              </div>

              {error && <p role="alert" className="mt-6 text-sm font-medium text-[#E02424]">{error}</p>}

              <div className="mt-8 pt-6 border-t border-brand-sand/30 flex justify-end gap-4">
                <button type="button" onClick={() => setEditing(null)} className="px-6 py-3 rounded-xl font-bold text-brand-dark hover:bg-black/5 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className={`px-8 py-3 rounded-xl ${theme.bg} ${theme.text} ${theme.bgHover} font-bold transition-colors shadow-sm disabled:opacity-60`}>
                  {saving ? 'Saving…' : editing === 'new' ? 'Add Coach' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
