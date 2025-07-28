import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Search,
  ArrowRight,
  FlaskConical,
  Users,
  GraduationCap,
} from 'lucide-react'
import NavBar from '@/components/NavBar'
import { Button } from '@/components/ui/button'
import Footer from '@/components/Footer'
import campusImage from '/background.jpg'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getProjetos } from '@/api/apiProjeto'
import toast from 'react-hot-toast'
import { formatErrorMessage } from '@/utils/format'
import type { ProjetoType, UserType } from '@/utils/types'
import { getCurrentUser } from '@/api/apiAuth'

const Home = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [projetos, setProjetos] = useState<ProjetoType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<UserType>()

  const checkAuth = useCallback(async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const handleLogin = () => {
    if (user) {
      navigate('/dashboard')

      return
    }

    navigate('/login')
  }

  useEffect(() => {
    const fetchProjetos = async () => {
      try {
        const data = await getProjetos()
        setProjetos(data)
      } catch (error) {
        toast.error(formatErrorMessage(error, 'Erro ao carregar projetos.'))
      } finally {
        setIsLoading(false)
      }
    }
    fetchProjetos()
  }, [])

  const stats = [
    {
      value: projetos.filter((p) => p.status === 'ATIVO').length.toString(),
      label: 'Projetos ativos',
      icon: <FlaskConical className="h-5 w-5" />,
    },
    {
      value: [
        ...new Set(projetos.map((p) => p.coordenadorId)),
      ].length.toString(),
      label: 'Coordenadores',
      icon: <GraduationCap className="h-5 w-5" />,
    },
    {
      value: projetos
        .reduce((total, p) => total + p.participantes.length, 0)
        .toString(),
      label: 'Alunos participantes',
      icon: <Users className="h-5 w-5" />,
    },
  ]

  const projectCategories = [
    {
      id: 'pesquisa',
      name: 'Pesquisa',
      icon: <FlaskConical className="h-4 w-4" />,
      color: 'bg-purple-100 text-purple-800',
    },
    {
      id: 'ensino',
      name: 'Ensino',
      icon: <GraduationCap className="h-4 w-4" />,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'extensao',
      name: 'Extensão',
      icon: <Users className="h-4 w-4" />,
      color: 'bg-green-100 text-green-800',
    },
  ]

  const filteredProjects = projetos.filter((project) => {
    const categoryMatch =
      selectedCategory === 'all' ||
      project.tipo.toLowerCase() === selectedCategory

    const statusMatch =
      selectedStatus === 'all' ||
      project.status.toLowerCase() === selectedStatus.toLowerCase()

    const searchMatch =
      !searchTerm ||
      project.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.descricao.toLowerCase().includes(searchTerm.toLowerCase())

    return categoryMatch && statusMatch && searchMatch
  })

  const tipoProjetoEstilo: Record<
    ProjetoType['tipo'],
    { borda: string; badge: string }
  > = {
    PESQUISA: {
      borda: 'border-purple-600',
      badge: 'bg-purple-100 text-purple-800',
    },
    ENSINO: {
      borda: 'border-sky-600',
      badge: 'bg-sky-200 text-sky-900',
    },
    EXTENSAO: {
      borda: 'border-green-600',
      badge: 'bg-green-100 text-green-800',
    },
  }

  return (
    <div id="home" className="min-h-screen flex flex-col bg-gray-50">
      <NavBar user={user} />

      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0 z-0">
          <img
            src={campusImage}
            alt="Campus IFNMG"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute bg-black opacity-30 inset-0 z-0" />
        </div>

        <div className="relative z-10 h-full flex items-center px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Conhecimento que transforma realidades
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 px-4">
              Descubra os projetos de ensino, pesquisa e extensão que estão
              mudando o Norte de Minas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="unstyled"
                onClick={() =>
                  document
                    .getElementById('projetos')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="bg-white text-green-700 hover:scale-105"
                size="lg"
              >
                <Search className="h-4 w-4 mr-2" />
                Explorar Projetos
              </Button>
              <Button
                onClick={handleLogin}
                variant="unstyled"
                className="bg-transparent border-2 border-white text-white hover:scale-105"
                size="lg"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Área do Pesquisador
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 -mt-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all flex items-center"
              >
                <div className="p-3 rounded-full bg-green-100 text-green-600 flex-shrink-0">
                  {stat.icon}
                </div>
                <div className="text-center w-full">
                  <span className="block text-2xl font-bold text-green-600 leading-tight">
                    {stat.value}
                  </span>
                  <span className="text-gray-600 text-sm">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main id="projetos" className="flex-1 py-12 px-6">
        <section className="max-w-6xl mx-auto mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Encontre projetos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar projetos..."
                  className="pl-10 w-full h-10 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    {projectCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          {category.icon}
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={selectedStatus}
                  onValueChange={(value) => setSelectedStatus(value)}
                >
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="ATIVO">Ativo</SelectItem>
                    <SelectItem value="CONCLUIDO">Concluído</SelectItem>
                    <SelectItem value="PAUSADO">Pausado</SelectItem>
                    <SelectItem value="CANCELADO">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Projetos</h2>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-lg p-6 text-center text-gray-600">
              Carregando projetos...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="bg-white rounded-lg p-6 text-center text-gray-600">
              Nenhum projeto encontrado com os filtros selecionados.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col border-t-4 border-gray-200 ${
                    tipoProjetoEstilo[project.tipo].borda
                  }`}
                >
                  <div className="flex-1">
                    {project.imagens?.find((img) => img.principal)?.url && (
                      <div className="flex justify-center mb-3">
                        <img
                          src={`http://localhost:8080${
                            project.imagens.find((img) => img.principal)?.url
                          }`}
                          alt={`Imagem do projeto ${project.titulo}`}
                          className="rounded-md object-cover w-full max-h-48"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <span
                        className={`inline-block mb-2 px-3 py-1 text-xs font-semibold rounded-full ${
                          tipoProjetoEstilo[project.tipo].badge
                        }`}
                      >
                        {project.tipo === 'PESQUISA'
                          ? 'Pesquisa'
                          : project.tipo === 'ENSINO'
                          ? 'Ensino'
                          : 'Extensão'}
                      </span>

                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {project.titulo}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {project.descricao}
                      </p>
                    </div>
                  </div>
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                    <Button
                      variant="link"
                      className="text-green-600 p-0 h-auto text-sm"
                      onClick={() =>
                        navigate(`/projeto/${project.url}`, {
                          state: user,
                        })
                      }
                    >
                      <span className="flex items-center gap-1">
                        Saiba mais
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

export default Home
