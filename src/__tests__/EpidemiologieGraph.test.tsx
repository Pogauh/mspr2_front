import { render, screen, fireEvent } from '@testing-library/react';
import EpidemiologieGraph from '../component/EpidemiologieGraph';

beforeAll(() => {
    global.ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
});


const mockData = [
    {
        date_jour: '2024-01-01',
        nbr_cas: 100,
        nbr_morts: 10,
        morts_cumule: 10,
        nbr_hospitalises: 5,
    },
    {
        date_jour: '2024-01-02',
        nbr_cas: 120,
        nbr_morts: 15,
        morts_cumule: 25,
        nbr_hospitalises: 8,
    },
];

describe('EpidemiologieGraph', () => {
    it('ne rend rien si les données sont vides', () => {
        render(<EpidemiologieGraph data={[]} />);
        expect(screen.queryByText(/évolution des indicateurs/i)).not.toBeInTheDocument();
    });

    test("affiche le titre et les options de filtre", () => {
        render(<EpidemiologieGraph data={mockData} />);

        expect(screen.getByText(/évolution des indicateurs/i)).toBeInTheDocument();

        expect(screen.getByLabelText("Cas")).toBeInTheDocument();
        expect(screen.getByLabelText("Morts")).toBeInTheDocument();
        expect(screen.getByLabelText("Morts Cumulé")).toBeInTheDocument();
        expect(screen.getByLabelText("Hospitalisations")).toBeInTheDocument();
    });

    it('permet de masquer les courbes en décochant les cases', () => {
        render(<EpidemiologieGraph data={mockData} />);

        const checkboxCas = screen.getByLabelText(/cas/i);
        fireEvent.click(checkboxCas);
        expect(checkboxCas).not.toBeChecked();

        const checkboxMorts = screen.getByLabelText(/morts$/i); // regex pour éviter "morts cumulé"
        fireEvent.click(checkboxMorts);
        expect(checkboxMorts).not.toBeChecked();

        const checkboxHosp = screen.getByLabelText(/hospitalisations/i);
        fireEvent.click(checkboxHosp);
        expect(checkboxHosp).not.toBeChecked();
    });

    test("la case 'Morts Cumulé' est cochée par défaut et peut être décochée", () => {
        render(<EpidemiologieGraph data={mockData} />);

        const checkbox = screen.getByLabelText("Morts Cumulé");

        expect(checkbox).toBeChecked();

        fireEvent.click(checkbox);

        expect(checkbox).not.toBeChecked();
    });

});
