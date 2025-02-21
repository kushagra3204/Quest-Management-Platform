import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import "../styles/quest-card.css"
import { createPortal } from "react-dom";

interface QuestProps {
    questId: string;
    title: string;
    description: string;
    gameName: string;
    companyName: string;
    reward: string;
    startDate: string;
    endDate?: string;
    videoUrl?: string;
    bannerImg?: string;
    logoMedia?: string;
}

interface LeaderboardEntry {
    userId: { _id: string; username: string };
    rank: number;
    completedAt: string;
}

const QuestCard: React.FC<QuestProps> = ({
    questId,
    title,
    description,
    gameName,
    companyName,
    reward,
    startDate,
    endDate,
    videoUrl,
    bannerImg,
    logoMedia,
}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [questCompleted, setQuestCompleted] = useState(false);
    const [questCompleteVideoEnable, setQuestCompleteVideoEnable] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const fetchCompletedStatus = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/quests/completed", {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) throw new Error("Failed to fetch completion status");

                const completedData = await response.json();
                console.log("Completed Quests Data:", completedData); // Debugging log

                if (!Array.isArray(completedData)) {
                    console.error("Expected an array but received:", completedData);
                    return;
                }

                const quest = completedData.find(q => q.questId._id === questId); // Check questId inside the response
                if (quest?.isCompleted) {
                    setQuestCompleted(true);
                }
            } catch (error) {
                console.error("Error fetching completed quests:", error);
            }
        };
        fetchCompletedStatus();
    }, [questId]);

    useEffect(() => {
        if (showLeaderboard) fetchLeaderboard();
    }, [showLeaderboard]);

    useEffect(() => {
        if (isModalOpen && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
        }

        const handleVisibilityChange = () => {
            if (videoRef.current) {
                document.hidden ? videoRef.current.pause() : videoRef.current.play();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [isModalOpen]);

    const fetchLeaderboard = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/quests/${questId}/leaderboard`);
            if (!response.ok) throw new Error("Failed to fetch leaderboard");
            setLeaderboard(await response.json());
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        }
    };

    const handleVideoEnd = async () => {
        if (questCompleted) return;
        setQuestCompleteVideoEnable(true);
    };

    const handleAcceptReward = async () => {
        setQuestCompleted(true)
        try {
            const response = await fetch("http://localhost:5000/api/quests/update-progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ questId })
            });
            if (!response.ok) throw new Error("Failed to update progress");
            console.log("Quest progress updated successfully");
        } catch (error) {
            console.error("Error updating quest progress:", error);
        }
        Swal.fire({
            title: "Congratulations! 🎉",
            text: "Your reward will be credited soon. Thanks for completing the quest!",
            icon: "success",
            confirmButtonText: "OK",
            timer: 3000,
            showClass: {
                popup: "animate__animated animate__fadeInDown",
            },
            hideClass: {
                popup: "animate__animated animate__fadeOutUp",
            },
        });
    };

    return (
        <div className="quest-card" onClick={() => setIsModalOpen(true)} >
            <div className="card-image">
                <img src={bannerImg} alt={gameName} />
                <div className="image-overlay"></div>
            </div>

            <div className="card-content">
                <div>{gameName}</div>
                <span className="promoter">Promoted by {companyName}</span>
                <h3 className="title">{title}</h3>
                <div className="reward-section">
                    <div className="reward-icon">
                        <video autoPlay style={{ borderRadius: "8px" }}>
                            <source src={logoMedia} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div className="reward-info">
                        <div className="reward-name">{reward}</div>
                        {questCompleted && <div className="claim-date">You claimed this reward</div>}
                        {description && <div className="description">{description}</div>}
                    </div>
                </div>
            </div>
            {isModalOpen && createPortal(
                <div
                    style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: "1000", cursor: "default", color: "#fff" }}
                    onClick={(e) => (e.target as HTMLElement).id === "modal-background" && setIsModalOpen(false)}
                    id="modal-background"
                >
                    <div
                        style={{ background: "#26282d", width: "500px", borderRadius: "10px", textAlign: "center" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>{title}</h3>

                        {!showLeaderboard ? (
                            videoUrl ? (
                                <video
                                    ref={videoRef}
                                    width="100%"
                                    onEnded={handleVideoEnd}
                                    autoPlay
                                    disablePictureInPicture
                                    controlsList="nodownload noplaybackrate"
                                >
                                    <source src={videoUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <p>No video available</p>
                            )
                        ) : (
                            <>
                                <h3>Leaderboard (Top 10)</h3>
                                <div style={{ textAlign: "left", padding: "30px 40px" }}>
                                    {leaderboard.length > 0 ? (
                                        leaderboard.map((entry) => (
                                            <li key={entry.userId._id} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }} >
                                                <span style={{ display: "flex", gap: "10px" }}><span><strong>#{entry.rank}</strong></span><span>{entry.userId.username}</span></span><span>Completed on {new Date(entry.completedAt).toLocaleDateString()}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <p>No leaderboard data available</p>
                                    )}
                                </div>
                            </>
                        )}

                        <div style={{ display: "flex", justifyContent: "space-around", padding: "20px" }}>
                            <button className="button secondary" onClick={() => setIsModalOpen(false)}>Close</button>
                            {!questCompleted && <button className="button secondary" style={{ cursor: `${!questCompleteVideoEnable ? 'not-allowed' : 'pointer'}` }} disabled={!questCompleteVideoEnable} onClick={() => handleAcceptReward()}>Accept Reward</button>}
                            <button className="button primary" onClick={() => setShowLeaderboard(!showLeaderboard)}>
                                {showLeaderboard ? "Back to Video" : "Leaderboard"}
                            </button>
                        </div>
                    </div>
                </div>
                , document.body)}
        </div>
    )
}

export default QuestCard