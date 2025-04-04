import { ReactNode } from 'react';
import styles from './Layout.module.css';

interface LayoutProps {
  leftSidebar: ReactNode;
  content: ReactNode;
  rightSidebar: ReactNode;
}

export const Layout = ({ leftSidebar, content, rightSidebar }: LayoutProps) => {
  return (
    <div className={styles.container}>
      <aside className={styles.leftSidebar}>
        {leftSidebar}
      </aside>
      <main className={styles.content}>
        {content}
      </main>
      <aside className={styles.rightSidebar}>
        {rightSidebar}
      </aside>
    </div>
  );
};