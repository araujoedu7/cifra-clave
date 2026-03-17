'use client'

import { useState, useEffect } from "react"
import { Plus, Music, Search, FolderPlus, Trash2, Folder } from "lucide-react"
import Link from "next/link"
import CifraCard from "src/components/CifraCard"

interface Cifra {
  id: number
  titulo?: string
  cifra: string
  artista?: string
  tom?: string
  pasta_id?: number | null
}

interface Pasta {
  id: number
  nome: string
}

export default function Home() {

  const [cifras,setCifras] = useState<Cifra[]>([])
  const [pastas,setPastas] = useState<Pasta[]>([])
  const [busca,setBusca] = useState("")
  const [abrirModal,setAbrirModal] = useState(false)
  const [abrirNovaPasta,setAbrirNovaPasta] = useState(false)
  const [abrirAdicionarExistente,setAbrirAdicionarExistente] = useState(false)
  const [pastaAberta, setPastaAberta] = useState<Pasta | null>(null)

  const [nova,setNova] = useState<{
    titulo: string
    cifra: string
    artista: string
    tom: string
    pasta_id: number | null
  }>({
    titulo:"",
    cifra:"",
    artista:"",
    tom:"",
    pasta_id: null
  })

  const [novaPasta,setNovaPasta] = useState("")
  const [musicaSelecionada,setMusicaSelecionada] = useState<number | null>(null)

  useEffect(()=>{
    carregar()
    carregarPastas()
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

  async function carregarPastas(){
    try{
      const res = await fetch("/api/pastas")
      const dados = await res.json()
      setPastas(dados)
    }catch(err){
      console.error("Erro ao carregar pastas",err)
    }
  }

  async function adicionar(){
    if(!nova.titulo.trim() || !nova.cifra.trim()) return
    try{
      const res = await fetch("/api/cifras",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(nova)
      })
      const criada = await res.json()
      setCifras([criada,...cifras])
      setNova({titulo:"", cifra:"", artista:"", tom:"", pasta_id: null})
      setAbrirModal(false)
    }catch(err){
      console.error("Erro ao salvar",err)
    }
  }

  async function criarPasta(){
    if(!novaPasta.trim()) return
    try{
      const res = await fetch("/api/pastas",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({nome:novaPasta})
      })
      const criada = await res.json()
      setPastas([criada,...pastas])
      setNovaPasta("")
      setAbrirNovaPasta(false)
    }catch(err){
      console.error("Erro ao criar pasta",err)
    }
  }

  async function deletarPasta(id: number){
    if(!confirm("Deseja realmente deletar esta pasta?")) return
    try{
      await fetch("/api/pastas",{
        method:"DELETE",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({id})
      })
      carregarPastas()
      setPastaAberta(null)
    }catch(err){
      console.error("Erro ao deletar pasta",err)
    }
  }

  async function moverMusica(cifraId: number, pastaId: number | null){
    try{
      await fetch("/api/cifras",{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({id:cifraId, pasta_id: pastaId})
      })
      carregar()
    }catch(err){
      console.error("Erro ao mover música",err)
    }
  }

  async function adicionarMusicaExistente(musicaId: number){
    if(pastaAberta) {
      await moverMusica(musicaId, pastaAberta.id)
      setAbrirAdicionarExistente(false)
    }
  }

  const filtradas = cifras.filter(c =>
    (c.titulo ?? "").toLowerCase().includes(busca.toLowerCase())
  )

  const musicasSemPasta = filtradas.filter(c => !c.pasta_id)

  return (
  <div className="min-h-screen bg-blue-50">

    {/* HEADER */}
    <header className="bg-white shadow-sm border-b border-blue-100">
      <div className="max-w-5xl mx-auto px-6 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Cifra Clave</h1>
          <p className="text-sm text-gray-500">Repertório do ministério</p>
        </div>

        <div className="flex gap-3">
          <Link href="/setlist" className="bg-yellow-300 hover:bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-semibold">Setlist</Link>

          <button onClick={()=>setAbrirNovaPasta(true)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <FolderPlus size={18}/> Nova Pasta
          </button>

          <button onClick={()=>setAbrirModal(true)} className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus size={18}/> Nova música
          </button>
        </div>
      </div>
    </header>

    {/* BUSCA */}
    <main className="max-w-5xl mx-auto px-6 py-10">

      <div className="relative mb-8">
        <Search className="absolute left-4 top-4 text-gray-400"/>
        <input placeholder="Buscar música..." value={busca} onChange={(e)=>setBusca(e.target.value)} className="w-full pl-12 p-4 border rounded-xl bg-white"/>
      </div>

      {/* PASTAS */}
      <div className="mb-8 space-y-4">
        {pastas.map(pasta => (
          <div key={pasta.id} className="flex items-center justify-between bg-white p-3 rounded-xl shadow cursor-pointer hover:bg-blue-50"
            onClick={()=>setPastaAberta(pasta)}
          >
            <div className="flex items-center gap-2">
              <Folder size={20} className="text-blue-700"/>
              <span className="font-semibold text-blue-900">{pasta.nome}</span>
            </div>
            <button onClick={(e)=>{ e.stopPropagation(); deletarPasta(pasta.id) }} className="text-red-600 hover:text-red-800">
              <Trash2 size={18}/>
            </button>
          </div>
        ))}
      </div>

      {/* PASTA ABERTA */}
      {pastaAberta && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-2 flex justify-between items-center">
            {pastaAberta.nome}
            <button onClick={()=>setAbrirAdicionarExistente(true)} className="bg-green-600 text-white px-3 py-1 rounded-lg flex items-center gap-1">
              + Adicionar música
            </button>
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {filtradas.filter(c=>c.pasta_id===pastaAberta.id).map(c=>(
              <div key={c.id} className="cursor-move" draggable
                onDragStart={e=>e.dataTransfer.setData("cifraId",c.id.toString())}
              >
                <CifraCard cifra={c}/>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEM PASTA */}
      {musicasSemPasta.length > 0 && !pastaAberta && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-2">Sem pasta</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {musicasSemPasta.map(c=>(
              <div key={c.id} className="cursor-move" draggable
                onDragStart={e=>e.dataTransfer.setData("cifraId",c.id.toString())}
              >
                <CifraCard cifra={c}/>
              </div>
            ))}
          </div>
        </div>
      )}

    </main>

    {/* MODAL NOVA MÚSICA */}
    {abrirModal &&(
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-xl">
          <h2 className="text-xl font-bold text-blue-900">Nova música</h2>
          <input placeholder="Título" value={nova.titulo} onChange={(e)=>setNova({...nova,titulo:e.target.value})} className="w-full p-3 border rounded-lg"/>
          <input placeholder="Artista" value={nova.artista} onChange={(e)=>setNova({...nova,artista:e.target.value})} className="w-full p-3 border rounded-lg"/>
          <input placeholder="Tom" value={nova.tom} onChange={(e)=>setNova({...nova,tom:e.target.value})} className="w-full p-3 border rounded-lg"/>
          <select value={nova.pasta_id ?? ""} onChange={e=>setNova({...nova,pasta_id:e.target.value?Number(e.target.value):null})} className="w-full p-3 border rounded-lg bg-white">
            <option value="">Sem pasta</option>
            {pastas.map(p=>(
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
          <textarea placeholder="Cole a cifra aqui..." value={nova.cifra} onChange={(e)=>setNova({...nova,cifra:e.target.value})} className="w-full h-40 p-3 border rounded-lg font-mono"/>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={()=>setAbrirModal(false)} className="px-4 py-2 rounded-lg border">cancelar</button>
            <button onClick={adicionar} className="bg-blue-700 text-white px-4 py-2 rounded-lg">salvar</button>
          </div>
        </div>
      </div>
    )}

    {/* MODAL NOVA PASTA */}
    {abrirNovaPasta &&(
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-sm rounded-2xl p-6 space-y-4 shadow-xl">
          <h2 className="text-xl font-bold text-blue-900">Nova pasta</h2>
          <input placeholder="Nome da pasta" value={novaPasta} onChange={(e)=>setNovaPasta(e.target.value)} className="w-full p-3 border rounded-lg"/>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={()=>setAbrirNovaPasta(false)} className="px-4 py-2 rounded-lg border">cancelar</button>
            <button onClick={criarPasta} className="bg-green-600 text-white px-4 py-2 rounded-lg">salvar</button>
          </div>
        </div>
      </div>
    )}

    {/* MODAL ADICIONAR MÚSICA EXISTENTE */}
    {abrirAdicionarExistente && pastaAberta && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-xl">
          <h2 className="text-xl font-bold text-blue-900">Adicionar música à pasta "{pastaAberta.nome}"</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {cifras.filter(c => !c.pasta_id).map(c => (
              <div key={c.id} className="flex justify-between items-center p-2 border rounded hover:bg-blue-50 cursor-pointer">
                <span>{c.titulo}</span>
                <button onClick={()=>adicionarMusicaExistente(c.id)} className="bg-blue-700 text-white px-3 py-1 rounded-lg">Adicionar</button>
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={()=>setAbrirAdicionarExistente(false)} className="px-4 py-2 rounded-lg border">fechar</button>
          </div>
        </div>
      </div>
    )}

  </div>
  )
}