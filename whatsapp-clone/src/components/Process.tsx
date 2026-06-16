const steps = [
  "Schedule",
  "Pickup",
  "Clean",
  "Deliver",
];

export default function Process() {
  return (
    <section id="Process" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-center text-4xl font-bold">
          How It Works
        </h2>

        <div className="grid md:grid-cols-4 gap-8 mt-16">
          {steps.map((step, index) => (
            <div key={step} className="text-center">
              <div className="w-24 h-24 rounded-full bg-cyan-400 text-black mx-auto flex items-center justify-center text-2xl font-bold">
                {index + 1}
              </div>
              <h3 className="mt-4 font-semibold text-xl">{step}</h3>
            </div>
          ))}
        </div>
      </section>

  );
}