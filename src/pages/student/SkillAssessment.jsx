import { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle, XCircle, Clock, RefreshCw, ArrowRight } from 'lucide-react';
import { QUIZ_QUESTIONS, QUIZ_SKILLS } from '../../data/store';
import { useAppState } from '../../state/AppState';


export default function SkillAssessment({ onNavigate }) {
  const [phase, setPhase] = useState('select'); // select | quiz | result
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState(false);
  const [timer, setTimer] = useState(30);
  const [score, setScore] = useState(0);
  const { assessments, submitAssessment } = useAppState();
  const [changes, setChanges] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const questions = selectedCategory ? QUIZ_QUESTIONS[selectedCategory] : [];

  useEffect(() => {
    if (phase !== 'quiz' || revealed) return;
    if (timer <= 0) {
      handleNext();
      return;
    }
    const t = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timer, revealed]);

  function startQuiz(cat) {
    setSelectedCategory(cat);
    setCurrentQ(0);
    setAnswers({});
    setRevealed(false);
    setTimer(30);
    setScore(0);
    setPhase('quiz');
  }

  function handleAnswer(idx) {
    if (revealed) return;
    setAnswers(prev => ({ ...prev, [currentQ]: idx }));
    setRevealed(true);
  }

  function handleNext() {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
      setRevealed(false);
      setTimer(30);
    } else {
      finish();
    }
  }

  // Answers are graded on the server; the result updates the stored skill profile.
  async function finish() {
    setSubmitting(true);
    setSubmitError('');
    try {
      const answerList = questions.map((_, i) => answers[i] ?? null);
      const r = await submitAssessment(selectedCategory, answerList);
      setScore(r.assessment.score);
      setChanges(r.changes);
      setPhase('result');
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (phase === 'select') {
    return (
      <div className="animate-fade-in">
        <div className="page-hero">
          <h1 className="page-hero-title">Skill Assessment</h1>
          <p className="page-hero-subtitle">
            Take category-wise assessments to evaluate your skills. Results update your profile and improve job matching.
          </p>
        </div>

        <div className="grid-3">
          {[
            { key: 'Core CS', desc: 'Data Structures, Algorithms, OS, DBMS fundamentals', color: '#111111', difficulty: 'Medium', time: '~8 min' },
            { key: 'Python & ML', desc: 'Python programming, NumPy, Pandas, Machine Learning', color: '#10b981', difficulty: 'Medium', time: '~8 min' },
            { key: 'Web Development', desc: 'React, REST APIs, HTTP, JavaScript, CSS', color: '#f59e0b', difficulty: 'Easy-Medium', time: '~8 min' },
            { key: 'Soft Skills & Aptitude', desc: 'Communication, teamwork, leadership scenarios and quantitative aptitude', color: '#06b6d4', difficulty: 'Easy-Medium', time: '~6 min' },
          ].map(cat => (
            <div
              key={cat.key}
              className="card"
              onClick={() => startQuiz(cat.key)}
              style={{ cursor: 'pointer', textAlign: 'center', padding: 32, transition: 'all 0.3s' }}
            >
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{cat.key}</div>
              <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 12, lineHeight: 1.6 }}>{cat.desc}</div>
              <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 16 }}>
                Measures: {[...new Set(QUIZ_SKILLS[cat.key])].join(' · ')}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
                <span className="badge badge-primary">{cat.difficulty}</span>
                <span className="badge badge-gray"><Clock size={10} /> {cat.time}</span>
                <span className="badge badge-gray">{QUIZ_QUESTIONS[cat.key].length} Questions</span>
              </div>
              <button className="btn btn-sm" style={{ background: '#111111', color: 'white', width: '100%' }}>
                Start Assessment <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Completed */}
        <div style={{ marginTop: 32 }}>
          <div className="section-title" style={{ marginBottom: 16 }}>Completed Assessments</div>
          {assessments.length === 0 && (
            <div style={{ fontSize: 13, color: '#9ca3af' }}>
              None yet. Your profile currently uses self-declared skill levels; take an assessment to replace them with verified scores.
            </div>
          )}
          {assessments.map((a, i) => (
            <div key={i} className="gap-card" style={{ marginBottom: 8 }}>
              <CheckCircle size={18} color="#10b981" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{a.category}</div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>
                  Score: {a.score}% · {new Date(a.at).toLocaleString()} · {Object.entries(a.skillResults).map(([sk, v]) => `${sk} ${v}%`).join(', ')}
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => startQuiz(a.category)}><RefreshCw size={12} /> Retake</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    const passed = score >= 60;
    return (
      <div className="animate-fade-in" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
          {passed ? 'Great Job!' : 'Keep Practicing!'}
        </h2>
        <p style={{ color: '#9ca3af', marginBottom: 32 }}>{selectedCategory} Assessment Completed</p>

        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 24, padding: 40, marginBottom: 32
        }}>
          <div style={{
            fontSize: 80, fontWeight: 800, fontFamily: 'var(--font-display)',
            color: score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#f43f5e',
            lineHeight: 1
          }}>{score}%</div>
          <div style={{ fontSize: 16, color: '#6b7280', marginTop: 8 }}>
            {Object.values(answers).filter((a, i) => a === questions[i]?.correct).length}/{questions.length} Correct
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 24 }}>
            <div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work'}
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ textAlign: 'left', marginBottom: 32 }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>Skill profile updated</div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 14 }}>
            First verified result replaces a self-declared level; later results are averaged with your previous verified level.
          </div>
          {Object.entries(changes).map(([sk, c]) => {
            const delta = c.before == null ? null : c.after - c.before;
            return (
              <div key={sk} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: '1px solid #f3f4f6', fontSize: 14 }}>
                <span style={{ fontWeight: 600 }}>{sk}</span>
                <span style={{ color: '#6b7280' }}>
                  Test: {c.pct}% · Profile: {c.before == null ? 'new' : `${c.before}%`} → <strong style={{ color: '#111827' }}>{c.after}%</strong>
                  {delta != null && delta !== 0 && (
                    <strong style={{ marginLeft: 8, color: delta > 0 ? '#10b981' : '#f43f5e' }}>{delta > 0 ? '+' : ''}{delta}</strong>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-ghost" onClick={() => setPhase('select')}>← Back to Assessments</button>
          <button className="btn btn-ghost" onClick={() => onNavigate('internships')}>See Updated Matches</button>
          <button className="btn btn-primary" onClick={() => onNavigate('skill-gap')}>
            View Skill Gap <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];
  const selected = answers[currentQ];
  const timerPct = (timer / 30) * 100;

  return (
    <div className="quiz-container animate-fade-in">
      {/* Header */}
      <div className="quiz-header">
        <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 8 }}>
          {selectedCategory} · Question {currentQ + 1} of {questions.length}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {questions.map((_, i) => (
              <div key={i} style={{
                width: 24, height: 4, borderRadius: 2,
                background: i < currentQ
                  ? (answers[i] === questions[i].correct ? '#10b981' : '#f43f5e')
                  : i === currentQ ? '#111111' : 'rgba(255,255,255,0.1)'
              }} />
            ))}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: timer <= 10 ? '#f43f5e' : 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 600
          }}>
            <Clock size={14} />
            {timer}s
          </div>
        </div>

        {/* Timer bar */}
        <div className="timer-bar">
          <div className={`timer-fill ${timer <= 10 ? 'urgent' : ''}`} style={{ width: `${timerPct}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="quiz-question-card">
        <div className="quiz-question-text">{q.question}</div>

        {q.options.map((opt, i) => {
          let cls = 'quiz-option';
          if (revealed) {
            if (i === q.correct) cls += ' correct';
            else if (i === selected && i !== q.correct) cls += ' wrong';
          } else if (i === selected) {
            cls += ' selected';
          }
          return (
            <button key={i} className={cls} onClick={() => handleAnswer(i)}>
              <span className="option-letter">{String.fromCharCode(65 + i)}</span>
              <span>{opt}</span>
              {revealed && i === q.correct && <CheckCircle size={16} color="#10b981" style={{ marginLeft: 'auto' }} />}
              {revealed && i === selected && i !== q.correct && <XCircle size={16} color="#f43f5e" style={{ marginLeft: 'auto' }} />}
            </button>
          );
        })}

        {/* Explanation */}
        {revealed && (
          <div style={{
            marginTop: 16, padding: '12px 16px', borderRadius: 10,
            background: 'rgba(17,17,17,0.08)', border: '1px solid #111111',
            fontSize: 13, color: '#374151', lineHeight: 1.6
          }}>
            <strong>Explanation:</strong> {q.explanation}
          </div>
        )}
      </div>

      {submitError && <div className="auth-error" role="alert">{submitError}</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-ghost" onClick={() => setPhase('select')}>Exit</button>
        <button
          className={`btn ${revealed ? 'btn-primary' : 'btn-ghost'}`}
          onClick={handleNext}
          disabled={!revealed || submitting}
          style={{ opacity: revealed ? 1 : 0.4 }}
        >
          {currentQ < questions.length - 1 ? 'Next Question' : submitting ? 'Submitting…' : 'Finish'} <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
