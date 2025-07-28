import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
import type { ProjetoType, UserType } from '@/utils/types'
import { useLocation, useParams } from 'react-router-dom'
import { useEffect, useState, type JSX } from 'react'
import toast from 'react-hot-toast'
import { formatErrorMessage } from '@/utils/format'
import { formatDate } from 'date-fns'
import { getProjetoByUrl } from '@/api/apiProjeto'
import { FlaskConical, GraduationCap, Users } from 'lucide-react'

const Projeto = () => {
  const { url } = useParams()
  const location = useLocation()
  const user = location.state as UserType | undefined

  const [projeto, setProjeto] = useState<ProjetoType | null>(null)

  useEffect(() => {
    const fetchProjeto = async () => {
      try {
        if (url) {
          const data = await getProjetoByUrl(url)
          setProjeto(data)
        }
      } catch (error) {
        toast.error(formatErrorMessage(error, 'Erro ao carregar projeto.'))
      }
    }

    fetchProjeto()
  }, [url])

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
          {projeto.imagem?.url && (
            <div className="mb-8">
              <img
                src={`${projeto.imagem.url}`}
                alt={`Imagem do projeto ${projeto.titulo}`}
                className="rounded-lg w-full h-72 object-cover shadow"
              />
            </div>
          )}

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
                Participantes
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                {projeto.participantes.map((p) => (
                  <li key={p.aluno.id} className="border-b pb-2">
                    <strong>{p.aluno.nome}</strong> – {p.funcao}
                    <div className="text-xs text-gray-500">
                      {p.aluno.curso} • Turma {p.aluno.turma}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Projeto
