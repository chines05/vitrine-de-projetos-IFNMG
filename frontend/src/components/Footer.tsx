import { Link } from 'react-router-dom'
import { Mail, Instagram, Linkedin, MapPin, Phone } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#2f9e41] to-[#1BA863] text-white pt-8 pb-4">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              Vitrine de Projetos | IFNMG
            </h3>
            <p className="text-white/80 text-sm">
              Plataforma oficial de projetos de ensino, pesquisa e extensão do
              IFNMG.
            </p>
            <div className="flex gap-3 mt-2">
              <a
                href="https://www.instagram.com/almenara_ifnmg/"
                className="text-white hover:text-white/80"
                target="_blank"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/instituto-federal-do-norte-de-minas-gerais-ifnmg/"
                className="text-white hover:text-white/80"
                target="_blank"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Contato</h4>
            <ul className="space-y-2 text-white/80 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                Rodovia BR 367, Zona Rural - Almenara/MG
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                comunicacao.almenara@ifnmg.edu.br
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                (038) 3218-7385
              </li>
            </ul>
          </div>
        </div>

        <div className="h-px w-full bg-white/10 mb-4" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-white/60 text-xs">
          <p>
            © {new Date().getFullYear()} IFNMG - Todos os direitos reservados
          </p>
          <div className="flex gap-3">
            <Link
              to="/politica-de-privacidade"
              className="hover:text-white transition-colors"
            >
              Política de Privacidade
            </Link>
            <Link
              to="/termos-de-uso"
              className="hover:text-white transition-colors"
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
