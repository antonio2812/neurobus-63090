import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Eye, Zap, Satellite, Code, Radiation, Thermometer } from "lucide-react";

const technologies = [
  {
    icon: Cpu,
    title: "Neuromorphic Processors",
    description: "Bio inspired chips for ultra-low power AI computing."
  },
  {
    icon: Eye,
    title: "Event-Driven Sensors",
    description: "Bio-inspired vision systems for real-time precision and minimal latency."
  },
  {
    icon: Thermometer,
    title: "Infrared Sensors",
    description: "Advanced thermal imaging and heat detection systems for enhanced environmental awareness."
  },
  {
    icon: Zap,
    title: "Embedded AI Hardware",
    description: "Edge computing boards engineered for the harshest environments."
  },
  {
    icon: Code,
    title: "Custom Software Stack",
    description: "Real-time OS combined with simulation and analytics platform."
  },
  {
    icon: Radiation,
    title: "Radiation-Hardened Payloads",
    description: "Space-qualified electronics designed for extended mission longevity."
  },
];

const Technology = () => {
  return (
    <section id="technology" className="py-12 relative overflow-hidden">
      {/* Static neural network background */}
      <div className="absolute inset-0 bg-gradient-section">
        <div className="absolute inset-0 opacity-30">
          {/* Static neural connections */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent rounded-full opacity-40" />
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-accent/60 rounded-full opacity-30" />
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-accent/80 rounded-full opacity-50" />
          <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-accent/40 rounded-full opacity-35" />
          <div className="absolute bottom-1/3 right-1/2 w-2 h-2 bg-accent/70 rounded-full opacity-45" />
          
          {/* Static connection lines */}
          <svg className="absolute inset-0 w-full h-full" style={{zIndex: 1}}>
            <line x1="25%" y1="25%" x2="66%" y2="33%" stroke="hsl(220 100% 60% / 0.2)" strokeWidth="1" />
            <line x1="66%" y1="33%" x2="33%" y2="75%" stroke="hsl(220 100% 60% / 0.15)" strokeWidth="1" />
            <line x1="33%" y1="75%" x2="75%" y2="66%" stroke="hsl(220 100% 60% / 0.1)" strokeWidth="1" />
            <line x1="75%" y1="66%" x2="50%" y2="66%" stroke="hsl(220 100% 60% / 0.2)" strokeWidth="1" />
          </svg>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="relative inline-block">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 relative uppercase tracking-tight">
              <span className="bg-gradient-neural bg-clip-text text-transparent">
                Technology
              </span>
              <span className="text-foreground"> Foundations</span>
            </h2>
            {/* Static tech decoration */}
            <div className="absolute inset-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {technologies.map((tech, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden bg-gradient-tech backdrop-blur-md border border-accent/20 transition-all duration-300 click-scale cursor-pointer"
            >
              {/* Static floating particles */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-4 right-4 w-1 h-1 bg-accent/60 rounded-full" />
                <div className="absolute bottom-4 left-4 w-0.5 h-0.5 bg-accent/40 rounded-full" />
                <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-accent/30 rounded-full" />
              </div>
              
              <CardHeader className="relative z-10">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center transition-all duration-300">
                    <tech.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  {/* Static icon glow effect */}
                  <div className="absolute inset-0 w-16 h-16 bg-accent/10 rounded-xl blur-xl" />
                </div>
                <CardTitle className="text-xl font-semibold transition-colors duration-300">
                  {tech.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-base leading-relaxed text-muted-foreground transition-colors duration-300">
                  {tech.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Bottom decoration */}
        <div className="flex justify-center mt-16">
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default Technology;