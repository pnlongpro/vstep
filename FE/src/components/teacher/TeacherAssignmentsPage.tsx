import { useState } from 'react';
import { AssignmentManager } from './AssignmentManager';
import { AssignmentCreatorNew } from './AssignmentCreatorNew';
import { AssignmentDetailView } from './AssignmentDetailView';
import { AssignmentByClassPage } from './AssignmentByClassPage';
import { Users, ListChecks } from 'lucide-react';

type View = 'list' | 'create' | 'detail' | 'by-class';

export function TeacherAssignmentsPage() {
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);

  const handleViewDetail = (assignmentId: number) => {
    setSelectedAssignmentId(assignmentId);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedAssignmentId(null);
  };

  // Main navigation tabs
  if (currentView === 'list' || currentView === 'by-class') {
    return (
      <div className="min-h-screen">
        {/* Tab Navigation */}
        <div className="bg-white border-b sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8">
              <button
                onClick={() => setCurrentView('list')}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                  currentView === 'list'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <ListChecks className="size-5" />
                <span>Tất cả bài tập</span>
              </button>
              <button
                onClick={() => setCurrentView('by-class')}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                  currentView === 'by-class'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="size-5" />
                <span>Theo lớp học</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        {currentView === 'list' && (
          <AssignmentManager 
            onBack={handleBackToList}
            onCreateNew={() => setCurrentView('create')}
            onViewDetail={handleViewDetail}
          />
        )}
        
        {currentView === 'by-class' && (
          <AssignmentByClassPage 
            onBack={handleBackToList}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {currentView === 'create' && (
        <AssignmentCreatorNew 
          onBack={() => setCurrentView('list')}
        />
      )}
      
      {currentView === 'detail' && selectedAssignmentId && (
        <AssignmentDetailView 
          assignmentId={selectedAssignmentId}
          onBack={handleBackToList}
        />
      )}
    </div>
  );
}