"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const sampleCode = `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

data = pd.read_csv("train.csv")

X = data.drop(columns=["target"])
y = data["target"]

X_train, X_val, y_train, y_val = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

predictions = model.predict(X_val)

accuracy = accuracy_score(y_val, predictions)
print(f"Validation Accuracy: {accuracy}")`;

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden px-16">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/10 blur-[100px] animate-pulse-glow"
        style={{ animationDelay: "1.5s" }}
      />

      <div className="container relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block font-display text-sm font-semibold tracking-widest text-primary uppercase mb-4 px-4 py-1.5 rounded-full border border-primary/30 bg-primary-subtle">
              Machine Learning Practice Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6"
          >
            Master ML <span className="text-gradient">Through Code</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed"
          >
            Solve real-world machine learning challenges in live Jupyter
            environments. From regression to classifiers — level up your ML
            skills.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link href={"/problemset"}>
              <Button
                size="lg"
                className="gap-2 cursor-pointer glow-primary text-base px-8"
              >
                Start Solving <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex gap-10 mt-16"
          >
            {[
              { value: "200+", label: "ML Problems" },
              { value: "50K+", label: "Submissions" },
              { value: "10K+", label: "Engineers" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-3xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating code snippet */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 w-1/3"
      >
        <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 glow-primary animate-float">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-destructive/70" />
            <div className="w-3 h-3 rounded-full bg-warning" />
            <div className="w-3 h-3 rounded-full bg-primary/70" />
            <span className="ml-2 font-mono text-xs text-muted-foreground">
              main.ipynb
            </span>
          </div>
          <pre className="font-mono text-sm leading-relaxed text-foreground/90">
            <code>{sampleCode}</code>
          </pre>
          <div className="mt-4 flex items-center gap-2 text-xs text-primary font-mono">
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
            Running on CPU Pod...
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
