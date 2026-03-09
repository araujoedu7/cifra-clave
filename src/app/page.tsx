'use client';

import { useState, useEffect } from 'react';
import localForage from 'localforage';
import { Plus, Music, Trash2, Search, Star } from 'lucide-react';
import CifraCard from 'src/components/CifraCard';

interface Cifra {
  id: string;
  titulo: string;
  cifra: string;
  artista?: string;
  tom?: string;
  favorita?: boolean;
}

export default function Home() {

  const [cifras,setCifras] = useState<Cifra[]>([])
  const [busca,setBusca] = useState('')

  const [nova,setNova] = useState({
    titulo:'',
    cifra:'',
    artista:'',
    tom:''
  })

  useEffect(()=>{
    carregar()
  },[])

  async function carregar(){
    const salvas = await localForage.getItem<Cifra[]>('cifras')
    if(salvas) setCifras(salvas)
  }

  async function salvarStorage(lista:Cifra[]){
    await localForage.setItem('cifras',lista)
  }

  async function adicionar(){

    if(!nova.titulo.trim() || !nova.cifra.trim()) return

    const novaCifra:Cifra={
      id:Date.now().toString(),
      titulo:nova.titulo.trim(),
      cifra:nova.cifra.trim(),
      artista:nova.artista.trim() || undefined,
      tom:nova.tom.trim() || undefined,
      favorita:false
    }

    const novas=[novaCifra,...cifras]

    setCifras(novas)
    salvarStorage(novas)

    setNova({
      titulo:'',
      cifra:'',
      artista:'',
      tom:''
    })

  }

  async function remover(id:string){

    const novas=cifras.filter(c=>c.id!==id)

    setCifras(novas)
    salvarStorage(novas)

  }

  async function favoritar(id:string){

    const novas=cifras.map(c=>{
      if(c.id===id){
        return {...c,favorita:!c.favorita}
      }
      return c
    })

    setCifras(novas)
    salvarStorage(novas)

  }

  const filtradas=cifras
  .filter(c=>c.titulo.toLowerCase().includes(busca.toLowerCase()))
  .sort((a,b)=>Number(b.favorita)-Number(a.favorita))

  return(

  <div className="min-h-screen bg-neutral-light dark:bg-neutral-dark text-text-light dark:text-text-dark pt-28 pb-16 px-4 sm:px-6">

  <div className="max-w-3xl mx-auto space-y-10">

  {/* Cabeçalho */}

  <div className="text-center">

  <h1 className="text-4xl sm:text-5xl font-extrabold text-primary">
  Cifra Clave
  </h1>

  <p className="text-gray-500 mt-2">
  Repertório do ministério
  </p>

  </div>

  {/* Formulário */}

  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-6 border border-gray-200 dark:border-gray-700 space-y-4">

  <input
  placeholder="Título da música"
  value={nova.titulo}
  onChange={(e)=>setNova({...nova,titulo:e.target.value})}
  className="w-full p-4 border rounded-xl"
/>

  <input
  placeholder="Artista"
  value={nova.artista}
  onChange={(e)=>setNova({...nova,artista:e.target.value})}
  className="w-full p-4 border rounded-xl"
/>

  <input
  placeholder="Tom (ex: G, D, A)"
  value={nova.tom}
  onChange={(e)=>setNova({...nova,tom:e.target.value})}
  className="w-full p-4 border rounded-xl"
/>

  <textarea
  placeholder="Cole a cifra completa aqui..."
  value={nova.cifra}
  onChange={(e)=>setNova({...nova,cifra:e.target.value})}
  className="w-full h-48 p-4 border rounded-xl font-mono"
/>

  <button
  onClick={adicionar}
  className="w-full bg-blue-600 text-white py-4 rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-primary-dark transition"
  >

  <Plus className="h-5 w-5"/>

  Salvar Louvor

  </button>

  </div>

  {/* Busca */}

  <div className="relative">

  <Search className="absolute left-4 top-4 text-gray-400 h-5 w-5"/>

  <input
  placeholder="Buscar música..."
  value={busca}
  onChange={(e)=>setBusca(e.target.value)}
  className="w-full pl-12 p-4 border rounded-xl"
/>

  </div>

  {/* Lista */}

  <section>

  <h2 className="text-2xl font-semibold text-primary mb-4">
  Repertório ({filtradas.length})
  </h2>

  {filtradas.length===0 ?(

  <div className="text-center py-12 text-gray-500">

  <Music className="mx-auto mb-3"/>

  Nenhuma música encontrada

  </div>

  ):(

  <div className="space-y-4">

  {filtradas.map(c=>(

  <div key={c.id} className="relative">

  <CifraCard cifra={c}/>

  {/* favorito */}

  <button
  onClick={()=>favoritar(c.id)}
  className={`absolute top-4 left-4 ${c.favorita ? 'text-yellow-400' : 'text-gray-400'}`}
  >

  <Star className="h-5 w-5"/>

  </button>

  {/* remover */}

  <button
  onClick={()=>remover(c.id)}
  className="absolute top-4 right-4 text-red-500"
  >

  <Trash2 className="h-4 w-4"/>

  </button>

  </div>

  ))}

  </div>

  )}

  </section>

  </div>

  </div>

  )
}