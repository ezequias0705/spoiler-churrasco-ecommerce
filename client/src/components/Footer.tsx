export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-playfair font-bold text-brand-secondary mb-4">
              <i className="fas fa-fire mr-2"></i>
              Spoiler do Churrasco
            </h3>
            <p className="text-gray-300 mb-6">
              Produtos artesanais únicos para transformar seus churrascos em experiências inesquecíveis.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-primary transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-primary transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-primary transition-colors">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('hero')}
                  className="text-gray-300 hover:text-brand-secondary transition-colors"
                >
                  Início
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('products')}
                  className="text-gray-300 hover:text-brand-secondary transition-colors"
                >
                  Produtos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('custom')}
                  className="text-gray-300 hover:text-brand-secondary transition-colors"
                >
                  Personalização
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('orders')}
                  className="text-gray-300 hover:text-brand-secondary transition-colors"
                >
                  Meus Pedidos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-gray-300 hover:text-brand-secondary transition-colors"
                >
                  Contato
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categorias</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-brand-secondary transition-colors">Tábuas de Corte</a></li>
              <li><a href="#" className="text-gray-300 hover:text-brand-secondary transition-colors">Acessórios</a></li>
              <li><a href="#" className="text-gray-300 hover:text-brand-secondary transition-colors">Kits Completos</a></li>
              <li><a href="#" className="text-gray-300 hover:text-brand-secondary transition-colors">Personalizada</a></li>
            </ul>
          </div>

          {/* Company Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Spoiler do Churrasco</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center">
                <i className="fas fa-envelope mr-3"></i>
                <span>contato@spoilerdochurrasco.com</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-phone mr-3"></i>
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-map-marker-alt mr-3"></i>
                <span>São Paulo, SP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Spoiler do Churrasco. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-brand-secondary text-sm transition-colors">Política de Privacidade</a>
            <a href="#" className="text-gray-400 hover:text-brand-secondary text-sm transition-colors">Termos de Uso</a>
            <a href="#" className="text-gray-400 hover:text-brand-secondary text-sm transition-colors">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
