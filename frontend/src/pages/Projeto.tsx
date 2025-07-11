import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
import { Link, useParams } from 'react-router-dom'

const Projeto = () => {
  const { urlid } = useParams()

  const projetos = [
    {
      id: 'agricultura-sustentavel',
      titulo: 'Agricultura Sustentável no Semiárido',
      descricao: 'Descrição completa do projeto...',
      imagem: '/projeto1.jpg',
      coordenador: 'Prof. João Silva',
      area: 'Agronomia',
      campus: 'Januária',
    },
    {
      id: 'energia-renovavel',
      titulo: 'Energias Renováveis em Comunidades Rurais',
      descricao: 'Descrição completa do projeto...',
      imagem: '/projeto2.jpg',
      coordenador: 'Prof. Maria Souza',
      area: 'Engenharia de Energia',
      campus: 'Patos de Minas',
    },
    {
      id: 'educacao-digital',
      titulo: 'Educação Digital para Terceira Idade',
      descricao: 'Descrição completa do projeto...',
      imagem: '/projeto3.jpg',
      coordenador: 'Prof. Carlos Oliveira',
      area: 'Tecnologia da Informação',
      campus: 'Patos de Minas',
    },
  ]

  const projeto = projetos.find((p) => p.id === urlid)

  if (!projeto) {
    return <div>Projeto não encontrado</div>
  }

  return (
    <div className="min-h-screen ">
      <NavBar />
      <div className="bg-white rounded-lg shadow-lg overflow-hidden py-12 px-6 max-w-4xl mx-auto mt-20">
        <img
          src={projeto.imagem}
          alt={projeto.titulo}
          className="w-full h-64 object-cover"
        />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4">{projeto.titulo}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Sobre o Projeto</h2>
              <p className="text-gray-700">{projeto.descricao}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Detalhes</h2>
              <ul className="space-y-2">
                <li>
                  <strong>Coordenador:</strong> {projeto.coordenador}
                </li>
                <li>
                  <strong>Área:</strong> {projeto.area}
                </li>
                <li>
                  <strong>Campus:</strong> {projeto.campus}
                </li>
              </ul>
            </div>
          </div>

          <Link
            to="/"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition-colors"
          >
            Voltar para projetos
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Projeto
