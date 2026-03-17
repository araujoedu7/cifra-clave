'use client'

import { useState, useEffect } from "react"
import Link from "next/link"

interface Cifra {
  id: number
  titulo?: string
  cifra: string
  artista?: string
  tom?: string
}

const notas = [
  "C", "C#", "D", "D#", "E", "F",
  "F#", "G", "G#", "A", "A#", "B"
]

function transporCifra(cifra: string, passo: number) {

  let nova = cifra

  notas.forEach((nota, index) => {

    const novaNota =
      notas[(index + passo + 12) % 12]

    const regex = new RegExp(`\\b${nota}\\b`, "g")

    nova = nova.replace(regex, novaNota)

  })

  return nova
}

// Função para destacar acordes automaticamente
function destacarAcordes(texto: string) {
  return texto.split("\n").map((linha, i) => {
    return (
      <p key={i} className="leading-10">
        {linha.split(" ").map((pal, j) => {
          const ehAcorde = /^[A-G][#b]?m?(maj7|7|sus4|sus2)?$/.test(pal)
          return ehAcorde ? (
            <span key={j} className="text-blue-700 font-bold mr-1">{pal}</span>
          ) : (
            <span key={j} className="mr-1">{pal}</span>
          )
        })}
      </p>
    )
  })
}

export default function CifraView({ cifra }: { cifra: Cifra }) {

  const [passo, setPasso] = useState(0)
  const [modoPalco, setModoPalco] = useState(false)
  const [autoScroll, setAutoScroll] = useState(false)
  const [velocidade, setVelocidade] = useState(1)
  const [editar, setEditar] = useState(false)

  const [titulo, setTitulo] = useState(cifra.titulo || "")
  const [artista, setArtista] = useState(cifra.artista || "")
  const [textoCifra, setTextoCifra] = useState(cifra.cifra)

  const cifraTransposta = transporCifra(textoCifra, passo)

  useEffect(() => {

    if (!autoScroll) return

    const interval = setInterval(() => {
      window.scrollBy({
        top: velocidade,
        behavior: "smooth"
      })
    }, 50)

    return () => clearInterval(interval)

  }, [autoScroll, velocidade])

  async function deletar() {
    if (!confirm("Deseja realmente deletar esta música?")) return

    await fetch("/api/cifras", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: cifra.id })
    })

    window.location.href = "/"
  }

  async function salvar() {
    await fetch("/api/cifras", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: cifra.id,
        titulo,
        artista,
        cifra: textoCifra,
        tom: ""
      })
    })

    setEditar(false)
  }

  return (
    <div className={`min-h-screen ${modoPalco ? "bg-black text-white" : "bg-blue-50"}`}>

      {/* HEADER */}
      <header className={`${modoPalco ? "bg-black" : "bg-white"} border-b border-blue-100`}>
        <div className="max-w-5xl mx-auto px-6 py-6">

          <Link href="/" className="text-blue-700 font-semibold hover:underline">
            ← Voltar
          </Link>

          {editar ? (
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="border p-2 rounded mt-4 w-full text-3xl font-bold text-blue-900"
            />
          ) : (
            <h1 className="text-3xl font-bold text-blue-900 mt-4">
              {titulo}
            </h1>
          )}

          {editar ? (
            <input
              value={artista}
              onChange={(e) => setArtista(e.target.value)}
              className="border p-2 rounded mt-1 w-full text-gray-700"
            />
          ) : (
            artista && <p className="text-gray-500 mt-1">{artista}</p>
          )}

        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">

        {/* CONTROLES */}
        <div className="flex flex-wrap gap-3">

          {/* transposição */}
          <button onClick={() => setPasso(passo - 1)} className="bg-blue-700 text-white px-4 py-2 rounded-lg">-</button>
          <div className="px-4 py-2 bg-white rounded-lg border">
            Tom {passo > 0 ? `+${passo}` : passo}
          </div>
          <button onClick={() => setPasso(passo + 1)} className="bg-blue-700 text-white px-4 py-2 rounded-lg">+</button>

          {/* modo palco */}
          <button onClick={() => setModoPalco(!modoPalco)} className="bg-yellow-300 text-blue-900 px-4 py-2 rounded-lg font-semibold">
            🎤 Modo palco
          </button>

          {/* scroll */}
          <button onClick={() => setAutoScroll(!autoScroll)} className="bg-green-600 text-white px-4 py-2 rounded-lg">
            {autoScroll ? "Parar rolagem" : "Auto scroll"}
          </button>

          {/* editar */}
          <button onClick={() => setEditar(!editar)} className="bg-yellow-300 text-blue-900 px-4 py-2 rounded-lg">
            ✏️ {editar ? "Cancelar" : "Editar"}
          </button>

          {/* deletar */}
          <button onClick={deletar} className="bg-red-600 text-white px-4 py-2 rounded-lg">
            🗑 Deletar
          </button>

          {/* salvar */}
          {editar && (
            <button onClick={salvar} className="bg-green-600 text-white px-4 py-2 rounded-lg">
              💾 Salvar
            </button>
          )}

        </div>

        {/* velocidade */}
        <div className="max-w-xs">
          <label className="text-sm text-gray-500">Velocidade da rolagem</label>
          <input type="range" min="1" max="10" value={velocidade} onChange={(e) => setVelocidade(Number(e.target.value))} className="w-full" />
        </div>

        {/* CIFRA */}
        <div className={`rounded-2xl p-8 shadow ${modoPalco ? "bg-black" : "bg-white"}`}>
          {editar ? (
            <textarea
              value={textoCifra}
              onChange={(e) => setTextoCifra(e.target.value)}
              className="w-full h-96 p-2 border rounded font-mono"
            />
          ) : (
            <div className="font-mono text-xl">
              {destacarAcordes(cifraTransposta)}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}