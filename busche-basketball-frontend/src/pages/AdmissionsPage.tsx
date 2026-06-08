import { SectionNav } from "../components/SectionNav";

const SECTION_NAV = [
    { id: "how-to-apply", label: "How to Apply" },
    { id: "tuition", label: "Tuition & Fees" },
];

// Step metadata: text + icon per step
const STEPS: Array<{ text: string; icon: React.ReactNode }> = [
    {
        text: "Complete the online application via the button below.",
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
        ),
    },
    {
        text: "Submit a processing fee (required).",
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
        ),
    },
    {
        text: "Schedule a campus visit or phone interview.",
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        ),
    },
    {
        text: "Provide school records and teacher recommendations.",
        icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
];

// Accent divider used between major page sections
const AccentDivider = () => (
    <div className="max-w-6xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-primary/40 via-aqua/30 to-transparent" />
    </div>
);

export const AdmissionsPage = () => (
    <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative bg-slate-900 text-white overflow-hidden">
            {/* #1 — gradient opacity bumped to 15 */}
            <div
                className="absolute inset-0 opacity-15"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 25% 25%, #009FFD 0%, transparent 50%), radial-gradient(circle at 75% 75%, #2AFC98 0%, transparent 50%)",
                }}
            />
            {/* #2 — hero content with pb-20 to clear stat strip */}
            <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28 pb-20">
                <div className="max-w-3xl">
                    <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-4">
                        ADMISSIONS
                    </p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                        Begin Your Journey at Busche Academy
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl">
                        Open to US and international students. Day and boarding enrollment available.
                        Financial aid offered.
                    </p>
                </div>
            </div>
            {/* #2 — frosted-glass stat strip (hidden on mobile to avoid overlap) */}
            <div className="hidden sm:block absolute bottom-0 left-0 right-0 backdrop-blur-sm bg-white/5 border-t border-white/10">
                <div className="max-w-6xl mx-auto px-4 py-4 grid grid-cols-3 divide-x divide-white/10">
                    {[
                        { value: "Day & Boarding", label: "Enrollment" },
                        { value: "Financial Aid Available", label: "Support" },
                        { value: "US & International", label: "Students" },
                    ].map((s) => (
                        <div key={s.label} className="px-4 first:pl-0 text-center">
                            <p className="text-lg font-bold text-white">{s.value}</p>
                            <p className="text-xs text-slate-400 uppercase tracking-wide">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <SectionNav sections={SECTION_NAV} />

        {/* Section: How to Apply */}
        <section
            id="how-to-apply"
            className="py-16 md:py-20 bg-white"
            style={{ scrollMarginTop: "80px" }}
        >
            <div className="max-w-6xl mx-auto px-4">
                {/* #3 — eyebrow accent bar */}
                <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                    ADMISSIONS PROCESS
                </p>
                <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-aqua mb-3 mt-1" />
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">
                    How to Apply
                </h2>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left */}
                    <div className="space-y-5">
                        <p className="text-slate-600 leading-relaxed">
                            We encourage applications from serious students who are open to new challenges
                            and experiences. Admission to BA is based upon the student's school record,
                            application essay, teacher and counselor recommendations, and, whenever
                            possible, standardized testing such as the SSAT, PSAT, SAT, or TOEFL.
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            Busche Academy admits students of any race, religion, gender, national origin,
                            or sexual orientation in all rights, privileges, programs and activities.
                        </p>

                        {/* #6 — visual step-cards */}
                        <div className="space-y-3 pt-2">
                            {STEPS.map((step, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white rounded-xl border border-slate-100 shadow-card p-4 flex items-start gap-4 hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200"
                                >
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className="w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
                                            {idx + 1}
                                        </span>
                                        <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                            {step.icon}
                                        </div>
                                    </div>
                                    <p className="text-slate-700 leading-relaxed pt-1">{step.text}</p>
                                </div>
                            ))}
                        </div>

                        <p className="text-sm text-slate-500 pt-2">
                            For more information, email{" "}
                            <a
                                href="mailto:info@buscheacademy.org"
                                className="text-primary hover:underline"
                            >
                                info@buscheacademy.org
                            </a>{" "}
                            or call (603) 887-5200.
                        </p>
                    </div>

                    {/* Right: apply card */}
                    <div className="bg-slate-900 text-white rounded-2xl p-8">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3">
                            ONLINE APPLICATION
                        </p>
                        <h3 className="text-2xl font-bold mb-3">Ready to Apply?</h3>
                        <p className="text-slate-300 leading-relaxed mb-6">
                            Click below to access our application on JotForm.
                        </p>
                        <a
                            href="https://bit.ly/gobuscheacademy"
                            target="_blank"
                            rel="noreferrer"
                            className="btn-primary px-6 py-3 inline-block mb-5 text-base"
                        >
                            Start Application
                        </a>
                        <p className="text-sm text-slate-400">
                            Questions? Email{" "}
                            <a
                                href="mailto:info@buscheacademy.org"
                                className="text-primary hover:underline"
                            >
                                info@buscheacademy.org
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* #5 — accent divider */}
        <AccentDivider />

        {/* Section: Tuition & Fees */}
        <section
            id="tuition"
            className="py-16 md:py-20 bg-slate-50"
            style={{ scrollMarginTop: "80px" }}
        >
            <div className="max-w-6xl mx-auto px-4">
                {/* #3 — eyebrow accent bar */}
                <p className="text-primary font-semibold text-sm uppercase tracking-[0.2em] mb-2">
                    TUITION & FEES
                </p>
                <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-aqua mb-3 mt-1" />
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                    2026–27 Academic Year
                </h2>
                <p className="text-slate-600 mb-10 max-w-2xl">
                    Busche Academy offers an exceptional school experience at an accessible price,
                    with financial aid available to qualified students.
                </p>

                {/* #7 — pricing cards with icon wells, border-l, and hover */}
                <div className="grid md:grid-cols-2 gap-6 mb-10">
                    {/* Day Student */}
                    <div className="bg-white rounded-2xl border border-slate-200 border-l-4 border-l-primary shadow-card p-8 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Day Student</p>
                        <p className="text-4xl font-bold text-primary mb-3">$39,500</p>
                        <p className="text-slate-600 leading-relaxed">Includes academics, athletics, and lunch on school days.</p>
                    </div>
                    {/* Boarding Student */}
                    <div className="bg-white rounded-2xl border border-slate-200 border-l-4 border-l-aqua shadow-card p-8 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Boarding Student</p>
                        <p className="text-4xl font-bold text-primary mb-3">$59,500</p>
                        <p className="text-slate-600 leading-relaxed">Includes academics, athletics, on-campus dormitory housing, and all meals during the school year.</p>
                    </div>
                </div>

                {/* Additional fees */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                        Additional Fees (If Applicable)
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <div className="flex items-center justify-between mb-2">
                                <p className="font-semibold text-slate-900">Incidental Deposit</p>
                                <span className="text-xs bg-aqua/20 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                                    REFUNDABLE
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-primary mb-2">$500</p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Required for all boarding students. Refundable after satisfactory room
                                inspection at year end.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <p className="font-semibold text-slate-900 mb-2">Medical Insurance</p>
                            <p className="text-2xl font-bold text-primary mb-2">$1,000</p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Available for enrolled students.
                            </p>
                        </div>
                    </div>
                </div>

                {/* #13 — Financial aid box with icon well above eyebrow */}
                <div className="bg-primary/5 border-l-4 border-primary rounded-r-2xl p-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-2">
                        FINANCIAL AID
                    </p>
                    <p className="text-slate-700 leading-relaxed mb-4">
                        Every year, BA offers generous financial aid to qualified students. We are
                        committed to working with every family to make a Busche Academy education
                        possible. Contact us to learn more.
                    </p>
                    <p className="text-slate-700 text-sm mb-4">
                        To inquire about financial aid, email us at{" "}
                        <a href="mailto:info@buscheacademy.org" className="text-primary hover:underline font-medium">
                            info@buscheacademy.org
                        </a>
                    </p>
                    <a
                        href="https://bit.ly/gobuscheacademy"
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary px-5 py-2.5 inline-block text-sm"
                    >
                        Apply Now
                    </a>
                </div>
            </div>
        </section>
    </div>
);
