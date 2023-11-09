import simplify from 'simplify-js'
import { Point } from './utils'

const INITIAL_TOLERANCE_COEFF_A = -1e-10
const INITIAL_TOLERANCE_COEFF_B = 0.0002
const INITIAL_TOLERANCE_COEFF_C = 0.9
const BASE_TOLERANCE = 0.4
const ADJUSTMENT_RATE = 0.99
const MAX_ITERATIONS = 50

const findMinMax = (array: Point[]) => {
  const n = array.length

  // Ensure the array has at least one element
  if (n === 0) {
    return { max: undefined, min: undefined }
  }

  // Initialize max and min with the first two elements
  let max: number = Math.max(array[0].y, array[1].y)
  let min: number = Math.min(array[0].y, array[1].y)

  // Iterate through the array in pairs
  for (let i = 2; i < n - 1; i += 2) {
    const currentMax: number = Math.max(array[i].y, array[i + 1].y)
    const currentMin: number = Math.min(array[i].y, array[i + 1].y)

    // Update max and min based on the comparisons
    max = Math.max(max, currentMax)
    min = Math.min(min, currentMin)
  }

  // Handle the last element if the array has an odd length
  if (n % 2 !== 0) {
    max = Math.max(max, array[n - 1].y)
    min = Math.min(min, array[n - 1].y)
  }

  return { max, min }
}

const calculateInitialTolerance = (data: Point[]) => {
  const { max, min } = findMinMax(data)
  if (!min && !max) {
    return (
      1 ||
      Math.abs(
        INITIAL_TOLERANCE_COEFF_A * data.length ** 2 +
          INITIAL_TOLERANCE_COEFF_B * data.length +
          INITIAL_TOLERANCE_COEFF_C
      )
    )
  }
  return Math.abs((min + max) * 0.4)
}

const calculateToleranceAdjustment = (
  targetSimplifiedPoints: { minPoints: number; maxPoints: number },
  simplifiedLength: number,
  count: number,
  maxCount: number
) => {
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
  originalData = originalData.map((data) => ({ ...data, y: -data.y }))
  if (originalData.length <= targetSimplifiedPoints.maxPoints) {
    return originalData
  }

  let count = 0
  let tolerance = calculateInitialTolerance(originalData)
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
