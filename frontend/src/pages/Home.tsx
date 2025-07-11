import { Link } from 'react-router-dom'
import campusImage from '/background.jpg'
import NavBar from '@/components/NavBar'

const Home = () => {
  const projetos = [
    {
      id: 'agricultura-sustentavel',
      titulo: 'Agricultura Sustentável no Semiárido',
      descricao: 'Técnicas inovadoras para cultivo em regiões de seca...',
      imagem: campusImage,
    },
    {
      id: 'energia-renovavel',
      titulo: 'Energias Renováveis em Comunidades Rurais',
      descricao: 'Implementação de sistemas fotovoltaicos em áreas remotas...',
      imagem: campusImage,
    },
    {
      id: 'educacao-digital',
      titulo: 'Educação Digital para Terceira Idade',
      descricao:
        'Inclusão digital de idosos através de metodologias adaptadas...',
      imagem: campusImage,
    },
  ]

  return (
    <div className="min-h-screen">
      <NavBar />

      <div className="relative h-[50vh] w-full">
        <img
          src={campusImage}
          alt="Campus IFNMG"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0  bg-opacity-30 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white text-center">
            Conheça nossos projetos de Ensino, Pesquisa e Extensão
          </h1>
        </div>
      </div>

      <section id="projetos" className="py-12 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Projetos em Destaque
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projetos.map((projeto) => (
            <div
              key={projeto.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={projeto.imagem}
                alt={projeto.titulo}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{projeto.titulo}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {projeto.descricao}
                </p>
                <Link
                  to={`/projeto/${projeto.id}`}
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Saber mais
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
