export interface PrepItem {
  id: string
  category: string
  item: string
  containerSize: string
  dayOfWeek: string
  par: number
}

// Your actual prep sheets from the PDF
export const PREP_TEMPLATES: PrepItem[] = [
  // MONDAY
  { id: 'm1', category: 'MIXER', item: 'HOUSE MARGARITA MIX', containerSize: 'STORE & POUR', dayOfWeek: 'MONDAY', par: 4 },
  { id: 'm2', category: 'MIXER', item: 'MICHELADA', containerSize: 'STORE & POUR', dayOfWeek: 'MONDAY', par: 2 },
  { id: 'm3', category: 'MIXER', item: 'MINT BUSINESS', containerSize: 'CHEATER', dayOfWeek: 'MONDAY', par: 2 },
  { id: 'm4', category: 'MIXER', item: 'PINEAPPLE COCONUT CREAM', containerSize: 'DELI', dayOfWeek: 'MONDAY', par: 1.5 },
  { id: 'm5', category: 'JUICE', item: 'LIME', containerSize: 'DELI', dayOfWeek: 'MONDAY', par: 4 },
  { id: 'm6', category: 'JUICE', item: 'ORANGE', containerSize: 'STORE & POUR', dayOfWeek: 'MONDAY', par: 2 },
  { id: 'm7', category: 'JUICE', item: 'PINEAPPLE', containerSize: 'DELI', dayOfWeek: 'MONDAY', par: 1.5 },
  { id: 'm8', category: 'JUICE', item: 'ACID ADJUSTED PINEAPPLE', containerSize: 'DELI', dayOfWeek: 'MONDAY', par: 3, },
  { id: 'm9', category: 'SYRUP', item: 'SIMPLE', containerSize: 'DELI', dayOfWeek: 'MONDAY', par: 3 },
  { id: 'm10', category: 'SYRUP', item: "DON'S MIX", containerSize: 'DELI', dayOfWeek: 'MONDAY', par: 1.5 },
  { id: 'm11', category: 'SYRUP', item: 'TURBINADO', containerSize: 'DELI', dayOfWeek: 'MONDAY', par: 1.5 },
  { id: 'm12', category: 'SYRUP', item: 'VANILLA AGAVE', containerSize: 'DELI', dayOfWeek: 'MONDAY', par: 1.5 },
  { id: 'm13', category: 'BLEND', item: 'TEPACHE TIKI BLEND', containerSize: 'DELI', dayOfWeek: 'MONDAY', par: 2 },
  { id: 'm14', category: 'BLEND', item: 'SEE YA BLEND', containerSize: 'DELI', dayOfWeek: 'MONDAY', par: 2 },
  { id: 'm15', category: 'BLEND', item: 'MEXICAN RUM BLEND', containerSize: 'DELI', dayOfWeek: 'MONDAY', par: 2 },
  { id: 'm16', category: 'BLEND', item: 'GUAVA PASSIONFRUIT BLEND', containerSize: 'CHEATER', dayOfWeek: 'MONDAY', par: 2 },
  { id: 'm17', category: 'BLEND', item: 'GUAVA FRUITFUL', containerSize: 'CHEATER', dayOfWeek: 'MONDAY', par: 2 },
  { id: 'm18', category: 'BLEND', item: 'BLOOD ORANGE FRUITFUL', containerSize: 'CHEATER', dayOfWeek: 'MONDAY', par: 2 },
  { id: 'm19', category: 'CHEATER', item: 'GRAN MA', containerSize: 'CHEATER', dayOfWeek: 'MONDAY', par: 2 },
  { id: 'm20', category: 'INFUSION', item: 'HOT IN HERE TEQUILA', containerSize: 'TEQUILA BOTTLE', dayOfWeek: 'MONDAY', par: 3 },
  { id: 'm21', category: 'INFUSION', item: 'HOT IN HERE MEZCAL', containerSize: 'MEZCAL BOTTLE', dayOfWeek: 'MONDAY', par: 3 },
  { id: 'm22', category: 'INFUSION', item: 'CHOCOLATE MILK WASHED MEZCAL', containerSize: 'MEZCAL BOTTLE', dayOfWeek: 'MONDAY', par: 2 },
  { id: 'm23', category: 'INFUSION', item: 'BANANA JUSTINO', containerSize: 'RUM BOTTLE', dayOfWeek: 'MONDAY', par: 2 },
  { id: 'm24', category: 'FROZEN', item: 'STRAWBERRY MARGARITA', containerSize: '8QT CAMBRO', dayOfWeek: 'MONDAY', par: 1.0 },
  { id: 'm25', category: 'FROZEN', item: 'BANANA HAMMOCK', containerSize: '8QT CAMBRO', dayOfWeek: 'MONDAY', par: 1.0 },
  { id: 'm26', category: 'GARNISH', item: 'LIME WEDGES', containerSize: 'GARNISH TRAY', dayOfWeek: 'MONDAY', par: 5 },
  { id: 'm27', category: 'GARNISH', item: 'GRAPEFRUIT 1/2 WHEEL', containerSize: 'GARNISH TRAY', dayOfWeek: 'MONDAY', par: 2 },
  { id: 'm28', category: 'GARNISH', item: 'COCKTAIL CHERRIES', containerSize: 'GARNISH TRAY', dayOfWeek: 'MONDAY', par: 2 },
  { id: 'm29', category: 'GARNISH', item: 'ESPRESSO BEANS', containerSize: 'COPITA', dayOfWeek: 'MONDAY', par: 1 },
  { id: 'm30', category: 'GARNISH', item: 'TAJIN', containerSize: 'RIMMER', dayOfWeek: 'MONDAY', par: 2 },
  { id: 'm31', category: 'GARNISH', item: 'KOSHER SALT', containerSize: 'RIMMER', dayOfWeek: 'MONDAY', par: 2 },
  { id: 'm32', category: 'STAGED', item: 'AFFOGATO SETUP', containerSize: 'FREEZER', dayOfWeek: 'MONDAY', par: 4 },
  { id: 'm33', category: 'ICE', item: 'LARGE CUBES', containerSize: 'FREEZER', dayOfWeek: 'MONDAY', par: 24 },
  { id: 'm34', category: 'ICE', item: 'SPEARS', containerSize: 'FREEZER', dayOfWeek: 'MONDAY', par: 24 },

  // FRIDAY (higher volume)
  { id: 'f1', category: 'MIXER', item: 'HOUSE MARGARITA MIX', containerSize: 'STORE & POUR', dayOfWeek: 'FRIDAY', par: 6 },
  { id: 'f2', category: 'MIXER', item: 'MICHELADA', containerSize: 'STORE & POUR', dayOfWeek: 'FRIDAY', par: 3 },
  { id: 'f3', category: 'JUICE', item: 'LIME', containerSize: 'DELI', dayOfWeek: 'FRIDAY', par: 6 },
  { id: 'f4', category: 'JUICE', item: 'ACID ADJUSTED PINEAPPLE', containerSize: 'DELI', dayOfWeek: 'FRIDAY', par: 4 },
  { id: 'f5', category: 'INFUSION', item: 'CHOCOLATE MILK WASHED MEZCAL', containerSize: 'MEZCAL BOTTLE', dayOfWeek: 'FRIDAY', par: 2 },
  { id: 'f6', category: 'INFUSION', item: 'BANANA JUSTINO', containerSize: 'RUM BOTTLE', dayOfWeek: 'FRIDAY', par: 2 },
  { id: 'f7', category: 'ICE', item: 'LARGE CUBES', containerSize: 'FREEZER', dayOfWeek: 'FRIDAY', par: 36 },
  { id: 'f8', category: 'ICE', item: 'SPEARS', containerSize: 'FREEZER', dayOfWeek: 'FRIDAY', par: 36 },

  // SATURDAY (also higher volume)
  { id: 'sat1', category: 'MIXER', item: 'HOUSE MARGARITA MIX', containerSize: 'STORE & POUR', dayOfWeek: 'SATURDAY', par: 6 },
  { id: 'sat2', category: 'MIXER', item: 'MICHELADA', containerSize: 'STORE & POUR', dayOfWeek: 'SATURDAY', par: 3 },
  { id: 'sat3', category: 'JUICE', item: 'LIME', containerSize: 'DELI', dayOfWeek: 'SATURDAY', par: 6 },
  { id: 'sat4', category: 'INFUSION', item: 'CHOCOLATE MILK WASHED MEZCAL', containerSize: 'MEZCAL BOTTLE', dayOfWeek: 'SATURDAY', par: 2 },
  { id: 'sat5', category: 'INFUSION', item: 'BANANA JUSTINO', containerSize: 'RUM BOTTLE', dayOfWeek: 'SATURDAY', par: 2 },
  { id: 'sat6', category: 'ICE', item: 'LARGE CUBES', containerSize: 'FREEZER', dayOfWeek: 'SATURDAY', par: 36 },
  { id: 'sat7', category: 'ICE', item: 'SPEARS', containerSize: 'FREEZER', dayOfWeek: 'SATURDAY', par: 36 },
]

export function getPrepItemsForDay(dayOfWeek: string): PrepItem[] {
  return PREP_TEMPLATES.filter(item => item.dayOfWeek === dayOfWeek.toUpperCase())
    .sort((a, b) => {
      const categoryOrder = ['MIXER', 'JUICE', 'SYRUP', 'BLEND', 'CHEATER', 'INFUSION', 'FROZEN', 'DRAFT', 'NITRO', 'BITTERS', 'GARNISH', 'STAGED', 'ICE']
      return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
    })
}

export function getDayOfWeek(): string {
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
  return days[new Date().getDay()]!
}
