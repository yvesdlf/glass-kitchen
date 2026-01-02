import { useState, useCallback, DragEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, X } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassInput } from "@/components/ui/GlassInput";
import { GlassTextarea } from "@/components/ui/GlassTextarea";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useToast } from "@/hooks/use-toast";
import { useRecipes } from "@/hooks/useRecipes";
import { parseRecipeMarkdown } from "@/services/RecipeService";
import { RecipeCategory, RECIPE_CATEGORIES } from "@/models/Recipe";
import { YieldInput } from "@/components/recipe/YieldInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RECIPE_TEMPLATE = `# RECIPE TITLE

*Short descriptive subtitle goes here*

---

## Photo

> \`PHOTO_PLACEHOLDER\` – insert final plated dish photo here (URL or image reference).

---

## Dish Overview

- **Course:**  
- **Cuisine / Style:**  
- **Portion Size:**  4 portions  
- **Estimated Prep Time:**  
- **Estimated Cook Time:**  

---

## Ingredients

### Main Preparation

- 200g    Example Main Ingredient One  
-  10g    Example Seasoning  
-  50ml   Example Liquid Component  

### Sub-Recipe: Sub-Component One

- 150g    Example Sub-Ingredient One  
-   5g    Example Spice  
-  30ml   Example Vinegar  

---

## Method

### Main Preparation

1. Step one for the main preparation goes here.  
2. Step two for the main preparation goes here.  
3. Step three for the main preparation goes here.  

---

## Plating & Finishing

- Brief note on plate choice and layout.  
- Where each main element should be placed on the plate.  
- Final garnishes, sauces, oils, and any last-minute textures or temperatures.  

---

## Chef Notes (Optional)

- Service notes, holding times, or station mise en place.  
- Variations or substitutions appropriate for the concept.  
`;

export default function UploadRecipe() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createRecipe } = useRecipes();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<RecipeCategory>("Mains");
  const [description, setDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [yieldQuantity, setYieldQuantity] = useState(1);
  const [yieldUnit, setYieldUnit] = useState("portions");

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith(".md") || file.name.endsWith(".txt")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          setContent(text);
          setFileName(file.name);
          
          const parsed = parseRecipeMarkdown(text);
          setTitle(parsed.title);
          setDescription(parsed.description);
          setCategory(parsed.category);
          
          toast({
            title: "File loaded",
            description: `${file.name} has been imported successfully.`,
          });
        };
        reader.readAsText(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a .md or .txt file.",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const handleUseTemplate = () => {
    setContent(RECIPE_TEMPLATE);
    setFileName(null);
    toast({
      title: "Template loaded",
      description: "Recipe template is ready for editing.",
    });
  };

  const handleClearFile = () => {
    setFileName(null);
    setContent("");
    setTitle("");
    setDescription("");
    setCategory("Mains");
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a recipe title.",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please add recipe content.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    const result = await createRecipe(
      title, 
      content, 
      category, 
      description,
      yieldQuantity,
      yieldUnit,
      false,
      [],
      0,
      0,
      30
    );
    setIsSaving(false);

    if (result) {
      navigate("/");
    }
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <GlassCard
        className={`p-8 transition-all duration-200 ${
          isDragging
            ? "border-primary/60 bg-primary/5 scale-[1.01]"
            : "border-border/40"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {fileName ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{fileName}</p>
                <p className="text-sm text-muted-foreground">
                  File imported successfully
                </p>
              </div>
            </div>
            <button
              onClick={handleClearFile}
              className="p-2 rounded-xl hover:bg-card/60 transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/20 flex items-center justify-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground mb-1">
              Drop your recipe file here
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Supports .md and .txt files
            </p>
            <PrimaryButton
              variant="secondary"
              onClick={handleUseTemplate}
              className="w-auto px-6 h-11"
            >
              Use Template
            </PrimaryButton>
          </div>
        )}
      </GlassCard>

      {/* Title Input */}
      <GlassInput
        placeholder="Recipe title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        icon={FileText}
      />

      {/* Category Select */}
      <GlassCard className="p-1">
        <Select value={category} onValueChange={(v) => setCategory(v as RecipeCategory)}>
          <SelectTrigger className="bg-transparent border-0 h-12 text-foreground focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50">
            {RECIPE_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </GlassCard>

      {/* Yield Input */}
      <YieldInput
        quantity={yieldQuantity}
        unit={yieldUnit}
        onQuantityChange={setYieldQuantity}
        onUnitChange={setYieldUnit}
      />

      {/* Content Editor */}
      <GlassTextarea
        label="Recipe Content (Markdown)"
        placeholder="Write your recipe here following the template format..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[400px]"
      />

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <PrimaryButton
          variant="secondary"
          onClick={() => navigate("/")}
          className="flex-1"
        >
          Cancel
        </PrimaryButton>
        <PrimaryButton 
          onClick={handleSave} 
          className="flex-1"
          isLoading={isSaving}
        >
          Save Recipe
        </PrimaryButton>
      </div>
    </div>
  );
}
