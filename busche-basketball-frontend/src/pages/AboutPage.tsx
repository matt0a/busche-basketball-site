import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { TestimonialsMarquee } from "../components/TestimonialsMarquee";

// Icons as simple SVG components
const AcademicsIcon = () => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
);

const BasketballIcon = () => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
        <path strokeLinecap="round" strokeWidth={1.5} d="M12 3v18M3 12h18M5.5 5.5c3.5 2 5 5 5 6.5s-1.5 4.5-5 6.5M18.5 5.5c-3.5 2-5 5-5 6.5s1.5 4.5 5 6.5" />
    </svg>
);

const CharacterIcon = () => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

const GlobeIcon = () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CheckIcon = () => (
    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

export const AboutPage: React.FC = () => {
    const heroRef = useRef<HTMLDivElement | null>(null);
    const cardsRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Simple fade-in animations
        if (heroRef.current) {
            gsap.fromTo(
                heroRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
            );
        }
        if (cardsRef.current) {
            gsap.fromTo(
                cardsRef.current.children,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.3, ease: "power2.out" }
            );
        }
    }, []);

    const quickFacts = [
        {
            icon: <AcademicsIcon />,
            title: "Earn College Credits",
            description: "Through our CMCC partnership, students take real college courses alongside high school classes — graduating with an Associate's Degree.",
            stat: "60+",
            statLabel: "College Credits Available"
        },
        {
            icon: <BasketballIcon />,
            title: "Elite Basketball Training",
            description: "Year-round development with professional coaching, competitive schedules, and exposure to college programs.",
            stat: "2",
            statLabel: "Competitive Teams"
        },
        {
            icon: <CharacterIcon />,
            title: "Character Development",
            description: "Building leaders on and off the court through mentorship, accountability, and a values-driven culture.",
            stat: "24/7",
            statLabel: "Support System"
        }
    ];

    const valueProps = [
        "Professional coaching staff with college and pro experience",
        "Competitive schedule against top prep programs",
        "College recruiting support and exposure events",
        "Daily skill development and strength training",
        "Small-school academic environment with tutoring",
        "International community from around the world",
        "Beautiful New Hampshire campus near Boston",
        "Structured boarding program with supervision"
    ];

    const programHighlights = [
        {
            title: "Training Philosophy",
            description: "Our development model focuses on individual skill acquisition, basketball IQ, and physical preparation. Every player receives personalized attention to maximize their potential."
        },
        {
            title: "Academic Excellence",
            description: "Student-athletes attend Busche Academy's college-preparatory program, balancing rigorous coursework with competitive basketball. Study hall, tutoring, and college guidance are built into the schedule."
        },
        {
            title: "Recruiting Pipeline",
            description: "We work directly with college coaches at all levels. Through film, showcases, and relationships, we help student-athletes find the right fit for their next chapter."
        },
        {
            title: "Global Community",
            description: "Our roster includes players from across the United States and around the world. This diversity creates a unique locker room culture and lifelong connections."
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-slate-900 text-white overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #009FFD 0%, transparent 50%), radial-gradient(circle at 75% 75%, #2AFC98 0%, transparent 50%)`
                    }} />
                </div>

                <div ref={heroRef} className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
                    <div className="max-w-3xl">
                        <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-4">
                            About Our Program
                        </p>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                            Where Basketball Meets
                            <span className="text-primary"> Academic Excellence</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-8 max-w-2xl">
                            Busche Academy Basketball combines elite athletic training with a
                            rigorous college-preparatory education. We develop student-athletes
                            who excel on the court, in the classroom, and in life.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="mailto:info@buscheacademy.org?subject=Basketball%20Program%20Inquiry"
                                className="btn-primary px-6 py-3"
                            >
                                Contact Us
                            </a>
                            <Link
                                to="/roster"
                                className="btn-secondary bg-transparent border-slate-500 text-white hover:bg-white/10 hover:border-white px-6 py-3"
                            >
                                View Our Roster
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Facts Cards */}
            <section className="py-16 md:py-20 bg-slate-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                            At A Glance
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                            The Busche Academy Difference
                        </h2>
                    </div>

                    <div ref={cardsRef} className="grid md:grid-cols-3 gap-6">
                        {quickFacts.map((fact, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover border border-slate-200 hover:border-primary/30 transition-all duration-300 group"
                            >
                                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    {fact.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">
                                    {fact.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed mb-5">
                                    {fact.description}
                                </p>
                                <div className="pt-4 border-t border-slate-100">
                                    <p className="text-3xl font-bold text-primary">{fact.stat}</p>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                        {fact.statLabel}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Statement */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                                Our Mission
                            </p>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                                Developing Student-Athletes for Success
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed mb-6">
                                At Busche Academy, we believe that basketball and academics are not
                                competing priorities — they're complementary disciplines that teach
                                the same core skills: discipline, preparation, teamwork, and resilience.
                            </p>
                            <p className="text-slate-600 leading-relaxed">
                                Our program brings together talented young players from across the
                                United States and around the world. In this diverse, supportive
                                environment, student-athletes push each other to grow — on the court,
                                in the classroom, and as young leaders preparing for the next chapter.
                            </p>
                        </div>

                        <div className="bg-slate-900 rounded-2xl p-8 text-white">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                    <GlobeIcon />
                                </div>
                                <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                                    A Global Locker Room
                                </p>
                            </div>
                            <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-6">
                                "Basketball is our vehicle, but character is our destination.
                                We're building young men who will succeed long after the final buzzer."
                            </blockquote>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold">
                                    BA
                                </div>
                                <div>
                                    <p className="font-semibold">Busche Academy Coaching Staff</p>
                                    <p className="text-sm text-slate-400">Basketball Program</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CMCC Partnership */}
            <section className="py-16 md:py-20 bg-primary/5 border-y border-primary/10">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid lg:grid-cols-5 gap-8 items-center">
                        <div className="lg:col-span-3">
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-4">
                                <AcademicsIcon />
                                <span>Exclusive Partnership</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                                Graduate with Your Associate's Degree
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed mb-4">
                                Busche Academy partners with <strong>Central Maine Community College (CMCC)</strong> to
                                offer students the opportunity to earn real college credits while completing their
                                high school education.
                            </p>
                            <p className="text-slate-600 leading-relaxed">
                                Students who complete their entire high school career at Busche Academy can graduate
                                with both their high school diploma and an <strong>Associate's Degree</strong> — giving
                                them a significant head start on their college journey and future career.
                            </p>
                        </div>
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl p-8 shadow-card border border-slate-200">
                                <p className="text-5xl font-bold text-primary mb-2">2-in-1</p>
                                <p className="text-lg font-semibold text-slate-900 mb-4">
                                    High School Diploma + Associate's Degree
                                </p>
                                <ul className="space-y-3 text-sm text-slate-600">
                                    <li className="flex items-start gap-2">
                                        <CheckIcon />
                                        <span>Real college courses, real credits</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckIcon />
                                        <span>Transfer credits to 4-year universities</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckIcon />
                                        <span>Save time and tuition costs</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckIcon />
                                        <span>Stand out in college admissions</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Busche */}
            <section className="py-16 md:py-20 bg-slate-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div>
                            <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                                Why Busche Academy
                            </p>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                                What Sets Us Apart
                            </h2>
                            <p className="text-slate-600 leading-relaxed mb-8">
                                Choosing the right basketball program is one of the most important
                                decisions a family can make. Here's why families choose Busche Academy:
                            </p>

                            <ul className="space-y-4">
                                {valueProps.map((prop, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className="mt-0.5 flex-shrink-0">
                                            <CheckIcon />
                                        </div>
                                        <span className="text-slate-700">{prop}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-4">
                            {programHighlights.map((highlight, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white rounded-xl p-6 shadow-card border border-slate-200 hover:border-primary/30 hover:shadow-card-hover transition-all duration-300"
                                >
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                                        {highlight.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {highlight.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonial / Social Proof */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                            What Families Say
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                            Join Our Community
                        </h2>
                    </div>

                    <TestimonialsMarquee />
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-20 bg-slate-900 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Take the Next Step?
                    </h2>
                    <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                        Learn more about Busche Academy Basketball and how we can help you
                        achieve your goals on and off the court.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="mailto:info@buscheacademy.org?subject=Basketball%20Program%20-%20Schedule%20a%20Visit"
                            className="btn-primary px-8 py-3 text-base"
                        >
                            Schedule a Visit
                        </a>
                        <a
                            href="mailto:info@buscheacademy.org?subject=Basketball%20Program%20-%20Admissions%20Inquiry"
                            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg border border-slate-500 text-white hover:bg-white/10 hover:border-white transition-all duration-200"
                        >
                            Request Information
                        </a>
                        <a
                            href="https://form.jotform.com/252083454902455"
                            target="_blank"
                            rel="noreferrer"
                            className="btn-primary px-8 py-3 text-base"
                        >
                            Apply Now
                        </a>
                    </div>
                    <p className="mt-8 text-sm text-slate-400">
                        Questions? Email us at{" "}
                        <a href="mailto:info@buscheacademy.org" className="text-primary hover:underline">
                            info@buscheacademy.org
                        </a>{" "}
                        or call{" "}
                        <span className="text-white">(603) 887-0001</span>
                    </p>
                </div>
            </section>

            {/* Location / Campus Brief */}
            <section className="py-12 bg-slate-50 border-t border-slate-200">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">
                                Our Campus
                            </p>
                            <p className="text-lg font-medium text-slate-900">
                                Chester, New Hampshire — Just 40 miles from Boston
                            </p>
                            <p className="text-slate-600 text-sm mt-1">
                                A safe, focused environment where student-athletes can thrive.
                            </p>
                        </div>
                        <a
                            href="https://buscheacademy.org"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-primary hover:text-sky-600 font-medium transition-colors"
                        >
                            Visit buscheacademy.org
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};
