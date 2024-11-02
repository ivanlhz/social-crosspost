'use client';

import { SocialPostForm } from "@/presentation/components/SocialPostForm";
import { AuthorFooter } from "@/presentation/components/AuthorFooter";
import { useLanguage } from "@/presentation/context/LanguageContext";

export default function Home() {
  const { messages } = useLanguage();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-background/80">
      <div className="relative max-w-md w-full">
        {/* Borde con degradado */}
        <div className="absolute -inset-[3px] bg-gradient-to-r from-[#ff80b5] via-[#9089fc] to-[#80d5ff] rounded-xl opacity-75 blur-sm group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy" />

        {/* Contenido */}
        <div className="relative rounded-xl bg-background/90 backdrop-blur-3xl shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ff80b5] via-[#9089fc] to-[#80d5ff] inline-block text-transparent bg-clip-text">
              {messages.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {messages.subtitle}
            </p>
          </div>
          <SocialPostForm />
        </div>
      </div>

      {/* Footer con información del autor y enlaces sociales */}
      <div className="relative max-w-md w-full mt-8">
        <AuthorFooter />
      </div>
    </main>
  );
}
