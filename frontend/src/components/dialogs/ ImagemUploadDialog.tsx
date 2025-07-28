import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Trash2, Upload, Loader2, Star } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import { formatErrorMessage } from '@/utils/format'
import type { ProjetoType } from '@/utils/types'
import {
  deleteProjetoImagem,
  postProjetoImagem,
  patchImagemPrincipal,
} from '@/api/apiProjeto'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ImagemUploadDialogProps {
  isOpen: boolean
  onClose: () => void
  projeto: ProjetoType | null
  onSuccess: () => void
}

type ImagemProjeto = {
  id: string
  url: string
  principal: boolean
  projetoId: string
  createdAt: string
}

export const ImagemUploadDialog = ({
  isOpen,
  onClose,
  projeto,
  onSuccess,
}: ImagemUploadDialogProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isSettingPrincipal, setIsSettingPrincipal] = useState<string | null>(
    null
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const files = Array.from(e.target.files)
      const validTypes = ['image/jpeg', 'image/png', 'image/webp']

      const validFiles = files.filter((file) => {
        if (!validTypes.includes(file.type)) {
          toast.error(
            `Tipo de arquivo inválido: ${file.name}. Use JPEG, PNG ou WebP.`
          )
          return false
        }

        if (file.size > 5 * 1024 * 1024) {
          toast.error(`Arquivo muito grande: ${file.name}. Tamanho máximo: 5MB`)
          return false
        }

        return true
      })

      setSelectedFiles((prev) => [...prev, ...validFiles])
    }
  }

  const [imagensProjeto, setImagensProjeto] = useState<ImagemProjeto[]>(
    projeto?.imagens || []
  )

  useEffect(() => {
    setImagensProjeto(projeto?.imagens || [])
  }, [projeto])

  const handleUpload = async (isPrincipal: boolean = false) => {
    if (!selectedFiles.length || !projeto) return

    setIsUploading(true)
    try {
      const responses = await Promise.all(
        selectedFiles.map((file) =>
          postProjetoImagem(
            projeto.id,
            file,
            isPrincipal && selectedFiles.indexOf(file) === 0
          )
        )
      )

      setImagensProjeto((prev) => [...prev, ...responses])

      toast.success(
        `${selectedFiles.length} imagem(ns) enviada(s) com sucesso!`
      )
      resetFileInput()
      onSuccess()
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao enviar imagem(ns)'))
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteImage = async (imagemId: string) => {
    setIsDeleting(imagemId)
    try {
      await deleteProjetoImagem(imagemId)
      setImagensProjeto((prev) => prev.filter((img) => img.id !== imagemId))
      toast.success('Imagem removida com sucesso!')
      onSuccess()
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao remover imagem'))
    } finally {
      setIsDeleting(null)
    }
  }

  const handleSetPrincipal = async (imagemId: string) => {
    if (!projeto) return

    setIsSettingPrincipal(imagemId)
    try {
      await patchImagemPrincipal(imagemId)
      setImagensProjeto((prev) =>
        prev.map((img) => ({
          ...img,
          principal: img.id === imagemId ? true : false,
        }))
      )
      toast.success('Imagem principal definida com sucesso!')
      onSuccess()
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao definir imagem principal'))
    } finally {
      setIsSettingPrincipal(null)
    }
  }

  const resetFileInput = () => {
    setSelectedFiles([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const principalImage = imagensProjeto.find((img) => img.principal)
  const secondaryImages = imagensProjeto.filter((img) => !img.principal)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] h-[85vh] sm:max-w-4xl sm:h-[75vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold">
            Imagens: {projeto?.titulo}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-grow min-h-0">
          <div className="flex flex-col border rounded-lg overflow-hidden">
            <div className="p-3 space-y-3">
              <h3 className="font-medium">Novas Imagens</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="cursor-pointer flex-1"
                >
                  <label className="flex items-center justify-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Selecionar
                    <Input
                      type="file"
                      accept="image/jpeg, image/png, image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                      ref={fileInputRef}
                      disabled={isUploading}
                      multiple
                    />
                  </label>
                </Button>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleUpload(false)}
                    disabled={!selectedFiles.length || isUploading}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Enviar'
                    )}
                  </Button>
                  <Button
                    onClick={() => handleUpload(true)}
                    disabled={!selectedFiles.length || isUploading}
                    size="sm"
                    className="flex-1"
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Star className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col h-full overflow-hidden">
              <ScrollArea className="flex-grow overflow-auto">
                {selectedFiles.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 p-2">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="border rounded-md p-2 relative group"
                      >
                        <div className="flex flex-col">
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Pré-visualização"
                            className="h-24 w-full object-cover rounded"
                          />
                          <div className="mt-1 truncate text-xs">
                            {file.name.substring(0, 20)}...
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(1)}MB
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                          onClick={() => removeSelectedFile(index)}
                        >
                          <Trash2 className="h-3 w-3 text-red-600" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Nenhuma imagem selecionada
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>

          <div className="flex flex-col border rounded-lg overflow-hidden">
            <div className="p-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Imagens do Projeto</h3>
                <div className="text-sm text-muted-foreground">
                  {projeto?.imagens?.length || 0} no total
                </div>
              </div>
            </div>

            <div className="flex flex-col h-full overflow-hidden">
              <ScrollArea className="flex-grow overflow-auto">
                <div className="p-2 space-y-3">
                  {principalImage && (
                    <div className="border rounded-lg p-3 bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
                          <span className="text-sm font-medium">Principal</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteImage(principalImage.id)}
                          disabled={isDeleting === principalImage.id}
                        >
                          {isDeleting === principalImage.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-red-600" />
                          )}
                        </Button>
                      </div>
                      <img
                        src={`http://localhost:8080${principalImage.url}`}
                        alt={`Imagem principal`}
                        className="w-full h-32 object-contain rounded"
                      />
                      <div className="mt-1 text-xs text-muted-foreground">
                        {new Date(
                          principalImage.createdAt
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    {secondaryImages.map((imagem) => (
                      <div
                        key={imagem.id}
                        className="border rounded-lg p-2 group relative"
                      >
                        <img
                          src={`http://localhost:8080${imagem.url}`}
                          alt="Imagem do projeto"
                          className="w-full h-24 object-cover rounded"
                        />
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 bg-background/80 backdrop-blur-sm"
                            onClick={() => handleSetPrincipal(imagem.id)}
                            disabled={isSettingPrincipal === imagem.id}
                            title="Tornar principal"
                          >
                            {isSettingPrincipal === imagem.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Star className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 bg-background/80 backdrop-blur-sm text-red-600"
                            onClick={() => handleDeleteImage(imagem.id)}
                            disabled={isDeleting === imagem.id}
                            title="Remover"
                          >
                            {isDeleting === imagem.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground truncate">
                          {new Date(imagem.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {!projeto?.imagens?.length && (
                    <div className="text-sm text-muted-foreground italic p-4 text-center">
                      Nenhuma imagem cadastrada
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <div className="text-xs text-muted-foreground">
            Formatos suportados: JPG, PNG, WebP (até 5MB)
          </div>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={
              isUploading || isDeleting !== null || isSettingPrincipal !== null
            }
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
