import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import type { TccType } from '@/utils/types'

interface ExcluirTccDialogProps {
  isOpen: boolean
  onClose: () => void
  tcc: TccType | null
  onDelete: (tccId: string) => void
}

export const ExcluirTccDialog = ({
  isOpen,
  onClose,
  tcc,
  onDelete,
}: ExcluirTccDialogProps) => {
  const handleConfirmDelete = () => {
    if (tcc?.id) {
      onDelete(tcc.id)
      onClose()
    }
  }

  if (!tcc) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Excluir TCC</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir permanentemente o TCC{' '}
            <span className="font-semibold text-foreground">{tcc.titulo}</span>?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Esta ação não pode ser desfeita. O arquivo PDF do TCC será removido
            permanentemente.
          </p>

          <div className="mt-3 space-y-2">
            <div className="flex items-center text-sm">
              <span className="w-24 text-muted-foreground">Autor:</span>
              <span>{tcc.aluno?.nome}</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="w-24 text-muted-foreground">Curso:</span>
              <span>{tcc.curso}</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="w-24 text-muted-foreground">Data:</span>
              <span>
                {new Date(tcc.dataDefesa).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
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
