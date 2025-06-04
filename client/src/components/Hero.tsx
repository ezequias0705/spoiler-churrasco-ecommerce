interface HeroProps {
  onCustomizationClick: () => void;
}

export default function Hero({ onCustomizationClick }: HeroProps) {
  const scrollToProducts = () => {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative bg-gradient-to-br from-brand-beige to-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl lg:text-6xl font-playfair font-bold text-gray-900 mb-6">
              Tábuas Artesanais
              <span className="block text-brand-primary">Para Seu Churrasco</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Produtos únicos e personalizados, feitos à mão com madeira de qualidade premium. 
              Transforme seus churrascos em experiências inesquecíveis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={scrollToProducts}
                className="bg-brand-primary hover:bg-brand-secondary text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Ver Produtos
              </button>
              <button 
                onClick={onCustomizationClick}
                className="border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white px-8 py-4 rounded-lg font-semibold transition-all"
              >
                Personalizar
              </button>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Tábua de madeira artesanal com acessórios para churrasco" 
              className="rounded-2xl shadow-2xl w-full h-auto transform rotate-3 hover:rotate-0 transition-transform duration-300" 
            />
            <div className="absolute -bottom-6 -left-6 bg-brand-secondary text-white p-4 rounded-xl shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm">Artesanal</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
