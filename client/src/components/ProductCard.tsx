import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/lib/cart';
import { Heart, Palette, ShoppingCart } from 'lucide-react';
import type { Product } from '@shared/schema';

interface ProductCardProps {
  product: Product;
  onCustomize: (product: Product) => void;
}

export default function ProductCard({ product, onCustomize }: ProductCardProps) {
  const { addItem } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    addItem({
      id: Date.now(),
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      quantity: 1,
      imageUrl: product.imageUrl,
    });

    // Show feedback
    setTimeout(() => setIsAdding(false), 1000);
  };

  const getStatusBadge = () => {
    if (!product.inStock) {
      return <Badge variant="destructive">Esgotado</Badge>;
    }
    if (product.featured) {
      return <Badge className="bg-red-500 text-white">Mais vendido</Badge>;
    }
    return <Badge variant="secondary" className="bg-brand-success text-white">Disponível</Badge>;
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
      <div className="relative overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          {getStatusBadge()}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm hover:bg-white transition-all"
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-brand-primary'}`} />
        </Button>
      </div>
      
      <CardContent className="p-6">
        <h4 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h4>
        <p className="text-gray-600 mb-4">{product.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold text-brand-primary">
            R$ {parseFloat(product.price).toFixed(2).replace('.', ',')}
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding}
            className="brand-primary hover:bg-brand-secondary transform hover:scale-105"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isAdding ? 'Adicionado!' : 'Adicionar'}
          </Button>
        </div>
        
        <Button
          variant="outline"
          onClick={() => onCustomize(product)}
          className="w-full hover:bg-gray-200 text-gray-700"
        >
          <Palette className="mr-2 h-4 w-4" />
          Personalizar
        </Button>
      </CardContent>
    </Card>
  );
}
