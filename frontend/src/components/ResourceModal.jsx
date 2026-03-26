import { X } from "lucide-react";
import { useEffect } from "react";

export function ResourceModal({
  isOpen,
  onClose,
  title,
  description,
  details,
  image,
}) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl max-w-lg w-full p-6 z-10">
        <button onClick={onClose} className="absolute top-3 right-3">
          <X />
        </button>

        <img src={image} className="w-full h-40 object-cover rounded" />

        <h2 className="text-2xl mt-4">{title}</h2>
        <p className="text-white-600 mt-2">{description}</p>

        <ul className="text-white mt-4 space-y-2">
          {details.map((d, i) => (
            <li key={i}>• {d}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}