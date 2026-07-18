// Top-10 competitive beauty sellers, one hosting every 6-month session.
// Instructor names are fictional personas.
export const TOP_SELLERS = [
  { rank: 1, instructor: 'Ananya Kapoor', specialty: 'Bridal & editorial glam' },
  {
    rank: 2,
    instructor: 'Namrata Soni',
    specialty: 'Everyday glow makeup',
    photo:
      'https://static.wixstatic.com/media/4b94ff_f9c940048c56466885c91859efd2bb1a~mv2.png/v1/fill/w_720,h_787,al_t,q_90,enc_avif,quality_auto/4b94ff_f9c940048c56466885c91859efd2bb1a~mv2.png',
  },
  { rank: 3, instructor: 'Rhea Malhotra', specialty: 'Bold pigment play' },
  { rank: 4, instructor: 'Sanya Iyer', specialty: 'Creative colour looks' },
  { rank: 5, instructor: 'Zara Khan', specialty: 'Full glam artistry' },
  { rank: 6, instructor: 'Meera Nair', specialty: 'Skin-first base makeup' },
  { rank: 7, instructor: 'Ishita Rao', specialty: 'Festive glam' },
  { rank: 8, instructor: 'Divya Sharma', specialty: 'Soft matte looks' },
  { rank: 9, instructor: 'Aisha Verma', specialty: 'Runway-ready finishes' },
  { rank: 10, instructor: 'Kavya Reddy', specialty: 'College & first-glam basics' },
]

const EPOCH = new Date(2026, 0, 1) // periods are counted from Jan 2026
const PERIOD_MONTHS = 6
const SESSION_MONTH_OFFSET = 2 // session falls in the 3rd month of each 6-month period
const SESSION_DAY = 15
const SESSION_HOUR = 18 // 6 PM IST

export const getCurrentSession = (now = new Date()) => {
  const monthsSinceEpoch =
    (now.getFullYear() - EPOCH.getFullYear()) * 12 + (now.getMonth() - EPOCH.getMonth())
  const periodIndex = Math.floor(monthsSinceEpoch / PERIOD_MONTHS)
  const host = TOP_SELLERS[((periodIndex % TOP_SELLERS.length) + TOP_SELLERS.length) % TOP_SELLERS.length]

  const periodStartMonth = EPOCH.getMonth() + periodIndex * PERIOD_MONTHS
  const date = new Date(
    EPOCH.getFullYear(),
    periodStartMonth + SESSION_MONTH_OFFSET,
    SESSION_DAY,
    SESSION_HOUR,
    0
  )
  const nextDate = new Date(
    EPOCH.getFullYear(),
    periodStartMonth + PERIOD_MONTHS + SESSION_MONTH_OFFSET,
    1
  )

  return { host, date, nextDate }
}
