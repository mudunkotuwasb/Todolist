import { useState } from 'react';

interface Task {
  id: number;
  title: string;
  category: string;
  priority: string;
  completed: boolean;
  scheduledDate: Date;
}

export const TaskDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Complete Project Proposal', category: 'Work', priority: 'High', completed: false, scheduledDate: new Date('2024-01-20T10:00:00') },
    { id: 2, title: 'Gym Session', category: 'Health & Fitness', priority: 'Medium', completed: true, scheduledDate: new Date('2024-01-20T15:00:00') },
    { id: 3, title: 'Budget Planning', category: 'Finance', priority: 'High', completed: false, scheduledDate: new Date('2024-01-21T09:00:00') },
    { id: 4, title: 'Online Course', category: 'Education', priority: 'Medium', completed: false, scheduledDate: new Date('2024-01-21T14:00:00') },
    { id: 5, title: 'House Cleaning', category: 'Household', priority: 'Low', completed: false, scheduledDate: new Date('2024-01-22T11:00:00') },
  ]);

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
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDelete = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleSave = (taskId: number, newTitle: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, title: newTitle } : task
    ));
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