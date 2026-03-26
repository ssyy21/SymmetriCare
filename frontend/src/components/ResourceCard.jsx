import { ArrowRight } from "lucide-react";

export function ResourceCard({
  title,
  description,
  category,
  level,
  duration,
  image,
  onLearnMore,
}) {
  return (
    <div className="group bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl shadow-md hover:shadow-xl transition hover:scale-[1.02] overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition"
        />
      </div>

      <div className="p-6">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
          {category}
        </span>

        <h3 className="text-white text-xl mt-2">{title}</h3>
        <p className="text-white bg-white/5 border border-white/10 backdrop-blur-xl text-gray-600 text-sm mt-2">{description}</p>

        <div className="flex gap-2 mt-3 text-sm">
          <span className="bg-white/5 border border-white/10 backdrop-blur-xl px-2 py-1 rounded">{level}</span>
          <span className="bg-white/5 border border-white/10 backdrop-blur-xl px-2 py-1 rounded">{duration}</span>
        </div>

        <button
          onClick={onLearnMore}
          className="mt-4 flex items-center gap-2 text-blue-600"
        >
          Learn More
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}