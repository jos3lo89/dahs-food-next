export interface DashboardStats {
  // Ventas
  totalRevenue: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  revenueGrowth: number; // Porcentaje vs mes anterior

  // Pedidos
  totalOrders: number;
  todayOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  ordersGrowth: number;

  // Productos
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;

  // Usuarios
  totalUsers: number;
  activeUsers: number;

  // Promociones
  activePromotions: number;
  featuredPromotions: number;

  // Top productos
  topProducts: Array<{
    id: string;
    name: string;
    image: string;
    totalSold: number;
    revenue: number;
  }>;

  // Gráfico de ventas (últimos 7 días)
  salesChart: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;

  // Pedidos por estado
  ordersByStatus: Array<{
    status: string;
    count: number;
  }>;

  // Ventas por categoría
  salesByCategory: Array<{
    category: string;
    revenue: number;
    percentage: number;
  }>;

  // Métodos de pago
  paymentMethods: Array<{
    method: string;
    count: number;
    revenue: number;
  }>;

  // Pedidos recientes
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardStats;
}
