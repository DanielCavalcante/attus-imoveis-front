"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Upload, ChevronRight, ArrowLeft, AlertCircle } from "lucide-react";
import { useAnnouncementForm } from "../_context/announcement-form-context";
import { announcementSchema } from "@/app/schemas/announcement";

const MAX_IMAGES = 30;

export default function RegisterImage() {
  const { formData, setFormData } = useAnnouncementForm();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imageLimitWarning, setImageLimitWarning] = useState(false);
  const router = useRouter();

  const handleSaveAndExit = () => {
    router.push("/");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const newImageUrls = files.map((file) => URL.createObjectURL(file));
    const availableSlots = MAX_IMAGES - formData.images.length;

    setImageLimitWarning(newImageUrls.length > availableSlots);

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImageUrls].slice(0, MAX_IMAGES),
    }));
  };

  const handleFinish = () => {
    const result = announcementSchema.safeParse(formData);

    if (!result.success) {
      setSubmitError(
        result.error.issues[0]?.message ?? "Verifique os dados do anúncio.",
      );
      return;
    }

    setSubmitError(null);
    router.push("/anuncie/local-user");
  };

  return (
    <div className="min-h-screen flex flex-row font-sans">
      <aside className="hidden md:flex flex-col justify-between bg-slate-950 p-12 text-white w-[400px] flex-shrink-0 min-h-screen">
        <div className="space-y-8">
          <div className="w-20 h-20 bg-transparent flex items-center justify-center rounded-xl shadow-lg overflow-hidden">
            <Image
              src="/logotipo-icon.png"
              alt="Logo"
              width={150}
              height={150}
              className="object-cover"
            />
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight max-w-sm">
            Insira fotos e vídeo do seu imóvel
          </h1>
        </div>
        <div className="flex items-center gap-6 text-slate-500 text-sm">
          <button type="button" className="flex items-center gap-2 hover:text-white transition-colors">
            Precisa de ajuda?
          </button>
          <span>© 2026 Encontrei</span>
        </div>
      </aside>

      <main className="flex-1 bg-brand-white p-10 md:p-16 flex flex-col">
        <div className="max-w-6xl w-full mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
          <header className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                  Etapa 4 de 4
                </span>

                <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-brand rounded-full"></div>
                </div>
              </div>
              <Button
                variant="outline"
                className="rounded-full px-6 text-slate-600 border-slate-700 hover:bg-slate-50"
                onClick={handleSaveAndExit}
              >
                Salvar e Sair
              </Button>
            </div>
          </header>

          <div className="max-w-3xl mx-auto flex-grow space-y-12">
            <div className="flex bg-slate-100 p-1 rounded-lg w-48">
              <button
                type="button"
                className="flex-1 py-1.5 bg-brand-white shadow rounded text-sm font-medium"
              >
                Fotos {formData.images.length}/{MAX_IMAGES}
              </button>
              <button
                type="button"
                disabled
                className="flex-1 py-1.5 text-slate-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Vídeo
              </button>
            </div>

            <label
              htmlFor="file-upload"
              className="border-2 border-dashed border-slate-400 rounded-xl p-12 flex flex-col items-center justify-center text-center text-slate-500 hover:border-brand transition-colors cursor-pointer h-64"
            >
              <Upload className="w-8 h-8 mb-4 text-slate-400" />
              <p>Arraste aqui ou carregue da galeria.</p>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {imageLimitWarning && (
              <p className="flex items-center gap-1.5 text-sm text-amber-600">
                <AlertCircle className="w-3.5 h-3.5" />
                Você atingiu o limite de {MAX_IMAGES} fotos. Algumas imagens
                não foram adicionadas.
              </p>
            )}

            <div className="space-y-4">
              <h4 className="font-semibold text-sm flex items-center gap-2 text-brand-dark">
                BOAS PRÁTICAS
              </h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>1. Fotos na horizontal</li>
                <li>2. Luz natural, sem flash</li>
                <li>3. Mostre todos os cômodos</li>
                <li>4. Inclua a fachada</li>
              </ul>
            </div>

            {submitError && (
              <p className="flex items-center gap-1.5 text-sm text-orange-600">
                <AlertCircle className="w-3.5 h-3.5" />
                {submitError}
              </p>
            )}
          </div>

          <footer className="mt-16 pt-8 border-t border-brand-white flex justify-between items-center">
            <Button
              asChild
              variant="ghost"
              className="gap-2 text-slate-600 hover:bg-brand-white border border-slate-700 px-8 h-12 rounded-xl"
            >
              <Link href="/anuncie/register-location">
                <ArrowLeft className="w-4 h-4" /> Voltar
              </Link>
            </Button>
            <Button
              className="bg-brand-dark text-brand-white px-8 h-12 rounded-xl gap-2 hover:bg-brand-light"
              onClick={handleFinish}
            >
              Finalizar o Anúncio <ChevronRight className="w-4 h-4" />
            </Button>
          </footer>
        </div>
      </main>
    </div>
  );
}