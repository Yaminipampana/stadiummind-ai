// src/pages/About.tsx
import React from "react";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { FiCheckSquare } from "react-icons/fi";

const About: React.FC = () => {
  return (
    <section className="container mx-auto px-4 py-12 max-w-3xl text-light-text dark:text-dark-text">
      <Card>
        <CardHeader>
          <h1 className="text-3xl font-black tracking-tight text-brand-blue dark:text-brand-gold">
            About StadiumMind AI
          </h1>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg leading-relaxed text-light-muted dark:text-dark-muted">
            StadiumMind AI is an advanced, production-grade operations command platform designed to elevate stadium logistics and event experiences. Tailored for major sporting events like the FIFA World Cup 2026, the system orchestrates crowd control, fan navigation, queue flow rates, safety logistics, and accessibility options in a single integrated portal.
          </p>

          <div>
            <h3 className="font-bold text-lg mb-3">Key Architecture Highlights</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2.5">
                <FiCheckSquare className="text-brand-emerald mt-1 flex-shrink-0" />
                <span><strong>AI-Ready Grounding:</strong> Dynamic Retrieval Augmented Generation (RAG) providing contextual fan answers regarding transit and gate rules.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <FiCheckSquare className="text-brand-emerald mt-1 flex-shrink-0" />
                <span><strong>Role-Based Telemetry:</strong> Segregated views and operational permissions for Spectators, Event Volunteers, and Stadium Admins.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <FiCheckSquare className="text-brand-emerald mt-1 flex-shrink-0" />
                <span><strong>Clean Architecture Base:</strong> Decoupled React + Vite + TypeScript frontend linked to a highly performant modular FastAPI backend.</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default About;

