import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';

export default function GrievancePage() {
  return (
    <main className="min-h-screen bg-[#0d160f]">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-12">
        <h1 className="text-3xl font-bold text-white mb-4">Grievance Redressal Officer</h1>
        <p className="text-gray-400 text-xs mb-8">Information Technology (Intermediary Guidelines) Rules, 2021</p>

        <div className="glass rounded-3xl border border-white/10 p-8 space-y-4 text-xs text-gray-300">
          <p><strong className="text-white">Name:</strong> Officer Rajesh V.</p>
          <p><strong className="text-white">Designation:</strong> Chief Nodal & Grievance Officer</p>
          <p><strong className="text-white">Email:</strong> grievance@mushroommarket.in</p>
          <p><strong className="text-white">Address:</strong> MushroomMarketplace Tech Pvt Ltd, Bio-Agri Hub, Bangalore North, 560089</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
