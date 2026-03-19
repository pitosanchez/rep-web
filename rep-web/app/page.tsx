import REPWireframe from '@/components/REPWireframe';

export const metadata = {
  title: 'REP — Rare Renal Equity Project',
  description: 'Mapping how where you live shapes kidney disease outcomes. A public accountability platform connecting genetics, neighborhood conditions, and patient stories.',
  openGraph: {
    title: 'REP — Rare Renal Equity Project',
    description: 'Where You Live Shapes Kidney Disease',
    type: 'website',
  },
};

export default function Home() {
  return <REPWireframe />;
}
