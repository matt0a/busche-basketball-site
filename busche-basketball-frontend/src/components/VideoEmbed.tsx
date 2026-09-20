interface VideoEmbedProps {
    videoId: string;
    title: string;
    caption?: string;
}

/**
 * Responsive 16:9 YouTube embed.
 *
 * Uses the padding-top ratio technique rather than `aspect-video` because
 * @tailwindcss/aspect-ratio is not installed in this project.
 */
export const VideoEmbed = ({ videoId, title, caption }: VideoEmbedProps) => (
    <figure className="m-0">
        <div className="relative w-full pt-[56.25%] rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-card">
            <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                title={title}
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            />
        </div>
        <figcaption className="mt-3">
            <p className="font-bold text-slate-900">{title}</p>
            {caption && (
                <p className="text-sm text-slate-600 leading-relaxed mt-1">{caption}</p>
            )}
        </figcaption>
    </figure>
);
