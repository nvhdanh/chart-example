import { Box } from '@mui/material'
import { useState } from 'react'
import Input from './Input'
import NormalChart from './NormalChart'
import OptimizedChart from './OptimizedChart'
import { generateRealisticDataPoints } from './utils'
import { useMemo } from 'react'

const App = () => {
  const [state, setState] = useState({ dataLength: 100, tolerance: 1 })

  const values = useMemo(
    () => generateRealisticDataPoints(state.dataLength),
    [state.dataLength]
  )

  return (
    <Box>
      <Input state={state} setState={setState} />
      <OptimizedChart values={values} tolerance={state.tolerance} />
      <NormalChart values={values} />
    </Box>
  )
}

export default App
