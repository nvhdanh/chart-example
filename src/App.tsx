import { Box } from '@mui/material'
import { useMemo, useState } from 'react'
import Input from './Input'
import NormalChart from './NormalChart'
import OptimizedChart from './OptimizedChart'
import { generateRealisticDataPoints } from './utils'

const App = () => {
  const [dataLength, setDataLength] = useState(100)

  const values = useMemo(
    () => generateRealisticDataPoints(dataLength),
    [dataLength]
  )

  return (
    <Box>
      <Input dataLength={dataLength} setDataLength={setDataLength} />
      <OptimizedChart values={values} />
      <NormalChart values={values} />
    </Box>
  )
}

export default App
