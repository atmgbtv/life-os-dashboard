import { useStore } from '../store/useStore';
import type { Goal } from '../store/useStore';
import { Zap, Pencil, Plus } from 'lucide-react';

export function GoalsSection({ onEditGoal, onAddGoal }: { onEditGoal: (goal: Goal) => void, onAddGoal: () => void }) {
  const goals = useStore(state => state.goals);

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div className="card-title-row">
        <h2 className="card-title">
          <Zap size={20} color="var(--accent-base)" />
          Quarterly Goals
        </h2>
        <button className="btn-icon" onClick={onAddGoal} title="Add Goal">
           <Plus size={20} />
        </button>
      </div>

      <div className="goals-grid">
        {goals.map(goal => {
          const percentage = Math.min(100, Math.round((goal.currentProgress / goal.maxProgress) * 100)) || 0;
          return (
            <div key={goal.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: 600 }}>{goal.title}</h3>
                <button className="btn-icon" onClick={() => onEditGoal(goal)}>
                  <Pencil size={14} />
                </button>
              </div>
              <div className="progress-bg">
                <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: 'white' }}>{goal.currentProgress}</strong> / {goal.maxProgress} {goal.unit}
              </p>
            </div>
          );
        })}
        {goals.length === 0 && (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.5 }}>
            No goals added yet. Add up to 3 goals.
          </div>
        )}
      </div>
    </div>
  );
}
