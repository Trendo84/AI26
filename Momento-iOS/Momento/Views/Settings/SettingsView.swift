//
//  SettingsView.swift
//  Reminders, journey stats, and app info.
//

import SwiftUI

struct SettingsView: View {
    @EnvironmentObject private var store: JournalStore
    @AppStorage("hasOnboarded") private var hasOnboarded = false
    @AppStorage("reminderEnabled") private var reminderEnabled = false
    @AppStorage("reminderHour") private var reminderHour = 20
    @AppStorage("reminderMinute") private var reminderMinute = 0

    @State private var reminderTime = Date()

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 22) {
                Text("Settings")
                    .font(.system(size: 28, weight: .bold, design: .rounded))
                    .foregroundStyle(.white)
                    .padding(.top, 16)

                journeyCard

                section("Daily reminder") {
                    VStack(spacing: 0) {
                        Toggle(isOn: $reminderEnabled) {
                            Label("Remind me to capture", systemImage: "bell.fill")
                                .font(.system(size: 15, weight: .medium, design: .rounded))
                                .foregroundStyle(.white)
                        }
                        .tint(Theme.coral)
                        .padding(.vertical, 12)
                        .onChange(of: reminderEnabled) { _, enabled in
                            handleReminderToggle(enabled)
                        }

                        if reminderEnabled {
                            Divider().overlay(Color.white.opacity(0.06))
                            DatePicker("Time", selection: $reminderTime, displayedComponents: .hourAndMinute)
                                .font(.system(size: 15, weight: .medium, design: .rounded))
                                .foregroundStyle(.white)
                                .tint(Theme.coral)
                                .padding(.vertical, 6)
                                .onChange(of: reminderTime) { _, newValue in
                                    persistReminderTime(newValue)
                                }
                        }
                    }
                    .padding(.horizontal, 14)
                    .card(cornerRadius: 16)
                }

                section("General") {
                    VStack(spacing: 0) {
                        actionRow("Replay onboarding", icon: "sparkles") {
                            Haptics.tap()
                            withAnimation { hasOnboarded = false }
                        }
                        #if DEBUG
                        Divider().overlay(Color.white.opacity(0.06))
                        actionRow("Load sample memories", icon: "wand.and.stars") {
                            Haptics.tap()
                            store.seedSampleDataIfEmpty()
                        }
                        #endif
                    }
                    .padding(.horizontal, 14)
                    .card(cornerRadius: 16)
                }

                aboutCard
                Color.clear.frame(height: 100)
            }
            .padding(.horizontal, 20)
        }
        .scrollIndicators(.hidden)
        .onAppear(perform: syncReminderTime)
    }

    private var journeyCard: some View {
        HStack(spacing: 0) {
            stat("\(store.totalCount)", "Moments")
            divider
            stat("\(store.currentStreak)", "Streak")
            divider
            stat(memberSinceText, "Since")
        }
        .padding(.vertical, 18)
        .card()
    }

    private var divider: some View {
        Rectangle().fill(Color.white.opacity(0.08)).frame(width: 1, height: 40)
    }

    private func stat(_ value: String, _ label: String) -> some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.system(size: 22, weight: .bold, design: .rounded))
                .foregroundStyle(.white)
            Text(label)
                .font(.system(size: 12, weight: .medium, design: .rounded))
                .foregroundStyle(Theme.textSecondary)
        }
        .frame(maxWidth: .infinity)
    }

    private var memberSinceText: String {
        guard let earliest = store.chronologicalEntries.first?.day else { return "—" }
        return earliest.formatted("MMM yy")
    }

    private var aboutCard: some View {
        VStack(spacing: 10) {
            ApertureMark(openAmount: 1)
                .frame(width: 56, height: 56)
            Text("Momento")
                .font(.system(size: 18, weight: .bold, design: .rounded))
                .foregroundStyle(.white)
            Text("Version \(appVersion)")
                .font(.system(size: 13, weight: .medium, design: .rounded))
                .foregroundStyle(Theme.textSecondary)
            Text("One photo, every day. Made with ♥")
                .font(.system(size: 13, weight: .medium, design: .rounded))
                .foregroundStyle(Theme.textTertiary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 24)
        .card()
    }

    private var appVersion: String {
        let v = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "0.2"
        return v
    }

    private func section<Content: View>(_ title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(title)
                .font(.system(size: 14, weight: .semibold, design: .rounded))
                .foregroundStyle(Theme.textSecondary)
            content()
        }
    }

    private func actionRow(_ title: String, icon: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack {
                Label(title, systemImage: icon)
                    .font(.system(size: 15, weight: .medium, design: .rounded))
                    .foregroundStyle(.white)
                Spacer()
                Image(systemName: "chevron.right")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundStyle(Theme.textTertiary)
            }
            .padding(.vertical, 14)
        }
    }

    // MARK: Reminder logic

    private func syncReminderTime() {
        var components = DateComponents()
        components.hour = reminderHour
        components.minute = reminderMinute
        reminderTime = Calendar.current.date(from: components) ?? Date()
    }

    private func handleReminderToggle(_ enabled: Bool) {
        if enabled {
            Reminders.request { granted in
                if granted {
                    Reminders.schedule(hour: reminderHour, minute: reminderMinute)
                } else {
                    reminderEnabled = false
                }
            }
        } else {
            Reminders.cancel()
        }
    }

    private func persistReminderTime(_ date: Date) {
        let comps = Calendar.current.dateComponents([.hour, .minute], from: date)
        reminderHour = comps.hour ?? 20
        reminderMinute = comps.minute ?? 0
        if reminderEnabled {
            Reminders.schedule(hour: reminderHour, minute: reminderMinute)
        }
    }
}
