'use client'

import { useState } from 'react'
import { useAuth } from '@/app/contexts/auth-context' // hook próprio do projeto (AuthProvider)
import { ChevronDown, Loader2, Search } from 'lucide-react'
import { z } from 'zod'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

// Endpoint que vai receber os filtros de busca.
// Ainda não existe — quando estiver pronto, é só apontar a URL certa aqui
// (ou trocar por process.env.NEXT_PUBLIC_API_URL + '/properties/search').
const SEARCH_ENDPOINT = '/api/properties/search'

type PropertySearchOption = {
  value: string
  label: string
}

const Property_OPTIONS: PropertySearchOption[] = [
  { value: 'alugar', label: 'Alugar um imóvel' },
  { value: 'comprar', label: 'Comprar um imóvel' },
]

type TypePropertyOption = {
  id: string
  label: string
}

const TYPE_PROPERTY_OPTIONS: TypePropertyOption[] = [
  { id: 'apartamento', label: 'Apartamento' },
  { id: 'casas-sobrados', label: 'Casas & Sobrados' },
  { id: 'casa-condominio', label: 'Casa em condomínio' },
  { id: 'kitnets-estudios', label: 'Kitnets & Estúdios' },
  { id: 'flat', label: 'Flat' },
  { id: 'loft', label: 'Loft' },
  { id: 'cobertura', label: 'Cobertura' },
]

// ---------------------------------------------------------------------------
// Validação do payload com Zod, antes de disparar o POST.
// `userId` é opcional (null) pra permitir busca de visitante não logado.
// ---------------------------------------------------------------------------
const searchPayloadSchema = z.object({
  finalidade: z.enum(['alugar', 'comprar'], {
    message: 'Selecione se você quer alugar ou comprar.',
  }),
  tiposImovel: z.array(z.string()).min(1, 'Selecione ao menos um tipo de imóvel.'),
  userId: z.number().nullable(), // User.id é number no AuthProvider do projeto
})

type PropertySearchPayload = z.infer<typeof searchPayloadSchema>

export default function BuscaHero() {
  const { user, token } = useAuth() // user?.id e token vêm do AuthProvider (JWT decodificado)

  // "O que você deseja" — seleção única
  const [propertyOpen, setPropertyOpen] = useState(false)
  const [propertySelected, setPropertySelected] = useState<string>('alugar')

  // "Tipo de Imóvel" — seleção múltipla
  const [typeOpen, setTypeOpen] = useState(false)
  const [typeSelected, setTypeSelected] = useState<string[]>(['apartamento'])

  // Estado da busca (loading/erro do POST)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  function toggleTypeProperty(id: string) {
    setTypeSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const propertyLabel =
    Property_OPTIONS.find((opt) => opt.value === propertySelected)?.label ?? 'Selecione'

  const typeLabel =
    typeSelected.length === 0
      ? 'Selecione'
      : typeSelected.length === 1
        ? TYPE_PROPERTY_OPTIONS.find((opt) => opt.id === typeSelected[0])?.label
        : `${typeSelected.length} tipos selecionados`

  async function handleBuscar() {
    setSearchError(null)

    // Monta o payload cru a partir do estado da tela.
    const rawPayload = {
      finalidade: propertySelected,
      tiposImovel: typeSelected,
      // Se tiver usuário logado (via AuthProvider), manda o id. Se não, vai
      // null e a busca segue liberada normalmente (visitante).
      userId: user?.id ?? null,
    }

    // Valida com Zod antes de qualquer chamada à API.
    const parsed = searchPayloadSchema.safeParse(rawPayload)
    if (!parsed.success) {
      setSearchError(parsed.error.issues[0]?.message ?? 'Verifique os filtros selecionados.')
      return
    }

    const payload: PropertySearchPayload = parsed.data

    setIsSearching(true)
    try {
      const response = await fetch(SEARCH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Se o backend exigir autenticação na própria rota de busca
          // (ex: pra personalizar resultado por usuário), o token do
          // AuthProvider já vai pronto aqui.
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Busca falhou com status ${response.status}`)
      }

      const data = await response.json()

      // TODO: quando o endpoint estiver pronto, decidir o que fazer com o
      // retorno aqui (redirecionar pra página de resultados, guardar num
      // estado global, etc.)
      console.log('Resultado da busca:', data)
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error)
      setSearchError('Não foi possível buscar agora. Tenta de novo em instantes.')
    } finally {
      setIsSearching(false)
    }
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
              <Popover open={propertyOpen} onOpenChange={setPropertyOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-left transition-colors hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <span className="block text-xs text-gray-500">O que você deseja?</span>
                    <span className="mt-0.5 flex items-center justify-between gap-2">
                      <span className="text-base font-semibold text-gray-900">{propertyLabel}</span>
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200',
                          propertyOpen && 'rotate-180'
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
                    value={propertySelected}
                    onValueChange={(value) => {
                      setPropertySelected(value)
                      setPropertyOpen(false)
                    }}
                  >
                    {Property_OPTIONS.map((opt) => {
                      const checked = propertySelected === opt.value
                      return (
                        <Label
                          key={opt.value}
                          htmlFor={`property-${opt.value}`}
                          className={cn(
                            'group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 font-normal transition-colors hover:bg-primary',
                            checked ? 'bg-primary/50' : ''
                          )}
                        >
                          <RadioGroupItem value={opt.value} id={`property-${opt.value}`} />
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
              <Popover open={typeOpen} onOpenChange={setTypeOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-left transition-colors hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <span className="block text-xs text-gray-500">Tipo de Imóvel</span>
                    <span className="mt-0.5 flex items-center justify-between gap-2">
                      <span className="truncate text-base font-semibold text-gray-900">
                        {typeLabel}
                      </span>
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200',
                          typeOpen && 'rotate-180'
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
                    {TYPE_PROPERTY_OPTIONS.map((opt) => {
                      const checked = typeSelected.includes(opt.id)
                      return (
                        <Label
                          key={opt.id}
                          htmlFor={`type-${opt.id}`}
                          className={cn(
                            'group flex cursor-pointer items-center gap-3 border-t border-gray-100 px-4 py-3 font-normal transition-colors first:border-t-0 hover:bg-primary',
                            checked ? 'bg-primary/50' : ''
                          )}
                        >
                          <Checkbox
                            id={`type-${opt.id}`}
                            checked={checked}
                            onCheckedChange={() => toggleTypeProperty(opt.id)}
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
                      onClick={() => setTypeOpen(false)}
                      className="w-full bg-primary hover:bg-primary/80"
                    >
                      Aplicar {typeSelected.length} selecionado
                      {typeSelected.length !== 1 ? 's' : ''}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {searchError && (
              <p className="text-sm font-medium text-primary" role="alert">
                {searchError}
              </p>
            )}

            <Button
              type="button"
              onClick={handleBuscar}
              disabled={isSearching}
              size="lg"
              className="w-full gap-2 bg-primary py-3.5 text-base hover:bg-primary/80 disabled:opacity-70"
            >
              {isSearching ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
              {isSearching ? 'Buscando...' : 'Buscar'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
