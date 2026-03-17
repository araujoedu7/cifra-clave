'use client'

import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import Link from "next/link"

interface Cifra {
  id: number
  titulo?: string
}

// Componente interno que usa useSearchParams (obrigatório ficar dentro do Suspense)
function PlaySetlistContent() {
  const params = useSearchParams()

  const lista = params.get("lista")?.split(",").map(Number) || []

  const [cifras, setCifras] = useState<Cifra[]>([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    async function carregar() {
      const res = await fetch("/api/cifras")
      const dados = await res.json()
      setCifras(dados)
    }

    carregar()
  }, [])

  const atual = cifras.find(c => c.id === lista[index])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">

      <Link
        href="/setlist"
        className="absolute top-6 left-6 text-lg hover:underline"
      >
        ← voltar
      </Link>

      <h1 className="text-5xl font-bold mb-8 text-center px-4">
        {atual?.titulo || "Carregando..."}
      </h1>

      <div className="flex gap-6">
        <button
          onClick={() => setIndex(index - 1)}
          disabled={index === 0}
          className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 px-8 py-3 rounded-lg transition-all"
        >
          Anterior
        </button>

        <button
          onClick={() => setIndex(index + 1)}
          disabled={index === lista.length - 1}
          className="bg-amber-700 hover:bg-amber-600 disabled:opacity-50 px-8 py-3 rounded-lg transition-all"
        >
          Próxima
        </button>
      </div>

      <p className="mt-8 text-gray-400">
        {index + 1} / {lista.length}
      </p>
    </div>
  )
}

// Componente principal da página (Server Component)
export default function PlaySetlist() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-2xl">Carregando setlist...</p>
      </div>
    }>
      <PlaySetlistContent />
    </Suspense>
  )
}