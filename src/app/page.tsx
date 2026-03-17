'use client'

import { useState, useEffect } from "react"
import { Plus, Music, Search } from "lucide-react"
import Link from "next/link"
import CifraCard from "src/components/CifraCard"

interface Cifra {
  id: number
  titulo?: string
  cifra: string
  artista?: string
  tom?: string
}

export default function Home() {

  const [cifras,setCifras] = useState<Cifra[]>([])
  const [busca,setBusca] = useState("")
  const [abrirModal,setAbrirModal] = useState(false)

  const [nova,setNova] = useState({
    titulo:"",
    cifra:"",
    artista:"",
    tom:""
  })

  useEffect(()=>{
    carregar()
  },[])

  async function carregar(){

    try{

      const res = await fetch("/api/cifras")
      const dados = await res.json()

      setCifras(dados)

    }catch(err){

      console.error("Erro ao carregar",err)

    }

  }

  async function adicionar(){

    if(!nova.titulo.trim() || !nova.cifra.trim()) return

    try{

      const res = await fetch("/api/cifras",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify(nova)
      })

      const criada = await res.json()

      setCifras([criada,...cifras])

      setNova({
        titulo:"",
        cifra:"",
        artista:"",
        tom:""
      })

      setAbrirModal(false)

    }catch(err){

      console.error("Erro ao salvar",err)

    }

  }

  const filtradas = cifras.filter(c =>
    (c.titulo ?? "").toLowerCase().includes(busca.toLowerCase())
  )

  return(

  <div className="min-h-screen bg-blue-50">

    {/* HEADER */}

    <header className="bg-white shadow-sm border-b border-blue-100">

      <div className="max-w-5xl mx-auto px-6 py-6 flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold text-blue-900">
            Cifra Clave
          </h1>

          <p className="text-sm text-gray-500">
            Repertório do ministério
          </p>

        </div>

        <div className="flex gap-3">

          <Link
            href="/setlist"
            className="bg-yellow-300 hover:bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-semibold"
          >
            Setlist
          </Link>

          <button
            onClick={()=>setAbrirModal(true)}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >

            <Plus size={18}/>
            Nova música

          </button>

        </div>

      </div>

    </header>


    {/* CONTEÚDO */}

    <main className="max-w-5xl mx-auto px-6 py-10">

      {/* busca */}

      <div className="relative mb-8">

        <Search className="absolute left-4 top-4 text-gray-400"/>

        <input
          placeholder="Buscar música..."
          value={busca}
          onChange={(e)=>setBusca(e.target.value)}
          className="w-full pl-12 p-4 border rounded-xl bg-white"
        />

      </div>


      {/* lista */}

      {filtradas.length === 0 ?(

        <div className="text-center py-20 text-gray-500">

          <Music size={40} className="mx-auto mb-4"/>

          Nenhuma música cadastrada

        </div>

      ):(

        <div className="grid md:grid-cols-2 gap-4">

          {filtradas.map(c=>(
            <CifraCard key={c.id} cifra={c}/>
          ))}

        </div>

      )}

    </main>


    {/* MODAL */}

    {abrirModal &&(

      <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6">

        <div className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-xl">

          <h2 className="text-xl font-bold text-blue-900">
            Nova música
          </h2>

          <input
            placeholder="Título"
            value={nova.titulo}
            onChange={(e)=>setNova({...nova,titulo:e.target.value})}
            className="w-full p-3 border rounded-lg"
          />

          <input
            placeholder="Artista"
            value={nova.artista}
            onChange={(e)=>setNova({...nova,artista:e.target.value})}
            className="w-full p-3 border rounded-lg"
          />

          <input
            placeholder="Tom"
            value={nova.tom}
            onChange={(e)=>setNova({...nova,tom:e.target.value})}
            className="w-full p-3 border rounded-lg"
          />

          <textarea
            placeholder="Cole a cifra aqui..."
            value={nova.cifra}
            onChange={(e)=>setNova({...nova,cifra:e.target.value})}
            className="w-full h-40 p-3 border rounded-lg font-mono"
          />

          <div className="flex justify-end gap-3 pt-2">

            <button
              onClick={()=>setAbrirModal(false)}
              className="px-4 py-2 rounded-lg border"
            >
              cancelar
            </button>

            <button
              onClick={adicionar}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              salvar
            </button>

          </div>

        </div>

      </div>

    )}

  </div>

  )

}