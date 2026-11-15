export interface InformationSection {
  id: string;
  title: string;
  content: string;
}

export interface InformationConfig {
  kicker: string;
  heading: string;
  sections: InformationSection[];
}

export const DEFAULT_INFORMATION_CONFIG: InformationConfig = {
  kicker: 'ABOUT',
  heading: 'JWY PHOTOBOOK',
  sections: [
    {
      id: 'sec-01',
      title: '01. Origin',
      content:
        'JWY PHOTOBOOK is a personal photography archive founded in Seoul, Korea.',
    },
    {
      id: 'sec-03',
      title: '02. Contact',
      content: 'Email: yoojiwoo@korea.ac.kr',
    },
  ],
};

interface InformationViewProps {
  config: InformationConfig;
  onBackToCatalog: () => void;
}

/**
 * Information View:
 * Line 1: ABOUT
 * Line 2: JWY PHOTOBOOK
 * Body: Subtitles and paragraph content.
 * Bottom box deleted per user request.
 */
export default function InformationView({ config, onBackToCatalog }: InformationViewProps) {
  return (
    <div
      className="w-full bg-[#0A0A0A] text-white py-12 sm:py-20 px-4 sm:px-6 min-h-screen"
      data-testid="information-screen"
    >
      <div className="max-w-2xl mx-auto space-y-12 sm:space-y-16">
        {/* Back navigation */}
        <div className="pb-6 border-b border-white/10">
          <button
            onClick={onBackToCatalog}
            className="font-light text-xs uppercase tracking-tight text-neutral-400 hover:text-white transition-colors bg-transparent border-0 p-0 cursor-pointer flex items-center gap-2"
          >
            <span aria-hidden="true">←</span>
            <span>Return to Monographs</span>
          </button>
        </div>

        {/* Header:
            Line 1: ABOUT
            Line 2: JWY PHOTOBOOK */}
        <header className="border-b border-white/10 pb-8">
          <span className="font-light text-xs tracking-tight text-neutral-400 uppercase block mb-2">
            {config.kicker || 'ABOUT'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-white">
            {config.heading || 'JWY PHOTOBOOK'}
          </h1>
        </header>

        {/* Content Statement: Subtitles and Body Content */}
        <div className="space-y-10 sm:space-y-12 text-sm sm:text-base font-light text-neutral-300 leading-relaxed">
          {config.sections.map((sec) => (
            <section key={sec.id} className="space-y-3">
              <h2 className="text-xl font-light text-white tracking-tight">
                {sec.title}
              </h2>
              <p className="whitespace-pre-line text-neutral-400 font-light">
                {sec.content}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
