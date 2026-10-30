import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db, storage } from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/AuthContext";
import type { FormData, ImageItemProps } from "./New";
import CarCard from "../../components/CarCard";
import { FiTrash2 } from "react-icons/fi";
import { deleteObject, ref } from "firebase/storage";
import toast from "react-hot-toast";

export interface CarProps extends FormData {
  owner: string;
  uid: string;
  images: ImageItemProps[];
  id: string;
  keywords: string[]
}

export default function DashBoard() {
  const { user } = useContext(AuthContext);
  const [cars, setCars] = useState<CarProps[]>([]);
  useEffect(() => {
    if (!user?.uid) {
      return;
    }
    async function getCars() {
      const carsRef = collection(db, "cars");
      const queryRef = query(carsRef, where("uid", "==", user?.uid));
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
            owner: doc.data().name,
            uid: doc.data().uid,
            images: doc.data().images,
            id: doc.id,
            keywords: doc.data().keywords
          });
        });

        setCars(carList);
      } catch (error) {
        console.error(error);
      }
    }

    getCars();
  }, [user]);

  async function deleteCar(carInfo: CarProps) {
    const carRef = doc(db, "cars", carInfo.id);

    try {
      carInfo.images.forEach(async (image) => {
        const imagemPath = `images/${image.uid}/${image.name}`;
        const imageRef = ref(storage, imagemPath);
        await deleteObject(imageRef);
      });

      await deleteDoc(carRef);
      setCars((cars) => cars.filter((car) => car.id !== carInfo.id));
      toast.success("Carro deletado com sucesso!")
    } catch (error) {
      toast.error("Erro ao deletar o carro, tente novamente!")
      console.log(error);
    }
  }
  return (
    <>
      {cars.length === 0 && (
        <span className="text-center block font-medium text-lg">
          Nenhum carro cadastrado
        </span>
      )}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cars.map((car) => (
          <div className="relative  rounded-lg" key={car.id}>
            <button
              className="absolute top-4 right-4 cursor-pointer bg-white rounded-lg p-2 z-10"
              onClick={() => deleteCar(car)}
            >
              <FiTrash2 color="#000" size={26} />
            </button>
            <CarCard car={car} />
          </div>
        ))}
      </section>
    </>
  );
}
