import { Passage, Category, Difficulty } from '../types/typing';

export const PASSAGES: Passage[] = [
  // --- GENERAL - EASY ---
  {
    id: 'gen-easy-1',
    category: 'general',
    difficulty: 'easy',
    title: 'Morning Routines',
    text: 'Every morning brings a new chance to begin again. The sun rises over the quiet hills, filling the world with golden light. Birds sing from high branches while fresh morning air clears the mind. Taking a few deep breaths before starting the day helps us stay calm and focused on what truly matters.'
  },
  {
    id: 'gen-easy-2',
    category: 'general',
    difficulty: 'easy',
    title: 'The Forest Trail',
    text: 'Walking down a quiet forest path helps you relax after a busy week. Tall green trees reach toward the blue sky, and small leaves dance gently in the light wind. A gentle stream flows over smooth gray stones. It is peaceful to step away from busy streets and enjoy the simple beauty of nature.'
  },
  {
    id: 'gen-easy-3',
    category: 'general',
    difficulty: 'easy',
    title: 'The Art of Reading',
    text: 'Books have a special way of opening doors to worlds we have never seen. Reading just a few pages each evening helps calm your thoughts and spark your imagination. Whether learning a practical skill or enjoying a classic story, words carry great power to inspire and teach us every single day.'
  },

  // --- GENERAL - MEDIUM ---
  {
    id: 'gen-med-1',
    category: 'general',
    difficulty: 'medium',
    title: 'Urban Architecture',
    text: 'Modern architecture balances utilitarian efficiency with aesthetic elegance. Glass skyscrapers reflect shifting cloudscapes, while pedestrian plazas encourage social interaction and spontaneous community gatherings. Designers must consider structural sustainability alongside visual harmony, ensuring that metropolitan spaces remain hospitable for future generations amidst rapid urban growth.'
  },
  {
    id: 'gen-med-2',
    category: 'general',
    difficulty: 'medium',
    title: 'The Evolution of Music',
    text: 'Throughout history, musical traditions have crossed geographical borders to create entirely new genres. From classical orchestral arrangements to contemporary electronic soundscapes, composers experiment with harmonic intervals, rhythmic cadence, and emotive resonance. Music communicates universal human feelings that transcend linguistic barriers and cultural divides.'
  },

  // --- GENERAL - HARD ---
  {
    id: 'gen-hard-1',
    category: 'general',
    difficulty: 'hard',
    title: 'Philosophical Discourse',
    text: 'Epistemological inquiries regarding perception, truth, and subjective experience frequently challenge orthodox presuppositions. Consider the dichotomy between empirical verification and rationalist deduction: how can one ascertain that sensory phenomena reliably correspond to objective reality? Such profound dilemmas confound cognitive theorists, neuroscientists, and dialectical philosophers alike.'
  },

  // --- TECHNOLOGY - EASY ---
  {
    id: 'tech-easy-1',
    category: 'technology',
    difficulty: 'easy',
    title: 'The Digital World',
    text: 'Computers and smartphones have changed how we live, work, and stay in touch. We can send messages across the planet in a fraction of a second. Learning how to type quickly and accurately makes working on any digital device much easier and saves hours of time every week.'
  },
  {
    id: 'tech-easy-2',
    category: 'technology',
    difficulty: 'easy',
    title: 'Cloud Storage',
    text: 'Saving your important files in the cloud means you can access them from almost anywhere. You do not need to carry a flash drive or worry about losing a single hard drive. Fast internet connections make backing up family photos and school projects simple, safe, and dependable.'
  },

  // --- TECHNOLOGY - MEDIUM ---
  {
    id: 'tech-med-1',
    category: 'technology',
    difficulty: 'medium',
    title: 'Distributed Systems',
    text: 'Modern cloud infrastructure relies on distributed networks of microservices communicating via lightweight protocols. Horizontal scalability allows web applications to process millions of concurrent requests while maintaining low latency. Fault tolerance mechanisms automatically route traffic around degraded hardware nodes without disrupting end-user operations.'
  },
  {
    id: 'tech-med-2',
    category: 'technology',
    difficulty: 'medium',
    title: 'Cybersecurity Fundamentals',
    text: 'Robust digital security demands multi-layered defense strategies. End-to-end encryption guarantees that data remains confidential while traversing public networks. Implementing strict identity verification, proactive penetration testing, and zero-trust policies safeguards enterprise assets against sophisticated threat vectors and automated exploit attempts.'
  },

  // --- TECHNOLOGY - HARD ---
  {
    id: 'tech-hard-1',
    category: 'technology',
    difficulty: 'hard',
    title: 'Quantum Computing Frontiers',
    text: 'Superconducting transmon qubits utilize quantum superposition and entanglement to execute non-polynomial complexity algorithms far surpassing classical von Neumann architectures. Maintaining coherent states necessitates cryogenically refrigerated dilution systems operating near absolute zero (0.015 Kelvin), where thermal noise cannot decohere delicate quantum wavefunctions.'
  },

  // --- SCIENCE - EASY ---
  {
    id: 'sci-easy-1',
    category: 'science',
    difficulty: 'easy',
    title: 'The Solar System',
    text: 'Our solar system consists of the sun and eight planets traveling in elliptical orbits. Earth is the third rock from the sun, blessed with liquid water and breathable air. Looking up into the clear night sky reminds us of the endless wonders waiting to be discovered in outer space.'
  },
  {
    id: 'sci-easy-2',
    category: 'science',
    difficulty: 'easy',
    title: 'Plant Photosynthesis',
    text: 'Green plants use sunlight to produce their own food in a process called photosynthesis. Leaves absorb carbon dioxide from the air and water from the moist soil, releasing fresh oxygen back into the atmosphere. This magnificent cycle sustains almost all living creatures on our home planet.'
  },

  // --- SCIENCE - MEDIUM ---
  {
    id: 'sci-med-1',
    category: 'science',
    difficulty: 'medium',
    title: 'Genetic Expression',
    text: 'Deoxyribonucleic acid serves as the biological blueprint for cellular life. Ribosomes translate messenger RNA sequences into intricate polypeptide chains that fold into functional three-dimensional enzymes. Epigenetic modifications regulate transcription rates dynamically without altering the underlying nucleotide sequence of the genome.'
  },
  {
    id: 'sci-med-2',
    category: 'science',
    difficulty: 'medium',
    title: 'Plate Tectonics',
    text: 'The rigid lithosphere of the Earth is fragmented into tectonic plates drifting across the viscous asthenosphere. Convection currents within the mantle drive continental drift, giving rise to volcanic archipelagos, seismic fault ruptures, and soaring mountain ranges over geological epochs spanning millions of continuous years.'
  },

  // --- SCIENCE - HARD ---
  {
    id: 'sci-hard-1',
    category: 'science',
    difficulty: 'hard',
    title: 'Astrophysical Gravitational Waves',
    text: 'Laser interferometer observatories detect minute perturbations in spacetime metric tensors caused by binary black hole coalescences. As compact astrophysical masses accelerate, quadrupolar gravitational radiation propagates outward at the invariant speed of light, producing differential strain amplitudes measuring less than 10^-21 across multi-kilometer baseline arms.'
  },

  // --- PROGRAMMING - EASY ---
  {
    id: 'prog-easy-1',
    category: 'programming',
    difficulty: 'easy',
    title: 'Hello World',
    text: 'Writing code is like solving a series of fun puzzles. You give the computer clear instructions step by step. If a line has a typo, the computer will stop and tell you where the problem is. With practice and patience, anyone can learn to build software and create something amazing.'
  },
  {
    id: 'prog-easy-2',
    category: 'programming',
    difficulty: 'easy',
    title: 'Variables and Loops',
    text: 'Variables store information like numbers, names, and lists. Loops allow a program to repeat an action hundreds of times without writing duplicate code. Combining conditions like if and else lets the application make smart decisions based on what the user types or clicks.'
  },

  // --- PROGRAMMING - MEDIUM ---
  {
    id: 'prog-med-1',
    category: 'programming',
    difficulty: 'medium',
    title: 'Asynchronous JavaScript',
    text: 'Promises and async-await constructs simplify asynchronous event-driven code in modern web development. When making network fetch requests, the single-threaded event loop continues executing without freezing the user interface. Handling promise rejections with try-catch blocks prevents unhandled exceptions from crashing client-side applications.'
  },
  {
    id: 'prog-med-2',
    category: 'programming',
    difficulty: 'medium',
    title: 'Object-Oriented Design',
    text: 'Encapsulation, inheritance, and polymorphism represent the foundational pillars of object-oriented programming. Clean interfaces hide internal complexity, decoupling consumers from implementation nuances. Applying SOLID design principles fosters maintainable, testable codebases capable of evolving as product requirements inevitably expand.'
  },

  // --- PROGRAMMING - HARD ---
  {
    id: 'prog-hard-1',
    category: 'programming',
    difficulty: 'hard',
    title: 'Rust Memory Safety',
    text: 'Rust enforces compile-time memory safety without a runtime garbage collector through its rigorous borrow checker. Lifetimes denote how long references remain valid: &mut T represents exclusive mutable access, whereas &T permits concurrent immutable reads. Zero-cost abstractions guarantee that safety invariants impose no execution overhead.'
  },
  {
    id: 'prog-hard-2',
    category: 'programming',
    difficulty: 'hard',
    title: 'Compiler Optimization & ASTs',
    text: 'Lexical analysis tokenizes source input into an Abstract Syntax Tree (AST), enabling semantic analysis and static type checking. During intermediary code generation, compilers perform dead-code elimination, loop invariant code motion, tail-call optimization, and register allocation via graph coloring algorithms before outputting machine assembly.'
  },

  // --- RANDOM - MEDIUM ---
  {
    id: 'rand-med-1',
    category: 'random',
    difficulty: 'medium',
    title: 'Deep Sea Exploration',
    text: 'Bioluminescent organisms illuminate the pitch-black abyssal trenches of the deep ocean. Under crushing hydrostatic pressures, specialized hydrothermal vent ecosystems thrive without photosynthetic sunlight, utilizing chemosynthesis driven by mineral-rich geothermal vents spewing hydrogen sulfide into freezing water.'
  },
  {
    id: 'rand-hard-1',
    category: 'random',
    difficulty: 'hard',
    title: 'Cryptographic Hashing & Primes',
    text: 'Cryptographic hash primitives such as SHA-256 yield deterministic 256-bit digests characterized by the avalanche effect: modifying even a solitary input bit completely scrambles the output digest. Asymmetric public-key cryptosystems depend upon the intractable computational difficulty of factoring monumental semi-prime integers.'
  }
];

export function getRandomPassage(category: Category, difficulty: Difficulty): Passage {
  let filtered = PASSAGES.filter(p => {
    const matchCategory = category === 'random' || p.category === category;
    const matchDifficulty = p.difficulty === difficulty;
    return matchCategory && matchDifficulty;
  });

  if (filtered.length === 0) {
    filtered = PASSAGES.filter(p => p.difficulty === difficulty);
  }
  if (filtered.length === 0) {
    filtered = PASSAGES;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

export function getPassageForDuration(category: Category, difficulty: Difficulty, duration: number): Passage {
  const primary = getRandomPassage(category, difficulty);
  if (duration <= 15) {
    return primary;
  }

  // Combine 2 or 3 passages for 30s and 60s tests to guarantee typists never run out of text
  const count = duration >= 60 ? 3 : 2;
  const parts = [primary.text];

  for (let i = 1; i < count; i++) {
    const nextP = getRandomPassage(category, difficulty);
    if (!parts.includes(nextP.text)) {
      parts.push(nextP.text);
    }
  }

  return {
    ...primary,
    text: parts.join(' '),
  };
}

