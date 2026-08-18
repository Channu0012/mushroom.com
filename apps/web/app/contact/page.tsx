import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0d160f]">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Get in Touch</h1>
          <p className="text-gray-400 text-sm">Have questions about grower onboarding, wholesale orders, or platform support?</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass rounded-2xl border border-white/10 p-8 space-y-6">
            <h2 className="text-lg font-bold text-white">Contact Information</h2>

            <div className="space-y-4 text-xs text-gray-300">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center">
                  <Mail size={16} />
                </div>
                <div>
                  <span className="text-gray-500 block">Support Email</span>
                  <span>support@mushroommarket.in</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="text-gray-500 block">Toll-Free Helpline</span>
                  <span>+91 1800-420-FUNGI (3864)</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center">
                  <MapPin size={16} />
                </div>
                <div>
                  <span className="text-gray-500 block">Headquarters</span>
                  <span>Hesaraghatta Bio-Agri Zone, Bangalore 560089</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl border border-white/10 p-8">
            <h2 className="text-lg font-bold text-white mb-4">Send Us a Message</h2>
            <form className="space-y-4">
              <input type="text" placeholder="Your Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-xs focus:outline-none focus:border-green-500/50" />
              <input type="email" placeholder="Your Email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 text-xs focus:outline-none focus:border-green-500/50" />
              <textarea rows={3} placeholder="How can we help you?" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-600 text-xs focus:outline-none focus:border-green-500/50" />
              <button type="button" className="w-full py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl text-xs glow-green">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
