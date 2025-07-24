import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Trash2, Upload, Loader2 } from 'lucide-react'
import { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import { formatErrorMessage } from '@/utils/format'
import type { ProjetoType } from '@/utils/types'
import { deleteProjetoImagem, postProjetoImagem } from '@/api/apiProjeto'

interface ImagemUploadDialogProps {
  isOpen: boolean
  onClose: () => void
  projeto: ProjetoType | null
  onSuccess: () => void
}

export const ImagemUploadDialog = ({
  isOpen,
  onClose,
  projeto,
  onSuccess,
}: ImagemUploadDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      const validTypes = ['image/jpeg', 'image/png', 'image/webp']

      if (!validTypes.includes(file.type)) {
        toast.error('Tipo de arquivo inválido. Use JPEG, PNG ou WebP.')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Arquivo muito grande. Tamanho máximo: 5MB')
        return
      }

      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !projeto) return

    setIsUploading(true)
    try {
      await postProjetoImagem(projeto.id, selectedFile)
      toast.success('Imagem enviada com sucesso!')
      onSuccess()
      resetFileInput()
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao enviar imagem'))
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteImage = async () => {
    if (!projeto?.imagem?.id) return

    setIsDeleting(true)
    try {
      await deleteProjetoImagem(projeto.imagem.id)
      toast.success('Imagem removida com sucesso!')
      onSuccess()
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao remover imagem'))
    } finally {
      setIsDeleting(false)
    }
  }

  const resetFileInput = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl space-y-5">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Imagem do Projeto:{' '}
            <span className="text-primary">{projeto?.titulo}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="image/jpeg, image/png, image/webp"
              onChange={handleFileChange}
              className="max-w-xs"
              ref={fileInputRef}
              disabled={isUploading}
            />
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Enviar
                </>
              )}
            </Button>
          </div>

          {selectedFile && (
            <div className="border rounded-md p-2 bg-muted">
              <div className="flex items-center gap-2">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Pré-visualização"
                  className="h-16 w-16 object-cover rounded"
                />
                <div>
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {projeto?.imagem?.url ? (
          <div className="relative border rounded-md p-2 bg-muted">
            <div className="flex items-start justify-between gap-4">
              <img
                src={projeto.imagem.url}
                alt={`Imagem do projeto ${projeto.titulo}`}
                className="w-full h-64 object-contain rounded"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteImage}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                ) : (
                  <Trash2 className="h-4 w-4 text-red-600" />
                )}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Nenhuma imagem vinculada a este projeto.
          </p>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isUploading || isDeleting}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
