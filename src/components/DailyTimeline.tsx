import { useStore } from '../store/useStore';
import type { SalahTime } from '../store/useStore';
import { Clock, GripVertical } from 'lucide-react';
import { format } from 'date-fns';

const SALAH_DISPLAY_ORDER: SalahTime[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export function DailyTimeline() {
  const habits = useStore(state => state.habits);
  const relocateHabit = useStore(state => state.relocateHabit);
  
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  return (
    <div>
      <h2 className="card-title" style={{ marginBottom: '1.5rem' }}>
        <Clock size={20} color="var(--accent-base)" />
        Daily Timeline
      </h2>

      <div className="timeline-card">
        {/* Header Labels */}
        <div className="timeline-labels">
          {SALAH_DISPLAY_ORDER.map(s => (
            <div key={s} className="timeline-label-item">
              <span className="timeline-label-text">{s}</span>
            </div>
          ))}
        </div>

        {/* The Grid */}
        <div className="timeline-grid">
          {SALAH_DISPLAY_ORDER.map(salahTime => {
            const timeHabits = habits.filter(h => h.salahTime === salahTime);
            
            return (
              <div key={salahTime} className="timeline-column">
                {timeHabits.map(habit => {
                  const isCompleted = habit.completedDates.includes(todayStr);
                  return (
                    <div 
                      key={habit.id} 
                      className={`timeline-block ${isCompleted ? 'completed' : 'pending'}`}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', overflow: 'hidden' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {habit.title}
                        </span>
                        {/* 
                           In a real app we'd use DND, but to keep it functional per the request: 
                           Adding a small hidden-ish select to allow relocation easily.
                        */}
                        <select 
                          style={{ 
                            fontSize: '8px', 
                            background: 'transparent', 
                            border: 'none', 
                            color: 'inherit', 
                            opacity: 0.5, 
                            cursor: 'pointer',
                            padding: 0,
                            marginTop: '2px',
                            appearance: 'none'
                          }}
                          value={habit.salahTime}
                          onChange={(e) => relocateHabit(habit.id, e.target.value as SalahTime)}
                        >
                           {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'None'].map(t => <option key={t} value={t} style={{ color: 'black' }}>{t}</option>)}
                        </select>
                      </div>
                      <GripVertical size={14} className="drag-handle" />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
