/**
 * Utilidad clínica para cálculo exacto de edad pediátrica
 * y determinación de etapa de desarrollo (Lactante, Jardín/Escuela > 3 años, etc.)
 */

export interface PatientAgeInfo {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  isOlderThanThree: boolean;
  isUnderTwo: boolean;
  ageText: string;
  detailedChronologicalAge: string;
  stageBadgeText: string;
}

/**
 * Formatea cualquier fecha (YYYY-MM-DD, ISO, MM/DD/YYYY o DD-MM-YYYY) a formato día-mes-año (DD-MM-YYYY)
 */
export function formatDateDMY(dateStr?: string): string {
  if (!dateStr || dateStr === 'No registrada' || dateStr.trim() === '') {
    return 'No registrada';
  }
  const clean = dateStr.trim();

  // Already DD-MM-YYYY
  if (/^\d{2}-\d{2}-\d{4}$/.test(clean)) {
    return clean;
  }

  // YYYY-MM-DD or ISO YYYY-MM-DDTHH...
  const isoMatch = clean.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return `${isoMatch[3]}-${isoMatch[2]}-${isoMatch[1]}`;
  }

  // DD/MM/YYYY or MM/DD/YYYY
  const slashMatch = clean.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const p1 = parseInt(slashMatch[1], 10);
    const p2 = parseInt(slashMatch[2], 10);
    const y = slashMatch[3];
    // If p1 > 12 it is DD/MM/YYYY, if p2 > 12 it is MM/DD/YYYY
    if (p2 > 12) {
      return `${String(p2).padStart(2, '0')}-${String(p1).padStart(2, '0')}-${y}`;
    }
    return `${String(p1).padStart(2, '0')}-${String(p2).padStart(2, '0')}-${y}`;
  }

  const parsed = new Date(clean);
  if (!isNaN(parsed.getTime())) {
    const d = String(parsed.getDate()).padStart(2, '0');
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const y = parsed.getFullYear();
    return `${d}-${m}-${y}`;
  }

  return clean;
}

export function calculatePatientAge(birthDateString?: string): PatientAgeInfo {
  if (!birthDateString || birthDateString === 'No registrada' || birthDateString.trim() === '') {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalMonths: 0,
      isOlderThanThree: false,
      isUnderTwo: false,
      ageText: 'Edad no registrada',
      detailedChronologicalAge: 'Edad no registrada',
      stageBadgeText: 'Sin fecha'
    };
  }

  let birth: Date;
  const dmyMatch = birthDateString.trim().match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (dmyMatch) {
    birth = new Date(Number(dmyMatch[3]), Number(dmyMatch[2]) - 1, Number(dmyMatch[1]));
  } else {
    birth = new Date(birthDateString);
  }

  if (isNaN(birth.getTime())) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalMonths: 0,
      isOlderThanThree: false,
      isUnderTwo: false,
      ageText: birthDateString,
      detailedChronologicalAge: birthDateString,
      stageBadgeText: 'Sin fecha válida'
    };
  }

  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonthDays = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += prevMonthDays;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const totalMonths = years * 12 + months;
  const isOlderThanThree = years >= 3;
  const isUnderTwo = years < 2;

  let ageText = '';
  if (years === 0) {
    ageText = `${months} meses`;
  } else if (years < 3) {
    ageText = `${years} año${years > 1 ? 's' : ''} y ${months} mes${months !== 1 ? 'es' : ''}`;
  } else {
    ageText = `${years} años (${months} meses)`;
  }

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} año${years > 1 ? 's' : ''}`);
  if (months > 0 || years === 0) parts.push(`${months} mes${months !== 1 ? 'es' : ''}`);
  if (days >= 0) parts.push(`${days} día${days !== 1 ? 's' : ''}`);
  
  const detailedChronologicalAge = parts.length > 2 
    ? `${parts[0]}, ${parts[1]} y ${parts[2]}` 
    : parts.join(' y ');

  let stageBadgeText = '';
  if (isOlderThanThree) {
    stageBadgeText = 'En edad de Jardín / Escuela (> 3 años)';
  } else if (isUnderTwo) {
    stageBadgeText = 'Lactante / Menor de 2 años (HINE)';
  } else {
    stageBadgeText = 'Primera Infancia (2 a 3 años)';
  }

  return {
    years,
    months,
    days,
    totalMonths,
    isOlderThanThree,
    isUnderTwo,
    ageText,
    detailedChronologicalAge,
    stageBadgeText
  };
}
