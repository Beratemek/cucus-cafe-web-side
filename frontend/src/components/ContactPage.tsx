import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

export function ContactPage() {
  const [name, setName] = useState('');

  // Sayfa yüklendiğinde scroll'u en üste al
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mesajınız gönderildi!\n\nAd: ' + name);
    setName('');
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-stone-50">
      {/* Hero */}
      <div className="bg-white py-16 sm:py-20 border-b border-[#E6D3BA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-sm text-[#8B5E3C] tracking-widest uppercase mb-4 block">Location</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl text-[#2D1B12] mb-4 tracking-tight">Konum</h1>
          <p className="text-lg text-[#8B5E3C] max-w-2xl mx-auto">
            Sizleri bekliyoruz...
          </p>
        </div>
      </div>


        {/* Map */}
<div className="max-w-lg mx-auto px-4 my-16">
  <div className="bg-white border border-[#E6D3BA] overflow-hidden rounded-3xl shadow-sm">
    <div className="w-full h-[300px] sm:h-[400px] lg:h-[450px]">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1309.24868202919!2d35.54213038572415!3d38.69632133981682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x152b1368dcb888eb%3A0x5a3a24886040dcf0!2sCucus%20Coffee%20%26%20Cake!5e0!3m2!1str!2str!4v1764744724016!5m2!1str!2str"
        className="w-full h-full"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="CuCu's Coffee & Cake Lokasyonu"
      />
    </div>
  </div>
</div>




      </div>
  ) 
}
