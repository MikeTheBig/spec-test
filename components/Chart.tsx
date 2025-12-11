import { useEffect, useMemo, useRef, useState } from 'react'

type Props = { points: { ts: number; price: number }[], width?: number, height?: number }

export default function Chart({ points, width = 600, height = 120 }: Props){
  if (!points || points.length === 0) return <div className="text-slate-400">No data</div>

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [containerWidth, setContainerWidth] = useState<number | null>(null)

  // Measure container width to make SVG responsive
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
  function update(){ const node = containerRef.current; if (!node) return; setContainerWidth(Math.floor(node.clientWidth)) }
  update()
    let ro: ResizeObserver | null = null
    if ((window as any).ResizeObserver) {
      ro = new ResizeObserver(() => update())
      ro.observe(el)
    } else {
      window.addEventListener('resize', update)
    }
    return () => {
      if (ro) ro.disconnect()
      else window.removeEventListener('resize', update)
    }
  }, [])

  const prices = points.map(p => p.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = Math.max(1e-6, max - min)

  const svgWidth = containerWidth || width
  const stepX = svgWidth / Math.max(1, points.length - 1)
  const coords = points.map((p, i) => {
    const x = i * stepX
    const y = height - ((p.price - min) / range) * height
    return { x, y }
  })

  const path = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(2)} ${c.y.toFixed(2)}`).join(' ')

  const startPrice = points[0].price
  const lastPrice = points[points.length - 1].price
  const startY = height - ((startPrice - min) / range) * height
  const startUp = lastPrice >= startPrice
  const startColor = startUp ? '#10b981' : '#ef4444'

  function onMove(e: React.MouseEvent){
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const idx = Math.round(Math.max(0, Math.min(points.length - 1, x / rect.width * (points.length - 1))))
    setHoverIndex(idx)
  }

  function onLeave(){ setHoverIndex(null) }

  return (
    <div ref={containerRef} onMouseMove={onMove} onMouseLeave={onLeave} className="relative">
      <svg viewBox={`0 0 ${svgWidth} ${height}`} width="100%" height={height} className="rounded">
        <defs>
          <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {/* area and line */}
        <path d={`${path} L ${width} ${height} L 0 ${height} Z`} fill="url(#g)" opacity={0.25} />
        <path d={`${path}`} fill="none" stroke="#60a5fa" strokeWidth={2} />

        {/* start price line */}
  <line x1={0} y1={startY} x2={svgWidth} y2={startY} stroke={startColor} strokeDasharray="4 4" strokeWidth={1.5} />

        {/* hover indicator */}
        {hoverIndex !== null && coords[hoverIndex] && (
          <g>
            <circle cx={coords[hoverIndex].x} cy={coords[hoverIndex].y} r={4} fill="#60a5fa" stroke="#fff" strokeWidth={1} />
          </g>
        )}
      </svg>

      {/* time labels under chart (sampled when many points) */}
      <div className="flex justify-between text-xs text-slate-400 mt-2">
        {(() => {
          const maxLabels = 12
          const step = Math.max(1, Math.floor(points.length / maxLabels))
          return points.map((p, i) => {
            if (i % step !== 0 && i !== points.length - 1) return <div key={p.ts} style={{ width: `${100/(points.length)}%` }} />
            return (
              <div key={p.ts} style={{ width: `${100/(points.length)}%`, textAlign: 'center' }}>
                {new Date(p.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            )
          })
        })()}
      </div>

      {/* tooltip */}
      {hoverIndex !== null && points[hoverIndex] && (
        <div className="absolute bg-slate-800 text-white px-2 py-1 rounded text-sm shadow" style={{ left: `${(coords[hoverIndex].x / (svgWidth || width)) * 100}%`, top: 8, transform: 'translateX(-50%)' }}>
          <div>{new Date(points[hoverIndex].ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
          <div className="font-semibold">${points[hoverIndex].price.toFixed(2)}</div>
        </div>
      )}
    </div>
  )
}
