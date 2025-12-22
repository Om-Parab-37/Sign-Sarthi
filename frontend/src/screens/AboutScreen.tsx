import { motion } from "framer-motion";
import { ChevronLeft, Heart, Github, Instagram, Linkedin } from "lucide-react";
import HandIcon from "@/components/icons/HandIcon";

interface AboutScreenProps {
    onBack: () => void;
}

const SocialLink = ({ icon: Icon, href }: { icon: React.ElementType; href: string }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
    >
        <Icon className="w-5 h-5" />
    </a>
);

const AboutScreen = ({ onBack }: AboutScreenProps) => {
    return (
        <div className="min-h-screen bg-background safe-area-top safe-area-bottom">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border"
            >
                <div className="px-5 py-4 flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center tap-highlight hover:bg-secondary/80 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6 text-foreground" />
                    </button>
                    <h1 className="text-xl font-bold text-foreground">About</h1>
                </div>
            </motion.header>

            <div className="p-6 pb-24">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center text-center mb-8 pt-8"
                >
                    <div className="w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center shadow-lg mb-6 rotate-3 hover:rotate-6 transition-transform duration-300">
                        <HandIcon className="w-12 h-12 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">SignSarthi</h1>
                    <p className="text-muted-foreground">Version 1.0.0</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="space-y-6"
                >
                    <div className="card-elevated text-center">
                        <p className="text-foreground leading-relaxed">
                            SignSarthi is dedicated to bridging the communication gap between the hearing and the Deaf community. By leveraging advanced AI and animation technology, we make Sign Language accessible to everyone, everywhere.
                        </p>
                    </div>

                    <div className="card-elevated">
                        <h3 className="font-semibold text-foreground mb-4">The Team</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                            We are a passionate team of developers, designers, and linguists working together to create inclusive technology solutions.
                        </p>
                        <div className="flex justify-center gap-4">
                            <SocialLink icon={Github} href="https://github.com/Om-Parab-37" />
                            <SocialLink icon={Instagram} href="https://www.instagram.com/omparab84211" />
                            <SocialLink icon={Linkedin} href="https://www.linkedin.com/in/om-parab/" />
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 pt-8 opacity-60">
                        <Heart className="w-5 h-5 text-accent animate-pulse" />
                        <p className="text-xs text-muted-foreground">
                            Designed & Developed with love in India
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-2">
                            © 2024 SignSarthi. All rights reserved.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AboutScreen;
