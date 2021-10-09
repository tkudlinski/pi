export type Point = [number, number]

export type Points = Array<Point>

const caluclateDistanceFromOrigin = (point: Point) =>
  Math.sqrt(Math.pow(point[0], 2) + Math.pow(point[1], 2))

export const calculatePi = (points: Points, numberOfPoints: number) => {
  // Count the number of points inside the quadrant, i.e. having a distance from the origin of less than 1
  const numberOfPointsInside = points
    .map((point) => caluclateDistanceFromOrigin(point) < 1)
    .reduce((acc, isInside) => (isInside ? acc + 1 : acc), 0)

  // The ratio of the inside-count and the total-sample-count is an estimate of the ratio of the two areas, π/4. Multiply the result by 4 to estimate π.
  const piValue = (numberOfPointsInside / numberOfPoints) * 4.0

  return piValue
}
