import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Laptop, 
  DraftingCompass, 
  Key, 
  Code, 
  Settings, 
  Users, 
  CheckCircle,
  ArrowRight
} from "lucide-react";

export default function Services() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Nos Services</h1>
            <p className="text-xl opacity-90">
              Solutions complètes de développement logiciel pour entreprises modernes
            </p>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Laptop className="text-primary text-4xl mb-4" />
                <h3 className="text-xl font-semibold mb-4">Développement sur Mesure</h3>
                <p className="text-gray-600 mb-6">
                  Création de logiciels de bureau personnalisés adaptés à vos processus 
                  métier spécifiques. Nous analysons vos besoins et développons des solutions 
                  qui s'intègrent parfaitement dans votre environnement de travail.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 h-4 w-4 mr-2" />
                    <span className="text-sm">Analyse des besoins</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 h-4 w-4 mr-2" />
                    <span className="text-sm">Développement personnalisé</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 h-4 w-4 mr-2" />
                    <span className="text-sm">Formation utilisateur</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 h-4 w-4 mr-2" />
                    <span className="text-sm">Support technique</span>
                  </li>
                </ul>
                <Button className="w-full">
                  Demander un Devis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <DraftingCompass className="text-primary text-4xl mb-4" />
                <h3 className="text-xl font-semibold mb-4">Prototypage Interactif</h3>
                <p className="text-gray-600 mb-6">
                  Testez et validez vos idées avec nos outils de prototypage avant 
                  le développement final. Créez des maquettes fonctionnelles et 
                  partagez vos commentaires en temps réel.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 h-4 w-4 mr-2" />
                    <span className="text-sm">Interface glisser-déposer</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 h-4 w-4 mr-2" />
                    <span className="text-sm">Composants pré-construits</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 h-4 w-4 mr-2" />
                    <span className="text-sm">Commentaires collaboratifs</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 h-4 w-4 mr-2" />
                    <span className="text-sm">Export vers développement</span>
                  </li>
                </ul>
                <Link href="/prototype">
                  <Button className="w-full">
                    Essayer le Prototype Builder
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Key className="text-primary text-4xl mb-4" />
                <h3 className="text-xl font-semibold mb-4">Gestion de Licences</h3>
                <p className="text-gray-600 mb-6">
                  Système complet de distribution et gestion de licences pour vos 
                  logiciels maison. Achetez, téléchargez et gérez vos licences 
                  depuis un tableau de bord centralisé.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 h-4 w-4 mr-2" />
                    <span className="text-sm">Génération automatique</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 h-4 w-4 mr-2" />
                    <span className="text-sm">Téléchargement sécurisé</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 h-4 w-4 mr-2" />
                    <span className="text-sm">Support 24/7</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 h-4 w-4 mr-2" />
                    <span className="text-sm">Mises à jour incluses</span>
                  </li>
                </ul>
                <Link href="/logiciels">
                  <Button className="w-full">
                    Voir le Catalogue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Services Additionnels</h2>
            <p className="text-xl text-gray-600">
              Accompagnement complet pour vos projets logiciels
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <Code className="text-primary text-3xl mb-4" />
                <h3 className="text-lg font-semibold mb-2">Intégration API</h3>
                <p className="text-gray-600">
                  Connectez vos logiciels avec des services tiers via des API sécurisées.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Settings className="text-primary text-3xl mb-4" />
                <h3 className="text-lg font-semibold mb-2">Maintenance</h3>
                <p className="text-gray-600">
                  Support technique continu et mises à jour régulières de vos logiciels.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Users className="text-primary text-3xl mb-4" />
                <h3 className="text-lg font-semibold mb-2">Formation</h3>
                <p className="text-gray-600">
                  Formation complète de vos équipes sur l'utilisation des logiciels.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre Processus</h2>
            <p className="text-xl text-gray-600">
              Une approche structurée pour garantir le succès de votre projet
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Analyse", description: "Étude de vos besoins et contraintes" },
              { step: "2", title: "Prototype", description: "Création d'une maquette fonctionnelle" },
              { step: "3", title: "Développement", description: "Réalisation du logiciel final" },
              { step: "4", title: "Déploiement", description: "Mise en production et formation" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à Commencer Votre Projet ?</h2>
          <p className="text-xl mb-8 opacity-90">
            Contactez-nous pour discuter de vos besoins et obtenir un devis personnalisé
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Demander un Devis
              </Button>
            </Link>
            <Link href="/prototype">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Essayer le Prototype Builder
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
