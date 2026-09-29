"use client";

import { useId, useMemo, useRef, useState } from "react";

type Props = {
  id: string;
  rotulo: string;
  valor: string;
  onChange: (valor: string) => void;
  sugestoes: string[];
  placeholder?: string;
  name?: string;
};

/**
 * Campo de texto com lista de sugestoes.
 *
 * Nao e `<datalist>`: a renderizacao daquele elemento e do navegador, nao
 * aceita o mundo visual do produto e difere entre navegadores a ponto de o
 * comportamento de teclado nao se sustentar.
 *
 * Sugestao nao e validacao. O que a pessoa digita vai embora do jeito que ela
 * digitou, mesmo fora da lista: quem procura um bairro sem anuncio cai na
 * listagem vazia, que nomeia o motivo. Travar o campo em silencio e pior —
 * ela nao descobre se errou o nome ou se nao ha imovel la.
 */
export function CampoComSugestoes({
  id,
  rotulo,
  valor,
  onChange,
  sugestoes,
  placeholder,
  name,
}: Props) {
  const listaId = useId();
  const [aberta, setAberta] = useState(false);
  const [destaque, setDestaque] = useState(-1);
  const campo = useRef<HTMLInputElement>(null);

  const filtradas = useMemo(() => {
    const termo = valor.trim().toLowerCase();

    if (!termo) return sugestoes.slice(0, 8);

    return sugestoes
      .filter((opcao) => opcao.toLowerCase().includes(termo))
      .slice(0, 8);
  }, [sugestoes, valor]);

  const mostrando = aberta && filtradas.length > 0;

  function escolher(opcao: string) {
    onChange(opcao);
    setAberta(false);
    setDestaque(-1);
  }

  function aoTeclar(evento: React.KeyboardEvent<HTMLInputElement>) {
    if (evento.key === "Escape") {
      // Fecha sem mexer no que foi digitado.
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
      // So intercepta quando ha sugestao em destaque; sem destaque, Enter
      // submete o formulario com o que foi digitado.
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
        value={valor}
        placeholder={placeholder}
        onChange={(evento) => {
          onChange(evento.target.value);
          setAberta(true);
          setDestaque(-1);
        }}
        onFocus={() => setAberta(true)}
        onBlur={() => {
          // Atraso para o clique numa opcao acontecer antes do fechamento.
          setTimeout(() => setAberta(false), 120);
        }}
        onKeyDown={aoTeclar}
        className="min-h-14 w-full border border-border bg-card px-4 text-lg outline-none placeholder:text-muted-foreground"
      />

      {mostrando && (
        <ul
          id={listaId}
          role="listbox"
          /*
            Nome proprio, e nao o rotulo do campo: com os dois chamados
            "CIDADE", leitor de tela anuncia dois elementos com o mesmo nome e
            quem ouve nao sabe em qual esta.
          */
          aria-label={`Sugestões de ${rotulo.toLowerCase()}`}
          className="absolute left-0 right-0 top-full z-20 max-h-64 overflow-y-auto border border-border bg-card"
        >
          {filtradas.map((opcao, indice) => (
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
          ))}
        </ul>
      )}
    </div>
  );
}
