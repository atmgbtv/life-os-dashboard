import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { Activity } from 'lucide-react';

export function ContributionGraph() {
  const getDailyContribution = useStore(state => state.getDailyContribution);

  // Generate 90 days array for the graph
  const today = new Date();
  const graphDays = Array.from({ length: 91 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (90 - i));
    return format(d, 'yyyy-MM-dd');
  });

  return (
    <div className="contribution-graph">
      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Activity size={14} color="var(--accent-base)" />
        90-Day Contribution Graph
      </div>
      <div className="contribution-grid">
        {Array.from({ length: 13 }).map((_, colIndex) => (
          <div key={colIndex} className="contribution-col">
            {Array.from({ length: 7 }).map((_, rowIndex) => {
              const dayIndex = colIndex * 7 + rowIndex;
              const dDateStr = graphDays[dayIndex];
              if (!dDateStr) return <div key={rowIndex} className="contribution-square bg-accent-none" />;
              
              const ratio = getDailyContribution(dDateStr);
              let bgClass = "bg-accent-none";
              if (ratio > 0.75) bgClass = "bg-accent-filled";
              else if (ratio > 0.4) bgClass = "bg-accent-mid";
              else if (ratio > 0) bgClass = "bg-accent-low";

              return <div key={rowIndex} className={`contribution-square ${bgClass}`} title={`${dDateStr}: ${Math.round(ratio*100)}%`} />;
            })}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginTop: '0.5rem', color: 'var(--text-faint)' }}>
        <span>More habits missed</span>
        <span>100% Completed</span>
      </div>
    </div>
  );
}
