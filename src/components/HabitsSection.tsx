import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { CircleCheck, Trash2, Plus } from 'lucide-react';

export function HabitsSection({ onAddHabit }: { onAddHabit: () => void }) {
  const habits = useStore(state => state.habits);
  const toggleHabitCompletion = useStore(state => state.toggleHabitCompletion);
  const updateHabit = useStore(state => state.updateHabit);
  const removeHabit = useStore(state => state.removeHabit);

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Habits List */}
      <div className="card-title-row">
        <h2 className="card-title">
          <CircleCheck size={20} color="var(--accent-base)" />
          Daily Habits
        </h2>
        <button className="btn-icon" onClick={onAddHabit} title="Add Habit">
            <Plus size={20} />
        </button>
      </div>
      <div className="habits-list">
        {habits.map(habit => {
          const isCompleted = habit.completedDates.includes(todayStr);
          return (
            <div key={habit.id} className="habit-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="checkbox"
                  className="habit-checkbox"
                  checked={isCompleted}
                  onChange={() => toggleHabitCompletion(habit.id, todayStr)}
                />
                <div>
                  <p style={{ fontWeight: 500 }}>{habit.title}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>Target: {habit.quantity}x</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <div className="habit-controls">
                    <button onClick={() => updateHabit(habit.id, { quantity: Math.max(1, habit.quantity - 1) })} style={{ padding: '0 0.5rem' }}>-</button>
                    <input 
                      type="number" 
                      value={habit.quantity} 
                      onChange={(e) => updateHabit(habit.id, { quantity: Number(e.target.value) || 1 })} 
                    />
                    <button onClick={() => updateHabit(habit.id, { quantity: habit.quantity + 1 })} style={{ padding: '0 0.5rem' }}>+</button>
                  </div>
                  <button className="btn-icon" onClick={() => removeHabit(habit.id)}>
                      <Trash2 size={16} />
                  </button>
              </div>
            </div>
          );
        })}
        {habits.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-faint)' }}>
            No habits. Start building your 90-day arc!
          </div>
        )}
      </div>
    </div>
  );
}
