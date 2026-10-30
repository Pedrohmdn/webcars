import { useForm } from "react-hook-form";
import Input from "../../../components/Input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiTrash, FiUpload } from "react-icons/fi";
import Button from "../../../components/Button";
import { useContext, useState, type ChangeEvent } from "react";
import { AuthContext } from "../../../contexts/AuthContext";

import { v4 as uuidV4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../../services/firebaseConnection";
import { addDoc, collection } from "firebase/firestore";
import toast from "react-hot-toast";

const schema = z.object({
  name: z.string().nonempty("O  nome é obrigatório"),
  model: z.string().nonempty("O modelo é obrigatório"),
  year: z.string().nonempty("O ano do carro é obrigatório"),
  km: z
    .string()
    .nonempty("O km do carro é obrigatório")
    .transform((val) => {
      const km = val
        .replace(/[^\d,.-]/g, "")
        .replace(",", ".");
      return km;
    }),
  price: z
    .string()
    .nonempty("O preço do carro é obrigatório")
    .transform((val) => {
      const price = val
        .replace(/[^\d,.-]/g, "")
        .replace(/\./g, "")
        .replace(",", ".");
      return price;
    }),
  city: z.string().nonempty("A cidade é obrigatória"),
  whatsApp: z
    .string()
    .nonempty("O whatsApp é obrigatória")
    .refine((value) => /^(\d{10,11})$/.test(value), {
      error: "Número inválido",
    }),
  description: z
    .string()
    .nonempty("A descrição do carro é obrigatória")
    .min(200, "A descrição deve ser no mínimo 200 caracteres")
    .max(3000, "A descrição deve ter no máximo 3.000 caracteres"),
});

export type FormData = z.infer<typeof schema>;

export interface ImageItemProps {
  url?: string;
  uid: string;
  name?: string;
  previwUrl: string;
  file: File;
}

export default function New() {
  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  const [images, setImages] = useState<ImageItemProps[]>([]);

  async function onSubit(data: FormData) {
    if (images.length === 0) {
      toast.error("Envie alguma imagem do carro!");
      return;
    }
    const idToast = toast.loading("Cadastrando o Carro...");

    try {
      const uploadedImages = await Promise.all(
        images.map((image) => handleUpload(image)),
      );

      const carListImages = uploadedImages.filter((img) => img !== null);

      const keywords = `${data.name} ${data.model}`
        .trim()
        .toUpperCase()
        .split(" ");

      await addDoc(collection(db, "cars"), {
        name: data.name.toLocaleUpperCase(),
        model: data.model.toLocaleUpperCase(),
        year: data.year,
        km: data.km,
        price: data.price,
        city: data.city,
        whatsApp: data.whatsApp,
        description: data.description,
        created: new Date(),
        owner: user?.name,
        uid: user?.uid,
        images: carListImages,
        keywords: [...keywords, data.name.toUpperCase()],
      });
      toast.success("Carro Cadastrado com sucesso!", {
        id: idToast,
      });
      reset();
      setImages([]);
      
    } catch (error) {
      toast.error("Erro ao cadastrar o carro, tente novamente!", {
        id: idToast,
      });
      console.error(error);
    }
  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const images = e.target.files;

      for (const image of images) {
        if (image.type === "image/jpeg" || image.type === "image/png") {
          if (!user?.uid) {
            return;
          }
          

          setImages((images) => [
            ...images,
            {
              uid: user.uid,
              previwUrl: URL.createObjectURL(image),
              file: image
            },
          ]);
        } else {
          toast.error("A imagem precisa ser formato jpeg ou png");
          return;
        }
      }
    }
  }

  async function handleUpload(image: ImageItemProps) {
    if (!user?.uid) {
      return;
    }
    const uidImage = uuidV4();
    const uploadRef = ref(storage, `images/${user.uid}/${uidImage}`);

    let downloadUrl;

    try {
      const snapshot = await uploadBytes(uploadRef, image.file);
      downloadUrl = await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error(error);
    }

    return {
      uid: user.uid,
      name: uidImage,
      url: downloadUrl,
    };
  }

  async function handleDeleteImage(image: ImageItemProps) {
    const updatedImages = images.filter(
      (img) => img.previwUrl !== image.previwUrl,
    );
    setImages(updatedImages);
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white p-4 flex sm:flex-row flex-col rounded-lg gap-5">
        <div className="max-w-57 h-38 border-2 rounded-lg border-gray-500 flex items-center justify-center">
          <button className=" flex items-center justify-center">
            <div className="absolute">
              <FiUpload size={32} color="#000" />
            </div>
            <div>
              <input
                className="opacity-0 cursor-pointer"
                type="file"
                accept="image/*"
                onChange={handleFile}
                multiple
              />
            </div>
          </button>
        </div>

        <div className="w-full flex gap-2">
          {images.map((image, index) => (
            <div
              key={index}
              className=" relative flex items-center justify-center w-full h-38"
            >
              <button
                className="absolute top-4 right-4 cursor-pointer bg-white rounded-lg p-2"
                onClick={() => handleDeleteImage(image)}
              >
                <FiTrash color="#000" size={26} />
              </button>
              <img
                src={image.previwUrl}
                alt="imagem Carro"
                className="w-full h-full  object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white p-4 ">
        <form className=" flex flex-col gap-5" onSubmit={handleSubmit(onSubit)}>
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="name" className="font-medium">
              Nome do Carro
            </label>
            <Input
              register={register}
              type="text"
              name="name"
              error={errors.name?.message}
              placeholder="Ex: Onix 1.0"
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="model" className="font-medium">
              Modelo
            </label>
            <Input
              register={register}
              type="text"
              name="model"
              error={errors.model?.message}
              placeholder="Ex: Flex manual"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-5 ">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="year" className="font-medium">
                Ano
              </label>
              <Input
                register={register}
                type="text"
                name="year"
                error={errors.year?.message}
                placeholder="Ex: 2016"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="km" className="font-medium">
                Km rodados
              </label>
              <Input
                register={register}
                type="text"
                name="km"
                error={errors.km?.message}
                placeholder="Ex: 23.900..."
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-5 ">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="whatsApp" className="font-medium">
                WhatsApp
              </label>
              <Input
                register={register}
                type="text"
                name="whatsApp"
                error={errors.whatsApp?.message}
                placeholder="Ex: 01199910948"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="city" className="font-medium">
                Cidade
              </label>
              <Input
                register={register}
                type="text"
                name="city"
                error={errors.city?.message}
                placeholder="Ex: São Paulo"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <label htmlFor="price" className="font-medium">
              Valor em R$
            </label>
            <Input
              register={register}
              type="text"
              name="price"
              error={errors.price?.message}
              placeholder="Ex: 69.000"
            />
          </div>

          <div className="flex flex-col gap-2 ">
            <label htmlFor="whatsApp" className="font-medium">
              Descrição
            </label>
            <textarea
              id="description"
              className="border-2 rounded-lg border-gray-500 p-2.5 outline-none text-base w-full h-28"
              {...register("description")}
              placeholder="Digite a descrição completa do Carro"
            ></textarea>
            {errors.description?.message && (
              <span className="text-red-600">
                {errors.description?.message}
              </span>
            )}
          </div>
          <Button type="submit" bgColor="black">
            Cadastrar
          </Button>
        </form>
      </div>
    </div>
  );
}
