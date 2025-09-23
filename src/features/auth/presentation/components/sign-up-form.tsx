// "use client";

// import { FormProvider } from "react-hook-form";

// import { Button } from "@/components/ui/button";

// import { LoadingSpinner } from "@/components/ui/loading-spinner";
// import RHFInput from "@/components/rhf/RHFInput";
// import RHFPasswordInput from "@/components/rhf/RHFPasswordInput";
// import { useSignUpForm } from "@/features/auth/hooks/use-sign-up-form";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";

// const SignUpForm = () => {
//   const { methods, onSubmit, isSubmitting } = useSignUpForm();

//   const searchParams = useSearchParams();

//   const redirectPath = searchParams.get("callbackUrl");
//   return (
//     <>
//       <FormProvider {...methods}>
//         <form
//           className="flex flex-col items-center  w-full max-w-xl"
//           onSubmit={methods.handleSubmit(onSubmit)}
//         >
//           <RHFInput
//             name="ci"
//             label="Cédula"
//             placeholder="Ingrese su número de cédula"
//           />
//           <RHFInput
//             name="email"
//             label="Email"
//             placeholder="ejemplo@ejemplo.com"
//           />
//           <RHFInput
//             name="firstName"
//             label="Nombre"
//             placeholder="Nombre"
//           />
//           <RHFInput
//             name="lastName"
//             label="Apellido"
//             placeholder="Apellido"
//           />
//           <RHFPasswordInput
//             name="password"
//             label="Contraseña"
//             placeholder="Contraseña"
//           />
//           <RHFInput
//             name="role"
//             label="Rol"
//             placeholder="usuario"
//           />
//           <Button className="my-4" disabled={isSubmitting} type="submit">
//             {isSubmitting ? "Registrando..." : "Registrarse"}
//           </Button>
//         </form>
//         <p className="text-center text-sm">
//           ¿Ya tienes una cuenta?{' '}
//           <Link
//             href={
//               redirectPath
//                 ? `/login?callbackUrl=${redirectPath}`
//                 : "/login"
//             }
//             className="text-blue-500 hover:underline"
//           >
//             Inicia sesión
//           </Link>
//         </p>
//       </FormProvider>
//     </>
//   );
// };

// export default SignUpForm;
