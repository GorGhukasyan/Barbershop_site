import { Header } from '@/components/layout/Header';
import { VisualizerContainer } from '@/components/visualizer/VisualizerContainer';

export default function VisualizerPage() {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        <VisualizerContainer />
      </main>
    </>
  );
}
