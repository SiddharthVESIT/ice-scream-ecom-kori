'use client';

import { useState } from 'react';

const QUIZ_QUESTIONS = [
    {
        id: 'mood',
        question: 'What flavor mood speaks to you?',
        options: [
            { value: 'creamy', label: '🥛 Creamy & Comforting', desc: 'Rich, velvety, warm' },
            { value: 'refreshing', label: '🍋 Refreshing & Bright', desc: 'Citrus, clean, zesty' },
            { value: 'bold', label: '🌑 Bold & Earthy', desc: 'Deep, nutty, intense' },
            { value: 'delicate', label: '🌸 Delicate & Floral', desc: 'Light, fragrant, gentle' },
        ],
    },
    {
        id: 'adventure',
        question: 'How adventurous is your palate?',
        options: [
            { value: 'classic', label: '🏯 Classic Traditional', desc: 'Time-honored Japanese flavors' },
            { value: 'adventurous', label: '⚡ Adventurous Explorer', desc: 'Unexpected, daring combinations' },
        ],
    },
    {
        id: 'sweetness',
        question: 'Sweet or Subtle?',
        options: [
            { value: 'sweet', label: '🍯 Sweet Indulgence', desc: 'Luscious, dessert-forward' },
            { value: 'subtle', label: '🍵 Subtle Elegance', desc: 'Refined, understated sweetness' },
        ],
    },
];

export default function FlavorQuiz() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [results, setResults] = useState<string[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAnswer = async (questionId: string, value: string) => {
        const newAnswers = { ...answers, [questionId]: value };
        setAnswers(newAnswers);

        if (step < QUIZ_QUESTIONS.length - 1) {
            setStep(step + 1);
        } else {
            setIsLoading(true);
            try {
                const res = await fetch('http://localhost:4000/api/v1/crm/quiz', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newAnswers),
                });
                const data = await res.json();
                setResults(data.recommendations);
            } catch {
                // Fallback to local recommendations
                setResults(['Kyoto Matcha', 'Hokkaido Milk']);
            }
            setIsLoading(false);
        }
    };

    const reset = () => {
        setStep(0);
        setAnswers({});
        setResults(null);
    };

    if (results) {
        return (
            <div className="glass-card rounded-2xl p-8 max-w-lg mx-auto text-center animate-fade-in">
                <span className="text-4xl mb-4 block">✨</span>
                <h3 className="font-display text-xl font-semibold text-kori-charcoal mb-2">Your Perfect Flavors</h3>
                <p className="text-sm text-kori-charcoal-light/60 mb-6">Based on your unique palate profile</p>
                <div className="space-y-3 mb-6">
                    {results.map((flavor, i) => (
                        <div key={i} className="bg-kori-sage/10 rounded-xl px-5 py-3 font-display text-kori-sage font-medium">
                            {flavor}
                        </div>
                    ))}
                </div>
                <button
                    onClick={reset}
                    className="text-sm text-kori-charcoal-light/50 hover:text-kori-sage underline underline-offset-4 transition-colors"
                >
                    Retake Quiz
                </button>
            </div>
        );
    }

    const current = QUIZ_QUESTIONS[step];

    return (
        <div className="glass-card rounded-2xl p-8 max-w-lg mx-auto animate-fade-in">
            {/* Progress */}
            <div className="flex gap-2 mb-6">
                {QUIZ_QUESTIONS.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-kori-sage' : 'bg-kori-sage/15'
                            }`}
                    />
                ))}
            </div>

            <h3 className="font-display text-lg font-semibold text-kori-charcoal mb-1">
                {current.question}
            </h3>
            <p className="text-xs text-kori-charcoal-light/40 mb-6">
                Step {step + 1} of {QUIZ_QUESTIONS.length}
            </p>

            <div className="space-y-3">
                {current.options.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => handleAnswer(current.id, opt.value)}
                        disabled={isLoading}
                        className="w-full text-left px-5 py-4 rounded-xl border border-kori-sage/15 hover:border-kori-sage/40 hover:bg-kori-sage/5 transition-all duration-300 group"
                    >
                        <div className="font-medium text-sm text-kori-charcoal group-hover:text-kori-sage transition-colors">
                            {opt.label}
                        </div>
                        <div className="text-xs text-kori-charcoal-light/40 mt-0.5">{opt.desc}</div>
                    </button>
                ))}
            </div>

            {isLoading && (
                <div className="text-center mt-4 text-sm text-kori-sage animate-pulse">
                    Discovering your perfect flavors...
                </div>
            )}
        </div>
    );
}
