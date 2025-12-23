import { IOClients } from '@vtex/api'

import { Catalog } from './catalog'
import { Search } from './search'

export class Clients extends IOClients {
  public get catalog() {
    return this.getOrSet('catalog', Catalog)
  }

  public get search(): any {
    return this.getOrSet('search', Search)
  }
}
