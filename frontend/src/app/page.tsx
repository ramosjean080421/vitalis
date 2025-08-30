import Link from "next/link";

export default function Page() {
  return (
    <main style={{ padding: 16 }}>
      <h2>VITALIS</h2>
      <ul>
        <li>
          <Link href="/products">Productos</Link>
        </li>
        <li>
          <Link href="/tenants">Tenants</Link>
        </li>
      </ul>
    </main>
  );
}

