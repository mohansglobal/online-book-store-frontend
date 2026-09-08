import { publishers } from "../data";

export function Publishers() {
  const marqueePublishers = [...publishers, ...publishers];

  return (
    <section
      id="publishers"
      className="overflow-hidden border-y border-border bg-card py-11 md:py-[60px]"
    >
      <div className="mx-auto w-[min(1320px,calc(100%-36px))] md:w-[min(1320px,calc(100%-72px))]">
        <div className="flex w-max gap-[45px] animate-[marquee_28s_linear_infinite]">
          {marqueePublishers.map((publisher, index) => (
            <span
              key={`${publisher}-${index}`}
              className="flex items-center gap-[45px] font-display text-[23px] text-muted-foreground md:text-[27px]"
            >
              {publisher}

              <span
                aria-hidden="true"
                className="text-[10px] text-primary"
              >
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}