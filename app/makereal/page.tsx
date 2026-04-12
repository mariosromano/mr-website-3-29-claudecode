import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MakeReal — RibMaker — M|R Walls',
  description: 'Design custom rib panels in your browser. CNC-ready output.',
};

export default function MakeRealPage() {
  return (
    <div
      style={{
        // Fill the viewport below the fixed nav (nav ≈ 73px tall on desktop, 65px on mobile)
        height: 'calc(100vh - 73px)',
        marginTop: 73,
        width: '100%',
        background: '#0a0a0a',
      }}
    >
      <iframe
        src="https://ribmaker-app.vercel.app/"
        title="RibMaker"
        style={{
          width: '100%',
          height: '100%',
          border: 0,
          display: 'block',
        }}
        allow="fullscreen; clipboard-write; clipboard-read"
        loading="eager"
      />
    </div>
  );
}
