import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import PredictionForm from "../component/PredictionForm";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("PredictionForm", () => {
    it("affiche une erreur si des champs obligatoires sont manquants", () => {
        render(<PredictionForm />);
        fireEvent.click(screen.getByText(/prédire/i));
        expect(screen.getByText(/tous les champs sont obligatoires/i)).toBeInTheDocument();
    });

    it("affiche les champs mesures quand type = 'morts_hard'", () => {
        render(<PredictionForm />);
        fireEvent.change(screen.getByLabelText(/type/i), { target: { value: "morts_hard" } });
        expect(screen.getByLabelText(/fermeture des écoles/i)).toBeInTheDocument();
    });

    it("affiche le champ résultat après une prédiction réussie", async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: { prediction: 123.45 } });

        render(<PredictionForm />);

        fireEvent.change(screen.getByLabelText(/jour/i), { target: { value: "01" } });
        fireEvent.change(screen.getByLabelText(/mois/i), { target: { value: "01" } });
        fireEvent.change(screen.getByLabelText(/année/i), { target: { value: "2021" } });
        fireEvent.change(screen.getByLabelText(/^pays$/i), { target: { value: "FR" } });
        fireEvent.change(screen.getByLabelText(/hospitalisations/i), { target: { value: "100" } });
        fireEvent.change(screen.getByLabelText(/^cas$/i), { target: { value: "2000" } });
        fireEvent.change(screen.getByLabelText(/population pays/i), { target: { value: "67000000" } });

        fireEvent.click(screen.getByText(/prédire/i));

        const result = await screen.findByText(/résultat : 123.45/i);
        expect(result).toBeInTheDocument();
    });

    it("affiche une erreur serveur en cas d'échec API", async () => {
        mockedAxios.post.mockRejectedValueOnce({
            response: { data: { detail: "Erreur serveur" } },
        });

        render(<PredictionForm />);

        fireEvent.change(screen.getByLabelText(/jour/i), { target: { value: "01" } });
        fireEvent.change(screen.getByLabelText(/mois/i), { target: { value: "01" } });
        fireEvent.change(screen.getByLabelText(/année/i), { target: { value: "2021" } });
        fireEvent.change(screen.getByLabelText(/^pays$/i), { target: { value: "FR" } });
        fireEvent.change(screen.getByLabelText(/hospitalisations/i), {
            target: { value: "100" },
        });
        fireEvent.change(screen.getByLabelText(/^cas$/i), { target: { value: "2000" } });
        fireEvent.change(screen.getByLabelText(/population pays/i), {
            target: { value: "67000000" },
        });

        fireEvent.click(screen.getByText(/prédire/i));

        const errorMessage = await screen.findByText((text) =>
            text.toLowerCase().includes("erreur serveur")
        );
        expect(errorMessage).toBeInTheDocument();
    });

    it("envoie le bon payload et endpoint pour le type 'morts_hard'", async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: { prediction: 42 } });

        render(<PredictionForm />);

        fireEvent.change(screen.getByLabelText(/type/i), { target: { value: "morts_hard" } });

        await screen.findByLabelText(/confinement/i);

        fireEvent.change(screen.getByLabelText(/jour/i), { target: { value: "01" } });
        fireEvent.change(screen.getByLabelText(/mois/i), { target: { value: "01" } });
        fireEvent.change(screen.getByLabelText(/année/i), { target: { value: "2021" } });
        fireEvent.change(screen.getByLabelText(/^pays$/i), { target: { value: "FR" } });
        fireEvent.change(screen.getByLabelText(/hospitalisations/i), { target: { value: "100" } });
        fireEvent.change(screen.getByLabelText(/^cas$/i), { target: { value: "2000" } });
        fireEvent.change(screen.getByLabelText(/population pays/i), {target: { value: "67000000" },});
        fireEvent.change(screen.getByLabelText(/confinement/i), { target: { value: "2" } });
        fireEvent.click(screen.getByText(/prédire/i));

        await screen.findByText(/résultat/i);

        expect(mockedAxios.post).toHaveBeenCalledWith(
            "http://127.0.0.1:8000/predict_mort_hard",
            expect.objectContaining({
                nbr_hospitalises: 100,
                mesure_confinement: 2,
            })
        );
    });

    test("appelle onPredictionComplete avec les bonnes données", async () => {
        const mockCallback = jest.fn();
        mockedAxios.post.mockResolvedValue({
            data: { prediction: 456 },
        });

        render(<PredictionForm onPredictionComplete={mockCallback} />);

        fireEvent.change(screen.getByLabelText(/Jour/), { target: { value: "10" } });
        fireEvent.change(screen.getByLabelText(/Mois/), { target: { value: "06" } });
        fireEvent.change(screen.getByLabelText(/Année/), { target: { value: "2025" } });
        fireEvent.change(screen.getByLabelText(/Cas/), { target: { value: "1000" } });
        fireEvent.change(screen.getByLabelText(/Population pays/), { target: { value: "70000000" } });
        fireEvent.change(screen.getByLabelText(/Hospitalisations/), { target: { value: "100" } });
        fireEvent.change(screen.getByLabelText(/Pays/), { target: { value: "FR" } });

        fireEvent.click(screen.getByRole("button", { name: /Prédire/i }));

        await waitFor(() =>
            expect(mockCallback).toHaveBeenCalledWith({
                date: "2025-06-10",
                pays: "FR",
                region: "FR",
                cas: "1000",
                prediction: 456,
            })
        );
    });

    it("gère un tableau d'erreurs dans le champ detail", async () => {
        mockedAxios.post.mockRejectedValueOnce({
            response: {
                data: {
                    detail: [{ msg: "Erreur 1" }, { msg: "Erreur 2" }],
                },
            },
        });

        render(<PredictionForm />);

        fireEvent.change(screen.getByLabelText(/jour/i), { target: { value: "01" } });
        fireEvent.change(screen.getByLabelText(/mois/i), { target: { value: "01" } });
        fireEvent.change(screen.getByLabelText(/année/i), { target: { value: "2021" } });
        fireEvent.change(screen.getByLabelText(/^pays$/i), { target: { value: "FR" } });
        fireEvent.change(screen.getByLabelText(/hospitalisations/i), { target: { value: "100" } });
        fireEvent.change(screen.getByLabelText(/^cas$/i), { target: { value: "2000" } });
        fireEvent.change(screen.getByLabelText(/population pays/i), { target: { value: "67000000" } });

        fireEvent.click(screen.getByText(/prédire/i));

        expect(await screen.findByText("Erreur 1")).toBeInTheDocument();
        expect(await screen.findByText("Erreur 2")).toBeInTheDocument();

    });

    it("gère une chaîne d'erreur simple dans detail", async () => {
        mockedAxios.post.mockRejectedValueOnce({
            response: {
                data: {
                    detail: "Erreur simple",
                },
            },
        });

        render(<PredictionForm />);

        fireEvent.change(screen.getByLabelText(/jour/i), { target: { value: "01" } });
        fireEvent.change(screen.getByLabelText(/mois/i), { target: { value: "01" } });
        fireEvent.change(screen.getByLabelText(/année/i), { target: { value: "2021" } });
        fireEvent.change(screen.getByLabelText(/^pays$/i), { target: { value: "FR" } });
        fireEvent.change(screen.getByLabelText(/hospitalisations/i), { target: { value: "100" } });
        fireEvent.change(screen.getByLabelText(/^cas$/i), { target: { value: "2000" } });
        fireEvent.change(screen.getByLabelText(/population pays/i), { target: { value: "67000000" } });

        fireEvent.click(screen.getByText(/prédire/i));

        await waitFor(() => {
            expect(screen.getByText("Erreur simple")).toBeInTheDocument();
        });
    });

    it("gère une erreur inconnue avec message par défaut", async () => {
        mockedAxios.post.mockRejectedValueOnce({});

        render(<PredictionForm />);

        fireEvent.change(screen.getByLabelText(/jour/i), { target: { value: "01" } });
        fireEvent.change(screen.getByLabelText(/mois/i), { target: { value: "01" } });
        fireEvent.change(screen.getByLabelText(/année/i), { target: { value: "2021" } });
        fireEvent.change(screen.getByLabelText(/^pays$/i), { target: { value: "FR" } });
        fireEvent.change(screen.getByLabelText(/hospitalisations/i), { target: { value: "100" } });
        fireEvent.change(screen.getByLabelText(/^cas$/i), { target: { value: "2000" } });
        fireEvent.change(screen.getByLabelText(/population pays/i), { target: { value: "67000000" } });

        fireEvent.click(screen.getByText(/prédire/i));

        await waitFor(() => {
            expect(screen.getByText("Erreur lors de la prédiction")).toBeInTheDocument();
        });
    });
});
