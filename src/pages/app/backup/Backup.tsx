import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { realizarBackup } from "@/services/api/backup/realizar-backup";
import { restaurarBackup } from "@/services/api/backup/restaurar-backup";

const backupSchema = z.object({
  arquivo: z.any().optional(),
});

type BackupFormData = z.infer<typeof backupSchema>;

export function Backup() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<BackupFormData>({
    resolver: zodResolver(backupSchema),
  });

  async function onSubmit(data: BackupFormData) {
    try {
      const loadingToast = toast.loading({
        title: "Realizando backup",
        description: "Aguarde enquanto processamos sua solicitação...",
      });

      await realizarBackup();
      
      toast.dismiss(loadingToast);
      toast.success({
        title: "Backup realizado com sucesso!",
        description: "O arquivo de backup foi gerado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao realizar backup:", error);
      toast.error({
        title: "Erro ao realizar backup",
        description: "Ocorreu um erro ao tentar realizar o backup. Tente novamente.",
      });
    }
  }

  async function onRestaurar(data: BackupFormData) {
    try {
      if (!data.arquivo?.[0]) {
        toast.error({
          title: "Arquivo não selecionado",
          description: "Selecione um arquivo de backup para restaurar.",
        });
        return;
      }

      const loadingToast = toast.loading({
        title: "Restaurando backup",
        description: "Aguarde enquanto processamos sua solicitação...",
      });

      await restaurarBackup(data.arquivo[0]);
      
      toast.dismiss(loadingToast);
      toast.success({
        title: "Backup restaurado com sucesso!",
        description: "O backup foi restaurado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao restaurar backup:", error);
      toast.error({
        title: "Erro ao restaurar backup",
        description: "Ocorreu um erro ao tentar restaurar o backup. Tente novamente.",
      });
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Backup do Sistema</h1>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Realizar Backup</h2>
            <p className="text-sm text-gray-600 mb-4">
              Clique no botão abaixo para gerar um arquivo de backup do sistema.
            </p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Gerando backup..." : "Gerar backup"}
              </Button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Restaurar Backup</h2>
            <p className="text-sm text-gray-600 mb-4">
              Selecione um arquivo de backup para restaurar o sistema.
            </p>
            <form onSubmit={handleSubmit(onRestaurar)} className="space-y-4">
              <div>
                <Label htmlFor="arquivo">Arquivo de Backup</Label>
                <Input
                  id="arquivo"
                  type="file"
                  accept=".json"
                  {...register("arquivo")}
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Restaurando..." : "Restaurar backup"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 