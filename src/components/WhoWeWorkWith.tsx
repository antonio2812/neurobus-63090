import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Satellite, Shield } from "lucide-react";

const clients = [
  {
    icon: Building2,
    title: "Aerospace Primes",
    description: "Satellite manufacturers, UAV integrators, and autonomous system developers."
  },
  {
    icon: Users,
    title: "Dual-Use Innovators",
    description: "Security providers, surveillance companies, and drone technology developers."
  },
  {
    icon: Satellite,
    title: "Space Operators",
    description: "Space situational awareness, traffic management, and collision avoidance."
  },
  {
    icon: Shield,
    title: "Defense Agencies",
    description: "Border protection, military R&D, and autonomous threat detection systems."
  }
];

const partners = [
  { name: "Agoranov", logo: "/lovable-uploads/3addb50f-cc6c-4cb8-942f-f0426cc64aaa.png" },
  { name: "Creative Destruction Lab", logo: "/lovable-uploads/187873d1-ce88-4f87-9b31-7e7efa53a256.png" },
  { name: "Airbus Defence & Space", logo: "/lovable-uploads/625e5133-13dc-465a-9734-f87e8f32ad5d.png" },
  { name: "ESA", logo: "/lovable-uploads/35482f37-d53f-4bcf-a20d-42899fc9aa71.png" },
  { name: "CNES", logo: "/lovable-uploads/e91b9c3b-becc-4d17-8944-9228d29e4b8e.png" },
  { name: "GIFAS", logo: "/lovable-uploads/c9e95354-5cf9-4a71-8fee-5426c0c09230.png" },
  { name: "CEA", logo: "/lovable-uploads/25a47d94-2fb2-45bd-b68e-ad2a6650b5f6.png" },
  { name: "ONERA", logo: "/lovable-uploads/47d0e0ff-f913-48db-9650-825266cdfd92.png" },
  { name: "HEC Paris", logo: "/lovable-uploads/058d4d0a-5a7c-4a17-90f0-895cd6972ee8.png" },
  { name: "Inria", logo: "/lovable-uploads/311cee82-f0a1-4aa9-af36-8e1b14522149.png" },
  { name: "Aerospace Valley", logo: "/lovable-uploads/b54c5493-06ee-4e92-b3be-76dfa7e2ccd0.png" },
  { name: "BPI France", logo: "/lovable-uploads/d665499f-a81b-45c4-9cbb-0efd25a875f2.png" },
  { name: "SpaceFounders", logo: "/lovable-uploads/2278a936-e7f8-425e-98d8-59a157d102f4.png" }
];

const WhoWeWorkWith = () => {
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        {/* Moving Partner Logos */}
        <div className="overflow-hidden">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-muted-foreground">Trusted Partners</h3>
          </div>
          <div className="relative">
            <div className="flex animate-scroll space-x-16 items-center">
              {/* First set of logos */}
              {partners.map((partner, index) => (
                <div key={`first-${index}`} className={`flex-shrink-0 ${partner.name === "Airbus Defence & Space" ? "w-56 h-28" : "w-40 h-20"} flex items-center justify-center`}>
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain opacity-90 hover:opacity-100 transition-all duration-300 brightness-110"
                  />
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {partners.map((partner, index) => (
                <div key={`second-${index}`} className={`flex-shrink-0 ${partner.name === "Airbus Defence & Space" ? "w-56 h-28" : "w-40 h-20"} flex items-center justify-center`}>
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain opacity-90 hover:opacity-100 transition-all duration-300 brightness-110"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeWorkWith;