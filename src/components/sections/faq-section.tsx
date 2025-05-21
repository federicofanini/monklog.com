import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
  const faqs = [
    {
      question: "WHO IS THIS FOR?",
      answer:
        "This is for the 0.1% who are sick of their own excuses. For those who crave genuine self-mastery, not quick fixes. For warriors ready to kill their undisciplined self.",
    },
    {
      question: "WHO SHOULD STAY AWAY?",
      answer:
        "If you want gentle affirmations, can't handle brutal honesty, or believe in 'magic pills' for success - this isn't your fight. Stay comfortable. Stay average.",
    },
    {
      question: "WHAT MAKES THIS DIFFERENT?",
      answer:
        "MonkLog isn't another feel-good app. It's a weapon against mediocrity. Military-grade AI mentorship, raw truth tracking, and unfiltered feedback. No fluff. No excuses.",
    },
    {
      question: "HOW DOES IT WORK?",
      answer:
        "Every morning: Receive your mission. During the day: Execute and track. Every night: Face the truth. Your AI Mentor analyzes your performance and adjusts your training. Repeat until weakness is a memory.",
    },
    {
      question: "CAN I GET A REFUND?",
      answer:
        "No. This is a commitment to your transformation, not a trial run. If you're looking for an easy out before you start, you're not ready for this level of change.",
    },
  ];

  return (
    <section id="faq" className="w-full bg-black py-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-4">
            BEFORE YOU ENLIST
          </h2>
          <p className="text-lg text-white/60 font-mono">
            The uncomfortable truth about what you&apos;re signing up for.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-red-500/20 bg-black/40"
            >
              <AccordionTrigger className="px-6 py-4 text-white font-mono hover:text-red-500">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <p className="text-white/60 font-mono">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
