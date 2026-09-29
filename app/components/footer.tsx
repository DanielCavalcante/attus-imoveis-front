import Link from "next/link";

/**
 * O que saiu deste rodape, e por que:
 *
 * - Telefone (83) 99999-9999 e contato@encontrei.com.br eram espaco reservado:
 *   canal de contato que nao existe e pior que canal nenhum.
 * - Instagram, Facebook e LinkedIn apontavam para href="#".
 * - /sobre, /termos e /privacidade nao sao rotas deste app: os tres davam 404.
 * - "alcance milhares de pessoas" e alcance que o produto ainda nao tem.
 *
 * Fica o que e verdade: para onde se pode ir, e de onde o produto e.
 */
export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-display text-2xl font-bold tracking-[-0.03em]">
              Encontrei
            </p>

            <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
              Imóveis anunciados por imobiliária verificada por gente, ou por
              quem está vendendo o próprio imóvel. Começa em João Pessoa.
            </p>
          </div>

          <nav aria-label="Navegação do rodapé">
            <h2 className="text-xs font-medium tracking-[0.12em] text-muted-foreground">
              NAVEGAR
            </h2>

            <ul className="mt-5 flex flex-col gap-3 text-sm">
              <li>
                <Link href="/imoveis" className="transition-colors hover:text-primary">
                  Imóveis
                </Link>
              </li>

              <li>
                <Link href="/anuncie" className="transition-colors hover:text-primary">
                  Anunciar um imóvel
                </Link>
              </li>

              <li>
                <Link
                  href="/portal/auth/register"
                  className="transition-colors hover:text-primary"
                >
                  Criar conta
                </Link>
              </li>

              <li>
                <Link
                  href="/portal/auth/login"
                  className="transition-colors hover:text-primary"
                >
                  Entrar
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-medium tracking-[0.12em] text-muted-foreground">
              ONDE ESTAMOS
            </h2>

            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              João Pessoa, Paraíba.
              <br />
              Atendemos a Paraíba e vamos além dela.
            </p>
          </div>
        </div>

        <p className="mt-12 border-t border-border pt-7 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Encontrei.
        </p>
      </div>
    </footer>
  );
}
