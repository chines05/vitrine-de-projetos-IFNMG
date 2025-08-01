import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
import type {
  ProjetoType,
  UserType,
  ProjetoParticipanteType,
} from '@/utils/types'
import { useLocation, useParams } from 'react-router-dom'
import { useEffect, useState, type JSX } from 'react'
import toast from 'react-hot-toast'
import { formatErrorMessage } from '@/utils/format'
import { formatDate } from 'date-fns'
import {
  FlaskConical,
  GraduationCap,
  Users,
  User,
  BookUser,
} from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import { getProjetoById } from '@/api/apiProjeto'
import { Badge } from '@/components/ui/badge'

const Projeto = () => {
  const { id } = useParams()
  const location = useLocation()
  const user = location.state as UserType | undefined

  const [projeto, setProjeto] = useState<ProjetoType | null>(null)

  useEffect(() => {
    const fetchProjeto = async () => {
      try {
        if (id) {
          const data = await getProjetoById(id)
          setProjeto(data)
        }
      } catch (error) {
        toast.error(formatErrorMessage(error, 'Erro ao carregar projeto.'))
      }
    }

    fetchProjeto()
  }, [id])

  const tipoProjetoEstilo: Record<
    ProjetoType['tipo'],
    {
      badge: string
      icon: JSX.Element
    }
  > = {
    PESQUISA: {
      badge: 'bg-purple-100 text-purple-800',
      icon: <FlaskConical className="h-4 w-4" />,
    },
    ENSINO: {
      badge: 'bg-sky-200 text-sky-900',
      icon: <GraduationCap className="h-4 w-4" />,
    },
    EXTENSAO: {
      badge: 'bg-green-100 text-green-800',
      icon: <Users className="h-4 w-4" />,
    },
  }

  const renderParticipante = (p: ProjetoParticipanteType) => {
    if (p.tipo === 'ALUNO' && p.aluno) {
      return (
        <li key={p.id} className="border-b pb-2">
          <div className="flex items-start gap-3">
            <BookUser className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <strong>{p.aluno.nome}</strong>
                <Badge variant="outline" className="text-xs">
                  Aluno
                </Badge>
              </div>
              <div className="text-gray-700">{p.funcao}</div>
              <div className="text-xs text-gray-500">
                {p.aluno.curso} • Turma {p.aluno.turma}
              </div>
            </div>
          </div>
        </li>
      )
    } else if (p.tipo === 'SERVIDOR' && p.user) {
      return (
        <li key={p.id} className="border-b pb-2">
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <strong>{p.user.nome}</strong>
                <Badge variant="outline" className="text-xs">
                  {p.user.role === 'PROFESSOR' ? 'Professor' : 'Servidor'}
                </Badge>
              </div>
              <div className="text-gray-700">{p.funcao}</div>
              <div className="text-xs text-gray-500">{p.user.email}</div>
            </div>
          </div>
        </li>
      )
    }
    return null
  }

  if (!projeto) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar user={user} />
        <div className="py-20 text-center text-gray-600">
          Carregando projeto...
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar user={user} />

      <main className="flex-1 py-12 px-6">
        <section className="max-w-6xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-8 mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              {projeto.titulo}
            </h1>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  tipoProjetoEstilo[projeto.tipo].badge
                }`}
              >
                {tipoProjetoEstilo[projeto.tipo].icon}
                {projeto.tipo === 'PESQUISA'
                  ? 'Pesquisa'
                  : projeto.tipo === 'ENSINO'
                  ? 'Ensino'
                  : 'Extensão'}
              </span>
            </div>
          </div>

          <div className="p-6 rounded-lg shadow-sm mb-8 border">
            <h2 className="text-xl font-semibold text-green-700 mb-2">
              Descrição
            </h2>
            <p className="text-gray-700">{projeto.descricao}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-green-700 mb-4">
                Informações Institucionais
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>
                  <strong>Tipo:</strong> {projeto.tipo}
                </li>
                <li>
                  <strong>Status:</strong> {projeto.status}
                </li>
                <li>
                  <strong>Início:</strong>{' '}
                  {formatDate(new Date(projeto.dataInicio), 'dd/MM/yyyy')}
                </li>
                {projeto.dataFim && (
                  <li>
                    <strong>Conclusão:</strong>{' '}
                    {formatDate(new Date(projeto.dataFim), 'dd/MM/yyyy')}
                  </li>
                )}
              </ul>
            </div>

            <div className="p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-green-700 mb-4">
                Coordenador
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>
                  <strong>Nome:</strong> {projeto.coordenador.nome}
                </li>
                <li>
                  <strong>Email:</strong> {projeto.coordenador.email}
                </li>
              </ul>
            </div>
          </div>

          {projeto.participantes.length > 0 && (
            <div className="p-6 rounded-lg shadow-sm mb-8 border">
              <h3 className="text-lg font-semibold text-green-700 mb-4">
                Participantes ({projeto.participantes.length})
              </h3>
              <ul className="space-y-4">
                {projeto.participantes.map(renderParticipante)}
              </ul>
            </div>
          )}

          {projeto.imagens && projeto.imagens.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-green-700 mb-4">
                Imagens do projeto
              </h3>

              <Carousel className="w-full mx-auto">
                <CarouselContent>
                  {projeto.imagens.map((img) => (
                    <CarouselItem
                      key={img.id}
                      className="md:basis-1/2 lg:basis-1/3"
                    >
                      <Card className="p-0">
                        <CardContent className="p-0">
                          <img
                            src={`http://localhost:8080${img.url}`}
                            alt="Imagem do projeto"
                            className="rounded-md object-cover h-48 w-full"
                          />
                          {img.principal && (
                            <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                              Principal
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Projeto
