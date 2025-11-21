//
//  Provider.swift
//  KlipyiOS-demo
//
//  Created by Tornike Gomareli on 12.01.25.
//

import Foundation

extension NetworkingProvider {
  public static var liveValue: NetworkingProvider {
    return NetworkingProvider()
  }
}

extension RestApi {
  public static var liveValue: RestApi {
    // TODO: We need to crypt it and hide from public git
    let api_key = "vFIPtwjq9ed8pOMNnWBWKKHPhmRSiGriUJZF1dYWXNx8SP4LQYatCcUVNvaXscEs"
    return RestApi(baseURL: URL(string: "https://api.klipy.co/api/v1/\(api_key)")!, provider: NetworkingProvider.liveValue)
  }
}
