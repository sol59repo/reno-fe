import Mock from './mock'

import './db/auth'
import './db/calendarEvents'
import './db/notification'

Mock.onAny().passThrough()
