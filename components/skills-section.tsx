"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { skillCategories } from "@/lib/data";

export function SkillsSection() {
  const [active, setActive] = useState(skillCategories[0].id);
  const category = skillCategories.find((c) => c.id === active)!;

  return (
    <section id="skills" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="mb-12 flex justify-center"
      >
        <div className="glass rounded-3xl px-8 py-6 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            My <span className="text-gradient">Skills</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/50">
            Technologies I work with across the full stack and the GenAI spectrum.
          </p>
        </div>
      </motion.div>

      {/* Category pills */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        {skillCategories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
              active === c.id
                ? "bg-gradient-to-r from-[#22d3ee] to-[#8b5cf6] text-[#05060a] shadow-lg shadow-[#22d3ee]/20"
                : "border border-white/10 bg-white/5 text-white/60 hover:border-white/25 hover:text-white"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <motion.div
        key={category.id}
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
      >
        {category.skills.map((skill) => (
          <motion.div
            key={skill.name}
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
            }}
            className="group glass flex flex-col items-center rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-[#22d3ee]/40"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={skill.icon}
              alt={skill.name}
              loading="lazy"
              className="mb-3 h-12 w-12 object-contain transition-transform group-hover:scale-110"
            />
            <span className="text-center text-sm font-medium text-white/70 group-hover:text-white">
              {skill.name}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
