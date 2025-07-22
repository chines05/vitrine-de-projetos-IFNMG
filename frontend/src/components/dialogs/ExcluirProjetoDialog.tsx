import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import type { ProjetoType } from '@/utils/types'

interface ExcluirProjetoDialogProps {
  isOpen: boolean
  onClose: () => void
  projeto: ProjetoType | null
  onDelete: (projetoId: string) => void
}

export const ExcluirProjetoDialog = ({
  isOpen,
  onClose,
  projeto,
  onDelete,
}: ExcluirProjetoDialogProps) => {
  const handleConfirmDelete = () => {
    if (projeto?.id) {
      onDelete(projeto.id)
      onClose()
    }
  }

  if (!projeto) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Excluir Projeto</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir permanentemente o projeto{' '}
            <span className="font-semibold text-foreground">
              {projeto?.titulo}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Esta ação não pode ser desfeita. Todos os dados relacionados ao
            projeto serão removidos.
          </p>

          {projeto?.participantes?.length > 0 && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                ⚠️ Atenção: Este projeto possui {projeto.participantes.length}{' '}
                aluno(s) vinculado(s).
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            className="ml-2"
          >
            Confirmar Exclusão
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
