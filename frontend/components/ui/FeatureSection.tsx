"use client";
import { motion } from "framer-motion";
import {
  Terminal,
  Cpu,
  Zap,
  BarChart3,
  ArrowRight,
  Server,
  Shield,
  GitBranch,
  Layers,
} from "lucide-react";
import { Button } from "./button";
import Link from "next/link";

const features = [
  {
    icon: Terminal,
    title: "Live Jupyter Pods",
    description:
      "Every problem spins up an isolated Jupyter notebook on a dedicated pod. Write, test, and iterate in real-time.",
  },
  {
    icon: Cpu,
    title: "GPU-Accelerated",
    description:
      "Train models on real hardware. No local setup needed — we handle the infrastructure so you focus on learning.",
  },
  {
    icon: BarChart3,
    title: "Auto-Graded",
    description:
      "Your model's accuracy, loss, and metrics are automatically evaluated against our test datasets.",
  },
  {
    icon: Zap,
    title: "Real Datasets",
    description:
      "Work with production-quality data. From MNIST to custom NLP corpora — no toy examples.",
  },
];

const architectureFeatures = [
  {
    icon: Server,
    title: "API Gateway",
    description:
      "Unified entry point routing requests to the right microservice. Handles auth, rate limiting, and Jupyter and other services proxy.",
  },
  {
    icon: Layers,
    title: "Problem Service",
    description:
      "Manages the problem catalog — descriptions, starter code, test cases, difficulty tiers, and topic tags.",
  },
  {
    icon: GitBranch,
    title: "Container Service",
    description:
      "Orchestrates Kubernetes pods per session. Spins up isolated Jupyter environments with GPU access on demand.",
  },
  {
    icon: Shield,
    title: "Submission Service",
    description:
      "Submissions are published to an Kafka event stream and processed by worker pipelines that evaluate your model and generate performance metrics.",
  },
];

const FeaturesSection = () => {
  return (
    <>
      {/* Feature Section */}
      <section className="py-10 bg-muted/30 relative">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="font-display text-sm font-semibold tracking-widest text-accent uppercase">
              Why MLCode
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold mt-3">
              Built for <span className="text-gradient">Real Learning</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-7 hover:border-primary/30 transition-colors"
              >
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-20 bg-muted/30 relative">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="font-display text-sm font-semibold tracking-widest text-accent uppercase">
              Under the Hood
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold mt-3">
              Microservice <span className="text-gradient">Architecture</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
              Built for reliability and scale. Every service is independently
              deployable.
            </p>
          </motion.div>
          {/* Architecture flow */}
          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {architectureFeatures.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="hover:scale-105 cursor-pointer rounded-xl border border-border bg-card p-6 text-center relative"
                >
                  <div className="w-11 h-11 rounded-lg bg-accent/10 flex items-center justify-center mb-4 mx-auto">
                    <feature.icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-display text-sm font-bold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              Ready to <span className="text-gradient">Build</span>?
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Stop reading tutorials. Start writing models.
            </p>
            <Link href={"/problemset"}>
              <Button
                size="lg"
                className="gap-2 cursor-pointer glow-primary text-base px-10"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default FeaturesSection;
