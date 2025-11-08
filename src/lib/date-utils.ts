import { format, isToday, isFuture, parseISO, getYear, getMonth, getDate } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface SpecialDate {
  name: string;
  date: string; // ISO string (YYYY-MM-DD)
  month: string;
  isVariable: boolean;
}

// Lista de todas as datas, tratadas como fixas para garantir a ordem e os dias solicitados.
const getAllDates = (year: number): SpecialDate[] => {
  return [
    // JANEIRO
    { name: "Confraternização Universal", date: `${year}-01-01`, month: 'JANEIRO', isVariable: false },
    { name: "Dia de Reis", date: `${year}-01-06`, month: 'JANEIRO', isVariable: false },
    { name: "Aniversário da Cidade de São Paulo", date: `${year}-01-25`, month: 'JANEIRO', isVariable: false },
    { name: "Volta às Aulas", date: `${year}-01-27`, month: 'JANEIRO', isVariable: false }, 
    
    // FEVEREIRO
    { name: "Carnaval", date: `${year}-02-14`, month: 'FEVEREIRO', isVariable: false }, // FIXO: 14/02
    { name: "Quarta-feira de Cinzas", date: `${year}-02-15`, month: 'FEVEREIRO', isVariable: false }, // FIXO: 15/02
    { name: "Dia Mundial da Justiça Social", date: `${year}-02-20`, month: 'FEVEREIRO', isVariable: false },
    
    // MARÇO
    { name: "Dia Internacional da Mulher", date: `${year}-03-08`, month: 'MARÇO', isVariable: false },
    { name: "Dia do Consumidor", date: `${year}-03-15`, month: 'MARÇO', isVariable: false },
    { name: "Dia de São Patrício", date: `${year}-03-17`, month: 'MARÇO', isVariable: false },
    { name: "Dia do Artesão", date: `${year}-03-19`, month: 'MARÇO', isVariable: false },
    { name: "Dia Mundial da Água", date: `${year}-03-22`, month: 'MARÇO', isVariable: false },
    
    // ABRIL
    { name: "Dia da Mentira", date: `${year}-04-01`, month: 'ABRIL', isVariable: false },
    { name: "Dia Mundial da Saúde", date: `${year}-04-07`, month: 'ABRIL', isVariable: false },
    { name: "Sexta-Feira Santa (Feriado Nacional)", date: `${year}-04-18`, month: 'ABRIL', isVariable: false }, // FIXO: 18/04
    { name: "Dia do Índio", date: `${year}-04-19`, month: 'ABRIL', isVariable: false },
    { name: "Páscoa", date: `${year}-04-20`, month: 'ABRIL', isVariable: false }, // FIXO: 20/04
    { name: "Tiradentes (Feriado Nacional)", date: `${year}-04-21`, month: 'ABRIL', isVariable: false },
    { name: "Descobrimento do Brasil", date: `${year}-04-22`, month: 'ABRIL', isVariable: false },
    { name: "Dia do Profissional de Contabilidade", date: `${year}-04-25`, month: 'ABRIL', isVariable: false },
    
    // MAIO
    { name: "Dia do Trabalhador (Feriado Nacional)", date: `${year}-05-01`, month: 'MAIO', isVariable: false },
    { name: "Dia das Comunicações", date: `${year}-05-05`, month: 'MAIO', isVariable: false },
    { name: "Dia das Mães", date: `${year}-05-11`, month: 'MAIO', isVariable: false }, // FIXO: 11/05
    { name: "Abolição da Escravatura no Brasil", date: `${year}-05-13`, month: 'MAIO', isVariable: false },
    { name: "Dia do Orgulho Nerd / Dia do Trabalhador", date: `${year}-05-25`, month: 'MAIO', isVariable: false },
    { name: "Corpus Christi", date: `${year}-05-29`, month: 'MAIO', isVariable: false }, // FIXO: 29/05
    
    // JUNHO
    { name: "Dia Mundial do Meio Ambiente", date: `${year}-06-05`, month: 'JUNHO', isVariable: false },
    { name: "Dia do Porteiro", date: `${year}-06-09`, month: 'JUNHO', isVariable: false },
    { name: "Dia dos Namorados", date: `${year}-06-12`, month: 'JUNHO', isVariable: false },
    { name: "Dia do Revendedor", date: `${year}-06-20`, month: 'JUNHO', isVariable: false },
    { name: "Dia de São João", date: `${year}-06-24`, month: 'JUNHO', isVariable: false },
    { name: "Dia de São Pedro e São Paulo", date: `${year}-06-29`, month: 'JUNHO', isVariable: false },
    
    // JULHO
    { name: "Dia do Bombeiro Brasileiro", date: `${year}-07-02`, month: 'JULHO', isVariable: false },
    { name: "Revolução Constitucionalista", date: `${year}-07-09`, month: 'JULHO', isVariable: false },
    { name: "Dia Mundial do Rock", date: `${year}-07-13`, month: 'JULHO', isVariable: false },
    { name: "Dia do Amigo / Dia Internacional da Amizade", date: `${year}-07-20`, month: 'JULHO', isVariable: false },
    { name: "Dia dos Avós", date: `${year}-07-26`, month: 'JULHO', isVariable: false },
    
    // AGOSTO
    { name: "Dia dos Pais", date: `${year}-08-10`, month: 'AGOSTO', isVariable: false }, // FIXO: 10/08
    { name: "Dia do Advogado / Dia do Estudante", date: `${year}-08-11`, month: 'AGOSTO', isVariable: false },
    { name: "Dia do Garçom", date: `${year}-08-11`, month: 'AGOSTO', isVariable: false },
    { name: "Dia do Soldado", date: `${year}-08-25`, month: 'AGOSTO', isVariable: false },
    
    // SETEMBRO
    { name: "Independência do Brasil (Feriado Nacional)", date: `${year}-09-07`, month: 'SETEMBRO', isVariable: false },
    { name: "Dia do Cliente", date: `${year}-09-15`, month: 'SETEMBRO', isVariable: false },
    { name: "Dia da Árvore", date: `${year}-09-21`, month: 'SETEMBRO', isVariable: false },
    { name: "Início da Primavera", date: `${year}-09-23`, month: 'SETEMBRO', isVariable: false },
    { name: "Dia Mundial do Turismo", date: `${year}-09-27`, month: 'SETEMBRO', isVariable: false },
    
    // OUTUBRO
    { name: "Dia dos Animais / Dia de São Francisco de Assis", date: `${year}-10-04`, month: 'OUTUBRO', isVariable: false },
    { name: "Dia do Compositor", date: `${year}-10-07`, month: 'OUTUBRO', isVariable: false },
    { name: "Nossa Senhora Aparecida / Dia das Crianças", date: `${year}-10-12`, month: 'OUTUBRO', isVariable: false },
    { name: "Dia do Professor", date: `${year}-10-15`, month: 'OUTUBRO', isVariable: false },
    { name: "Dia das Bruxas (Halloween)", date: `${year}-10-31`, month: 'OUTUBRO', isVariable: false },
    
    // NOVEMBRO (POSIÇÃO CORRIGIDA)
    { name: "Proclamação da República (Feriado Nacional)", date: `${year}-11-15`, month: 'NOVEMBRO', isVariable: false },
    { name: "Dia da Consciência Negra", date: `${year}-11-20`, month: 'NOVEMBRO', isVariable: false },
    { name: "Black Friday", date: `${year}-11-28`, month: 'NOVEMBRO', isVariable: false }, 
    
    // DEZEMBRO
    { name: "Dia Nacional do Samba", date: `${year}-12-02`, month: 'DEZEMBRO', isVariable: false },
    { name: "Início do Verão", date: `${year}-12-21`, month: 'DEZEMBRO', isVariable: false },
    { name: "Véspera de Natal", date: `${year}-12-24`, month: 'DEZEMBRO', isVariable: false },
    { name: "Natal", date: `${year}-12-25`, month: 'DEZEMBRO', isVariable: false },
    { name: "Véspera de Ano Novo / Réveillon", date: `${year}-12-31`, month: 'DEZEMBRO', isVariable: false },
  ];
};

/**
 * Combina datas fixas e variáveis, filtra as futuras e agrupa por mês.
 * @returns Array de SpecialDate, incluindo separadores de mês.
 */
export const getUpcomingDates = (): SpecialDate[] => {
  const now = new Date();
  const currentYear = getYear(now);
  const nextYear = currentYear + 1;
  
  // 1. Coleta todas as datas para o ano atual e próximo (agora todas são fixas)
  const datesCurrent = getAllDates(currentYear);
  const datesNext = getAllDates(nextYear);
  
  const allDates = [...datesCurrent, ...datesNext];

  // 2. Mapeia para objetos Date e filtra apenas datas futuras ou de hoje
  const filteredDates = allDates
    .map(d => ({ ...d, dateObj: parseISO(d.date) }))
    .filter(d => isFuture(d.dateObj) || isToday(d.dateObj));

  // 3. Remove duplicatas (mantendo a ocorrência mais próxima/futura)
  const finalDatesMap = new Map<string, SpecialDate>();
  
  filteredDates
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime()) // Ordena cronologicamente
    .forEach(d => {
        // Usa o nome da data como chave para evitar duplicatas (ex: Carnaval do ano atual vs próximo)
        if (!finalDatesMap.has(d.name)) {
            finalDatesMap.set(d.name, { name: d.name, date: d.date, month: d.month, isVariable: d.isVariable });
        }
    });
    
  const finalDates = Array.from(finalDatesMap.values());

  // 4. Agrupa por mês para exibição
  const groupedDates: SpecialDate[] = [];
  let currentMonth = '';
  
  finalDates.forEach(d => {
      const dateObj = parseISO(d.date);
      const monthName = format(dateObj, 'MMMM', { locale: ptBR }).toUpperCase();
      
      if (monthName !== currentMonth) {
          // Adiciona o separador de mês
          groupedDates.push({ name: monthName, date: '', month: monthName, isVariable: false });
          currentMonth = monthName;
      }
      groupedDates.push(d);
  });

  return groupedDates;
};