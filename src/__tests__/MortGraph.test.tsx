import { render, screen, waitFor } from '@testing-library/react';
import PredictionChart from '../component/MortGraph';
import axios from 'axios';
import dayjs from 'dayjs';
import '@testing-library/jest-dom';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PredictionChart', () => {
    const baseDate = '2024-06-01';

    const fakeData = [
        { date_jour: dayjs(baseDate).subtract(1, 'day').format('YYYY-MM-DD'), nbr_morts: 5 },
        { date_jour: baseDate, nbr_morts: 8 },
        { date_jour: dayjs(baseDate).add(1, 'day').format('YYYY-MM-DD'), nbr_morts: 4 },
    ];


    beforeEach(() => {
        jest.clearAllMocks();
        mockedAxios.get.mockResolvedValue({ data: fakeData });
    });


    it('affiche le graphique avec les bonnes données', async () => {
        render(
            <PredictionChart
                date={baseDate}
                pays="FR"
                region="FR"
                prediction={12}
            />
        );

        expect(screen.getByText('Décès réels + prédiction')).toBeInTheDocument();

        await waitFor(() => {
            const canvas = screen.getByRole('img');
            expect(canvas).toBeInTheDocument();
        });
    });

    it('affiche une erreur en cas d’échec API', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('Erreur API'));

        render(
            <PredictionChart
                date={baseDate}
                pays="FR"
                region="FR"
                prediction={12}
            />
        );

        await waitFor(() => {
            expect(
                screen.getByText(/erreur lors de la récupération des données/i)
            ).toBeInTheDocument();
        });
    });

    it('transforme region "CH" en "Switzerland" dans l’appel API', async () => {
        render(
            <PredictionChart
                date={baseDate}
                pays="CH"
                region="CH"
                prediction={12}
            />
        );

        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalledWith(
                'http://127.0.0.1:8000/epidemiologie/date-range-region/',
                expect.objectContaining({
                    params: expect.objectContaining({ region: 'Switzerland' })
                })
            );
        });
    });

    it('transforme region "US" en "United States of America" dans l’appel API', async () => {
        render(
            <PredictionChart
                date={baseDate}
                pays="US"
                region="US"
                prediction={12}
            />
        );

        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalledWith(
                'http://127.0.0.1:8000/epidemiologie/date-range-region/',
                expect.objectContaining({
                    params: expect.objectContaining({ region: 'United States of America' })
                })
            );
        });
    });

    it('n’appelle pas l’API si prediction est null', async () => {
        render(
            <PredictionChart
                date={baseDate}
                pays="FR"
                region="FR"
                prediction={null as unknown as number}
            />
        );

        await waitFor(() => {
            expect(mockedAxios.get).not.toHaveBeenCalled();
        });
    });

    it('utilise 0 si nbr_morts est null', async () => {
        const dataWithNullDeath = [
            { date_jour: baseDate, nbr_morts: null }
        ];
        mockedAxios.get.mockResolvedValueOnce({ data: dataWithNullDeath });

        render(
            <PredictionChart
                date={baseDate}
                pays="FR"
                region="FR"
                prediction={5}
            />
        );

        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalled();
        });

        expect(await screen.findByRole('img')).toBeInTheDocument();
    });

});
