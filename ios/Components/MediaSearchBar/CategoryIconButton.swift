//
//  CategoryIconButton.swift
//  KlipyiOS-demo
//
//  Created by Tornike Gomareli on 02.02.25.
//

import SwiftUI
import SDWebImage
import SDWebImageSwiftUI

struct CategoryIconButton: View {
  let category: MediaCategory
  let isSelected: Bool
  let action: () -> Void
  
  var body: some View {
    Button(action: action) {
      WebImage(url: URL(string: category.iconUrl))
        .resizable()
        .indicator(.activity)
        .transition(MediaSearchConfiguration.Animation.imageTransition)
        .scaledToFit()
        .frame(
          width: MediaSearchConfiguration.Layout.categoryIconSize,
          height: MediaSearchConfiguration.Layout.categoryIconSize
        )
        .padding(4)
        .background(
          RoundedRectangle(cornerRadius: 6)
            .fill(
              isSelected ?
                MediaSearchConfiguration.Colors.selectedIcon.opacity(0.4) :
                Color.clear
            )
        )
    }
    .frame(
      width: MediaSearchConfiguration.Layout.categoryIconSize + 12,
      height: MediaSearchConfiguration.Layout.categoryIconSize + 12
    )
  }
}
