import { sql } from "src/lib/db"
import { NextResponse } from "next/server"

// LISTAR PASTAS ou MÚSICAS DE UMA PASTA
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id") // se id for passado, retorna músicas da pasta

    if (id) {
      // Retorna todas as músicas de uma pasta específica
      const cifras = await sql`
        SELECT * FROM cifras
        WHERE pasta_id = ${Number(id)}
        ORDER BY titulo ASC
      `
      return NextResponse.json(cifras)
    }

    // Senão, retorna todas as pastas
    const pastas = await sql`SELECT * FROM pastas ORDER BY nome ASC`
    return NextResponse.json(pastas)
  } catch (error) {
    console.error("ERRO AO BUSCAR PASTAS OU MÚSICAS:", error)
    return NextResponse.json(
      { error: "Erro ao buscar pastas ou músicas" },
      { status: 500 }
    )
  }
}

// CRIAR PASTA
export async function POST(request: Request) {
  try {
    const { nome } = await request.json()
    const novaPasta = await sql`
      INSERT INTO pastas (nome)
      VALUES (${nome})
      RETURNING *
    `
    return NextResponse.json(novaPasta[0])
  } catch (error) {
    console.error("ERRO AO CRIAR PASTA:", error)
    return NextResponse.json(
      { error: "Erro ao criar pasta" },
      { status: 500 }
    )
  }
}

// RENOMEAR PASTA
export async function PUT(request: Request) {
  try {
    const { id, nome } = await request.json()
    const resultado = await sql`
      UPDATE pastas
      SET nome = ${nome}
      WHERE id = ${id}
      RETURNING *
    `
    return NextResponse.json(resultado[0])
  } catch (error) {
    console.error("ERRO AO RENOMEAR PASTA:", error)
    return NextResponse.json(
      { error: "Erro ao renomear pasta" },
      { status: 500 }
    )
  }
}

// DELETAR PASTA
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()

    // Primeiro remove a referência de cifras dessa pasta
    await sql`
      UPDATE cifras
      SET pasta_id = NULL
      WHERE pasta_id = ${id}
    `

    // Depois deleta a pasta
    await sql`
      DELETE FROM pastas
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("ERRO AO DELETAR PASTA:", error)
    return NextResponse.json(
      { error: "Erro ao deletar pasta" },
      { status: 500 }
    )
  }
}