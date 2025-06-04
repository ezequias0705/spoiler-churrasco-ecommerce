import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/lib/cart';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Bookmark } from 'lucide-react';
import type { Product, Customization } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';

interface CustomizationModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

interface CustomizationState {
  engraving: {
    type: 'none' | 'text' | 'logo';
    text: string;
  };
  size: {
    enabled: boolean;
    width: number;
    height: number;
  };
  finishes: {
    premium: boolean;
    rounded: boolean;
    support: boolean;
  };
  instructions: string;
}

export default function CustomizationModal({ product, isOpen, onClose }: CustomizationModalProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const [customization, setCustomization] = useState<CustomizationState>({
    engraving: { type: 'none', text: '' },
    size: { enabled: false, width: 60, height: 40 },
    finishes: { premium: false, rounded: false, support: false },
    instructions: '',
  });

  const { data: customizationOptions } = useQuery({
    queryKey: ['/api/customizations', product?.id],
    enabled: !!product,
  });

  const calculateAdditionalCost = () => {
    let cost = 0;
    
    if (customization.engraving.type !== 'none') cost += 25;
    if (customization.size.enabled) cost += 35;
    
    const finishCount = Object.values(customization.finishes).filter(Boolean).length;
    if (finishCount > 0) cost += 45;
    
    return cost;
  };

  const getTotalPrice = () => {
    if (!product) return 0;
    return parseFloat(product.price) + calculateAdditionalCost();
  };

  const handleAddToCart = () => {
    if (!product) return;

    const customizations = {
      engraving: customization.engraving.text,
      size: customization.size.enabled ? {
        width: customization.size.width,
        height: customization.size.height,
      } : undefined,
      finishes: Object.entries(customization.finishes)
        .filter(([_, enabled]) => enabled)
        .map(([name]) => name),
      instructions: customization.instructions,
      additionalCost: calculateAdditionalCost(),
    };

    addItem({
      id: Date.now(),
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      quantity: 1,
      imageUrl: product.imageUrl,
      customizations,
    });

    toast({
      title: 'Produto personalizado adicionado!',
      description: 'O item foi adicionado ao seu carrinho com as personalizações selecionadas.',
    });

    onClose();
  };

  const handleSaveCustomization = () => {
    toast({
      title: 'Personalização salva!',
      description: 'Suas personalizações foram salvas para uso futuro.',
    });
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Personalizar Produto</DialogTitle>
          <DialogDescription>
            Configure as opções de personalização para seu produto artesanal
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          {/* Product Preview */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-64 object-cover rounded-xl mb-4"
              />
              <div className="text-lg font-semibold text-brand-primary">
                Preview da Personalização
              </div>
            </div>
          </div>

          {/* Customization Options */}
          <div className="space-y-6">
            {/* Product Selection */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Produto Base</Label>
              <Select disabled value={product.id.toString()}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder={`${product.name} - R$ ${parseFloat(product.price).toFixed(2).replace('.', ',')}`} />
                </SelectTrigger>
              </Select>
            </div>

            {/* Size Customization */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Checkbox
                  id="size-custom"
                  checked={customization.size.enabled}
                  onCheckedChange={(checked) =>
                    setCustomization(prev => ({
                      ...prev,
                      size: { ...prev.size, enabled: !!checked }
                    }))
                  }
                />
                <Label htmlFor="size-custom" className="text-sm font-medium text-gray-700">
                  Dimensões Customizadas (+ R$ 35,00)
                </Label>
              </div>
              {customization.size.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-xs text-gray-600 mb-1">Largura (cm)</Label>
                    <Input
                      type="number"
                      value={customization.size.width}
                      onChange={(e) =>
                        setCustomization(prev => ({
                          ...prev,
                          size: { ...prev.size, width: parseInt(e.target.value) || 0 }
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label className="block text-xs text-gray-600 mb-1">Altura (cm)</Label>
                    <Input
                      type="number"
                      value={customization.size.height}
                      onChange={(e) =>
                        setCustomization(prev => ({
                          ...prev,
                          size: { ...prev.size, height: parseInt(e.target.value) || 0 }
                        }))
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Engraving Options */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3">Gravação (+ R$ 25,00)</Label>
              <RadioGroup
                value={customization.engraving.type}
                onValueChange={(value: 'none' | 'text' | 'logo') =>
                  setCustomization(prev => ({
                    ...prev,
                    engraving: { ...prev.engraving, type: value }
                  }))
                }
                className="space-y-4 mt-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none">Sem gravação</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="text" id="text" />
                  <Label htmlFor="text">Texto personalizado</Label>
                </div>
                {customization.engraving.type === 'text' && (
                  <Input
                    placeholder="Digite seu texto aqui..."
                    value={customization.engraving.text}
                    onChange={(e) =>
                      setCustomization(prev => ({
                        ...prev,
                        engraving: { ...prev.engraving, text: e.target.value }
                      }))
                    }
                    className="ml-6"
                  />
                )}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="logo" id="logo" />
                  <Label htmlFor="logo">Logo/Imagem</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Finishing Options */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3">Acabamentos (+ R$ 45,00)</Label>
              <div className="space-y-3 mt-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="premium"
                    checked={customization.finishes.premium}
                    onCheckedChange={(checked) =>
                      setCustomization(prev => ({
                        ...prev,
                        finishes: { ...prev.finishes, premium: !!checked }
                      }))
                    }
                  />
                  <Label htmlFor="premium">Verniz premium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rounded"
                    checked={customization.finishes.rounded}
                    onCheckedChange={(checked) =>
                      setCustomization(prev => ({
                        ...prev,
                        finishes: { ...prev.finishes, rounded: !!checked }
                      }))
                    }
                  />
                  <Label htmlFor="rounded">Bordas arredondadas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="support"
                    checked={customization.finishes.support}
                    onCheckedChange={(checked) =>
                      setCustomization(prev => ({
                        ...prev,
                        finishes: { ...prev.finishes, support: !!checked }
                      }))
                    }
                  />
                  <Label htmlFor="support">Suporte embutido</Label>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3">Instruções Especiais</Label>
              <Textarea
                rows={3}
                placeholder="Alguma observação especial para seu produto..."
                value={customization.instructions}
                onChange={(e) =>
                  setCustomization(prev => ({ ...prev, instructions: e.target.value }))
                }
                className="resize-none mt-2"
              />
            </div>

            {/* Price Summary */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Preço</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Produto base:</span>
                  <span>R$ {parseFloat(product.price).toFixed(2).replace('.', ',')}</span>
                </div>
                {customization.size.enabled && (
                  <div className="flex justify-between text-gray-600">
                    <span>Dimensões customizadas:</span>
                    <span>R$ 35,00</span>
                  </div>
                )}
                {customization.engraving.type !== 'none' && (
                  <div className="flex justify-between text-gray-600">
                    <span>Gravação:</span>
                    <span>R$ 25,00</span>
                  </div>
                )}
                {Object.values(customization.finishes).some(Boolean) && (
                  <div className="flex justify-between text-gray-600">
                    <span>Acabamentos:</span>
                    <span>R$ 45,00</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between text-xl font-bold text-brand-primary">
                  <span>Total:</span>
                  <span>R$ {getTotalPrice().toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 brand-primary hover:bg-brand-secondary py-4"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Adicionar ao Carrinho
              </Button>
              <Button
                variant="outline"
                onClick={handleSaveCustomization}
                className="px-6 py-4"
              >
                <Bookmark className="mr-2 h-4 w-4" />
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
