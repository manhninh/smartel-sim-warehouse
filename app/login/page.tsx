export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center p-6">
      <div className="w-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold">Đăng nhập</h1>
        <p className="mt-2 text-sm text-slate-600">UI mẫu. Logic đăng nhập đi qua POST /api/auth/login.</p>
        <form className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Username</label>
            <input className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="admin" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input type="password" className="w-full rounded-xl border border-slate-300 px-3 py-2" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full rounded-xl bg-slate-900 px-4 py-2 text-white">Đăng nhập</button>
        </form>
      </div>
    </main>
  )
}
