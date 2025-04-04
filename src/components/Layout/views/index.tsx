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
    pending: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length,
    highPriority: tasks.filter(task => task.priority === 'High' && !task.completed).length,
    pendingTasks: tasks
      .filter(task => !task.completed)
      .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
      .slice(0, 5)
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Task Dashboard</h1>
      <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <StatCard title="Total Tasks" value={taskStats.total} color="#2196F3" />
        <StatCard title="Pending Tasks" value={taskStats.pending} color="#FF9800" />
        <StatCard title="Completed Tasks" value={taskStats.completed} color="#4CAF50" />
        <StatCard title="High Priority" value={taskStats.highPriority} color="#F44336" />
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h2>Pending Tasks</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginTop: '15px' }}>
          <TaskPreview title="" tasks={taskStats.pendingTasks} onTaskUpdate={() => {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    setTasks(JSON.parse(storedTasks).map((task: any) => ({
      ...task,
      scheduledDate: new Date(task.scheduledDate)
    })));
  }
  window.dispatchEvent(new Event('storage'));
}} />
        </div>
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
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Tasks</h1>
      <div style={{ marginTop: '30px' }}>
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
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Priority Tasks</h1>
      <div style={{ marginTop: '30px' }}>
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
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Calendar</h1>
      <p>Calendar view coming soon...</p>
    </div>
  );
};

const TaskPreview = ({ title, tasks, onTaskUpdate }: { title: string; tasks: Task[]; onTaskUpdate: () => void }) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tasksState, setTasksState] = useState<Task[]>(tasks);

  useEffect(() => {
    setTasksState(tasks);
  }, [tasks]);

  const handleToggleComplete = (taskId: number) => {
    const updatedTasks = tasksState.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasksState(updatedTasks);
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      const allTasks = JSON.parse(storedTasks).map((task: any) => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      localStorage.setItem('tasks', JSON.stringify(allTasks));
      window.dispatchEvent(new Event('storage'));
      onTaskUpdate();
    }
  };

  const handleDelete = (taskId: number) => {
    const updatedTasks = tasksState.filter(task => task.id !== taskId);
    setTasksState(updatedTasks);
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      const allTasks = JSON.parse(storedTasks).filter((task: any) => task.id !== taskId);
      localStorage.setItem('tasks', JSON.stringify(allTasks));
      window.dispatchEvent(new Event('storage'));
      onTaskUpdate();
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleSave = (taskId: number, newTitle: string) => {
    const updatedTasks = tasksState.map(task =>
      task.id === taskId ? { ...task, title: newTitle } : task
    );
    setTasksState(updatedTasks);
    setEditingTask(null);
    
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      const allTasks = JSON.parse(storedTasks).map((task: any) => 
        task.id === taskId ? { ...task, title: newTitle } : task
      );
      localStorage.setItem('tasks', JSON.stringify(allTasks));
      window.dispatchEvent(new Event('storage'));
      onTaskUpdate();
    }
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>{title}</h3>
      {tasksState.length > 0 ? (
        tasksState.map(task => (
          <div key={task.id} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
            {editingTask?.id === task.id ? (
              <input
                type="text"
                value={editingTask.title}
                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                onBlur={() => handleSave(task.id, editingTask.title)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '5px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  marginBottom: '5px'
                }}
              />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
  <input
    type="checkbox"
    checked={task.completed}
    onChange={() => handleToggleComplete(task.id)}
    style={{ width: '20px', height: '20px' }}
  />
  <div style={{ 
    fontWeight: 'bold',
    textDecoration: task.completed ? 'line-through' : 'none',
    color: task.completed ? '#666' : '#000'
  }}>
    {task.title}
  </div>
</div>
            )}
            <div style={{ fontSize: '0.9em', color: '#666' }}>
              {task.category} • {task.priority} Priority
            </div>
            <div style={{ fontSize: '0.9em', color: '#666' }}>
              Due: {task.scheduledDate.toLocaleString()}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={() => handleEdit(task)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8em'
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8em'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <div style={{ color: '#999' }}>No tasks found</div>
      )}
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