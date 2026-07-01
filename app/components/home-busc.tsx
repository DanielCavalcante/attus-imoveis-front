'use client'

import { useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

type DesejoOption = {
  value: string
  label: string
}

const DESEJO_OPTIONS: DesejoOption[] = [
  { value: 'alugar', label: 'Alugar um imóvel' },
  { value: 'comprar', label: 'Comprar um imóvel' },
]

type TipoImovelOption = {
  id: string
  label: string
}

const TIPO_IMOVEL_OPTIONS: TipoImovelOption[] = [
  { id: 'apartamento', label: 'Apartamento' },
  { id: 'casas-sobrados', label: 'Casas & Sobrados' },
  { id: 'casa-condominio', label: 'Casa em condomínio' },
  { id: 'kitnets-estudios', label: 'Kitnets & Estúdios' },
  { id: 'flat', label: 'Flat' },
  { id: 'loft', label: 'Loft' },
  { id: 'cobertura', label: 'Cobertura' },
]

export default function BuscaHero() {
  // "O que você deseja" — seleção única
  const [desejoOpen, setDesejoOpen] = useState(false)
  const [desejoSelected, setDesejoSelected] = useState<string>('alugar')

  // "Tipo de Imóvel" — seleção múltipla
  const [tipoOpen, setTipoOpen] = useState(false)
  const [tipoSelected, setTipoSelected] = useState<string[]>(['apartamento'])

  function toggleTipoImovel(id: string) {
    setTipoSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const desejoLabel =
    DESEJO_OPTIONS.find((opt) => opt.value === desejoSelected)?.label ?? 'Selecione'

  const tipoLabel =
    tipoSelected.length === 0
      ? 'Selecione'
      : tipoSelected.length === 1
        ? TIPO_IMOVEL_OPTIONS.find((opt) => opt.id === tipoSelected[0])?.label
        : `${tipoSelected.length} tipos selecionados`

  function handleBuscar() {
    console.log({ desejoSelected, tipoSelected })
  }

  return (
    <section className="relative flex min-h-screen w-full items-center bg-transparent">
      {/* Imagem de fundo */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/image/register.jpg" alt="" className="h-full w-full object-cover" />
      </div>

      {/* Card de busca */}
      <div className="relative z-50 mx-4 w-full max-w-md sm:ml-12 lg:ml-24">
        <Card className="rounded-2xl p-6 shadow-xl sm:p-8">
          <CardContent className="space-y-6 p-0">
            <h1 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
              Milhões de anúncios de imóveis, carros e motos
            </h1>

            <div className="space-y-4">
              {/* Popover: O que você deseja */}
              <Popover open={desejoOpen} onOpenChange={setDesejoOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-left transition-colors hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <span className="block text-xs text-gray-500">O que você deseja?</span>
                    <span className="mt-0.5 flex items-center justify-between gap-2">
                      <span className="text-base font-semibold text-gray-900">{desejoLabel}</span>
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200',
                          desejoOpen && 'rotate-180'
                        )}
                      />
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  sideOffset={8}
                  className="w-[var(--radix-popover-trigger-width)] rounded-xl p-2 shadow-2xl"
                >
                  <RadioGroup
                    value={desejoSelected}
                    onValueChange={(value) => {
                      setDesejoSelected(value)
                      setDesejoOpen(false)
                    }}
                  >
                    {DESEJO_OPTIONS.map((opt) => {
                      const checked = desejoSelected === opt.value
                      return (
                        <Label
                          key={opt.value}
                          htmlFor={`desejo-${opt.value}`}
                          className={cn(
                            'group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 font-normal transition-colors hover:bg-primary',
                            checked ? 'bg-primary/50' : ''
                          )}
                        >
                          <RadioGroupItem value={opt.value} id={`desejo-${opt.value}`} />
                          <span
                            className={cn(
                              'text-sm transition-colors group-hover:text-[#FFFFFF]',
                              checked ? 'font-semibold text-gray-900' : 'text-gray-700'
                            )}
                          >
                            {opt.label}
                          </span>
                        </Label>
                      )
                    })}
                  </RadioGroup>
                </PopoverContent>
              </Popover>

              {/* Popover: Tipo de Imóvel */}
              <Popover open={tipoOpen} onOpenChange={setTipoOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-left transition-colors hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <span className="block text-xs text-gray-500">Tipo de Imóvel</span>
                    <span className="mt-0.5 flex items-center justify-between gap-2">
                      <span className="truncate text-base font-semibold text-gray-900">
                        {tipoLabel}
                      </span>
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200',
                          tipoOpen && 'rotate-180'
                        )}
                      />
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  sideOffset={8}
                  className="w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-xl p-0 shadow-2xl"
                >
                  <div className="max-h-72 overflow-y-auto">
                    <p className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Residencial
                    </p>
                    {TIPO_IMOVEL_OPTIONS.map((opt) => {
                      const checked = tipoSelected.includes(opt.id)
                      return (
                        <Label
                          key={opt.id}
                          htmlFor={`tipo-${opt.id}`}
                          className={cn(
                            'group flex cursor-pointer items-center gap-3 border-t border-gray-100 px-4 py-3 font-normal transition-colors first:border-t-0 hover:bg-primary',
                            checked ? 'bg-primary/50' : ''
                          )}
                        >
                          <Checkbox
                            id={`tipo-${opt.id}`}
                            checked={checked}
                            onCheckedChange={() => toggleTipoImovel(opt.id)}
                          />
                          <span
                            className={cn(
                              'text-sm transition-colors group-hover:text-[#FFFFFF]',
                              checked ? 'font-semibold text-gray-900' : 'text-gray-700'
                            )}
                          >
                            {opt.label}
                          </span>
                        </Label>
                      )
                    })}
                  </div>

                  <div className="border-t border-gray-100 p-3">
                    <Button
                      type="button"
                      onClick={() => setTipoOpen(false)}
                      className="w-full bg-primary hover:bg-primary/80"
                    >
                      Aplicar {tipoSelected.length} selecionado
                      {tipoSelected.length !== 1 ? 's' : ''}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <Button
              type="button"
              onClick={handleBuscar}
              size="lg"
              className="w-full gap-2 bg-primary py-3.5 text-base hover:bg-primary/80"
            >
              <Search className="h-5 w-5" />
              Buscar
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
