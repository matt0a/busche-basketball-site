import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DiningMenuBoard } from "./DiningMenuBoard";
import { publicApi } from "../api/publicApi";
import type { DiningMenuDto } from "../types";

vi.mock("../api/publicApi", () => ({
    publicApi: { getDiningMenus: vi.fn() },
}));

const getDiningMenus = vi.mocked(publicApi.getDiningMenus);

const menu = (over: Partial<DiningMenuDto> = {}): DiningMenuDto => ({
    id: 1,
    title: "Week Ending 9/20/26",
    imageUrl: "https://cdn.example.com/menus/weekly.jpg",
    displayOrder: 0,
    uploadedAt: "2026-09-20T12:00:00Z",
    ...over,
});

describe("DiningMenuBoard", () => {
    beforeEach(() => vi.resetAllMocks());

    it("renders nothing while the request is in flight", () => {
        getDiningMenus.mockReturnValue(new Promise(() => {}));

        const { container } = render(<DiningMenuBoard />);

        expect(container).toBeEmptyDOMElement();
    });

    it("renders nothing when no menu has been posted yet", async () => {
        getDiningMenus.mockResolvedValue([]);

        const { container } = render(<DiningMenuBoard />);

        await waitFor(() => expect(getDiningMenus).toHaveBeenCalled());
        expect(container).toBeEmptyDOMElement();
    });

    it("degrades to nothing when the backend is unavailable", async () => {
        getDiningMenus.mockRejectedValue(new Error("network down"));

        const { container } = render(<DiningMenuBoard />);

        await waitFor(() => expect(getDiningMenus).toHaveBeenCalled());
        await waitFor(() => expect(container).toBeEmptyDOMElement());
    });

    it("renders a posted menu with its title and a tap-through to the full image", async () => {
        getDiningMenus.mockResolvedValue([menu()]);

        render(<DiningMenuBoard />);

        expect(await screen.findByText("Week Ending 9/20/26")).toBeInTheDocument();

        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", "https://cdn.example.com/menus/weekly.jpg");
        expect(link).toHaveAttribute("target", "_blank");
        expect(link.getAttribute("rel")).toContain("noreferrer");
        expect(screen.getByText("View full size")).toBeInTheDocument();
    });

    it("uses the menu title as alt text so the graphic is not unlabelled", async () => {
        getDiningMenus.mockResolvedValue([menu()]);

        render(<DiningMenuBoard />);

        const img = await screen.findByAltText("Week Ending 9/20/26");
        expect(img).toHaveAttribute("src", "https://cdn.example.com/menus/weekly.jpg");
        expect(img).toHaveAttribute("loading", "lazy");
    });

    it("keeps menus in the order the API returned them", async () => {
        getDiningMenus.mockResolvedValue([
            menu(),
            menu({ id: 2, title: "Labor Day Cook-In", displayOrder: 1 }),
        ]);

        render(<DiningMenuBoard />);

        await screen.findByText("Week Ending 9/20/26");
        const titles = screen.getAllByRole("link").map((a) => a.querySelector("img")?.getAttribute("alt"));
        expect(titles).toEqual(["Week Ending 9/20/26", "Labor Day Cook-In"]);
    });

    it("never crops a menu graphic", async () => {
        getDiningMenus.mockResolvedValue([menu()]);

        render(<DiningMenuBoard />);

        const img = await screen.findByAltText("Week Ending 9/20/26");
        // object-contain + auto height is what keeps text-heavy menus readable.
        expect(img.className).toContain("object-contain");
        expect(img.className).toContain("h-auto");
        expect(img.className).not.toContain("object-cover");
    });

    it("fetches once on mount", async () => {
        getDiningMenus.mockResolvedValue([menu()]);

        render(<DiningMenuBoard />);

        await screen.findByText("Week Ending 9/20/26");
        expect(getDiningMenus).toHaveBeenCalledTimes(1);
    });
});
