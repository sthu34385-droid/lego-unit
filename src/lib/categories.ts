import type { CategoryId } from "./types";

export type Category = {
  id: CategoryId;
  name: string;
  tagline: string;
  colors: [string, string, string, string];
};

export const CATEGORIES: Category[] = [
  {
    id: "city",
    name: "City",
    tagline: "Streets, stations, and everyday adventures",
    colors: ["#FFD400", "#006CB7", "#C4C4C4", "#D01012"],
  },
  {
    id: "technic",
    name: "Technic",
    tagline: "Gears, motors, and mechanical builds",
    colors: ["#1A1A1A", "#7CB518", "#6B7280", "#FFD400"],
  },
  {
    id: "creator",
    name: "Creator",
    tagline: "Rebuild it three ways, endlessly",
    colors: ["#D01012", "#FFD400", "#006CB7", "#FFFFFF"],
  },
  {
    id: "friends",
    name: "Friends",
    tagline: "Studios, houses, and heartfelt stories",
    colors: ["#E85D8C", "#5EC8C5", "#F6C1D0", "#7C5CBF"],
  },
  {
    id: "cars",
    name: "Cars",
    tagline: "Speed, chrome, and racetrack drama",
    colors: ["#D01012", "#111111", "#C0C0C0", "#FFD400"],
  },
  {
    id: "architecture",
    name: "Architecture",
    tagline: "Landmarks, skylines, and quiet detail",
    colors: ["#E8DCC8", "#4A4A4A", "#8B7355", "#F4F1EA"],
  },
  {
    id: "space",
    name: "Space",
    tagline: "Shuttles, bases, and distant orbits",
    colors: ["#0B1D36", "#F15A24", "#E8EEF5", "#3D7EA6"],
  },
  {
    id: "animals",
    name: "Animals",
    tagline: "Wildlife, reefs, and wild habitats",
    colors: ["#2E7D32", "#8D6E63", "#F5E6C8", "#43A047"],
  },
  {
    id: "kids",
    name: "Kids",
    tagline: "Big bricks, bright colors, first builds",
    colors: ["#FF6B00", "#FFD400", "#00A3E0", "#E4002B"],
  },
  {
    id: "other",
    name: "Other",
    tagline: "Classic mixes and workshop extras",
    colors: ["#FF8A00", "#1E3A5F", "#F2F2F2", "#D01012"],
  },
];

export function getCategory(id: string): Category {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}
