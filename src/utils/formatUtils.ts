/**
 * Format a number as a currency value in Brazilian Real (BRL)
 */
export function formatCurrency(value: number | null): string {
    if (value === null) return "N/A";
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
  
  /**
   * Format a date string to Brazilian format (DD/MM/YYYY)
   */
  export function formatDate(dateString: string): string {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }
  