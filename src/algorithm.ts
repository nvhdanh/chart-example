import simplify from 'simplify-js'
import { Point } from './utils'

const calculateInitialTolerance = (x: number) => {
  const a = -1e-10
  const b = 0.0002
  const c = 7.9299
  return a * x ** 2 + b * x + c
}

const calculateToleranceAdjustment = (
  targetSimplifiedPoints: { minPoints: number; maxPoints: number },
  simplifiedLength: number,
  count: number,
  maxCount: number
) => {
  const base = 0.1
  const adjustmentByDataLength =
    Math.min(targetSimplifiedPoints.maxPoints / simplifiedLength, 1) *
    0.995 *
    base
  const adjustmentByCount = (count / maxCount) * 0.995 * base

  return base - adjustmentByDataLength * 0.5 + adjustmentByCount * 0.5
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
      ? (chartRange.max + chartRange.min) / 3
      : Math.abs(calculateInitialTolerance(originalData.length))

  let simplifiedData = simplify(originalData, tolerance)

  while (
    simplifiedData.length > targetSimplifiedPoints.maxPoints ||
    simplifiedData.length < targetSimplifiedPoints.minPoints
  ) {
    const toleranceAdjustment = calculateToleranceAdjustment(
      targetSimplifiedPoints,
      simplifiedData.length,
      count,
      maxCount
    )

    tolerance *=
      simplifiedData.length > targetSimplifiedPoints.maxPoints
        ? 1 + toleranceAdjustment
        : 1 - toleranceAdjustment

    simplifiedData = simplify(originalData, tolerance)

    if (++count >= maxCount) break
  }

  return simplifiedData
}
