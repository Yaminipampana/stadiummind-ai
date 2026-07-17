import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUserPlus, FiCpu } from "react-icons/fi";
import { useAuth } from "../store/AuthContext";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export const Register: React.FC = () => {
  const { login, setRole } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const tempErrors: typeof errors = {};
    let isValid = true;

    // Name check
    if (!name.trim()) {
      tempErrors.name = "Full name is required.";
      isValid = false;
    }

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

    // Confirm password check
    if (password !== confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Mock login as volunteer for simulation demo
      login(name, "mock-volunteer-token");
      setRole("volunteer");
      navigate("/dashboard");
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center relative py-12 px-6">
      {/* Background radial effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-fifa-pitch/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card variant="glass" className="border border-white/20 dark:border-fifa-border">
          <CardHeader className="flex flex-col items-center gap-2 pt-8 text-center">
            <div className="p-3 rounded-2xl bg-fifa-green-gradient text-white shadow-pitch-glow">
              <FiUserPlus size={24} />
            </div>
            <h2 className="text-2xl font-black tracking-tight">Create operator ticket</h2>
            <p className="text-xs text-light-muted dark:text-dark-muted">Sign up to volunteer or monitor tournament metrics.</p>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
              />
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
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
              />

              <Button variant="pitch" fullWidth size="lg" type="submit" className="mt-4" disabled={isSubmitting}>
                {isSubmitting ? "Registering Account..." : "Create Ticket"}
              </Button>

              <div className="text-center pt-2 text-xs">
                <span className="text-light-muted dark:text-dark-muted">Already have a ticket? </span>
                <Link to="/login" className="text-fifa-blue dark:text-fifa-sky font-bold hover:underline">
                  Sign In
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
