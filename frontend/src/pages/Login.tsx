import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiCpu } from "react-icons/fi";
import { useAuth } from "../store/AuthContext";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export const Login: React.FC = () => {
  const { login, setRole } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const tempErrors: { email?: string; password?: string } = {};
    let isValid = true;

    // Email check
    if (!email) {
      tempErrors.email = "Email address is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Please specify a valid email address.";
      isValid = false;
    }

    // Password check
    if (!password) {
      tempErrors.password = "Password is required.";
      isValid = false;
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate API authorization response
    setTimeout(() => {
      setIsSubmitting(false);
      // Mock login as standard user
      login("Spectator user", "mock-spectator-token");
      setRole("user");
      navigate("/dashboard");
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center relative py-12 px-6">
      {/* Background radial effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-fifa-blue/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card variant="glass" className="border border-white/20 dark:border-fifa-border">
          <CardHeader className="flex flex-col items-center gap-2 pt-8 text-center">
            <div className="p-3 rounded-2xl bg-fifa-blue-gradient text-white shadow-fifa-glow">
              <FiCpu size={24} />
            </div>
            <h2 className="text-2xl font-black tracking-tight">Access operations</h2>
            <p className="text-xs text-light-muted dark:text-dark-muted">Enter credentials to authenticate simulation sessions.</p>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                />
              </div>

              <div className="flex justify-between items-center text-xs">
                <label className="flex items-center gap-1.5 font-bold cursor-pointer">
                  <input type="checkbox" className="rounded text-fifa-blue w-4 h-4" />
                  <span>Remember Session</span>
                </label>
                <a href="#forgot" className="text-fifa-blue dark:text-fifa-sky font-bold hover:underline">
                  Forgot Password?
                </a>
              </div>

              <Button variant="primary" fullWidth size="lg" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Authenticating Account..." : "Sign In"}
              </Button>

              <div className="text-center pt-2 text-xs">
                <span className="text-light-muted dark:text-dark-muted">Don't have an account? </span>
                <Link to="/register" className="text-fifa-blue dark:text-fifa-sky font-bold hover:underline">
                  Create ticket
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
