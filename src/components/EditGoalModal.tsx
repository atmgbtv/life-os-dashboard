import { useState } from 'react';
import { useStore } from '../store/useStore';
import type { Goal } from '../store/useStore';

export function EditGoalModal({ goal, onClose }: { goal: Goal | null, onClose: () => void }) {
  const addGoal = useStore(state => state.addGoal);
  const updateGoal = useStore(state => state.updateGoal);
  const removeGoal = useStore(state => state.removeGoal);

  const [title, setTitle] = useState(goal?.title || '');
  const [currentProgress, setCurrentProgress] = useState(goal?.currentProgress || 0);
  const [maxProgress, setMaxProgress] = useState(goal?.maxProgress || 100);
  const [unit, setUnit] = useState(goal?.unit || '%');

  const handleSave = () => {
    if (!title) return;
    if (goal) {
      updateGoal(goal.id, { title, currentProgress, maxProgress, unit });
    } else {
      addGoal({ title, currentProgress, maxProgress, unit });
    }
    onClose();
  };

  const handleDelete = () => {
    if (goal) {
      removeGoal(goal.id);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
          {goal ? 'Edit Goal' : 'Add Goal'}
        </h2>

        <div className="form-group">
          <label>Goal Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Learn Italian" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Current Progress</label>
            <input type="number" value={currentProgress} onChange={(e) => setCurrentProgress(Number(e.target.value))} />
          </div>

          <div className="form-group">
            <label>Total Goal</label>
            <input type="number" value={maxProgress} onChange={(e) => setMaxProgress(Number(e.target.value))} />
          </div>
        </div>

        <div className="form-group">
          <label>Unit</label>
          <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="e.g. %, hours, books" />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          {goal ? (
             <button style={{ color: '#ef4444', fontWeight: 500 }} onClick={handleDelete}>Delete Goal</button>
          ) : <div />}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-icon" onClick={onClose}>Cancel</button>
            <button className="btn-primary" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
