import { Footer } from "@/modules/home/ui/components/footer";
import { Navbar } from "@/modules/home/ui/components/navbar";

interface Props {
    children: React.ReactNode
}

const Layout = ({children}: Props) => {
    return (
        <main className="flex flex-col min-h-screen bg-white dark:bg-gray-950 relative overflow-x-hidden">
            <Navbar/>
            
            {/* Sophisticated Background */}
            <div className="fixed inset-0 -z-10">
                {/* Base */}
                <div className="absolute inset-0 bg-white dark:bg-gray-950" />
                
                {/* Organic Shapes Background */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Top Right Organic Shape */}
                    <div className="absolute -top-[40%] -right-[20%] w-[800px] h-[800px]">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-950/30 dark:to-blue-950/30 rounded-[40%] rotate-12 opacity-60" />
                    </div>
                    
                    {/* Bottom Left Organic Shape */}
                    <div className="absolute -bottom-[30%] -left-[15%] w-[700px] h-[700px]">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-cyan-100 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-[45%] -rotate-12 opacity-60" />
                    </div>
                    
                    {/* Center Accent */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-950/20 dark:to-transparent rounded-full blur-3xl opacity-50" />
                    </div>
                </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col relative z-10 px-4 pb-12">
                {children}
            </div>
            
            {/* Footer */}
            <Footer />
        </main>
    );
}

export default Layout;
