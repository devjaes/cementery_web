import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Grid3X3 } from 'lucide-react';

interface ColumnsSelectorProps {
  columns: number;
  onChange: (columns: number) => void;
  maxColumns?: number;
  minColumns?: number;
}

export const ColumnsSelector: React.FC<ColumnsSelectorProps> = ({ 
  columns, 
  onChange, 
  maxColumns = 15, 
  minColumns = 1 
}) => {
  const columnOptions = Array.from(
    { length: maxColumns - minColumns + 1 }, 
    (_, i) => minColumns + i
  );

  return (
    <div className="flex items-center gap-3 justify-center mb-6">
      <div className="flex items-center gap-2">
        <Grid3X3 className="h-4 w-4 text-muted-foreground" />
        <Label htmlFor="columns-select" className="text-sm font-medium">
          Columnas:
        </Label>
      </div>
      
      <Select value={columns.toString()} onValueChange={(value) => onChange(Number(value))}>
        <SelectTrigger className="w-20 h-8">
          <SelectValue placeholder={columns.toString()} />
        </SelectTrigger>
        <SelectContent>
          {columnOptions.map((num) => (
            <SelectItem key={num} value={num.toString()}>
              {num}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <span className="text-xs text-muted-foreground">
        por fila
      </span>
    </div>
  );
};