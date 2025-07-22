import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Trash2, Upload, Image as ImageIcon } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import { formatErrorMessage } from '@/utils/format'
import type { ProjetoType } from '@/utils/types'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !projeto) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('imagem', selectedFile)
      await postProjetoImagem(projeto.id, formData)
      toast.success('Imagem enviada com sucesso!')
      onSuccess()
      setSelectedFile(null)
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao enviar imagem'))
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteImage = async (imagemId: string) => {
    try {
      await deleteProjetoImagem(imagemId)
      toast.success('Imagem removida com sucesso!')
      onSuccess()
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao remover imagem'))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Imagens do Projeto: {projeto?.titulo}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="max-w-xs"
            />
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>

          {projeto?.imagens?.length ? (
            <Carousel className="w-full">
              <CarouselContent>
                {projeto.imagens.map((imagem) => (
                  <CarouselItem key={imagem.id}>
                    <Card>
                      <CardContent className="p-2 relative">
                        <img
                          src={imagem.url}
                          alt={`Imagem do projeto ${projeto.titulo}`}
                          className="w-full h-64 object-contain rounded-md"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => handleDeleteImage(imagem.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 border rounded-md">
              <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhuma imagem cadastrada</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
