import { useEffect, useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, ArrowRight, FileText, GraduationCap, User } from 'lucide-react'
import { formatDate } from 'date-fns'
import toast from 'react-hot-toast'
import { cursosPermitidosTcc, formatErrorMessage } from '@/utils/format'
import { getTccs } from '@/api/apiTcc'
import type { TccType, UserType } from '@/utils/types'

const Tcc = () => {
  const [tccs, setTccs] = useState<TccType[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('all')
  const [selectedOrientador, setSelectedOrientador] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()
  const user = location.state as UserType | undefined
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTccs = async () => {
      try {
        const data = await getTccs()
        setTccs(data)
      } catch (error) {
        toast.error(formatErrorMessage(error, 'Erro ao carregar TCCs.'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchTccs()
  }, [])

  const orientadores = useMemo(() => {
    const uniqueOrientadores = new Set<string>()
    tccs.forEach((tcc) => {
      if (tcc.orientador) {
        uniqueOrientadores.add(tcc.orientador)
      }
    })
    return Array.from(uniqueOrientadores).sort()
  }, [tccs])

  const filteredTccs = tccs.filter((tcc) => {
    const courseMatch = selectedCourse === 'all' || tcc.curso === selectedCourse
    const orientadorMatch =
      selectedOrientador === 'all' || tcc.orientador === selectedOrientador
    const searchMatch =
      !searchTerm ||
      tcc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tcc.resumo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tcc.aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
    return courseMatch && orientadorMatch && searchMatch
  })

  const cursoEstilo: Record<
    string,
    { borda: string; texto: string; icone: string }
  > = {
    'Tecnólogo em Processos Gerenciais': {
      borda: 'border-blue-600',
      texto: 'text-blue-600',
      icone: 'text-blue-500',
    },
    'Tecnologia em Análise e Desenvolvimento de Sistemas': {
      borda: 'border-purple-600',
      texto: 'text-purple-600',
      icone: 'text-purple-500',
    },
    'Técnico em Enfermagem': {
      borda: 'border-red-600',
      texto: 'text-red-600',
      icone: 'text-red-500',
    },
    'Bacharelado em Engenharia Agronômica': {
      borda: 'border-green-600',
      texto: 'text-green-600',
      icone: 'text-green-500',
    },
    default: {
      borda: 'border-gray-600',
      texto: 'text-gray-600',
      icone: 'text-gray-500',
    },
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar user={user} />

      <main className="flex-1 py-12 px-6">
        <section className="max-w-6xl mx-auto mb-12">
          <div className="my-8">
            <h1 className="text-3xl font-bold text-green-700 mb-2">
              Trabalhos de Conclusão de Curso
            </h1>
            <p className="text-gray-600">
              Explore os trabalhos acadêmicos produzidos por nossos alunos
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Buscar TCCs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <div className="md:col-span-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Buscar por título, resumo ou autor..."
                    className="pl-10 w-full h-10 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <Select
                  value={selectedCourse}
                  onValueChange={setSelectedCourse}
                >
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Todos os cursos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os cursos</SelectItem>
                    {cursosPermitidosTcc.map((curso) => (
                      <SelectItem key={curso} value={curso}>
                        {curso}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={selectedOrientador}
                  onValueChange={setSelectedOrientador}
                >
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Todos os orientadores" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os orientadores</SelectItem>
                    {orientadores.map((orientador) => (
                      <SelectItem key={orientador} value={orientador}>
                        {orientador}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-lg p-6 text-center text-gray-600">
              Carregando TCCs...
            </div>
          ) : filteredTccs.length === 0 ? (
            <div className="bg-white rounded-lg p-6 text-center text-gray-600">
              Nenhum TCC encontrado com os filtros selecionados.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTccs.map((tcc) => (
                <div
                  key={tcc.id}
                  className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col border-t-4 ${
                    cursoEstilo[tcc.curso]?.borda || cursoEstilo.default.borda
                  }`}
                >
                  <div className="p-5 flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText
                        className={`h-5 w-5 ${
                          cursoEstilo[tcc.curso]?.icone ||
                          cursoEstilo.default.icone
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          cursoEstilo[tcc.curso]?.texto ||
                          cursoEstilo.default.texto
                        }`}
                      >
                        {tcc.curso}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {tcc.titulo}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {tcc.resumo}
                    </p>

                    <div className="flex items-center gap-3 text-sm text-gray-700 mb-3">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{tcc.aluno.nome}</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <GraduationCap className="h-4 w-4 text-gray-500" />
                      <span>{tcc.orientador} (Orientador)</span>
                    </div>
                  </div>

                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Defesa:{' '}
                      {formatDate(new Date(tcc.dataDefesa), 'dd/MM/yyyy')}
                    </span>
                    <Button
                      variant="link"
                      className="text-green-600 p-0 h-auto text-sm"
                      onClick={() => {
                        navigate(`/tcc/${tcc.id}`, {
                          state: user,
                        })
                      }}
                    >
                      <span className="flex items-center gap-1">
                        Detalhes
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Tcc
