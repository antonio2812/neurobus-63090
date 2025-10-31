import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Brain, Briefcase, Linkedin, ExternalLink } from "lucide-react";

const team = [
  {
    icon: Briefcase,
    name: "Florian Corgnou",
    role: "CEO",
    description: "Repeat tech founder, ex-Tesla with HEC Paris background. Expert in strategy, finance, and scaling technology companies in competitive markets.",
    linkedin: "https://www.linkedin.com/in/fcorgnou/"
  },
  {
    icon: Brain,
    name: "Dr. Nicolas Bourdis",
    role: "CTO", 
    description: "PhD, embedded systems & neuromorphic expert with deep aerospace AI expertise. Leading the technical vision and product development.",
    linkedin: "https://www.linkedin.com/in/nicolas-bourdis-1315a019/"
  }
];

const Team = () => {
  return (
    <section id="team" className="py-12 relative overflow-hidden">
      {/* Static hexagonal pattern background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/5 to-background">
        <div className="absolute inset-0 opacity-10"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.1'%3E%3Cpath d='M30 30l15-15v30l-15-15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
               backgroundSize: '60px 60px'
             }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="relative inline-block">
            <h2 className="text-4xl md:text-6xl font-thin mb-6 tracking-widest">
              <span className="text-foreground">Founding</span>
              <span className="bg-gradient-neural bg-clip-text text-transparent"> Team</span>
            </h2>
            {/* Static leadership visual elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 border-2 border-accent/30 rotate-45" />
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-accent/20 rotate-12" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-8">
            Visionary leaders combining deep technical expertise with proven business acumen
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {team.map((member, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden bg-gradient-to-br from-card/80 via-card/60 to-card/80 backdrop-blur-xl border border-accent/30 transition-all duration-300 click-scale cursor-pointer"
            >
              {/* Static profile card header effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-accent/60 to-accent" />
              
              {/* Static avatar decorations */}
              <div className="absolute top-6 right-6 w-3 h-3 border border-accent/40 rounded-full" />
              <div className="absolute bottom-6 left-6 w-2 h-2 bg-accent/30 rounded-full" />
              
              <CardHeader className="text-center relative z-10 pt-8">
                <div className="relative mb-6">
                  <div className="w-28 h-28 bg-gradient-primary rounded-full flex items-center justify-center mx-auto transition-all duration-300">
                    <member.icon className="h-14 w-14 text-primary-foreground" />
                  </div>
                  {/* Static avatar glow rings */}
                  <div className="absolute inset-0 w-28 h-28 mx-auto border-2 border-accent/20 rounded-full" />
                  <div className="absolute inset-0 w-32 h-32 mx-auto border border-accent/10 rounded-full" />
                  {/* Static avatar reflection */}
                  <div className="absolute inset-0 w-28 h-28 mx-auto bg-accent/10 rounded-full blur-xl" />
                </div>
                <CardTitle className="text-2xl font-semibold transition-colors duration-300">
                  {member.name}
                </CardTitle>
                <div className="text-accent font-bold text-xl bg-accent/10 rounded-lg px-4 py-2 inline-block">
                  {member.role}
                </div>
              </CardHeader>
              <CardContent className="text-center relative z-10 pb-8 space-y-6">
                <CardDescription className="text-base leading-relaxed text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300">
                  {member.description}
                </CardDescription>
                
                {/* LinkedIn Button */}
                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="group/btn bg-gradient-tech border-accent/30 hover:border-accent/60 hover:bg-accent/10 transition-all duration-300"
                    asChild
                  >
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Linkedin className="h-4 w-4 text-accent group-hover/btn:scale-110 transition-transform duration-300" />
                      <span className="text-sm font-medium">LinkedIn</span>
                      <ExternalLink className="h-3 w-3 opacity-60 group-hover/btn:opacity-100 transition-opacity duration-300" />
                    </a>
                  </Button>
                </div>
              </CardContent>
              
              {/* Expertise indicators */}
              <div className="absolute bottom-0 left-0 w-full h-1">
                <div className="w-full h-full bg-gradient-to-r from-accent/20 via-accent/40 to-accent/20 group-hover:from-accent/40 group-hover:via-accent/60 group-hover:to-accent/40 transition-all duration-500" />
              </div>
            </Card>
          ))}
        </div>
        
        {/* Team synergy visualization */}
        <div className="flex justify-center mt-16">
          <div className="flex items-center space-x-4">
            <div className="w-4 h-4 bg-accent rounded-full animate-pulse" />
            <div className="w-16 h-0.5 bg-gradient-to-r from-accent to-accent/40" />
            <div className="w-6 h-6 border-2 border-accent rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-accent rounded-full" />
            </div>
            <div className="w-16 h-0.5 bg-gradient-to-r from-accent/40 to-accent" />
            <div className="w-4 h-4 bg-accent rounded-full animate-pulse" style={{animationDelay: '1s'}} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;