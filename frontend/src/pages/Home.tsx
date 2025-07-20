import { Link, useNavigate } from 'react-router-dom'
import campusImage from '/background.jpg'
import NavBar from '@/components/NavBar'
import { Button } from '@/components/ui/button'
import Footer from '@/components/Footer'

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

const Home = () => {
  const navigate = useNavigate()

  const handleScrollToProjetos = () => {
    const target = document.getElementById('projetos')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div id="home" className="min-h-screen">
      <NavBar />

      <div className="relative h-[80vh] w-full">
        <img
          src={campusImage}
          alt="Campus IFNMG"
          className="w-full h-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/40 flex flex-col items-center justify-center px-4 text-center">
          <div className="max-w-4xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight animate-fade-in">
              Inovação que transforma realidades
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto animate-fade-in delay-100">
              Conheça os projetos do IFNMG de ensino, pesquisa e extensão que
              estão moldando o futuro do Norte de Minas
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-8 animate-fade-in delay-200">
              <Button
                onClick={handleScrollToProjetos}
                className="max-w-max bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
                size="lg"
              >
                Explorar Projetos
              </Button>

              <Button
                onClick={() => navigate('/login')}
                className="max-w-max bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all transform hover:scale-105"
                size="lg"
              >
                Área do Pesquisador
              </Button>
            </div>
          </div>
          <div id="projetos" />
        </div>
      </div>

      <section className="py-12 px-6 max-w-6xl mx-auto">
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

      <Footer />
    </div>
  )
}

export default Home
