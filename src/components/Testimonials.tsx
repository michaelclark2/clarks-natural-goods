import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "./ui/carousel";

const testimonials = [
  {
    name: "Dan W.",
    state: "NC",
    body: "It's like I'm in a Hallmark Christmas movie where I broke down in a sleepy little town with a Bed & Breakfast that makes their own soap. 🙂",
  },
  {
    name: "Hunter G.",
    state: "TX",
    body: "Everything arrived in perfect condition. I really love the formula you use and it smells so freaking good!!  I will definitely be ordering it again. ❤️❤️",
  },
  { name: "Michael C.", state: "TN", body: "It smells good" },
];

export default function Testimonials() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  return (
    <Carousel setApi={setApi} opts={{ loop: true }} className="max-w-[100%]">
      <CarouselContent>
        {testimonials.map(
          (t: { name: string; state: string; body: string }, index: number) => (
            <CarouselItem key={index} className="">
              <div className="rounded border border-[#272b22] p-8 m-2">
                <div className="mb-8">
                  <p className="text-9xl max-h-12">&ldquo;</p>
                  <p className="p-4">{t.body}</p>
                  <p className="text-9xl text-right max-h-12">"</p>
                </div>
                <p className="text-right text-base">
                  - {t.name} from {t.state}
                </p>
              </div>
            </CarouselItem>
          )
        )}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
