import { useState, useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Paintbrush } from "lucide-react";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  description?: string;
}

const presetColors = [
  "#2d1f14", // chocolate
  "#1a120b", // chocolate dark
  "#4a3728", // chocolate light
  "#b8860b", // gold
  "#c4956a", // warm gold
  "#d4a574", // light gold
  "#f5f0ea", // cream
  "#faf7f2", // off-white
  "#ffffff", // white
  "#000000", // black
  "#1a8a7a", // teal accent
  "#b5706e", // rose
  "#8b4513", // saddle brown
  "#d2691e", // chocolate web
  "#a0522d", // sienna
  "#deb887", // burlywood
];

const ColorPicker = ({ label, value, onChange, description }: ColorPickerProps) => {
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    if (/^#([0-9A-Fa-f]{6})$/.test(val)) {
      onChange(val);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="w-10 h-10 rounded-md border border-border shadow-sm cursor-pointer flex items-center justify-center hover:ring-2 hover:ring-ring transition-all"
              style={{ backgroundColor: value || "#ffffff" }}
            >
              {!value && <Paintbrush size={16} className="text-muted-foreground" />}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="start">
            <div className="space-y-3">
              <p className="text-sm font-medium">Escolha uma cor</p>
              <div className="grid grid-cols-8 gap-1.5">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-7 h-7 rounded-md border cursor-pointer transition-all hover:scale-110 ${
                      value === color ? "ring-2 ring-ring ring-offset-1" : "border-border"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      onChange(color);
                      setInputValue(color);
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={value || "#ffffff"}
                  onChange={(e) => {
                    onChange(e.target.value);
                    setInputValue(e.target.value);
                  }}
                  className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                />
                <Input
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="#000000"
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Input
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="#000000"
          className="h-10 font-mono text-sm max-w-32"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setInputValue("");
            }}
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            Limpar
          </button>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
