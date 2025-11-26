import React from "react";

type FullScreenLoaderProps = {
    message?: string;
};

export const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
                                                                      message,
                                                                  }) => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                <div className="relative flex items-center justify-center">
                    {/* soft glowing ring */}
                    <div className="absolute h-24 w-24 rounded-full bg-primary/40 blur-xl animate-ping" />

                    {/* pulsing logo */}
                    <img
                        src="/busche-logo.png"
                        alt="Busche Academy"
                        className="relative h-16 w-16 animate-pulse drop-shadow-xl"
                    />
                </div>

                <p className="text-xs tracking-[0.25em] uppercase text-slate-100">
                    {message ?? "Loading"}
                </p>
            </div>
        </div>
    );
};
