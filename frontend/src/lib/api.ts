"use client";
import { useTenant } from "@/providers/tenant-provider";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001";

export function useApi() {
  const { tenant } = useTenant();

  async function get<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, { headers: { "X-Tenant": tenant } });
    if (!res.ok) throw await res.json().catch(() => ({ error: res.statusText }));
    return res.json();
  }

  async function post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Tenant": tenant },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw await res.json().catch(() => ({ error: res.statusText }));
    return res.json();
  }

  async function del(path: string): Promise<void> {
    const res = await fetch(`${BASE_URL}${path}`, { method: "DELETE", headers: { "X-Tenant": tenant } });
    if (!res.ok) throw await res.json().catch(() => ({ error: res.statusText }));
  }

  return { get, post, del };
}

