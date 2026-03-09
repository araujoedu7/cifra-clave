'use client';  // Essencial! Permite useState, useEffect, onClick, etc.

import { useState, useEffect } from 'react';
import localForage from 'localforage';
import { ArrowLeft, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const acordesBase = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function transporCifra(cifra: string, semitons: number): string {
  return cifra.replace(/([A-G]#?b?)(?![a-z])/gi, (match) => {
    const index = acordesBase.indexOf(match.toUpperCase());
    if (index === -1) return match;
    const novoIndex = (index + semitons + 12) % 12;
    return acordesBase[novoIndex];
  });
}

export default function CifraViewer() {
  const params = useParams();
  const id = params.id as string;

  const [musica, setMusica] = useState<any>(null);
  const [semitons, setSemitons] = useState(0);
  const [cifraTransposta, setCifraTransposta] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const carregar = async () => {
      try {
        const salvas = (await localForage.getItem<any[]>('cifras')) || [];
        const encontrada = salvas.find((m) => m.id === id);
        if (encontrada) {
          setMusica(encontrada);
          setCifraTransposta(encontrada.cifra);
        } else {
          setErro('Música não encontrada no repertório.');
        }
      } catch (err) {
        console.error('Erro ao carregar música:', err);
        setErro('Falha ao carregar a cifra. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, [id]);

  const handleTranspor = (delta: number) => {
    const novoSemitons = semitons + delta;
    setSemitons(novoSemitons);
    if (musica) {
      setCifraTransposta(transporCifra(musica.cifra, novoSemitons));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-light dark:bg-neutral-dark">
        <p className="text-lg text-gray-600 dark:text-gray-400">Carregando louvor...</p>
      </div>
    );
  }

  if (erro || !musica) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-light dark:bg-neutral-dark p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">{erro || 'Música não encontrada'}</h2>
        <Link href="/" className="mt-4 inline-block px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition">
          Voltar ao repertório
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-neutral-dark text-text-light dark:text-text-dark pb-20">
      {/* Header fixo */}
      <header className="fixed top-0 left-0 right-0 bg-neutral-light/95 dark:bg-neutral-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-50 shadow-soft">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition">
            <ArrowLeft className="h-6 w-6" />
            <span className="font-medium">Voltar</span>
          </Link>
          <h1 className="text-xl font-bold truncate max-w-[60%] text-center">
            {musica.titulo}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm bg-primary/10 text-primary px-4 py-1 rounded-full">
              Tom: {semitons >= 0 ? `+${semitons}` : semitons || 'Original'}
            </span>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="pt-24 px-6 max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-6 md:p-8 border border-gray-200 dark:border-gray-700">
          {/* Controles de transposição */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
            <h2 className="text-2xl font-bold text-primary">Cifra Transposta</h2>
            <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-700 px-6 py-3 rounded-xl">
              <button
                onClick={() => handleTranspor(-1)}
                className="p-3 hover:bg-accent/20 rounded-lg transition text-accent focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Diminuir 1 tom"
              >
                <ArrowUpDown className="h-6 w-6 rotate-180" />
              </button>

              <span className="text-xl font-bold min-w-[80px] text-center">
                {semitons > 0 ? `+${semitons}` : semitons}
              </span>

              <button
                onClick={() => handleTranspor(1)}
                className="p-3 hover:bg-accent/20 rounded-lg transition text-accent focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Aumentar 1 tom"
              >
                <ArrowUpDown className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Visualização da cifra */}
          <div className="overflow-x-auto bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-inner">
            <pre className="p-6 md:p-10 text-base md:text-lg leading-8 font-mono whitespace-pre-wrap break-words">
              {cifraTransposta.split('\n').map((linha, index) => (
                <div key={index} className="mb-2">
                  {linha.split(/(\s+)/).map((part, i) =>
                    /^[A-G]#?b?$/i.test(part.trim()) ? (
                      <span key={i} className="text-chord font-bold inline-block mx-1">
                        {part}
                      </span>
                    ) : (
                      part
                    )
                  )}
                </div>
              ))}
            </pre>
          </div>

          {/* Rodapé com toque espiritual */}
          <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Grupo Católico – Recife</p>
            <p className="mt-1">Louvando com o coração e a Palavra 🙏</p>
          </div>
        </div>
      </main>
    </div>
  );
}
