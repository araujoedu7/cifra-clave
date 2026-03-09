'use client';

import Link from 'next/link';

interface Cifra {
  id: string;
  titulo: string;
  artista?: string;
  tom?: string;
}

export default function CifraCard({ cifra }: { cifra: Cifra }) {
  return (
    <Link href={`/musica/${cifra.id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-primary/50 transition">
        <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-1">
          {cifra.titulo}
        </h3>

        <div className="flex flex-wrap gap-3 mt-2">
          {cifra.artista && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {cifra.artista}
            </span>
          )}

          {cifra.tom && (
            <span className="text-sm px-3 py-0.5 bg-accent/20 text-accent rounded-full font-medium">
              Tom: {cifra.tom}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}