async function loadRecommendations() {
    try {
        const response = await fetch("/data/manhwa.json");

        if (!response.ok) {
            throw new Error("Could not load manhwa.json");
        }

        const manhwas = await response.json();

        const otherManhwas = manhwas.filter(
            manga => manga.id !== window.mangaId
        );

        otherManhwas.sort(() => Math.random() - 0.5);

        const recommendations = otherManhwas.slice(0, 3);

        const grid = document.getElementById("recommendedGrid");

        grid.innerHTML = recommendations.map(manga => `
            <div class="card" onclick="location.href='${manga.link}'">
                <img src="${manga.cover}" alt="${manga.title}">
                <h3>${manga.title}</h3>
            </div>
        `).join("");

    } catch (error) {
        console.error("Recommendation error:", error);
    }
}

loadRecommendations();
