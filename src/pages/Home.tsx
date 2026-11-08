
import { useNavigate } from "react-router-dom";

const features = [
    {
        icon: "✨",
        title: "Image Enhancement",
        text: "Improve the quality and sharpness of your photos in one click.",
    },
    {
        icon: "🪄",
        title: "Background Removal",
        text: "Remove the background from any image and get a clean cutout.",
    },
];

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="page">
            <header className="header">
                <span className="logo">ImageEnhancer</span>
            </header>

            <main className="hero">
                <h1>Enhance images and remove backgrounds in seconds</h1>
                <p className="subtitle">
                    Upload a photo, pick what you need, and download the result. No sign-up required.
                </p>

                <button className="btn-primary" onClick={() => navigate("/process")}>
                    Go Ahead →
                </button>

                <section className="features">
                    {features.map((f) => (
                        <article key={f.title} className="card">
                            <span className="card-icon" aria-hidden="true">{f.icon}</span>
                            <h2>{f.title}</h2>
                            <p>{f.text}</p>
                        </article>
                    ))}
                </section>
            </main>

            <footer className="footer">© {new Date().getFullYear()} ImageEnhancer</footer>
        </div>
    );
}