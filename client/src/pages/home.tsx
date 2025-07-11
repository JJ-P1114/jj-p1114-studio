import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { Code, Laptop, DraftingCompass, Key, BarChart, User, Calendar } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Bienvenue, {user?.firstName || user?.email || "Utilisateur"}!
            </h1>
            <p className="text-xl opacity-90">
              Accédez à vos projets, licences et outils de développement
            </p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href="/tableau-de-bord">
                <CardContent className="p-6 text-center">
                  <BarChart className="text-primary text-3xl mb-4 mx-auto" />
                  <h3 className="font-semibold mb-2">Tableau de Bord</h3>
                  <p className="text-sm text-gray-600">Gérez vos licences et projets</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href="/prototype">
                <CardContent className="p-6 text-center">
                  <DraftingCompass className="text-primary text-3xl mb-4 mx-auto" />
                  <h3 className="font-semibold mb-2">Prototype Builder</h3>
                  <p className="text-sm text-gray-600">Créez des prototypes interactifs</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href="/logiciels">
                <CardContent className="p-6 text-center">
                  <Key className="text-primary text-3xl mb-4 mx-auto" />
                  <h3 className="font-semibold mb-2">Licences</h3>
                  <p className="text-sm text-gray-600">Achetez et téléchargez des logiciels</p>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href="/contact">
                <CardContent className="p-6 text-center">
                  <User className="text-primary text-3xl mb-4 mx-auto" />
                  <h3 className="font-semibold mb-2">Support</h3>
                  <p className="text-sm text-gray-600">Contactez notre équipe</p>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Activité Récente</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Dernières Actions</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="text-primary h-5 w-5" />
                    <div>
                      <p className="font-medium">Compte créé</p>
                      <p className="text-sm text-gray-600">
                        {new Date().toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Code className="text-primary h-5 w-5" />
                    <div>
                      <p className="font-medium">Première connexion</p>
                      <p className="text-sm text-gray-600">Bienvenue sur la plateforme!</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Prochaines Étapes</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Explorez nos logiciels</p>
                      <p className="text-sm text-gray-600">
                        Découvrez notre catalogue de solutions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Créez votre premier prototype</p>
                      <p className="text-sm text-gray-600">
                        Testez nos outils de prototypage
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Demandez un devis</p>
                      <p className="text-sm text-gray-600">
                        Pour un projet sur mesure
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
