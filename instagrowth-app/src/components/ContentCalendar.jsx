import { Calendar } from 'lucide-react';

function ContentCalendar() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Content Calendar</h1>
        <p className="text-gray-600">Plan and schedule your posts</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Calendar className="w-20 h-20 text-orange-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Coming Soon</h3>
        <p className="text-gray-600">Content calendar is under development</p>
      </div>
    </div>
  );
}

export default ContentCalendar;
