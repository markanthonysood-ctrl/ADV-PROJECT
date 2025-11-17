import React, { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState("login"); 
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        setName("");
        setEmail("");
        setPassword("");
        setConfirm("");
        setError("");
    };

    const saveUser = (user) => {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        users.push(user);
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("authUser", JSON.stringify(user));
    };

    const handleSignup = (e) => {
        e.preventDefault();
        setError("");
        if (!email || !password || !name) return setError("Please complete all fields.");
        if (password.length < 6) return setError("Password must be at least 6 characters.");
        if (password !== confirm) return setError("Passwords do not match.");
        setLoading(true);
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        if (users.find((u) => u.email === email)) {
            setLoading(false);
            return setError("An account with that email already exists.");
        }
        const user = { name, email, password };
        saveUser(user);
        setLoading(false);
        router.push("/dashboard");
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");
        if (!email || !password) return setError("Enter email and password.");
        setLoading(true);
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const found = users.find((u) => u.email === email && u.password === password);
        setLoading(false);
        if (!found) return setError("Invalid email or password.");
        localStorage.setItem("authUser", JSON.stringify(found));
        router.push("/dashboard");
    };

    const containerStyle = {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4f6fb",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: 20,
    };

    const cardStyle = {
        width: 360,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 6px 18px rgba(20,20,40,0.08)",
        padding: 24,
    };

    const inputStyle = {
        width: "100%",
        padding: "10px 12px",
        marginBottom: 12,
        borderRadius: 6,
        border: "1px solid #a29e9eff",
        outline: "none",
        fontSize: 14,
        color: "#000000",
    };

    const buttonStyle = {
        width: "100%",
        padding: "10px 12px",
        borderRadius: 6,
        border: "none",
        background: "#3b82f6",
        color: "#fff",
        fontWeight: 600,
        cursor: "pointer",
        fontSize: 15,
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={{ margin: "0 0 8px 0", fontSize: 20, color:"black"}}>
                    {mode === "login" ? "Welcome back" : "Create an account"}
                </h2>
                <p style={{ margin: "0 0 16px 0", color: "#050505ff", fontSize: 13 }}>
                    {mode === "login"
                        ? "Sign in to access your dashboard."
                        : "Sign up to create a new account and be redirected to the dashboard."}
                </p>

                <form onSubmit={mode === "login" ? handleLogin : handleSignup}>
                    {mode === "signup" && (
                        <input
                            style={inputStyle}
                            placeholder="Full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            aria-label="Full name"
                        />
                    )}

                    <input
                        style={inputStyle}
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-label="Email"
                    />

                    <input
                        style={inputStyle}
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        aria-label="Password"
                    />

                    {mode === "signup" && (
                        <input
                            style={inputStyle}
                            placeholder="Confirm password"
                            type="password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            aria-label="Confirm password"
                        />
                    )}

                    {error && (
                        <div style={{ color: "#b00020", marginBottom: 12, fontSize: 13 }}>{error}</div>
                    )}

                    <button style={buttonStyle} type="submit" disabled={loading}>
                        {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
                    </button>
                </form>

                <div style={{ marginTop: 14, textAlign: "center", fontSize: 13, color: "#65748b" }}>
                    {mode === "login" ? (
                        <>
                            Don&apos;t have an account?{" "}
                            <button
                                onClick={() => {
                                    resetForm();
                                    setMode("signup");
                                }}
                                style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer" }}
                            >
                                Sign up
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <button
                                onClick={() => {
                                    resetForm();
                                    setMode("login");
                                }}
                                style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer" }}
                            >
                                Sign in
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}