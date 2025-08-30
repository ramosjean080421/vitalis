"use client";
import { useQuery } from "@tanstack/react-query";

export default function TenantsPage() {
  const q = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/tenants");
      if (!res.ok) throw new Error("Error");
      return res.json() as Promise<{ id: string; name: string; slug: string }[]>;
    },
  });

  if (q.isLoading) return <p>Cargando…</p>;
  if (q.isError) return <p>Error al cargar tenants</p>;

  return (
    <div>
      <h2>Tenants</h2>
      <ul>{q.data.map(t => <li key={t.id}>{t.name} — <code>{t.slug}</code></li>)}</ul>
    </div>
  );
}
