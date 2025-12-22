import { motion } from "framer-motion";
import { ChevronLeft, Mail, Globe, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SupportScreenProps {
    onBack: () => void;
}

const SupportOption = ({
    icon: Icon,
    title,
    description,
    action,
    onClick,
    href,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
    action: string;
    onClick?: () => void;
    href?: string;
}) => {
    const content = (
        <>
            <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                {action}
            </div>
        </>
    );

    if (href) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-4 p-4 bg-secondary/50 hover:bg-secondary rounded-2xl transition-colors text-left tap-highlight group"
            >
                {content}
            </a>
        );
    }

    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-4 p-4 bg-secondary/50 hover:bg-secondary rounded-2xl transition-colors text-left tap-highlight group"
        >
            {content}
        </button>
    );
};

import { useState } from "react";

const SupportScreen = ({ onBack }: SupportScreenProps) => {
    const [feedback, setFeedback] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (!feedback.trim()) return;
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setSubmitted(true);
        setFeedback("");
        // Reset success message after 3 seconds
        setTimeout(() => setSubmitted(false), 3000);
    };

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
                    <h1 className="text-xl font-bold text-foreground">Contact Support</h1>
                </div>
            </motion.header>

            <div className="p-6 pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                >
                    {/* Hero Section */}
                    <div className="text-center py-6">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-10 h-10 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">How can we help?</h2>
                        <p className="text-muted-foreground max-w-xs mx-auto">
                            Our team is here to assist you with any questions or issues you may have.
                        </p>
                    </div>

                    {/* Contact Options */}
                    <div className="space-y-3">
                        <SupportOption
                            icon={Mail}
                            title="Email Us"
                            description="Get a response within 24h"
                            action="Email"
                            href="mailto:support@signsarthi.com"
                        />
                        <SupportOption
                            icon={Globe}
                            title="Help Center"
                            description="Visit our website"
                            action="Visit"
                            onClick={() => window.open("https://signsarthi.com", "_blank")}
                        />
                    </div>

                    {/* Feedback Section */}
                    <div className="card-elevated mt-8">
                        <h3 className="font-semibold text-foreground mb-4">Send Feedback</h3>
                        <div className="space-y-4">
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Tell us what you think or report a bug..."
                                className="input-field min-h-[120px] resize-none"
                            />
                            <Button
                                onClick={handleSubmit}
                                disabled={!feedback.trim() || isSubmitting || submitted}
                                className={`w-full h-12 flex items-center justify-center gap-2 ${submitted ? "bg-green-600 text-white" : "btn-primary"
                                    }`}
                            >
                                {submitted ? (
                                    <span>Thank You!</span>
                                ) : isSubmitting ? (
                                    <span>Sending...</span>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        <span>Submit Feedback</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SupportScreen;
