// "use client";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useTRPC } from "@/trpc/client";
// import { useMutation } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { toast } from "sonner";

// const page = () => {
//   const router = useRouter();
//   const [value, setValue] = useState("");
//   const trpc = useTRPC();
//   const createProject = useMutation(
//     trpc.projects.create.mutationOptions({
//       onError: (e) => {
//         toast.error(e.message);
//       },
//       onSuccess: (data) => {
//         toast.success("You are redirecting to CodeSheet ans page");
//         router.push(`/projects/${data.id}`);
//       }
//     })
//   );

//   return (
//     <div className="h-screen w-screen flex items-center justify-center">
//       <div className="max-w-7xl mx-auto flex items-center flex-col gap-y-4 justify-center">
//         <Input
//           value={value}
//           onChange={(e) => setValue(e.target.value)}
//           placeholder="write anything here..."
//         />
//         <Button
//           disabled={createProject.isPending}
//           onClick={() => createProject.mutate({ value: value })}
//         >
//           Submit
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default page;

"use client";
import { ProjectForm } from "@/modules/home/ui/components/project-form";
import { ProjectList } from "@/modules/home/ui/components/projects-list";
import Image from "next/image";

const page = () => {
  return(
    <div className="flex flex-col max-w-5xl mx-auto w-full">
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center">
          <Image
          src="/logo.svg"
          alt="CodeSheet"
          width={50}
          height={50}
          className="hidden md:block"
          />
        </div>
        <h1 className="text-2xl md:text-5xl font-bold text-center">
          Build something with CodeSheet
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground text-center">
          Create apps and websites by chatting with AI
        </p>
        <div className="max-w-3xl mx-auto w-full">
          <ProjectForm/>
        </div>
      </section>
      <ProjectList/>
    </div>
  );
}

export default page;