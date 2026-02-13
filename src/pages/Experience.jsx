import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const experiences = [
  {
    role: "Programming Foundations",
    company: "C Language",
    duration: "2024",
    description:
      "Started programming with C, building core logic and understanding memory fundamentals.",
  },
  {
    role: "Data Structures & Algorithms",
    company: "C++",
    duration: "2025",
    description:
      "Strengthened problem-solving skills by implementing DSA concepts in C++.",
  },
  {
    role: "Full Stack Web Developer",
    company: "Self-Learning & Projects",
    duration: "2025 – Present",
    description:
      "Transitioned into full-stack development, building real-world applications using the MERN stack.",
  },
];




function ExperienceItem({
  exp,
  idx,
  start,
  end,
  scrollYProgress,
  layout,
}) {
  const progress = useTransform(scrollYProgress, [start, end], [0, 1]);

  const scale = useTransform(progress, [0, 1], [0, 1]);
  const opacity = useTransform(progress, [0, 1], [0, 1]);
  const y = useTransform(progress, [0, 1], [idx % 2 === 0 ? 30 : -30, 0]);
  const x = useTransform(progress, [0, 1], [-24, 0]);

  if (layout === "desktop") {
    return (
      <div className="relative flex flex-1 justify-center items-center min-w-0">
        {/* Glowing Dot */}
        <motion.div
          className="relative z-10 w-7 h-7 rounded-full bg-white"
          style={{ scale, opacity }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: "0 0 30px 10px rgba(255,255,255,0.7)",
              opacity,
              scale,
            }}
          />
        </motion.div>

        {/* Connector Line */}
        <motion.div
          className={`absolute ${
            idx % 2 === 0 ? "-top-8" : "-bottom-8"
          } w-[2px] bg-white/40`}
          style={{ height: 40, opacity }}
        />

        {/* Card */}
        <motion.article
          className={`absolute ${
            idx % 2 === 0 ? "bottom-14" : "top-14"
          } bg-gray-900/80 backdrop-blur border border-gray-700/70 rounded-xl p-7 w-[320px] shadow-xl`}
          style={{ opacity, y }}
        >
          <h3 className="text-xl font-semibold">{exp.role}</h3>
          <p className="text-md text-gray-400 mb-3">
            {exp.company} | {exp.duration}
          </p>
          <p className="text-md text-gray-300">{exp.description}</p>
        </motion.article>
      </div>
    );
  }

  return (
    <div className="relative flex items-start mb-14 last:mb-0">
      {/* Glowing Dot */}
      <motion.div
        className="absolute -left-3.5 top-3 z-10 w-7 h-7 rounded-full bg-white"
        style={{ scale, opacity }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: "0 0 30px 10px rgba(255,255,255,0.7)",
            opacity,
            scale,
          }}
        />
      </motion.div>

      {/* Card */}
      <motion.article
        className="bg-gray-900/80 backdrop-blur border border-gray-700/70 rounded-xl p-5 w-[90vw] max-w-sm ml-8 shadow-xl"
        style={{ opacity, x }}
      >
        <h3 className="text-lg font-semibold">{exp.role}</h3>
        <p className="text-sm text-gray-400 mb-2">
          {exp.company} | {exp.duration}
        </p>
        <p className="text-sm text-gray-300">{exp.description}</p>
      </motion.article>
    </div>
  );
}

export default function Experience() {
  const sceneRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const SCENE_HEIGHT_VH = isMobile
    ? 160 * experiences.length
    : 120 * experiences.length;

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
  });

  const thresholds = useMemo(
    () =>
      experiences.map((_, i) => (i + 1) / experiences.length),
    []
  );

  const lineSize = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "100%"]
  );

  return (
    <section  id="experience" className="relative bg-black text-white">
      <div
        ref={sceneRef}
        style={{ height: `${SCENE_HEIGHT_VH}vh`, minHeight: "120vh" }}
        className="relative"
      >
        <div className="sticky top-0 h-screen flex flex-col">
          <h2 className="text-4xl sm:text-5xl font-semibold mt-8 text-center">
            Experience
          </h2>

          <div className="flex flex-1 items-center justify-center px-6 pb-10">
            {/* Desktop */}
            {!isMobile && (
              <div className="relative w-full max-w-7xl">
                {/* Background Line */}
                <div className="relative h-1.5 bg-white/15 rounded">
                  <motion.div
                    className="absolute left-0 h-1.5 rounded origin-left bg-gradient-to-r from-white via-white to-white/40"
                    style={{ width: lineSize }}
                  />
                </div>

                <div className="relative flex justify-between mt-0">
                  {experiences.map((exp, idx) => (
                    <ExperienceItem
                      key={idx}
                      exp={exp}
                      idx={idx}
                      start={idx === 0 ? 0 : thresholds[idx - 1]}
                      end={thresholds[idx]}
                      scrollYProgress={scrollYProgress}
                      layout="desktop"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Mobile */}
            {isMobile && (
              <div className="relative w-full max-w-md">
                <div className="absolute left-0 top-0 w-1 h-full bg-white/15 rounded">
                  <motion.div
                    className="absolute left-0 top-0 w-1 rounded origin-top bg-gradient-to-b from-white via-white to-white/40"
                    style={{ height: lineSize }}
                  />
                </div>

                <div className="relative pl-2">
                  {experiences.map((exp, idx) => (
                    <ExperienceItem
                      key={idx}
                      exp={exp}
                      idx={idx}
                      start={idx === 0 ? 0 : thresholds[idx - 1]}
                      end={thresholds[idx]}
                      scrollYProgress={scrollYProgress}
                      layout="mobile"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
