import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "@/providers/query-client";
import { TenantProvider } from "@/providers/tenant-provider";
import TenantSelector from "@/components/tenant-selector";

export const metadata: Metadata = { title: "VITALIS", description: "Control de negocios multi-inquilino" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ReactQueryProvider>
          <TenantProvider>
            <header style={{ display: "flex", gap: 16, padding: 16, borderBottom: "1px solid #eee" }}>
              <h1 style={{ fontWeight: 700 }}>VITALIS</h1>
              <TenantSelector />
              <a href="/products">Productos</a>
              <a href="/tenants">Tenants</a>
            </header>
            <main style={{ padding: 16 }}>{children}</main>
          </TenantProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

