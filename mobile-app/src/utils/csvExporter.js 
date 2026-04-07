import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { formatDate } from './formatters';

// Convert expenses array to CSV string
const expensesToCSV = (expenses) => {
  const headers = [
    'Fecha',
    'Título',
    'Categoría',
    'Monto',
    'Cuenta',
    'Notas',
  ].join(',');

  const rows = expenses.map((expense) => {
    return [
      formatDate(expense.date || expense.created_at),
      `"${expense.title || ''}"`,
      expense.category || '',
      expense.amount || 0,
      expense.account_id || '',
      `"${expense.notes || ''}"`,
    ].join(',');
  });

  return [headers, ...rows].join('\n');
};

// Export expenses as CSV and share
export const exportExpensesCSV = async (expenses, fileName = 'maggibank_gastos') => {
  try {
    const csv = expensesToCSV(expenses);
    const date = new Date().toISOString().split('T')[0];
    const fullFileName = `${fileName}_${date}.csv`;
    const fileUri = `${FileSystem.documentDirectory}${fullFileName}`;

    await FileSystem.writeAsStringAsync(fileUri, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Compartir no está disponible en este dispositivo.');
    }

    await Sharing.shareAsync(fileUri, {
      mimeType: 'text/csv',
      dialogTitle: 'Exportar gastos MaggiBank',
      UTI: 'public.comma-separated-values-text',
    });

    return true;
  } catch (err) {
    throw new Error(`Error exportando CSV: ${err.message}`);
  }
};

// Export accounts as CSV and share
export const exportAccountsCSV = async (accounts, fileName = 'maggibank_cuentas') => {
  try {
    const headers = ['Nombre', 'Tipo', 'Balance', 'Moneda'].join(',');
    const rows = accounts.map((account) => [
      `"${account.name || ''}"`,
      account.type || '',
      account.balance || 0,
      account.currency || 'COP',
    ].join(','));

    const csv = [headers, ...rows].join('\n');
    const date = new Date().toISOString().split('T')[0];
    const fullFileName = `${fileName}_${date}.csv`;
    const fileUri = `${FileSystem.documentDirectory}${fullFileName}`;

    await FileSystem.writeAsStringAsync(fileUri, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Compartir no está disponible en este dispositivo.');
    }

    await Sharing.shareAsync(fileUri, {
      mimeType: 'text/csv',
      dialogTitle: 'Exportar cuentas MaggiBank',
      UTI: 'public.comma-separated-values-text',
    });

    return true;
  } catch (err) {
    throw new Error(`Error exportando CSV: ${err.message}`);
  }
};
