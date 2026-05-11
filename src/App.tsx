/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Layout, 
  MapPin, 
  MessageSquare, 
  Smartphone, 
  ShieldAlert, 
  Zap,
  Target,
  Users,
  BookOpen,
  ArrowRight,
  ShoppingCart,
  LogIn,
  CreditCard,
  PackageCheck,
  Search,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { useState } from "react";

// --- Data Types ---

interface UsabilityIssue {
  id: number;
  issue: string;
  step: string;
  heuristic: string;
  severity: "Critical" | "Medium" | "Low";
  improvement: string[];
  image: string;
}

interface UXLawMap {
  issue: string;
  law: string;
  reason: string;
}

// --- Content Data ---

const USABILITY_ISSUES: UsabilityIssue[] = [
  {
    id: 1,
    issue: "All payment options (UPI, Cards, Netbanking, Wallets, EMI, COD) are presented at once in a single long list, making the page overwhelming.",
    step: "Step 5 — Payment Method",
    heuristic: "Aesthetic & Minimalist Design",
    severity: "Critical",
    improvement: [
      "Group methods by category (Pay Now / Pay Later / COD) with collapsible sections",
      "Surface user's last-used method at the top",
      "Show only top 3 methods by default; reveal others under 'More options'"
    ],
    image: "/images/regenerated_image_1778356352179.png"
  },
  {
    id: 2,
    issue: "OTP auto-read fails on many devices, but the screen does not communicate why or what to do next.",
    step: "Step 2 — Login / OTP",
    heuristic: "Visibility of System Status; Help & Documentation",
    severity: "Critical",
    improvement: [
      "Show a status line: 'Waiting for SMS… (auto-read enabled)'",
      "After 10 seconds, switch to: 'Didn't get the OTP? Resend in 0:25'",
      "Provide a clearly visible 'Resend OTP' link as a fallback"
    ],
    image: "/images/regenerated_image_1778356875924.png"
  },
  {
    id: 3,
    issue: "Address cards look almost identical; the user must read each block carefully to find the right address, with no visual cue for the default.",
    step: "Step 3 — Delivery Address",
    heuristic: "Recognition vs Recall; Aesthetic & Minimalist Design",
    severity: "Critical",
    improvement: [
      "Add tag chips: 'Home', 'Work', 'Default'",
      "Pre-select the most recently used address",
      "Use a stronger visual treatment (border, accent color) for the selected card"
    ],
    image: "/images/regenerated_image_1778356877271.png"
  },
  {
    id: 4,
    issue: "When a coupon code fails, the error message is generic ('Coupon not applicable') without telling the user why or how to fix it.",
    step: "Step 1 — Cart",
    heuristic: "Error Recovery (Help users recognize, diagnose, and recover from errors)",
    severity: "Medium",
    improvement: [
      "Tell the user the specific reason: 'Minimum order ₹499 required'",
      "Suggest the next action: 'Add ₹120 more to apply this coupon'",
      "Show eligible coupons inline so the user can pick one that works"
    ],
    image: "/images/regenerated_image_1778356886992.png"
  },
  {
    id: 5,
    issue: "The 'Place Order' button changes label and position across screens (Cart: 'Place Order' / Address: 'Deliver Here' / Summary: 'Continue' / Payment: 'Pay Now'), breaking the user's mental model of a single primary action.",
    step: "Across all steps",
    heuristic: "Consistency & Standards",
    severity: "Medium",
    improvement: [
      "Standardize the primary CTA label to a clear progression: 'Continue', 'Continue to Payment', 'Pay ₹X'",
      "Keep the CTA in the same screen position across all steps (sticky bottom)",
      "Use the same color and size for all primary CTAs"
    ],
    image: "/images/regenerated_image_1778356883010.png"
  },
  {
    id: 6,
    issue: "The user cannot easily edit the cart from the payment screen — they must use the back button and risk losing the selected payment method.",
    step: "Step 5 — Payment Method",
    heuristic: "User Control & Freedom",
    severity: "Medium",
    improvement: [
      "Show a collapsed 'Order summary' card at the top of the payment screen with an 'Edit' link",
      "Persist the user's payment selection if they go back and return",
      "Provide visible breadcrumbs: Cart → Address → Summary → Payment"
    ],
    image: "/images/regenerated_image_1778356880947.png"
  },
  {
    id: 7,
    issue: "There is no progress indicator showing the user where they are in the checkout. Users do not know how many steps remain before they can pay.",
    step: "Across all steps",
    heuristic: "Visibility of System Status",
    severity: "Medium",
    improvement: [
      "Add a 4-step stepper: Address · Summary · Payment · Confirmation",
      "Highlight the active step and dim completed/upcoming steps",
      "On mobile, show 'Step 2 of 4' as a compact label"
    ],
    image: "/images/regenerated_image_1778356878885.png"
  }
];

const UX_LAWS_MAPPING: UXLawMap[] = [
  {
    issue: "Long, unstructured payment list with 6+ top-level options.",
    law: "Hick's Law",
    reason: "Decision time grows logarithmically with the number of choices. Presenting all methods at once inflates cognitive cost. Grouping reduces choices to 2-3, cutting latency."
  },
  {
    issue: "In-card 'Deliver Here' button is small and hard to hit precisely.",
    law: "Fitts's Law",
    reason: "Time-to-target is a function of distance and target size. Small buttons increase miss rates on mobile. Solution: make entire address card tappable and pin a sticky footer CTA."
  },
  {
    issue: "Lack of a visible step / progress indicator.",
    law: "Jakob's Law",
    reason: "Users expect Flipkart to behave like e-commerce sites they already know (Amazon, Myntra). Absence of a familiar progress pattern violates expectations and raises uncertainty."
  }
];

// --- Sub-components ---

const SeverityBadge = ({ severity }: { severity: string }) => {
  const colors = {
    Critical: "bg-red-100 text-red-700 border-red-200",
    Medium: "bg-amber-100 text-amber-700 border-amber-200",
    Low: "bg-blue-100 text-blue-700 border-blue-200"
  };
  return (
    <span className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border shadow-sm ${colors[severity as keyof typeof colors]}`}>
      {severity}
    </span>
  );
};

const Modal = ({ isOpen, image, onClose }: { isOpen: boolean; image: string | null; onClose: () => void }) => {
  if (!isOpen || !image) return null;
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="max-w-5xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        <img src={image} alt="Enlarged screenshot" className="w-full h-auto" />
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black transition-colors"
        >
          <ChevronDown className="rotate-180" />
        </button>
      </motion.div>
    </motion.div>
  );
};

// --- Main Components ---

export default function App() {
  const [activeTab, setActiveTab] = useState("issues");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 selection:bg-flipkart-blue selection:text-white text-lg">
      <Modal isOpen={!!selectedImage} image={selectedImage} onClose={() => setSelectedImage(null)} />

      {/* 1. Hero Section (Inspiration from Ref Image) */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden flipkart-gradient py-24 px-6">
        <div className="absolute inset-0 bg-pattern opacity-10 pointer-events-none" />
        
        {/* Animated Background Blobs */}
        <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] bg-flipkart-blue/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[30rem] h-[30rem] bg-flipkart-orange/30 rounded-full blur-[120px] animation-delay-2000 animate-pulse" />

        {/* Floating Icons Decor */}
        <div className="absolute top-20 left-10 opacity-10 rotate-12 scale-150"><Search size={80} /></div>
        <div className="absolute top-40 right-20 opacity-10 -rotate-12 scale-125"><Smartphone size={60} /></div>
        <div className="absolute bottom-20 left-20 opacity-10 rotate-45"><PackageCheck size={100} /></div>
        <div className="absolute bottom-40 right-10 opacity-10 -rotate-6"><Layout size={120} /></div>

        {/* Decorative Light Strings (mimicking reference image) */}
        <div className="absolute top-0 left-0 w-full h-40 overflow-hidden opacity-30 pointer-events-none">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <path d="M0 20 Q 25 40 50 20 T 100 20 T 150 20 T 200 20 T 250 20 T 300 20 T 350 20 T 400 20" fill="none" stroke="black" strokeWidth="0.5" transform="scale(5, 1)" />
            {[...Array(20)].map((_, i) => (
              <circle key={i} cx={i * 100 + 50} cy={20 + (i % 2 === 0 ? 10 : -10)} r="2" fill={i % 3 === 0 ? "#2874f0" : i % 3 === 1 ? "#fb641b" : "#fff"} />
            ))}
          </svg>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 max-w-6xl w-full text-center"
        >
          {/* Logo Mimic */}
          <div className="flex items-center justify-center mb-12 gap-3 transform hover:scale-105 transition-transform cursor-pointer">
            <div className="bg-white p-3 rounded-2xl shadow-xl flex items-center">
              <span className="text-flipkart-blue font-black italic text-5xl leading-none tracking-tighter">Flipkart</span>
              <span className="text-flipkart-yellow bg-flipkart-blue ml-2 px-2 py-0.5 rounded-lg italic font-black text-3xl tracking-tighter">plus</span>
            </div>
          </div>

          <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black mb-12 leading-[0.8] tracking-tighter uppercase">
            <span className="relative inline-block">
              Improve
              <div className="absolute bottom-4 left-0 w-full h-6 bg-flipkart-blue/10 -z-10 rounded-full" />
            </span> <br />
            <span className="text-flipkart-blue italic underline decoration-transparent hover:decoration-white/30 transition-all cursor-default">Hierarchy,</span> <br />
            <span className="relative">
              and Usability
              <motion.div 
                animate={{ width: ["0%", "100%", "95%"] }}
                transition={{ duration: 2, delay: 0.5 }}
                className="absolute -bottom-2 left-0 h-4 bg-white/40 rounded-full" 
              />
            </span>
          </h1>
          
          <p className="text-2xl md:text-4xl font-medium mb-16 px-10 leading-snug tracking-tight text-gray-800/80 italic max-w-5xl mx-auto">
            UX Audit & Solution Framework: <br /> 
            <span className="font-black text-flipkart-blue bg-white px-4 py-1 rounded-2xl shadow-sm inline-block mt-4 border-b-8 border-flipkart-blue/20">Optimizing Checkout Loops</span>
          </p>

          <div className="flex flex-col lg:flex-row items-stretch justify-center gap-10 mt-12 px-6">
            {/* Person Info Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="glass p-12 rounded-[3.5rem] shadow-2xl flex flex-col items-center flex-1 border-white/40"
            >
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-[3rem] overflow-hidden border-8 border-flipkart-blue/20 p-2 bg-white/50 mb-10 group transition-all hover:rounded-full hover:scale-105 shadow-2xl">
                <img 
                  src="/images/regenerated_image_1778356062879.png" 
                  alt="Gaurav" 
                  className="w-full h-full object-cover rounded-[2.5rem] group-hover:rounded-full group-hover:grayscale-0 grayscale transition-all duration-700"
                />
              </div>
              <div className="text-center">
                <p className="text-sm uppercase tracking-[0.6em] font-black opacity-40 mb-4">Strategic Lead</p>
                <h3 className="text-6xl font-black text-flipkart-blue mb-4 tracking-tighter italic">Gaurav</h3>
                <p className="text-xl font-bold opacity-70 underline decoration-flipkart-orange decoration-4 underline-offset-8">Flipkart - PM Assignment</p>
              </div>

              {/* Contact Me CTA */}
              <motion.a 
                href="tel:+917852010838"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-12 flex items-center gap-4 bg-flipkart-dark text-white px-10 py-5 rounded-full font-black text-xl shadow-2xl hover:bg-black transition-all"
              >
                <Smartphone className="text-flipkart-yellow" />
                Contact Me: +91 7852010838
              </motion.a>
            </motion.div>

            {/* Stats Summary Card */}
            <div className="grid grid-cols-2 gap-6 flex-1">
              {[
                { label: "Issues Identified", val: "07", icon: <AlertCircle />, color: "text-flipkart-blue" },
                { label: "Critical Path", val: "03", icon: <ShieldAlert />, color: "text-red-600" },
                { label: "Conversion Lift", val: "~3%", icon: <Zap />, color: "text-flipkart-orange" },
                { label: "Heuristics Used", val: "10", icon: <Target />, color: "text-flipkart-blue" },
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5, rotate: i % 2 === 0 ? 1 : -1 }}
                  className="bg-white/60 backdrop-blur-md p-10 rounded-[3rem] border border-white/40 shadow-xl flex flex-col justify-center items-center text-center group"
                >
                  <div className={`${stat.color} mb-6 scale-[1.8] group-hover:scale-[2] transition-transform`}>{stat.icon}</div>
                  <p className={`text-6xl font-black tracking-tighter mb-2 ${stat.color}`}>{stat.val}</p>
                  <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-40"
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* 2. Executive Summary */}
      <section className="py-32 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-flipkart-blue flex items-center justify-center text-white shadow-lg">
                <Zap size={28} />
              </div>
              <h2 className="text-5xl font-black uppercase tracking-tighter">Executive Summary</h2>
            </div>
            <p className="text-2xl text-gray-600 leading-relaxed mb-10 font-medium">
              This report presents a usability evaluation of Flipkart's checkout flow, one of the most business-critical journeys. Even small frictions translate directly into cart abandonment and revenue loss.
            </p>
            <div className="space-y-6">
              <div className="flex gap-6 p-8 bg-white rounded-3xl shadow-xl border border-red-100 transform hover:-translate-y-1 transition-transform">
                <div className="mt-1 text-red-500 scale-150 shrink-0"><ShieldAlert /></div>
                <div>
                  <p className="text-2xl font-black text-red-700">3 Critical Issues</p>
                  <p className="text-lg text-gray-500 font-medium mt-1">Directly affect checkout completion (address, payment, OTP).</p>
                </div>
              </div>
              <div className="flex gap-6 p-8 bg-white rounded-3xl shadow-xl border border-amber-100 transform hover:-translate-y-1 transition-transform">
                <div className="mt-1 text-amber-500 scale-150 shrink-0"><AlertCircle /></div>
                <div>
                  <p className="text-2xl font-black text-amber-700">4 Medium Issues</p>
                  <p className="text-lg text-gray-500 font-medium mt-1">Increase cognitive load and hurt brand trust.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            {[
              { label: "Jakob Nielsen", val: "10 Heuristics", icon: <Users size={32} /> },
              { label: "UX Research", val: "03 UX Laws", icon: <Target size={32} /> },
              { label: "Flow Analysis", val: "7 Steps", icon: <Smartphone size={32} /> },
              { label: "Impact", val: "1.5-3% Lift", icon: <Zap size={32} /> },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl transition-all hover:shadow-2xl hover:border-flipkart-blue/40 flex flex-col justify-center items-center text-center">
                <div className="text-flipkart-blue mb-6 scale-110">{stat.icon}</div>
                <p className="text-3xl font-black tracking-tighter mb-2">{stat.val}</p>
                <p className="text-sm uppercase tracking-widest font-black opacity-40">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. The Flow (7 Steps Visualization) */}
      <section className="bg-white py-32 px-6 border-y border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-5xl font-black uppercase tracking-tighter mb-6">The Checkout Path</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-20 font-medium">Evaluation across mobile and web surfaces from Cart to Confirmation.</p>
          
          <div className="relative">
            {/* Connector Line */}
            <div className="hidden lg:block absolute top-[56px] left-[5%] right-[5%] h-px bg-dashed bg-gray-300 border-t-2 border-dashed" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-10">
              {[
                { title: "Cart", icon: <ShoppingCart size={32} />, step: 1 },
                { title: "Identity", icon: <LogIn size={32} />, step: 2 },
                { title: "Address", icon: <MapPin size={32} />, step: 3 },
                { title: "Summary", icon: <Layout size={32} />, step: 4 },
                { title: "Payment", icon: <CreditCard size={32} />, step: 5 },
                { title: "Verify", icon: <ShieldAlert size={32} />, step: 6 },
                { title: "Success", icon: <CheckCircle2 size={32} />, step: 7 },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative group"
                >
                  <div className="relative z-10 w-28 h-28 mx-auto rounded-[2rem] bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-flipkart-blue group-hover:text-white transition-all duration-500 shadow-lg border border-gray-100 group-hover:scale-110 group-hover:-rotate-6">
                    {item.icon}
                  </div>
                  <div className="mt-6">
                    <p className="text-xs font-black tracking-[0.2em] uppercase opacity-40 mb-2">Step {item.step}</p>
                    <p className="text-xl font-black text-gray-900">{item.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Methodology & Issues Section */}
      <section className="py-32 px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* Navigation for Section */}
          <div className="flex flex-wrap justify-center gap-2 mb-20 p-2 bg-gray-200/50 rounded-3xl w-fit mx-auto shadow-inner">
            {["issues", "laws", "recommendations"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-10 py-4 rounded-2xl text-lg font-black uppercase tracking-wider transition-all duration-300 ${
                  activeTab === tab 
                  ? "bg-white text-flipkart-blue shadow-xl scale-105" 
                  : "text-gray-500 hover:text-gray-800 hover:bg-white/40"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "issues" && (
              <motion.div 
                key="issues-tab"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="grid grid-cols-1 gap-10"
              >
                {USABILITY_ISSUES.map((issue) => (
                  <div key={issue.id} className="bg-white group rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden flex flex-col md:flex-row hover:border-flipkart-blue/40 transition-all duration-500 transform hover:-translate-y-2">
                    <div className="md:w-96 p-12 bg-gray-50/80 flex flex-col justify-between border-r border-gray-100">
                      <div>
                        <div className="flex items-center justify-between mb-8">
                          <span className="text-2xl font-black text-flipkart-blue opacity-30">#0{issue.id}</span>
                          <div className="scale-150 transform origin-right">
                             <SeverityBadge severity={issue.severity} />
                          </div>
                        </div>
                        <p className="text-sm font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Target Step</p>
                        <p className="font-black text-xl leading-tight text-gray-800">{issue.step}</p>
                      </div>

                      {/* Attached Screenshot Button */}
                      <button 
                        onClick={() => setSelectedImage(issue.image)}
                        className="group/btn relative w-full h-[15rem] rounded-[2rem] overflow-hidden border-4 border-white shadow-xl flex items-center justify-center transition-all hover:scale-[1.02] active:scale-95 mb-6"
                      >
                        <img src={issue.image} className="w-full h-full object-cover group-hover/btn:scale-110 transition-transform duration-700 brightness-75 group-hover/btn:brightness-100" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white opacity-0 group-hover/btn:opacity-100 transition-opacity">
                           <Search size={32} className="mb-2" />
                           <p className="text-[10px] font-black uppercase tracking-widest">Enlarge View</p>
                        </div>
                      </button>

                      <div className="mt-6">
                        <p className="text-sm font-black uppercase tracking-[0.3em] text-gray-400 mb-3">Rule Violated</p>
                        <p className="font-mono text-xs bg-white p-4 rounded-2xl border border-gray-100 italic leading-relaxed shadow-sm">{issue.heuristic}</p>
                      </div>
                    </div>
                    <div className="flex-1 p-12 flex flex-col justify-center">
                      <div className="mb-10">
                        <p className="text-xs font-black uppercase tracking-[0.4em] text-flipkart-blue mb-4">The Friction</p>
                        <h4 className="text-2xl md:text-3xl font-black leading-tight text-gray-900">{issue.issue}</h4>
                      </div>
                      <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100">
                        <p className="text-xs font-black uppercase tracking-[0.4em] text-emerald-600 mb-6">Optimization Strategy</p>
                        <ul className="space-y-4">
                          {issue.improvement.map((item, idx) => (
                            <li key={idx} className="flex gap-5 text-lg text-gray-700 leading-snug font-medium">
                              <div className="mt-1 text-emerald-500 shrink-0 scale-125"><CheckCircle2 size={24} /></div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "laws" && (
              <motion.div 
                key="laws-tab"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-10"
              >
                {UX_LAWS_MAPPING.map((law, idx) => (
                  <div key={idx} className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-xl relative overflow-hidden flex flex-col h-full hover:shadow-2xl transition-shadow">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-flipkart-blue/5 rounded-full" />
                    <div className="text-flipkart-blue mb-10 border-b-2 border-gray-100 pb-8">
                      <h4 className="text-5xl font-black uppercase tracking-tighter leading-[0.8] mb-2">{law.law}</h4>
                      <p className="text-sm font-black tracking-[0.4em] uppercase opacity-40 mt-3">Principle</p>
                    </div>
                    <div className="mb-10 flex-grow">
                      <p className="text-xs font-black uppercase tracking-[0.5em] opacity-30 mb-4">Contextual Issue</p>
                      <p className="text-2xl font-black text-gray-900 leading-tight italic tracking-tight">{law.issue}</p>
                    </div>
                    <div className="mt-auto bg-gray-50 p-6 rounded-3xl">
                      <p className="text-xs font-black uppercase tracking-[0.4em] text-flipkart-blue mb-3">The "Why"</p>
                      <p className="text-lg text-gray-600 leading-relaxed font-medium">{law.reason}</p>
                    </div>
                  </div>
                ))}
                
                {/* Methodology Card */}
                <div className="bg-flipkart-blue p-16 rounded-[4rem] text-white md:col-span-3 flex flex-col lg:flex-row items-center gap-16 mt-12 shadow-2xl relative overflow-hidden shadow-flipkart-blue/30">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
                  <div className="shrink-0 scale-150">
                    <BookOpen size={80} className="opacity-40" />
                  </div>
                  <div>
                    <h4 className="text-4xl font-black uppercase tracking-tighter mb-6">Methodology Framework</h4>
                    <p className="text-2xl opacity-90 leading-relaxed max-w-4xl font-medium">
                      The evaluation follows a standard heuristic walkthrough methodology, performed by a single evaluator acting as both a first-time and a returning user. Each issue is rated on a 3-level severity scale: <span className="font-black text-flipkart-yellow underline decoration-white/20">Critical</span>, <span className="font-black text-flipkart-yellow underline decoration-white/20">Medium</span>, and <span className="font-black text-flipkart-yellow underline decoration-white/20">Low</span>.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "recommendations" && (
              <motion.div 
                key="rec-tab"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="space-y-20 max-w-5xl mx-auto"
              >
                {[
                  {
                    title: "Quick Wins",
                    timeframe: "≤ 2 Sprints",
                    color: "flipkart-blue",
                    items: [
                      "Add a 4-step progress indicator on every checkout screen",
                      "Add inline coupon error reasons with a suggested next action",
                      "Pre-select user's last-used address and payment method",
                      "Standardize the primary CTA label, color, and screen position"
                    ]
                  },
                  {
                    title: "Medium-Effort",
                    timeframe: "1 Quarter",
                    color: "amber-500",
                    items: [
                      "Restructure payment screen into 3 collapsible groups: Pay Now, Pay Later, COD",
                      "Make full address cards tappable and pin a sticky 'Continue' CTA",
                      "Improve OTP handling with 'Waiting' state and automatic 'Resend' link"
                    ]
                  },
                  {
                    title: "Larger Initiatives",
                    timeframe: "1–2 Quarters",
                    color: "flipkart-orange",
                    items: [
                      "Persistent order summary card available on every step with one-tap 'Edit'",
                      "Smart payment ranking based on user history and past success rates",
                      "Single-page express checkout for repeat users, collapsing 4 steps into 1"
                    ]
                  }
                ].map((cat, idx) => (
                  <div key={idx} className="relative pl-16 border-l-4 border-gray-200 last:border-0 pb-16">
                     <div className={`absolute left-[-15px] top-0 w-7 h-7 rounded-full border-4 border-white shadow-lg bg-${cat.color}`} style={{ backgroundColor: cat.color !== 'flipkart-blue' && cat.color !== 'flipkart-orange' ? cat.color : undefined }} />
                     <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
                       <h4 className="text-5xl font-black uppercase tracking-tighter leading-none">{cat.title}</h4>
                       <span className="px-6 py-2 bg-white border-2 border-gray-100 rounded-full text-sm font-black uppercase tracking-[0.3em] text-gray-500 shadow-sm">{cat.timeframe}</span>
                     </div>
                     <div className="grid grid-cols-1 gap-6">
                       {cat.items.map((item, i) => (
                         <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 flex items-center gap-8 hover:border-flipkart-blue/30 transition-all transform hover:scale-[1.02]">
                           <div className="mt-1 text-flipkart-blue shrink-0 scale-150"><Zap size={24} /></div>
                           <p className="text-2xl font-black text-gray-800 leading-tight tracking-tight">{item}</p>
                         </div>
                       ))}
                     </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 5. Metrics Section */}
      <section className="py-40 px-6 bg-gradient-to-tr from-gray-50 via-white to-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-6xl font-black uppercase tracking-tighter mb-6 text-flipkart-blue">Success Metrics</h2>
            <p className="text-2xl text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed">How we should track the impact of these changes using A/B Testing methodologies.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              { label: "Completion Rate", sub: "Primary Metric", val: "%", icon: <ShoppingCart size={32} /> },
              { label: "Time-to-Purchase", sub: "Speed to conversion", val: "sec", icon: <Clock size={32} /> },
              { label: "Step Drop-off", sub: "Friction tracking", val: "rate", icon: <Target size={32} /> },
              { label: "Failure Rate", sub: "Payment/OTP errors", val: "%", icon: <MessageSquare size={32} /> },
              { label: "CSAT Score", sub: "Satisfaction", val: "1-5", icon: <CheckCircle2 size={32} /> },
            ].map((metric, i) => (
              <div key={i} className="bg-white p-10 rounded-[3rem] border border-gray-100 text-center flex flex-col items-center shadow-2xl hover:shadow-flipkart-blue/10 transition-all transform hover:-translate-y-2">
                <div className="w-16 h-16 rounded-[1.5rem] bg-gray-50 flex items-center justify-center text-flipkart-blue shadow-inner mb-8">
                  {metric.icon}
                </div>
                <p className="text-sm font-black uppercase tracking-[0.3em] opacity-40 mb-3">{metric.sub}</p>
                <p className="text-2xl font-black text-gray-900 leading-[1.1] mb-6">{metric.label}</p>
                <div className="mt-auto pt-6 border-t border-gray-100 w-full font-mono text-sm text-flipkart-blue font-black tracking-widest uppercase">
                  Log Data: {metric.val}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Footer / Conclusion */}
      <footer className="py-40 px-6 bg-flipkart-dark text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-flipkart-blue shadow-[0_0_20px_rgba(40,116,240,0.5)]" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-12">Final <span className="text-flipkart-blue underline decoration-white/10 underline-offset-8">Verdict</span></h2>
          <p className="text-3xl text-gray-400 leading-relaxed mb-20 font-medium tracking-tight">
            Flipkart's checkout flow is functional but not friction-free. The seven issues identified sit on the critical path that every paying user must traverse. Aligning these pattern-level fixes with foundational UX principles can reasonably expect a measurable lift in checkout conversion and brand trust.
          </p>
          
          <div className="flex flex-col items-center border-t-2 border-white/5 pt-20">
             <div className="flex items-center gap-4 mb-8 scale-150 transform">
                <ShoppingCart className="text-flipkart-blue" strokeWidth={3} />
                <span className="text-4xl font-black italic tracking-tighter">Flipkart<span className="text-flipkart-yellow underline decoration-flipkart-blue decoration-4 underline-offset-4">plus</span></span>
             </div>

             {/* Final Contact CTA */}
             <div className="flex flex-col sm:flex-row items-center gap-8 mb-20 scale-125">
                <a href="tel:+917852010838" className="bg-flipkart-blue text-white px-10 py-4 rounded-full text-lg font-black shadow-3xl hover:bg-white hover:text-flipkart-blue transition-all flex items-center gap-4 border-2 border-transparent hover:border-flipkart-blue">
                  <Smartphone size={20} /> 
                  Contact Gaurav: +91 7852010838
                </a>
             </div>

             <p className="text-sm uppercase tracking-[0.8em] font-black opacity-20">DESIGN STRATEGY REPORT • VERSION 1.0 • 2026</p>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-flipkart-blue/5 rounded-full -mr-48 -mb-48" />
      </footer>

      {/* Sticky Bottom Nav Suggestion (Reference to Issue #5) */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="fixed bottom-10 right-10 hidden lg:block"
      >
        <div className="bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-100 flex items-center gap-6 group hover:border-flipkart-blue/40 transition-all cursor-pointer" onClick={() => setActiveTab("recommendations")}>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg">
            <Zap size={28} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500 mb-1">Impact Tip</p>
            <p className="text-xl font-black tracking-tight">Standardize CTAs!</p>
          </div>
          <button 
            className="ml-6 w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center hover:bg-flipkart-blue hover:text-white transition-all shadow-inner"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
