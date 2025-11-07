import { ChevronLeftIcon } from "@heroicons/react/24/outline"; // Trocado para ChevronLeftIcon
import Link from "next/link";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const FeatureCard = ({ title, description, icon, href }: FeatureCardProps) => {
  return (
    <Link
      href={href}
      className="group flex flex-col justify-between p-6 bg-white/5 border border-white/10 rounded-xl shadow-lg hover:bg-white/10 transition duration-300 ease-in-out transform hover:scale-[1.02] backdrop-blur-sm"
    >
      <div>
        <div className="mb-4 text-[#ffc800]">{icon}</div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
      <div className="mt-4 flex items-center justify-end">
        <ChevronLeftIcon 
          className="w-6 h-6 text-[#ffc800] transition-transform duration-300 group-hover:-translate-x-1" // Cor e animação ajustadas
        />
      </div>
    </Link>
  );
};

export default FeatureCard;