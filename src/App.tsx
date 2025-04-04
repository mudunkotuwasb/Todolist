import { useState } from 'react'
import { Layout } from './components/Layout/Layout'
import { LeftSidebar, MainContent, RightSidebar } from './components/Layout/components'

function App() {
  const [selectedItem, setSelectedItem] = useState('Dashboard')

  return (
    <Layout
      leftSidebar={<LeftSidebar onSelect={setSelectedItem} />}
      content={<MainContent selectedItem={selectedItem} />}
      rightSidebar={<RightSidebar />}
    />
  )
}

export default App
