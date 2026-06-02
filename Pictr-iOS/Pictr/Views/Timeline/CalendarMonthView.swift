//
//  CalendarMonthView.swift
//  A month grid where captured days show their photo.
//

import SwiftUI

struct CalendarMonthView: View {
    @EnvironmentObject private var store: JournalStore
    var onSelect: (JournalEntry) -> Void

    @State private var monthAnchor: Date = Date()
    private let calendar = Calendar.current
    private let columns = Array(repeating: GridItem(.flexible(), spacing: 8), count: 7)

    var body: some View {
        VStack(spacing: 16) {
            monthHeader

            HStack {
                ForEach(weekdaySymbols, id: \.self) { symbol in
                    Text(symbol)
                        .font(.system(size: 11, weight: .semibold, design: .rounded))
                        .foregroundStyle(Theme.textTertiary)
                        .frame(maxWidth: .infinity)
                }
            }

            LazyVGrid(columns: columns, spacing: 8) {
                ForEach(Array(daysInMonth.enumerated()), id: \.offset) { _, date in
                    if let date {
                        dayCell(date)
                    } else {
                        Color.clear.frame(height: 46)
                    }
                }
            }
        }
        .padding(.horizontal, 20)
    }

    private var monthHeader: some View {
        HStack {
            Button { changeMonth(-1) } label: {
                Image(systemName: "chevron.left")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundStyle(.white)
                    .frame(width: 40, height: 40)
                    .background(Circle().fill(Theme.surface))
            }
            Spacer()
            Text(monthAnchor.formatted("MMMM yyyy"))
                .font(.system(size: 18, weight: .bold, design: .rounded))
                .foregroundStyle(.white)
            Spacer()
            Button { changeMonth(1) } label: {
                Image(systemName: "chevron.right")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundStyle(.white)
                    .frame(width: 40, height: 40)
                    .background(Circle().fill(Theme.surface))
            }
            .disabled(isCurrentMonth)
            .opacity(isCurrentMonth ? 0.4 : 1)
        }
    }

    @ViewBuilder
    private func dayCell(_ date: Date) -> some View {
        let entry = store.entry(on: date)
        let isToday = calendar.isDateInToday(date)
        Button {
            if let entry { onSelect(entry) }
        } label: {
            ZStack {
                if let entry, let image = store.image(for: entry) {
                    Image(uiImage: image)
                        .resizable()
                        .scaledToFill()
                        .frame(height: 46)
                        .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
                        .overlay(
                            RoundedRectangle(cornerRadius: 10, style: .continuous)
                                .stroke(isToday ? Theme.coral : .clear, lineWidth: 2)
                        )
                } else {
                    RoundedRectangle(cornerRadius: 10, style: .continuous)
                        .fill(Theme.surface)
                        .frame(height: 46)
                        .overlay(
                            Text(date.dayNumber)
                                .font(.system(size: 13, weight: .semibold, design: .rounded))
                                .foregroundStyle(isToday ? Theme.coral : Theme.textTertiary)
                        )
                        .overlay(
                            RoundedRectangle(cornerRadius: 10, style: .continuous)
                                .stroke(isToday ? Theme.coral.opacity(0.6) : .clear, lineWidth: 1.5)
                        )
                }
            }
        }
        .disabled(entry == nil)
    }

    // MARK: Helpers

    private var weekdaySymbols: [String] {
        let symbols = calendar.shortWeekdaySymbols
        let first = calendar.firstWeekday - 1
        return Array(symbols[first...] + symbols[..<first])
    }

    private var isCurrentMonth: Bool {
        calendar.isDate(monthAnchor, equalTo: Date(), toGranularity: .month)
    }

    private var daysInMonth: [Date?] {
        guard let monthInterval = calendar.dateInterval(of: .month, for: monthAnchor),
              let range = calendar.range(of: .day, in: .month, for: monthAnchor) else { return [] }
        let firstDay = monthInterval.start
        let weekday = calendar.component(.weekday, from: firstDay)
        let leadingBlanks = (weekday - calendar.firstWeekday + 7) % 7

        var cells: [Date?] = Array(repeating: nil, count: leadingBlanks)
        for day in range {
            if let date = calendar.date(byAdding: .day, value: day - 1, to: firstDay) {
                cells.append(date)
            }
        }
        return cells
    }

    private func changeMonth(_ delta: Int) {
        Haptics.selection()
        if let newDate = calendar.date(byAdding: .month, value: delta, to: monthAnchor) {
            withAnimation(.easeInOut(duration: 0.2)) { monthAnchor = newDate }
        }
    }
}
