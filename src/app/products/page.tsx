"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import { z } from "zod";
import { useState } from "react";

const productSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  sku: z.string(),
  name: z.string(),
  price: z.string().or(z.number()),
  createdAt: z.string(),
});
type Product = z.infer<typeof productSchema>;

export default function ProductsPage() {
  const api = useApi();
  const qc = useQueryClient();
  const [form, setForm] = useState({ sku: "", name: "", price: "" });
  const [error, setError] = useState<string | null>(null);

  const list = useQuery({
    queryKey: ["products"],
    queryFn: () => api.get<Product[]>("/products"),
  });

  const create = useMutation({
    mutationFn: (data: { sku: string; name: string; price: number }) =>
      api.post<Product>("/products", data),
    onSuccess: () => {
      setForm({ sku: "", name: "", price: "" });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: async (e: any) =>
      setError(e?.message || e?.error || "Error al crear"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.del(`/products/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h2>Productos</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          const priceText = form.price.trim();
          const price = Number(priceText);
          if (!form.sku || !form.name || priceText === "" || !Number.isFinite(price)) {
            setError("Completa SKU, nombre y precio");
            return;
          }
          create.mutate({ sku: form.sku, name: form.name, price });
        }}
        style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}
      >
        <input
          placeholder="SKU"
          value={form.sku}
          onChange={(e) => setForm({ ...form, sku: e.target.value })}
        />
        <input
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Precio"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <button type="submit" disabled={create.isPending}>
          Crear
        </button>
        {error && <span style={{ color: "red" }}>{error}</span>}
      </form>

      {list.isLoading && <p>Cargando...</p>}
      {list.isError && <p>Error al cargar</p>}

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}>SKU</th>
            <th style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}>Nombre</th>
            <th style={{ borderBottom: "1px solid #ddd", textAlign: "right" }}>Precio</th>
            <th style={{ borderBottom: "1px solid #ddd" }}></th>
          </tr>
        </thead>
        <tbody>
          {list.data?.map((p) => (
            <tr key={p.id}>
              <td>{p.sku}</td>
              <td>{p.name}</td>
              <td style={{ textAlign: "right" }}>
                {typeof p.price === "string" ? p.price : p.price.toFixed(2)}
              </td>
              <td>
                <button onClick={() => remove.mutate(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {list.data?.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: 8, color: "#777" }}>
                Sin productos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

