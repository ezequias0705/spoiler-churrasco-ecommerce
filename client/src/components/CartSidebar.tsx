import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/lib/cart';
import { Minus, Plus, Trash2, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { CustomerInfo } from '@/lib/types';

export default function CartSidebar() {
  const { 
    items, 
    isOpen, 
    closeCart, 
    removeItem, 
    updateQuantity, 
    getSubtotal, 
    getTotal,
    clearCart 
  } = useCart();
  
  const [couponCode, setCouponCode] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { toast } = useToast();

  const subtotal = getSubtotal();
  const shipping = subtotal > 200 ? 0 : 15;
  const total = getTotal();

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsCheckingOut(true);
    
    try {
      // In a real app, you'd collect customer info first
      const customerInfo: CustomerInfo = {
        name: 'Cliente Web',
        email: 'cliente@email.com',
        phone: '',
      };

      const orderData = {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        total: total.toString(),
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: (item.price + (item.customizations?.additionalCost || 0)).toString(),
          customizations: item.customizations ? JSON.stringify(item.customizations) : null,
        })),
      };

      await apiRequest('POST', '/api/orders', orderData);
      
      clearCart();
      closeCart();
      
      toast({
        title: 'Pedido realizado com sucesso!',
        description: 'Você receberá um email com os detalhes do seu pedido.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao processar pedido',
        description: 'Tente novamente em alguns instantes.',
        variant: 'destructive',
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent side="right" className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle className="text-2xl font-semibold">Carrinho</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-6">
            {items.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <p>Seu carrinho está vazio</p>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      {item.customizations && (
                        <p className="text-sm text-gray-600">Personalizada</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-brand-primary font-semibold">
                          R$ {((item.price + (item.customizations?.additionalCost || 0)) * item.quantity).toFixed(2).replace('.', ',')}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="border-t pt-6 space-y-4">
              {/* Coupon */}
              <div className="flex space-x-2">
                <Input
                  placeholder="Código de desconto"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button variant="outline">Aplicar</Button>
              </div>

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Frete:</span>
                  <span>{shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2).replace('.', ',')}`}</span>
                </div>
                {subtotal > 200 && (
                  <Badge variant="secondary" className="w-full justify-center bg-brand-success text-white">
                    Frete grátis aplicado!
                  </Badge>
                )}
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                  <span>Total:</span>
                  <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full brand-primary hover:bg-brand-secondary py-4 transform hover:scale-105"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {isCheckingOut ? 'Processando...' : 'Finalizar Pedido'}
              </Button>

              {/* Continue Shopping */}
              <Button
                variant="outline"
                onClick={closeCart}
                className="w-full"
              >
                Continuar Comprando
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
