import React, { useState } from "react";
import "../styles/admin-quest.css";
import { useNavigate } from "react-router-dom";

const CreateQuest: React.FC = () => {
  const [quest, setQuest] = useState({
    gameName: "",
    companyName: "",
    title: "",
    description: "",
    challengeType: "video",
    videoUrl: "",
    videoDuration: "",
    requiresFileUpload: false,
    completionCheckbox: true,
    rewardType: "coins",
    rewardValue: "",
    startDate: "",
    endDate: "",
    bannerImage: "",
    logoMedia: "",
  });
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setQuest((prev) => {
      let updatedQuest = { ...prev, [name]: newValue };
      if (name === "challengeType") {
        updatedQuest.requiresFileUpload = value === "proofSubmission";
      }
      return updatedQuest;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/quests/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(quest),
      });

      const data = await response.json();
      if (data.success) {
        alert("Quest Created Successfully!");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error submitting quest:", error);
      alert("Failed to create quest.");
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Create a New Quest</h1>
        <p>Set up your gaming challenge and rewards</p>
      </div>

      <form onSubmit={handleSubmit} className="quest-form">
        <div className="form-grid">
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="input-group">
              <input
                name="gameName"
                value={quest.gameName}
                onChange={handleChange}
                placeholder="Game Name"
                required
              />
              <input
                name="companyName"
                value={quest.companyName}
                onChange={handleChange}
                placeholder="Promoter Name"
                required
              />
            </div>
            <div className="input-group">
              <input
                name="title"
                value={quest.title}
                onChange={handleChange}
                placeholder="Quest Title"
                required
                className="full-width"
              />
            </div>
            <div className="input-group">
              <textarea
                name="description"
                value={quest.description}
                onChange={handleChange}
                placeholder="Quest Description"
                required
                className="full-width"
                style={{ resize: "none" }}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Challenge Details</h3>
            <div className="select-group">
              <label>Challenge Type</label>
              <select
                name="challengeType"
                value={quest.challengeType}
                onChange={handleChange}
              >
                <option value="video">Video</option>
                <option value="proofSubmission">Proof Submission</option>
              </select>
            </div>

            {quest.challengeType === "video" && (
              <div className="input-group">
                <input
                  name="videoUrl"
                  value={quest.videoUrl}
                  onChange={handleChange}
                  placeholder="Video URL"
                />
                <input
                  name="videoDuration"
                  value={quest.videoDuration}
                  onChange={handleChange}
                  placeholder="Duration (seconds)"
                  type="number"
                  className=""
                />
              </div>
            )}

            {quest.challengeType === "proofSubmission" && (
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="requiresFileUpload"
                    checked={quest.requiresFileUpload}
                    disabled
                  />
                  <span>Requires File Upload</span>
                </label>
              </div>
            )}
          </div>

          <div className="form-section">
            <h3>Reward Configuration</h3>
            <div className="select-group">
              <label>Reward Type</label>
              <select
                name="rewardType"
                value={quest.rewardType}
                onChange={handleChange}
              >
                <option value="coins">Coins</option>
                <option value="badge">Badge</option>
                <option value="gameCode">Game Code</option>
                <option value="avatar">Avatar</option>
              </select>
            </div>
            <div className="input-group">
              <input
                name="rewardValue"
                value={quest.rewardValue}
                onChange={handleChange}
                placeholder={`Reward Value (${quest.rewardType})`}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Schedule & Media</h3>
            <div className="date-group">
              <div className="input-group">
                <label>Start Date</label>
                <div className="input-group">
                  <input
                    name="startDate"
                    value={quest.startDate}
                    onChange={handleChange}
                    type="date"
                    required
                  />
                </div>
              </div>
              <div className="input-group">
                <label>End Date</label>
                <input
                  name="endDate"
                  value={quest.endDate}
                  onChange={handleChange}
                  type="date"
                />
              </div>
            </div>
            <input
              name="bannerImage"
              value={quest.bannerImage}
              onChange={handleChange}
              placeholder="Banner Image URL"
              required
              className="full-width"
            />
            <input
              name="logoMedia"
              value={quest.logoMedia}
              onChange={handleChange}
              placeholder="Logo Media URL"
              className="full-width"
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
          <button type="submit" className="submit-button">
            Create Quest
          </button>
          <button className="action-button secondary" onClick={() => navigate("/")}>
            Back to Dashboard
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuest;