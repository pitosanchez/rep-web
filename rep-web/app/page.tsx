import REPWireframe from '@/components/REPWireframe';

export const metadata = {
  title: 'Where We Live — REP',
  description: 'Mapping how structural inequality shapes kidney disease outcomes. Connecting genetics, geography, and patient stories in the Bronx.',
  openGraph: {
    title: 'Where We Live — REP',
    description: 'Where You Live Shapes Kidney Disease',
    type: 'website',
  },
};

export default function Home() {
  return <REPWireframe />;
}
