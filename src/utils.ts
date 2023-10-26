import { blue, green, red } from '@mui/material/colors'
import { ChartOptions, ScriptableContext } from 'chart.js'
import simplify from 'simplify-js'

export interface Point {
  x: number
  y: number
}

export const calculateInitialTolerance = (x: number) => {
  const a = -1e-10
  const b = 0.0002
  const c = 7.9299
  return a * x ** 2 + b * x + c
}

export const simplifiedChartData = (
  originalData: Point[],
  targetSimplifiedPoints: { minPoints: number; maxPoints: number },
  chartRange: { min: number; max: number }
) => {
  if (originalData.length <= targetSimplifiedPoints.maxPoints) {
    return originalData
  }

  const maxCount = 50
  let count = 0

  let tolerance =
    originalData.length > 500 * 1000
      ? ((chartRange.max + chartRange.min) / 2) * 0.7
      : Math.abs(calculateInitialTolerance(originalData.length))

  let simplifiedData = simplify(originalData, tolerance)
  let simplifiedLength = simplifiedData.length

  while (
    simplifiedLength > targetSimplifiedPoints.maxPoints ||
    simplifiedLength < targetSimplifiedPoints.minPoints
  ) {
    const toleranceAdjustmentBase = 0.1

    const toleranceAdjustmentByDataLength =
      Math.min(targetSimplifiedPoints.maxPoints / simplifiedLength, 1) *
      0.995 *
      toleranceAdjustmentBase

    const toleranceAdjustmentByCount =
      (count / maxCount) * 0.995 * toleranceAdjustmentBase

    const toleranceAdjustment =
      toleranceAdjustmentBase -
      toleranceAdjustmentByCount * 0.5 +
      toleranceAdjustmentByDataLength * 0.5

    tolerance *=
      simplifiedLength > targetSimplifiedPoints.maxPoints
        ? 1 + toleranceAdjustment
        : 1 - toleranceAdjustment

    simplifiedData = simplify(originalData, tolerance)
    simplifiedLength = simplifiedData.length

    if (count >= maxCount) break

    count++
  }

  return simplifiedData
}

export const generateRealisticDataPoints = (numPoints: number): Point[] => {
  const dataPoints: Point[] = []
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
    animation: { duration: 0 },
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
