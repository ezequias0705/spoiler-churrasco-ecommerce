import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { Order } from "@shared/schema";

export default function OrderManagement() {
  const [selectedStatus, setSelectedStatus] = useState("all");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['/api/orders'],
    queryFn: async () => {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    }
  });

  const filteredOrders = orders.filter((order: Order) => 
    selectedStatus === "all" || order.status === selectedStatus
  );

  const statusConfig = {
    processing: { label: "Em Produção", color: "bg-yellow-100 text-yellow-800", progress: 25 },
    shipped: { label: "Enviado", color: "bg-blue-100 text-blue-800", progress: 75 },
    delivered: { label: "Entregue", color: "bg-green-100 text-green-800", progress: 100 }
  };

  const getProgressWidth = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig]?.progress || 0;
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando pedidos...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="orders" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-playfair font-bold text-gray-900 mb-4">Meus Pedidos</h3>
          <p className="text-lg text-gray-600">Acompanhe o status dos seus pedidos em tempo real</p>
        </div>

        {/* Order Status Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button 
            onClick={() => setSelectedStatus("all")}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              selectedStatus === "all" 
                ? "bg-brand-primary text-white" 
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-brand-primary hover:text-brand-primary"
            }`}
          >
            Todos os Pedidos
          </button>
          <button 
            onClick={() => setSelectedStatus("processing")}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              selectedStatus === "processing" 
                ? "bg-brand-primary text-white" 
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-brand-primary hover:text-brand-primary"
            }`}
          >
            Em Produção
          </button>
          <button 
            onClick={() => setSelectedStatus("shipped")}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              selectedStatus === "shipped" 
                ? "bg-brand-primary text-white" 
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-brand-primary hover:text-brand-primary"
            }`}
          >
            Enviados
          </button>
          <button 
            onClick={() => setSelectedStatus("delivered")}
            className={`px-6 py-3 rounded-full font-semibold transition-all ${
              selectedStatus === "delivered" 
                ? "bg-brand-primary text-white" 
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-brand-primary hover:text-brand-primary"
            }`}
          >
            Entregues
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-clipboard-list text-6xl text-gray-300 mb-4"></i>
              <h4 className="text-xl font-semibold text-gray-600 mb-2">Nenhum pedido encontrado</h4>
              <p className="text-gray-500">
                {selectedStatus === "all" 
                  ? "Você ainda não fez nenhum pedido." 
                  : `Nenhum pedido com status "${statusConfig[selectedStatus as keyof typeof statusConfig]?.label}".`
                }
              </p>
            </div>
          ) : (
            filteredOrders.map((order: Order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="text-2xl font-bold text-gray-900">#{order.id}</div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        statusConfig[order.status as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-800'
                      }`}>
                        {statusConfig[order.status as keyof typeof statusConfig]?.label || order.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Data do Pedido</p>
                        <p className="font-semibold">{formatDate(order.createdAt || new Date())}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="font-semibold text-brand-primary">
                          R$ {parseFloat(order.total).toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          {order.status === "delivered" ? "Data de Entrega" : "Previsão de Entrega"}
                        </p>
                        <p className="font-semibold">
                          {order.estimatedDelivery ? formatDate(order.estimatedDelivery) : 'A definir'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {Array.isArray(order.items) && order.items.slice(0, 3).map((item: any, index: number) => (
                        <div key={index} className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <i className="fas fa-th-large text-gray-400"></i>
                        </div>
                      ))}
                      {Array.isArray(order.items) && order.items.length > 3 && (
                        <div className="text-sm text-gray-600">+{order.items.length - 3} itens</div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 mt-4 lg:mt-0">
                    <button className="bg-brand-primary hover:bg-brand-secondary text-white px-6 py-2 rounded-lg font-semibold transition-all">
                      Ver Detalhes
                    </button>
                    {order.status !== "delivered" && (
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-all">
                        Rastrear Pedido
                      </button>
                    )}
                    {order.status === "delivered" && (
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-all">
                        Pedir Novamente
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Pedido Confirmado</span>
                    <span>Em Produção</span>
                    <span>Enviado</span>
                    <span>Entregue</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-brand-primary h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${getProgressWidth(order.status)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
