import { motion } from "framer-motion";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { useState } from "react";

interface HelpScreenProps {
    onBack: () => void;
}

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-border last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full py-4 text-left tap-highlight"
            >
                <span className="font-medium text-foreground pr-4">{question}</span>
                <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>
            <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
            >
                <p className="text-muted-foreground pb-4 text-sm leading-relaxed">
                    {answer}
                </p>
            </motion.div>
        </div>
    );
};

const HelpScreen = ({ onBack }: HelpScreenProps) => {
    const faqs = [
        {
            question: "How does the translation work?",
            answer:
                "We use advanced Natural Language Processing to analyze your English text and map it to our library of Sign Language animations. The system understands sentence structure to provide grammatically correct ISL structure when possible.",
        },
        {
            question: "Can I use it offline?",
            answer:
                "Currently, SignSarthi requires an active internet connection to process translations and load animations. We are working on an offline mode for future updates.",
        },
        {
            question: "Is the sign language accurate?",
            answer:
                "Our animations are based on standard Sign Language. However, regional variations exist. We strive for high accuracy and continuously update our database based on expert feedback.",
        },
        {
            question: "What is Fingerspelling?",
            answer:
                "Fingerspelling allows you to spell out words letter by letter. This is useful for names, places, or words that don't have a specific sign in our database.",
        },

    ];

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
                    <h1 className="text-xl font-bold text-foreground">Help & FAQ</h1>
                </div>
            </motion.header>

            <div className="p-6 pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="card-elevated"
                >
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default HelpScreen;
