import { storage } from "./storage";

// Sample software data
const sampleSoftware = [
  {
    name: "BusinessManager Pro",
    description: "Solution complète de gestion d'entreprise avec CRM, comptabilité et gestion des stocks intégrés",
    price: 899.99,
    features: ["CRM avancé", "Comptabilité automatisée", "Gestion des stocks", "Rapports détaillés", "Support 24/7"],
    category: "business",
    version: "3.2.1",
    requirements: "Windows 10+, 8GB RAM, 2GB espace disque"
  },
  {
    name: "InventoryTracker Elite",
    description: "Système de gestion d'inventaire en temps réel avec codes-barres et analytiques avancées",
    price: 599.99,
    features: ["Codes-barres", "Tracking temps réel", "Alertes automatiques", "Rapports analytiques", "Multi-entrepôts"],
    category: "inventory",
    version: "2.8.4",
    requirements: "Windows 10+, 4GB RAM, 1GB espace disque"
  },
  {
    name: "CustomerInsight Analytics",
    description: "Plateforme d'analyse client avec segmentation automatique et prédictions comportementales",
    price: 1299.99,
    features: ["Segmentation IA", "Prédictions comportementales", "Tableaux de bord interactifs", "Intégrations API", "Reporting avancé"],
    category: "analytics",
    version: "4.1.0",
    requirements: "Windows 10+, 16GB RAM, 5GB espace disque"
  },
  {
    name: "ProjectFlow Manager",
    description: "Solution de gestion de projet avec collaboration en temps réel et automatisation des tâches",
    price: 449.99,
    features: ["Collaboration temps réel", "Automatisation des tâches", "Gantt interactif", "Tracking du temps", "Notifications intelligentes"],
    category: "project",
    version: "1.9.7",
    requirements: "Windows 10+, 8GB RAM, 2GB espace disque"
  },
  {
    name: "SecureBackup Enterprise",
    description: "Solution de sauvegarde entreprise avec chiffrement avancé et récupération instantanée",
    price: 799.99,
    features: ["Chiffrement 256-bit", "Sauvegarde automatique", "Récupération instantanée", "Déduplication", "Monitoring 24/7"],
    category: "security",
    version: "2.3.5",
    requirements: "Windows Server 2019+, 16GB RAM, 1TB espace disque"
  }
];

export async function seedDatabase() {
  try {
    console.log("Seeding database with sample data...");
    
    // Check if software already exists
    const existingSoftware = await storage.getAllSoftware();
    if (existingSoftware.length > 0) {
      console.log("Database already contains software data, skipping seed");
      return;
    }

    // Add sample software
    for (const software of sampleSoftware) {
      await storage.createSoftware(software);
      console.log(`Created software: ${software.name}`);
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}