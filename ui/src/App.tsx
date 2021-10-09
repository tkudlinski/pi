import { useEffect, useReducer } from 'react'
import logo from './logo.svg'
import './App.css'

enum STEP {
  Idle,
  WaitForStart,
  WaitForPoints,
  CaluculatePi,
  ShowPi,
}

const apiUrl = (count: number) => `http://localhost:3001/points?count=${count}`

type Point = [number, number]

type Points = Array<Point>

interface State {
  step: STEP
  points: Array<Array<number>>
  orderedCount: number | null
  piValue: number | null
  error: string
}

const initialState: State = {
  step: STEP.Idle,
  points: [],
  orderedCount: null,
  piValue: null,
  error: '',
}

type Action =
  | { type: 'setCount'; count: number }
  | { type: 'setWaitForPoints' }
  | { type: 'setPoints'; points: Points }
  | { type: 'setFailure'; error: string }
  | { type: 'setPi'; piValue: number }

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'setCount':
      return { ...state, orderedCount: action.count, step: STEP.WaitForStart }
    case 'setWaitForPoints':
      return { ...state, step: STEP.WaitForPoints }
    case 'setPoints':
      return { ...state, points: action.points, step: STEP.CaluculatePi }
    case 'setPi':
      return { ...state, piValue: action.piValue, step: STEP.ShowPi }
    case 'setFailure':
      return { ...state, error: action.error, step: STEP.Idle }
    default:
      throw new Error()
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (state.step === STEP.WaitForPoints && state.orderedCount)
      fetch(apiUrl(state.orderedCount))
        .then((data) => data.json())
        .then((points) => {
          if (Array.isArray(points)) {
            dispatch({ type: 'setPoints', points })
          }
        })
        .catch((err) => console.log('Sth went bad!'))
  }, [state.step])

  console.log('AAA state', state)

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        {(state.step === STEP.Idle || state.step === STEP.WaitForStart) && (
          <input
            type='text'
            pattern='[0-9]*'
            value={state.orderedCount ?? ''}
            onChange={(event) => {
              const count = parseInt(event.target.value)
              if (typeof count === 'number' && !isNaN(count)) {
                dispatch({
                  type: 'setCount',
                  count,
                })
              }
            }}
          />
        )}
        <button
          onClick={() => dispatch({ type: 'setWaitForPoints' })}
          className='App-container'
        >
          Calculate!
        </button>
      </header>
    </div>
  )
}

export default App
