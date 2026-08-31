import React, { useRef, useCallback } from 'react';
import { CharacterTracingData, Point2D, UserStroke } from '../types/tracing';

interface TracingCanvasProps {
  character: CharacterTracingData;
  currentStrokeIndex: number;
  completedStrokes: UserStroke[];
  activeUserStroke: Point2D[];
  onStartStroke: (point: Point2D) => void;
  onExtendStroke: (point: Point2D) => void;
  onEndStroke: () => void;
  isComplete: boolean;
}

export const TracingCanvas: React.FC<TracingCanvasProps> = ({
  character,
  currentStrokeIndex,
  completedStrokes,
  activeUserStroke,
  onStartStroke,
  onExtendStroke,
  onEndStroke,
  isComplete,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Converts DOM Pointer Event coordinates into normalized [0, 1] Point2D
  const getNormalizedPoint = useCallback((e: React.PointerEvent<SVGSVGElement>): Point2D | null => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    return { x, y };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isComplete) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const point = getNormalizedPoint(e);
    if (point) onStartStroke(point);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isComplete || activeUserStroke.length === 0) return;
    const point = getNormalizedPoint(e);
    if (point) onExtendStroke(point);
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isComplete) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture was already released
    }
    onEndStroke();
  };

  const handlePointerCancel = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isComplete) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
    onEndStroke();
  };

  // Helper to build SVG path data from normalized points (viewBox 0 0 100 100)
  const toSvgPath = (points: Point2D[]): string => {
    if (points.length === 0) return '';
    const [first, ...rest] = points;
    return `M ${first.x * 100} ${first.y * 100} ` + rest.map((p) => `L ${p.x * 100} ${p.y * 100}`).join(' ');
  };

  const activeExpectedStroke = character.strokes[currentStrokeIndex] || null;

  return (
    <div className="relative w-full max-w-sm sm:max-w-md aspect-square mx-auto my-3 bg-white rounded-3xl border-4 border-toy-yellow shadow-toy-xl overflow-hidden touch-none select-none">
      {/* Slate Notebook Background Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="w-full h-full flex flex-col justify-between p-4">
          <div className="w-full border-b-2 border-dashed border-red-200" style={{ top: '22%' }} />
          <div className="w-full border-b-2 border-dashed border-sky-200" style={{ top: '50%' }} />
          <div className="w-full border-b-2 border-dashed border-sky-200" style={{ top: '85%' }} />
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        className="w-full h-full cursor-crosshair relative z-10"
        style={{ touchAction: 'none' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {/* Layer 1: Background Silhouette of Character */}
        <text
          x="50"
          y="76"
          textAnchor="middle"
          className="font-hindi text-[70px] font-black fill-slate-100/90 pointer-events-none select-none"
        >
          {character.character}
        </text>

        {/* Layer 2: Upcoming Guide Strokes (Faint Gray Dotted) */}
        {character.strokes.map((stroke, idx) => {
          if (idx <= currentStrokeIndex && !isComplete) return null;
          return (
            <path
              key={`upcoming_${stroke.id}`}
              d={toSvgPath(stroke.points)}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="4"
              strokeDasharray="2 3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none"
            />
          );
        })}

        {/* Layer 3: Active Stroke Guide (Pulsing Sky Blue) */}
        {activeExpectedStroke && !isComplete && (
          <g className="pointer-events-none">
            {/* Guide Path */}
            <path
              d={toSvgPath(activeExpectedStroke.points)}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-pulse"
              opacity="0.8"
            />

            {/* Pulsating Start Dot & Number Badge */}
            {activeExpectedStroke.points.length > 0 && (
              <g>
                <circle
                  cx={activeExpectedStroke.points[0].x * 100}
                  cy={activeExpectedStroke.points[0].y * 100}
                  r="5"
                  className="fill-toy-orange animate-ping"
                  opacity="0.75"
                />
                <circle
                  cx={activeExpectedStroke.points[0].x * 100}
                  cy={activeExpectedStroke.points[0].y * 100}
                  r="4.5"
                  className="fill-toy-orange-dark stroke-white"
                  strokeWidth="1"
                />
                <text
                  x={activeExpectedStroke.points[0].x * 100}
                  y={activeExpectedStroke.points[0].y * 100 + 1.5}
                  textAnchor="middle"
                  className="text-[3.5px] font-black fill-white font-sans pointer-events-none"
                >
                  {activeExpectedStroke.order}
                </text>
              </g>
            )}
          </g>
        )}

        {/* Layer 4: Completed User Strokes (Emerald Green & Solid) */}
        {completedStrokes.map((stroke, idx) => (
          <path
            key={`completed_${idx}`}
            d={toSvgPath(stroke.points)}
            fill="none"
            stroke="#10b981"
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-pop-in"
          />
        ))}

        {/* Layer 5: Currently Drawing Active Stroke (Bold Orange Brush) */}
        {activeUserStroke.length > 0 && (
          <path
            d={toSvgPath(activeUserStroke)}
            fill="none"
            stroke="#f97316"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>

      {/* Touch/Pencil hint banner overlay */}
      {!isComplete && completedStrokes.length === 0 && activeUserStroke.length === 0 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur border border-amber-200 px-4 py-1.5 rounded-full text-xs font-bold text-slate-600 shadow-xs pointer-events-none flex items-center gap-1.5 whitespace-nowrap">
          <span>✏️</span>
          <span>नंबर ① से शुरू करके रेखा खींचें</span>
        </div>
      )}

      {/* Completed celebration overlay banner */}
      {isComplete && (
        <div className="absolute inset-0 bg-emerald-500/10 flex flex-col items-center justify-center pointer-events-none animate-pop-in">
          <div className="bg-white px-6 py-3 rounded-3xl border-4 border-emerald-400 shadow-toy-lg text-center">
            <span className="text-4xl block mb-1">🎉</span>
            <span className="text-xl font-black font-hindi text-emerald-800">
              बहुत बढ़िया!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
