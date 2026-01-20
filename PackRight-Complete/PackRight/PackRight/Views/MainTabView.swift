//
//  MainTabView.swift
//  PackRight
//
//  Created by Ivan on 2026-01-20.
//

import SwiftUI

struct MainTabView: View {
    @EnvironmentObject var viewModel: BoxViewModel
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tabItem {
                    Image(systemName: "house.fill")
                    Text("Home")
                }
                .tag(0)
            
            CameraScanView()
                .tabItem {
                    Image(systemName: "camera.fill")
                    Text("Scan")
                }
                .tag(1)
            
            SearchView()
                .tabItem {
                    Image(systemName: "magnifyingglass")
                    Text("Search")
                }
                .tag(2)
        }
        .accentColor(Color("AccentColor"))
    }
}

#Preview {
    MainTabView()
        .environmentObject(BoxViewModel())
}
