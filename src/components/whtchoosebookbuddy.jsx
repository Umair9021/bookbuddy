export default function WhyChooseBookBuddy() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-slate-800 mb-4">
          Why Choose BookBuddy?
        </h2>
        <p className="text-lg text-slate-500 max-w-xl mx-auto">
          We make buying and selling student books simple, safe, and affordable
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-white p-8 rounded-2xl shadow-lg border border-indigo-100 hover:-translate-y-2 hover:shadow-2xl transition-all"
          >
            <div className="w-15 h-15 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-2xl mb-6">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">
              {feature.title}
            </h3>
            <p className="text-slate-500 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const features = [
  {
    icon: "💰",
    title: "Best Prices",
    description:
      "Get the best deals on textbooks from fellow students. Save up to 80% compared to retail prices.",
  },
  {
    icon: "📚",
    title: "Vast Selection",
    description:
      "Browse thousands of textbooks across all subjects and academic levels.",
  },
  {
    icon: "🚀",
    title: "Quick & Easy",
    description:
      "List your books in minutes or find what you need with our smart search feature.",
  },
  {
    icon: "🎓",
    title: "Student-Focused",
    description:
      "Built by students, for students. We understand your academic needs and budget.",
  },
  {
    icon: "💬",
    title: "Direct Communication",
    description:
      "Chat directly with sellers and buyers through our messaging system.",
  },
];
