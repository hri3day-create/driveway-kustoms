const questions = [
  {
    question: "How does doorstep detailing work?",
    answer: "Choose your vehicle and services, request a preferred slot, and our team will confirm the appointment and service requirements with you.",
  },
  {
    question: "Do I need to pay while booking?",
    answer: "No. Your website booking is a reservation request. Our team will call or message you to confirm the work and final details.",
  },
  {
    question: "Can I combine detailing and modifications?",
    answer: "Yes. You can select services from multiple categories in one package, and we will coordinate the right schedule for the complete job.",
  },
  {
    question: "Will the listed price be my final price?",
    answer: "Fixed-price items appear in your live total. Vehicle-specific modifications may require a final quote after we confirm compatibility and your preferred parts.",
  },
];

export default function FAQ() {
  return (
    <section className="px-4 py-16 text-white sm:px-6 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-400">Before you book</p>
          <h2 className="mt-3 max-w-[11ch] text-[2.25rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
            The essentials, answered.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-zinc-400">
            Still deciding? Send us your car details and we will help shape the right package.
          </p>
        </div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {questions.map((item, index) => (
            <details key={item.question} className="group py-5 sm:py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-white sm:text-lg">
                <span className="flex items-start gap-3 sm:gap-4">
                  <span className="text-xs font-semibold text-red-400 sm:pt-1">0{index + 1}</span>
                  {item.question}
                </span>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 text-lg font-light text-zinc-400 transition group-open:rotate-45 group-open:border-red-500/40 group-open:text-red-400">+</span>
              </summary>
              <p className="ml-8 mt-4 max-w-2xl pr-10 text-sm leading-7 text-zinc-400 sm:ml-10 sm:text-base">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
