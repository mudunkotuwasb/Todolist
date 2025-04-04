import { useState } from 'react'
import { Layout } from './components/Layout/Layout'
import { LeftSidebar, MainContent, RightSidebar } from './components/Layout/components'

function App() {
  const [selectedItem, setSelectedItem] = useState('Home')

  return (
    <Layout
      leftSidebar={<LeftSidebar />}
      content={<MainContent selectedItem={selectedItem} />}
      rightSidebar={<RightSidebar />}
    />
  )
}

export default App
