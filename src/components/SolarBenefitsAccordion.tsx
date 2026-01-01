import React, { useId, useMemo, useState } from "react";

type Benefit = {
  title: string;
  summary: string;
  details: Array<string>;
  icon: React.ReactNode;
};

function Icon({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5 text-[var(--accent)]"
    >
      {children}
    </svg>
  );
}

export default function SolarBenefitsAccordion() {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const items: Benefit[] = useMemo(
    () => [
      {
        title: "Efficiency",
        summary: "Dirty panels can reduce production and raise your effective cost per kWh.",
        details: [
          "Example loss: 10% on ~9,000 kWh/year is ~900 kWh/year.",
          "At $0.14/kWh, that’s ~$126/year; at 20% it’s ~$252/year.",
          "That lost production repeats every year until cleaned (rates vary by utility and usage).",
        ],
        icon: (
          <Icon>
            <path d="M12 3a9 9 0 1 0 9 9" />
            <path d="M12 12l6-6" />
            <path d="M12 12l-3 3" />
          </Icon>
        ),
      },
      {
        title: "Longevity",
        summary: "Buildup can trap moisture and heat, accelerating wear and avoidable service calls.",
        details: [
          "A single troubleshooting trip or electrician visit commonly runs ~$150–$300+.",
          "Replacing a damaged panel can be ~$250–$500+ for the part, plus labor and time.",
          "Protecting components helps your system reach its intended 25–30 year life.",
        ],
        icon: (
          <Icon>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v6l3 2" />
          </Icon>
        ),
      },
      {
        title: "Safety",
        summary: "Debris and hotspots can increase electrical risk and roof hazards.",
        details: [
          "Electrical diagnostics or repairs can cost ~$200–$600+ depending on access and parts.",
          "A roof leak or damaged flashing repair can be ~$300–$1,500+.",
          "Regular maintenance reduces the chance of small issues turning into expensive ones.",
        ],
        icon: (
          <Icon>
            <path d="M12 3l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4z" />
            <path d="M12 8v5" />
            <path d="M12 16h.01" />
          </Icon>
        ),
      },
      {
        title: "Cost Savings",
        summary: "Higher output lowers utility costs and helps you hit ROI sooner.",
        details: [
          "If you’re losing ~$150–$300/year in production, that’s ~$750–$1,500 over 5 years.",
          "Cleaning often costs less than one year of avoidable production loss (home size varies).",
          "Keeping output high improves payback and protects your investment.",
        ],
        icon: (
          <Icon>
            <path d="M12 2v20" />
            <path d="M17 7H10a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6H7" />
          </Icon>
        ),
      },
      {
        title: "Damage Prevention",
        summary: "Mineral deposits and droppings can etch glass and create permanent performance loss.",
        details: [
          "Etching can’t always be restored with cleaning—replacement is sometimes the only fix.",
          "Even one panel replacement can total ~$400–$900+ installed depending on access.",
          "Regular washes prevent buildup from becoming irreversible damage.",
        ],
        icon: (
          <Icon>
            <path d="M12 3l10 18H2L12 3z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </Icon>
        ),
      },
    ],
    [],
  );

  return (
    <section id="why-solar-maintenance" className="bg-neutral-900 text-white py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold">Why Solar Maintenance Is Important</h2>
        <p className="text-slate-300 mt-3">
          Tap to explore how professional solar maintenance protects your system and your investment.
        </p>

        <div className="mt-10 space-y-4 max-w-3xl">
          {items.map((item, index) => {
            const open = openIndex === index;
            const panelId = `${baseId}-panel-${index}`;
            const buttonId = `${baseId}-btn-${index}`;

            return (
              <div
                key={item.title}
                className={`glass rounded-2xl border border-white/10 bg-white/5 overflow-hidden ${
                  open ? "border-[rgba(14,91,58,0.55)]" : ""
                }`}
              >
                <button
                  id={buttonId}
                  type="button"
                  className="w-full px-5 py-5 sm:px-6 sm:py-6 flex items-start gap-4 text-left"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex((prev) => (prev === index ? null : index))}
                >
                  <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/20">
                    {item.icon}
                  </span>
                  <span className="flex-1">
                    <span className="block text-lg font-semibold">{item.title}</span>
                    <span className="block mt-2 text-slate-200">{item.summary}</span>
                  </span>
                  <span
                    className={`mt-1 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-white/90"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden px-5 pb-5 sm:px-6 sm:pb-6">
                    <ul className="mt-3 space-y-2 text-slate-200 list-disc pl-5">
                      {item.details.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-slate-400">
                      Estimates shown are examples; actual production and costs depend on system size, shading, local rates, and condition.
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

