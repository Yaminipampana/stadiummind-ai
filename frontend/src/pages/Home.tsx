import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCpu,
  FiTrendingUp,
  FiHeart,
  FiActivity,
  FiArrowRight,
  FiLayers,
  FiShield,
  FiGlobe,
  FiCompass,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

import { FeatureCard } from "../components/ui/FeatureCard";

export const Home: React.FC = () => {
  // Statistics mock values
  const stats = [
    { value: "48,291", label: "Spectator Density", desc: "Live inside arena" },
    { value: "95.4%", label: "Recycling Rate", desc: "Sustainable waste" },
    { value: "5.2m", label: "Avg Queue Duration", desc: "Gates & Concessions" },
    { value: "0", label: "Active SOS Alerts", desc: "All sectors clear" },
  ];

  // Core feature subsets
  const features = [
    {
      title: "Intelligent Queue Forecasts",
      desc: "Uses machine learning to predict restroom and concession stand wait times 15 and 30 minutes in advance, suggesting less congested alternatives.",
      icon: <FiClock size={24} />,
      path: "/queue",
    },
    {
      title: "Ground-Level Accessibility Support",
      desc: "Spectators can dispatch local volunteers for physical wheelchair assistance and monitor elevator statuses in real-time.",
      icon: <FiHeart size={24} />,
      path: "/accessibility",
    },
    {
      title: "Interactive Stadium Mapping",
      desc: "Interactive spatial guidance showing accessible, step-free routes between concessions, gates, and sensory-quiet zones.",
      icon: <FiCompass size={24} />,
      path: "/map",
    },
  ];

  // Floating background particle variants
  const floatingBg = {
    animate: {
      scale: [1, 1.1, 1],
      rotate: [0, 45, 0],
      opacity: [0.1, 0.15, 0.1],
      transition: {
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="relative overflow-hidden min-h-screen text-light-text dark:text-dark-text transition-colors duration-200">
      
      {/* Animated Background Grids and Blurs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          variants={floatingBg}
          animate="animate"
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-fifa-blue/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-1/2 left-10 w-80 h-80 rounded-full bg-fifa-pitch/15 blur-3xl"
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-[0.03]" />
      </div>

      {/* 1. HERO SECTION */}
      <section id="hero" className="relative z-10 pt-16 pb-20 md:pt-24 md:pb-32 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="blue" size="md" className="mb-4">
                🏆 World Cup 2026 Operations
              </Badge>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none mb-6">
                Next-Gen Venue Command:{" "}
                <span className="bg-gradient-to-r from-fifa-blue via-fifa-sky to-fifa-pitch bg-clip-text text-transparent">
                  StadiumMind AI
                </span>
              </h1>
              <p className="text-lg md:text-xl text-light-muted dark:text-dark-muted leading-relaxed max-w-xl">
                A cohesive, real-time command cockpit optimizing spectator flows, queue durations, accessibility assists, and emergency safety networks.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link to="/ai-assistant">
                <Button variant="primary" size="lg" className="gap-2 shadow-fifa-glow">
                  Launch Assistant <FiArrowRight />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="secondary" size="lg">
                  Explore Operations
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="lg:col-span-5 relative">
            {/* Visual Glassmorphic Match Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card variant="glass" className="relative overflow-hidden border border-white/20 dark:border-fifa-border">
                <div className="absolute top-0 right-0 p-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-fifa-pitch animate-pulse inline-block mr-1" />
                  <span className="text-[10px] font-black uppercase text-fifa-pitch">Live Stream</span>
                </div>
                <CardContent className="p-8 space-y-6">
                  <div>
                    <h3 className="text-xs font-black uppercase text-fifa-blue dark:text-fifa-sky tracking-widest mb-1">Active Fixture</h3>
                    <h2 className="text-xl font-bold">USA vs England (Group B)</h2>
                    <p className="text-xs text-light-muted dark:text-dark-muted">StadiumMind Arena - Kickoff +45m</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span>Gate 2 Load Status</span>
                      <span className="text-fifa-pitch">Clear flow</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-fifa-darkNavy h-2.5 rounded-full overflow-hidden">
                      <div className="bg-fifa-pitch h-full rounded-full" style={{ width: "42%" }} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span>Gate 4 Load Status</span>
                      <span className="text-amber-500">Congested queue</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-fifa-darkNavy h-2.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: "88%" }} />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between items-center">
                    <div className="text-xs text-light-muted dark:text-dark-muted">
                      Recommended: Route spectators to <strong>Gate 2</strong>.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. WORLD CUP THEME & LIVE TICKER */}
      <section id="statistics" className="relative z-10 py-12 bg-slate-100/50 dark:bg-fifa-navy/40 border-y border-light-border dark:border-fifa-border/80">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center md:text-left space-y-1">
                <h3 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-fifa-blue to-fifa-sky bg-clip-text text-transparent">
                  {stat.value}
                </h3>
                <h4 className="text-sm font-bold tracking-tight text-light-text dark:text-dark-text">{stat.label}</h4>
                <p className="text-xs text-light-muted dark:text-dark-muted">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE SERVICE FEATURES GRID */}
      <section id="features" className="relative z-10 py-20 container mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <Badge variant="green" size="md">Operational Core</Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Optimized Fan Navigation</h2>
          <p className="text-sm text-light-muted dark:text-dark-muted">
            StadiumMind AI bridges the gap between spectator comfort and backend command efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, index) => (
            <FeatureCard
              key={index}
              title={feat.title}
              description={feat.desc}
              icon={feat.icon}
              path={feat.path}
              delay={index * 0.15}
            />
          ))}
        </div>
      </section>

      {/* 4. AI FEATURE HIGHLIGHTS */}
      <section id="ai-features" className="relative z-10 py-20 bg-slate-100/30 dark:bg-fifa-navy/20 border-t border-light-border dark:border-fifa-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Visual grounding demo */}
            <div className="order-2 lg:order-1 space-y-4">
              <Card variant="glass" className="p-6 border border-white/20 dark:border-fifa-border">
                <div className="flex gap-3 mb-4">
                  <div className="p-2 bg-fifa-blue/15 text-fifa-blue rounded-xl flex-shrink-0"><FiCpu /></div>
                  <div>
                    <h4 className="font-bold text-sm">Semantic Grounding Engine</h4>
                    <p className="text-xs text-light-muted dark:text-dark-muted">Retrieval-Augmented Generation (RAG)</p>
                  </div>
                </div>
                <div className="space-y-3 text-xs bg-slate-50/50 dark:bg-fifa-darkNavy/50 p-4 rounded-xl border border-light-border dark:border-fifa-border/60">
                  <p className="font-semibold text-light-muted dark:text-dark-muted">User prompt: <span className="text-light-text dark:text-dark-text font-normal">"Are elevators active near Gate 4?"</span></p>
                  <p className="font-bold text-fifa-blue dark:text-fifa-sky flex items-center gap-1"><FiCheckCircle /> Context Appended:</p>
                  <ul className="list-disc list-inside space-y-1 text-light-muted dark:text-dark-muted pl-1">
                    <li>Elevator West status: operational</li>
                    <li>Ramp Gate 1: active</li>
                  </ul>
                  <p className="font-bold text-fifa-pitch flex items-center gap-1"><FiCheckCircle /> Answer generated:</p>
                  <p className="text-light-text dark:text-dark-text">"Yes, Elevator West is operational. You can also utilize the access ramp near Gate 1."</p>
                </div>
              </Card>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <Badge variant="blue" size="md">RAG Grounded Intelligence</Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">AI assistant Grounded in live Telemetry</h2>
              <p className="text-light-muted dark:text-dark-muted leading-relaxed">
                StadiumMind AI hooks standard LLM logic directly to stadium APIs. Responses are grounded in live elevator health statuses, queue wait metrics, and concession locations, rather than generic templates.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex gap-2.5 items-start">
                  <FiGlobe className="text-fifa-blue mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">Multilingual Interface</h4>
                    <p className="text-xs text-light-muted dark:text-dark-muted">Answers queries in major world languages.</p>
                  </div>
                </div>
                <div className="flex gap-2.5 items-start">
                  <FiShield className="text-fifa-pitch mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">Safety Intercepts</h4>
                    <p className="text-xs text-light-muted dark:text-dark-muted">Intercepts queries for rapid evacuation guides.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION SECTION */}
      <section id="cta" className="relative z-10 py-20 container mx-auto px-6">
        <div className="bg-fifa-blue-gradient text-white rounded-3xl p-8 md:p-16 text-center space-y-8 relative overflow-hidden shadow-fifa-glow">
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
          
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none">
              Step Into the Tournament Command Centre
            </h2>
            <p className="text-white/80 text-sm md:text-base leading-relaxed">
              Launch StadiumMind AI to browse live crowd maps, request accessibility guides, or query the assistant.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap justify-center gap-4">
            <Link to="/ai-assistant">
              <Button variant="glass" size="lg" className="gap-2">
                Launch AI Assistant <FiCpu />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="pitch" size="lg" className="gap-2 shadow-pitch-glow">
                Open Dashboard <FiTrendingUp />
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
