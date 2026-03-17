'use client'

import { useSearchParams } from "next/navigation"
import { useEffect,useState } from "react"
import Link from "next/link"

interface Cifra{
  id:number
  titulo?:string
}

export default function PlaySetlist(){

  const params = useSearchParams()

  const lista = params.get("lista")?.split(",").map(Number) || []

  const [cifras,setCifras] = useState<Cifra[]>([])
  const [index,setIndex] = useState(0)

  useEffect(()=>{

    async function carregar(){

      const res = await fetch("/api/cifras")
      const dados = await res.json()

      setCifras(dados)

    }

    carregar()

  },[])

  const atual = cifras.find(c=>c.id===lista[index])

  return(

    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">

      <Link
        href="/setlist"
        className="absolute top-6 left-6"
      >
        ← voltar
      </Link>

      <h1 className="text-5xl font-bold mb-6">
        {atual?.titulo}
      </h1>

      <div className="flex gap-6">

        <button
          onClick={()=>setIndex(index-1)}
          disabled={index===0}
          className="bg-gray-700 px-6 py-3 rounded-lg"
        >
          Anterior
        </button>

        <button
          onClick={()=>setIndex(index+1)}
          disabled={index===lista.length-1}
          className="bg-amber-700 px-6 py-3 rounded-lg"
        >
          Próxima
        </button>

      </div>

    </div>

  )

}