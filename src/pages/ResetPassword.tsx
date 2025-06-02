import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Parse token from hash
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const type = params.get("type");
    if (type !== "recovery") {
      setMessage("Invalid or expired password reset link.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated! You can now log in.");
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Set a New Password</h2>
      {message && <div className="mb-4 text-red-500">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Set Password
        </button>
      </form>
    </div>
  );
}
