import { Box } from '@mui/material'
import { useMemo, useState, useEffect } from 'react'
import Input from './Input'
import NormalChart from './NormalChart'
import OptimizedChart from './OptimizedChart'
import {
  determineAppropriateTolerance,
  generateRealisticDataPoints,
} from './utils'

const App = () => {
  const [state, setState] = useState({ dataLength: 100, tolerance: 1 })

  const values = useMemo(
    () => generateRealisticDataPoints(state.dataLength),
    [state.dataLength]
  )

  const tolerance = useMemo(
    () => determineAppropriateTolerance(values, 800),
    [values]
  )

  useEffect(() => {
    setState((state) => ({ ...state, tolerance }))
  }, [tolerance])

  return (
    <Box>
      <Input state={state} setState={setState} />
      <OptimizedChart values={values} tolerance={state.tolerance} />
      <NormalChart values={values} />
    </Box>
  )
}

export default App
