export class DateFormatter {
  static toLocaleDateString(dateString: string, options?: Intl.DateTimeFormatOptions): string {
    try {
      // Si la fecha es solo YYYY-MM-DD (sin hora), crear la fecha en UTC para evitar problemas de zona horaria
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        if (isNaN(date.getTime())) {
          return dateString;
        }
        return date.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
          ...options,
        });
      }
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        ...options,
      });
    } catch {
      return dateString;
    }
  }

  static toShortDateString(dateString: string): string {
    try {
      // Si la fecha es solo YYYY-MM-DD (sin hora), crear la fecha en UTC para evitar problemas de zona horaria
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        if (isNaN(date.getTime())) {
          return dateString;
        }
        return date.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  }

  static toDateOnlyString(dateString: string): string {
    try {
      // Si la fecha es solo YYYY-MM-DD (sin hora), crear la fecha en UTC para evitar problemas de zona horaria
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        if (isNaN(date.getTime())) {
          return dateString;
        }
        return date.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      }
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return dateString;
    }
  }
}

