"use client";
import { useTenant } from "@/providers/tenant-provider";
import { useState, useEffect } from "react";

export default function TenantSelector() {
  const { tenant, setTenant } = useTenant();
  const [value, setValue] = useState(tenant);
  useEffect(() => setValue(tenant), [tenant]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label>Tenant:</label>
      <input
        value={value}
        placeholder="acme / beta"
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setTenant(value.trim())}
        style={{ padding: 6, border: "1px solid #ccc", borderRadius: 8 }}
      />
    </div>
  );
}
