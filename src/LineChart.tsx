import { Box, Checkbox, Stack, Typography } from '@mui/material'
import { blue, red } from '@mui/material/colors'
import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import simplify from 'simplify-js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface DataPoint {
  x: number
  y: number
}

function generateRealisticDataPoints(numPoints: number): DataPoint[] {
  const dataPoints: DataPoint[] = []
  let previousY = Math.floor(Math.random() * 51)

  for (let i = 0; i < numPoints; i++) {
    const x = i

    const yChange = Math.floor(Math.random() * 11) - 5
    const newY = Math.max(0, Math.min(100, previousY + yChange))

    previousY = newY

    dataPoints.push({ x, y: newY })
  }

  return dataPoints
}

const options1: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Normal Chart',
    },
  },
}

const options2: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Optimized Chart',
    },
  },
}

type LineChartProps = {
  dataLength: number
  tolerance: number
}

const LineChart = ({ dataLength, tolerance }: LineChartProps) => {
  const [showCharts, setShowCharts] = useState({ chart1: true, chart2: true })

  const values = useMemo(
    () => generateRealisticDataPoints(dataLength),
    [dataLength]
  )

  const data1: ChartData<'line', unknown[], string> = useMemo(() => {
    const labels = values.map((item) => item.x.toString())
    const data = values.map((item) => item.y)

    return {
      labels,
      datasets: [
        {
          label: 'Dataset 1',
          data,
          borderColor: red[500],
          backgroundColor: red[300],
        },
      ],
    }
  }, [values])

  const data2: ChartData<'line', unknown[], string> = useMemo(() => {
    const simplifiedValues = simplify(values, tolerance)
    const labels = simplifiedValues.map((item) => item.x.toString())
    const data = simplifiedValues.map((item) => item.y)
    return {
      labels,
      datasets: [
        {
          label: 'Dataset 1',
          data,
          borderColor: blue[500],
          backgroundColor: blue[300],
        },
      ],
    }
  }, [values, tolerance])

  return (
    <Box>
      <Stack direction={'column'} columnGap={6}>
        <Stack direction={'row'} alignItems={'center'}>
          <Stack>
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

          <Box height={250} flex={1}>
            {showCharts.chart1 && <Line options={options1} data={data1} />}
          </Box>
        </Stack>
        <Stack direction={'row'} alignItems={'center'}>
          <Stack>
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
            {showCharts.chart2 && <Line options={options2} data={data2} />}
          </Box>
        </Stack>
      </Stack>
    </Box>
  )
}

export default LineChart
