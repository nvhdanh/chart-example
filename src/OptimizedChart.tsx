import { Box, Checkbox, Stack, Typography } from '@mui/material'
import { blue } from '@mui/material/colors'
import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { memo, useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import simplify from 'simplify-js'
import {
  DataPoint,
  createOptions,
  determineAppropriateTolerance,
  generateGradientOnChartArea,
} from './utils'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

type LineChartProps = {
  values: DataPoint[]
}

const OptimizedChart = memo(({ values }: LineChartProps) => {
  const [showCharts, setShowCharts] = useState({ chart2: true })
  const tolerance = determineAppropriateTolerance(values, {
    min: 300,
    max: 800,
  })

  const data2: ChartData<'line', unknown[], string> = useMemo(() => {
    const simplifiedValues = simplify(values, tolerance)
    const labels = simplifiedValues.map((item) => item.x.toString())
    const data = simplifiedValues.map((item) => item.y)
    return {
      labels,
      datasets: [
        {
          label: 'Optimized Data',
          data,
          pointBackgroundColor: generateGradientOnChartArea,
          borderColor: generateGradientOnChartArea,
          backgroundColor: blue[300],
        },
      ],
    }
  }, [values, tolerance])

  return (
    <Box>
      <Stack direction={'column'} columnGap={6}>
        <Stack direction={'row'} alignItems={'center'}>
          <Stack alignItems={'center'} width={100}>
            <Checkbox
              checked={showCharts.chart2}
              onChange={(e) => {
                setShowCharts((state) => ({
                  ...state,
                  chart2: e.target.checked,
                }))
              }}
            />
            <Typography variant="subtitle2" textAlign={'center'}>
              Data Points: {simplify(values, tolerance).length}
            </Typography>
          </Stack>
          <Box height={250} flex={1}>
            {showCharts.chart2 && (
              <Line
                options={createOptions({ title: 'Optimized Chart' })}
                data={data2}
              />
            )}
          </Box>
        </Stack>
      </Stack>
    </Box>
  )
})

export default OptimizedChart
