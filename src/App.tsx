import Input from './Input'
import LineChart from './LineChart'
import { Box } from '@mui/material'
import { useState } from 'react'

const App = () => {
  const [state, setState] = useState({ dataLength: 100, tolerance: 1 })

  return (
    <Box>
      <Input state={state} setState={setState} />
      <LineChart dataLength={state.dataLength} tolerance={state.tolerance} />
    </Box>
  )
}

export default App
