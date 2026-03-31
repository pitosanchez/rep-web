import REPWireframe from '@/components/REPWireframe';

export const metadata = {
  title: 'Where We Live',
  description: 'Mapping how structural inequality shapes kidney disease outcomes. Connecting genetics, geography, and patient stories in the Bronx.',
  openGraph: {
    title: 'Where We Live',
    description: 'Where You Live Shapes Kidney Disease',
    type: 'website',
  },
};

export default function Home() {
  return <REPWireframe />;
}
