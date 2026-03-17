import { sql } from "src/lib/db"
import CifraView from "src/app/musica/[id]/view"

interface Cifra {
  id: number
  titulo?: string
  cifra: string
  artista?: string
  tom?: string
}

export default async function MusicaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = await params
  const numeroId = parseInt(id)

  if (isNaN(numeroId)) {
    return <div className="p-10">ID inválido</div>
  }

  const resultado = await sql`
    SELECT * FROM cifras
    WHERE id = ${numeroId}
  `

  const cifra = resultado[0]

  if (!cifra) {
    return <div className="p-10">Cifra não encontrada</div>
  }

  return <CifraView cifra={cifra} />

}