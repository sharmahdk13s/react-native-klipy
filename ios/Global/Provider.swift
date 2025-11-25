//
//  Provider.swift
//  KlipyiOS-demo
//
//  Created by Tornike Gomareli on 12.01.25.
//

import Foundation

@objc public class KlipySettings: NSObject {
  @objc public static var apiKey: String?
}

extension NetworkingProvider {
  public static var liveValue: NetworkingProvider {
    return NetworkingProvider()
  }
}

extension RestApi {
  public static var liveValue: RestApi {
    // TODO: We need to crypt it and hide from public git
    let apiKey = KlipySettings.apiKey ?? ""
    let urlString = "https://api.klipy.co/api/v1/\(apiKey)"
    guard let url = URL(string: urlString) else {
      fatalError("Invalid Klipy API key. Call Klipy.initialize(apiKey:) from JS side.")
    }
    return RestApi(baseURL: url, provider: NetworkingProvider.liveValue)
  }
}
