import React, { useEffect, useState } from "react";
import QuestCard from "../components/QuestCard"
import "../styles/quest-list.css"
import { useNavigate } from "react-router-dom";

interface Quest {
    _id: string;
    title: string;
    description: string;
    gameName: string;
    companyName: string;
    reward: { type: string; value: string };
    startDate: string;
    endDate?: string;
    challenge: { videoDetails?: { url?: string } };
    bannerImage?: string;
    logoMedia?: string;
}

const QuestList: React.FC = () => {

    const [quests, setQuests] = useState<Quest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuests = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/quests/active", {
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });
                if (!response.ok) throw new Error("Failed to fetch quests");

                const data = await response.json();
                console.log(data)
                setQuests(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuests();
    }, []);

    if (loading) return <p>Loading quests...</p>;
    if (error) return <p>Error: {error}</p>;
    if (quests.length === 0) return <p>No active quests available.</p>;


    return (
        <div className="app">
            <div className="hero">
                <div className="hero-content">
                    <h1>
                        PARTICIPATE, WATCH,
                        <br />
                        EARN REWARDS
                    </h1>
                    <p>Win in-game items, Discord avatar decorations, and more through Quests.</p>
                    <button className="learn-more" onClick={() => { navigate("/") }}>
                        Dashboard <span>→</span>
                    </button>
                </div>
            </div>
            <div className="quests-section">
                <div className="tabs">
                    <button className={`tab active`}>
                        All Quests
                    </button>
                </div>
                <div className="quests-grid">
                    {quests.map((quest) => (
                        <QuestCard
                            key={quest._id}
                            questId={quest._id}
                            title={quest.title}
                            description={quest.description}
                            gameName={quest.gameName}
                            companyName={quest.companyName}
                            reward={`${quest.reward.value} (${quest.reward.type})`}
                            startDate={quest.startDate}
                            endDate={quest.endDate}
                            videoUrl={quest.challenge.videoDetails?.url}
                            bannerImg={quest.bannerImage}
                            logoMedia={quest.logoMedia}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default QuestList