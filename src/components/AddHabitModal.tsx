import { useState } from 'react';
import { useStore } from '../store/useStore';
import type { SalahTime } from '../store/useStore';

export function AddHabitModal({ onClose }: { onClose: () => void }) {
  const addHabit = useStore(state => state.addHabit);
  const goals = useStore(state => state.goals);
  const habits = useStore(state => state.habits);

  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [linkedGoalId, setLinkedGoalId] = useState('');
  const [salahTime, setSalahTime] = useState<SalahTime>('Fajr');

  const handleSave = () => {
    if (!title) return;
    if (habits.length >= 7) {
      alert("You can only add up to 7 habits.");
      return;
    }
    addHabit({
      title,
      quantity,
      linkedGoalId: linkedGoalId || undefined,
      salahTime,
      completedDates: []
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Add Habit</h2>

        <div className="form-group">
          <label>Habit Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Meditation" />
        </div>

        <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label>Quantity per day</label>
              <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
            </div>
            <div>
              <label>Link to Goal (Optional)</label>
              <select 
                style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-card)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '0.375rem' }} 
                value={linkedGoalId} 
                onChange={(e) => setLinkedGoalId(e.target.value)}
              >
                <option value="">-- None --</option>
                {goals.map(g => (
                  <option key={g.id} value={g.id}>{g.title}</option>
                ))}
              </select>
            </div>
        </div>

        <div className="form-group">
          <label>Anchor Time (Salah)</label>
          <select 
              style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-card)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '0.375rem' }} 
              value={salahTime} 
              onChange={(e) => setSalahTime(e.target.value as SalahTime)}
            >
              {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'None'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
          <button className="btn-icon" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>Add Habit</button>
        </div>
      </div>
    </div>
  );
}
