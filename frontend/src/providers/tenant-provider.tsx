"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Ctx = { tenant: string; setTenant: (t: string) => void };
const TenantContext = createContext<Ctx>({ tenant: "", setTenant: () => {} });

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenantState] = useState("");
  useEffect(() => { setTenantState(localStorage.getItem("tenant") || "acme"); }, []);
  const setTenant = (t: string) => { setTenantState(t); localStorage.setItem("tenant", t); };
  return <TenantContext.Provider value={{ tenant, setTenant }}>{children}</TenantContext.Provider>;
}

export const useTenant = () => useContext(TenantContext);

