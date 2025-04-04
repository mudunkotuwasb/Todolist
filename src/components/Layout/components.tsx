import { useState } from 'react';
import styles from './LeftSidebar.module.css';

export const LeftSidebar = () => {
  const menuItems = ['Dashboard', 'Tasks', 'Priority Tasks', 'Calendar'];
  const [selected, setSelected] = useState('Dashboard');

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>TodoList</div>
      <ul className={styles.nav}>
        {menuItems.map((item) => (
          <li
            key={item}
            onClick={() => setSelected(item)}
            className={`${styles.navItem} ${selected === item ? styles.active : ''}`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const MainContent = ({ selectedItem = 'Home' }) => {
  return (
    <div>
      <h1>{selectedItem}</h1>
      <p>This is the {selectedItem.toLowerCase()} content area. The content here will change based on the selection in the left sidebar.</p>
    </div>
  );
};

export const RightSidebar = () => {
  return (
    <div>
      <h2>Quick Info</h2>
      <div style={{ marginTop: '20px' }}>
        <h3>Notifications</h3>
        <p>You have 3 new messages</p>
        <h3>Recent Activity</h3>
        <p>Last login: 2 hours ago</p>
      </div>
    </div>
  );
};