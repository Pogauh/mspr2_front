import { render, screen } from '@testing-library/react';
import App from '../App';

test('affiche le titre principal', () => {
    render(<App />);
    const titre = screen.getByText(/faire une prédiction/i);
    expect(titre).toBeInTheDocument();
});
