import { useState, useEffect } from 'react'
import { parse } from 'csv-parse/browser/esm/sync'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import toast from 'react-hot-toast'
import { formatErrorMessage } from '@/utils/format'
import { Upload, XCircle } from 'lucide-react'
import { Input } from '../ui/input'
import { postUsersLote } from '@/api/apiUsers'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const CadastroEmLoteUserDialog = ({
  isOpen,
  onClose,
  onSuccess,
}: Props) => {
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvPreview, setCsvPreview] = useState<
    Array<{ nome: string; 'e-mail': string; senha: string }>
  >([])

  const handleCsvChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return
    setCsvFile(file)
    const text = await file.text()
    const data = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Array<{ nome: string; 'e-mail': string; senha: string }>
    setCsvPreview(data)
  }

  const handleUpload = async () => {
    if (!csvFile) return

    try {
      await postUsersLote(csvFile)
      toast.success('Usuarios importados com sucesso!')
      onSuccess()
      handleClose()
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao importar usuarios.'))
    }
  }

  const handleClose = () => {
    setCsvFile(null)
    setCsvPreview([])
    onClose()
  }

  useEffect(() => {
    if (!isOpen) {
      setCsvFile(null)
      setCsvPreview([])
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="space-y-6 max-w-3xl">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Importar usuarios via CSV
          </DialogTitle>
        </DialogHeader>

        <div className="w-full flex flex-col gap-2">
          <label
            htmlFor="csvFile"
            className="senhar-pointer border border-dashed border-muted rounded-md bg-muted px-4 py-6 text-center text-sm text-muted-foreground hover:border-primary hover:bg-muted/80 transition"
          >
            {csvFile ? (
              <div className="flex flex-col items-center gap-1">
                <span className="font-medium text-primary">{csvFile.name}</span>
                <span className="text-xs text-muted-foreground">
                  Arquivo carregado
                </span>
              </div>
            ) : (
              <span>
                Clique para selecionar um arquivo <strong>.csv</strong>
              </span>
            )}
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleCsvChange}
              className="hidden"
            />
          </label>
          <p className="text-sm text-muted-foreground">
            O CSV deve conter colunas: <strong>nome</strong>,{' '}
            <strong>e-mail</strong>, <strong>senha</strong>.
          </p>
        </div>

        {csvPreview.length > 0 && (
          <div className="border rounded-md shadow-sm overflow-auto max-h-64">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead>nome</TableHead>
                  <TableHead>e-mail</TableHead>
                  <TableHead>senha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {csvPreview.map((user, idx) => (
                  <TableRow key={idx} className="hover:bg-muted/50">
                    <TableCell>{user.nome}</TableCell>
                    <TableCell>{user['e-mail']}</TableCell>
                    <TableCell>{user.senha}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={handleClose}>
            <XCircle className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button onClick={handleUpload} disabled={!csvFile}>
            <Upload className="mr-2 h-4 w-4" />
            Importar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
