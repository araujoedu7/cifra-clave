import { sql } from "src/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const body = await req.json()

  const { id, titulo, artista, tom, cifra } = body

  await sql`
    INSERT INTO cifras (id, titulo, artista, tom, cifra)
    VALUES (${id}, ${titulo}, ${artista}, ${tom}, ${cifra})
  `

  return NextResponse.json({ ok: true })
}

export async function GET(){

  const cifras = await sql`
    SELECT * FROM cifras
    ORDER BY created_at DESC
  `

  return NextResponse.json(cifras)
}