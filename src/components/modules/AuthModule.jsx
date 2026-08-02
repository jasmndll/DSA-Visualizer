import { useState } from "react";
import { useAuthStore } from "../../store/authStore";

export default function AuthModule() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const { login, register, logout, isAuthenticated, username, loading, error } =
    useAuthStore();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "login") {
      await login({ username: form.username, password: form.password });
    } else {
      await register(form);
    }
  };

  if (isAuthenticated) {
    return (
      <div className="space-y-3">
        <p className="font-body text-sm">
          logged in as <span className="font-display font-bold">{username}</span>
        </p>
        <button
          onClick={logout}
          className="retro-btn font-display text-[11px] px-3 py-1.5 bg-pink-200
                     border-2 border-ink rounded-win shadow-winSm hover:bg-pink-300"
        >
          log out
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Tab switcher */}
      <div className="flex gap-1.5">
        <TabBtn active={mode === "login"} onClick={() => setMode("login")}>
          login
        </TabBtn>
        <TabBtn active={mode === "register"} onClick={() => setMode("register")}>
          register
        </TabBtn>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <Field
          label="username"
          name="username"
          value={form.username}
          onChange={handleChange}
        />
        {mode === "register" && (
          <Field
            label="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
        )}
        <Field
          label="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />

        {error && (
          <p className="font-body text-[11px] text-swap bg-pink-100 border border-swap rounded-win px-2 py-1">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="retro-btn font-display text-[11px] px-3 py-1.5 bg-mint-200
                     border-2 border-ink rounded-win shadow-winSm hover:bg-mint-300
                     disabled:opacity-50 w-full"
        >
          {loading ? "..." : mode === "login" ? "log in" : "create account"}
        </button>
      </form>
    </div>
  );
}

function TabBtn({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`font-display text-[11px] px-3 py-1 border-2 border-ink rounded-win
                  ${active ? "bg-lilac-200 shadow-winSm" : "bg-paper"}`}
    >
      {children}
    </button>
  );
}

function Field({ label, name, type = "text", value, onChange }) {
  return (
    <label className="block">
      <span className="font-display text-[10px] text-ink/70 block mb-1">
        {label}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full font-body text-[12px] px-2 py-1.5 border-2 border-ink
                   rounded-win bg-white"
      />
    </label>
  );
}
