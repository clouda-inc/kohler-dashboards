import type {
  ParamsContext,
  RecorderState,
  ServiceContext,
  IOContext,
  SegmentData,
} from '@vtex/api'
import { Service } from '@vtex/api'

import { Clients } from './clients'
import { queries as orderQueries, mutations as orderMutations } from './resolvers/orders/orders'

const MEDIUM_TIMEOUT_MS = 60 * 1000

declare global {
  // We declare a global Context type just to avoid re-writing ServiceContext<Clients, State> in every handler and resolver
  type Context = ServiceContext<Clients, RecorderState, CustomContext>

  interface CustomContext extends ParamsContext {
    cookie: string
    originalPath: string
    vtex: CustomIOContext
  }

  interface CustomIOContext extends IOContext {
    segment?: SegmentData
  }
}

// Export a service that defines resolvers and clients' options
export default new Service<Clients, RecorderState, CustomContext>({
  clients: {
    implementation: Clients,
    options: {
      default: {
        timeout: MEDIUM_TIMEOUT_MS,
      },
    },
  },
  graphql: {
    resolvers: {
      Query: {
        ...orderQueries,
      },
      Mutation: {
        ...orderMutations,
      },
    },
  },
})
