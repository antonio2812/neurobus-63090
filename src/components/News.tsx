import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Rocket, ArrowRight, ExternalLink } from "lucide-react";

const newsItems = [
  {
    id: 1,
    category: "Award",
    title: "Neurobus Crowned Winner of INPI 2025 Pitch Contest",
    description: "Neurobus was selected as the winner of the prestigious INPI 2025 pitch contest, recognizing our innovative approach to neuromorphic computing and intellectual property strategy.",
    date: "2025-01-15",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=400&fit=crop",
    link: "https://www.inpi.fr/a-la-une/neurobus-couronne-vainqueur-du-pitch-contest-inpi-2025",
    featured: true
  },
  {
    id: 2,
    category: "Partnership", 
    title: "Neurobus: Deep Tech Startup Incubated by CDL Paris Revolutionizes Neuromorphic AI",
    description: "Featured by HEC Paris, Neurobus joins the Creative Destruction Lab program in Paris, working to revolutionize neuromorphic artificial intelligence for autonomous systems.",
    date: "2024-03-20",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop",
    link: "https://www.hec.edu/fr/institut-entrepreneuriat-innovation/actualites/neurobus-startup-deeptech-incubee-par-cdl-paris-revolutionne-l-ia-neuromorphique"
  },
  {
    id: 3,
    category: "Technology",
    title: "Deep Tech Neurobus Wants to Propel Bio-Inspired Electronics into Space",
    description: "L'Usine Nouvelle highlights Neurobus's mission to revolutionize space electronics with bio-inspired neuromorphic processors designed for autonomous space applications.",
    date: "2024-02-10",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
    link: "https://www.usinenouvelle.com/article/la-deeptech-neurobus-veut-propulser-l-electronique-bio-inspiree-dans-l-espace.N2174797"
  },
  {
    id: 4,
    category: "Award",
    title: "First Place Winner at European Defense Tech Hackathon",
    description: "Our breakthrough drone detection technology using neuromorphic computing was recognized as the top innovation at Europe's premier defense technology competition.",
    date: "2024-01-15",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop",
    link: "#"
  },
  {
    id: 5,
    category: "Company",
    title: "Neurobus Founded - Pioneering Neuromorphic AI",
    description: "Founded in April 2023, Neurobus begins its mission to revolutionize autonomous systems with bio-inspired computing technology for aerospace and defense applications.",
    date: "2023-04-15",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=400&fit=crop",
    link: "#"
  }
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Award": return Trophy;
    case "Partnership": case "Funding": return Rocket;
    case "Technology": return ExternalLink;
    case "Company": return Calendar;
    default: return Calendar;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Award": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    case "Partnership": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    case "Technology": return "bg-purple-500/20 text-purple-300 border-purple-500/30";
    case "Funding": return "bg-green-500/20 text-green-300 border-green-500/30";
    case "Company": return "bg-accent/20 text-accent border-accent/30";
    default: return "bg-accent/20 text-accent border-accent/30";
  }
};

const News = () => {
  const featuredNews = newsItems.find(item => item.featured);
  const regularNews = newsItems.filter(item => !item.featured);

  return (
    <section id="news" className="py-12 relative overflow-hidden">
      {/* Tech grid background */}
      <div className="absolute inset-0 bg-gradient-section">
        <div className="absolute inset-0 opacity-10"
             style={{
               backgroundImage: 'linear-gradient(hsl(220 100% 60% / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(220 100% 60% / 0.1) 1px, transparent 1px)',
               backgroundSize: '40px 40px'
             }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <h2 className="text-4xl md:text-6xl font-medium mb-6 tracking-wider">
              <span className="text-foreground">Latest</span>
              <span className="bg-gradient-neural bg-clip-text text-transparent"> News</span>
            </h2>
            {/* News indicator */}
            <div className="absolute -top-4 -right-8 w-3 h-3 bg-accent rounded-full animate-pulse">
              <div className="absolute inset-0 w-3 h-3 bg-accent rounded-full animate-ping" />
            </div>
          </div>
        </div>

        {/* Featured News */}
        {featuredNews && (
          <div className="mb-12">
            <Badge className="mb-4 bg-accent/20 text-accent border-accent/30 px-3 py-1">
              Featured Story
            </Badge>
            <Card className="group relative overflow-hidden bg-gradient-tech backdrop-blur-lg border border-accent/30 transition-all duration-300 click-scale cursor-pointer">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative overflow-hidden">
                  <img 
                    src={featuredNews.image} 
                    alt={featuredNews.title}
                    className="w-full h-48 md:h-full object-cover transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="p-6 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className={`${getCategoryColor(featuredNews.category)} px-2 py-1 text-xs`}>
                      {React.createElement(getCategoryIcon(featuredNews.category), { className: "h-3 w-3 mr-1" })}
                      {featuredNews.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(featuredNews.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <CardTitle className="text-xl mb-3 transition-colors duration-300">
                    {featuredNews.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed mb-4 text-muted-foreground transition-colors duration-300">
                    {featuredNews.description}
                  </CardDescription>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-fit bg-transparent border-accent/30 hover:bg-accent/10 transition-all duration-300"
                    asChild
                  >
                    <a href={featuredNews.link}>
                      Read More
                      <ArrowRight className="h-3 w-3 ml-2 transition-transform" />
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Regular News Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {regularNews.map((item, index) => (
            <Card 
              key={item.id}
              className="group relative overflow-hidden bg-gradient-tech backdrop-blur-md border border-accent/20 transition-all duration-300 click-scale cursor-pointer"
            >
              {/* News image */}
              <div className="relative overflow-hidden h-40">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <Badge className={`absolute top-3 left-3 ${getCategoryColor(item.category)} px-2 py-1 text-xs`}>
                  {React.createElement(getCategoryIcon(item.category), { className: "h-3 w-3 mr-1" })}
                  {item.category}
                </Badge>
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-center text-xs text-muted-foreground mb-2">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(item.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <CardTitle className="text-lg leading-tight transition-colors duration-300">
                  {item.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-0 pb-4">
                <CardDescription className="text-xs leading-relaxed text-muted-foreground transition-colors duration-300 mb-3">
                  {item.description}
                </CardDescription>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="p-0 h-auto text-accent hover:text-accent/80 font-medium text-xs"
                  asChild
                >
                  <a href={item.link} className="flex items-center">
                    Read More
                    <ArrowRight className="h-3 w-3 ml-1 transition-transform" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* News archive link */}
        <div className="text-center mt-10">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-gradient-tech border-accent/30 hover:bg-accent/10 transition-all duration-300"
            asChild
          >
            <a href="#" className="flex items-center">
              View All News
              <ExternalLink className="h-3 w-3 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default News;