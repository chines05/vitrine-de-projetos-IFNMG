import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Search,
  ArrowRight,
  FlaskConical,
  Users,
  Leaf,
  Laptop,
  GraduationCap,
  CircleDashed,
  Award,
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

const Home = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const stats = [
    { value: '20+', label: 'Projetos ativos' },
    { value: '15+', label: 'Coordenadores envolvidos' },
    { value: '100+', label: 'Alunos envolvidos' },
  ]

  const projectCategories = [
    {
      id: 'pesquisa',
      name: 'Pesquisa',
      icon: <FlaskConical className="h-5 w-5" />,
      color: 'bg-purple-100 text-purple-800',
    },
    {
      id: 'ensino',
      name: 'Ensino',
      icon: <GraduationCap className="h-5 w-5" />,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'extensao',
      name: 'Extensão',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-green-100 text-green-800',
    },
  ]

  const featuredProjects = [
    {
      id: 'agricultura-sustentavel',
      title: 'Agricultura Sustentável no Semiárido',
      excerpt:
        'Desenvolvimento de técnicas inovadoras para cultivo em regiões de seca, visando aumentar a produtividade com menor impacto ambiental.',
      category: 'pesquisa',
      tags: ['Sustentabilidade', 'Inovação', 'Agronomia'],
      highlight: true,
      icon: <Leaf className="h-5 w-5" />,
    },
    {
      id: 'educacao-digital',
      title: 'Educação Digital para Terceira Idade',
      excerpt:
        'Inclusão digital de idosos através de metodologias adaptadas, promovendo autonomia e conexão com familiares.',
      category: 'extensao',
      tags: ['Tecnologia', 'Inclusão', 'Comunidade'],
      highlight: false,
      icon: <Laptop className="h-5 w-5" />,
    },
    {
      id: 'metodologias-ativas',
      title: 'Metodologias Ativas de Aprendizagem',
      excerpt:
        'Implementação de novas abordagens pedagógicas para engajar estudantes e melhorar os resultados educacionais.',
      category: 'ensino',
      tags: ['Educação', 'Inovação', 'Pedagogia'],
      highlight: true,
      icon: <CircleDashed className="h-5 w-5" />,
    },
    {
      id: 'energia-renovavel',
      title: 'Energias Renováveis em Comunidades Rurais',
      excerpt:
        'Instalação de sistemas de energia solar em comunidades isoladas, promovendo desenvolvimento sustentável.',
      category: 'pesquisa',
      tags: ['Energia', 'Sustentabilidade', 'Engenharia'],
      highlight: false,
      icon: <CircleDashed className="h-5 w-5" />,
    },
    {
      id: 'saude-comunitaria',
      title: 'Programa de Saúde Comunitária',
      excerpt:
        'Oferta de serviços básicos de saúde e orientação para populações em situação de vulnerabilidade.',
      category: 'extensao',
      tags: ['Saúde', 'Comunidade', 'Prevenção'],
      highlight: true,
      icon: <CircleDashed className="h-5 w-5" />,
    },
    {
      id: 'robotica-educacional',
      title: 'Robótica Educacional nas Escolas Públicas',
      excerpt:
        'Introdução de conceitos de robótica e programação para estudantes do ensino fundamental.',
      category: 'ensino',
      tags: ['Tecnologia', 'Educação', 'Inovação'],
      highlight: false,
      icon: <CircleDashed className="h-5 w-5" />,
    },
  ]

  const filteredProjects = featuredProjects.filter((project) => {
    const categoryMatch =
      selectedCategory === 'all' || project.category === selectedCategory

    const searchMatch =
      !searchTerm ||
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )

    return categoryMatch && searchMatch
  })

  return (
    <main id="home" className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />

      <div className="relative h-[70vh] w-full">
        <div className="absolute inset-0 z-0">
          <img
            src={campusImage}
            alt=""
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute bg-black opacity-30 inset-0 z-0" />
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                Conhecimento que transforma realidades
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                Descubra os projetos de ensino, pesquisa e extensão que estão
                mudando o Norte de Minas
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() =>
                    document
                      .getElementById('projects-grid')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="max-w-max bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
                  size="lg"
                >
                  <Search className="h-5 w-5" />
                  Explorar Projetos
                </Button>
                <Button
                  onClick={() => navigate('/login')}
                  variant="unstyled"
                  className="max-w-max bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all transform hover:scale-105"
                  size="lg"
                >
                  <BookOpen className="h-5 w-5" />
                  Área do Pesquisador
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-20 -mt-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
              >
                <span className="block text-4xl font-bold text-green-600 mb-2">
                  {stat.value}
                </span>
                <span className="text-gray-600">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main id="projetos" className="flex-1 py-16">
        <section className="container mx-auto px-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Encontre projetos
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Buscar por título, descrição ou palavras-chave..."
                    className="pl-10 w-full h-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full">
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
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
                  selectedCategory === 'all'
                    ? 'bg-gray-200 text-gray-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
                onClick={() => setSelectedCategory('all')}
                variant="unstyled"
              >
                <CircleDashed className="h-5 w-5" />
                Todos
              </Button>
              {projectCategories.map((category) => (
                <Button
                  key={category.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? category.color
                      : 'bg-gray-100 text-gray-600'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                  variant="unstyled"
                >
                  {category.icon}
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Projetos em Destaque
            </h2>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <p className="text-gray-600">
                Nenhum projeto encontrado com os filtros selecionados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all h-full flex flex-col border border-gray-100"
                >
                  {project.highlight && (
                    <div className="bg-yellow-100 text-yellow-800 px-4 py-2 text-sm font-medium flex items-center">
                      <Award className="h-4 w-4 mr-2" />
                      Projeto em Destaque
                    </div>
                  )}

                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 ${
                          projectCategories.find(
                            (c) => c.id === project.category
                          )?.color
                        }`}
                      >
                        {
                          projectCategories.find(
                            (c) => c.id === project.category
                          )?.icon
                        }
                        {
                          projectCategories.find(
                            (c) => c.id === project.category
                          )?.name
                        }
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {project.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <Button
                      variant="link"
                      className="text-green-600 p-0 h-auto"
                      onClick={() => navigate(`/projeto/${project.id}`)}
                    >
                      <span className="flex items-center gap-1">
                        Saiba mais
                        <ArrowRight className="h-4 w-4" />
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
    </main>
  )
}

export default Home
