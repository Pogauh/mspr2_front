import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EpidemiologieTable, { DataRow } from "../component/epidemiologieTable";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("EpidemiologieTable", () => {
    const mockData: DataRow[] = [
        {
            date_jour: "2024-01-01",
            region: "France",
            population: 67000000,
            nbr_cas: 1000,
            nbr_morts: 10,
            morts_cumule: 10000,
            nbr_hospitalises: 200,
            contamination_cumule: 500000,
        },
    ];

    it("affiche un message si aucune date n'est sélectionnée", () => {
        window.alert = jest.fn();
        render(<EpidemiologieTable onDataLoaded={() => {}} />);
        fireEvent.click(screen.getByText(/rechercher/i));
        expect(window.alert).toHaveBeenCalledWith("Veuillez choisir une plage de dates.");
    });

    it("affiche les données après un appel API réussi", async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockData });
        const onDataLoadedMock = jest.fn();

        render(<EpidemiologieTable onDataLoaded={onDataLoadedMock} />);

        fireEvent.change(screen.getByLabelText(/date de début/i), {
            target: { value: "2024-01-01" },
        });
        fireEvent.change(screen.getByLabelText(/date de fin/i), {
            target: { value: "2024-01-31" },
        });
        fireEvent.change(screen.getByLabelText(/pays \/ région/i), {
            target: { value: "France" },
        });

        fireEvent.click(screen.getByText(/rechercher/i));

        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalledWith(
                "http://127.0.0.1:8000/epidemiologie/date-range-region/",
                {
                    params: {
                        start: "2024-01-01",
                        end: "2024-01-31",
                        region: "France",
                    },
                }
            );
        });

        expect(await screen.findByText("France")).toBeInTheDocument();
        expect(screen.getByText("1000")).toBeInTheDocument();
        expect(onDataLoadedMock).toHaveBeenCalledWith(mockData);
    });

    it("affiche 'Chargement...' pendant le chargement", async () => {
        mockedAxios.get.mockImplementation(
            () => new Promise((resolve) => setTimeout(() => resolve({ data: mockData }), 500))
        );

        render(<EpidemiologieTable onDataLoaded={() => {}} />);
        fireEvent.change(screen.getByLabelText(/date de début/i), {
            target: { value: "2024-01-01" },
        });
        fireEvent.change(screen.getByLabelText(/date de fin/i), {
            target: { value: "2024-01-31" },
        });

        fireEvent.click(screen.getByText(/rechercher/i));

        expect(await screen.findByText(/chargement/i)).toBeInTheDocument();
    });

    it("affiche un message s'il n'y a pas de données", async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: [] });

        render(<EpidemiologieTable onDataLoaded={() => {}} />);
        fireEvent.change(screen.getByLabelText(/date de début/i), {
            target: { value: "2024-01-01" },
        });
        fireEvent.change(screen.getByLabelText(/date de fin/i), {
            target: { value: "2024-01-31" },
        });

        fireEvent.click(screen.getByText(/rechercher/i));

        expect(await screen.findByText(/aucune donnée trouvée/i)).toBeInTheDocument();
    });

    it("gère une erreur API sans crasher", async () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        mockedAxios.get.mockRejectedValueOnce(new Error("API down"));

        render(<EpidemiologieTable onDataLoaded={() => {}} />);
        fireEvent.change(screen.getByLabelText(/date de début/i), {
            target: { value: "2024-01-01" },
        });
        fireEvent.change(screen.getByLabelText(/date de fin/i), {
            target: { value: "2024-01-31" },
        });

        fireEvent.click(screen.getByText(/rechercher/i));

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith("Erreur API", expect.any(Error));
        });

        expect(screen.getByText(/aucune donnée trouvée/i)).toBeInTheDocument();
        consoleSpy.mockRestore();
    });
});
