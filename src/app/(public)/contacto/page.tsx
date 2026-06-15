import { Mail, Phone, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contacto/ContactForm";

export default function ContactoPage() {
  return (
    <div className="container mx-auto px-4 py-32">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-outfit uppercase tracking-widest text-white mb-4">
          Ponte en <span className="text-accent">Contacto</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">¿Tienes una historia que contar o quieres colaborar? Escríbenos.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
        <div className="flex-1 glass p-8 md:p-12 rounded-3xl">
          <ContactForm />
        </div>

        <div className="lg:w-1/3 flex flex-col gap-8 justify-center">
          <div className="glass p-8 rounded-3xl flex items-start gap-4 hover:border-primary/50 transition-colors">
            <div className="bg-primary/20 p-3 rounded-full text-primary"><Mail /></div>
            <div>
              <h4 className="text-white font-bold mb-1">Correo Electrónico</h4>
              <p className="text-gray-400 text-sm">hola@detrasdelespejo.com</p>
            </div>
          </div>
          <div className="glass p-8 rounded-3xl flex items-start gap-4 hover:border-secondary/50 transition-colors">
            <div className="bg-secondary/20 p-3 rounded-full text-secondary"><Phone /></div>
            <div>
              <h4 className="text-white font-bold mb-1">Teléfono</h4>
              <p className="text-gray-400 text-sm">+34 900 123 456</p>
            </div>
          </div>
          <div className="glass p-8 rounded-3xl flex items-start gap-4 hover:border-accent/50 transition-colors">
            <div className="bg-accent/20 p-3 rounded-full text-accent"><MapPin /></div>
            <div>
              <h4 className="text-white font-bold mb-1">Estudio</h4>
              <p className="text-gray-400 text-sm">Madrid, España</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
