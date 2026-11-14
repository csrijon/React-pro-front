import { USE_MOCK, http } from './config'
import { viewsSeries } from '../data/misc'
export const statsService = { views: async () => (USE_MOCK ? viewsSeries : (await http('/admin/stats')).viewsSeries) }
