"use client";

import { useId, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";

type Props = {
  id: string;
  rotulo: string;
  valor: string;
  onChange: (valor: string) => void;
  sugestoes: string[];
  placeholder?: string;
  name?: string;
  /**
   * Modo estrito: só sai daqui valor que está na lista.
   *
   * A spec 21 tinha fixado o contrário — "sugestão não é validação" — porque a
   * lista era só o que tinha anúncio, e recusar teria escondido da pessoa se
   * ela errou o nome ou se não havia imóvel lá. Com o catálogo da spec 25 a
   * lista passou a ser a cidade inteira: não estar nela significa que o bairro
   * não existe, e aí recusar é informação, não silêncio.
   */
  estrito?: boolean;
  /** Sem cidade escolhida não há catálogo para listar. */
  desabilitado?: boolean;
  motivoDesabilitado?: string;
};

export function CampoComSugestoes({
  id,
  rotulo,
  valor,
  onChange,
  sugestoes,
  placeholder,
  name,
  estrito = false,
  desabilitado = false,
  motivoDesabilitado,
}: Props) {
  const listaId = useId();
  const [aberta, setAberta] = useState(false);
  const [destaque, setDestaque] = useState(-1);

  /**
   * No modo estrito o que está digitado e o que está escolhido são coisas
   * diferentes: digitar filtra a lista, e só escolher define o valor. Sem essa
   * separação, texto solto viraria valor submetido — que é o que a spec 26
   * proíbe.
   */
  const [busca, setBusca] = useState(valor);
  const campo = useRef<HTMLInputElement>(null);

  /*
    A cidade muda, o pai zera o valor, e o texto do campo precisa acompanhar.

    Ajuste durante a renderização, e não por efeito: é o padrão que o React
    documenta para reagir a mudança de prop, e não dispara a renderização em
    cascata que `setState` dentro de `useEffect` produz.
  */
  const [valorAnterior, setValorAnterior] = useState(valor);

  if (valor !== valorAnterior) {
    setValorAnterior(valor);

    if (estrito && valor === "") setBusca("");
  }

  const texto = estrito ? busca : valor;

  const filtradas = useMemo(() => {
    const termo = texto.trim().toLowerCase();

    if (!termo) return sugestoes.slice(0, 40);

    return sugestoes
      .filter((opcao) => opcao.toLowerCase().includes(termo))
      .slice(0, 40);
  }, [sugestoes, texto]);

  const semCorrespondencia = estrito && aberta && filtradas.length === 0;
  const mostrando = (aberta && filtradas.length > 0) || semCorrespondencia;

  function escolher(opcao: string) {
    if (estrito) setBusca(opcao);

    onChange(opcao);
    setAberta(false);
    setDestaque(-1);
  }

  function limpar() {
    setBusca("");
    onChange("");
    setDestaque(-1);
    campo.current?.focus();
  }

  function digitar(novo: string) {
    if (estrito) {
      setBusca(novo);
      // Enquanto nada for escolhido, não há valor: é isto que impede texto
      // solto de virar consulta.
      onChange("");
    } else {
      onChange(novo);
    }

    setAberta(true);
    setDestaque(-1);
  }

  function aoTeclar(evento: React.KeyboardEvent<HTMLInputElement>) {
    if (evento.key === "Escape") {
      setAberta(false);
      setDestaque(-1);
      return;
    }

    if (evento.key === "ArrowDown") {
      evento.preventDefault();
      setAberta(true);
      setDestaque((atual) => Math.min(atual + 1, filtradas.length - 1));
      return;
    }

    if (evento.key === "ArrowUp") {
      evento.preventDefault();
      setDestaque((atual) => Math.max(atual - 1, 0));
      return;
    }

    if (evento.key === "Enter" && mostrando && destaque >= 0) {
      evento.preventDefault();
      escolher(filtradas[destaque]);
    }
  }

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="mb-2 block text-xs tracking-[0.1em] text-muted-foreground"
      >
        {rotulo}
      </label>

      <div className="relative">
        <input
          ref={campo}
          id={id}
          name={name}
          type="text"
          role="combobox"
          aria-expanded={mostrando}
          aria-controls={listaId}
          aria-autocomplete="list"
          aria-activedescendant={
            mostrando && destaque >= 0 ? `${listaId}-${destaque}` : undefined
          }
          disabled={desabilitado}
          value={texto}
          placeholder={desabilitado ? motivoDesabilitado : placeholder}
          onChange={(evento) => digitar(evento.target.value)}
          onFocus={() => setAberta(true)}
          onBlur={() => {
            // Atraso para o clique numa opcao acontecer antes do fechamento.
            setTimeout(() => setAberta(false), 120);
          }}
          onKeyDown={aoTeclar}
          className={`min-h-14 w-full border border-border bg-card px-4 text-lg outline-none placeholder:text-muted-foreground disabled:opacity-60 ${
            texto ? "pr-12" : ""
          }`}
        />

        {texto && !desabilitado && (
          <button
            type="button"
            onClick={limpar}
            aria-label={`Limpar ${rotulo.toLowerCase()}`}
            className="absolute right-0 top-0 flex h-full w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>

      {mostrando && (
        <ul
          id={listaId}
          role="listbox"
          /*
            Nome próprio, e não o rótulo do campo: com os dois chamados
            "CIDADE", leitor de tela anuncia dois elementos com o mesmo nome e
            quem ouve não sabe em qual está.
          */
          aria-label={`Sugestões de ${rotulo.toLowerCase()}`}
          className="absolute left-0 right-0 top-full z-20 max-h-64 overflow-y-auto border border-border bg-card"
        >
          {semCorrespondencia ? (
            <li className="px-4 py-3 text-sm text-muted-foreground">
              Nenhum {rotulo.toLowerCase()} com esse nome.
            </li>
          ) : (
            filtradas.map((opcao, indice) => (
              <li
                key={opcao}
                id={`${listaId}-${indice}`}
                role="option"
                aria-selected={indice === destaque}
                onMouseDown={(evento) => {
                  // mousedown e nao click: o blur do campo chegaria antes.
                  evento.preventDefault();
                  escolher(opcao);
                }}
                onMouseEnter={() => setDestaque(indice)}
                className={`cursor-pointer px-4 py-3 text-base ${
                  indice === destaque
                    ? "bg-secondary text-foreground"
                    : "text-foreground/85"
                }`}
              >
                {opcao}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
