import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, ArrowRight } from "lucide-react";

const openPositions = [
  {
    title: "Senior Neuromorphic Engineer",
    department: "R&D",
    location: "Paris, France",
    type: "Full-time",
    description: "Lead the development of bio-inspired computing architectures for autonomous systems. Design and implement event-driven neural networks for real-time decision making."
  },
  {
    title: "Embedded AI Software Engineer",
    department: "Engineering",
    location: "Paris, France",
    type: "Full-time",
    description: "Develop low-level software for neuromorphic processors and edge AI applications. Optimize algorithms for ultra-low power consumption in mission-critical environments."
  },
  {
    title: "Embedded AI Hardware Engineer",
    department: "Hardware",
    location: "Toulouse, France",
    type: "Full-time",
    description: "Design and develop neuromorphic hardware architectures for edge AI applications. Work on event-based sensor integration and ultra-low power chip design for autonomous systems."
  },
  {
    title: "Aerospace Systems Engineer",
    department: "Applications",
    location: "Paris, France",
    type: "Full-time",
    description: "Design and integrate autonomous intelligence systems for space and aerospace applications. Work on satellite constellations and unmanned aerial vehicle systems."
  }
];

const Careers = () => {
  return (
    <section id="careers" className="py-10 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter transform -skew-x-3">
            Join Our
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Team</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Help us pioneer the future of autonomous intelligence. We're looking for passionate engineers and researchers 
            to build the next generation of autonomous systems.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16 justify-items-center">
          {openPositions.map((position, index) => (
            <Card key={index} className="group hover:shadow-glow-primary/20 transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur-sm border-border/50 flex flex-col h-full">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:shadow-glow-primary transition-all duration-300">
                    <Users className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="text-xs font-mono text-accent tracking-widest">
                    {position.department}
                  </span>
                </div>
                <CardTitle className="text-xl font-light tracking-wide">{position.title}</CardTitle>
                
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {position.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {position.type}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 space-y-4">
                <CardDescription className="text-base leading-relaxed flex-1">
                  {position.description}
                </CardDescription>
                
                <Button 
                  variant="outline" 
                  className="w-full group/btn hover:bg-primary hover:text-primary-foreground transition-all duration-300 mt-auto"
                  asChild
                >
                  <a href="https://jobs.stationf.co/companies/neurobus/jobs/candidatures-spontanees" target="_blank" rel="noopener noreferrer">
                    Apply Now
                    <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <div className="max-w-4xl mx-auto bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
            <h3 className="text-2xl font-light mb-4 text-foreground">
              Don't see the right position?
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              We're always looking for exceptional talent to join our mission. Send us your CV and tell us how 
              you'd like to contribute to the future of autonomous systems.
            </p>
            <Button 
              variant="hero" 
              size="lg"
              className="group"
              asChild
            >
              <a href="https://jobs.stationf.co/companies/neurobus/jobs/candidatures-spontanees" target="_blank" rel="noopener noreferrer">
                Send Your Application
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Careers;