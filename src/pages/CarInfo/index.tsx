import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { CarProps } from "../Dashboard";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import Button from "../../components/Button";
import Footer from "../../components/Footer";
import { FaWhatsapp } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";

export default function CarInfo() {
  const { id } = useParams();
  const [car, setCar] = useState<CarProps>();
  const navigate = useNavigate();
  const [sliderPerView, setSliderPerView] = useState<number>(2);

  const formatPrice = Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });

  useEffect(() => {
    const carRef = doc(db, "cars", id as string);

    async function loadCar() {
      try {
        const snapshot = await getDoc(carRef);

        if (!snapshot.exists()) {
          navigate("/");
        }

        setCar({
          name: snapshot.data()?.name,
          model: snapshot.data()?.model,
          year: snapshot.data()?.year,
          km: snapshot.data()?.km,
          price: snapshot.data()?.price,
          city: snapshot.data()?.city,
          whatsApp: snapshot.data()?.whatsApp,
          description: snapshot.data()?.description,
          owner: snapshot.data()?.name,
          uid: snapshot.data()?.uid,
          images: snapshot.data()?.images,
          id: snapshot.data()?.id,
          keywords: snapshot.data()?.keywords,
        });
      } catch (error) {
        console.error(error);
        navigate("/");
      }
    }

    loadCar();
  }, [id]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 720) {
        setSliderPerView(1);
      } else {
        setSliderPerView(2);
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("reset", handleResize);
    };
  }, []);

  if (!car) {
    return <div></div>;
  }

  return (
    <>
      <main>
        <div>
          <Swiper
            slidesPerView={sliderPerView}
            pagination={{ clickable: true }}
            navigation
          >
            {car?.images.map((image) => (
              <SwiperSlide key={image.name}>
                <img src={image.url} className="w-full h-96 object-cover" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="p-6 bg-white rounded-lg">
          <div className="flex flex-col gap-2 mb-11">
            <div className="flex items-center justify-between">
              <h1 className="font-bold text-3xl">{car?.name}</h1>
              <strong className="font-bold text-3xl">
                {formatPrice.format(Number(car?.price))}
              </strong>
            </div>
            <h2 className="text-lg">{car?.model}</h2>
          </div>
          <div className="flex gap-6 sm:gap-12 mb-7 flex-wrap">
            <div className="flex flex-col gap-1">
              <span>Cidade</span>
              <strong>{car?.city}</strong>
            </div>
            <div className="flex flex-col gap-1">
              <span>Ano</span>
              <strong>{car?.year}</strong>
            </div>
            <div className="flex flex-col gap-1">
              <span>KM</span>
              <strong>{car?.km}</strong>
            </div>
          </div>
          <div className="flex flex-col gap-2 mb-7">
            <strong>Descrição</strong>
            <p className="text-base">{car?.description}</p>
          </div>
          <div className="flex flex-col gap-2 mb-8">
            <strong>Telefone</strong>
            <span className="text-base">{car?.whatsApp}</span>
          </div>
          <a
            href={`https://api.whatsapp.com/send?phone=${car.whatsApp}&text=Olá vi o anúncio do ${car.name} e estou interessado!`}
            rel="external nofollow noopener noreferrer"
            target="_blank"
          >
            <Button bgColor="green">
              Conversar com o vendedor
              <FaWhatsapp color="#fff" size={26} />
            </Button>
          </a>
        </div>
      </main>

      <Footer />
    </>
  );
}
