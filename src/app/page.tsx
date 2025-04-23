// app/page.tsx
import EfficiencyCalculator from '../components/EfficiencyCalculator';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Calculadora de Eficiência Jurídica</h1>
      <EfficiencyCalculator />
    </main>
  );
}
