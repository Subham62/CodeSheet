"use client";

import { Footer } from "@/modules/home/ui/components/footer";
import { Navbar } from "@/modules/home/ui/components/navbar";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function InfoPage() {
  const [activeSection, setActiveSection] = useState("");

  // Smooth scroll to hash on load
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Get hash without #
      if (hash) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          setActiveSection(hash);
        }
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 py-20 px-4 pt-32 md:pt-36"> {/* ✅ Navbar offset */}
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Company Information
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to know about CodeSheet
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-20">
            {/* About */}
            <section id="about">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 pt-20 -mt-20 scroll-mt-20">
                About CodeSheet
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  CodeSheet is an AI-powered development platform that transforms natural language into production-ready applications. 
                  Our mission is to make software development accessible to everyone by removing technical barriers.
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Instant code generation</li>
                  <li>• Secure sandbox environments</li>
                  <li>• Full-stack TypeScript applications</li>
                  <li>• No setup required</li>
                </ul>
              </div>
            </section>

            {/* Contact */}
            <section id="contact">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 pt-20 -mt-20 scroll-mt-20">
                Contact Us
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Email</p>
                  <a 
                    href="mailto:subhamchakraborty2002@gmail.com" 
                    className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors block"
                  >
                    subhamchakraborty2002@gmail.com {/* ✅ Fixed: Removed markdown */}
                  </a>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Social</p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="https://www.linkedin.com/in/subham-chakraborty01/" 
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors flex items-center gap-2"
                    >
                      LinkedIn
                    </Link>
                    <Link 
                      href="https://github.com/Subham62" 
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors flex items-center gap-2"
                    >
                      GitHub
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Privacy */}
            <section id="privacy">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 pt-20 -mt-20 scroll-mt-20">
                Privacy Policy
              </h2>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Your privacy is important to us. CodeSheet collects minimal data required for service operation:
                </p>
                <ul className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Project data (deleted after 30 days)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Usage analytics (anonymized)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>No selling of user data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>GDPR compliant</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Terms */}
            <section id="terms">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 pt-20 -mt-20 scroll-mt-20">
                Terms of Service
              </h2>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  By using CodeSheet, you agree to:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Usage</h4>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <li>• Fair use policy applies</li>
                      <li>• Generated code is yours to use</li>
                      <li>• Commercial use allowed</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Limitations</h4>
                    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      <li>• No illegal content</li>
                      <li>• Rate limits apply</li>
                      <li>• Sandbox restrictions</li>
                      <li>• <strong>Live Preview:</strong> Available for 20-30 minutes after generation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};
