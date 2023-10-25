import { blue, green, red } from '@mui/material/colors'
import { ChartOptions, ScriptableContext } from 'chart.js'
import simplify from 'simplify-js'

export interface DataPoint {
  x: number
  y: number
}

export const determineAppropriateTolerance = (
  originalData: DataPoint[],
  targetSimplifiedPoints: { min: number; max: number }
): number => {
  if (originalData.length <= targetSimplifiedPoints.max) {
    return 0.1
  }

  let tolerance = 1
  let simplifiedData = simplify(originalData, tolerance)
  let simplifiedLength = simplifiedData.length

  while (
    simplifiedLength > targetSimplifiedPoints.max ||
    simplifiedLength < targetSimplifiedPoints.min
  ) {
    tolerance *= simplifiedLength > targetSimplifiedPoints.max ? 1.25 : 0.75
    simplifiedData = simplify(originalData, tolerance)
    simplifiedLength = simplifiedData.length
  }

  const roundedTolerance = Math.ceil(tolerance * 5) / 5

  return roundedTolerance
}

export const generateRealisticDataPoints = (numPoints: number): DataPoint[] => {
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

export const createOptions = ({
  title,
}: {
  title: string
}): ChartOptions<'line'> => {
  return {
    elements: { point: { radius: 2 } },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 100,
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  }
}

export const generateGradientOnChartArea = (
  context: ScriptableContext<'line'>
) => {
  const { ctx, chartArea } = context.chart
  if (!chartArea) return

  const gradient = ctx.createLinearGradient(
    0,
    chartArea.bottom,
    0,
    chartArea.top
  )
  gradient.addColorStop(0, green[300])
  gradient.addColorStop(0.3, green[300])

  gradient.addColorStop(0.3, blue[300])
  gradient.addColorStop(0.7, blue[300])

  gradient.addColorStop(0.7, red[300])
  gradient.addColorStop(1, red[300])

  return gradient
}
