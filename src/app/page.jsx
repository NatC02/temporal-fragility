import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('./components/canvas/Scene'), {
  loading: () => (
    <p className="flex items-center justify-center h-screen">L O A D I N G</p>
  ),
  ssr: false,
});

export default function Home() {
  return (
    <main>
      <Scene />
    </main>
  );
}
