import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import ProductCard from '@/components/ProductCard';
import ContactForm from '@/components/ContactForm';
import CustomizationModal from '@/components/CustomizationModal';
import { 
  Flame, 
  Grid3X3, 
  Utensils, 
  Package, 
  Palette,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Star,
  Signature,
  Combine,
  Award,
  Clock
} from 'lucide-react';
import type { Product } from '@shared/schema';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [customizationProduct, setCustomizationProduct] = useState<Product | null>(null);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter((product: Product) => product.category === selectedCategory);

  const handleCustomize = (product: Product) => {
    setCustomizationProduct(product);
    setIsCustomizationOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const categories = [
    { id: 'cutting-boards', name: 'Tábuas de Corte', icon: Grid3X3, description: 'Diversos tamanhos' },
    { id: 'accessories', name: 'Acessórios', icon: Utensils, description: 'Para churrasco' },
    { id: 'sets', name: 'Kits Completos', icon: Package, description: 'Conjuntos especiais' },
    { id: 'custom', name: 'Personalizada', icon: Palette, description: 'Sob medida' },
  ];

  const testimonials = [
    {
      name: 'João Silva',
      text: 'A tábua personalizada ficou incrível! A qualidade da madeira é excepcional e a gravação do nosso nome ficou perfeita.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
    },
    {
      name: 'Maria Santos',
      text: 'O kit completo superou minhas expectativas. Os utensílios são muito bem feitos e a tábua tem um acabamento impecável.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face',
    },
    {
      name: 'Carlos Ferreira',
      text: 'Atendimento excepcional! Me ajudaram a escolher o tamanho ideal e a personalização ficou linda.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
    },
  ];

  return (
    <div className="bg-gray-50 font-inter">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-beige to-white py-16 lg:py-24">
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
                <Button 
                  onClick={() => scrollToSection('products')}
                  className="brand-primary hover:bg-brand-secondary px-8 py-4 text-lg transform hover:scale-105"
                >
                  Ver Produtos
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => scrollToSection('custom')}
                  className="border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white px-8 py-4 text-lg"
                >
                  Personalizar
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Tábua de madeira artesanal com acessórios para churrasco" 
                className="rounded-2xl shadow-2xl w-full h-auto transform rotate-3 hover:rotate-0 transition-transform duration-300" 
              />
              <div className="absolute -bottom-6 -left-6 bg-secondary text-white p-4 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm">Artesanal</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-poppins font-bold text-gray-900 mb-4">Nossas Categorias</h3>
            <p className="text-lg text-gray-600">Explore nossa linha completa de produtos artesanais</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <div 
                  key={category.id}
                  onClick={() => scrollToSection('products')}
                  className="group cursor-pointer"
                >
                  <div className="bg-gradient-to-br from-brand-beige to-white rounded-xl p-6 text-center transition-all group-hover:shadow-lg group-hover:scale-105">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary transition-colors">
                      <Icon className="text-white h-8 w-8" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{category.name}</h4>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product Catalog */}
      <section id="products" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-playfair font-bold text-gray-900 mb-4">Nossos Produtos</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cada peça é única, feita com carinho e atenção aos detalhes para garantir qualidade excepcional
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button
              onClick={() => setSelectedCategory('all')}
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              className={selectedCategory === 'all' ? 'brand-primary' : 'hover:border-brand-primary hover:text-brand-primary'}
            >
              Todos
            </Button>
            <Button
              onClick={() => setSelectedCategory('cutting-boards')}
              variant={selectedCategory === 'cutting-boards' ? 'default' : 'outline'}
              className={selectedCategory === 'cutting-boards' ? 'brand-primary' : 'hover:border-brand-primary hover:text-brand-primary'}
            >
              Tábuas de Corte
            </Button>
            <Button
              onClick={() => setSelectedCategory('accessories')}
              variant={selectedCategory === 'accessories' ? 'default' : 'outline'}
              className={selectedCategory === 'accessories' ? 'brand-primary' : 'hover:border-brand-primary hover:text-brand-primary'}
            >
              Acessórios
            </Button>
            <Button
              onClick={() => setSelectedCategory('sets')}
              variant={selectedCategory === 'sets' ? 'default' : 'outline'}
              className={selectedCategory === 'sets' ? 'brand-primary' : 'hover:border-brand-primary hover:text-brand-primary'}
            >
              Kits Completos
            </Button>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="w-full h-64 bg-gray-200 rounded-t-lg" />
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-3 bg-gray-200 rounded mb-4" />
                    <div className="h-6 bg-gray-200 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product: Product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onCustomize={handleCustomize}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Customization Section */}
      <section id="custom" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-playfair font-bold text-gray-900 mb-4">Personalização</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Torne seu produto único com nossas opções de personalização profissional
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Artesão trabalhando na personalização de tábua" 
                className="rounded-2xl shadow-2xl w-full h-auto" 
              />
              <div className="absolute -bottom-6 -right-6 bg-primary text-white p-6 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold">48h</div>
                  <div className="text-sm">Entrega</div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-gray-50 rounded-2xl p-8">
                <h4 className="text-2xl font-semibold text-gray-900 mb-6">Opções de Personalização</h4>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Signature className="text-white h-6 w-6" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Gravação de Nome/Logo</h5>
                      <p className="text-gray-600">Personalize com seu nome, logotipo ou frase especial</p>
                      <span className="text-brand-primary font-medium">+ R$ 25,00</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Combine className="text-white h-6 w-6" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Tamanhos Customizados</h5>
                      <p className="text-gray-600">Dimensões especiais para suas necessidades específicas</p>
                      <span className="text-brand-primary font-medium">+ R$ 35,00</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Palette className="text-white h-6 w-6" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Acabamentos Especiais</h5>
                      <p className="text-gray-600">Verniz premium, bordas arredondadas ou detalhes únicos</p>
                      <span className="text-brand-primary font-medium">+ R$ 45,00</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => setIsCustomizationOpen(true)}
                  className="w-full mt-8 brand-primary hover:bg-brand-secondary py-4 transform hover:scale-105"
                >
                  <Palette className="mr-2 h-4 w-4" />
                  Iniciar Personalização
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Order Management */}
      <section id="orders" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-playfair font-bold text-gray-900 mb-4">Acompanhe Seus Pedidos</h3>
            <p className="text-lg text-gray-600">Sistema moderno de gestão de pedidos substituindo o WhatsApp</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Em Produção</h4>
              <p className="text-gray-600">Produtos sendo confeccionados com cuidado</p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Enviados</h4>
              <p className="text-gray-600">A caminho do seu endereço</p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Entregues</h4>
              <p className="text-gray-600">Produto recebido com sucesso</p>
            </Card>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <h4 className="text-2xl font-semibold text-gray-900 mb-4">Controle Total dos Seus Pedidos</h4>
            <p className="text-gray-600 mb-6">
              Acompanhe em tempo real o status dos seus pedidos, desde a confirmação até a entrega. 
              Sem mais confusão no WhatsApp!
            </p>
            <Button className="brand-primary hover:bg-brand-secondary">
              Fazer Primeiro Pedido
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-playfair font-bold text-gray-900 mb-4">O Que Nossos Clientes Dizem</h3>
            <p className="text-lg text-gray-600">Depoimentos reais de quem já transformou seus churrascos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-50 hover:shadow-lg transition-all">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4" 
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">Cliente verificado</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-playfair font-bold text-gray-900 mb-4">Entre em Contato</h3>
            <p className="text-lg text-gray-600">Dúvidas, sugestões ou pedidos especiais? Estamos aqui para ajudar!</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h4 className="text-2xl font-semibold text-gray-900 mb-6">Informações de Contato</h4>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="text-white h-6 w-6" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-1">Telefone</h5>
                      <p className="text-gray-600">(11) 99999-9999</p>
                      <p className="text-sm text-gray-500">Segunda a Sexta, 8h às 18h</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="text-white h-6 w-6" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-1">WhatsApp</h5>
                      <p className="text-gray-600">(11) 99999-9999</p>
                      <p className="text-sm text-gray-500">Disponível 24 horas</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="text-white h-6 w-6" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-1">Email</h5>
                      <p className="text-gray-600">contato@spoilerdochurrasco.com</p>
                      <p className="text-sm text-gray-500">Resposta em até 24h</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-white h-6 w-6" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-1">Localização</h5>
                      <p className="text-gray-600">São Paulo, SP</p>
                      <p className="text-sm text-gray-500">Entregamos para todo o Brasil</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h4 className="text-2xl font-semibold text-gray-900 mb-6">Redes Sociais</h4>
                <div className="flex space-x-4">
                  <a href="#" className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                    <Facebook className="h-6 w-6" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors">
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700 transition-colors">
                    <MessageCircle className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-playfair font-bold text-secondary mb-4 flex items-center">
                <Flame className="mr-2 h-6 w-6" />
                Spoiler do Churrasco
              </h3>
              <p className="text-gray-300 mb-6">
                Produtos artesanais únicos para transformar seus churrascos em experiências inesquecíveis.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('home')} className="text-gray-300 hover:text-secondary transition-colors">Início</button></li>
                <li><button onClick={() => scrollToSection('products')} className="text-gray-300 hover:text-secondary transition-colors">Produtos</button></li>
                <li><button onClick={() => scrollToSection('custom')} className="text-gray-300 hover:text-secondary transition-colors">Personalização</button></li>
                <li><button onClick={() => scrollToSection('orders')} className="text-gray-300 hover:text-secondary transition-colors">Pedidos</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-secondary transition-colors">Contato</button></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Categorias</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-secondary transition-colors">Tábuas de Corte</a></li>
                <li><a href="#" className="text-gray-300 hover:text-secondary transition-colors">Acessórios</a></li>
                <li><a href="#" className="text-gray-300 hover:text-secondary transition-colors">Kits Completos</a></li>
                <li><a href="#" className="text-gray-300 hover:text-secondary transition-colors">Personalizada</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
              <p className="text-gray-300 mb-4">Receba novidades e ofertas especiais</p>
              <form className="space-y-3">
                <Input 
                  type="email" 
                  placeholder="Seu email" 
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
                <Button type="submit" className="w-full brand-primary hover:bg-brand-secondary">
                  Inscrever-se
                </Button>
              </form>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Spoiler do Churrasco. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-secondary text-sm transition-colors">Política de Privacidade</a>
              <a href="#" className="text-gray-400 hover:text-secondary text-sm transition-colors">Termos de Uso</a>
              <a href="#" className="text-gray-400 hover:text-secondary text-sm transition-colors">FAQ</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Customization Modal */}
      <CustomizationModal
        product={customizationProduct}
        isOpen={isCustomizationOpen}
        onClose={() => {
          setIsCustomizationOpen(false);
          setCustomizationProduct(null);
        }}
      />
    </div>
  );
}
