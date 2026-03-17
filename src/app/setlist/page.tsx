'use client'

import { useEffect, useState } from "react"
import Link from "next/link"

interface Cifra {
  id: number
  titulo?: string
}

export default function SetlistPage(){

  const [cifras,setCifras] = useState<Cifra[]>([])
  const [setlist,setSetlist] = useState<number[]>([])

  useEffect(()=>{

    async function carregar(){

      const res = await fetch("/api/cifras")
      const dados = await res.json()

      setCifras(dados)

    }

    carregar()

  },[])

  function adicionar(id:number){

    setSetlist([...setlist,id])

  }

  function remover(index:number){

    const nova = [...setlist]
    nova.splice(index,1)

    setSetlist(nova)

  }

  return(

    <div className="min-h-screen bg-amber-50 p-10">

      <div className="max-w-4xl mx-auto">

        <Link
          href="/"
          className="text-amber-700 font-semibold"
        >
          ← Voltar
        </Link>

        <h1 className="text-4xl font-bold text-amber-900 mt-6">
          Setlist da Missa
        </h1>

        {/* lista de cifras */}

        <div className="mt-10 grid gap-3">

          {cifras.map(c=>(

            <button
              key={c.id}
              onClick={()=>adicionar(c.id)}
              className="bg-white border p-4 rounded-lg text-left hover:bg-amber-100"
            >
              {c.titulo}
            </button>

          ))}

        </div>

        {/* setlist */}

        <h2 className="text-2xl font-semibold mt-10">
          Ordem da missa
        </h2>

        <div className="mt-4 space-y-3">

          {setlist.map((id,index)=>{

            const musica = cifras.find(c=>c.id===id)

            return(

              <div
                key={index}
                className="flex justify-between bg-white p-4 rounded-lg"
              >

                <span>
                  {index+1}. {musica?.titulo}
                </span>

                <button
                  onClick={()=>remover(index)}
                  className="text-red-500"
                >
                  remover
                </button>

              </div>

            )

          })}

        </div>

        {/* tocar setlist */}

        {setlist.length>0 && (

          <Link
            href={`/setlist/play?lista=${setlist.join(",")}`}
            className="mt-8 inline-block bg-amber-700 text-white px-6 py-3 rounded-lg"
          >
            🎵 Tocar Setlist
          </Link>

        )}

      </div>

    </div>

  )

}