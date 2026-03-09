'use client';

import { useState, useEffect } from 'react';
import localForage from 'localforage';
import { ArrowLeft, ArrowUpDown, Play, Pause, AArrowUp, AArrowDown, Monitor } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Cifra {
  id: string;
  titulo: string;
  cifra: string;
  artista?: string;
  tom?: string;
}

const acordesBase = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

function transporCifra(cifra:string,semitons:number){
  return cifra.replace(/([A-G]#?b?)/g,(match)=>{
    const index = acordesBase.indexOf(match.toUpperCase());
    if(index===-1) return match;
    const novo = (index+semitons+12)%12;
    return acordesBase[novo];
  })
}

export default function MusicaPage(){

  const params = useParams()
  const id = params.id as string

  const [musica,setMusica] = useState<Cifra|null>(null)
  const [semitons,setSemitons] = useState(0)
  const [cifra,setCifra] = useState('')
  const [fonte,setFonte] = useState(18)
  const [scroll,setScroll] = useState(false)
  const [modoPalco,setModoPalco] = useState(false)

  useEffect(()=>{
    carregar()
  },[])

  async function carregar(){
    const salvas = await localForage.getItem<Cifra[]>('cifras') || []
    const encontrada = salvas.find((m)=>m.id===id)

    if(encontrada){
      setMusica(encontrada)
      setCifra(encontrada.cifra)
    }
  }

  const transpor=(delta:number)=>{
    const novo = semitons + delta
    setSemitons(novo)

    if(musica){
      setCifra(transporCifra(musica.cifra,novo))
    }
  }

  useEffect(()=>{
    if(!scroll) return

    const id = setInterval(()=>{
      window.scrollBy(0,1)
    },40)

    return ()=>clearInterval(id)

  },[scroll])

  if(!musica){
    return <div className="p-10 text-center">Carregando...</div>
  }

  return(

  <div className={`${modoPalco ? 'bg-black text-yellow-300' : 'bg-neutral-light dark:bg-neutral-dark'} min-h-screen pt-24 pb-20 px-4`}>

  <div className="max-w-4xl mx-auto">

  {/* topo */}

  <div className="flex flex-wrap gap-4 items-center justify-between mb-8">

  <Link href="/" className="flex gap-2 items-center text-primary">
  <ArrowLeft className="h-5 w-5"/>
  Voltar
  </Link>

  <h1 className="font-bold text-xl">
  {musica.titulo}
  </h1>

  </div>

  {/* controles */}

  <div className="flex flex-wrap gap-3 mb-8">

  <button
  onClick={()=>transpor(-1)}
  className="px-4 py-2 bg-gray-200 rounded-lg"
  >
  - Tom
  </button>

  <button
  onClick={()=>transpor(1)}
  className="px-4 py-2 bg-gray-200 rounded-lg"
  >
  + Tom
  </button>

  <button
  onClick={()=>setFonte(fonte-2)}
  className="px-4 py-2 bg-gray-200 rounded-lg flex gap-2 items-center"
  >
  <AArrowDown className="h-4 w-4"/>
  Fonte
  </button>

  <button
  onClick={()=>setFonte(fonte+2)}
  className="px-4 py-2 bg-gray-200 rounded-lg flex gap-2 items-center"
  >
  <AArrowUp className="h-4 w-4"/>
  Fonte
  </button>

  <button
  onClick={()=>setScroll(!scroll)}
  className="px-4 py-2 bg-gray-200 rounded-lg flex gap-2 items-center"
  >
  {scroll ? <Pause className="h-4 w-4"/> : <Play className="h-4 w-4"/>}
  Scroll
  </button>

  <button
  onClick={()=>setModoPalco(!modoPalco)}
  className="px-4 py-2 bg-gray-200 rounded-lg flex gap-2 items-center"
  >
  <Monitor className="h-4 w-4"/>
  Modo palco
  </button>

  </div>

  {/* cifra */}

  <pre
  style={{fontSize:fonte}}
  className="font-mono whitespace-pre-wrap leading-relaxed"
  >

  {cifra.split('\n').map((linha,idx)=>(

  <div key={idx}>

  {linha.split(/(\s+)/).map((part,i)=>

  /^[A-G]#?b?$/i.test(part.trim()) ?

  <span key={i} className="text-yellow-500 font-bold">
  {part}
  </span>

  :

  part

  )}

  </div>

  ))}

  </pre>

  </div>

  </div>

  )
}