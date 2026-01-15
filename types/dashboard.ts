export interface DashboardStats {
  totalRevenue: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  revenueGrowth: number;

  totalOrders: number;
  todayOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  ordersGrowth: number;

  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;

  totalUsers: number;
  activeUsers: number;

  topProducts: Array<{
    id: string;
    name: string;
    image: string;
    totalSold: number;
    revenue: number;
  }>;

  salesChart: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;

  ordersByStatus: Array<{
    status: string;
    count: number;
  }>;

  salesByCategory: Array<{
    category: string;
    revenue: number;
    percentage: number;
  }>;

  paymentMethods: Array<{
    method: string;
    count: number;
    revenue: number;
  }>;

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
