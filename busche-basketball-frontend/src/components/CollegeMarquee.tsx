import { useState } from "react";

const COLLEGES = [
    { name: "Yale University", domain: "yale.edu" },
    { name: "Boston College", domain: "bc.edu" },
    { name: "Michigan State University", domain: "msu.edu" },
    { name: "Penn State University", domain: "psu.edu" },
    { name: "The Ohio State University", domain: "osu.edu" },
    { name: "Syracuse University", domain: "syr.edu" },
    { name: "University of Michigan", domain: "umich.edu" },
    { name: "University of Southern California", domain: "usc.edu" },
    { name: "Louisiana State University", domain: "lsu.edu" },
    { name: "Texas A&M University", domain: "tamu.edu" },
    { name: "Virginia Tech", domain: "vt.edu" },
    { name: "Rutgers University", domain: "rutgers.edu" },
    { name: "Northeastern University", domain: "northeastern.edu" },
    { name: "Fordham University", domain: "fordham.edu" },
    { name: "George Washington University", domain: "gwu.edu" },
    { name: "Georgia Tech", domain: "gatech.edu" },
    { name: "UC Davis", domain: "ucdavis.edu" },
    { name: "UC Irvine", domain: "uci.edu" },
    { name: "University of Illinois", domain: "illinois.edu" },
    { name: "University of Wisconsin", domain: "wisc.edu" },
    { name: "Arizona State University", domain: "asu.edu" },
    { name: "Iowa State University", domain: "iastate.edu" },
    { name: "UConn", domain: "uconn.edu" },
    { name: "University of Pittsburgh", domain: "pitt.edu" },
    { name: "New York University", domain: "nyu.edu" },
    { name: "Boston University", domain: "bu.edu" },
    { name: "University of Toronto", domain: "utoronto.ca" },
    { name: "George Mason University", domain: "gmu.edu" },
    { name: "University of Oregon", domain: "uoregon.edu" },
    { name: "Iona University", domain: "iona.edu" },
];

const CollegeLogo = ({ name, domain }: { name: string; domain: string }) => {
    const [failed, setFailed] = useState(false);

    const shortName = name
        .replace("University of ", "U of ")
        .replace(" University", "")
        .replace(" Institute of Technology", " Tech")
        .replace(" State University", " State")
        .replace(" College", "");

    return (
        <div className="flex flex-col items-center gap-1.5 group">
            {!failed && (
                <img
                    src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
                    alt={name}
                    title={name}
                    onError={() => setFailed(true)}
                    className="h-8 w-8 object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    loading="lazy"
                />
            )}
            <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap leading-none">
                {shortName}
            </span>
        </div>
    );
};

export const CollegeMarquee = () => {
    return (
        <div
            className="overflow-hidden"
            style={{
                maskImage:
                    "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
                WebkitMaskImage:
                    "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            }}
        >
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .marquee-track {
                    display: flex;
                    align-items: center;
                    width: max-content;
                    animation: marquee 50s linear infinite;
                }
                .marquee-track:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <div className="marquee-track">
                {COLLEGES.map((college) => (
                    <span
                        key={`a-${college.domain}`}
                        className="flex items-center justify-center mx-6 shrink-0"
                    >
                        <CollegeLogo name={college.name} domain={college.domain} />
                    </span>
                ))}
                {COLLEGES.map((college) => (
                    <span
                        key={`b-${college.domain}`}
                        className="flex items-center justify-center mx-6 shrink-0"
                        aria-hidden="true"
                    >
                        <CollegeLogo name={college.name} domain={college.domain} />
                    </span>
                ))}
            </div>
        </div>
    );
};
