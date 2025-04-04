import { useState } from 'react';
import styles from './LeftSidebar.module.css';

export const LeftSidebar = ({ onSelect }: { onSelect: (item: string) => void }) => {
  const menuItems = ['Dashboard', 'Tasks', 'Priority Tasks', 'Calendar'];
  const [selected, setSelected] = useState('Dashboard');

  const handleSelect = (item: string) => {
    setSelected(item);
    onSelect(item);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>TodoList</div>
      <ul className={styles.nav}>
        {menuItems.map((item) => (
          <li
            key={item}
            onClick={() => handleSelect(item)}
            className={`${styles.navItem} ${selected === item ? styles.active : ''}`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

import { Dashboard, Tasks, PriorityTasks, Calendar } from './views';

export const MainContent = ({ selectedItem = 'Dashboard' }) => {
  const renderContent = () => {
    switch (selectedItem) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Tasks':
        return <Tasks />;
      case 'Priority Tasks':
        return <PriorityTasks />;
      case 'Calendar':
        return <Calendar />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      {renderContent()}
    </div>
  );
};

export const RightSidebar = () => {
  const [taskTitle, setTaskTitle] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('Low');

  const categories = ['Work', 'Personal', 'Shopping'];
  const priorities = ['Low', 'Medium', 'High'];

  const handleCreateTask = () => {
    // TODO: Implement task creation logic
    console.log({ taskTitle, category, priority });
    setTaskTitle('');
  };

  const upcomingTasks = [
    { title: 'Team Meeting', category: 'Work', priority: 'High', date: 'Today, 2:00 PM' },
    { title: 'Grocery Shopping', category: 'Shopping', priority: 'Medium', date: 'Tomorrow, 10:00 AM' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2>New Task</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
          <input
            type="text"
            placeholder="Task Title Here"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          >
            {priorities.map((pri) => (
              <option key={pri} value={pri}>{pri}</option>
            ))}
          </select>
          <button
            onClick={handleCreateTask}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Create Task
          </button>
        </div>
      </div>

      <div>
        <h2>Upcoming Schedule</h2>
        <div style={{ marginTop: '15px' }}>
          {upcomingTasks.map((task, index) => (
            <div
              key={index}
              style={{
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                borderLeft: `4px solid ${task.priority === 'High' ? '#ff4444' : task.priority === 'Medium' ? '#ffbb33' : '#00C851'}`
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{task.title}</div>
              <div style={{ fontSize: '0.9em', color: '#666' }}>
                {task.category} • {task.priority} Priority
              </div>
              <div style={{ fontSize: '0.9em', color: '#666' }}>{task.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};