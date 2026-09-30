import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { SITE } from "./lib/site";

export const alt = `${SITE.nome} — imóveis na Paraíba`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * A imagem que aparece quando alguém compartilha o site.
 *
 * Montada aqui e não gerada como arquivo: o texto sai da tipografia de
 * verdade, com o acento no lugar, em vez de ser desenhado dentro de uma
 * imagem. A marca entra como o mesmo arquivo que o favicon usa -- uma fonte
 * só para o ícone impede que os dois divirjam com o tempo.
 */
export default async function Image() {
  const marca = await readFile(join(process.cwd(), "app", "icon.png"));
  const marcaEmBase64 = `data:image/png;base64,${marca.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0c1220",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={marcaEmBase64} alt="" width={96} height={96} />

          <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
            <span style={{ fontSize: 60, fontWeight: 700, color: "#f4f1ea" }}>
              {SITE.nome}
            </span>

            <span
              style={{
                fontSize: 24,
                letterSpacing: 6,
                color: "#8b93a7",
              }}
            >
              PARAÍBA
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <span
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#f4f1ea",
              lineHeight: 1.1,
              maxWidth: 900,
            }}
          >
            Toda imobiliária aqui passou por uma pessoa antes de passar por
            você.
          </span>

          {/* O fio âmbar é o horizonte, o mesmo dispositivo das telas. */}
          <div style={{ display: "flex", width: 180, height: 4, background: "#ff9b3d" }} />
        </div>
      </div>
    ),
    size,
  );
}
