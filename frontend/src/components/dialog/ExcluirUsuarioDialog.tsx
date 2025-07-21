import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { User } from '@/utils/types'

interface ExcluirUsuarioDialogProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onDelete: (id: string) => void
}

const ExcluirUsuarioDialog = ({
  isOpen,
  onClose,
  user,
  onDelete,
}: ExcluirUsuarioDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Usuário</DialogTitle>
        </DialogHeader>
        <p>
          Tem certeza que deseja excluir <strong>{user?.nome}?</strong>
        </p>
        <div className="flex justify-end mt-4">
          <Button variant="outline" className="mr-2" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (user) {
                onDelete(user.id)
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

export default ExcluirUsuarioDialog
