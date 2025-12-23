import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

export class Catalog extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(
      `http://${context.account}.vtexcommercestable.com.br`,
      context,
      options
    )
  }

  public getNonStructuredSpecificationsBySkuId = (
    skuId: string | number,
    appKey: string,
    appToken: string
  ) => {
    const endpoint = `${this.options?.baseURL}/api/catalog/pvt/specification/nonstructured?skuId=${skuId}`

    return this.http.get(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Vtex-Proxy-To': endpoint,
        'X-Vtex-Use-Https': true,
        'Cache-Control': 'no-cache',
        'X-VTEX-API-AppKey': appKey,
        'X-VTEX-API-AppToken': appToken,
      },
    })
  }

  public inventoryBySkuId = (id: string | number) => {
    this.context.logger.debug({
      auth: this.context.authToken,
      url: this.context.host,
    })
    const endpoint = `${this.options?.baseURL}/api/logistics/pvt/inventory/skus/${id}`

    return this.http.get(`/api/logistics/pvt/inventory/skus/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        VtexIdclientAutCookie: `${this.context.authToken}`,
        'Proxy-Authorization': this.context.authToken,
        'X-Vtex-Proxy-To': endpoint,
        'X-Vtex-Use-Https': true,
        'Cache-Control': 'no-cache',
      },
    })
  }

  public getProductByRefId = async (refId: string) => {
    this.context.logger.debug({
      auth: this.context.authToken,
      url: this.context.host,
    })

    const productEndpoint = `${this.options?.baseURL}/api/catalog_system/pvt/products/productgetbyrefid/${refId}`

    try {
      const productResponse = await this.http.get(productEndpoint, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          VtexIdclientAutCookie: `${this.context.authToken}`,
          'Proxy-Authorization': this.context.authToken,
          'X-Vtex-Proxy-To': productEndpoint,
          'X-Vtex-Use-Https': true,
          'Cache-Control': 'no-cache',
        },
      })

      return productResponse
    } catch (error) {
      return null
    }
  }

  public getSkuByRefId = async (
    refId: string,
    appKey: string,
    appToken: string
  ) => {
    const skuEndpoint = `${this.options?.baseURL}/api/catalog/pvt/stockkeepingunit`

    try {
      const skuResponse = await this.http.get(skuEndpoint, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Proxy-Authorization': this.context.authToken,
          'X-Vtex-Proxy-To': skuEndpoint,
          'X-Vtex-Use-Https': true,
          'Cache-Control': 'no-cache',
          'X-VTEX-API-AppKey': appKey,
          'X-VTEX-API-AppToken': appToken,
        },
        params: {
          RefId: refId,
        },
      })

      return skuResponse
    } catch (error) {
      console.error(error)

      return null
    }
  }

  public getSkuContextById = async (id: string) => {
    const skuEndpoint = `${this.options?.baseURL}/api/catalog_system/pvt/sku/stockkeepingunitbyid/${id}`

    try {
      const skuResponse = await this.http.get(skuEndpoint, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          VtexIdclientAutCookie: `${this.context.authToken}`,
          'Proxy-Authorization': this.context.authToken,
          'X-Vtex-Proxy-To': skuEndpoint,
          'X-Vtex-Use-Https': true,
          'Cache-Control': 'no-cache',
        },
      })

      return skuResponse
    } catch (error) {
      console.error(error)

      return null
    }
  }

  public getSkuContextByRefId = async (
    refId: string,
    appKey: string,
    appToken: string
  ) => {
    try {
      const skuResponse = await this.getSkuByRefId(refId, appKey, appToken)
      const skuContext = await this.getSkuContextById(skuResponse?.Id)

      return {
        id: skuContext.BrandId,
        name: skuContext.BrandName,
      }
    } catch (error) {
      return {
        id: '',
        name: '',
      }
    }
  }

  public getProductSpecificationByName = async (
    refId: string,
    productSpecName: string
  ) => {
    this.context.logger.debug({
      auth: this.context.authToken,
      url: this.context.host,
    })

    const productResponse = await this.getProductByRefId(refId)

    if (!productResponse || !productResponse?.Id) {
      return null
    }

    const productSpecificationsEndpoint = `${this.options?.baseURL}/api/catalog_system/pvt/products/${productResponse.Id}/specification`

    const productSpecificationsResponse = await this.http.get(
      productSpecificationsEndpoint,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          VtexIdclientAutCookie: `${this.context.authToken}`,
          'Proxy-Authorization': this.context.authToken,
          'X-Vtex-Proxy-To': productSpecificationsEndpoint,
          'X-Vtex-Use-Https': true,
          'Cache-Control': 'no-cache',
        },
      }
    )

    if (
      !productSpecificationsResponse ||
      !productSpecificationsResponse?.length
    ) {
      return null
    }

    const specValue = productSpecificationsResponse.find(
      (el: { Name: string }) =>
        el?.Name?.toUpperCase().trim() === productSpecName?.toUpperCase().trim()
    )?.Value

    return specValue
  }

  public getSkuDetailswithSku = async (skuId: string | number) => {
    this.context.logger.debug({
      auth: this.context.authToken,
      url: this.context.host,
    })

    const endpoint = `${this.options?.baseURL}/api/catalog/pvt/stockkeepingunit/${skuId}`

    try {
      const skuDetailsResponse = await this.http.get(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          VtexIdclientAutCookie: `${this.context.storeUserAuthToken}`,
          'Proxy-Authorization': this.context.storeUserAuthToken,
          'X-Vtex-Proxy-To': endpoint,
          'X-Vtex-Use-Https': true,
          'Cache-Control': 'no-cache',
        },
      })

      return skuDetailsResponse
    } catch (error) {
      this.context.logger.error({
        message: 'Error fetching SKU details',
        skuId,
        error: error?.message,
      })

      return null
    }
  }
}
