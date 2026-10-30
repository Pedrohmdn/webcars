import { Link, useNavigate } from "react-router";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import * as z from "zod";
import { auth } from "../../services/firebaseConnection";
import { useEffect } from "react";
import toast from "react-hot-toast";

const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "O campo email é obrigatório!")
    .pipe(
      z.email({
        error: "Insira um email válido.",
      }),
    ),
  password: z
    .string()
    .nonempty("O campo senha é obrigatório!")
    .min(6, "A senha precisa ter pelo menos 6 caracteres!"),
  name: z.string().nonempty("O campo nome é obrigatório!"),
});

type FormData = z.infer<typeof schema>;

export default function Rigister() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    async function handleLogOut() {
      await signOut(auth);
    }

    handleLogOut();
  }, []);

  async function onSubit(data: FormData) {
    let createdUser = null;

    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );

      createdUser = response.user;

      await updateProfile(createdUser, {
        displayName: data.name,
      });
      toast.success("Cadastrado com sucesso!")
      
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error("Erro ao cadastrar cadastro, tente novamente!")

      if (createdUser) {
        try {
          await createdUser.delete();
          console.log("Rollback: Usuário removido do Auth com sucesso.");
        } catch (error) {
          console.error(
            "Falha crítica ao tentar deletar usuário órfão:",
            error,
          );
        }
      }
    }
  }
  return (
    <div className="w-full">
      <form
        className="flex flex-col gap-4 w-full bg-white rounded-lg px-4 py-6"
        onSubmit={handleSubmit(onSubit)}
      >
        <Input
          type="text"
          name="name"
          placeholder="Digite seu nome..."
          error={errors.name?.message}
          register={register}
        />

        <Input
          type="email"
          name="email"
          placeholder="Digite o email..."
          error={errors.email?.message}
          register={register}
        />

        <Input
          type="password"
          name="password"
          placeholder="Digite a senha..."
          error={errors.password?.message}
          register={register}
        />

        <Button bgColor="black" type="submit">
          Cadastrar
        </Button>
      </form>
      <span className="text-center block mt-4 text-gray-900 text-base">
        Já possui uma conta? <Link to={"/login"}>Faça login</Link>
      </span>
    </div>
  );
}
