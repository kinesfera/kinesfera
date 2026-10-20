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

  const birth = new Date(birthDateString);
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
    // Approximate days in previous month
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

  // Format detailed chronological age like in medical reports: "7 años, 4 meses y 12 días"
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
