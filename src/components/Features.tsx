import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Radio, Zap, Cpu, Satellite, Layers, Plane, Radar, Antenna, ArrowRight } from "lucide-react";

const autonomousIntelligence = [
  {
    icon: Antenna,
    industry: "GROUND STATION",
    title: "Ground Station for Drone Detection",
    capabilities: [
      "Real-time drone detection and tracking across wide areas",
      "Automated threat assessment and classification",
      "Multi-sensor fusion for enhanced detection accuracy",
      "Autonomous response coordination with defense systems"
    ],
    description: "Advanced ground-based detection systems that autonomously monitor airspace, identify unauthorized drones, and coordinate appropriate responses without human intervention."
  },
  {
    icon: Radar,
    industry: "DRONES",
    title: "Autonomous Drone Intelligence",
    capabilities: [
      "Real-time obstacle avoidance with neuromorphic vision",
      "Adaptive flight path planning in dynamic environments", 
      "Swarm coordination without human intervention",
      "Bio-inspired sensor fusion for 360° awareness"
    ],
    description: "Neuromorphic technology enable drones to make split-second decisions, mimicking biological neural networks for unprecedented autonomous flight capabilities."
  },
  {
    icon: Satellite,
    industry: "AEROSPACE",
    title: "Space-based surveillance", 
    capabilities: [
      "Self-orbiting satellite constellations",
      "Autonomous debris avoidance maneuvers",
      "Deep space navigation without ground control",
      "Adaptive mission execution in radiation environments"
    ],
    description: "Space-grade neuromorphic systems enable spacecraft to operate independently for years, making critical decisions without Earth communication delays."
  },
  {
    icon: Shield,
    industry: "DEFENSE",
    title: "Autonomous Defense Intelligence",
    capabilities: [
      "Self-directed tactical reconnaissance missions",
      "Adaptive threat detection and response",
      "Autonomous perimeter monitoring systems",
      "Real-time battlefield intelligence processing"
    ],
    description: "Military-grade neuromorphic systems provide autonomous decision-making capabilities for critical defense operations in contested environments."
  }
];

const Solutions = () => {
  return (
    <section id="solutions" className="py-10 bg-background">
      <div className="container mx-auto px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-light mb-6 italic">
            <span className="bg-gradient-primary bg-clip-text text-transparent">PRODUCTS</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto justify-items-center">
          {autonomousIntelligence.map((solution, index) => (
            <Card key={index} className="group hover:shadow-glow-primary/20 transition-all duration-300 hover:scale-105 bg-card/30 backdrop-blur-sm border-border/50 flex flex-col h-full">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:shadow-glow-primary transition-all duration-300">
                    <solution.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <span className="text-xs font-mono text-accent tracking-widest">
                    {solution.industry}
                  </span>
                </div>
                <CardTitle className="text-xl font-light tracking-wide">{solution.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow flex flex-col">
                <CardDescription className="text-base leading-relaxed">
                  {solution.description}
                </CardDescription>
                
                <div className="space-y-2 flex-grow">
                  <h4 className="text-sm font-semibold text-foreground/80 mb-3">Key Capabilities:</h4>
                  <ul className="space-y-2">
                    {solution.capabilities.map((capability, capIndex) => (
                      <li key={capIndex} className="flex items-start text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 mr-3 flex-shrink-0" />
                        {capability}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-3 mt-4">
                  <Button 
                    variant="ghost" 
                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors text-center"
                    asChild
                  >
                    <a href="mailto:nicolas@neurobus.ai">Ask for Specs</a>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full group/btn hover:bg-primary hover:text-primary-foreground transition-all duration-300 justify-center"
                    asChild
                  >
                    <a href="mailto:florian@neurobus.ai">
                      Order Now
                      <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solutions;