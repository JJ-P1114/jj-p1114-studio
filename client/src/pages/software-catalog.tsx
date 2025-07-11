import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { ShoppingCart, Download, Check, Star } from "lucide-react";
import type { Software } from "@shared/schema";

export default function SoftwareCatalog() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedSoftware, setSelectedSoftware] = useState<Software | null>(null);

  const { data: software = [], isLoading } = useQuery({
    queryKey: ["/api/software"],
  });

  const { data: userLicenses = [] } = useQuery({
    queryKey: ["/api/licenses"],
    enabled: isAuthenticated,
  });

  const purchaseMutation = useMutation({
    mutationFn: async (softwareId: number) => {
      const software = await apiRequest("GET", `/api/software/${softwareId}`);
      const softwareData = await software.json();
      
      await apiRequest("POST", "/api/orders", {
        softwareId,
        totalAmount: softwareData.price,
        status: "pending",
      });
    },
    onSuccess: () => {
      toast({
        title: "Achat réussi!",
        description: "Votre licence a été générée. Vous pouvez maintenant télécharger le logiciel.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/licenses"] });
      setSelectedSoftware(null);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour acheter une licence.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1000);
        return;
      }
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'achat.",
        variant: "destructive",
      });
    },
  });

  const handlePurchase = (software: Software) => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour acheter une licence.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
      return;
    }
    
    setSelectedSoftware(software);
    purchaseMutation.mutate(software.id);
  };

  const hasLicense = (softwareId: number) => {
    return userLicenses.some((license: any) => license.softwareId === softwareId && license.isActive);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Catalogue de Logiciels</h1>
            <p className="text-xl opacity-90">
              Découvrez nos solutions logicielles prêtes à l'emploi pour votre entreprise
            </p>
          </div>
        </div>
      </section>

      {/* Software Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {software.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">
                Aucun logiciel disponible pour le moment.
              </p>
              <p className="text-gray-500">
                Revenez bientôt pour découvrir nos nouvelles solutions!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {software.map((item: Software) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold">{item.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">4.8</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    
                    {item.features && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Fonctionnalités:</h4>
                        <div className="flex flex-wrap gap-2">
                          {(item.features as string[]).slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-2xl font-bold text-primary">
                          {parseFloat(item.price).toFixed(0)}€
                        </span>
                        <span className="text-xs text-gray-500">Licence unique</span>
                      </div>
                      
                      {hasLicense(item.id) ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <Check className="h-4 w-4 mr-1" />
                          Possédé
                        </Badge>
                      ) : (
                        <Button 
                          onClick={() => handlePurchase(item)}
                          disabled={purchaseMutation.isPending && selectedSoftware?.id === item.id}
                        >
                          {purchaseMutation.isPending && selectedSoftware?.id === item.id ? (
                            <LoadingSpinner />
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Acheter
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pourquoi Choisir Nos Logiciels?</h2>
            <p className="text-xl text-gray-600">
              Des solutions professionnelles conçues pour votre réussite
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                <Download className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Téléchargement Immédiat</h3>
              <p className="text-gray-600">
                Accédez instantanément à vos logiciels après l'achat
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Licence Perpétuelle</h3>
              <p className="text-gray-600">
                Utilisez vos logiciels sans limite de temps
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Support Premium</h3>
              <p className="text-gray-600">
                Bénéficiez d'un support technique de qualité
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
