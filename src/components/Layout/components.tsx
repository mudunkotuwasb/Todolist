import { useState, useEffect } from 'react';
import styles from './LeftSidebar.module.css';

export const LeftSidebar = ({ onSelect }: { onSelect: (item: string) => void }) => {
  const menuItems = ['Dashboard', 'Completed Tasks', 'Priority Tasks', 'Calendar'];
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

import { Dashboard, PriorityTasks, Calendar } from './views';

export const MainContent = ({ selectedItem = 'Dashboard' }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateTasks, setDateTasks] = useState<any[]>([]);
  const renderContent = () => {
    switch (selectedItem) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Priority Tasks':
        return <PriorityTasks />;
      case 'Calendar':
        return (
          <div style={{ padding: '20px' }}>
            <h2>Calendar</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} style={{ textAlign: 'center', fontWeight: 'bold' }}>{day}</div>
              ))}
              {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() }, (_, i) => {
                const date = new Date(new Date().getFullYear(), new Date().getMonth(), i + 1);
                const tasks = JSON.parse(localStorage.getItem('tasks') || '[]').filter((task: any) => {
                  const taskDate = new Date(task.scheduledDate);
                  return (
                    !task.completed &&
                    taskDate.getDate() === date.getDate() &&
                    taskDate.getMonth() === date.getMonth() &&
                    taskDate.getFullYear() === date.getFullYear()
                  );
                });
                return (
                  <div 
                    key={i} 
                    style={{
                      minHeight: '80px',
                      border: '1px solid #ddd',
                      padding: '5px',
                      backgroundColor: date.getDate() === new Date().getDate() ? '#e6f7ff' : 'white'
                    }}
                    onClick={() => {
  setSelectedDate(date);
  setDateTasks(tasks);
}}
                  >
                    <div style={{ textAlign: 'right' }}>{i + 1}</div>
                    {tasks.length > 0 && (
                      <div style={{ 
                        fontSize: '0.8em', 
                        color: 'white', 
                        backgroundColor: '#1890ff', 
                        borderRadius: '10px', 
                        padding: '2px 5px', 
                        marginTop: '5px'
                      }}>
                        {tasks.length} task{tasks.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'Completed Tasks':
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]').filter((task: { completed: boolean }) => task.completed);
        return (
          <div style={{ padding: '20px' }}>
            <h2>Completed Tasks</h2>
            {tasks.map((task: any, index: number) => (
              <div
                key={index}
                style={{
                  padding: '10px',
                  marginBottom: '10px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  textDecoration: 'line-through',
                  color: '#888'
                }}
              >
                <div style={{ fontWeight: 'bold' }}>{task.title}</div>
                <div style={{ fontSize: '0.9em' }}>
                  {task.category} • {task.priority} Priority
                </div>
                <div style={{ fontSize: '0.9em' }}>
                  Completed on {new Date(task.scheduledDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      {renderContent()}
      {selectedDate && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setSelectedDate(null)}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }} onClick={e => e.stopPropagation()}>
            <h2>Tasks for {selectedDate.toLocaleDateString()}</h2>
            {dateTasks.length > 0 ? (
              dateTasks.map((task, index) => (
                <div key={index} style={{
                  padding: '10px',
                  marginBottom: '10px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  borderLeft: `4px solid ${task.priority === 'High' ? '#ff4444' : task.priority === 'Medium' ? '#ffbb33' : '#00C851'}`
                }}>
                  <div style={{ fontWeight: 'bold' }}>{task.title}</div>
                  <div style={{ fontSize: '0.9em', color: '#666' }}>
                    {task.category} • {task.priority} Priority
                  </div>
                  <div style={{ fontSize: '0.9em', color: '#666' }}>
                    {new Date(task.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              ))
            ) : (
              <p>No tasks scheduled for this date</p>
            )}
          </div>
        </div>
      )}
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
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const upcoming = storedTasks
      .filter((task: { scheduledDate: string | number | Date; }) => {
        const taskDate = new Date(task.scheduledDate);
        return (
          taskDate > now && 
          taskDate.getDate() === tomorrow.getDate() &&
          taskDate.getMonth() === tomorrow.getMonth() &&
          taskDate.getFullYear() === tomorrow.getFullYear()
        );
      })
      .map((task: { title: any; category: any; priority: any; scheduledDate: string | number | Date; }) => ({
        title: task.title,
        category: task.category,
        priority: task.priority,
        date: 'Tomorrow at ' + new Date(task.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
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
        date: 'Tomorrow at ' + new Date(task.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
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