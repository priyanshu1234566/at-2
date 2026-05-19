import { useEffect, useState } from "react";
import Leaves from "../components/Leaves";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  /* Redirect */
  useEffect(() => {
    if (localStorage.getItem("admin")) {
      window.location.href = "/admin";
    }
    if (localStorage.getItem("loggedInUser")) {
      window.location.href = "/";
    }
  }, []);

  /* Handle Auth */
  const handleAuth = () => {
    const { username, password } = form;

    if (!username || !password) {
      setError("⚠ Fill all fields");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if (isLogin) {
      /* Admin */
      if (username === "admin" && password === "admin123") {
        localStorage.setItem("admin", true);
        window.location.href = "/admin";
        return;
      }

      /* User */
      if (users[username] && users[username].password === password) {
        if (!users[username].approved) {
          setError("⏳ Waiting for approval");
          return;
        }

        localStorage.setItem("loggedInUser", username);
        window.location.href = "/";
      } else {
        setError("❌ Invalid credentials");
      }
    } else {
      if (users[username]) {
        setError("⚠ User exists");
        return;
      }

      users[username] = {
        password,
        approved: false,
      };

      localStorage.setItem("users", JSON.stringify(users));
      alert("✅ Account created (wait approval)");
      setIsLogin(true);
    }
  };

  return (
    <section className="relative flex items-center justify-center h-screen overflow-hidden">

      {/* Background */}
      <img src="/img/bg.jpg" className="absolute w-full h-full object-cover" />
      <img src="/img/trees.png" className="absolute w-full h-full object-cover z-10" />
      <img src="/img/girl.png" className="absolute scale-75 animate-slide z-20" />

      <Leaves />

      {/* Login Box */}
      <div className="z-30 backdrop-blur-lg bg-white/20 border border-white/30 p-10 rounded-2xl w-[400px] shadow-xl">

        <h2 className="text-3xl text-center text-red-700 mb-6 font-bold">
          {isLogin ? "Login" : "Signup"}
        </h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-4 rounded bg-white text-black"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-white text-black"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <p className="text-red-500 text-center mb-2">{error}</p>

        <button
          onClick={handleAuth}
          className="w-full bg-red-700 text-white p-3 rounded hover:bg-red-500"
        >
          {isLogin ? "Login" : "Signup"}
        </button>

        <div className="flex justify-between mt-4 text-red-700">
          <button onClick={() => alert("Feature coming soon")}>
            Forgot Password
          </button>

          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Create Account" : "Already Login?"}
          </button>
        </div>
      </div>
    </section>
  );
}