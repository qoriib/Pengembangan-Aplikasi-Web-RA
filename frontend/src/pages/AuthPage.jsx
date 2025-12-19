import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { login, register, setError, error, user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      if (mode === "login") {
        await login(form.email, form.password);
        navigate("/");
      } else {
        await register({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        });
        navigate("/");
      }
    } catch (err) {
      setMessage(err.message || "Gagal memproses permintaan");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <section className="w-full max-w-md card px-6 py-8 space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.18em] font-semibold text-blue-500">
            {mode === "login" ? "Masuk" : "Daftar"}
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            {mode === "login" ? "Masuk ke akun Anda" : "Buat akun baru"}
          </h1>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-800">
                  Name
                </label>
                <input
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-800">
                  Role
                </label>
                <select
                  className="select"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="buyer">Buyer</option>
                  <option value="agent">Agent</option>
                </select>
              </div>
            </>
          )}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-800">
              Email
            </label>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-800">
              Password
            </label>
            <input
              className="input"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-wrap gap-3 pt-2 justify-center">
            <button className="btn btn-primary px-6" type="submit">
              {mode === "login" ? "Login" : "Register"}
            </button>
            <button
              className="btn btn-ghost px-6"
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
            >
              Switch to {mode === "login" ? "Register" : "Login"}
            </button>
          </div>
        </form>
        {message && (
          <p className="text-sm text-slate-700 text-center">{message}</p>
        )}
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
      </section>
    </main>
  );
}
