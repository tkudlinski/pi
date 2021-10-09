import { useState, useEffect } from 'react'
import logo from './logo.svg'
import './App.css'

console.log()

enum STEP {
  Idle,
}

function App() {
  const [step, setStep] = useState<STEP>(STEP.Idle)
  const [points, setPoints] = useState<Array<Array<number>>>([])
  const [piCalculation, triggerPiCalculation] = useState(false)
  useEffect(() => {
    fetch('http://localhost:3001/points?count=7')
      .then((data) => data.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPoints(data)
        }
      })
      .catch((err) => console.log('Sth went bad!'))
  }, [piCalculation])
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <div
          onClick={() => triggerPiCalculation((prevVal) => !prevVal)}
          className='App-container'
        >
          TEST
        </div>
      </header>
    </div>
  )
}

export default App
