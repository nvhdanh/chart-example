import { Box, Checkbox, Stack, Typography } from '@mui/material'
import { red } from '@mui/material/colors'
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
import { Point, createOptions } from './utils'

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
  values: Point[]
}

const NormalChart = memo(({ values }: LineChartProps) => {
  const [showCharts, setShowCharts] = useState({ chart1: false })

  const data1: ChartData<'line', unknown[], string> = useMemo(() => {
    const labels = values.map((item) => item.x.toString())
    const data = values.map((item) => item.y)

    return {
      labels,
      datasets: [
        {
          label: 'Data',
          data,
          borderColor: red[500],
          backgroundColor: red[300],
        },
      ],
    }
  }, [values])

  return (
    <Box>
      <Stack direction={'column'} columnGap={6}>
        <Stack direction={'row'} alignItems={'center'}>
          <Stack alignItems={'center'} width={100}>
            <Checkbox
              checked={showCharts.chart1}
              onChange={(e) => {
                setShowCharts((state) => ({
                  ...state,
                  chart1: e.target.checked,
                }))
              }}
            />
            <Typography variant="subtitle2" textAlign={'center'}>
              Data Points: {values.length}
            </Typography>
          </Stack>

          <Box height={400} flex={1}>
            {showCharts.chart1 && (
              <Line
                options={createOptions({ title: 'Normal Chart' })}
                data={data1}
              />
            )}
          </Box>
        </Stack>
      </Stack>
    </Box>
  )
})

export default NormalChart
