import { Star } from "@phosphor-icons/react";

const testimonials = [
    {
        quote: "The combination of high-level basketball and genuine academic support was exactly what our family was looking for. Our son has grown tremendously — as a player, a student, and a young man.",
        attribution: "Parent of a Student-Athlete",
    },
    {
        quote: "Best decision we ever made. The coaches genuinely care about developing the whole person, not just the basketball player.",
        attribution: "Alumni Parent",
    },
    {
        quote: "International students are welcomed like family here. The support system is incredible.",
        attribution: "Parent from Spain",
    },
    {
        quote: "My son came in as a good player and left as a great one. The skill development is top-notch.",
        attribution: "Parent of 2024 Graduate",
    },
    {
        quote: "The academic rigor surprised us — in the best way. Our son is more prepared for college than his peers.",
        attribution: "Mother of a Junior",
    },
    {
        quote: "Coach and staff are available 24/7. They truly invest in each player's success.",
        attribution: "Father of a Sophomore",
    },
    {
        quote: "The exposure to college coaches was invaluable. Multiple D1 offers came directly from Busche events.",
        attribution: "Parent of Committed Athlete",
    },
    {
        quote: "A safe, structured environment where my son could focus on his goals. Worth every mile traveled.",
        attribution: "Parent from Texas",
    },
    {
        quote: "The brotherhood these young men form is lifelong. My son's teammates are now family.",
        attribution: "Alumni Parent, 2022",
    },
    {
        quote: "From day one, the communication with families has been excellent. We always know how our son is doing.",
        attribution: "Parent from California",
    },
    {
        quote: "Watching my son mature into a confident young leader has been the greatest reward.",
        attribution: "Mother of a Senior",
    },
];


interface TestimonialCardProps {
    quote: string;
    attribution: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, attribution }) => (
    <div className="flex-shrink-0 w-80 md:w-96 bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-card">
        <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={20} weight="fill" className="text-amber-400" />
            ))}
        </div>
        <blockquote className="text-slate-700 leading-relaxed mb-4 text-sm md:text-base">
            "{quote}"
        </blockquote>
        <p className="text-slate-500 font-medium text-sm">
            — {attribution}
        </p>
    </div>
);

export const TestimonialsMarquee: React.FC = () => {
    return (
        <div className="relative overflow-hidden">
            {/* Left fade gradient */}
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

            {/* Marquee track - duplicated for seamless loop */}
            <div
                className="flex gap-6 animate-marquee motion-reduce:animate-none"
                style={{ width: 'max-content' }}
                onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
                onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}
            >
                {[...testimonials, ...testimonials].map((t, i) => (
                    <TestimonialCard key={i} quote={t.quote} attribution={t.attribution} />
                ))}
            </div>

            {/* Right fade gradient */}
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        </div>
    );
};
