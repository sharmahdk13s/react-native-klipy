//
//  Categories.swift
//  KlipyiOS-demo
//
//  Created by Tornike Gomareli on 13.01.25.
//

import Foundation

struct Categories: Codable {
    let result: Bool
    let data: CategoriesData
    
    struct CategoriesData: Codable {
        let locale: String
        let categories: [CategoryItem]
    }
    
    struct CategoryItem: Codable, Identifiable {
        var id: String { category } // For SwiftUI ForEach
        let category: String
        let query: String
        let previewUrl: String
        
        enum CodingKeys: String, CodingKey {
            case category, query
            case previewUrl = "preview_url"
        }
    }
}
