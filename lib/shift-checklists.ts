export interface ChecklistItem {
  id: string
  task: string
  isSection?: boolean
}

export interface ChecklistTemplate {
  type: 'opening' | 'closing'
  items: ChecklistItem[]
  weeklySidework: Record<string, string>
}

export const OPENING_CHECKLIST: ChecklistTemplate = {
  type: 'opening',
  items: [
    { id: 'o1', task: 'CLOCK IN' },
    { id: 'o2', task: 'TURN ON MUSIC & LIGHTS' },
    { id: 'o3', task: 'CLEAN FRONT ENTRY' },
    { id: 'o4', task: 'FILL & LABEL SANITIZER BUCKETS' },
    { id: 'o5', task: 'STRAIGHTEN BAR STOOLS' },
    { id: 'o6', task: 'CHECK TRASH CANS & LINERS' },
    { id: 'o7', task: 'STOCK POLISHING CLOTHES & BAR TOWELS' },
    { id: 'o8', task: 'TURN ON GLASS WASHER & CHECK CHEMICALS' },
    { id: 'o9', task: 'CHECK PAR SHEET & PREP ACCORDINGLY:', isSection: true },
    { id: 'o10', task: 'JUICES' },
    { id: 'o11', task: 'SYRUPS' },
    { id: 'o12', task: 'MIXERS' },
    { id: 'o13', task: 'INFUSIONS' },
    { id: 'o14', task: 'FROZENS' },
    { id: 'o15', task: 'DRAFT' },
    { id: 'o16', task: 'NITRO' },
    { id: 'o17', task: 'BITTERS & TINCTURES' },
    { id: 'o18', task: 'GARNISHES' },
    { id: 'o19', task: 'LARGE FORMAT ICE' },
    { id: 'o20', task: 'BEER' },
    { id: 'o21', task: 'WINE' },
    { id: 'o22', task: 'PRELOAD AFFOGATO COUPES x4' },
    { id: 'o23', task: 'SWITCH SPACEMAN FROM STANDBY TO FREEZE' },
    { id: 'o24', task: 'CHECK CORNY KEG LEVELS & PSI (~25 PSI)' },
    { id: 'o25', task: 'FILL ICE BINS WITH ICE' },
    { id: 'o26', task: 'SET UP BOTH WELLS' },
    { id: 'o27', task: 'LINE CHECK ALL BAR PREP ITEMS' },
    { id: 'o28', task: 'CLEAR OFF BAR TOP & BACK BAR' },
    { id: 'o29', task: 'WIPE DOWN TABLES, BAR TOP & BACK BAR' },
    { id: 'o30', task: 'WIPE DOWN ALL MENUS' },
    { id: 'o31', task: 'SET OUT WATER BOTTLES' },
    { id: 'o32', task: 'CHECK BATHROOMS: CLEAN & STOCKED' },
    { id: 'o33', task: 'SET UP TABLE & CHAIRS OUTSIDE' },
    { id: 'o34', task: 'OPEN @4P (2P ON FRI, 12P ON SAT/SUN)' },
  ],
  weeklySidework: {
    MONDAY: 'CLEAN & LUBE SPACEMAN',
    TUESDAY: 'CLEAN UNDER GLASSMATS',
    WEDNESDAY: 'CLEAN BACKBAR LIQUOR BOTTLES',
    THURSDAY: 'CLEAN POURSPOUTS',
    FRIDAY: 'CLEAN & LUBE SPACEMAN',
    SATURDAY: 'CLEAN UNDER GLASSMATS',
    SUNDAY: 'CLEAN BACKBAR LIQUOR BOTTLES',
  }
}

export const CLOSING_CHECKLIST: ChecklistTemplate = {
  type: 'closing',
  items: [
    { id: 'c1', task: 'STOCK LIQUOR, BEER & WINE' },
    { id: 'c2', task: 'VACUUM PUMP ALL OPEN WINE BOTTLES' },
    { id: 'c3', task: 'WASH & POLISH ALL GLASSWARE' },
    { id: 'c4', task: 'STOCK STRAWS & NAPKINS' },
    { id: 'c5', task: 'SCRUB EMPTY CHEATER BOTTLES' },
    { id: 'c6', task: 'WIPE DOWN JUICE, SYRUP & MIXER BOTTLES' },
    { id: 'c7', task: 'PLACE BOTTLES IN COOLER' },
    { id: 'c8', task: 'STORE CUT FRUIT IN COOLER' },
    { id: 'c9', task: 'WRAP CHERRIES IN PLASTIC' },
    { id: 'c10', task: 'PLACE PEELED CITRUS IN COOLER FOR JUICING' },
    { id: 'c11', task: 'TURN SPACEMAN ON STANDBY' },
    { id: 'c12', task: 'RUN 2 QTS COLD WATER THROUGH BROOD TAPS' },
    { id: 'c13', task: 'CLEAN & DRY BAR TOOLS' },
    { id: 'c14', task: 'CLEAN EMPTY JUICE/SYRUP BOTTLES' },
    { id: 'c15', task: 'CLEAN & DRY STAINLESS DRIP RAILS' },
    { id: 'c16', task: 'WIPE DOWN ICE BINS' },
    { id: 'c17', task: 'WIPE DOWN SPEED RAILS' },
    { id: 'c18', task: 'CLEAN & DRY TAP DRAINS' },
    { id: 'c19', task: 'WIPE DOWN SINKS' },
    { id: 'c20', task: 'EMPTY, DRAIN & WIPE DOWN GLASS WASHER' },
    { id: 'c21', task: 'COLLECT & WIPE DOWN MENUS' },
    { id: 'c22', task: 'CLEAN FLATWARE HOLDERS & STOCK FORKS' },
    { id: 'c23', task: 'WIPE DOWN TABLES & BAR TOP' },
    { id: 'c24', task: 'TAKE OUT TRASH & RECYCLING' },
    { id: 'c25', task: 'EMPTY SANITIZER BUCKETS' },
    { id: 'c26', task: 'PLACE ALL DIRTY TOWELS IN LAUNDRY' },
    { id: 'c27', task: 'DO CHECKOUT & DROP' },
    { id: 'c28', task: 'TURN OFF MUSIC & LIGHTS' },
    { id: 'c29', task: 'CLOCK OUT' },
    { id: 'c30', task: 'LOCK UP' },
  ],
  weeklySidework: {
    MONDAY: 'CLEAN VIP BANQUETTE',
    TUESDAY: 'CLEAN OUT COOLERS & GASKETS',
    WEDNESDAY: 'CLEAN SYRUP & JUICE BOTTLES',
    THURSDAY: 'DETAIL MENUS',
    FRIDAY: 'CLEAN VIP BANQUETTE',
    SATURDAY: 'CLEAN OUT COOLERS & GASKETS',
    SUNDAY: 'CLEAN SYRUP & JUICE BOTTLES',
  }
}

export function getDayOfWeekName(): string {
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
  return days[new Date().getDay()]!
}

export function getSideworkTask(type: 'opening' | 'closing', dayOfWeek?: string): string {
  const day = dayOfWeek || getDayOfWeekName()
  const template = type === 'opening' ? OPENING_CHECKLIST : CLOSING_CHECKLIST
  return template.weeklySidework[day] || 'No sidework'
}
