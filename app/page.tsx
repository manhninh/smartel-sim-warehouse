export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-3xl font-bold">Smartel SIM Inventory</h1>
      <p className="mt-4 text-slate-600">
        Starter blueprint cho hệ thống kho SIM bằng Next.js 16, Route Handlers, PostgreSQL 18, TypeORM và Redis.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <a className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200" href="/login">
          <h2 className="text-xl font-semibold">Đăng nhập</h2>
          <p className="mt-2 text-sm text-slate-600">Vào màn hình auth để lấy access token và refresh token.</p>
        </a>
        <a className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200" href="/api/public/sims/compact?q=8388">
          <h2 className="text-xl font-semibold">Test public API</h2>
          <p className="mt-2 text-sm text-slate-600">Endpoint compact trả mảng JSON theo định dạng yêu cầu.</p>
        </a>
      </div>
    </main>
  )
}
