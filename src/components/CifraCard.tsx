'use client'

import Link from "next/link"

interface Cifra {
  id: number
  titulo?: string
  cifra: string
  artista?: string
  tom?: string
}

export default function CifraCard({ cifra }: { cifra: Cifra }) {

  return (

    <Link href={`/musica/${cifra.id}`}>

      <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition cursor-pointer">

        <h3 className="text-xl font-bold text-amber-900">
          {cifra.titulo ?? "Sem título"}
        </h3>

        {cifra.artista && (
          <p className="text-gray-500 text-sm mt-1">
            {cifra.artista}
          </p>
        )}

        {cifra.tom && (
          <p className="text-sm mt-2 text-amber-700">
            Tom: {cifra.tom}
          </p>
        )}

      </div>

    </Link>

  )

}