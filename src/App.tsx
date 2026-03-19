import { useState } from 'react';
import { format } from 'date-fns';
import { GoalsSection } from './components/GoalsSection';
import { HabitsSection } from './components/HabitsSection';
import { DailyTimeline } from './components/DailyTimeline';
import { ContributionGraph } from './components/ContributionGraph';

import { useStore } from './store/useStore';
import type { Goal } from './store/useStore';
import { EditGoalModal } from './components/EditGoalModal';
import { AddHabitModal } from './components/AddHabitModal';

function App() {
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isAddHabitModalOpen, setIsAddHabitModalOpen] = useState(false);

  const addGoal = useStore(state => state.addGoal);
  const goals = useStore(state => state.goals);

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
  };



  const handleAddGoalClick = () => {
    if (goals.length < 3) {
      addGoal({
        title: 'New Goal',
        currentProgress: 0,
        maxProgress: 100,
        unit: '%',
      });
    } else {
      alert('You can only have 3 active goals in your quarterly arc.');
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1 className="title">90-Day Arc</h1>
          <p style={{ color: 'var(--text-muted)' }}>{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
        </div>
      </header>

      <main>
        <div className="grid-layout">
           <div>
             <GoalsSection onEditGoal={handleEditGoal} onAddGoal={handleAddGoalClick} />
             <div style={{ marginTop: '3rem' }}>
               <DailyTimeline />
             </div>
           </div>
           <div>
             <HabitsSection onAddHabit={() => setIsAddHabitModalOpen(true)} />
             <div style={{ marginTop: '3rem' }}>
               <ContributionGraph />
             </div>
           </div>
        </div>
      </main>

      {editingGoal && (
        <EditGoalModal
          goal={editingGoal}
          onClose={() => setEditingGoal(null)}
        />
      )}

      {isAddHabitModalOpen && (
        <AddHabitModal
          onClose={() => setIsAddHabitModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
