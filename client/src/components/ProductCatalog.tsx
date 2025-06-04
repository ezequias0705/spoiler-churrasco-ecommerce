import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

interface ProductCatalogProps {
  onCustomizationClick: (productId: number) => void;
}

export default function ProductCatalog({ onCustomizationClick }: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/products', selectedCategory],
    queryFn: async () => {
      const response = await fetch(`/api/products?category=${selectedCategory}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    }
  });

  const categories = [
    { id: "all", name: "Todos", icon: "fas fa-th" },
    { id: "cutting-boards", name: "Tábuas de Corte", icon: "fas fa-th-large" },
    { id: "accessories", name: "Acessórios", icon: "fas fa-utensils" },
    { id: "sets", name: "Kits Completos", icon: "fas fa-box-open" }
  ];

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id, 1);
      toast({
        title: "Produto adicionado!",
        description: `${product.name} foi adicionado ao carrinho.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto ao carrinho.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Disponível</span>;
      case "limited":
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">Últimas peças</span>;
      default:
        return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">Esgotado</span>;
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando produtos...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h3 className="text-4xl font-playfair font-bold text-gray-900 mb-4">Nossos Produtos</h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cada peça é única, feita com carinho e atenção aos detalhes para garantir qualidade excepcional
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                selectedCategory === category.id
                  ? "bg-brand-primary text-white"
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-brand-primary hover:text-brand-primary"
              }`}
            >
              <i className={`${category.icon} mr-2`}></i>
              {category.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product: Product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300" 
                />
                <div className="absolute top-4 right-4">
                  {getStatusBadge(product.status)}
                </div>
                <button className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all">
                  <i className="far fa-heart text-brand-primary"></i>
                </button>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h4>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-brand-primary">
                    R$ {parseFloat(product.price).toFixed(2).replace('.', ',')}
                  </div>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    disabled={product.status === 'out-of-stock'}
                    className="bg-brand-primary hover:bg-brand-secondary text-white px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="fas fa-cart-plus mr-2"></i>Adicionar
                  </button>
                </div>
                {product.isCustomizable && (
                  <button 
                    onClick={() => onCustomizationClick(product.id)}
                    className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all"
                  >
                    <i className="fas fa-palette mr-2"></i>Personalizar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
            <h4 className="text-xl font-semibold text-gray-600 mb-2">Nenhum produto encontrado</h4>
            <p className="text-gray-500">Tente selecionar uma categoria diferente.</p>
          </div>
        )}
      </div>
    </section>
  );
}
