// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm, SubmitHandler } from "react-hook-form";
// import { z } from "zod";
// import { register } from "@/features/auth/presentation/services/actions/sign-up";

// const schema = z.object({
//   ci: z.string().min(1, "La cédula es requerida"),
//   email: z
//     .string()
//     .min(1, "El email es requerido")
//     .email("El email no es válido"),
//   firstName: z.string().min(1, "El nombre es requerido"),
//   lastName: z.string().min(1, "El apellido es requerido"),
//   password: z
//     .string()
//     .min(8, "La contraseña debe tener como mínimo 8 caracteres")
//     .regex(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/,
//       "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un símbolo especial"
//     ),
//   role: z.string().optional(),
// });

// type FormFields = z.infer<typeof schema>;

// export function useSignUpForm() {
//   const methods = useForm<FormFields>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       ci: "",
//       email: "",
//       firstName: "",
//       lastName: "",
//       password: "",
//       role: "usuario",
//     },
//   });

//   const onSubmit: SubmitHandler<FormFields> = async (data) => {
//     await register(data);
//   };

//   return { onSubmit, methods, isSubmitting: methods.formState.isSubmitting };
// }
