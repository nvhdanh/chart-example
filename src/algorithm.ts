import simplify from 'simplify-js'
import { Point } from './utils'

const INITIAL_TOLERANCE_COEFF_A = -1e-10
const INITIAL_TOLERANCE_COEFF_B = 0.0002
const INITIAL_TOLERANCE_COEFF_C = 0.9
const BASE_TOLERANCE = 0.1
const ADJUSTMENT_RATE = 0.99
const MAX_ITERATIONS = 40

const calculateInitialTolerance = (x: number): number =>
  Math.abs(
    INITIAL_TOLERANCE_COEFF_A * x ** 2 +
      INITIAL_TOLERANCE_COEFF_B * x +
      INITIAL_TOLERANCE_COEFF_C
  )

const calculateToleranceAdjustment = (
  targetSimplifiedPoints: { minPoints: number; maxPoints: number },
  simplifiedLength: number,
  count: number,
  maxCount: number
): number => {
  const adjustmentByDataLength =
    Math.min(targetSimplifiedPoints.maxPoints / simplifiedLength, 1) *
    ADJUSTMENT_RATE *
    BASE_TOLERANCE

  const adjustmentByCount =
    (count / maxCount) * ADJUSTMENT_RATE * BASE_TOLERANCE

  return (
    BASE_TOLERANCE -
    (adjustmentByDataLength * 50 + adjustmentByCount * 50) / 100
  )
}

export const simplifiedChartData = (
  originalData: Point[],
  targetSimplifiedPoints: { minPoints: number; maxPoints: number }
): Point[] => {
  if (originalData.length <= targetSimplifiedPoints.maxPoints) {
    return originalData
  }

  let count = 0
  let tolerance = calculateInitialTolerance(originalData.length)
  let simplifiedData = simplify(originalData, tolerance)

  while (
    simplifiedData.length > targetSimplifiedPoints.maxPoints ||
    simplifiedData.length < targetSimplifiedPoints.minPoints
  ) {
    const toleranceAdjustment = calculateToleranceAdjustment(
      targetSimplifiedPoints,
      simplifiedData.length,
      count,
      MAX_ITERATIONS
    )

    tolerance *=
      simplifiedData.length > targetSimplifiedPoints.maxPoints
        ? 1 + toleranceAdjustment
        : 1 - toleranceAdjustment

    simplifiedData = simplify(originalData, tolerance)

    if (++count >= MAX_ITERATIONS) break
  }

  return simplifiedData
}
