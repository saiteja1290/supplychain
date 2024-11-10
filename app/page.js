'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, TruckIcon } from 'lucide-react'

export default function Dashboard() {
  const [suppliers, setSuppliers] = useState([])
  const [inventory, setInventory] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersData, inventoryData, ordersData] = await Promise.all([
          fetch('/api/suppliers').then(res => res.json()),
          fetch('/api/inventory').then(res => res.json()),
          fetch('/api/fulfillment').then(res => res.json())
        ])
        setSuppliers(suppliersData)
        setInventory(inventoryData)
        setOrders(ordersData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const handleRestock = async (productId) => {
    try {
      await fetch(`/api/inventory/restock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })
      // Refresh inventory data
      const newInventory = await fetch('/api/inventory').then(res => res.json())
      setInventory(newInventory)
    } catch (error) {
      console.error('Error restocking:', error)
    }
  }

  const getPerformanceColor = (accuracy) => {
    return accuracy >= 90 ? 'text-green-500' : accuracy >= 70 ? 'text-yellow-500' : 'text-red-500'
  }

  const getStatusBadge = (status) => {
    const statusStyles = {
      Pending: 'bg-yellow-200 text-yellow-800',
      Shipped: 'bg-blue-200 text-blue-800',
      Delivered: 'bg-green-200 text-green-800'
    }
    return statusStyles[status] || 'bg-gray-200 text-gray-800'
  }

  return (
    <div className="p-8 space-y-8">
      {/* Supplier Performance Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TruckIcon className="w-6 h-6" />
            Supplier Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier Name</TableHead>
                <TableHead>Avg Delivery Time (days)</TableHead>
                <TableHead>Order Accuracy</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier._id}>
                  <TableCell>{supplier.supplierName}</TableCell>
                  <TableCell>{supplier.avgDeliveryTime}</TableCell>
                  <TableCell>{supplier.orderAccuracy}%</TableCell>
                  <TableCell>
                    {supplier.orderAccuracy >= 90 ? (
                      <CheckCircle className="text-green-500" />
                    ) : (
                      <AlertCircle className="text-red-500" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Inventory Overview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>{item.currentStock}</TableCell>
                  <TableCell>
                    {item.currentStock <= item.lowStockThreshold ? (
                      <Badge variant="destructive">Low Stock</Badge>
                    ) : (
                      <Badge variant="default">In Stock</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.currentStock <= item.lowStockThreshold && (
                      <Button
                        size="sm"
                        onClick={() => handleRestock(item._id)}
                      >
                        Restock
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Fulfillment Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(order.lastUpdated).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}