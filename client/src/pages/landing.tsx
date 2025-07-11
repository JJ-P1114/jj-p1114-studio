import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Laptop, DraftingCompass, Key, Users, Package, ShoppingCart, Euro } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleGetStarted = () => {
    window.location.href = "/api/login";
  };

  const handleDiscoverServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Développement de Logiciels sur Mesure
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Créez, testez et déployez des solutions logicielles adaptées à vos besoins 
              spécifiques avec JJ-P1114 STUDIO INC
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-gray-100"
                onClick={handleGetStarted}
              >
                Commencer un Projet
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary transition-colors duration-200"
                onClick={handleDiscoverServices}
              >
                Découvrir nos Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Services</h2>
            <p className="text-xl text-gray-600">
              Solutions complètes pour vos besoins logiciels
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Laptop className="text-primary text-4xl mb-4" />
                <h3 className="text-xl font-semibold mb-4">Développement sur Mesure</h3>
                <p className="text-gray-600">
                  Création de logiciels de bureau personnalisés adaptés à vos processus 
                  métier spécifiques.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <DraftingCompass className="text-primary text-4xl mb-4" />
                <h3 className="text-xl font-semibold mb-4">Prototypage Interactif</h3>
                <p className="text-gray-600">
                  Testez et validez vos idées avec nos outils de prototypage avant 
                  le développement final.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Key className="text-primary text-4xl mb-4" />
                <h3 className="text-xl font-semibold mb-4">Gestion de Licences</h3>
                <p className="text-gray-600">
                  Système complet de distribution et gestion de licences pour vos 
                  logiciels maison.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Software Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Catalogue de Logiciels
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez nos solutions logicielles prêtes à l'emploi
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Gestionnaire Pro",
                description: "Solution complète de gestion d'entreprise avec modules CRM, inventaire et facturation.",
                price: "299€",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=200"
              },
              {
                name: "DataViz Studio",
                description: "Outil puissant d'analyse et de visualisation de données pour les professionnels.",
                price: "199€",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=200"
              },
              {
                name: "ProjectFlow",
                description: "Gestionnaire de projets avec planification, suivi et collaboration d'équipe.",
                price: "149€",
                image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=200"
              }
            ].map((software, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <img 
                    src={software.image} 
                    alt={software.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">{software.name}</h3>
                  <p className="text-gray-600 mb-4">{software.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary">{software.price}</span>
                    <Button onClick={handleLogin}>
                      Acheter Licence
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Dashboard Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tableau de Bord Administrateur
            </h2>
            <p className="text-xl text-gray-600">
              Gestion complète de votre entreprise
            </p>
          </div>
          <div className="max-w-6xl mx-auto bg-gray-50 rounded-xl p-8">
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card className="text-center p-6">
                <Users className="text-primary text-3xl mb-2 mx-auto" />
                <h3 className="font-semibold mb-1">Clients</h3>
                <p className="text-2xl font-bold">127</p>
              </Card>
              <Card className="text-center p-6">
                <Package className="text-primary text-3xl mb-2 mx-auto" />
                <h3 className="font-semibold mb-1">Logiciels</h3>
                <p className="text-2xl font-bold">15</p>
              </Card>
              <Card className="text-center p-6">
                <ShoppingCart className="text-primary text-3xl mb-2 mx-auto" />
                <h3 className="font-semibold mb-1">Commandes</h3>
                <p className="text-2xl font-bold">89</p>
              </Card>
              <Card className="text-center p-6">
                <Euro className="text-primary text-3xl mb-2 mx-auto" />
                <h3 className="font-semibold mb-1">Revenus</h3>
                <p className="text-2xl font-bold">15.8K€</p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
