import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Euro,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

export default function Admin() {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/admin/orders"],
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: inquiries = [], isLoading: inquiriesLoading } = useQuery({
    queryKey: ["/api/admin/inquiries"],
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: prototypes = [], isLoading: prototypesLoading } = useQuery({
    queryKey: ["/api/admin/prototypes"],
    enabled: isAuthenticated && user?.role === "admin",
  });

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
  }, [isAuthenticated, user, authLoading, toast]);

  if (authLoading || !isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const isLoading = statsLoading || ordersLoading || inquiriesLoading || prototypesLoading;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Complété</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">En Cours</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Annulé</Badge>;
      case "new":
        return <Badge className="bg-blue-100 text-blue-800">Nouveau</Badge>;
      case "in_progress":
        return <Badge className="bg-orange-100 text-orange-800">En Cours</Badge>;
      case "submitted":
        return <Badge className="bg-purple-100 text-purple-800">Soumis</Badge>;
      case "draft":
        return <Badge variant="secondary">Brouillon</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getInquiryIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-orange-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">Tableau de Bord Administrateur</h1>
              <p className="text-xl opacity-90">
                Gestion complète de JJ-P1114 STUDIO INC
              </p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Logiciel
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="text-primary text-3xl mb-2 mx-auto" />
              <h3 className="font-semibold mb-1">Clients</h3>
              <p className="text-2xl font-bold">
                {isLoading ? "-" : stats?.clientCount || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Package className="text-primary text-3xl mb-2 mx-auto" />
              <h3 className="font-semibold mb-1">Logiciels</h3>
              <p className="text-2xl font-bold">
                {isLoading ? "-" : stats?.softwareCount || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <ShoppingCart className="text-primary text-3xl mb-2 mx-auto" />
              <h3 className="font-semibold mb-1">Commandes</h3>
              <p className="text-2xl font-bold">
                {isLoading ? "-" : stats?.orderCount || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Euro className="text-primary text-3xl mb-2 mx-auto" />
              <h3 className="font-semibold mb-1">Revenus</h3>
              <p className="text-2xl font-bold">
                {isLoading ? "-" : `${(stats?.revenue || 0).toFixed(1)}K€`}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Commandes Récentes
                </span>
                <Button variant="outline" size="sm">
                  Voir Toutes
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <LoadingSpinner />
              ) : orders.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Aucune commande trouvée.
                </p>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order: any) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">
                            Commande #{order.id}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Montant: {parseFloat(order.totalAmount).toFixed(2)}€
                          </p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Inquiries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Demandes Récentes
                </span>
                <Button variant="outline" size="sm">
                  Voir Toutes
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <LoadingSpinner />
              ) : inquiries.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Aucune demande trouvée.
                </p>
              ) : (
                <div className="space-y-4">
                  {inquiries.slice(0, 5).map((inquiry: any) => (
                    <div key={inquiry.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-start space-x-2">
                          {getInquiryIcon(inquiry.status)}
                          <div>
                            <h4 className="font-semibold">{inquiry.name}</h4>
                            <p className="text-sm text-gray-600">
                              {inquiry.projectType}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {inquiry.description.substring(0, 60)}...
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(inquiry.status)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          {new Date(inquiry.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Prototypes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Prototypes Récents
                </span>
                <Button variant="outline" size="sm">
                  Voir Tous
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <LoadingSpinner />
              ) : prototypes.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Aucun prototype trouvé.
                </p>
              ) : (
                <div className="space-y-4">
                  {prototypes.slice(0, 5).map((prototype: any) => (
                    <div key={prototype.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{prototype.name}</h4>
                          <p className="text-sm text-gray-600">
                            {prototype.description || "Aucune description"}
                          </p>
                        </div>
                        {getStatusBadge(prototype.status)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          {new Date(prototype.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un Logiciel
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Gérer les Utilisateurs
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Package className="h-4 w-4 mr-2" />
                  Gérer les Licences
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Voir les Demandes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Orders Table */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Toutes les Commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">ID</th>
                    <th className="text-left py-3 px-4">Client</th>
                    <th className="text-left py-3 px-4">Logiciel</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Montant</th>
                    <th className="text-left py-3 px-4">Statut</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8">
                        <LoadingSpinner />
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500">
                        Aucune commande trouvée.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order: any) => (
                      <tr key={order.id} className="border-b border-gray-100">
                        <td className="py-3 px-4">#{order.id}</td>
                        <td className="py-3 px-4">{order.userId}</td>
                        <td className="py-3 px-4">ID: {order.softwareId}</td>
                        <td className="py-3 px-4">
                          {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="py-3 px-4">
                          {parseFloat(order.totalAmount).toFixed(2)}€
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
