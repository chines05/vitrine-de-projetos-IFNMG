import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { AlunoType } from '@/utils/types'

interface ExcluirAlunoDialogProps {
  isOpen: boolean
  onClose: () => void
  aluno: AlunoType | null
  onDelete: (id: string) => void
}

const ExcluirAlunoDialog = ({
  isOpen,
  onClose,
  aluno,
  onDelete,
}: ExcluirAlunoDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Aluno</DialogTitle>
        </DialogHeader>
        <p>
          Tem certeza que deseja excluir <strong>{aluno?.nome}?</strong>
        </p>
        <div className="flex justify-end mt-4">
          <Button variant="outline" className="mr-2" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (aluno) {
                onDelete(aluno.id)
              }
              onClose()
            }}
          >
            Excluir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ExcluirAlunoDialog
