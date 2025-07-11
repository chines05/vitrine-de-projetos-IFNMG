import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Home,
  ScrollText,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  LogIn,
} from 'lucide-react'

const Footer = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleScrollToProjetos = () => {
    if (location.pathname.startsWith('/projeto/')) {
      navigate('/')

      return
    }

    const target = document.getElementById('projetos')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="bg-gradient-to-r from-[#2f9e41] to-[#1BA863] text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">Vitrine de Projetos | IFNMG</h3>
            </div>
            <p className="text-white/80">
              Plataforma oficial de projetos de ensino, pesquisa e extensão do
              IFNMG.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-white hover:text-white/80 transition-colors"
                target="_blank"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/almenara_ifnmg/"
                className="text-white hover:text-white/80 transition-colors"
                target="_blank"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/gabrielporto05/"
                className="text-white hover:text-white/80 transition-colors"
                target="_blank"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <Home className="h-4 w-4" />
                  Início
                </Link>
              </li>
              <li>
                <Link
                  to=""
                  onClick={handleScrollToProjetos}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <ScrollText className="h-4 w-4" />
                  Projetos
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  Área do Pesquisador
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span className="text-white/80">
                  Rodovia BR 367 Almenara/Jequitinhonha, km 111, Zona Rural,
                  Almenara-MG, CEP:39900-000
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 mt-1 flex-shrink-0" />
                <span className="text-white/80">
                  comunicacao.almenara@ifnmg.edu.br
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 mt-1 flex-shrink-0" />
                <span className="text-white/80">(038) 3218-7385</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} IFNMG - Todos os direitos reservados
          </p>
          <div className="flex gap-4">
            <Link
              to="/politica-de-privacidade"
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              Política de Privacidade
            </Link>
            <Link
              to="/termos-de-uso"
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
