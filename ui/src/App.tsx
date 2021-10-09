import { useEffect, useReducer } from 'react'
import logo from './logo.svg'
import './App.css'
import { Points, calculatePi } from './utils'

enum STEP {
  Idle,
  WaitForStart,
  WaitForPoints,
  CaluculatePi,
  ShowPi,
}

const apiUrl = (count: number) => `http://localhost:3001/points?count=${count}`

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
  | { type: 'clearCount' }
  | { type: 'setWaitForPoints' }
  | { type: 'setPoints'; points: Points }
  | { type: 'setFailure'; error: string }
  | { type: 'setPi'; piValue: number }
  | { type: 'reset' }

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'setCount':
      return { ...state, orderedCount: action.count, step: STEP.WaitForStart }
    case 'clearCount':
      return { ...state, orderedCount: null }
    case 'setWaitForPoints':
      return { ...state, step: STEP.WaitForPoints }
    case 'setPoints':
      return { ...state, points: action.points, step: STEP.CaluculatePi }
    case 'setPi':
      return { ...state, piValue: action.piValue, step: STEP.ShowPi }
    case 'setFailure':
      return { ...initialState }
    case 'reset':
      return { ...initialState }
    default:
      throw new Error()
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (state.step === STEP.WaitForPoints && state.orderedCount) {
      fetch(apiUrl(state.orderedCount))
        .then((data) => data.json())
        .then(({ points }) => {
          if (Array.isArray(points)) {
            dispatch({ type: 'setPoints', points })
          }
        })
        .catch((err) => {
          console.log('Sth went bad!')
          dispatch({ type: 'reset' })
        })
    } else if (state.step === STEP.CaluculatePi && state.orderedCount) {
      dispatch({
        type: 'setPi',
        piValue: calculatePi(state.points as Points, state.orderedCount),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.step])

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <div className='App-container'>
          {(state.step === STEP.Idle || state.step === STEP.WaitForStart) && (
            <div>
              <input
                type='text'
                pattern='[0-9]*'
                value={state.orderedCount ?? ''}
                placeholder='Please enter a number'
                onChange={(event) => {
                  const count = parseInt(event.target.value)
                  if (typeof count === 'number' && !isNaN(count)) {
                    dispatch({
                      type: 'setCount',
                      count,
                    })
                  } else {
                    dispatch({
                      type: 'clearCount',
                    })
                  }
                }}
              />

              {state.orderedCount && (
                <div>
                  <button
                    onClick={() => dispatch({ type: 'setWaitForPoints' })}
                  >
                    Calculate!
                  </button>
                </div>
              )}
            </div>
          )}
          {state.step === STEP.WaitForPoints && (
            <div>Generating points ...</div>
          )}
          {state.step === STEP.CaluculatePi && <div>Calculating PI ...</div>}
          {state.step === STEP.ShowPi && (
            <>
              <div>{state.piValue}</div>
              <button onClick={() => dispatch({ type: 'reset' })}>
                Start from scratch!
              </button>
            </>
          )}
        </div>
      </header>
    </div>
  )
}

export default App
