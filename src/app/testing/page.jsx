


'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Moon, Sun, Menu, X, Mail, Github, Linkedin, ExternalLink, Code, Briefcase, User, MessageSquare, ArrowRight, Star, Zap, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function Portfolio() {
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const carouselRef = useRef(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce with payments & admin dashboard.',
      tech: ['Next.js', 'TypeScript', 'Postgres', 'Stripe'],
      gradient: 'from-blue-500 to-cyan-500',
      icon: '🛍️',
    },
    {
      title: 'AI Content Generator',
      description: 'Human-like marketing copy using AI.',
      tech: ['React', 'OpenAI', 'Node.js', 'MongoDB'],
      gradient: 'from-purple-500 to-pink-500',
      icon: '🤖',
    },
    {
      title: 'Task Manager',
      description: 'Real-time collaborative task app.',
      tech: ['Vue', 'Firebase', 'Tailwind'],
      gradient: 'from-orange-500 to-red-500',
      icon: '✅',
    },
    {
      title: 'Analytics Dashboard',
      description: 'KPI tracking & interactive charts.',
      tech: ['React', 'D3', 'Python'],
      gradient: 'from-green-500 to-emerald-500',
      icon: '📊',
    },
  ];

  const skills = [
    { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind'], icon: '⚛️', color: 'blue' },
    { category: 'Backend', items: ['Node', 'Python', 'Postgres', 'MongoDB'], icon: '⚙️', color: 'purple' },
    { category: 'Tools', items: ['Git', 'Docker', 'AWS', 'Vercel'], icon: '🛠️', color: 'pink' },
    { category: 'Other', items: ['GraphQL', 'Testing', 'CI/CD'], icon: '🚀', color: 'orange' },
  ];

  // Mouse position for gradient orbs & tilt
  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Particle background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    const DPR = Math.max(1, window.devicePixelRatio || 1);

    const resize = () => {
      canvas.width = window.innerWidth * DPR;
      canvas.height = window.innerHeight * DPR;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(DPR, DPR);
    };
    resize();

    const particles = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 2 + 0.6,
      vx: Math.random() * 0.6 - 0.3,
      vy: Math.random() * 0.6 - 0.3,
      o: Math.random() * 0.6 + 0.15,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x > window.innerWidth) p.x = 0;
        if (p.x < 0) p.x = window.innerWidth;
        if (p.y > window.innerHeight) p.y = 0;
        if (p.y < 0) p.y = window.innerHeight;
        ctx.beginPath();
        ctx.fillStyle = darkMode ? `rgba(99,102,241,${p.o})` : `rgba(139,92,246,${p.o})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = darkMode ? `rgba(99,102,241,${0.08 * (1 - dist / 120)})` : `rgba(139,92,246,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [darkMode]);

  // Active section tracking
  useEffect(() => {
    const sections = ['home', 'about', 'projects', 'skills', 'contact'];
    const onScroll = () => {
      const scroll = window.scrollY + 120;
      for (const s of sections) {
        const el = document.getElementById(s);
        if (!el) continue;
        const top = el.offsetTop;
        const h = el.offsetHeight;
        if (scroll >= top && scroll < top + h) {
          setActiveSection(s);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Carousel controls
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((i) => (i + 1) % projects.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [projects.length]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 2500);
  };

  // 3D tilt helper
  const handleTilt = (e, cardRef) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotY = (x - 0.5) * 18;
    const rotX = (y - 0.5) * -18;
    cardRef.current.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
  };
  const resetTilt = (cardRef) => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)';
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'} transition-colors duration-500 relative overflow-x-hidden`}> 
      {/* Canvas Background */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-40"
          style={{
            top: '8%',
            left: `${(mousePosition.x / window.innerWidth) * 60}%`,
            background: 'linear-gradient(135deg, rgba(59,130,246,0.18), rgba(139,92,246,0.12))',
            transform: 'translateZ(0)',
            transition: 'left 0.15s linear',
          }}
        />
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{
            bottom: '8%',
            right: `${(mousePosition.y / window.innerHeight) * 60}%`,
            background: 'linear-gradient(135deg, rgba(139,92,246,0.14), rgba(236,72,153,0.12))',
            transform: 'translateZ(0)',
            transition: 'right 0.15s linear',
          }}
        />
      </div>

      {/* Nav */}
      <nav className={`fixed top-4 left-0 right-0 z-50 mx-auto max-w-7xl px-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        <div className={`backdrop-blur-md ${darkMode ? 'bg-gray-900/40' : 'bg-white/60'} border rounded-full p-2 flex items-center justify-between gap-4 shadow-sm`}> 
          <div className="flex items-center gap-3 px-3">
            <div className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 flex items-center gap-2">
              <Sparkles className="w-6 h-6" /> JD
            </div>
            <div className="hidden md:flex items-center gap-2"> 
              {['home', 'about', 'projects', 'skills', 'contact'].map((s) => (
                <button
                  key={s}
                  onClick={() => scrollToSection(s)}
                  className={`px-4 py-2 rounded-full transition-all text-sm ${activeSection === s ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow' : 'hover:bg-gray-100/20'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setDarkMode((d) => !d)} className="p-2 rounded-full hover:scale-105 transition-transform">
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-purple-600" />}
            </button>

            <div className="hidden md:flex items-center gap-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-full hover:scale-105"> <Github className="w-5 h-5" /> </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-full hover:scale-105"> <Linkedin className="w-5 h-5" /> </a>
              <a href="mailto:john@example.com" className="p-2 rounded-full hover:scale-105"> <Mail className="w-5 h-5" /> </a>
            </div>

            <button onClick={() => setMobileMenuOpen((m) => !m)} className="md:hidden p-2 rounded-full">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className={`mt-3 ${darkMode ? 'bg-gray-900/85' : 'bg-white/90'} rounded-xl p-3 backdrop-blur-sm border shadow-lg`}> 
            <div className="flex flex-col gap-2">
              {['home', 'about', 'projects', 'skills', 'contact'].map((s) => (
                <button key={s} onClick={() => scrollToSection(s)} className={`py-3 rounded-lg text-left px-4 ${activeSection === s ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : ''}`}>{s}</button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <header id="home" className="min-h-screen flex items-center justify-center px-6 pt-28 relative z-10">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-block p-2 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl">
              <div className="w-40 h-40 rounded-3xl bg-white/5 flex items-center justify-center text-6xl">👨‍💻</div>
            </div>

            <h1 className="mt-8 text-5xl md:text-7xl font-extrabold leading-tight">
              <span className="block text-lg md:text-xl font-medium">Hi, I'm</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400">John Doe</span>
            </h1>

            <p className={`mt-4 max-w-3xl leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Crafting <span className="text-blue-400 font-semibold">pixel-perfect</span> interfaces and <span className="text-purple-500 font-semibold">scalable</span> backends.
            </p>

            <div className="mt-6 flex gap-4">
              <Button onClick={() => scrollToSection('projects')} className="bg-gradient-to-r from-blue-500 to-purple-500">View Projects</Button>
              <Button onClick={() => scrollToSection('contact')} className="border">Contact</Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="w-full">
            <div className="bg-gradient-to-br from-white/5 to-white/2 rounded-2xl p-6 backdrop-blur-md border shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400">Currently</div>
                  <div className="text-lg font-semibold">Open to work</div>
                </div>
                <div className="text-2xl">✨</div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/3"> 
                  <div className="text-sm text-gray-300">Years</div>
                  <div className="text-2xl font-bold">5+</div>
                </div>
                <div className="p-4 rounded-xl bg-white/3"> 
                  <div className="text-sm text-gray-300">Projects</div>
                  <div className="text-2xl font-bold">20+</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="text-sm text-gray-400">Quick links</div>
                <div className="flex gap-2 mt-3">
                  <a href="#projects" onClick={() => scrollToSection('projects')} className="px-3 py-2 rounded-full bg-white/5">Projects</a>
                  <a href="#contact" onClick={() => scrollToSection('contact')} className="px-3 py-2 rounded-full bg-white/5">Contact</a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* About */}
      <section id="about" className="py-28 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3">
              <Star className="w-6 h-6 text-yellow-400" />
              <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">About Me</h2>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <Card className={`${darkMode ? 'bg-gray-900/50 border-gray-800/50' : 'bg-white/50 border-gray-200'} p-8`}> 
              <CardContent className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-4`}> 
                <p>
                  I'm a <strong className="text-blue-400">full-stack developer</strong> building performant and accessible web applications. I focus on developer experience, product quality and shipping fast.
                </p>
                <p>
                  I love open-source, writing clear documentation, and designing delightful interfaces that scale.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Projects (carousel + 3D cards) */}
      <section id="projects" className="py-28 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">Featured Projects</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>A selection of work that highlights range & depth.</p>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setCarouselIndex((i) => (i - 1 + projects.length) % projects.length)} className="px-3 py-2 rounded-lg border">Prev</button>
              <button onClick={() => setCarouselIndex((i) => (i + 1) % projects.length)} className="px-3 py-2 rounded-lg border">Next</button>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div className="flex w-full" style={{ transform: `translateX(-${carouselIndex * 100}%)`, transition: 'transform 600ms cubic-bezier(.2,.9,.2,1)' }} ref={carouselRef}>
                {projects.map((p, idx) => (
                  <div key={idx} className="w-full md:w-1/1 px-3 py-6 flex-shrink-0">
                    <ProjectCard project={p} darkMode={darkMode} />
                  </div>
                ))}
              </div>
            </div>

            {/* Indicators */}
            <div className="mt-4 flex justify-center gap-2">
              {projects.map((_, i) => (
                <button key={i} onClick={() => setCarouselIndex(i)} className={`w-2 h-2 rounded-full ${i === carouselIndex ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-400/30'}`} aria-label={`Go to slide ${i + 1}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="py-28 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <Code className="w-6 h-6 mx-auto text-purple-500" />
            <h3 className="text-3xl font-extrabold">Skills & Tech</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Technologies and workflows I use often</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {skills.map((g, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.06 }}>
                <Card className={`${darkMode ? 'bg-gray-900/50 border-gray-800/50' : 'bg-white/50 border-gray-200'} p-6`}> 
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{g.icon}</div>
                      <CardTitle>{g.category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {g.items.map((it, i) => (
                        <li key={i} className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>• {it}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-28 px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <MessageSquare className="w-6 h-6 mx-auto text-pink-500" />
            <h3 className="text-3xl font-extrabold">Let's Connect</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Have a project? Say hello.</p>
          </div>

          {formSubmitted ? (
            <Card className="p-12 text-center">
              <div className="text-4xl mb-4">✨</div>
              <h4 className="text-2xl font-bold">Thanks — message received</h4>
              <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>I'll get back to you shortly.</p>
            </Card>
          ) : (
            <Card className="p-6">
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input value={formData.name} onChange={(e) => setFormData((s) => ({ ...s, name: e.target.value }))} className="mt-2 w-full rounded-md px-3 py-2 border" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input value={formData.email} onChange={(e) => setFormData((s) => ({ ...s, email: e.target.value }))} className="mt-2 w-full rounded-md px-3 py-2 border" placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Message</label>
                    <textarea value={formData.message} onChange={(e) => setFormData((s) => ({ ...s, message: e.target.value }))} rows={5} className="mt-2 w-full rounded-md px-3 py-2 border" placeholder="Tell me about your project..." />
                  </div>

                  <Button onClick={handleSubmit} className="w-full">Send Message</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-6 border-t ${darkMode ? 'border-gray-800/50 bg-gray-950/40' : 'border-gray-200 bg-white/60'} relative z-10`}> 
        <div className="max-w-7xl mx-auto text-center">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>© {new Date().getFullYear()} John Doe. Crafted with ❤️ using Next.js & shadcn/ui</p>
          <div className="mt-4 flex justify-center gap-4">
            {[{ icon: Github, link: 'https://github.com' }, { icon: Linkedin, link: 'https://linkedin.com' }, { icon: Mail, link: 'mailto:john@example.com' }].map((s, i) => (
              <a key={i} href={s.link} target="_blank" rel="noreferrer" className="p-2 rounded-full"> <s.icon className="w-5 h-5" /> </a>
            ))}
          </div>
        </div>
      </footer>

      {/* Back to Top */}
      <AnimatePresence>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed right-6 bottom-6 z-50 p-3 rounded-full shadow-lg"
          aria-label="Back to top"
        >
          <ArrowRight className="w-5 h-5 rotate-90" />
        </motion.button>
      </AnimatePresence>
    </div>
  );
}


// ----------------------
// ProjectCard component (internal) - interactive 3D tilt + layered depth
// ----------------------
function ProjectCard({ project, darkMode }) {
  const cardRef = useRef(null);

  return (
    <div
      ref={cardRef}
      onMouseMove={(e) => handleLocalTilt(e, cardRef)}
      onMouseLeave={() => resetLocalTilt(cardRef)}
      className={`relative rounded-2xl overflow-hidden border p-6 ${darkMode ? 'bg-gray-900/60 border-gray-800' : 'bg-white/60 border-gray-200'} shadow-xl`}
      style={{ transition: 'transform 300ms ease, box-shadow 300ms ease' }}
    >
      <div className="absolute -inset-1 bg-gradient-to-br from-white/6 to-white/2 blur-lg opacity-30 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="text-4xl p-3 rounded-lg bg-white/5">{project.icon}</div>
          <div className="text-sm text-gray-400">{project.tech.join(' • ')}</div>
        </div>

        <h4 className="mt-6 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">{project.title}</h4>
        <p className={`mt-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{project.description}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.tech.map((t, i) => (
            <span key={i} className="px-3 py-1 text-sm rounded-full bg-white/5">{t}</span>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <a className="text-sm font-medium underline" href="#">View details</a>
          <div className="flex gap-2 items-center">
            <button className="px-3 py-2 rounded-md border">Live</button>
            <button className="px-3 py-2 rounded-md border">Repo</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// local tilt helpers (separate functions to avoid closure issues)
function handleLocalTilt(e, ref) {
  if (!ref.current) return;
  const rect = ref.current.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;
  const rotY = (x - 0.5) * 14; // e.g. -7 to 7
  const rotX = (y - 0.5) * -14;
  ref.current.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`;
  ref.current.style.boxShadow = `${(rotY / 10) * -8}px ${Math.abs(rotX / 10) * 8}px 28px rgba(2,6,23,0.6)`;
}
function resetLocalTilt(ref) {
  if (!ref.current) return;
  ref.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)';
  ref.current.style.boxShadow = '';
}
