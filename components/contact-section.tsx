"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Mail, MapPin, Phone } from "lucide-react";
import { profile } from "@/lib/data";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
  },
  {
    icon: Phone,
    title: "Phone",
    value: profile.phone,
    href: `tel:${profile.phone.replace(/\s/g, "")}`,
  },
  {
    icon: MapPin,
    title: "Location",
    value: profile.location,
    href: null,
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="mb-12 flex flex-col items-center"
      >
        <Image
          src={profile.photo}
          alt={profile.name}
          width={96}
          height={96}
          className="mb-6 h-24 w-24 rounded-full object-cover ring-2 ring-[#22d3ee]/40"
        />
        <div className="glass rounded-3xl px-8 py-6 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Get In <span className="text-gradient">Touch</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/50">
            Have a project in mind or want to discuss a potential collaboration? Feel free to reach out!
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {contactInfo.map(({ icon: Icon, title, value, href }, i) => {
          const content = (
            <div className="glass flex h-full flex-col items-center rounded-2xl p-8 text-center transition-all hover:-translate-y-1 hover:border-[#22d3ee]/40">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#22d3ee]/20 to-[#8b5cf6]/20 text-[#7fe7f7]">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="text-sm font-semibold text-white/80">{title}</h3>
              <p className="mt-1 break-words text-sm text-white/50">{value}</p>
            </div>
          );
          return (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {href ? (
                <a href={href} className="block h-full">
                  {content}
                </a>
              ) : (
                content
              )}
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-10 text-center"
      >
        <a
          href={`mailto:${profile.email}`}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#22d3ee] to-[#8b5cf6] px-8 py-4 font-medium text-[#05060a] shadow-lg shadow-[#22d3ee]/20 transition-transform hover:scale-[1.03] active:scale-[0.98]"
        >
          <Mail className="h-5 w-5" />
          Say Hello
        </a>
      </motion.div>
    </section>
  );
}
