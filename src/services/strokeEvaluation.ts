import { Point2D, StrokeData, StrokeEvaluationResult } from '../types/tracing';

export interface EvaluationThresholds {
  maxAverageDistance: number; // Max average Euclidean distance (in normalized units [0, 1])
  maxStartDistance: number;   // Max distance between user start and expected start
  maxEndDistance: number;     // Max distance between user end and expected end
  minCoverageRatio: number;   // Minimum length ratio compared to expected stroke
}

export const DEFAULT_EVALUATION_THRESHOLDS: EvaluationThresholds = {
  maxAverageDistance: 0.18, // Generous 18% normalized canvas leeway for 5-8 year olds
  maxStartDistance: 0.24,   // Generous start tolerance
  maxEndDistance: 0.26,     // Generous end tolerance
  minCoverageRatio: 0.50,   // At least 50% stroke length coverage
};

/**
 * Calculates Euclidean distance between two normalized 2D points.
 */
export function distance(p1: Point2D, p2: Point2D): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates cumulative length along a sequence of points.
 */
export function calculatePathLength(points: Point2D[]): number {
  if (points.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += distance(points[i - 1], points[i]);
  }
  return total;
}

/**
 * Resamples a polyline of points into N equidistant points along the trajectory.
 */
export function resamplePoints(points: Point2D[], targetCount: number = 24): Point2D[] {
  if (points.length === 0) return [];
  if (points.length === 1) return Array(targetCount).fill(points[0]);

  const totalLength = calculatePathLength(points);
  if (totalLength === 0) return Array(targetCount).fill(points[0]);

  const segmentLength = totalLength / (targetCount - 1);
  const resampled: Point2D[] = [points[0]];

  let currentPoint = points[0];
  let accumulatedDist = 0;
  let pointIndex = 1;

  while (resampled.length < targetCount && pointIndex < points.length) {
    const nextPoint = points[pointIndex];
    const distToNext = distance(currentPoint, nextPoint);

    if (accumulatedDist + distToNext >= segmentLength) {
      const remainingNeeded = segmentLength - accumulatedDist;
      const ratio = distToNext > 0 ? remainingNeeded / distToNext : 0;
      const newPoint: Point2D = {
        x: currentPoint.x + (nextPoint.x - currentPoint.x) * ratio,
        y: currentPoint.y + (nextPoint.y - currentPoint.y) * ratio,
      };
      resampled.push(newPoint);
      currentPoint = newPoint;
      accumulatedDist = 0;
    } else {
      accumulatedDist += distToNext;
      currentPoint = nextPoint;
      pointIndex++;
    }
  }

  // Ensure target count is filled
  while (resampled.length < targetCount) {
    resampled.push(points[points.length - 1]);
  }

  return resampled;
}

/**
 * Forgiving Guided Tracing Evaluator
 * Compares child's drawn stroke with expected StrokeData trajectory.
 */
export function evaluateStroke(
  expectedStroke: StrokeData,
  userPoints: Point2D[],
  thresholds: EvaluationThresholds = DEFAULT_EVALUATION_THRESHOLDS
): StrokeEvaluationResult {
  if (userPoints.length < 2) {
    return {
      passed: false,
      score: 0,
      averageDistance: 1,
      coverage: 0,
      feedbackMessage: 'अक्षर पर अपनी उंगली या पेंसिल चलाएँ 😊',
    };
  }

  const expectedLength = calculatePathLength(expectedStroke.points);
  const userLength = calculatePathLength(userPoints);
  const coverage = expectedLength > 0 ? Math.min(1.0, userLength / expectedLength) : 1.0;

  // Too short/accidental tap
  if (coverage < thresholds.minCoverageRatio && userLength < 0.1) {
    return {
      passed: false,
      score: 0.2,
      averageDistance: 0.5,
      coverage,
      feedbackMessage: 'रेखा को पूरा खींचें ✨',
    };
  }

  // Resample both strokes to 24 equidistant points for uniform comparison
  const sampleCount = 24;
  const resampledExpected = resamplePoints(expectedStroke.points, sampleCount);
  const resampledUser = resamplePoints(userPoints, sampleCount);

  // Measure start and end anchor proximity
  const startDist = distance(resampledUser[0], resampledExpected[0]);
  const endDist = distance(resampledUser[sampleCount - 1], resampledExpected[sampleCount - 1]);

  // Compute average distance across all sample points
  let totalDist = 0;
  for (let i = 0; i < sampleCount; i++) {
    totalDist += distance(resampledUser[i], resampledExpected[i]);
  }
  const averageDist = totalDist / sampleCount;

  // Calculate score (1.0 is perfect alignment, decaying with distance)
  const score = Math.max(0, Math.min(1.0, 1.0 - averageDist * 2.5));

  const isStartNear = startDist <= thresholds.maxStartDistance;
  const isEndNear = endDist <= thresholds.maxEndDistance;
  const isAverageNear = averageDist <= thresholds.maxAverageDistance;

  if (isAverageNear && (isStartNear || isEndNear || coverage >= 0.7)) {
    return {
      passed: true,
      score,
      averageDistance: averageDist,
      coverage,
      feedbackMessage: 'बहुत बढ़िया! 🎉',
    };
  }

  if (averageDist <= thresholds.maxAverageDistance * 1.35) {
    return {
      passed: false,
      score,
      averageDistance: averageDist,
      coverage,
      feedbackMessage: 'बहुत पास! नीली रेखा के ऊपर से फिर कोशिश करो 😊',
    };
  }

  return {
    passed: false,
    score,
    averageDistance: averageDist,
    coverage,
    feedbackMessage: 'चलो फिर से कोशिश करते हैं ✏️',
  };
}
