import { useRouter } from 'next/router'

export default function BackButton(){
  const router = useRouter()
  return (
    <button onClick={()=>router.back()} className="px-3 py-1 bg-slate-200 rounded">Tilbage</button>
  )
}
