import { useState } from "react";
import type { CarProps } from "../../pages/Dashboard";

interface CarCardProps {
  car: CarProps;
}
export default function CarCard(props: CarCardProps) {
  const [loadImages, setLoadImages] = useState<string[]>([]);

  const priceFormatter = Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

  function handleImageLoad(id: string) {
    setLoadImages((imagesId) => [...imagesId, id]);
  }

  return (
    <div className="rounded-lg bg-white drop-shadow w-full">
      <div className="overflow-hidden rounded-lg">
        <div
          className=" aspect-video w-full object-cover rounded-lg bg-slate-200 "
          style={{
            display: loadImages.includes(props.car.id) ? "none" : "block",
          }}
        ></div>
        <img
          src={props.car.images[0].url}
          alt={props.car.name}
          className=" aspect-video w-full object-cover rounded-lg hover:scale-105 transition-transform"
          onLoad={() => handleImageLoad(props.car.id)}
          style={{
            display: loadImages.includes(props.car.id) ? "block" : "none",
          }}
        />
      </div>

      <div className="mt-4  flex flex-col gap-2 pb-2  px-3">
        <strong>{props.car.name}</strong>
        <span className="text-zinc-700">
          {props.car.year} | {props.car.km} km
        </span>
        <div className="mt-4">
          <strong className="text-xl">
            {priceFormatter.format(Number(props.car.price))}
          </strong>
        </div>
      </div>
      <div className="h-px  w-full bg-slate-200"></div>

      <div className="px-3 py-2">
        <span>{props.car.city}</span>
      </div>
    </div>
  );
}
