import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function Modal({ children, onClose } : { children: React.ReactNode; onClose: ()=>void }){
  useEffect(()=>{
    // prevent background scroll while modal is open
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent){ if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return ()=>{ document.body.style.overflow = prev; window.removeEventListener('keydown', onKey) }
  }, [onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-50 px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true"></div>

      <div role="dialog" aria-modal="true" className="fixed left-1/2 top-1/2 z-10 bg-white text-slate-900 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-auto transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex justify-end p-2">
          <button onClick={onClose} aria-label="Close" className="px-2 py-1 rounded hover:bg-slate-100">✕</button>
        </div>
        <div className="p-6">
          <div onClick={(e)=>e.stopPropagation()}>
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
