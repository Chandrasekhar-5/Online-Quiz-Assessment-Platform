import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { attemptService } from '../../services/attemptService';
import { quizService } from '../../services/quizService';

const Leaderboard = () => {
  const { quizId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(quizId || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuizzes();
  }, []);

  useEffect(() => {
    if (selectedQuiz) {
      loadLeaderboard();
    }
  }, [selectedQuiz]);

  const loadQuizzes = async () => {
    try {
      const data = await quizService.getAllQuizzes({ limit: 100 });
      setAllQuizzes(data.quizzes);
      if (!selectedQuiz && data.quizzes.length > 0) {
        setSelectedQuiz(data.quizzes[0]._id);
      }
    } catch (error) {
      console.error('Failed to load quizzes:', error);
    }
  };

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await attemptService.getLeaderboard(selectedQuiz, 20);
      setLeaderboard(data.leaderboard);
      setQuiz(data.quiz);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <span className="text-2xl">🏆</span>;
    if (rank === 2) return <span className="text-2xl">🥈</span>;
    if (rank === 3) return <span className="text-2xl">🥉</span>;
    return <span className="text-gray-500 font-bold w-6 text-center">{rank}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Leaderboard</h1>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Quiz</label>
          <select
            value={selectedQuiz}
            onChange={(e) => setSelectedQuiz(e.target.value)}
            className="input-field max-w-md"
          >
            {allQuizzes.map((q) => (
              <option key={q._id} value={q._id}>{q.title}</option>
            ))}
          </select>
        </div>

        {quiz && (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold text-gray-900">{quiz.title}</h2>
            <p className="text-gray-600 text-sm mt-1">Top performers on this quiz</p>
          </div>
        )}
      </div>

      {loading ? (
        <div className="card text-center py-12">
          <div className="text-gray-500">Loading leaderboard...</div>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">No attempts yet for this quiz.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboard.map((entry) => (
                  <tr key={entry.rank} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getRankIcon(entry.rank)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{entry.userName}</div>
                      <div className="text-sm text-gray-500">{entry.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">
                        {entry.score}/{entry.totalQuestions}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-green-500 text-lg">✓</span>
                        <span className="font-semibold text-gray-900">{Math.round(entry.percentage)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>⏱️</span>
                        <span>{Math.floor(entry.timeTaken / 60)}:{String(entry.timeTaken % 60).padStart(2, '0')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(entry.completedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;