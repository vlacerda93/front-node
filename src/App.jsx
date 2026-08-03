import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [aluno, setAluno] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [nota, setNota] = useState('');

  const fetchNotas = async () => {
    try {
      const response = await fetch('/notas');
      if (!response.ok) throw new Error('Erro ao buscar notas');
      const data = await response.json();
      setNotas(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotas();
  }, []);

  const handleAddNota = async (e) => {
    e.preventDefault();
    if (!aluno || !disciplina || !nota) return;

    try {
      const response = await fetch('/notas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aluno,
          disciplina,
          nota: parseFloat(nota)
        })
      });

      if (response.ok) {
        setAluno('');
        setDisciplina('');
        setNota('');
        fetchNotas();
      }
    } catch (err) {
      console.error('Erro ao adicionar nota', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/notas/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchNotas();
      }
    } catch (err) {
      console.error('Erro ao remover nota', err);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Portal do Aluno</h1>
        <p>Gerenciamento de Notas e Disciplinas</p>
      </div>

      <div className="glass-panel">
        <form className="form-group" onSubmit={handleAddNota}>
          <input 
            type="text" 
            placeholder="Nome do Aluno" 
            value={aluno}
            onChange={(e) => setAluno(e.target.value)}
            required
          />
          <input 
            type="text" 
            placeholder="Disciplina" 
            value={disciplina}
            onChange={(e) => setDisciplina(e.target.value)}
            required
          />
          <input 
            type="number" 
            step="0.1"
            min="0"
            max="10"
            placeholder="Nota (0-10)" 
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            required
          />
          <button type="submit">Adicionar Nota</button>
        </form>

        {loading && <div className="loading">Carregando notas...</div>}
        {error && <div className="error">{error}</div>}

        {!loading && !error && (
          <div className="grid">
            {notas.map((n) => (
              <div key={n.id} className="card">
                <div className="card-header">
                  <div>
                    <div className="student-name">{n.aluno}</div>
                    <div className="subject">{n.disciplina}</div>
                  </div>
                  <button onClick={() => handleDelete(n.id)} className="danger">Excluir</button>
                </div>
                <div className={`grade ${parseFloat(n.nota) < 6 ? 'low' : ''}`}>
                  {parseFloat(n.nota).toFixed(1)}
                </div>
              </div>
            ))}
            {notas.length === 0 && (
              <div style={{gridColumn: '1 / -1', textAlign: 'center', color: '#94a3b8', padding: '2rem'}}>
                Nenhuma nota cadastrada.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
