// "use client"
// import { Button } from "@/components/ui/button";
// import { UserControl } from "@/components/user-control";
// import { useScroll } from "@/hooks/use-scroll";
// import { cn } from "@/lib/utils";
// import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
// import Image from "next/image";
// import Link from "next/link";

// export const Navbar = () => {
//     const isScrolled = useScroll();
//     return(
//         <nav
//         className={cn("p-4 bg-transparent fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-transparent",
//             isScrolled && "bg-background border-border"
//         )}
//         >
//             <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
//                 <Link href="/" className="flex items-center gap-2">
//                     <Image src="/logo.svg" alt="CodeSheet" width={24} height={24}/>
//                     <span className="font-semibold text-lg">CodeSheet</span>
//                 </Link>
//                 <SignedOut>
//                     <div className="flex gap-2">
//                         <SignUpButton>
//                             <Button variant="outline" size="sm">
//                                 Sign up
//                             </Button>
//                         </SignUpButton>
//                         <SignInButton>
//                             <Button size="sm">
//                                 Sign in
//                             </Button>
//                         </SignInButton>
//                     </div>
//                 </SignedOut>
//                 <SignedIn>
//                     {/* <p>: User control</p> */}
//                     <UserControl showName/>
//                 </SignedIn>
//             </div>
//         </nav>
//     );
// }




"use client"
import { Button } from "@/components/ui/button";
import { UserControl } from "@/components/user-control";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { GlobeIcon, SparklesIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
    const isScrolled = useScroll();
    return(
        <nav
        className={cn(
            "p-4 bg-transparent fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-transparent",
            isScrolled && "bg-background/80 backdrop-blur-md border-border shadow-sm"
        )}
        >
            <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
                {/* Left - Logo */}
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="relative">
                        <Image src="/logo.svg" alt="CodeSheet" width={28} height={28}/>
                    </div>
                    <span className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                        CodeSheet
                    </span>
                </Link>

                {/* Right - Navigation & Auth */}
                <div className="flex items-center gap-3">
                    {/* Published CodeSheets Link */}
                    <Button 
                        variant="ghost" 
                        size="sm"
                        className="hidden sm:flex items-center gap-2 font-medium"
                        asChild
                    >
                        <Link href="/published">
                            <GlobeIcon className="h-4 w-4" />
                            <span>Published CodeSheets</span>
                        </Link>
                    </Button>

                    {/* Pricing Link */}
                    <Button 
                        variant="ghost" 
                        size="sm"
                        className="hidden sm:flex items-center gap-2 font-medium"
                        asChild
                    >
                        <Link href="/pricing">
                            <SparklesIcon className="h-4 w-4" />
                            <span>Pricing</span>
                        </Link>
                    </Button>

                    {/* Auth Buttons */}
                    <SignedOut>
                        <div className="flex gap-2">
                            <SignInButton>
                                <Button variant="ghost" size="sm">
                                    Sign in
                                </Button>
                            </SignInButton>
                            <SignUpButton>
                                <Button size="sm" className="bg-primary hover:bg-primary/90">
                                    Get Started
                                </Button>
                            </SignUpButton>
                        </div>
                    </SignedOut>
                    <SignedIn>
                        <UserControl showName/>
                    </SignedIn>
                </div>
            </div>
        </nav>
    );
}
