import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Zap, Shield, Target } from "lucide-react";

const values = [
  {
    icon: Brain,
    title: "Neuromorphic Intelligence",
    description: "We harness the power of bio-inspired computing to create truly intelligent autonomous systems that think, learn, and adapt like biological neural networks."
  },
  {
    icon: Zap,
    title: "Real-Time Performance",
    description: "Our event-driven architectures enable split-second decision-making in critical environments where milliseconds matter for mission success."
  },
  {
    icon: Shield,
    title: "Mission-Critical Reliability",
    description: "Built for the most demanding environments from space to earth logistics constraints our systems deliver unwavering performance when failure is not an option."
  },
  {
    icon: Target,
    title: "Autonomous by Design",
    description: "We reduce human dependency by creating autonomous systems that operate more independently, making intelligent decisions without external control."
  }
];

const AboutUs = () => {
  return (
    <section id="about" className="py-12 relative overflow-hidden">
      {/* Static background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background">
        {/* Static code-like elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 text-accent/40 font-mono text-xs">01001010</div>
          <div className="absolute top-20 right-20 text-accent/30 font-mono text-xs">11010110</div>
          <div className="absolute bottom-20 left-20 text-accent/25 font-mono text-xs">10110001</div>
          <div className="absolute bottom-10 right-10 text-accent/35 font-mono text-xs">01110100</div>
          <div className="absolute top-1/2 left-1/4 text-accent/20 font-mono text-xs">11001011</div>
          <div className="absolute top-1/3 right-1/3 text-accent/30 font-mono text-xs">01010101</div>
        </div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10" 
             style={{
               backgroundImage: 'linear-gradient(hsl(220 100% 60% / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(220 100% 60% / 0.1) 1px, transparent 1px)',
               backgroundSize: '50px 50px'
             }} />
      </div>
      
      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="relative inline-block">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 relative tracking-wide">
                <span className="text-foreground">ABOUT</span>
                <span className="bg-gradient-neural bg-clip-text text-transparent"> NEUROBUS</span>
              </h2>
              {/* Static underline effect */}
              <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent" />
            </div>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mt-8">
              Founded in April 2023, Neurobus is pioneering the future of autonomous intelligence through neuromorphic computing. 
              Our bio-inspired AI systems enable machines to operate with the adaptability and efficiency of biological neural networks, 
              delivering breakthrough performance in mission-critical applications.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 mb-16 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <Card 
                key={index} 
                className="group relative overflow-hidden bg-gradient-to-br from-card/60 via-card/40 to-card/60 backdrop-blur-lg border border-accent/20 transition-all duration-300 click-scale cursor-pointer"
              >
                {/* Static scan line effect */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
                
                {/* Static floating elements inside card */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-6 right-6 w-2 h-2 border border-accent/40 rounded-full" />
                  <div className="absolute bottom-6 left-6 w-1 h-1 bg-accent/30 rounded-full" />
                </div>
                
                <CardHeader className="relative z-10">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center transition-all duration-300">
                      <value.icon className="h-10 w-10 text-primary-foreground" />
                    </div>
                    {/* Static icon reflection */}
                    <div className="absolute inset-0 w-20 h-20 bg-accent/10 rounded-2xl blur-xl" />
                  </div>
                  <CardTitle className="text-2xl font-light tracking-wide transition-colors duration-300">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-base leading-relaxed text-muted-foreground transition-colors duration-300">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Bottom section with mission statement */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="relative">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-accent to-transparent mb-8" />
              <blockquote className="text-lg italic text-muted-foreground leading-relaxed">
                "We believe that the future of autonomous systems lies in mimicking the remarkable efficiency and adaptability of biological intelligence."
              </blockquote>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-accent to-transparent mt-8" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;