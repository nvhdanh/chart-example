import simplify from 'simplify-js'
import { Point } from './utils'

const calculateInitialTolerance = (x: number) => {
  const a = -1e-10
  const b = 0.0002
  const c = 0.9
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

  return base - (adjustmentByDataLength * 50 + adjustmentByCount * 50) / 100
}

export const simplifiedChartData = (
  originalData: Point[],
  targetSimplifiedPoints: { minPoints: number; maxPoints: number }
) => {
  if (originalData.length <= targetSimplifiedPoints.maxPoints) {
    return originalData
  }

  const maxCount = 50
  let count = 0

  let tolerance = Math.abs(calculateInitialTolerance(originalData.length))

  let simplifiedData = simplify(originalData, tolerance)
  console.log(tolerance)

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

    console.log(
      count,
      toleranceAdjustment.toFixed(4),
      (simplifiedData.length > targetSimplifiedPoints.maxPoints
        ? 1 + toleranceAdjustment
        : 1 - toleranceAdjustment
      ).toFixed(4),
      tolerance.toFixed(4),
      simplifiedData.length
    )
  }

  return simplifiedData
}
