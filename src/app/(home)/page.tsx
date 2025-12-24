// "use client";
// import { ProjectForm } from "@/modules/home/ui/components/project-form";
// import { ProjectList } from "@/modules/home/ui/components/projects-list";
// import Image from "next/image";

// const page = () => {
//   return(
//     <div className="flex flex-col max-w-5xl mx-auto w-full">
//       <section className="space-y-6 py-[16vh] 2xl:py-48">
//         <div className="flex flex-col items-center">
//           <Image
//           src="/logo.svg"
//           alt="CodeSheet"
//           width={50}
//           height={50}
//           className="hidden md:block"
//           />
//         </div>
//         <h1 className="text-2xl md:text-5xl font-bold text-center">
//           Build something with CodeSheet
//         </h1>
//         <p className="text-lg md:text-xl text-muted-foreground text-center">
//           Create apps and websites by chatting with AI
//         </p>
//         <div className="max-w-3xl mx-auto w-full">
//           <ProjectForm/>
//         </div>
//       </section>
//       <ProjectList/>
//     </div>
//   );
// }

// export default page;


"use client";
import { ProjectForm } from "@/modules/home/ui/components/project-form";
import { ProjectList } from "@/modules/home/ui/components/projects-list";
import Image from "next/image";
import { ArrowUpRight, Sparkles, Code2, Layers, Zap } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Page = () => {
  const { isSignedIn } = useUser();
  const router = useRouter();

  const handleGetStarted = () => {
    if (isSignedIn) {
      // Scroll to top if logged in
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Redirect to sign-in page if not logged in
      router.push('/sign-in');
    }
  };

  return (
    <div className="flex flex-col w-full">
      
      {/* Hero Section - Two Column Layout */}
      <section className="min-h-screen flex items-center px-4 pt-24 pb-12">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column - Content (7 columns) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Floating Number */}
              <div className="relative">
                <span className="absolute -left-4 -top-8 text-[140px] md:text-[180px] font-black text-gray-100 dark:text-gray-900 select-none leading-none">
                  01
                </span>
                <div className="relative z-10 space-y-6">
                  {/* Small Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900">
                    <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-semibold text-purple-900 dark:text-purple-300 tracking-wide uppercase">
                      AI Development Platform
                    </span>
                  </div>

                  {/* Main Heading */}
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white leading-[0.95] tracking-tight">
                    Build
                    <br />
                    <span className="italic font-serif">Anything</span>
                    <br />
                    Instantly
                  </h1>

                  {/* Description */}
                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
                    Transform natural language into production-ready code. 
                    <span className="font-semibold text-gray-900 dark:text-white"> CodeSheet</span> makes development as simple as having a conversation.
                  </p>

                  {/* Stats Row */}
                  <div className="flex gap-6 md:gap-8 pt-4">
                    <div>
                      <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">10x</div>
                      <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Faster</div>
                    </div>
                    <div className="w-px bg-gray-200 dark:bg-gray-800" />
                    <div>
                      <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">0s</div>
                      <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Setup</div>
                    </div>
                    <div className="w-px bg-gray-200 dark:bg-gray-800" />
                    <div>
                      <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">100%</div>
                      <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Type-Safe</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Interactive Card (5 columns) */}
            <div className="lg:col-span-5">
              <div className="relative group">
                {/* Floating elements for depth */}
                <div className="absolute -inset-4 bg-gradient-to-br from-purple-200 to-blue-200 dark:from-purple-900/40 dark:to-blue-900/40 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Main Card */}
                <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
                  {/* Header Bar */}
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 md:p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 md:p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                          <Image
                            src="/logo.svg"
                            alt="CodeSheet"
                            width={24}
                            height={24}
                            className="invert"
                          />
                        </div>
                        <div>
                          <div className="text-white font-bold text-base md:text-lg">CodeSheet</div>
                          <div className="text-white/80 text-xs">AI Code Generator</div>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-white/30" />
                        <div className="w-3 h-3 rounded-full bg-white/30" />
                        <div className="w-3 h-3 rounded-full bg-white/30" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                        Start Your Project
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Describe your app idea and watch it come to life
                      </p>
                    </div>

                    {/* Project Form Component */}
                    <div className="w-full">
                      <ProjectForm />
                    </div>

                    {/* Feature Pills */}
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                      <div className="flex flex-wrap gap-2">
                        <div className="px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/50 text-xs font-medium text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                          <Code2 className="h-3 w-3" />
                          Full-Stack
                        </div>
                        <div className="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-xs font-medium text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                          <Layers className="h-3 w-3" />
                          Type-Safe
                        </div>
                        <div className="px-3 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-950/50 text-xs font-medium text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5">
                          <Zap className="h-3 w-3" />
                          No Setup
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-16 md:py-20 px-4 bg-gray-50 dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <span className="text-sm font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mt-2">
              Everything you need
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "AI-Powered Generation",
                description: "Advanced language models understand your requirements and generate production-ready code instantly.",
                icon: "🤖",
                color: "from-purple-500 to-purple-600"
              },
              {
                title: "Live Preview",
                description: "See your application running in real-time with instant hot-reload and shareable URLs.",
                icon: "⚡",
                color: "from-blue-500 to-blue-600"
              },
              {
                title: "Secure Sandbox",
                description: "Isolated execution environment with Docker containers. Safe testing and development for every project.",
                icon: "🔒",
                color: "from-green-500 to-green-600"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800 hover:border-transparent hover:shadow-xl transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
                <div className="relative z-10 space-y-4">
                  <div className="text-4xl md:text-5xl">{feature.icon}</div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 pb-8 border-b-2 border-gray-900 dark:border-white">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mt-2">
                Your Workspace
              </h2>
            </div>
            <div className="hidden md:block text-5xl md:text-6xl font-black text-gray-200 dark:text-gray-800">
              02
            </div>
          </div>
          
          {/* ProjectList Component */}
          <div className="w-full">
            <ProjectList />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 dark:from-black dark:via-purple-950 dark:to-blue-950" />
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Ready to build
            <br />
            <span className="italic font-serif">something amazing?</span>
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Join thousands of developers creating the future with AI-powered development
          </p>
          <button 
            onClick={handleGetStarted}
            className="group inline-flex items-center gap-3 px-6 md:px-8 py-4 md:py-5 bg-white text-gray-900 rounded-full font-bold text-base md:text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            {isSignedIn ? 'Start Building Now' : 'Start Building Free'}
            <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Page;
