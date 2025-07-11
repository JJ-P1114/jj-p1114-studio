import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { 
  MousePointer, 
  Square, 
  Type, 
  Table, 
  BarChart, 
  Save, 
  Send, 
  Trash2,
  Plus
} from "lucide-react";
import type { Prototype } from "@shared/schema";

interface Component {
  id: string;
  type: "button" | "input" | "table" | "chart";
  label: string;
  x: number;
  y: number;
}

export default function PrototypeBuilder() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [currentPrototype, setCurrentPrototype] = useState<Prototype | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [comments, setComments] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);

  const { data: prototypes = [], isLoading } = useQuery({
    queryKey: ["/api/prototypes"],
    enabled: isAuthenticated,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = {
        name,
        description,
        components,
        comments,
        specifications,
        status: "draft",
      };

      if (currentPrototype) {
        await apiRequest("PUT", `/api/prototypes/${currentPrototype.id}`, data);
      } else {
        await apiRequest("POST", "/api/prototypes", data);
      }
    },
    onSuccess: () => {
      toast({
        title: "Prototype sauvegardé!",
        description: "Votre prototype a été sauvegardé avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/prototypes"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour sauvegarder votre prototype.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1000);
        return;
      }
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la sauvegarde.",
        variant: "destructive",
      });
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      const data = {
        name,
        description,
        components,
        comments,
        specifications,
        status: "submitted",
      };

      if (currentPrototype) {
        await apiRequest("PUT", `/api/prototypes/${currentPrototype.id}`, data);
      } else {
        await apiRequest("POST", "/api/prototypes", data);
      }
    },
    onSuccess: () => {
      toast({
        title: "Prototype soumis!",
        description: "Votre prototype a été soumis pour révision.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/prototypes"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour soumettre votre prototype.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 1000);
        return;
      }
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la soumission.",
        variant: "destructive",
      });
    },
  });

  const availableComponents = [
    { type: "button", label: "Bouton", icon: Square },
    { type: "input", label: "Champ de Texte", icon: Type },
    { type: "table", label: "Tableau", icon: Table },
    { type: "chart", label: "Graphique", icon: BarChart },
  ];

  const handleDragStart = (componentType: string) => {
    setDraggedComponent(componentType);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!draggedComponent) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newComponent: Component = {
      id: Date.now().toString(),
      type: draggedComponent as Component["type"],
      label: availableComponents.find(c => c.type === draggedComponent)?.label || "",
      x,
      y,
    };

    setComponents([...components, newComponent]);
    setDraggedComponent(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeComponent = (id: string) => {
    setComponents(components.filter(c => c.id !== id));
  };

  const loadPrototype = (prototype: Prototype) => {
    setCurrentPrototype(prototype);
    setName(prototype.name);
    setDescription(prototype.description || "");
    setComments(prototype.comments || "");
    setSpecifications(prototype.specifications || "");
    setComponents(prototype.components as Component[] || []);
  };

  const newPrototype = () => {
    setCurrentPrototype(null);
    setName("");
    setDescription("");
    setComments("");
    setSpecifications("");
    setComponents([]);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Connexion Requise</h2>
            <p className="text-gray-600 mb-6">
              Veuillez vous connecter pour accéder au constructeur de prototype.
            </p>
            <Button onClick={() => window.location.href = "/api/login"}>
              Se Connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Constructeur de Prototype</h1>
              <p className="opacity-90">
                Créez et testez votre logiciel avant le développement final
              </p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={newPrototype}
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Project Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Informations du Projet</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom du Prototype</Label>
                    <Input 
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Mon Prototype"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Description du prototype..."
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Components */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Composants Disponibles</h3>
                <div className="space-y-3">
                  {availableComponents.map((component) => (
                    <div
                      key={component.type}
                      draggable
                      onDragStart={() => handleDragStart(component.type)}
                      className="bg-white p-3 rounded-lg border border-gray-200 cursor-move hover:border-primary transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <component.icon className="text-primary h-4 w-4" />
                        <span className="text-sm font-medium">{component.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* My Prototypes */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Mes Prototypes</h3>
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="space-y-2">
                    {prototypes.map((prototype: Prototype) => (
                      <div
                        key={prototype.id}
                        className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
                          currentPrototype?.id === prototype.id ? "bg-primary/10" : ""
                        }`}
                        onClick={() => loadPrototype(prototype)}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{prototype.name}</span>
                          <Badge variant={prototype.status === "submitted" ? "default" : "secondary"}>
                            {prototype.status === "submitted" ? "Soumis" : "Brouillon"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-9">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Zone de Travail</h3>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => saveMutation.mutate()}
                      disabled={saveMutation.isPending || !name}
                    >
                      {saveMutation.isPending ? (
                        <LoadingSpinner />
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Sauvegarder
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => submitMutation.mutate()}
                      disabled={submitMutation.isPending || !name || components.length === 0}
                    >
                      {submitMutation.isPending ? (
                        <LoadingSpinner />
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Soumettre
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                <div
                  className="relative bg-white border-2 border-dashed border-gray-300 rounded-lg h-96 overflow-hidden"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {components.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <MousePointer className="text-gray-400 text-4xl mb-4 mx-auto" />
                        <p className="text-gray-500">
                          Glissez-déposez des composants ici pour créer votre prototype
                        </p>
                      </div>
                    </div>
                  ) : (
                    components.map((component) => (
                      <div
                        key={component.id}
                        className="absolute bg-primary/10 border border-primary rounded px-3 py-2 text-sm cursor-pointer group"
                        style={{ left: component.x, top: component.y }}
                      >
                        <div className="flex items-center space-x-2">
                          <span>{component.label}</span>
                          <button
                            onClick={() => removeComponent(component.id)}
                            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Comments and Specifications */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Commentaires</h3>
                  <Textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Ajoutez vos commentaires sur le prototype..."
                    rows={4}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Spécifications Techniques</h3>
                  <Textarea
                    value={specifications}
                    onChange={(e) => setSpecifications(e.target.value)}
                    placeholder="Spécifications techniques particulières..."
                    rows={4}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
