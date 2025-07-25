import { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import {
  FileText,
  GraduationCap,
  Download,
  User,
  BookOpen,
  School,
} from 'lucide-react'
import { formatDate } from 'date-fns'
import toast from 'react-hot-toast'
import { formatErrorMessage } from '@/utils/format'
import { downloadTcc, getTccById } from '@/api/apiTcc'
import type { TccType, UserType } from '@/utils/types'

const TccId = () => {
  const { id } = useParams()
  const location = useLocation()
  const user = location.state as UserType | undefined
  const [tcc, setTcc] = useState<TccType | null>(null)

  useEffect(() => {
    const fetchTcc = async () => {
      try {
        if (id) {
          const data = await getTccById(id)
          setTcc(data)
        }
      } catch (error) {
        toast.error(formatErrorMessage(error, 'Erro ao carregar TCC.'))
      }
    }

    fetchTcc()
  }, [id])

  const handleDownloadTcc = async (id: string, fileName: string) => {
    try {
      await downloadTcc(id, fileName)
    } catch (error) {
      toast.error(formatErrorMessage(error, 'Erro ao baixar arquivo.'))
    }
  }

  const cursoEstilo: Record<
    string,
    { bg: string; text: string; border: string }
  > = {
    'Tecnólogo em Processos Gerenciais': {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },
    'Tecnologia em Análise e Desenvolvimento de Sistemas': {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
    },
    'Técnico em Enfermagem': {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
    },
    'Bacharelado em Engenharia Agronômica': {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    },
    default: {
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      border: 'border-gray-200',
    },
  }

  if (!tcc) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar user={user} />
        <div className="py-20 text-center text-gray-600">Carregando TCC...</div>
        <Footer />
      </div>
    )
  }

  const estilo = cursoEstilo[tcc.curso] || cursoEstilo.default

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar user={user} />

      <div className="max-w-5xl mx-auto px-4 mt-15 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{tcc.titulo}</h1>
            <p className="text-gray-500 mt-2">Trabalho de Conclusão de Curso</p>
          </div>

          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${estilo.bg} ${estilo.text}`}
          >
            <FileText className="h-5 w-5" />
            <span className="font-medium">TCC</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            className={`p-6 rounded-lg shadow-sm border ${estilo.border} bg-white`}
          >
            <div className="flex items-center gap-3 mb-4">
              <User className={`h-5 w-5 ${estilo.text}`} />
              <h3 className="text-lg font-semibold">Autor</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Nome</p>
                <p className="font-medium">{tcc.aluno.nome}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Turma</p>
                <p className="font-medium">{tcc.aluno.turma}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Curso</p>
                <p className="font-medium">{tcc.aluno.curso}</p>
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-lg shadow-sm border ${estilo.border} bg-white`}
          >
            <div className="flex items-center gap-3 mb-4">
              <School className={`h-5 w-5 ${estilo.text}`} />
              <h3 className="text-lg font-semibold">Informações Acadêmicas</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Data de Defesa</p>
                <p className="font-medium">
                  {formatDate(new Date(tcc.dataDefesa), 'dd/MM/yyyy')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Data de Cadastro</p>
                <p className="font-medium">
                  {formatDate(new Date(tcc.createdAt), 'dd/MM/yyyy')}
                </p>
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-lg shadow-sm border ${estilo.border} bg-white`}
          >
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className={`h-5 w-5 ${estilo.text}`} />
              <h3 className="text-lg font-semibold">Orientação</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Orientador</p>
                <p className="font-medium">{tcc.orientador}</p>
              </div>
              {tcc.coordenador && (
                <div>
                  <p className="text-sm text-gray-500">Coordenador do Curso</p>
                  <p className="font-medium">{tcc.coordenador.nome}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className={`p-6 rounded-lg shadow-sm mb-8 border ${estilo.border} bg-white`}
        >
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className={`h-5 w-5 ${estilo.text}`} />
            <h2 className="text-xl font-semibold">Resumo</h2>
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{tcc.resumo}</p>
          </div>
        </div>

        <div
          className={`p-6 rounded-lg shadow-sm mb-8 border ${estilo.border} bg-white`}
        >
          <div className="flex items-center gap-3 mb-4">
            <FileText className={`h-5 w-5 ${estilo.text}`} />
            <h2 className="text-xl font-semibold">Documento</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-gray-700">
                Trabalho completo disponível para download
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Última atualização:{' '}
                {formatDate(new Date(tcc.createdAt), 'dd/MM/yyyy HH:mm')}
              </p>
            </div>
            <Button
              variant="unstyled"
              onClick={() => handleDownloadTcc(tcc.id, tcc.file)}
              className={`${estilo.bg} ${estilo.text} hover:scale-105 gap-2`}
            >
              <Download className="h-4 w-4" />
              Baixar PDF
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default TccId
