import { Link, useNavigate } from "react-router";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  
  signInWithEmailAndPassword,
  
} from "firebase/auth";
import { auth } from "../../services/firebaseConnection";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
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
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const { signed, loadingAuth } = useContext(AuthContext);
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
    if (signed) {
      navigate("/dashboard", { replace: true });
    }
  }, [signed]);

  async function onSubit(data: FormData) {
    try {
      await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      toast.success("Logado com sucesso!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error("Erro ao fazer login");
      console.log("Erro ao fazer login!", error);
    }
  }

  if (loadingAuth) {
    return <div></div>;
  }
  return (
    <div className="w-full">
      <form
        className="flex flex-col gap-4 w-full bg-white rounded-lg px-4 py-6"
        onSubmit={handleSubmit(onSubit)}
      >
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
          Acessar
        </Button>
      </form>
      <span className="text-center block mt-4 text-gray-900 text-base">
        Ainda não possui uma conta? <Link to={"/register"}>Cadastre-se</Link>
      </span>
    </div>
  );
}
