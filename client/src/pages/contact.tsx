import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  CheckCircle,
  Code
} from "lucide-react";

export default function Contact() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "",
    email: user?.email || "",
    projectType: "",
    description: "",
  });

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiRequest("POST", "/api/inquiries", {
        ...data,
        userId: isAuthenticated ? user?.id : undefined,
      });
    },
    onSuccess: () => {
      toast({
        title: "Demande envoyée!",
        description: "Nous vous répondrons dans les plus brefs délais.",
      });
      setFormData({
        name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "",
        email: user?.email || "",
        projectType: "",
        description: "",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi de votre demande.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.projectType || !formData.description) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }
    submitMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Contactez-Nous</h1>
            <p className="text-xl opacity-90">
              Prêt à démarrer votre projet ? Parlons-en !
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <Send className="h-6 w-6 mr-2 text-primary" />
                    Demande de Devis
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Nom Complet *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Votre nom complet"
                        className="mt-1"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="votre@email.com"
                        className="mt-1"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="projectType" className="text-sm font-medium text-gray-700">
                        Type de Projet *
                      </Label>
                      <Select value={formData.projectType} onValueChange={(value) => handleInputChange("projectType", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Sélectionnez un type de projet" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="développement-sur-mesure">Développement sur mesure</SelectItem>
                          <SelectItem value="logiciel-de-gestion">Logiciel de gestion</SelectItem>
                          <SelectItem value="application-métier">Application métier</SelectItem>
                          <SelectItem value="modernisation">Modernisation d'application</SelectItem>
                          <SelectItem value="intégration-api">Intégration API</SelectItem>
                          <SelectItem value="maintenance">Maintenance et support</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                        Description du Projet *
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Décrivez votre projet en détail : objectifs, fonctionnalités souhaitées, contraintes techniques, délais..."
                        rows={6}
                        className="mt-1 resize-none"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={submitMutation.isPending}
                    >
                      {submitMutation.isPending ? (
                        <LoadingSpinner />
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Envoyer la Demande
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <Code className="h-6 w-6 mr-2 text-primary" />
                    Informations de Contact
                  </h2>
                  <div className="space-y-8">
                    <div className="flex items-start space-x-4">
                      <MapPin className="text-primary text-xl mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Adresse</h3>
                        <p className="text-gray-600 leading-relaxed">
                          123 Rue de la Technologie<br />
                          75001 Paris, France
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Phone className="text-primary text-xl mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Téléphone</h3>
                        <p className="text-gray-600">+33 1 23 45 67 89</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Appels d'urgence acceptés 24/7
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Mail className="text-primary text-xl mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Email</h3>
                        <p className="text-gray-600">contact@jjp1114studio.com</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Réponse sous 24h en jour ouvré
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Clock className="text-primary text-xl mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Horaires</h3>
                        <div className="text-gray-600 space-y-1">
                          <p>Lundi - Vendredi : 9h00 - 18h00</p>
                          <p>Samedi : 9h00 - 12h00</p>
                          <p className="text-sm text-gray-500">Fermé le dimanche</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Pourquoi Choisir JJ-P1114 STUDIO?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Expertise Reconnue</h3>
                <p className="text-gray-600">
                  Plus de 10 ans d'expérience dans le développement de logiciels sur mesure
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Clock className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Délais Respectés</h3>
                <p className="text-gray-600">
                  Nous nous engageons à livrer vos projets dans les délais convenus
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Phone className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Support Continu</h3>
                <p className="text-gray-600">
                  Support technique et maintenance pour tous vos logiciels
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Questions Fréquentes
            </h2>
            <div className="space-y-6">
              {[
                {
                  question: "Combien de temps prend le développement d'un logiciel sur mesure?",
                  answer: "Le délai dépend de la complexité du projet. Un logiciel simple peut prendre 2-3 mois, tandis qu'une solution complexe peut nécessiter 6-12 mois. Nous vous fournirons une estimation précise après analyse de vos besoins."
                },
                {
                  question: "Proposez-vous une maintenance après la livraison?",
                  answer: "Oui, nous offrons des contrats de maintenance et support technique. Cela inclut les corrections de bugs, les mises à jour de sécurité et les améliorations mineures."
                },
                {
                  question: "Puis-je tester le logiciel avant la version finale?",
                  answer: "Absolument! Nous proposons des prototypes fonctionnels que vous pouvez tester et commenter. Cela nous permet d'ajuster le développement selon vos retours."
                },
                {
                  question: "Comment se déroule le processus de développement?",
                  answer: "Nous suivons une méthode agile : analyse des besoins, création d'un prototype, développement itératif avec vos retours, tests complets, puis livraison et formation."
                }
              ].map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
