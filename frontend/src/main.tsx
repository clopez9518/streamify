import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { StreamingApp } from './StreamingApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StreamingApp />
  </StrictMode>,
)
