import { useState, useEffect } from 'react';
import { Task } from './TaskDashboard';

export const Dashboard = () => {
  type NewType = Task;

  const [tasks, setTasks] = useState<NewType[]>(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks).map((task: any) => ({
      ...task,
      scheduledDate: new Date(task.scheduledDate)
    })) : [];
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks).map((task: any) => ({
          ...task,
          scheduledDate: new Date(task.scheduledDate)
        })));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed).length,
    highPriority: tasks.filter(task => task.priority === 'High').length
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Task Dashboard</h1>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginTop: '20px'
      }}>
        <StatCard title="Total Tasks" value={taskStats.total} color="#4CAF50" />
        <StatCard title="Completed" value={taskStats.completed} color="#2196F3" />
        <StatCard title="Pending" value={taskStats.pending} color="#FF9800" />
        <StatCard title="High Priority" value={taskStats.highPriority} color="#f44336" />
      </div>
    </div>
  );
};

export const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks).map((task: any) => ({
      ...task,
      scheduledDate: new Date(task.scheduledDate)
    })) : [];
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks).map((task: any) => ({
          ...task,
          scheduledDate: new Date(task.scheduledDate)
        })));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Tasks</h1>
      <div style={{ marginTop: '20px' }}>
        {tasks.map(task => (
          <div
            key={task.id}
            style={{
              padding: '15px',
              marginBottom: '10px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <h3 style={{ margin: 0 }}>{task.title}</h3>
              <span style={{ color: '#666' }}>{task.priority} priority</span>
            </div>
            <span style={{
              padding: '5px 10px',
              borderRadius: '15px',
              backgroundColor: task.status === 'completed' ? '#4CAF50' : '#FF9800',
              color: 'white'
            }}>
              {task.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PriorityTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks).map((task: any) => ({
      ...task,
      scheduledDate: new Date(task.scheduledDate)
    })) : [];
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks).map((task: any) => ({
          ...task,
          scheduledDate: new Date(task.scheduledDate)
        })));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const priorityTasks = tasks
    .filter(task => task.priority === 'High' && !task.completed)
    .map(task => ({
      id: task.id,
      title: task.title,
      deadline: task.scheduledDate.toLocaleString(),
      priority: task.priority
    }));

  return (
    <div style={{ padding: '20px' }}>
      <h1>Priority Tasks</h1>
      <div style={{ marginTop: '20px' }}>
        {priorityTasks.map(task => (
          <div
            key={task.id}
            style={{
              padding: '15px',
              marginBottom: '10px',
              backgroundColor: '#fff4f4',
              borderRadius: '4px',
              borderLeft: '4px solid #f44336'
            }}
          >
            <h3 style={{ margin: '0 0 5px 0' }}>{task.title}</h3>
            <span style={{ color: '#666' }}>Due: {task.deadline}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Calendar = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Calendar</h1>
      <p>Calendar view coming soon...</p>
    </div>
  );
};

const StatCard = ({ title, value, color }: { title: string; value: number; color: string }) => {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderTop: `3px solid ${color}`
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{title}</h3>
      <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color }}>{value}</p>
    </div>
  );
};