"use client";

import { useUser } from "@clerk/clerk-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Sidebar } from "~/components/layout/Sidebar";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user } = useUser();
  const router = useRouter();

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col items-center justify-start py-10 px-4">
        <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow p-8 flex flex-col items-center">
          <div className="w-full flex items-center mb-6">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-2xl font-bold text-center flex-1">Perfil do Usuário</h1>
          </div>
          <Avatar className="h-28 w-28 mb-4">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback className="text-3xl">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold mb-2 text-center">{user?.firstName} {user?.lastName}</h2>
          <div className="w-full mt-6">
            <h3 className="text-lg font-semibold mb-3">Informações adicionais</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Nome completo</p>
                <p className="font-medium">{user?.firstName} {user?.lastName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium break-all">{user?.emailAddresses?.[0]?.emailAddress}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Data de criação</p>
                <p className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '-'}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
