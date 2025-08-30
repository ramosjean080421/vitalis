"use client";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/api";

type Tenant = { id: string; name: string; slug: string };

export default function TenantsPage() {
  const api = useApi();
  const q = useQuery({
    queryKey: ["tenants"],
    queryFn: () => api.get<Tenant[]>("/tenants"),
  });

  if (q.isLoading) return <p>Cargando...</p>;
  if (q.isError) return <p>Error al cargar tenants</p>;

  return (
    <div>
      <h2>Tenants</h2>
      <ul>
        {q.data?.map((t) => (
          <li key={t.id}>
            {t.name} - <code>{t.slug}</code>
          </li>
        ))}
        {q.data?.length === 0 && <li style={{ color: "#777" }}>Sin tenants</li>}
      </ul>
    </div>
  );
}

