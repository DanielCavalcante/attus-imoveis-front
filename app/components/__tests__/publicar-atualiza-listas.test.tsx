import { describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const createAnnouncement = vi.fn();

vi.mock("@/app/services/announcement-create.service", () => ({
  createAnnouncement: (...args: unknown[]) => createAnnouncement(...args),
}));

const { useCreateAnnouncement } = await import(
  "@/app/hooks/use-create-announcement"
);

describe("publicar anúncio atualiza o que ficou errado", () => {
  it("invalida a lista da conta e o acervo público", async () => {
    createAnnouncement.mockResolvedValue({ id: 1 });

    const cliente = new QueryClient({
      defaultOptions: { queries: { staleTime: 60_000 } },
    });

    const invalidadas: unknown[][] = [];
    const original = cliente.invalidateQueries.bind(cliente);

    vi.spyOn(cliente, "invalidateQueries").mockImplementation((filtros) => {
      invalidadas.push((filtros as { queryKey: unknown[] }).queryKey);
      return original(filtros as never);
    });

    const { result } = renderHook(() => useCreateAnnouncement(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={cliente}>{children}</QueryClientProvider>
      ),
    });

    await result.current.mutateAsync({} as never);

    // Sem isto o anúncio recém-publicado demorava até um minuto para aparecer
    // na tela de gerenciamento, que é justamente para onde publicar leva.
    await waitFor(() =>
      expect(invalidadas).toEqual([["announcements", "me"], ["announcements"]]),
    );
  });
});
