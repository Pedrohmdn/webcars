import { useEffect, useState } from "react";
import CarCard from "../../components/CarCard";
import type { CarProps } from "../Dashboard";
import { collection, getDocs, orderBy, query, where} from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { Link } from "react-router";
import Footer from "../../components/Footer";
import toast from 'react-hot-toast';

export default function Home() {
  const [allCars, setAllCars] = useState<CarProps[]>([])
  const [cars, setCars] = useState<CarProps[]>([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    async function loadCars() {
      const carRef = collection(db, "cars");
      const queryRef = query(carRef, orderBy("created", "desc"));
  
      try {
        const snapshot = await getDocs(queryRef);
        const carList: CarProps[] = [];
        snapshot.forEach((doc) => {
          carList.push({
            name: doc.data().name,
            model: doc.data().model,
            year: doc.data().year,
            km: doc.data().km,
            price: doc.data().price,
            city: doc.data().city,
            whatsApp: doc.data().whatsApp,
            description: doc.data().description,
            owner: doc.data().owner,
            uid: doc.data().uid,
            images: doc.data().images,
            id: doc.id,
            keywords: doc.data().keywords
          });
        });
        setAllCars(carList)
        setCars(carList);
  
      } catch (error) {
        console.error(error);
      }
    }

    loadCars();
  }, []);

  

  async function searchCar() {
    const termo = searchInput.trim().toUpperCase();

    if (termo === "") {
      toast.error("Digite o nome do carro")
      setCars(allCars);
      return;
    }

    

     const q = query(
      collection(db, "cars"),
      where("keywords", "array-contains", termo)
    );

    try {
      const snapshot = await getDocs(q);
      const carList: CarProps[] = [];
      snapshot.forEach((doc) => {
        carList.push({
          name: doc.data().name,
          model: doc.data().model,
          year: doc.data().year,
          km: doc.data().km,
          price: doc.data().price,
          city: doc.data().city,
          whatsApp: doc.data().whatsApp,
          description: doc.data().description,
          owner: doc.data().owner,
          uid: doc.data().uid,
          images: doc.data().images,
          id: doc.id,
          keywords: doc.data().keywords
        });
      });

      if (carList.length === 0) {
        toast.error("Nenhum carro encontrado com esse nome.")
        setCars(allCars)
        return;
      }
      setCars(carList);
    } catch (error) {
      console.error(error);
    } 
  }

  return (
    <>
      <main>
        <div className="mt-20 bg-white h-22.5 px-4 py-5 rounded-lg flex items-center gap-5 w-full max-w-6xl mx-auto ">
          <input
            type="text"
            placeholder="Digite o nome do Carro "
            className="w-full border-2 border-gray-400 rounded-lg px-4 h-full text-base outline-none"
            name="search"
            id="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button
            className="text-2xl font-bold bg-red-600 rounded-lg px-20 text-white h-full cursor-pointer hover:saturate-95 transition-all"
            onClick={searchCar}
          >
            Buscar
          </button>
        </div>
        <h1 className="font-bold text-2xl text-center mt-16 mb-10">
          Carros novos e usados em todo o Brasil
        </h1>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <Link to={`car/${car.id}`} key={car.id}>
              <CarCard car={car} />
            </Link>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
