import { sql } from "src/lib/db"
import { NextResponse } from "next/server"

// LISTAR CIFRAS
export async function GET() {
  try {

    const cifras = await sql`
      SELECT * FROM cifras
      ORDER BY titulo ASC
    `

    return NextResponse.json(cifras)

  } catch (error) {

    console.error("ERRO NO BANCO:", error)

    return NextResponse.json(
      { error: "Erro ao buscar cifras" },
      { status: 500 }
    )

  }
}

// CRIAR CIFRA
export async function POST(request: Request) {

  try {

    const { titulo, cifra, artista, tom } = await request.json()

    const novaCifra = await sql`
      INSERT INTO cifras (titulo, cifra, artista, tom)
      VALUES (${titulo}, ${cifra}, ${artista}, ${tom})
      RETURNING *
    `

    return NextResponse.json(novaCifra[0])

  } catch (error) {

    console.error("ERRO AO SALVAR:", error)

    return NextResponse.json(
      { error: "Erro ao salvar cifra" },
      { status: 500 }
    )

  }

}

// EDITAR CIFRA
export async function PUT(request: Request) {

  try {

    const { id, titulo, cifra, artista, tom } = await request.json()

    const resultado = await sql`
      UPDATE cifras
      SET titulo = ${titulo},
          cifra = ${cifra},
          artista = ${artista},
          tom = ${tom}
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json(resultado[0])

  } catch (error) {

    console.error("ERRO AO EDITAR:", error)

    return NextResponse.json(
      { error: "Erro ao editar cifra" },
      { status: 500 }
    )

  }

}


// DELETAR CIFRA
export async function DELETE(request: Request) {

  try {

    const { id } = await request.json()

    await sql`
      DELETE FROM cifras
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })

  } catch (error) {

    console.error("ERRO AO DELETAR:", error)

    return NextResponse.json(
      { error: "Erro ao deletar cifra" },
      { status: 500 }
    )

  }

}