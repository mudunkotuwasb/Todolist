import { useEffect, useState } from 'react';

export interface Task {
  id: number;
  title: string;
  category: string;
  priority: string;
  completed: boolean;
  scheduledDate: Date;
  status: string;
}

export const TaskDashboard = () => {
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

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Sort tasks by scheduled date
  const sortedTasks = [...tasks].sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());

  const groupedTasks = sortedTasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const handleToggleComplete = (taskId: number) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    window.dispatchEvent(new Event('storage'));
  };

  const handleDelete = (taskId: number) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    window.dispatchEvent(new Event('storage'));
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleSave = (taskId: number, newTitle: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, title: newTitle } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    window.dispatchEvent(new Event('storage'));
    setEditingTask(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#f44336';
      case 'Medium': return '#ff9800';
      case 'Low': return '#4caf50';
      default: return '#000000';
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Task Dashboard</h1>
      {Object.entries(groupedTasks).map(([category, categoryTasks]) => (
        <div key={category} style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#333', marginBottom: '15px' }}>{category}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {categoryTasks.map(task => (
              <div
                key={task.id}
                style={{
                  padding: '15px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  borderLeft: `4px solid ${getPriorityColor(task.priority)}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.id)}
                  style={{ width: '20px', height: '20px' }}
                />
                <div style={{ flex: 1 }}>
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
                        borderRadius: '4px'
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? '#666' : '#000'
                      }}
                    >
                      {task.title}
                    </div>
                  )}
                  <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>
                    {task.priority} Priority • {task.scheduledDate.toLocaleString()}
                  </div>
                </div>
                {!task.completed && (
                  <button
                    onClick={() => handleEdit(task)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDelete(task.id)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};