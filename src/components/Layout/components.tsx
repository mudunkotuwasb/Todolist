import { useState, useEffect } from 'react';
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
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  interface UpcomingTask {
  title: string;
  category: string;
  priority: string;
  date: string;
}

const [upcomingTasks, setUpcomingTasks] = useState<UpcomingTask[]>([]);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const now = new Date();
    
    const upcoming = storedTasks
      .filter((task: { scheduledDate: string | number | Date; }) => {
        const taskDate = new Date(task.scheduledDate);
        return taskDate > now;
      })
      .map((task: { title: any; category: any; priority: any; scheduledDate: string | number | Date; }) => ({
        title: task.title,
        category: task.category,
        priority: task.priority,
        date: new Date(task.scheduledDate).toLocaleString()
      }));
    
    setUpcomingTasks(upcoming);
  }, []);

  const categories = [
    'Work',
    'Health & Fitness',
    'Finance',
    'Education',
    'Social & Leisure',
    'Household'
  ];
  const priorities = ['Low', 'Medium', 'High'];

  const handleCreateTask = () => {
    if (!taskTitle || !scheduledDate || !scheduledTime) {
      alert('Please fill in all required fields');
      return;
    }
    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    
    const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const newTask = {
      id: Date.now(),
      title: taskTitle,
      category,
      priority,
      scheduledDate: scheduledDateTime,
      completed: false
    };
    
    localStorage.setItem('tasks', JSON.stringify([...storedTasks, newTask]));
    window.dispatchEvent(new Event('storage'));
    
    setTaskTitle('');
    setScheduledDate('');
    setScheduledTime('');
    
    // Update upcoming tasks
    const now = new Date();
    const upcoming = [...storedTasks, newTask]
      .filter(task => new Date(task.scheduledDate) > now)
      .map(task => ({
        title: task.title,
        category: task.category,
        priority: task.priority,
        date: new Date(task.scheduledDate).toLocaleString()
      }));
    
    setUpcomingTasks(upcoming);
  };


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
          <input
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
          <input
            type="time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
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