import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Rocket, Handshake, DollarSign } from "lucide-react";

const traction = [
  {
    icon: Trophy,
    title: "1st Place Winner",
    description: "European Defense Tech Hackathon — recognized for breakthrough innovation in drone detection."
  },
  {
    icon: Rocket,
    title: "Elite Programs",
    description: "Creative Destruction Lab, Agoranov, HEC Incubator, SpaceFounders, ESA Incubator,  accelerating our market entry."
  },
  {
    icon: Handshake,
    title: "Strategic Engagements",
    description: "Active partnerships with major aerospace and defense leaders across France and Europe."
  }
];

const Traction = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Success pattern background */}
      <div className="absolute inset-0 bg-gradient-section">
        {/* Trophy and achievement icons floating */}
        <div className="absolute inset-0 opacity-20">
          <Trophy className="absolute top-1/4 left-1/6 w-8 h-8 text-accent/30 animate-quantum-float" />
          <Rocket className="absolute top-1/3 right-1/4 w-6 h-6 text-accent/20 animate-quantum-float" style={{animationDelay: '2s'}} />
          <Handshake className="absolute bottom-1/3 left-1/3 w-7 h-7 text-accent/25 animate-quantum-float" style={{animationDelay: '4s'}} />
          <Trophy className="absolute bottom-1/4 right-1/6 w-5 h-5 text-accent/35 animate-quantum-float" style={{animationDelay: '6s'}} />
        </div>
        
        {/* Success metrics grid */}
        <div className="absolute inset-0 opacity-5"
             style={{
               backgroundImage: 'radial-gradient(circle at 50% 50%, hsl(220 100% 60% / 0.3) 1px, transparent 1px)',
               backgroundSize: '40px 40px'
             }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="relative inline-block">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-foreground">Traction</span>
              <span className="bg-gradient-neural bg-clip-text text-transparent"> Highlights</span>
            </h2>
            {/* Achievement badge */}
            <div className="absolute -top-6 -right-8">
              <div className="w-6 h-6 bg-accent rounded-full animate-pulse">
                <div className="absolute inset-0 w-6 h-6 bg-accent rounded-full animate-ping" />
              </div>
            </div>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mt-8">
            Proven validation from industry leaders and accelerator programs driving our momentum forward.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {traction.map((item, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden bg-gradient-tech backdrop-blur-lg border border-accent/25 hover:border-accent/50 transition-all duration-700 hover:shadow-glow-accent animate-pulse-glow"
              style={{animationDelay: `${index * 0.4}s`}}
            >
              {/* Achievement ribbon */}
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className="absolute top-3 right-3 w-8 h-8 bg-accent/20 rotate-45 group-hover:bg-accent/40 transition-colors duration-300" />
                <div className="absolute top-4 right-4 w-6 h-6 bg-accent/40 rotate-45 group-hover:bg-accent/60 transition-colors duration-300" />
              </div>
              
              {/* Success metrics floating elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-4 left-4 w-1.5 h-1.5 bg-accent/50 rounded-full animate-quantum-float" />
                <div className="absolute bottom-4 right-4 w-1 h-1 bg-accent/30 rounded-full animate-quantum-float" style={{animationDelay: '3s'}} />
              </div>
              
              <CardHeader className="text-center relative z-10 pt-8">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto group-hover:shadow-glow-accent transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                    <item.icon className="h-10 w-10 text-primary-foreground group-hover:animate-pulse" />
                  </div>
                  {/* Success indicators */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent/30 rounded-full group-hover:bg-accent/60 transition-colors duration-300" />
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 border-2 border-accent/40 rounded-full group-hover:border-accent/70 transition-colors duration-300" />
                  {/* Icon glow effect */}
                  <div className="absolute inset-0 w-20 h-20 mx-auto bg-accent/10 rounded-2xl blur-xl group-hover:bg-accent/30 transition-all duration-500" />
                </div>
                <CardTitle className="text-xl font-semibold group-hover:text-accent transition-colors duration-300">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center relative z-10 pb-8">
                <CardDescription className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300">
                  {item.description}
                </CardDescription>
              </CardContent>
              
              {/* Progress indicator */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent/20 via-accent/60 to-accent/20 group-hover:from-accent/40 group-hover:via-accent/80 group-hover:to-accent/40 transition-all duration-500" />
              
              {/* Hover glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/3 via-transparent to-accent/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Card>
          ))}
        </div>
        
        {/* Success metrics visualization */}
        <div className="flex justify-center mt-16">
          <div className="flex items-center space-x-8">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-accent/20 rounded-full border-2 border-accent/40 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-accent" />
              </div>
              <div className="text-xs text-muted-foreground mt-2">Awards</div>
            </div>
            <div className="w-12 h-0.5 bg-gradient-to-r from-accent/40 to-accent/20" />
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-accent/20 rounded-full border-2 border-accent/40 flex items-center justify-center">
                <Rocket className="w-4 h-4 text-accent" />
              </div>
              <div className="text-xs text-muted-foreground mt-2">Programs</div>
            </div>
            <div className="w-12 h-0.5 bg-gradient-to-r from-accent/20 to-accent/40" />
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-accent/20 rounded-full border-2 border-accent/40 flex items-center justify-center">
                <Handshake className="w-4 h-4 text-accent" />
              </div>
              <div className="text-xs text-muted-foreground mt-2">Partnerships</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Traction;