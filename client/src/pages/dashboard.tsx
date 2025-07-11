import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { 
  Key, 
  FileText, 
  Settings, 
  Download, 
  Calendar, 
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { useEffect } from "react";

export default function Dashboard() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const { data: licenses = [], isLoading: licensesLoading } = useQuery({
    queryKey: ["/api/licenses"],
    enabled: isAuthenticated,
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated,
  });

  const { data: prototypes = [], isLoading: prototypesLoading } = useQuery({
    queryKey: ["/api/prototypes"],
    enabled: isAuthenticated,
  });

  const { data: inquiries = [], isLoading: inquiriesLoading } = useQuery({
    queryKey: ["/api/inquiries"],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour accéder au tableau de bord.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
    }
  }, [isAuthenticated, toast]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const isLoading = licensesLoading || ordersLoading || prototypesLoading || inquiriesLoading;

  const activeLicenses = licenses.filter((license: any) => license.isActive);
  const activePrototypes = prototypes.filter((prototype: any) => prototype.status !== "completed");
  const completedOrders = orders.filter((order: any) => order.status === "completed");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
      case "active":
      case "submitted":
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case "pending":
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800">En Cours</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Tableau de Bord</h1>
            <p className="text-xl opacity-90">
              Bienvenue, {user?.firstName || user?.email}! Gérez vos licences et projets.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-primary text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">Licences Actives</p>
                  <p className="text-3xl font-bold">{activeLicenses.length}</p>
                </div>
                <Key className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">Projets en Cours</p>
                  <p className="text-3xl font-bold">{activePrototypes.length}</p>
                </div>
                <Settings className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">Commandes</p>
                  <p className="text-3xl font-bold">{completedOrders.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Licenses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2" />
                Mes Licences
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <LoadingSpinner />
              ) : licenses.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Aucune licence trouvée.
                </p>
              ) : (
                <div className="space-y-4">
                  {licenses.map((license: any) => (
                    <div key={license.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{license.software?.name || "Logiciel"}</h4>
                          <p className="text-sm text-gray-600">
                            Licence: {license.licenseKey}
                          </p>
                        </div>
                        {getStatusBadge(license.isActive ? "active" : "inactive")}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          {new Date(license.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prototypes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Mes Prototypes
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
                        <Button size="sm" variant="outline">
                          Modifier
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Mes Commandes
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
                          <h4 className="font-semibold">Commande #{order.id}</h4>
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Inquiries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Mes Demandes
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
                        <div>
                          <h4 className="font-semibold">{inquiry.projectType}</h4>
                          <p className="text-sm text-gray-600">
                            {inquiry.description.substring(0, 100)}...
                          </p>
                        </div>
                        {getStatusBadge(inquiry.status)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          <Calendar className="h-4 w-4 inline mr-1" />
                          {new Date(inquiry.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
